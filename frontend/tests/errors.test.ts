import { it, expect } from "vitest";
import { explainError } from "../src/execution/errors";
it("provides relevant authored explanations for common Python errors", () => {
  expect(
    explainError({ type: "NameError", message: "unknown", traceback: "" }),
  ).toContain("capitalization");
  expect(
    explainError({
      type: "SyntaxError",
      message: "( was never closed",
      traceback: "",
    }),
  ).toContain("closed");
  expect(
    explainError({
      type: "SyntaxError",
      message: "unterminated string literal",
      traceback: "",
    }),
  ).toContain("quotation");
  expect(
    explainError({ type: "TimeoutError", message: "", traceback: "" }),
  ).toContain("terminated");
});
