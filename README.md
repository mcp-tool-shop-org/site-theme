# @mcptoolshop/site-theme

Shared Astro theme for MCP Tool Shop org repo landing pages. Dark zinc palette, Tailwind CSS v4, config-driven content.

## Quick Start

### Scaffold a new site

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

This creates a `site/` directory with Astro + Tailwind + theme wired up, plus a GitHub Pages workflow.

### Edit your content

All page content lives in `site/src/site-config.ts`. Edit the config object to customize your landing page:

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

## Components

Import components individually from the package:

```astro
---
import BaseLayout from '@mcptoolshop/site-theme/components/BaseLayout.astro';
import Hero from '@mcptoolshop/site-theme/components/Hero.astro';
import Section from '@mcptoolshop/site-theme/components/Section.astro';
import FeatureGrid from '@mcptoolshop/site-theme/components/FeatureGrid.astro';
import DataTable from '@mcptoolshop/site-theme/components/DataTable.astro';
import CodeCardGrid from '@mcptoolshop/site-theme/components/CodeCardGrid.astro';
import ApiList from '@mcptoolshop/site-theme/components/ApiList.astro';
---
```

### BaseLayout

Full page shell with header (logo, nav, GitHub/npm buttons) and footer.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Page `<title>` |
| `description` | `string` | Meta description |
| `logoBadge` | `string` | 1-2 char logo badge (e.g. "RS") |
| `brandName` | `string` | Name in header |
| `nav` | `{ href, label }[]` | Anchor nav links |
| `repoUrl` | `string` | GitHub repo URL |
| `npmUrl?` | `string` | npm package URL |
| `footerText` | `string` | Footer left text (HTML allowed) |

### Hero

Gradient hero section with status badge, headline, CTAs, and code preview cards.

| Prop | Type | Description |
|------|------|-------------|
| `badge` | `string` | Status badge text |
| `headline` | `string` | Main headline |
| `headlineAccent` | `string` | Muted suffix |
| `description` | `string` | Description (HTML allowed) |
| `primaryCta` | `{ href, label }` | Primary button |
| `secondaryCta` | `{ href, label }` | Secondary button |
| `previews` | `{ label, code }[]` | Code preview cards |

### Section

Section wrapper with anchor id, heading, and optional subtitle.

### FeatureGrid

3-column grid of feature cards. Props: `features: { title, desc }[]`

### DataTable

Grid-based table. Props: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

2-column grid of code block cards. Props: `cards: { title, code }[]`

### ApiList

Full-width API reference cards. Props: `apis: { signature, description }[]`

## Section Types

The `sections` array in your config supports these `kind` values:

- `features` — 3-col feature card grid
- `data-table` — bordered data table
- `code-cards` — 2-col code example cards
- `api` — stacked API reference cards

Sections render in the order they appear in the array.

## Tailwind Setup

The theme uses Tailwind CSS v4. Your site's `global.css` needs the `@source` directive to scan theme components:

```css
@import "tailwindcss";
@source "../../../node_modules/@mcptoolshop/site-theme";
```

The `init` CLI generates this automatically.

## License

MIT
