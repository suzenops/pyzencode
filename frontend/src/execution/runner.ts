import type { ExecutionResult, RuntimeStatus, WorkerMessage } from "./types";
export interface WorkerPort {
  onmessage: ((event: MessageEvent<WorkerMessage>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  postMessage(value: unknown): void;
  terminate(): void;
}
export class PythonRunner {
  private active?: { worker: WorkerPort; cancel: () => void };
  constructor(
    private factory: () => WorkerPort,
    private baseUrl: string,
    private executionMs = 3000,
    private startupMs = 45000,
  ) {}
  run(
    code: string,
    status: (value: RuntimeStatus) => void = () => {},
  ): Promise<ExecutionResult> {
    this.cancel();
    if (code.length > 20000)
      return Promise.resolve(
        this.failure(
          "CodeLimitError",
          "Keep your program under 20,000 characters.",
        ),
      );
    return new Promise((resolve) => {
      let worker: WorkerPort;
      try {
        worker = this.factory();
      } catch {
        resolve(
          this.failure(
            "RuntimeUnavailable",
            "Your browser could not start a Python worker. Try a current browser.",
          ),
        );
        return;
      }
      let settled = false;
      let timer: ReturnType<typeof setTimeout>;
      const finish = (result: ExecutionResult) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        worker.terminate();
        this.active = undefined;
        status("idle");
        resolve(result);
      };
      const fail = (type: string, message: string) =>
        finish(this.failure(type, message));
      this.active = {
        worker,
        cancel: () =>
          fail("Cancelled", "Execution stopped. You can edit and run again."),
      };
      status("loading");
      timer = setTimeout(
        () =>
          fail(
            "InitializationError",
            "Python could not load within 45 seconds. Check the connection and retry.",
          ),
        this.startupMs,
      );
      worker.onerror = () =>
        fail(
          "RuntimeUnavailable",
          "The Python worker stopped unexpectedly. Retry to start a fresh interpreter.",
        );
      worker.onmessage = (event) => {
        const message = event.data;
        if (message.type === "ready") {
          clearTimeout(timer);
          status("running");
          timer = setTimeout(
            () =>
              fail(
                "TimeoutError",
                "Your code ran for more than 3 seconds and was stopped. Check for an endless loop, then retry.",
              ),
            this.executionMs,
          );
          worker.postMessage({ type: "run", code });
        } else if (message.type === "init-error") {
          fail(
            "InitializationError",
            "Python assets could not load. Check your connection or build setup, then retry.",
          );
        } else if (message.type === "result") finish(message.result);
      };
      worker.postMessage({ type: "init", baseUrl: this.baseUrl });
    });
  }
  cancel() {
    this.active?.cancel();
  }
  private failure(type: string, message: string): ExecutionResult {
    return {
      stdout: "",
      stderr: "",
      prints: [],
      error: { type, message, traceback: "" },
      duration: 0,
    };
  }
}
export function createBrowserRunner() {
  const base = new URL(import.meta.env.BASE_URL, window.location.origin);
  return new PythonRunner(
    () => new Worker(new URL("python-worker.js", base)),
    new URL("python/", base).href,
  );
}
