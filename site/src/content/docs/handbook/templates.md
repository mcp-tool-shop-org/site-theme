---
title: Templates
description: Available templates in @mcptoolshop/site-theme and when to use each one.
sidebar:
  order: 2
---

Every template is CI-tested and builds clean out of the box. Pick the one that fits your project, scaffold it, and start editing.

## Available templates

| Template    | Description                                                              | Pages |
|-------------|--------------------------------------------------------------------------|-------|
| **default** | Project landing page with hero, features, and code examples              | 1     |
| **docs**    | Documentation site with sidebar navigation and content sections          | 1     |
| **product** | Marketing landing page with pricing, testimonials, and CTAs              | 1     |
| **portfolio** | Filterable catalog grid for tools, projects, or any collection         | 1     |
| **app**     | Multi-tenant SaaS dashboard with RBAC, feature flags, workspace routing  | 31    |
| **tool**    | CLI / MCP / npm package landing page with commands, workflow, and proof  | 1     |

## Choosing a template

### default

Best for open-source tools and libraries. Ships a single-page landing with a hero section, feature grid, code examples, and API reference cards. This is what most repos in the org use.

```bash
npx @mcptoolshop/site-theme init --template default
```

### docs

A documentation-oriented layout with sidebar navigation and structured content sections. Good for projects that need more than a landing page but less than a full docs site.

```bash
npx @mcptoolshop/site-theme init --template docs
```

### product

Marketing-focused layout with pricing tables, testimonial quotes, and prominent call-to-action sections. Use this when you need to sell or position a product.

```bash
npx @mcptoolshop/site-theme init --template product
```

### portfolio

A filterable, searchable catalog grid. Works for any collection — tools, projects, team members, recipes, courses, integrations. Items support tags, categories, status badges, metadata, and secondary action links.

Features:
- **Tag filtering** — click tags to narrow results
- **Text search** — real-time search across titles and descriptions
- **Category grouping** — optional section headings by category
- **Status badges** — stable, beta, new, archived (or any custom label)
- **Configurable grid** — 2, 3, or 4 columns

```bash
npx @mcptoolshop/site-theme init --template portfolio
```

The scaffold includes 6 demo items across 3 categories. Replace them with your own content in `site-config.ts`:

```typescript
import type { PortfolioSiteConfig } from '@mcptoolshop/site-theme/types/portfolio-config';

export const config: PortfolioSiteConfig = {
  template: 'portfolio',
  title: 'My Catalog',
  // ...
  filterable: true,
  searchable: true,
  groupByCategory: false,
  columns: 3,
  items: [
    {
      title: 'My Item',
      description: 'What it does.',
      href: 'https://example.com',
      tags: ['typescript', 'cli'],
      category: 'Tools',
      status: 'stable',
      meta: 'v1.0.0 · MIT',
    },
  ],
};
```

### tool

Landing page for a CLI, MCP server, or npm package. Ships a hero, three-step quickstart, command list (flat or grouped), an end-to-end workflow, proof (tests / CI / version), and integration snippets.

```bash
npx @mcptoolshop/site-theme init --template tool
```

### app

Full SaaS dashboard scaffold with 31 static pages. Includes workspace routing, role-based access control patterns, feature flag stubs, and a settings panel. Use this as a starting point for dashboard or admin UIs.

```bash
npx @mcptoolshop/site-theme init --template app
```

## Listing templates

To see all available templates from the CLI:

```bash
npx @mcptoolshop/site-theme list-templates
```

## Dry run

Preview what files a template will create without writing to disk:

```bash
npx @mcptoolshop/site-theme init --template product --dry-run
```
