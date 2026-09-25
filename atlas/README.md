# site-theme: how it works

Mapped at 2026-09-25 from commit dbaeea5.

## What this is

14 parts, mostly JavaScript (51 files) and TypeScript (20). Work enters through 7 doors; CI, Release and @mcptoolshop/site-theme each reach 4 parts, and CI is followed because a pull request goes through it. It publishes to npm. People run site-theme. People import @mcptoolshop/site-theme.

## What changed since the last map

This is the first map.

## What comes in

1. **CI.** On a pull request to main touching 11 paths; on a push to main touching 11 paths; or by hand. Runs tests/; checks types/.
2. **Release.** When a release is published; or by hand. Runs tests/; checks types/.
3. **Deploy site to GitHub Pages.** On a push to main touching 2 paths; or by hand. Runs site/astro.config.mjs and site/src/.
4. **Dogfood.** On a push to main touching 4 paths; or by hand. On main, it runs cli/init.mjs.
5. **CI (docs gate).** On a pull request to main; or by hand. Runs no file this map can see.
6. **@mcptoolshop/site-theme** (the package people import). Loads types/config.ts, cli/front-door/index.mjs, cli/front-door/mcp.mjs and 21 more.
7. **site-theme** (a command people run). Runs cli/init.mjs.

## What happens through CI

1. The workflow runs tests/ in tests; it checks types/ in types.
2. That reaches cli (24 files) and lib (1 file).

## Who reads the results

CI writes nothing this map can see.

## The other doors

**Release** runs tests/, checks types/, reaches cli and lib, and publishes to npm.

**Deploy site to GitHub Pages** runs site/astro.config.mjs and site/src/, and deploys the site.

**Dogfood** runs cli/init.mjs on main, runs git, and sends a dispatch to dogfood-lab/testing-os on main.

**CI (docs gate)** runs no file this map can see.

**@mcptoolshop/site-theme** (the package people import) loads types/config.ts, cli/front-door/index.mjs, cli/front-door/mcp.mjs and 21 more.

**site-theme** (a command people run) runs cli/init.mjs and runs git.

## What breaks what

- **cli** is imported only from tests, by 1 part (tests), and sits on the path of 5 doors.
- **types** is imported by no other part and sits on the path of 3 doors.
- **lib** is imported only from tests, by 1 part (tests), and sits on the path of 2 doors.
- **tests** is imported by no other part and sits on the path of 2 doors.

## What tends to change together

- **cli/init.mjs** and **tests/cli.test.mjs** changed together in 5 of 8 commits, and the tests part imports the cli part.

Confidence is low: fewer than 20 source files reach 10 revisions in the window.

Window: 180 days; a pair counts from 3 shared commits, since 1 source file reaches 10 revisions; the floor rises to 10 when 25 do.

## What no test touches

- **types** is imported by no test.

## Written but never read

No place this map can see is written, so none goes unread.

## Helpers that look duplicated

No two parts export a helper that looks alike.

## Generated, never hand-edited

Nothing in this repository writes to a tracked place this map can see.

## Hand-authored

People write .claude/, .github/, assets/, docs/, receipts/, the repository root, site/ and templates/; 5 writes with paths built at run time may land here.

## Where to start

cli/init.mjs → cli/front-door/index.mjs

Read those in order to follow one run of site-theme end to end. This path follows site-theme (a command people run) from its entry, since CI runs only tests and checks.

## What this map cannot see

- 1 import could not be resolved: `site/src/site-config.ts` imports `@mcptoolshop/site-theme`, which no workspace member provides.
- 5 writes and 2 reads use paths built at run time and are not named here.
- 12 writes and 44 reads go to the directory the command is run in, not to this repository.
- 7 writes and 2 reads go to a temporary directory, not to this repository.
- 6 reads go to the directory the command is run in, a temporary directory or a path their caller passes, not to this repository.
- 5 reads go to the directory the command is run in or a temporary directory, not to this repository.
- 2 writes and 2 reads go to a path their caller passes, not to this repository.
- 7 commands are built at run time and not followed, 2 of them in tests.
- Statistics confidence is low: fewer than 20 source files reach 10 revisions in the window.

Regenerate with `npx --yes @dogfood-lab/atlas map`.
