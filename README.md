<p align="center">
  <strong>English</strong> | <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/site-theme/main/assets/preview.png" alt="site-theme preview" width="800" />
</p>

<h1 align="center">@mcptoolshop/site-theme</h1>

<p align="center">
  Config-driven Astro theme for MCP Tool Shop project landing pages.<br/>
  Dark palette · Tailwind CSS v4 · GitHub Pages ready.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#design-tokens">Design Tokens</a> &middot;
  <a href="#components">Components</a> &middot;
  <a href="#deploy">Deploy</a> &middot;
  <a href="#license">License</a>
</p>

---

## Quick Start

### Scaffold a new site

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

This creates a `site/` directory with Astro + Tailwind + theme wired up, plus a GitHub Pages workflow. The CSS import, `@source` path, and base path are all pre-configured — no manual setup needed.

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

---

## Design Tokens

The theme ships semantic design tokens via `styles/theme.css`. Components reference these tokens instead of hardcoded colors, so you can reskin the entire theme by overriding a few values.

### Default tokens

| Token | Default | Used for |
|-------|---------|----------|
| `--color-surface` | `#09090b` | Page background |
| `--color-surface-raised` | `#18181b` | Elevated elements, code blocks |
| `--color-surface-strong` | `#27272a` | Badges, emphasized backgrounds |
| `--color-edge` | `#27272a` | Primary borders |
| `--color-edge-subtle` | `#18181b` | Card / table borders |
| `--color-heading` | `#fafafa` | Headings, primary text |
| `--color-body` | `#e4e4e7` | Body / secondary text |
| `--color-muted` | `#d4d4d8` | Muted text |
| `--color-dim` | `#a1a1aa` | Labels, descriptions |
| `--color-accent` | `#34d399` | Status indicators |
| `--color-action` | `#fafafa` | Primary button background |
| `--color-action-text` | `#09090b` | Primary button text |
| `--color-action-hover` | `#e4e4e7` | Primary button hover |

### Customizing

Override any token in your site's `global.css` by adding a `@theme` block after the imports:

```css
@import "tailwindcss";
@import "@mcptoolshop/site-theme/styles/theme.css";
@source "../../node_modules/@mcptoolshop/site-theme";

/* Override tokens */
@theme {
  --color-accent: #60a5fa;          /* blue status dot   */
  --color-surface: #0a0a1a;         /* navy background   */
  --color-action: #60a5fa;          /* blue buttons      */
  --color-action-hover: #3b82f6;
}
```

Tokens generate standard Tailwind v4 utilities (`bg-surface`, `text-heading`, `border-edge`, etc.) so you can also use them in your own components.

---

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

Full page shell with sticky header (logo badge, nav links, GitHub/npm buttons) and footer.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Page `<title>` |
| `description` | `string` | Meta description |
| `logoBadge` | `string` | 1–2 char badge (e.g. `"RS"`) |
| `brandName` | `string` | Name in header |
| `nav` | `{ href, label }[]` | Anchor nav links |
| `repoUrl` | `string` | GitHub repo URL |
| `npmUrl?` | `string` | npm package URL |
| `footerText` | `string` | Footer text (HTML allowed) |

### Hero

Gradient hero with status badge, headline, CTAs, and optional code preview cards.

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

Section wrapper with anchor `id`, heading, and optional subtitle.

### FeatureGrid

3-column responsive card grid. Props: `features: { title, desc }[]`

### DataTable

Grid-based bordered table. Props: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

2-column grid of dark code block cards. Props: `cards: { title, code }[]`

### ApiList

Full-width stacked API reference cards. Props: `apis: { signature, description }[]`

---

## Section Types

The `sections` array in your config supports these `kind` values:

| Kind | Component | Props |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

Sections render in the order they appear in the array.

---

## Deploy

The `init` CLI creates `.github/workflows/pages.yml` automatically. To go live:

1. Push your repo to GitHub
2. Go to your repo → **Settings → Pages**
3. Under **Build and deployment**, set **Source** to **GitHub Actions**
4. Push any change to `site/` to trigger the first build

Your site will be live at `https://<org>.github.io/<repo>/`.

---

## License

MIT
