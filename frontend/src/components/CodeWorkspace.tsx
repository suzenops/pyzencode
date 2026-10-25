import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import {
  Check,
  Lightbulb,
  Play,
  RotateCcw,
  Square,
  Terminal,
} from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import type { Exercise } from "../content/types";
import { explainError } from "../execution/errors";
import {
  grade,
  gradingOptions,
  type GradeFeedback,
} from "../execution/grading";
import { createBrowserRunner } from "../execution/runner";
import type { ExecutionResult, RuntimeStatus } from "../execution/types";
import { useProgress } from "../progress/ProgressProvider";
import { OutputComparison } from "./OutputComparison";
export function CodeWorkspace({
  id,
  starter = 'print("Hello, World!")',
  exercise,
}: {
  id: string;
  starter?: string;
  exercise?: Exercise;
}) {
  const { progress, update, complete } = useProgress();
  const code = progress.drafts[id] ?? starter;
  const [result, setResult] = useState<ExecutionResult>();
  const [status, setStatus] = useState<RuntimeStatus>("idle");
  const [feedback, setFeedback] = useState<GradeFeedback>();
  const [hints, setHints] = useState(0);
  const [inputText, setInputText] = useState(
    (exercise?.inputs ?? []).join("\n"),
  );
  const inputId = useId();
  const runner = useMemo(() => createBrowserRunner(), []);
  const extensions = useMemo(
    () => [
      python(),
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({
        "aria-label": "Python code editor",
        spellcheck: "false",
      }),
    ],
    [],
  );
  useEffect(() => () => runner.cancel(), [runner]);
  const setCode = (value: string) => {
    if (value.length > 20000) return;
    update((p) => ({ ...p, drafts: { ...p.drafts, [id]: value } }));
    setFeedback(undefined);
  };
  const run = async (check = false) => {
    setFeedback(undefined);
    setResult(undefined);
    const execution = await runner.run(
      code,
      setStatus,
      check && exercise
        ? gradingOptions(exercise)
        : { inputs: inputText ? inputText.split("\n") : [] },
    );
    setResult(execution);
    if (check && exercise) {
      const checked = grade(exercise, execution);
      setFeedback(checked);
      if (checked.passed) complete(exercise.id, true);
    }
  };
  return (
    <div className="workspace">
      <div className="editor-top">
        <span>
          <span className="file-dot" /> main.py
        </span>
        <span>Python 3 · Browser worker</span>
      </div>
      <CodeMirror
        value={code}
        extensions={extensions}
        theme={oneDark}
        minHeight="230px"
        maxHeight="520px"
        editable={status === "idle"}
        onChange={setCode}
        basicSetup={{
          foldGutter: false,
          autocompletion: false,
          highlightActiveLine: true,
        }}
      />
      <details className="prepared-input">
        <summary>Prepared input for input()</summary>
        <label htmlFor={inputId}>One input value per line</label>
        <textarea
          id={inputId}
          value={inputText}
          maxLength={8192}
          disabled={status !== "idle"}
          onChange={(event) => setInputText(event.target.value)}
          rows={3}
        />
        <p className="muted">
          Run Code reads these lines in order. Check Answer uses the exercise’s
          fixed test input. Input is not saved.
        </p>
      </details>
      <div className="editor-actions">
        <button onClick={() => void run()} disabled={status !== "idle"}>
          <Play size={15} />
          Run Code
        </button>
        {exercise && (
          <button
            className="secondary"
            onClick={() => void run(true)}
            disabled={status !== "idle"}
          >
            <Check size={15} />
            Check Answer
          </button>
        )}
        {status !== "idle" && (
          <button className="secondary" onClick={() => runner.cancel()}>
            <Square size={13} />
            Stop
          </button>
        )}
        <button
          className="icon-button"
          aria-label="Reset code to starter"
          disabled={status !== "idle"}
          onClick={() => {
            if (
              window.confirm(
                "Replace this draft with the starter code? Completed progress is kept.",
              )
            ) {
              setCode(starter);
              setResult(undefined);
            }
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <div className="console" aria-live="polite" aria-busy={status !== "idle"}>
        <div className="console-label">
          <Terminal size={14} />
          Console{" "}
          <span>
            {status === "loading"
              ? "Loading Python…"
              : status === "running"
                ? "Executing…"
                : result
                  ? `${Math.round(result.duration)} ms`
                  : "Ready when you are"}
          </span>
        </div>
        {status === "loading" && (
          <p className="muted">
            Starting a real Python interpreter. The first load can take a few
            seconds.
          </p>
        )}
        {status === "running" && (
          <p className="muted">Running your instructions…</p>
        )}
        {result && (
          <>
            {result.stdout ? (
              <pre data-testid="python-output">{result.stdout}</pre>
            ) : (
              <p className="muted">No text output.</p>
            )}
            {result.stderr && <pre className="error-text">{result.stderr}</pre>}
            {result.error && (
              <div className="error-block" role="alert">
                <strong>
                  {result.error.type}
                  {result.error.line ? ` · line ${result.error.line}` : ""}
                </strong>
                <p>{explainError(result.error)}</p>
                <details>
                  <summary>Real Python error details</summary>
                  <pre>{result.error.traceback || result.error.message}</pre>
                </details>
                <button
                  className="text-button"
                  onClick={() => void run()}
                  disabled={status !== "idle"}
                >
                  Retry execution
                </button>
              </div>
            )}
          </>
        )}
        {!result && status === "idle" && (
          <p className="muted">
            Run your code to see actual Python output here.
          </p>
        )}
      </div>
      {feedback && (
        <div
          className={`feedback ${feedback.passed ? "passed" : ""}`}
          role="status"
        >
          <strong>{feedback.passed ? "Solved" : "Keep investigating"}</strong>
          <p>{feedback.message}</p>
          {feedback.difference && (
            <OutputComparison difference={feedback.difference} />
          )}
          {feedback.passed && <p>{exercise?.explanation}</p>}
        </div>
      )}
      {exercise && (
        <div className="hints">
          <button
            className="text-button"
            onClick={() =>
              setHints((n) => Math.min(n + 1, exercise.hints.length))
            }
            disabled={hints === exercise.hints.length}
          >
            <Lightbulb size={15} />
            {hints === 0
              ? "Get a hint"
              : hints === exercise.hints.length
                ? "All hints shown"
                : "Show the next hint"}
          </button>
          {exercise.hints.slice(0, hints).map((hint, i) => (
            <p key={hint}>
              <span>Hint {i + 1}</span> {hint}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
