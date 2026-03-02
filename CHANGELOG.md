# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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
