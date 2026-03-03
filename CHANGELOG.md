# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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
