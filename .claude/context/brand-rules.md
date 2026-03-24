# Brand Rules — @mcptoolshop/site-theme

## Tone

Functional. Design-aware but not decorative. Site-theme describes what it builds, what it expects, and what breaks if the contract is violated. No marketing language in technical docs.

## Domain language

| Term | Meaning | Never say instead |
|------|---------|-------------------|
| template | One of 5 scaffold starting points (default, docs, product, portfolio, app) | "theme", "skin", "layout" |
| scaffold | The CLI output: a complete Astro site directory | "generate", "create" (too vague) |
| token | A `{{VARIABLE}}` placeholder in .tpl files, replaced during scaffold | "placeholder", "slot" |
| design token | A CSS custom property in theme.css (e.g., `--color-accent`) | "variable", "setting" |
| component | An .astro file that renders UI from typed props | "widget", "module" |
| config | The `site-config.ts` file that drives all page content | "settings", "options" |
| contract | The agreement between template output, types, and components | "interface", "API" |
| set:html | Astro's raw HTML rendering — XSS risk if input unsanitized | "innerHTML", "raw content" |

## Forbidden metaphors

- No "plug and play" language. The theme requires correct config, matching types, and compatible peer deps. It works when the contract is met.
- No "beautiful" or "stunning" for theme output. The theme produces consistent, dark-themed, accessible pages. Aesthetic judgment is subjective.
- No "zero config" language. Config is required — `site-config.ts` drives all content. The theme is zero-design-decision, not zero-config.
- No "enterprise-ready" for the app template. It's a scaffold with stubs. Production deployment requires custom auth and data layers.

## Truth constraints

1. **Template count must be exact.** README says 5 templates. `templates/` must have 5 subdirectories. CI must validate all 5.
2. **Component count must be exact.** README says 17 components. `components/` must have 17 .astro files.
3. **Design token count must be exact.** theme.css defines 11 tokens. Changes require README update.
4. **set:html surface must be documented.** Every component that renders raw HTML must be listed in README's security section.
5. **Scaffold output must build.** If `site-theme init --template X` produces a site, `npm run build` must succeed. CI enforces this.

## Contamination risks

- **"Full framework" drift.** The moment site-theme adds routing conventions, middleware, or runtime state management beyond what Astro provides, it has become a meta-framework.
- **"Design system" drift.** The moment site-theme adds animation libraries, icon packs, or interaction patterns beyond static rendering, it has grown beyond its scope.
- **"CMS" drift.** The moment site-theme adds content editing, preview modes, or draft workflows, it has become a CMS.
