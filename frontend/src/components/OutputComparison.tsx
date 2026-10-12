import type { OutputDifference } from "../execution/comparison";
export function OutputComparison({
  difference,
}: {
  difference: OutputDifference;
}) {
  return (
    <div
      className="output-comparison"
      aria-label="Expected versus actual output"
    >
      <div>
        <section>
          <h4>Expected output</h4>
          <pre>{difference.expected || "(empty output)"}</pre>
        </section>
        <section>
          <h4>Your output</h4>
          <pre>{difference.actual || "(empty output)"}</pre>
        </section>
      </div>
      <small>
        First difference: line {difference.line}, character {difference.column}.
        Spaces and line breaks are part of the output.
      </small>
    </div>
  );
}
