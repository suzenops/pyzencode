export function normalizeOutput(output: string) {
  return output.replaceAll("\r\n", "\n").replace(/\n$/, "");
}
