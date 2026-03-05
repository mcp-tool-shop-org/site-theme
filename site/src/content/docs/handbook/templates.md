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
| **app**     | Multi-tenant SaaS dashboard with RBAC, feature flags, workspace routing  | 31    |

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
