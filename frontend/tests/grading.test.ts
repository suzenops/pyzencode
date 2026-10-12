import { describe, it, expect } from "vitest";
import { grade } from "../src/execution/grading";
import { exercises } from "../src/content/exercises";
import type { ExecutionResult } from "../src/execution/types";
const result = (
  stdout: string,
  prints: ExecutionResult["prints"] = [],
): ExecutionResult => ({ stdout, stderr: "", prints, duration: 1 });
describe("runtime-based grading", () => {
  it("accepts output without inspecting source text", () =>
    expect(grade(exercises[0], result("Hello, World!\n")).passed).toBe(true));
  it("rejects wrong spelling, extra lines, and execution failures", () => {
    expect(grade(exercises[0], result("hello, world!\n")).passed).toBe(false);
    expect(grade(exercises[0], result("Hello, World!\n\n")).passed).toBe(false);
    expect(
      grade(exercises[0], {
        ...result("Hello, World!"),
        error: { type: "NameError", message: "x", traceback: "" },
      }).passed,
    ).toBe(false);
  });
  it("distinguishes integers from identical-looking strings", () => {
    expect(
      grade(
        exercises[2],
        result("100\n", [{ types: ["str"], values: ["100"] }]),
      ).passed,
    ).toBe(false);
    expect(
      grade(
        exercises[2],
        result("100\n", [{ types: ["int"], values: ["100"] }]),
      ).passed,
    ).toBe(true);
  });
  it("checks required separate calls while tolerating CRLF output", () => {
    expect(
      grade(
        exercises[3],
        result("Hello\nPython\n", [
          { types: ["str"], values: ["Hello\nPython"] },
        ]),
      ).passed,
    ).toBe(false);
    expect(
      grade(
        exercises[3],
        result("Hello\r\nPython\r\n", [
          { types: ["str"], values: ["Hello"] },
          { types: ["str"], values: ["Python"] },
        ]),
      ).passed,
    ).toBe(true);
  });
});
