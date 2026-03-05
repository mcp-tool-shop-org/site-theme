---
title: Configuration
description: SiteConfig reference and section types for @mcptoolshop/site-theme.
sidebar:
  order: 5
---

All page content lives in a single `site-config.ts` file. The theme renders your site from this configuration object.

## SiteConfig

The top-level config object defines metadata, header/footer content, the hero section, and an array of content sections.

```typescript
import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '@mcptoolshop/my-tool',
  description: 'What my tool does.',
  logoBadge: 'MT',
  brandName: 'my-tool',
  repoUrl: 'https://github.com/mcp-tool-shop-org/my-tool',
  npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/my-tool',
  footerText: 'MIT Licensed',

  hero: { /* ... */ },
  sections: [ /* ... */ ],
};
```

### Top-level fields

| Field         | Type     | Required | Description                        |
|---------------|----------|----------|------------------------------------|
| `title`       | `string` | yes      | Page title (used in `<title>`)     |
| `description` | `string` | yes      | Meta description                   |
| `logoBadge`   | `string` | yes      | 1-2 character header badge         |
| `brandName`   | `string` | yes      | Name in header                     |
| `repoUrl`     | `string` | yes      | GitHub repo URL                    |
| `npmUrl`      | `string` | no       | npm package URL                    |
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

## Section types

The `sections` array accepts objects with a `kind` field that determines which component renders.

| Kind          | Component     | Additional props                              |
|---------------|---------------|-----------------------------------------------|
| `features`    | FeatureGrid   | `features: { title, desc }[]`                 |
| `data-table`  | DataTable     | `columns: string[]`, `rows: string[][]`       |
| `code-cards`  | CodeCardGrid  | `cards: { title, code }[]`                    |
| `api`         | ApiList       | `apis: { signature, description }[]`          |

### Common section fields

Every section object shares these fields:

| Field      | Type     | Required | Description                |
|------------|----------|----------|----------------------------|
| `kind`     | `string` | yes      | Section type (see above)   |
| `id`       | `string` | yes      | Anchor ID for navigation   |
| `title`    | `string` | yes      | Section heading            |
| `subtitle` | `string` | no       | Text below the heading     |

Sections render in the order they appear in the array.

## Example: features section

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

## Example: code-cards section

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

## Navigation

The header nav is generated automatically from the `sections` array. Each section's `id` and `title` become a nav link pointing to `#id`.
