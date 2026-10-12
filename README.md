# PyZenCode

**Learn. Break. Fix. Master.**

A functional Python learning academy for absolute beginners. React + TypeScript + Vite + Tailwind, FastAPI metadata services, and real Pyodide Python execution in a Web Worker. 

## Available lessons

- Eight responsive areas: landing page, student dashboard, curriculum, lesson reader, playground, ten-question coding lab, Debug Lab and progress dashboard.
- **Lesson 1 — Your First Python Program:** preserved eight reading sections, annotated `print("Hello")`, runnable examples, five explained multiple-choice questions and ten graded exercises.
- **Lesson 2 — Variables and Data Types:** eight detailed sections, quick checks, annotated assignment/nested calls, type/naming tables, seven interactive debugging examples, a five-question final check and exactly ten graded exercises. Estimated 25–35 minutes before the practical lab. It unlocks after Lesson 1’s read/quiz/lab completion criteria are met.
- Syntax-highlighted CodeMirror editor. Run Code executes real Python; Check Answer checks output and task requirements. Lesson 2 additionally checks named values/types, assignment history, and changed-value runs to reject hardcoded output. Shared expected/actual feedback identifies the first differing line/character, including capitalization. Different valid source solutions are accepted.
- Progressive hints, real tracebacks with authored plain-language explanations, retry, navigation and completion tracking. Only checked passing lab answers earn points: 10 each, 100 per lesson (200 across both). Debug challenges record completion without extra points.
- Local progress, drafts, quiz answers and recent activity persist between refreshes. Lesson completion requires eight sections marked read, five correct quiz answers and ten solved tasks.
- Seven planned curriculum levels. Lessons 1 and 2 are implemented; remaining topics are labeled Coming soon. Continue Learning advances to the next available lesson or unfinished step.
- No Supabase credentials, accounts, paid API or live AI tutor required. No simulated Python execution or fake AI responses.

## GitHub publication status

Lesson 1 was merged through [PR #1](https://github.com/suzenops/pyzencode/pull/1). Lesson 2 is prepared on `feat/lesson-2-variables` as a separate review PR against `main`; it is not automatically merged. [Lesson 2 screenshots, validation and grading notes](docs/LESSON_2.md) describe the added functionality.

## Run locally

Prerequisites: **Node.js 22+**, npm, **Python 3.12+**. A current browser with WebAssembly and Web Workers is required. Dependency installation needs internet; student Python execution uses same-origin local assets, not a CDN.

Until the implementation PR is merged, check out its feature branch:

```sh
git clone --branch feat/lesson-2-variables https://github.com/suzenops/pyzencode.git
cd pyzencode
```

Terminal 1 — frontend:

```sh
cd frontend
npm ci
npm run dev
```

Open **http://localhost:5173**. `predev` copies pinned Pyodide assets from the npm package into ignored `public/python/`; no manual download or API key is needed. The learning experience works even without the optional backend running.

Terminal 2 — metadata backend (from the repository root):

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.lock
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

API documentation: **http://localhost:8000/docs**. Vite proxies `/api` to this service. Verify it with:

```sh
curl http://localhost:5173/api/health
```

Windows: use `.venv\Scripts\activate` instead of `source .venv/bin/activate`; if needed use `py -3` for Python. Node commands are identical.

## Tests and checks

From `frontend`:

```sh
npm run typecheck
npm test
npm run format:check
npm run build
npx playwright install chromium
npm run test:e2e
```

The E2E suite builds and serves the **production bundle** on port 4173. It includes the preserved Lesson 1 suite plus Lesson 2 unlocking, all ten correct/incorrect/alternative solutions, actual variable-aware worker grading, examples/quick checks, seven debugging cases, saved progress and shared comparison feedback. It executes actual Python in Chromium, completes all ten tasks, rejects wrong output/string-instead-of-integer/single-call answers, verifies 100-point persistence, reads real errors, applies hints and corrections, tests output limits, terminates an infinite loop and successfully runs again, retries a failed runtime download, and checks navigation/mobile layout/damaged storage.

For an existing system Chromium (used in this cloud environment):

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e
```

From repository root with the venv active:

```sh
python -m pytest -q
```

Backend tests cover shared curriculum, health, honest feature availability and absence of server code execution. Additional trusted CPython tests exercise the same assignment-observation helper shipped to the browser; these run only in the test harness, never through API endpoints. [Rendered previews and validation notes](docs/VALIDATION.md) distinguish actual checks from unverified device/browser behavior. CI runs TypeScript, unit tests, formatting, backend tests and the real-browser suite.

## Architecture

```text
frontend/src/
  pages/          Eight application areas (lesson and lab share reusable views)
  components/     Editor, layout, knowledge check and visual primitives
  content/        Authored lesson, quiz, exercises and structured content types
  execution/      Worker lifecycle, result types, grading and error guidance
  progress/       Versioned repository interface and local implementation
  tutor/          Future AI provider contract; disabled in this release
frontend/public/python-worker.js  Interpreter lifecycle and execution requests
frontend/public/execution.py     Captured execution, assignment observations and counterfactual checks
frontend/scripts/prepare-python.mjs  Repeatable same-origin runtime installation
shared/curriculum.json  Single curriculum model for frontend and FastAPI
backend/app/main.py    Read-only metadata; never evaluates student code
```

New lessons/exercises can be added through the typed content models, without rewriting the editor or grader. Future Supabase persistence can implement `ProgressRepository`; authentication, migrations and synchronization are not implemented. The tutor interface is prepared but has no provider. Any future provider keys belong only on a backend, never in `VITE_` variables.

## Execution and privacy limitations

Each run creates a fresh worker/interpreter and terminates it after a result or cancellation, preventing ordinary Python globals from leaking to the next run. Interpreter initialization has a separate 45-second timeout; execution has a 3-second deadline. Python output is capped at 8,192 characters per stream, print observations at 1,000 calls, source length at 20,000 characters and error tracebacks at 4,096 characters. Timeout results do not retain partial output.

A worker separates execution from the main UI, **but is not a hostile-code security sandbox**. Pyodide can access worker JavaScript, networking and some same-origin browser capabilities. Memory-hungry code can still affect the browser; there is no enforceable memory quota. Local grading/progress can be tampered with and must not certify high-stakes assessments. See [SECURITY.md](SECURITY.md) before adding authentication or server features.

Interactive `input()` is not supported; it produces a clear error. External Python package installation is not provided. Browser filesystem changes are ephemeral. No server receives student source, output or progress in this version. The Python helper is a static browser asset fetched by the worker; FastAPI does not execute it on behalf of students. Do not put secrets in example code or browser storage. Local progress is device/browser-specific and can be lost when storage is cleared; failed saves are visibly reported. You can delete progress and drafts from the progress page. No analytics or tracking is included.

## Deployment

```sh
cd frontend
npm ci
npm run build
npm run preview
```

Publish the **entire** `frontend/dist` directory to a static HTTPS host. Include `python/` (approximately 14 MB of runtime assets), `python-worker.js`, and `execution.py` (a static text asset fetched by the worker). Configure SPA fallback to `index.html` **only for navigation routes**; real static files must be served as files, with `.wasm` as `application/wasm`. Do not redirect missing runtime assets to HTML. Relative runtime paths respect Vite's base URL if you configure a subdirectory deployment.

For same-origin FastAPI deployment, reverse-proxy `/api` to an ASGI service running the uvicorn command above; deploy `backend/` **and `shared/`** preserving their relative layout. Static frontend learning works without the service. No CORS wildcard or student-code execution endpoint is provided. The backend is not an authenticated production data service yet.

This version is not a PWA and does not promise offline use after closing the local/static server. The existing Vercel configuration is unchanged. This PR does not manually promote or change the live deployment. Review any Vercel-generated preview before merging.

## Visuals and licensing

Navy/charcoal surfaces, restrained violet accents, original CSS composition, responsive navigation and reduced-motion support. System fonts avoid remote font requests. Icons are from Lucide (ISC); CodeMirror is MIT; React/Vite/Tailwind/FastAPI and Pyodide retain their upstream licenses. See [third-party notices](docs/THIRD_PARTY.md). Previews are actual rendered application screenshots, not interface mockups.
