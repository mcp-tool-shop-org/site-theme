# Workflow: Protect Scaffold Contract

## Use when

A proposed change touches any of these paths:
- `templates/` — any modification to .tpl files, template structure, or new templates
- `types/` — any modification to SiteConfig, component prop types, or section definitions
- `components/` — any modification to Astro components, especially prop interfaces or set:html usage
- `styles/theme.css` — any modification to design tokens
- `cli/init.mjs` — any modification to scaffold logic, token substitution, or safety guards

## Required chain

1. **Frontend Developer** — implements the change
2. **Test Engineer** — verifies scaffold → build for all affected templates
3. **Critic Reviewer** — reviews against reject criteria below

Add **Brand Guardian** if the change affects design tokens, visual layout, or org branding assumptions.

## Required review checks

The Critic must verify ALL of the following against evidence (not impression):

- [ ] All 5 templates still scaffold successfully (`site-theme init --template X`)
- [ ] All 5 scaffolded sites still build successfully (`npm run build`)
- [ ] SiteConfig discriminated union in `types/config.ts` matches all template configs
- [ ] Component prop interfaces match what templates pass to them
- [ ] 11 design tokens in `theme.css` are all still defined
- [ ] 7 token substitution keys in `cli/init.mjs` are all still present in .tpl files
- [ ] CLI still dies if `site/` already exists (no silent overwrite)
- [ ] Path traversal guard still active
- [ ] set:html components are listed in README security section
- [ ] `npm test` passes all 56+ tests
- [ ] CI template validation matrix still covers all 5 templates

## Reject criteria — automatic reject

A change is **automatically rejected** if it:

1. **Breaks scaffold → build for any template.** If `site-theme init --template X && npm run build` fails for any of the 5 templates, the change is rejected. CI enforces this.

2. **Removes or renames a component prop without major version bump.** Component prop interfaces are contract surfaces. Consumers depend on them. Removal or rename requires a major version.

3. **Removes or renames a design token without major version bump.** `--color-accent`, `--color-surface`, etc. are consumed by every site using the theme. Removal or rename requires a major version.

4. **Removes or renames a token substitution key.** The 7 `{{VARIABLE}}` keys are the scaffold contract between CLI and templates. Changing a key name breaks all templates that use it.

5. **Produces scaffold output that doesn't match the SiteConfig type.** If a template's `site-config.ts` references fields not in the corresponding type definition, or misses required fields, the scaffold is broken even if it builds (TypeScript may not catch runtime shape issues in `.ts` config files).

6. **Adds set:html rendering without documenting in README security section.** Raw HTML rendering is an XSS surface. Every component that uses set:html must be listed.

7. **Removes scaffold safety guards.** The "die if site/ exists" check and path traversal guard are safety-critical. Removing either allows silent overwrite or directory escape.

8. **Makes human-facing reassurance stronger while leaving scaffold semantics unchanged.** A change that rewrites docs to sound more reliable while the scaffold contract hasn't improved is a truth regression.

9. **Reduces CI matrix coverage or weakens the multi-template contract check.** Removing a template from the CI validation matrix, weakening the build step (e.g., skipping `npm run build`), or marking template validation as `continue-on-error`. The liar-path for this repo is "works for the template I touched" while the broader scaffold contract erodes.

## Doctrine references

- Scaffold CLI: `cli/init.mjs` (7 token keys, safety guards)
- Type contract: `types/config.ts` (SiteConfig discriminated union)
- Design tokens: `styles/theme.css` (11 tokens)
- Component contract: `components/*.astro` (17 components, 5 with set:html)
- Template validation: `.github/workflows/ci.yml` (matrix: 5 templates)
- Lockdown doctrine: `role-os-rollout/DOCTRINE.md`
