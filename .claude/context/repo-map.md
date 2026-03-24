# Repo Map — @mcptoolshop/site-theme

## Stack

- Runtime: Node.js >= 18.0.0 (ESM)
- Framework: Astro >= 5.0.0 + Tailwind CSS >= 4.0.0 (peer deps)
- Build: tsc (typecheck only, no emit)
- Test framework: Vitest (56 tests)
- Linting: Biome

## Structure

```
components/               # 17 Astro components
  BaseLayout.astro        # Full page shell (header, footer, nav)
  Hero.astro              # Gradient hero with CTAs
  Section.astro           # Section wrapper
  FeatureGrid.astro       # 3-column cards
  DataTable.astro         # Semantic table
  CodeCardGrid.astro      # Dark code block cards
  ApiList.astro           # API reference cards
  DocLayout.astro         # Docs page with sidebar/TOC
  Sidebar.astro           # Vertical nav
  TableOfContents.astro   # Auto-generated TOC
  ContentSection.astro    # Raw HTML content wrapper
  SocialProof.astro       # Social proof badges
  PricingGrid.astro       # Pricing tier cards
  TestimonialGrid.astro   # Testimonial cards
  CtaBanner.astro         # Bottom CTA banner
  FilterBar.astro         # Client-side tag filter + search
  PortfolioGrid.astro     # Portfolio card grid with grouping
styles/
  theme.css               # 11 design tokens (Tailwind v4 @theme)
types/
  config.ts               # SiteConfig discriminated union (default|docs|product|portfolio)
  docs-config.ts          # DocsSiteConfig interface
  portfolio-config.ts     # PortfolioSiteConfig interface
  product-config.ts       # ProductSiteConfig interface
cli/
  init.mjs                # CLI entry — scaffold, list-templates (392 lines)
templates/
  default/                # Landing page template (flat .tpl)
  docs/                   # Documentation template (flat .tpl)
  product/                # Product/marketing template (flat .tpl)
  portfolio/              # Portfolio template (flat .tpl)
  app/site/               # SaaS app template (recursive, 31 files)
tests/
  *.test.mjs, *.test.ts   # 56 tests
```

## Build commands

| Command | What it does |
|---------|-------------|
| `npm test` | Vitest (56 tests) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run verify` | typecheck + test + npm pack dry-run |

## Primary seam: Scaffold contract integrity

This is the highest-risk seam. Every org repo's landing page and handbook is produced by `site-theme init`. If the scaffold produces a site that doesn't match what the theme components expect, the site breaks at build time — or worse, builds but renders incorrectly.

**The scaffold contract:**

| Surface | What it defines | Must agree with |
|---------|----------------|-----------------|
| Template .tpl files | File structure, imports, config shape | Types, components |
| Types (config.ts) | SiteConfig discriminated union, prop interfaces | Template config, component props |
| Components (*.astro) | Rendered UI, expected props | Types, template config |
| Design tokens (theme.css) | 11 CSS custom properties | Component styles, consumer overrides |
| CLI token substitution | 7 `{{VARIABLE}}` keys | Template .tpl files |
| CI template validation | Scaffold → build for each template | All of the above |

A change to any surface that breaks agreement with another is a scaffold contract breach.

**Known hardcoded org assumptions:**
- `site: 'https://mcp-tool-shop-org.github.io'` in astro.config.mjs.tpl
- Footer credits mcp-tool-shop-org in site-config.ts.tpl
- GitHub Pages deployment workflow in pages.yml.tpl
- These are intentional and documented, not hidden.

## Key invariants

| File | Invariant |
|------|-----------|
| `cli/init.mjs` | 7 token substitution keys (PACKAGE_NAME, BRAND_NAME, DESCRIPTION, REPO_URL, NPM_URL, LOGO_BADGE, BASE_PATH). Dies if site/ exists. Path traversal guarded. |
| `types/config.ts` | SiteConfig is a discriminated union on `template` field. Default template has `template` optional (backward compat). |
| `styles/theme.css` | 11 design tokens. Consumer overrides via `@theme { ... }` in their global.css. |
| Components | 5 components render raw HTML via `set:html` (BaseLayout, Hero, CodeCardGrid, ApiList, ContentSection). Consumer must sanitize. |
| CI `ci.yml` | Matrix validates all 5 templates: scaffold → install → build. If any template fails to build, CI fails. |

## Secondary seams

### 1. Token substitution fragility (cli/init.mjs)
`{{VARIABLE}}` replacement is regex-based. If a template file contains a literal `{{PACKAGE_NAME}}` that shouldn't be replaced (e.g., in documentation text), it gets replaced anyway.

### 2. set:html XSS surface (5 components)
Components accept raw HTML. Theme documents this but doesn't sanitize. Consumer responsibility.

### 3. Peer dependency version coupling
Theme requires Astro >=5 and Tailwind >=4. If consumer's lock file pins older versions, build may fail with unclear errors.

## Validation law

- `npm test` runs 56 tests (CLI, helpers, app template logic)
- `npm run typecheck` validates type definitions
- CI matrix validates all 5 templates scaffold + build
- No browser-based validation in tests (static build verification only)
