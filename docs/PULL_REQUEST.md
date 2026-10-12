PyZenCode is now a functional beginner Python learning academy rather than a static mockup. Students can read a complete first lesson, execute real Python in a disposable Web Worker, understand errors, complete ten graded exercises and return to persisted drafts/progress.

## Built

- React/TypeScript/Vite/Tailwind frontend with eight responsive areas, a lazy-loaded syntax-highlighted CodeMirror editor and reduced-motion styling.
- Complete Level 1 Lesson 1, annotated print syntax, runnable examples, five explained knowledge questions, all ten specified lab tasks and three Debug Lab challenges.
- Same-origin pinned Pyodide runtime. Separate startup/execution deadlines, worker termination/restart, bounded output/errors and fresh execution scope per run.
- Grading of actual output, integer argument types and required print-call counts; valid alternative source solutions accepted. Points only for checked passes, ten per question without duplicate awards.
- Versioned local progress repository for drafts, completions, quiz answers and recent activity; visible read/write failures and explicit deletion. Clean boundaries for future Supabase/AI implementations.
- FastAPI health/shared-curriculum/feature metadata endpoints. No server code execution endpoint, live AI provider, authentication or paid key requirement.
- Seven-level planned curriculum clearly labeled Coming soon beyond Lesson 1.

## Validation and review

20 unit tests, four FastAPI tests and seven production-browser tests passed (31 total), alongside TypeScript, formatting and the production build. All ten questions were graded through real Python; timeout/retry/output caps and persistence were exercised. All eight areas fit 320px, 390px and 768px browser viewports without page errors or horizontal overflow.


See [validation and rendered previews](https://github.com/suzenops/pyzencode/blob/feat/first-working-version/docs/VALIDATION.md), the root [README](https://github.com/suzenops/pyzencode/blob/feat/first-working-version/README.md), and [execution security boundaries](https://github.com/suzenops/pyzencode/blob/feat/first-working-version/SECURITY.md).

The intended GitHub workflow leaves this implementation on a feature branch for review; no automatic merge or public hosting deployment is performed.

## Run

```sh
cd frontend
npm ci
npm run dev
```

Optional metadata backend, from repository root:

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.lock
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

Future lessons, Supabase authentication/cloud sync and a paid AI tutor are unimplemented and explicitly identified. Pyodide workers protect the UI from ordinary execution mistakes but are not a hostile-code security sandbox. Chromium viewport review does not establish Safari/Firefox/iPhone device performance.
