import { normalizeOutput } from "./output";
export type OutputDifference = {
  line: number;
  column: number;
  kind: "capitalization" | "space" | "missing" | "extra" | "character";
  expected: string;
  actual: string;
  message: string;
};
export function compareOutput(
  expected: string,
  raw: string,
): OutputDifference | undefined {
  const actual = normalizeOutput(raw);
  if (expected === actual) return undefined;
  const wanted = Array.from(expected),
    received = Array.from(actual);
  let index = 0;
  while (
    index < Math.min(wanted.length, received.length) &&
    wanted[index] === received[index]
  )
    index++;
  let line = 1,
    column = 1;
  for (const character of wanted.slice(0, index)) {
    if (character === "\n") {
      line++;
      column = 1;
    } else column++;
  }
  const want = wanted[index],
    got = received[index];
  const kind = !got
    ? "missing"
    : !want
      ? "extra"
      : want.toLowerCase() === got.toLowerCase() && want !== got
        ? "capitalization"
        : /\s/.test(want) || /\s/.test(got)
          ? "space"
          : "character";
  const display = (char: string | undefined) =>
    char === undefined
      ? "end of output"
      : char === "\n"
        ? "a line break"
        : char === " "
          ? "a space"
          : JSON.stringify(char);
  const message =
    kind === "capitalization"
      ? `Capitalization differs at line ${line}, character ${column}: expected ${display(want)}, received ${display(got)}.`
      : kind === "space"
        ? `Spacing or line breaks differ at line ${line}, character ${column}: expected ${display(want)}, received ${display(got)}.`
        : kind === "missing"
          ? `Output ends too early at line ${line}, character ${column}; expected ${display(want)}.`
          : kind === "extra"
            ? `Extra output begins at line ${line}, character ${column}: received ${display(got)}.`
            : `First difference at line ${line}, character ${column}: expected ${display(want)}, received ${display(got)}.`;
  return { line, column, kind, expected, actual, message };
}
