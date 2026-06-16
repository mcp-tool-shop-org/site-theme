# AGENTS.md

Operating notes for agents working on `@mcptoolshop/site-theme`.

## Setup

```bash
npm ci
```

## Verify

```bash
npm test                              # vitest (unit + CLI integration)
npm run typecheck                     # tsc --noEmit (types/ only)
npm run lint                          # biome
node cli/init.mjs front-door verify   # the repo's own front door must stay clean
```

## Conventions

- The CLI and `cli/front-door/` are zero-dependency `.mjs` (Node built-ins only). Keep the front-door verifier astro-free so consumers can import it without Astro.
- Components ship as source `.astro` (no build step); the consuming site's Tailwind scans them via `@source`.
- New templates live under `templates/` and are auto-discovered via a `template.json`.

## Boundaries

- Do not add runtime dependencies — only peerDeps (astro, tailwindcss, @tailwindcss/vite).
- Do not bump astro to clear an audit advisory; pin via package `overrides`.
- Publishing is OIDC Trusted Publishing bound to the `release.yml` workflow filename.
