export type PythonError = {
  type: string;
  message: string;
  traceback: string;
  line?: number;
};
export type PrintCall = { types: string[]; values: string[] };
export type ExecutionResult = {
  stdout: string;
  stderr: string;
  prints: PrintCall[];
  error?: PythonError;
  duration: number;
  variables?: Record<string, VariableSnapshot>;
  typeCalls?: VariableSnapshot[];
  assignments?: Record<string, VariableSnapshot[]>;
  caseResults?: { name: string; result: ExecutionResult }[];
};
export type VariableSnapshot = { type: string; value: string };
export type RunOptions = {
  observe?: string[];
  cases?: { name: string; overrides: Record<string, string | number> }[];
};
export type RuntimeStatus = "idle" | "loading" | "running";
export type WorkerMessage =
  | { type: "ready" }
  | { type: "init-error"; message: string }
  | { type: "result"; result: ExecutionResult };
