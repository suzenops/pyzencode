# Publish the prepared project

**Publication completed:** after the user created the public repository, the existing project was pushed to [suzenops/pyzencode](https://github.com/suzenops/pyzencode) and [PR #1](https://github.com/suzenops/pyzencode/pull/1) was opened into `main`. It remains unmerged. No Mac upload is needed.

The instructions below record the original fallback handoff after the integration denied repository creation. Do not repeat the bootstrap pushes against the now-populated repository. To use the published app, follow the feature-branch clone command in the root README. Yunomi was not modified.

The source archive is sufficient to run locally. The accompanying **PyZenCode.bundle** additionally contains Git history with:

- `main`: a minimal independent-project bootstrap.
- `feat/first-working-version`: the working app, content, tests, previews and documentation.

## From the Git bundle

On your Mac, place the downloaded bundle in a folder and run:

```sh
git clone --branch feat/first-working-version PyZenCode.bundle pyzencode
cd pyzencode
git branch main origin/main
```

Install [GitHub CLI](https://cli.github.com/) if needed (`brew install gh`). Authenticate with your own account through its normal flow:

```sh
gh auth login
```

First check whether the repository exists:

```sh
gh repo view suzenops/pyzencode
```

If it does **not** exist, create it. This example keeps it private; you can deliberately choose public visibility instead:

```sh
gh repo create suzenops/pyzencode --private \
  --description 'Learn. Break. Fix. Master. A beginner Python academy with real browser execution.'
```

For a new, empty repository:

```sh
git remote set-url origin https://github.com/suzenops/pyzencode.git
git push origin main
gh repo edit suzenops/pyzencode --default-branch main
git push -u origin feat/first-working-version
gh pr create --repo suzenops/pyzencode --base main \
  --head feat/first-working-version \
  --title 'Build the first working PyZenCode learning academy' \
  --body-file docs/PULL_REQUEST.md
```

**Do not force-push or run this bootstrap against a repository with existing commits.** If an existing `suzenops/pyzencode` contains work, clone it separately, inspect its instructions and copy/reconcile this project into a new feature branch instead. An empty repo created through GitHub's website must have no generated README, license or gitignore for the simple bootstrap above.

The PR is intentionally separate from `main`. Review it and decide when to merge; none of these commands automatically merges it. Until then, run/check out `feat/first-working-version`.

## Source archive only

```sh
tar -xzf PyZenCode.tar.gz
cd pyzencode/frontend
npm ci
npm run dev
```

See the root README for backend setup, tests and deployment. Use the Git bundle workflow above to retain the prepared review branch/history.
