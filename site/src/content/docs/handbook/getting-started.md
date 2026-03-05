---
title: Getting Started
description: Scaffold a new site with @mcptoolshop/site-theme and get it running locally.
sidebar:
  order: 1
---

Get from zero to a running local site in under two minutes.

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later
- A GitHub repository (for deployment)

## Scaffold a new site

Run the init CLI from your project root:

```bash
npx @mcptoolshop/site-theme init
```

This creates a `site/` directory containing:

- Astro project with Tailwind CSS v4 pre-wired
- Theme CSS imports and `@source` path configured
- A starter `site-config.ts` with example content
- GitHub Pages workflow (`.github/workflows/pages.yml`)

## Install and run

```bash
cd site
npm install
npm run dev
```

Open `http://localhost:4321` to see your site.

## Choose a template

The default scaffold uses the **default** template (a single landing page). To start with a different template:

```bash
npx @mcptoolshop/site-theme init --template docs
npx @mcptoolshop/site-theme init --template product
npx @mcptoolshop/site-theme init --template app
```

Preview what files will be created without writing anything:

```bash
npx @mcptoolshop/site-theme init --template app --dry-run
```

See the [Templates](/site-theme/handbook/templates/) page for details on each option.

## What the CLI sets up

The `init` command handles all the wiring so you do not need to configure anything manually:

1. **CSS imports** — `global.css` imports Tailwind and the theme stylesheet
2. **`@source` path** — Points Tailwind at the theme's component files so utilities are generated
3. **Base path** — Set to your repo name for GitHub Pages compatibility
4. **CI workflow** — `.github/workflows/pages.yml` builds and deploys on push to `site/`

## Next steps

- Edit `site/src/site-config.ts` to customize your content
- Override [design tokens](/site-theme/handbook/design-tokens/) to change colors
- Push to GitHub and [deploy](/site-theme/handbook/deployment/)
