# Browser execution boundaries

Student code is never executed by FastAPI. There is no server execute endpoint, shell subprocess, paid model key or Supabase secret in the frontend.

Pyodide runs in a disposable classic Web Worker with separate initialization/execution deadlines. The controller terminates workers after results, stops, errors and navigation. Normal captured output and tracebacks have limits. These measures protect responsiveness for common beginner mistakes, not all possible malicious programs.

**A worker is not a security sandbox for adversarial code.** Python's `js` bridge can access worker JavaScript, make network requests, use browser storage APIs and attempt to spoof worker messages. Memory allocation can exhaust browser resources. Print capture can be bypassed by advanced Python; grading is learning feedback, not a trusted certification system. Do not run unknown hostile code or put credentials in the browser context.

Before integrating Supabase or authenticated services, move execution to a dedicated origin with no application credentials, cookies or sensitive storage. Use a narrow, validated cross-origin message protocol, a restrictive execution-origin CSP/network policy, carefully scoped authenticated backend endpoints and RLS for student data. Do not expose backend secrets to that origin or treat client points as authoritative. Do not add arbitrary code execution to FastAPI.

This first version has no analytics, external AI calls or progress uploads. Source/drafts and progress remain in localStorage on the app origin, shared by people using that browser profile. Deletion is explicit. Clearing browser data removes progress; there is no cloud recovery or cross-device sync. Current-browser Chromium was tested; Safari/Firefox/mobile device resource limits need separate review.

Lesson 2 uses AST (Python syntax-tree) instrumentation only inside the worker to observe ordinary assignments and rerun with substituted values. AST means a structured representation of parsed source. This checks learning requirements, not proof of arbitrary program semantics or a trusted assessment. It accepts normal, chained, unpacked, annotated, augmented and named-expression assignments with indirect variable uses. Required variables are inspected at module scope; advanced dynamic bindings through `exec`, `globals()` mutation or function-local-only variables are outside the beginner grader’s supported patterns. Learner code can inspect or subvert the grading helper, just as it can tamper with local progress. Do not treat points as certification.

`frontend/public/execution.py` is a same-origin static asset downloaded and evaluated by Pyodide; it is not a server execution endpoint. Trusted CPython helper tests do not expose an execution service.
