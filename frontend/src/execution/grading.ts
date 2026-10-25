import type { Exercise } from "../content/types";
import type { ExecutionResult, RunOptions } from "./types";
import { compareOutput, type OutputDifference } from "./comparison";
export { normalizeOutput } from "./output";
import { normalizeOutput } from "./output";
export type GradeFeedback = {
  passed: boolean;
  message: string;
  difference?: OutputDifference;
};
export function gradingOptions(exercise: Exercise): RunOptions | undefined {
  return exercise.variables
    ? {
        inputs: exercise.inputs,
        observe: exercise.variables.map((v) => v.name),
        cases: exercise.cases?.map(({ name, overrides }) => ({
          name,
          overrides,
        })),
      }
    : undefined;
}
export function grade(
  exercise: Exercise,
  result: ExecutionResult,
): GradeFeedback {
  if (result.error)
    return {
      passed: false,
      message: `${result.error.type}: fix the execution error first, then check again. No points were awarded.`,
    };
  for (const requirement of exercise.variables ?? []) {
    const variable = result.variables?.[requirement.name];
    if (!variable) {
      const differentCase = Object.keys(result.variables ?? {}).find(
        (n) => n.toLowerCase() === requirement.name.toLowerCase(),
      );
      return {
        passed: false,
        message: differentCase
          ? `Use the exact name ${requirement.name}. ${differentCase} has different capitalization; Python treats them as different names.`
          : `Missing variable ${requirement.name}. Assign that exact name before displaying its value.`,
      };
    }
    if (variable.type !== requirement.type)
      return {
        passed: false,
        message: `${requirement.name} must have type ${requirement.type}, but its stored type is ${variable.type}. Check whether quotes or a decimal point changed its type.`,
      };
    if (variable.value !== requirement.value)
      return {
        passed: false,
        message: `${requirement.name} has value ${JSON.stringify(variable.value)} instead of ${JSON.stringify(requirement.value)}. Check the assignment or calculation.`,
      };
    if (requirement.history) {
      const history = result.assignments?.[requirement.name] ?? [];
      let at = 0;
      for (const value of history) {
        if (
          value.value === requirement.history[at] &&
          value.type === requirement.type
        )
          at++;
      }
      if (at !== requirement.history.length)
        return {
          passed: false,
          message: `The assignments to ${requirement.name} must establish ${requirement.history.join(" before ")} in that order. A final value alone does not show the required update.`,
        };
    }
  }
  if (exercise.typeOf) {
    const value = result.variables?.[exercise.typeOf];
    if (
      !value ||
      !result.typeCalls?.some(
        (call) => call.type === value.type && call.value === value.value,
      )
    )
      return {
        passed: false,
        message: `Use the built-in type() function to inspect the value associated with ${exercise.typeOf}, then display that result.`,
      };
  }
  const difference = compareOutput(exercise.expected, result.stdout);
  if (difference)
    return {
      passed: false,
      message: `${difference.message} No points were awarded.`,
      difference,
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
  for (const test of exercise.cases ?? []) {
    const execution = result.caseResults?.find(
      (c) => c.name === test.name,
    )?.result;
    if (exercise.typeOf && execution) {
      const value = execution.variables?.[exercise.typeOf];
      if (
        !value ||
        !execution.typeCalls?.some(
          (call) => call.type === value.type && call.value === value.value,
        )
      )
        return {
          passed: false,
          message: `The changed-value check must also use type() on ${exercise.typeOf}; a fixed type or an unrelated value does not meet this task.`,
        };
    }
    if (
      !execution ||
      execution.error ||
      normalizeOutput(execution.stdout) !== test.expected
    )
      return {
        passed: false,
        message: `Your program must use the stored information when ${test.name}. The changed-value check did not produce the expected result. Use variable lookups or calculations instead of hardcoded output.`,
      };
  }
  return {
    passed: true,
    message: "Requirements met. Your working solution is saved.",
  };
}
