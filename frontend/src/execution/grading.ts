import type { Exercise } from "../content/types";
import type { ExecutionResult } from "./types";
export function normalizeOutput(output: string) {
  return output.replaceAll("\r\n", "\n").replace(/\n$/, "");
}
export function grade(
  exercise: Exercise,
  result: ExecutionResult,
): { passed: boolean; message: string } {
  if (result.error)
    return {
      passed: false,
      message:
        "Fix the execution error first, then check again. No points were awarded.",
    };
  if (normalizeOutput(result.stdout) !== exercise.expected)
    return {
      passed: false,
      message:
        "The output differs from the target. Compare spelling, spaces and line breaks. No points were awarded.",
    };
  if (exercise.minPrints && result.prints.length !== exercise.minPrints)
    return {
      passed: false,
      message: `The output matches, but this task asks for ${exercise.minPrints} separate print calls. Try that structure.`,
    };
  if (
    exercise.integer !== undefined &&
    !result.prints.some((p) =>
      p.types.some(
        (t, i) => t === "int" && p.values[i] === String(exercise.integer),
      ),
    )
  )
    return {
      passed: false,
      message:
        "The output looks right, but the value must be an integer rather than quoted text.",
    };
  return {
    passed: true,
    message: "Requirements met. Your working solution is saved.",
  };
}
