/* Pinned same-origin interpreter. A disposable worker is not a hostile-code sandbox. */
let pyodide;
self.onmessage = async ({ data }) => {
  if (data.type === "init") {
    try {
      importScripts(new URL("pyodide.js", data.baseUrl).href);
      pyodide = await loadPyodide({ indexURL: data.baseUrl });
      const response = await fetch(new URL("../execution.py", data.baseUrl));
      if (!response.ok) throw new Error("Execution helper unavailable");
      await pyodide.runPythonAsync(await response.text());
      self.postMessage({ type: "ready" });
    } catch (error) {
      self.postMessage({ type: "init-error", message: String(error) });
    }
    return;
  }
  if (data.type !== "run" || !pyodide) return;
  const start = performance.now();
  try {
    pyodide.globals.set("_student_source", data.code);
    pyodide.globals.set("_run_options", JSON.stringify(data.options ?? {}));
    const result = JSON.parse(
      await pyodide.runPythonAsync(
        "execute_request(_student_source, json.loads(_run_options))",
      ),
    );
    self.postMessage({
      type: "result",
      result: { ...result, duration: performance.now() - start },
    });
  } catch (error) {
    self.postMessage({
      type: "result",
      result: {
        stdout: "",
        stderr: "",
        prints: [],
        error: {
          type: "RuntimeError",
          message: String(error).slice(0, 1024),
          traceback: "",
        },
        duration: performance.now() - start,
      },
    });
  }
};
