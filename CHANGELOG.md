# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.2.0] - 2026-09-05

### Added
- **`<slot name="head"/>` on BaseLayout** — consumers inject OG images, Twitter cards, JSON-LD, or preconnect hints without forking the layout ([#5](https://github.com/mcp-tool-shop-org/site-theme/issues/5)).
- **`packageUrl` / `packageLabel`** on every SiteConfig variant and on BaseLayout — registry-agnostic package link (PyPI, crates.io, npm, RubyGems, Maven Central, …). `npmUrl` is a deprecated alias ([#4](https://github.com/mcp-tool-shop-org/site-theme/issues/4)).
- Default Open Graph tags (`og:title`, `og:description`, `og:type`) and `color-scheme: dark` on BaseLayout.
- Default `favicon.svg` copied into `site/public/` by `init`.
- `npm run verify` — typecheck + test + lint + front-door verify in one command.

### Changed
- Header/footer package button label is derived from the registry host instead of being hardcoded as "npm".
- Landing page and handbook copy list all six templates (adds `tool`, and `portfolio` where it was missing).
- Scaffolded `site/package.json` now pins `@mcptoolshop/site-theme` to the CLI's own version instead of a stale 1.x range.
- New scaffolds and this repo's dogfood `site/` run **Astro 7.3** (patched XSS surface) with Starlight **0.42**. The handbook CLI wraps Starlight's sidebar `autogenerate` in `items: [...]` (required since 0.39). Existing consumers stay on `peerDependencies.astro >= 5`.
- SECURITY.md and the README threat model cover the front-door MCP server and opt-in doctest execution.
- Supported versions in SECURITY.md: 2.x.

### Fixed
- High-severity transitives in the engine tree (`nanoid`, `postcss`, `js-yaml`, `sharp`, `svgo`) pinned via `overrides`. The published package still has zero runtime dependencies. CI `npm audit` now uses `--omit=peer` so consumer-side Astro XSS advisories do not fail this package's own gate.

## [2.1.0] - 2026-06-16

### Added
- **front-door MCP server** — an agent-callable surface for the verifier. `front-door mcp` starts a hand-rolled, zero-dependency MCP server (newline-delimited JSON-RPC over stdio) exposing `front_door_verify` (returns the structured scorecard) and `front_door_standard`. Also exported at `@mcptoolshop/site-theme/front-door/mcp`. The core package stays zero-dep — no MCP SDK / `zod`.
- **Executable doctest channel** — `front-door verify --run-doctests` (programmatic `verify({ root, runDoctests: true })`) now compiles/runs fenced JS examples rustdoc-style: examples importing only Node builtins + this package are executed in a child process; third-party/relative-import or `no_run` examples are compile-checked (`node --check`, never resolving imports, so nothing is installed); a `+SKIP` / `ignore` example is reported **UNBACKED**, not passing. Opt-in and safe — default `verify` stays read-only, with a per-example timeout and no network/install.
- **Executable ablation runner** — `front-door ablation` implements the three-arm docs-on/off protocol from `EVAL.md` (`--instances` / `--seed`) and emits a receipt.

### Notes
- Minor bump: new agent surface + opt-in execution channels; the verify gate and programmatic API are backward-compatible (default `verify` behavior is unchanged).

## [2.0.0] - 2026-06-16

### Added
- **front-door** — a second pillar: the AI-native front-door verifier for a repo's README, `AGENTS.md`, and `llms.txt`.
  - `front-door verify` routes documented claims to evidence channels (references, minimality, doctest, attestation, gherkin), reports a risk-ordered four-bucket scorecard, and exits non-zero when the gate fails.
  - `front-door init` scaffolds a minimal, verify-clean front door; `front-door standard` prints the spine; `front-door eval` runs the verifier self-eval and emits a receipt.
  - Programmatic `verify()` exported at `@mcptoolshop/site-theme/front-door` (consumed by shipcheck's AI-native gate).
- **`tool` template** — a 6th template for CLI / MCP / npm package landing pages, with `ToolSiteConfig` (commands, workflow, proof, integration sections).
- **AGENTS.md** for this repo, dogfooding the front-door standard.

### Notes
- Major bump signals the new front-of-house pillar; the theme + template API is backward-compatible.

## [1.7.0] - 2026-06-13

### Added
- **Skip-to-content link** in `BaseLayout`: visually hidden until focused, first `<body>` child, targets `<main id="main" tabindex="-1">` (WCAG 2.4.1 bypass blocks).
- **Mobile header navigation** in `BaseLayout`: a JS-free `<details>`/`<summary>` disclosure menu (shown below `md`) exposing the in-page nav links and npm shortcut that were previously `hidden md:flex` with no small-screen fallback.
- **"Opens in a new tab" affordance** on every external (`target="_blank"`) header/footer link via a visually-hidden `<span class="sr-only">` (WCAG 3.2.5).

### Changed
- **Branded focus ring** on all interactive controls in `BaseLayout` (brand/nav/header buttons/footer links + mobile menu items) and `Hero` (both CTAs): `focus-visible:ring-2 ring-accent ring-offset-2 ring-offset-surface`, replacing the low-prominence UA default outline on the dark surface (WCAG 2.4.7).

## [1.6.1] - 2026-03-27

### Fixed
- Biome lint formatting in handbook command

## [1.6.0] - 2026-03-27

### Added
- **`handbook` command**: `npx @mcptoolshop/site-theme handbook` layers Starlight docs onto an existing site-theme site
- Scaffolds content.config.ts with docsLoader() (prevents silent 404s)
- Scaffolds starlight-custom.css with accent color from `--accent` flag
- Rewrites astro.config.mjs with Starlight integration
- Creates 3 starter handbook pages (index, getting-started, reference)
- Patches site-config.ts secondaryCta to link to handbook
- Adds @astrojs/starlight dependency to site/package.json
- `--accent` flag with 7 color presets: emerald, amber, blue, rose, violet, cyan, pink
- `--dry-run` support for handbook command
- 10 new handbook tests (guards, dry-run, file creation, token replacement, accent colors)

## [1.5.1] - 2026-03-25

### Added
- Version alignment test suite (3 tests)

### Changed
- SHA-pin dogfood workflow actions (checkout, setup-node) for supply chain security

## [1.5.0] - 2026-03-19

### Added

- **portfolio** template: filterable catalog grid for tools, projects, team members, recipes, or any collection
- **FilterBar** component: client-side tag filtering + text search with `data-*` attribute matching
- **PortfolioGrid** component: configurable card grid with status badges, category grouping, image/badge fallbacks, and secondary actions
- `PortfolioSiteConfig` type added to the `SiteConfig` discriminated union
- `PortfolioItem` type with generic fields (tags, categories, status, meta) for any content type
- Handbook pages for portfolio template and new components
- CI validates portfolio template scaffolding

## [1.4.0] - 2026-03-19

### Added

- **Test suite**: 56 tests via vitest covering CLI arg parsing, template scaffolding, token replacement helpers, RBAC policy, feature flags, and workspace model
- **TypeScript checking**: root tsconfig.json with strict mode, `tsc --noEmit` in CI validates exported types
- **Props interfaces**: all 15 shared Astro components now declare `interface Props` for IDE autocomplete and compile-time safety
- **Biome linter**: lint + format enforcement for cli/, types/, tests/ with CI integration
- **CLI --help/-h and --version/-V flags**
- **CLI path traversal guard**: `--template` validates resolved path stays within templates/
- **set:html security docs**: README documents which props accept raw HTML and recommends sanitization

### Fixed

- **Accessibility**: DataTable converted from div-grid to semantic `<table>` with `<thead>`/`<tbody>`/`<th>`/`<td>`
- **Accessibility**: ARIA labels added to all `<nav>` elements (main, footer, sidebar, table of contents)
- **Accessibility**: `aria-label` on mobile sidebar toggle, `aria-hidden` on decorative PricingGrid checkmark
- **Supply chain**: all GitHub Actions SHA-pinned (no mutable tag refs)
- **Secrets safety**: `.env` / `.env.*` added to `.gitignore`
- **CLI**: `execSync` for git calls now has 5s timeout
- **Types**: removed unused `CtaDef` import from docs-config.ts

### Changed

- CI now runs typecheck, lint, and test steps (no longer `--if-present`)
- `tests/**` and `tsconfig.json` added to CI paths trigger

## [1.3.1] - 2026-03-02

### Changed

- README: updated tagline and app template description for v1.3.0
- package.json: updated description and keywords
- Landing page: updated hero, features, added templates data-table section
- All 7 translations refreshed

## [1.3.0] - 2026-03-02

### Added

- Multi-tenant workspace routing: all app pages under `/app/[workspace]/`
- RBAC policy layer (`canViewBilling`, `canManageTeam`, `canManageWorkspace`)
- Feature flag registry with `isEnabled()` gating (`billing`, `teams`, `auditLog`, `apiKeys`)
- Centralized data layer: `listProjects()`, `getMetrics()`, `getActivity()` — workspace-keyed
- `getAllProjectParams()` for cartesian `getStaticPaths()` (workspace × project ID)
- `AccessDenied` component for RBAC-blocked pages
- In-shell 404 catch-all (`[...rest].astro`) with "Back to Dashboard" link
- Billing page RBAC gate — renders AccessDenied if user lacks permission
- Workspace plan badges in switcher (`starter`, `pro`, `business`)
- Path-preserving workspace switcher (keeps current sub-route on switch)

### Changed

- `site.config.ts`: static nav replaced with `getNav(workspace)` / `getSettingsNav(workspace)` functions
- `workspaces.ts`: URL is source of truth (removed localStorage persistence)
- Workspace slugs shortened: `acme`, `startup`, `side-project`
- All components now accept `workspace: string` prop (threaded through layouts)
- `SettingsNav` filters links by feature flags and RBAC role
- `Sidebar` filters links by feature flags

### Removed

- Flat `/app/` route pages (replaced by `/app/[workspace]/` routes)
- `getActiveWorkspace()` / `setActiveWorkspace()` localStorage functions

## [1.2.0] - 2026-03-02

### Added

- **app** template: SaaS dashboard with auth, workspace switcher, projects, and settings
- Recursive directory copy mode for templates with nested `site/` structure
- `walkDir()` helper with ignore lists and path escape guard
- `shouldTokenReplace()` with text extension allowlist and null byte fallback
- 11 app components: Sidebar, Topbar, WorkspaceSwitcher, UserMenu, Breadcrumbs, StatCards, DataTable, EmptyState, SettingsNav, FormField, PlanCards
- 3 layouts: AuthLayout, AppShell, SettingsLayout
- 11 pages: index redirect, 3 auth pages, dashboard, projects list/detail, 4 settings pages
- Client-side auth stub (cookie-based) with flash-prevention guard
- Workspace switcher with localStorage persistence

## [1.1.2] - 2026-03-02

### Fixed

- CI template validation uses `npm pack` + local tarball install (no npm registry dependency)

## [1.1.1] - 2026-03-02

### Added

- `list-templates --json` for automation-friendly output
- `init --dry-run` to preview files and variables without writing
- `init --out <dir>` to scaffold into a different directory

### Fixed

- CI template validation: replaced `npm init` with direct package.json creation

## [1.1.0] - 2026-03-02

### Added

- Multi-template support: `--template` flag and `list-templates` command
- **docs** template: sidebar navigation, content sections, anchor links
- **product** template: hero, social proof, pricing grid, testimonials, CTA banner
- 8 new components: DocLayout, Sidebar, TableOfContents, ContentSection, SocialProof, PricingGrid, TestimonialGrid, CtaBanner
- `template.json` metadata per template for discoverability
- Type definitions: `DocsSiteConfig`, `ProductSiteConfig` (discriminated union with `DefaultSiteConfig`)

### Changed

- Templates restructured into `templates/default/`, `templates/docs/`, `templates/product/`
- CLI refactored with subcommand dispatch (`init`, `list-templates`)
- `SiteConfig` is now a union type; existing configs remain backward compatible

## [1.0.0] - 2026-02-27

### Overview

**First stable release.** Config-driven Astro theme for MCP Tool Shop landing pages.

### Added

- Shipcheck audit — SHIP_GATE.md, SCORECARD.md, SECURITY.md
- Security & Data Scope section in README

### Changed

- Version promoted from 0.3.5 to 1.0.0

## [0.3.5] - 2026-02-26

### Added

- BaseLayout, Hero, Section, FeatureGrid, DataTable, CodeCardGrid, ApiList components
- Semantic design tokens via CSS custom properties
- `init` CLI for scaffolding new sites
- GitHub Pages workflow template
- Tailwind CSS v4 integration
