import type { PythonError } from "./types";
export function explainError(error: PythonError): string {
  switch (error.type) {
    case "NameError":
      return "Python could not find a name. Assign a variable before using it and match its capitalization exactly (hours and Hours differ; print uses a lowercase p). If you intended text, use matching quotes.";
    case "SyntaxError":
      return error.message.includes("invalid decimal literal")
        ? "A variable name cannot start with a digit. Use a valid descriptive name, then update every lookup to match."
        : error.message.includes("never closed")
          ? "An opening parenthesis or bracket was not closed. Match each opening symbol with its closing partner."
          : error.message.includes("unterminated")
            ? "Python found the start of a string but not its end. Check for matching quotation marks."
            : "Python could not read this instruction. Check matching quotes, parentheses and whether words intended as text are inside quotes.";
    case "TypeError":
      return "The operation received a kind of value it cannot use. For example, + cannot directly combine a number with text. Check the types of your values.";
    case "IndentationError":
      return "The spaces at the start of a line do not match Python’s structure. Use consistent indentation for branch bodies and align else with its matching if.";
    case "TimeoutError":
      return "The worker was terminated so your page stays usable. Look for code that never finishes. Retry starts a fresh Python interpreter.";
    case "OutputLimitError":
      return "Your program printed too much information. Reduce repeated output and run a smaller example.";
    default:
      return error.message;
  }
}
