---
title: Configuration
description: SiteConfig reference and section types for @mcptoolshop/site-theme.
sidebar:
  order: 5
---

All page content lives in a single `site-config.ts` file. The theme renders your site from this configuration object. The shape of the config depends on which template you are using.

## DefaultSiteConfig

Used by the **default** template. Defines metadata, header/footer content, the hero section, and an array of content sections.

```typescript
import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '@mcptoolshop/my-tool',
  description: 'What my tool does.',
  logoBadge: 'MT',
  brandName: 'my-tool',
  repoUrl: 'https://github.com/mcp-tool-shop-org/my-tool',
  packageUrl: 'https://www.npmjs.com/package/@mcptoolshop/my-tool',
  footerText: 'MIT Licensed',

  hero: { /* ... */ },
  sections: [ /* ... */ ],
};
```

### Top-level fields

| Field         | Type     | Required | Description                        |
|---------------|----------|----------|------------------------------------|
| `template`    | `string` | no       | Omit or set to `'default'`         |
| `title`       | `string` | yes      | Page title (used in `<title>`)     |
| `description` | `string` | yes      | Meta description                   |
| `logoBadge`   | `string` | yes      | 1-2 character header badge         |
| `brandName`   | `string` | yes      | Name in header                     |
| `repoUrl`     | `string` | yes      | GitHub repo URL                    |
| `packageUrl`  | `string` | no       | Primary registry listing (npm, PyPI, crates.io, …) |
| `packageLabel`| `string` | no       | Optional package-button label      |
| `npmUrl`      | `string` | no       | Deprecated alias for `packageUrl`  |
| `footerText`  | `string` | yes      | Footer text (HTML allowed)         |

### Hero fields

| Field             | Type                | Required | Description                  |
|-------------------|---------------------|----------|------------------------------|
| `badge`           | `string`            | yes      | Status badge text            |
| `headline`        | `string`            | yes      | Main headline                |
| `headlineAccent`  | `string`            | yes      | Muted suffix                 |
| `description`     | `string`            | yes      | Description (HTML allowed)   |
| `primaryCta`      | `{ href, label }`   | yes      | Primary button               |
| `secondaryCta`    | `{ href, label }`   | yes      | Secondary button             |
| `previews`        | `{ label, code }[]` | no       | Code preview cards           |

### Section types

The `sections` array accepts objects with a `kind` field that determines which component renders.

| Kind          | Component     | Additional props                              |
|---------------|---------------|-----------------------------------------------|
| `features`    | FeatureGrid   | `features: { title, desc }[]`                 |
| `data-table`  | DataTable     | `columns: string[]`, `rows: string[][]`       |
| `code-cards`  | CodeCardGrid  | `cards: { title, code }[]`                    |
| `api`         | ApiList       | `apis: { signature, description }[]`          |

#### Common section fields

Every section object shares these fields:

| Field      | Type     | Required | Description                |
|------------|----------|----------|----------------------------|
| `kind`     | `string` | yes      | Section type (see above)   |
| `id`       | `string` | yes      | Anchor ID for navigation   |
| `title`    | `string` | yes      | Section heading            |
| `subtitle` | `string` | no       | Text below the heading     |

Sections render in the order they appear in the array.

### Example: features section

```typescript
{
  kind: 'features',
  id: 'features',
  title: 'What you get',
  subtitle: 'Everything a project landing page needs.',
  features: [
    { title: 'Dark by default', desc: 'Semantic design tokens for full reskinning.' },
    { title: 'GitHub Pages ready', desc: 'CI workflow included in the scaffold.' },
    { title: 'Fully customizable', desc: 'Every value is a CSS custom property.' },
  ],
}
```

### Example: code-cards section

```typescript
{
  kind: 'code-cards',
  id: 'quick-start',
  title: 'Quick start',
  cards: [
    { title: 'Install', code: 'npx @mcptoolshop/site-theme init' },
    { title: 'Run', code: 'cd site && npm run dev' },
  ],
}
```

### Navigation

The header nav is generated automatically from the `sections` array. Each section's `id` and `title` become a nav link pointing to `#id`.

---

## DocsSiteConfig

Used by the **docs** template. Adds a sidebar navigation structure and uses `DocsSection` content blocks instead of the default section kinds.

```typescript
import type { DocsSiteConfig } from '@mcptoolshop/site-theme/types/docs-config';

export const config: DocsSiteConfig = {
  template: 'docs',
  title: 'My Docs',
  description: 'Documentation for my tool.',
  logoBadge: 'MD',
  brandName: 'my-docs',
  repoUrl: 'https://github.com/mcp-tool-shop-org/my-tool',
  footerText: 'MIT Licensed',
  sidebar: [
    { title: 'Guide', items: [{ label: 'Getting Started', href: '#getting-started' }] },
  ],
  sections: [
    { id: 'getting-started', title: 'Getting Started', content: '<p>Welcome...</p>' },
  ],
};
```

### Docs-specific fields

| Field      | Type              | Required | Description                                |
|------------|-------------------|----------|--------------------------------------------|
| `template` | `'docs'`          | yes      | Template discriminant                      |
| `sidebar`  | `SidebarGroup[]`  | yes      | Navigation groups for the sidebar          |
| `sections` | `DocsSection[]`   | yes      | Content sections rendered in the main area |

**SidebarGroup shape:** `{ title: string, items: { label: string, href: string }[] }`

**DocsSection shape:**

| Field      | Type                        | Required | Description                              |
|------------|-----------------------------|----------|------------------------------------------|
| `id`       | `string`                    | yes      | Anchor ID                                |
| `title`    | `string`                    | yes      | Section heading                          |
| `content`  | `string`                    | yes      | HTML content (rendered via set:html)     |
| `headings` | `{ text, id, depth }[]`     | no       | Sub-headings for TOC generation          |

---

## ProductSiteConfig

Used by the **product** template. Adds marketing-focused blocks: social proof, pricing, testimonials, and a CTA banner.

```typescript
import type { ProductSiteConfig } from '@mcptoolshop/site-theme/types/product-config';

export const config: ProductSiteConfig = {
  template: 'product',
  title: 'My Product',
  description: 'The best product.',
  logoBadge: 'MP',
  brandName: 'my-product',
  repoUrl: 'https://github.com/mcp-tool-shop-org/my-product',
  footerText: 'MIT Licensed',
  hero: { /* ... */ },
  socialProof: { stats: [{ value: '10K+', label: 'Downloads' }] },
  features: [{ title: 'Fast', desc: 'Blazing fast builds.' }],
  pricing: { headline: 'Pricing', tiers: [ /* ... */ ] },
  testimonials: [{ quote: 'Great tool!', author: 'Jane', role: 'Engineer' }],
  ctaBanner: { headline: 'Get started', cta: { href: '#', label: 'Try it' } },
};
```

### Product-specific fields

| Field          | Type                | Required | Description                     |
|----------------|---------------------|----------|---------------------------------|
| `template`     | `'product'`         | yes      | Template discriminant           |
| `hero`         | `HeroDef`           | yes      | Hero section                    |
| `socialProof`  | `SocialProofDef`    | no       | Trust signals / stats bar       |
| `features`     | `{ title, desc }[]` | no       | Feature highlight cards         |
| `pricing`      | `PricingDef`        | no       | Pricing tiers                   |
| `testimonials` | `TestimonialDef[]`  | no       | Testimonial quotes              |
| `ctaBanner`    | `CtaBannerDef`      | no       | Bottom call-to-action banner    |

---

## PortfolioSiteConfig

Used by the **portfolio** template. Configures a filterable, searchable grid of items with optional category grouping.

```typescript
import type { PortfolioSiteConfig } from '@mcptoolshop/site-theme/types/portfolio-config';

export const config: PortfolioSiteConfig = {
  template: 'portfolio',
  title: 'My Catalog',
  description: 'All our tools.',
  logoBadge: 'MC',
  brandName: 'catalog',
  repoUrl: 'https://github.com/mcp-tool-shop-org/catalog',
  footerText: 'MIT Licensed',
  filterable: true,
  searchable: true,
  groupByCategory: false,
  columns: 3,
  items: [
    { title: 'Tool A', description: 'Does things.', href: '/tool-a', tags: ['cli'] },
  ],
};
```

### Portfolio-specific fields

| Field               | Type              | Required | Description                                      |
|---------------------|-------------------|----------|--------------------------------------------------|
| `template`          | `'portfolio'`     | yes      | Template discriminant                            |
| `hero`              | `HeroDef`         | no       | Optional hero section at the top                 |
| `portfolioHeading`  | `string`          | no       | Heading above the grid                           |
| `portfolioSubtitle` | `string`          | no       | Subtitle below the heading                       |
| `filterable`        | `boolean`         | no       | Enable tag filtering (default: true)             |
| `searchable`        | `boolean`         | no       | Enable text search (default: true)               |
| `groupByCategory`   | `boolean`         | no       | Group items by category (default: false)         |
| `columns`           | `2 \| 3 \| 4`    | no       | Grid columns on large screens (default: 3)       |
| `items`             | `PortfolioItem[]` | yes      | Items to display                                 |
| `ctaBanner`         | `CtaBannerDef`    | no       | Optional bottom CTA banner                       |

See the [Components](/site-theme/handbook/components/#portfoliogrid) page for the full `PortfolioItem` shape.

---

## SiteConfig union

The exported `SiteConfig` type is a discriminated union of the landing-page config types (the **app** template uses its own dashboard config, not this union):

```typescript
type SiteConfig = DefaultSiteConfig | DocsSiteConfig | ProductSiteConfig | PortfolioSiteConfig | ToolSiteConfig;
```

The `template` field acts as the discriminant. For the default template, `template` can be omitted entirely for backward compatibility.
