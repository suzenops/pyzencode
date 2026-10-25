# Phase 2: Modules 2–5

The existing reader groups guided reading lessons as `LessonContent.sections`, followed by a quiz and coding lab. This change reuses that structure: each new unit has five independently navigable reading lessons, each with an objective, explanations, a runnable example, line-by-line notes, a common mistake and a practice prompt. These are reading lessons within a unit, not five separate graded units.

| Module | Content units | Reading lessons | Final quiz | Coding exercises |
| --- | --- | --- | --- | --- |
| 2: Variables and Data Types | Existing `variables` retained; new `values` extension | 8 existing + 5 new | 5 existing + 10 new | 10 existing + 10 new |
| 3: Python Operators | `operators` | 5 | 10 | 10 |
| 4: Strings | `strings` | 5 | 10 | 10 |
| 5: Conditional Statements | `conditionals` | 5 | 10 | 10 |

New tasks progress through Beginner (1–3), Intermediate (4–7) and Challenge (8–10). Task ten is the practical final assessment. Unit completion requires all readings, all quiz answers correct and all ten lab tasks passed; previously earned completion remains permanent. Quiz questions explain both correct and incorrect options immediately. Exercises have progressive hints and exact output comparison. Changed-data checks reject fixed-output answers; boundary cases cover score bands, ticket policies and inclusive ranges. Equivalent implementations are accepted; the local grader does not certify that a particular operator or syntax form was used.

The prerequisite chain is `first-program → variables → values → operators → strings → conditionals`. Existing earned completion is retained. New gates, resume links and progress totals use the existing storage functions. Shared lesson and module metadata is exposed by FastAPI; FastAPI neither stores learner progress nor executes learner code.

## Prepared input

Open **Prepared input for input()** in any editor. Enter one fictional value per line, then choose Run Code. Each `input()` consumes a line and returns text; prompts appear in the output. Check Answer uses the exercise's fixed input data so grading is repeatable. Running out of lines produces EOFError with guidance. Input is held in component memory, is not persisted and starts fresh on each execution. Limits are 100 lines and 8,192 characters per line in the helper; the input field accepts at most 8,192 characters total.

Execution remains in a disposable browser worker with the existing 3-second execution deadline, 45-second initialization deadline and output limits. It is not a security boundary for hostile code, has no enforceable memory quota and should not run with privileged same-origin data. No execution endpoint or application secret was added.

## Files and compatibility

- `shared/phase2-content.json`: authored reading content, quizzes and exercise requirements; `shared/modules.json` and `shared/lessons.json`: module membership and prerequisites.
- `frontend/src/content/`: additive content registration and exercise types. Original lesson content and IDs are unchanged.
- `frontend/src/pages/` and `frontend/src/components/`: expandable curriculum, correct totals, difficulty/assessment labels, prerequisite feedback and prepared input.
- `frontend/public/execution.py` and execution types: bounded prepared input and Boolean observations using the existing worker transport.
- `backend/app/main.py`: additional declarative metadata, with no new execution or persistence behavior.
- `frontend/tests/phase2.test.ts`, `frontend/tests/e2e/phase2.spec.ts`, `frontend/tests/fixtures/phase2-solutions.json`, `backend/tests/test_phase2_content.py`: real execution, grading, quiz feedback, gates, legacy persistence and browser checks. The previous final-lesson resume expectation now points to the new successor.

No database migration, storage version change, new dependency or application environment variable is needed. Package declarations and lockfiles are unchanged. Browser-local progress remains origin-specific; export/import continues to merge existing work. Modules 6–12, module badges and account synchronization are not implemented in this phase.

## Validation

From the repository root, run `.venv/bin/python -m pytest -q`. From `frontend`, run `npm run typecheck`, `npm test`, `npm run format:check`, `npm run build`, and `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e`. Run builds sequentially because browser tests manage their own production build and preview server.

Static deployment still uses the entire `frontend/dist`, including the pinned same-origin Python assets, worker and helper. No Vercel deployment or production promotion has been performed. The platform still requires navigation fallback to `index.html` while serving real static files directly.

Verified on this branch: **101 frontend tests, 72 backend tests and all 20 Chromium browser tests passed**. Type checking, formatting and the production build passed. Browser tests execute all 40 new tasks and the original two labs, check failed attempts and quiz feedback, verify persistence and successor unlocking, and test prepared input plus exhaustion. The browser run completed in 5.4 minutes with one worker. Backend tests emit one upstream Starlette/AnyIO deprecation warning.
