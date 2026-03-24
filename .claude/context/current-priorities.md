# Current Priorities — @mcptoolshop/site-theme

## Active work

- Role OS lockdown (this audit). Fifth repo in org rollout.

## Next up

- None scheduled beyond lockdown.

## Blocked

- Nothing currently blocked.

## Completed recently

- v1.5.0 published (current)
- Portfolio template with filtering/grouping (v1.5)
- DataTable accessibility fix (v1.4)
- App template with RBAC + feature flags (v1.3)
- 56 tests passing
- CI matrix validates all 5 templates

## Banned detours

1. **No runtime content management.** Site-theme scaffolds static sites. No CMS features, no preview modes, no draft workflows.
2. **No custom routing layer.** Astro handles routing. No meta-framework routing conventions.
3. **No animation or interaction libraries.** Components are static render. No Framer Motion, no GSAP, no client-side transition libraries.
4. **No authentication implementation.** The app template provides auth stubs. Production auth is consumer responsibility.
5. **No external CDN dependencies.** All assets are local. No Google Fonts, no CDN-hosted scripts, no external stylesheets.

## Must-preserve invariants

These cannot be traded away without explicit human approval:

1. **5 templates, CI-validated.** Each template must scaffold → build successfully. CI matrix enforces this.
2. **17 components with stable prop interfaces.** Removing a required prop is a major version change.
3. **11 design tokens.** Adding tokens is minor. Removing or renaming is major.
4. **7 token substitution keys.** CLI replaces exactly these 7 `{{VARIABLE}}` patterns. Adding keys is minor. Removing or renaming is major.
5. **SiteConfig discriminated union.** Template field discriminates. Default template has `template` optional (backward compat). New templates are additive.
6. **Scaffold safety: dies if site/ exists.** No silent overwrite of existing sites.
7. **Path traversal protection.** CLI rejects template paths that escape the templates/ directory.
8. **set:html surface is documented.** Every component with raw HTML rendering is listed in README security section.
9. **Starter-pack, CLI, and docs must remain synchronized.** Changes to templates, components, types, or tokens require updates to all consuming surfaces.

## Validation law

- `npm test` runs 56 tests
- `npm run typecheck` validates type definitions
- CI matrix: scaffold + build all 5 templates
- No browser-based validation
