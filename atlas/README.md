# site-theme: how it works

Mapped at 2026-09-25 from commit 0e76d24.

## What this is

14 parts, in JavaScript (51 files), Astro (45 files), TypeScript (20 files), CSS (4 files) and HTML (2 files). Work enters through 7 doors; the busiest is @mcptoolshop/site-theme, which reaches 5 parts. It publishes to npm. It deploys a site to GitHub Pages. People run site-theme. People import @mcptoolshop/site-theme.

## What changed since 2026-09-25 (dbaeea5)

- components now imports lib.
- the site now imports components.
- the site now imports types.
- CI (docs gate)'s pull request trigger now also names `.github/workflows/**`, `cli/**`, `components/**`, `package-lock.json`, `package.json`, `styles/**`, `templates/**`, `tests/**`, `tsconfig.json` and `types/**`.
- CI now also runs cli/init.mjs.
- 1 file changed content, across 1 part.

## What comes in

1. **@mcptoolshop/site-theme** (the package people import). Loads types/config.ts, cli/front-door/index.mjs, cli/front-door/mcp.mjs and 21 more.
2. **CI.** On a pull request to main touching 11 paths; on a push to main touching 11 paths; or by hand. Runs cli/init.mjs and tests/; checks types/.
3. **Deploy site to GitHub Pages.** On a push to main touching 2 paths; or by hand. Runs site/astro.config.mjs and site/src/.
4. **Release.** When a release is published; or by hand. Runs tests/; checks types/.
5. **Dogfood.** On a push to main touching 4 paths; or by hand. On main, it runs cli/init.mjs.
6. **CI (docs gate).** On a pull request to main except when only the 10 paths it ignores change; or by hand. Runs only echo.
7. **site-theme** (a command people run). Runs cli/init.mjs.

## What happens through @mcptoolshop/site-theme

1. The package loads cli/front-door/index.mjs and cli/front-door/mcp.mjs in cli, 17 files in components, styles/theme.css in styles, and 4 files in types.
   1. Inside cli/front-door/index.mjs, `main` does, in order:
      1. `verify`
      2. `renderJson`
      3. `renderHuman`
      4. `generate`
      5. `renderStandard`
      6. `runEval`
      7. `runAblationCli`
      8. `startServer`
   2. **`verify`** runs, in order: `finding`, `checkReferences`, `checkMinimality`, `checkDoctest`, `checkAttestation`, `checkGherkin` and `buildScorecard`.
   3. **`runAblationCli`** runs, in order: `syntheticCorpus`, `definePin`, `makeNodeExecutor` and `runAblation`.
2. That reaches lib (1 file).

## Who reads the results

@mcptoolshop/site-theme writes nothing this map can see.

## The other doors

**CI** runs cli/init.mjs and tests/, checks types/, reaches lib, and runs git.

**Deploy site to GitHub Pages** runs site/astro.config.mjs and site/src/, reaches components, lib and types, and deploys the site.

**Release** runs tests/, checks types/, reaches cli and lib, and publishes to npm.

**Dogfood** runs cli/init.mjs on main, runs git, and sends a dispatch to dogfood-lab/testing-os on main.

**CI (docs gate)** runs only echo.

**site-theme** (a command people run) runs cli/init.mjs and runs git.

## What breaks what

- **lib** is imported by 1 part (components), and by 1 more only from tests; it sits on the path of 4 doors.
- **types** is imported by 1 part (the site) and sits on the path of 4 doors.
- **components** is imported by 1 part (the site) and sits on the path of 2 doors.
- **cli** is imported only from tests, by 1 part (tests), and sits on the path of 5 doors.
- **tests** is imported by no other part and sits on the path of 2 doors.

styles holds only CSS files, which this map does not read, so what uses it cannot be seen.

## What tends to change together

No two source files changed together often enough to name.

Window: 180 days; a pair counts from 3 shared commits, since 1 source file reaches 10 revisions; the floor rises to 10 when 25 do.

## What no test touches

- **types** is imported by no test.

styles holds only CSS files, which this map does not read, so whether a test touches it cannot be seen.

## Written but never read

No place this map can see is written, so none goes unread.

## Helpers that look duplicated

No two parts export a helper that looks alike.

## Generated, never hand-edited

Nothing in this repository writes to a tracked place this map can see.

## Hand-authored

People write .claude/, .github/, assets/, docs/, receipts/, the repository root, site/ and templates/; 5 writes with paths built at run time may land here.

## Where to start

.github/workflows/ci.yml → cli/init.mjs → cli/front-door/index.mjs → cli/front-door/verify.mjs → cli/front-door/references.mjs → cli/front-door/extract.mjs

Read those in order to follow one pull request end to end.

## What this map cannot see

- 5 writes and 2 reads use paths built at run time and are not named here.
- 12 writes and 44 reads go to the directory the command is run in, not to this repository.
- 7 writes and 2 reads go to a temporary directory, not to this repository.
- 6 reads go to the directory the command is run in, a temporary directory or a path their caller passes, not to this repository.
- 5 reads go to the directory the command is run in or a temporary directory, not to this repository.
- 2 writes and 2 reads go to a path their caller passes, not to this repository.
- 7 commands are built at run time and not followed, 2 of them in tests.
- Statistics confidence is low: fewer than 25 source files reach 10 revisions in the window.

Regenerate with `npx --yes @dogfood-lab/atlas map`.
