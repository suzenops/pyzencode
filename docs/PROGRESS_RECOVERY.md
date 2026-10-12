# Completion persistence and recovery

## What was wrong

The frontend treated completion as a computed view of current reading flags, quiz answers and lab IDs. It did not store an earned-completion milestone. A lesson could be finished and unlock its successor, then become incomplete again when an answer was changed during review. The successor guard called this mutable check on every visit. This regression is reproduced by the new browser tests.

Local writes were queued through promise callbacks. They now happen synchronously before the UI update returns, rather than depending on deferred work. Existing storage failures remain visible and never trigger an automatic reset.

There is also a separate address issue: browser localStorage belongs to an origin (scheme, hostname and port). Vercel deployment addresses and `pyzencode.vercel.app` have separate stores. Logging into Vercel does not combine them. We cannot inspect the user's browser storage here, so these reproducible mechanisms do not establish which one caused every individual incident.

The backend was inspected: it serves curriculum/features metadata only, reports `authentication: not-configured`, and has no account login/logout or completion database. The fix does not invent an account service or claim cloud synchronization.

## Fix and preservation

- Adds an additive `completedLessons` ledger under the existing version-1 progress key. Once a lesson is earned it remains completed while quiz answers are reviewed.
- Reconciles milestones before and after each update. A successful final prerequisite step automatically unlocks the next lesson and advances Continue Learning.
- Recovers legacy records with all ten checked lab passes, without fabricating missing quiz answers, reading marks or additional points.
- Recorded work in a previously gated successor (read sections, quiz/quick-check answers, registered drafts or checked exercises) recovers its prerequisite milestone. Partial work does not mark the successor itself complete.
- Writes synchronously and merges existing stored completions with the current snapshot so a stale tab cannot erase earned milestones or checked lab IDs.
- Copies the original stored JSON, untouched, to `pyzencode.progress.before-completion-fix.v1` before the first successful upgrade/write. Unknown fields, IDs and drafts are preserved in storage and exports rather than silently discarded.
- A failed read, unsupported format, invalid import or failed write does not replace existing progress with an empty record. Explicit user-requested deletion remains the existing separate confirmed action; the fix never invokes it automatically.
- Adds private JSON Export/Import controls on the existing progress page. Imports merge; current drafts/answers win conflicts and earned milestones/checked exercises are retained. No progress upload service or analytics is added.

## Restore without repeating exercises

Use the same browser/profile and **original site address** where the work was completed. After the fix is deployed at that origin, existing evidence is recovered automatically. Do not clear browser data.

If moving to the stable site from a preview:

1. On the original site, open Your progress and choose **Export progress**.
2. Open the updated `https://pyzencode.vercel.app/progress` and choose **Import progress**.
3. Select your private JSON file. The app combines both records; it does not replace your current code drafts with older ones.
4. Verify points and completion before leaving the old site. Keep the backup private because it includes code drafts.

Old Vercel deployment URLs can be immutable and may not include the new Export button. On that **original** address, a desktop browser's developer console can download its existing progress without changing it:

```js
const saved = localStorage.getItem('pyzencode.progress.v1');
if (!saved) {
  console.info('No saved progress on this address. Check the original browser/profile and site.');
} else {
  const url = URL.createObjectURL(new Blob([saved], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pyzencode-progress.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
```

Import that file through the updated site's progress page. Do not paste private progress into chat or a GitHub issue. Do not use localStorage.clear(), reset the lesson or delete stored keys to attempt recovery.

If storage was actually deleted and no backup or original profile/address exists, the app cannot reconstruct unrecorded work. This fix never awards new lab points based only on a recovery milestone.

## Sessions and limits

The ledger persists through reload and reopening the application in the same browser profile/origin. Browser-cookie/login changes do not cause this app to delete it. Actual PyZenCode account logout/login and cross-device account sync cannot be tested or promised because they are not implemented; that requires a configured authentication/database integration. Private browsing, a new profile/device or another origin has separate storage. Export/import provides explicit transfer without pretending that browser origins share data.

Completion/points remain user-controlled learning progress, not trusted certification. The backend, interpreter, lessons, grading, design and deployment settings are otherwise unchanged.

## Verification

The fix is covered by unit tests for permanent completion, legacy recovery, gated successor evidence, immediate writes, stale snapshots, exact backups, unknown data preservation, additive merges and corrupt-storage refusal. Browser regressions review a completed quiz, reload and reopen a session; restore prior successor work; reject malformed imports; and download/import an actual export between two distinct origins. The full existing lesson/grading/worker suites are also run.

Commands from `frontend`: `npm run typecheck`, `npm test`, `npm run format:check`, `npm run build`, `npm run test:e2e`. Backend: `.venv/bin/python -m pytest -q` from the repository root. Run the feature branch `fix/persistent-lesson-completion` for review; no automatic merge or manual deployment is performed.

Validation completed: 58 frontend unit tests, 26 backend tests and 15 Playwright browser tests passed (99 total). TypeScript, formatting and production build validation passed. Real account login/logout was not tested because the repository has no account authentication implementation.
