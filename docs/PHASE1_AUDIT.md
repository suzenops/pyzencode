# Phase 1: existing platform audit

Inspected the checked-out `suzenops/pyzencode` revision before changing application files. Work continues on `feat/modules-2-to-5`; main was not modified.

| Area | Existing behavior | Missing from the requested platform |
| --- | --- | --- |
| Curriculum | Two authored lesson units: first program and variables. Shared seven-level topic roadmap. | Full modules 3–12; booleans, conversion and input in module 2. |
| Learning | Eight reading sections per unit, examples, five final quiz questions, ten coding tasks. Lesson 2 includes quick checks and seven debugging cases. | Five guided readings and ten quiz questions for each new module; difficulty and final assessment labels. |
| Execution | CodeMirror, Pyodide 0.27.7 in a fresh browser worker, real output/errors, grading, hints, reset, cancellation, deadlines and output caps. | `input()` support. The worker is not a hostile-code sandbox. |
| Progress | Version-1 browser storage, earned completion, additive import/export, original backup, draft persistence, idempotent points and prerequisite gates. | Account sync, module badges and complete-course completion metrics. |
| UI | Existing dark theme, dashboard, curriculum, lesson reader, lab, playground, progress and mobile navigation. | Expandable module cards and totals that support additional content. |
| Backend | Read-only FastAPI metadata and health. Shared curriculum JSON. | No database, authentication, migrations, user progress API or server execution. None should be invented for Phase 2. |
| Tests/deployment | Vitest, pytest, TypeScript, Prettier, Vite production build and Chromium tests with real Python. Static `dist` deployment documented. | Vercel deployment verification remains Phase 6; no deployment credentials are required for local development. |

Baseline verification: 58 frontend unit tests and 26 backend tests passed; type check, formatting and production build passed. The browser run passed 14 of 15 cases; the first case failed during overlapping writes to `dist`. It passed on a single-build rerun. Subsequent validation uses one build at a time.

Phase 2 extends the current reader, grader and storage model. It preserves both original units, their identifiers, quiz answers, drafts, earned completion and point rules. Later curriculum phases and account-based progress remain separate work.
