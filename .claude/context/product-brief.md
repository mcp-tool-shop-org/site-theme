# Product Brief — @mcptoolshop/site-theme

## What this is

A multi-template Astro toolkit for the org. 5 templates (landing, docs, product, portfolio, SaaS app), 17 Astro components, 11 design tokens, and a CLI scaffold that produces build-ready sites from `site-theme init`. Every repo's landing page and handbook runs on this theme.

## Thesis

Org repos need landing pages and handbooks. Building each from scratch is wasteful and produces inconsistent results. Site-theme provides a scaffold contract: run `init`, fill `site-config.ts`, and get a working site that matches org visual identity. The theme owns layout and style; the consumer owns content and configuration.

## Target user

- Repo maintainers running `site-theme init` to create a landing page or handbook
- The full treatment protocol (Phase 2-3: scaffold landing page + handbook)
- Any org repo that needs a static site deployed to GitHub Pages

## Core value

One CLI command scaffolds a site. One config file controls all content. Build and deploy are pre-configured. No design decisions needed — the theme makes them.

## Non-goals

- Site-theme is not a CMS. It scaffolds static sites from templates. No runtime content management.
- Site-theme is not a generic Astro theme. It's built for the org's specific needs (landing pages, handbooks, product sites).
- Site-theme is not a hosting service. It produces static files; GitHub Pages deploys them.
- Site-theme is not a security layer. Components render raw HTML via `set:html`; consumers are responsible for sanitization.

## Anti-thesis — what this product must never become

1. **A framework with its own routing conventions.** The site is Astro. The routing is Astro's. Site-theme provides components and templates, not a meta-framework.
2. **A scaffold that produces sites it can't build.** If `site-theme init --template X` produces a site, that site must `npm run build` without errors. CI validates this for every template on every push.
3. **A theme that breaks consuming sites on minor updates.** Component prop interfaces, design token names, and config type shapes are contract surfaces. Removing a required prop or token is a major version change.
4. **A tool that hides its org-specific assumptions.** The templates assume GitHub Pages, mcp-tool-shop-org domain, and MIT licensing. These are documented and token-replaceable, not hidden.
5. **A tool where scaffold output drifts from theme expectations.** If a template's `site-config.ts` references a config shape that the type system doesn't define, or a component prop that doesn't exist, the scaffold is broken.
