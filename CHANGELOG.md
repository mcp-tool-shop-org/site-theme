# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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
