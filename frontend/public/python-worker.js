/* Classic worker: Python and its assets are pinned and served from this origin. */
let pyodide;
self.onmessage = async ({ data }) => {
  if (data.type === "init") {
    try {
      importScripts(new URL("pyodide.js", data.baseUrl).href);
      pyodide = await loadPyodide({ indexURL: data.baseUrl });
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
    const json = await pyodide.runPythonAsync(`
import ast, builtins, contextlib, io, json, traceback

class OutputLimitError(Exception):
    pass

class BoundedText(io.TextIOBase):
    def __init__(self):
        self.parts = []
        self.size = 0
    def write(self, text):
        room = max(0, 8192 - self.size)
        self.parts.append(text[:room])
        self.size += len(text[:room])
        if len(text) > room:
            raise OutputLimitError("Output reached the 8,192-character limit. Print less information.")
        return len(text)
    def flush(self):
        pass
    def getvalue(self):
        return "".join(self.parts)

_out, _err = BoundedText(), BoundedText()
_calls, _error = [], None
_original_print = builtins.print

def _observed_print(*args, **kwargs):
    if len(_calls) >= 1000:
        raise OutputLimitError("Too many print calls. Try a smaller program.")
    _calls.append({"types": [type(x).__name__ for x in args], "values": [str(x)[:512] for x in args]})
    return _original_print(*args, **kwargs)

def _no_input(*args):
    raise RuntimeError("Interactive input is not supported in this first lesson. Use a value directly in your code.")

_scope = {"__name__": "__main__", "__builtins__": dict(vars(builtins), print=_observed_print, input=_no_input)}
try:
    with contextlib.redirect_stdout(_out), contextlib.redirect_stderr(_err):
        exec(compile(_student_source, "student.py", "exec"), _scope, _scope)
except BaseException as e:
    _line = getattr(e, "lineno", None)
    if _line is None:
        for frame in traceback.extract_tb(e.__traceback__):
            if frame.filename == "student.py":
                _line = frame.lineno
    _error = {"type": type(e).__name__, "message": str(e)[:1024], "line": _line, "traceback": "".join(traceback.format_exception(type(e), e, e.__traceback__))[-4096:]}
json.dumps({"stdout": _out.getvalue(), "stderr": _err.getvalue(), "prints": _calls, "error": _error})
`);
    const result = JSON.parse(json);
    if (!result.error) delete result.error;
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
