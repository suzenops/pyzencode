import { afterEach, describe, it, expect, vi } from "vitest";
import { PythonRunner, type WorkerPort } from "../src/execution/runner";
import type { WorkerMessage } from "../src/execution/types";
class FakeWorker implements WorkerPort {
  onmessage: ((e: MessageEvent<WorkerMessage>) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;
  postMessage = vi.fn();
  terminate = vi.fn();
  emit(data: WorkerMessage) {
    this.onmessage?.({ data } as MessageEvent<WorkerMessage>);
  }
}
afterEach(() => vi.useRealTimers());
describe("worker lifecycle", () => {
  it("starts an execution deadline only after initialization", async () => {
    vi.useFakeTimers();
    const w = new FakeWorker();
    const runner = new PythonRunner(() => w, "/python/", 3000, 45000);
    const status = vi.fn();
    const pending = runner.run("print(1)", status);
    vi.advanceTimersByTime(10000);
    expect(w.terminate).not.toHaveBeenCalled();
    w.emit({ type: "ready" });
    expect(w.postMessage).toHaveBeenLastCalledWith({
      type: "run",
      code: "print(1)",
    });
    vi.advanceTimersByTime(3000);
    expect((await pending).error?.type).toBe("TimeoutError");
    expect(w.terminate).toHaveBeenCalledOnce();
    expect(status).toHaveBeenLastCalledWith("idle");
  });
  it("returns real worker results and terminates the worker", async () => {
    const w = new FakeWorker();
    const runner = new PythonRunner(() => w, "/");
    const pending = runner.run("print(1)");
    w.emit({ type: "ready" });
    w.emit({
      type: "result",
      result: { stdout: "1\n", stderr: "", prints: [], duration: 4 },
    });
    expect((await pending).stdout).toBe("1\n");
    expect(w.terminate).toHaveBeenCalled();
  });
  it("reports initialization failure and supports a fresh retry", async () => {
    const a = new FakeWorker(),
      b = new FakeWorker();
    let n = 0;
    const runner = new PythonRunner(() => (n++ ? b : a), "/");
    const first = runner.run("x");
    a.emit({ type: "init-error", message: "network" });
    expect((await first).error?.type).toBe("InitializationError");
    const second = runner.run("print(1)");
    b.emit({ type: "ready" });
    b.emit({
      type: "result",
      result: { stdout: "1", stderr: "", prints: [], duration: 0 },
    });
    expect((await second).error).toBeUndefined();
  });
  it("cancels active work on navigation/disposal", async () => {
    const w = new FakeWorker();
    const runner = new PythonRunner(() => w, "/");
    const result = runner.run("x");
    runner.cancel();
    expect((await result).error?.type).toBe("Cancelled");
    expect(w.terminate).toHaveBeenCalledOnce();
  });
  it("stops stalled initialization", async () => {
    vi.useFakeTimers();
    const w = new FakeWorker();
    const pending = new PythonRunner(() => w, "/", 3000, 45000).run("x");
    vi.advanceTimersByTime(45000);
    expect((await pending).error?.type).toBe("InitializationError");
  });
});
