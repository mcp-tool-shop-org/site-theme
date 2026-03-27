---
title: Beginners Guide
description: New to Astro or static site generators? This guide walks you through everything from install to deploy.
sidebar:
  order: 99
---

New to Astro, Tailwind, or static site generators? This page covers the fundamentals you need to use `@mcptoolshop/site-theme` effectively.

## 1. What is this package?

`@mcptoolshop/site-theme` is an npm package that provides:

- **A CLI** that scaffolds a ready-to-run Astro site from a template
- **17 Astro components** (layout shells, content blocks, marketing sections, portfolio grids, docs layouts)
- **Design tokens** via CSS custom properties for easy reskinning
- **A GitHub Pages workflow** so your site deploys automatically on push

You do not need to build the theme from source. You install it as a dependency and import its components into your Astro pages.

## 2. Prerequisites

Before you start, make sure you have:

- **Node.js 18 or later** — check with `node --version`
- **npm 9 or later** — check with `npm --version`
- **A text editor** — VS Code is recommended
- **A GitHub account** — for hosting and deployment
- **Git** installed locally — check with `git --version`

If you do not have Node.js, download it from [nodejs.org](https://nodejs.org/). npm ships with Node.js.

## 3. Your first site in five minutes

### Step 1: Create a project folder

```bash
mkdir my-project
cd my-project
git init
```

### Step 2: Scaffold the site

```bash
npx @mcptoolshop/site-theme init
```

This creates a `site/` directory with everything pre-configured: Astro, Tailwind CSS v4, theme imports, and a GitHub Pages workflow.

### Step 3: Install dependencies

```bash
cd site
npm install
```

### Step 4: Start the dev server

```bash
npm run dev
```

Open `http://localhost:4321` in your browser. You should see a landing page with a hero section and placeholder content.

### Step 5: Edit your content

Open `site/src/site-config.ts` in your editor. Change the `title`, `description`, `hero.headline`, and other fields. Save the file and the browser will update automatically.

## 4. Understanding the project structure

After scaffolding, your project looks like this:

```
my-project/
  site/
    src/
      pages/
        index.astro        # Main page — imports components and config
      styles/
        global.css          # Tailwind + theme CSS imports
      site-config.ts        # All your page content lives here
    public/
      favicon.svg           # Site favicon
    astro.config.mjs        # Astro configuration (base path, integrations)
    package.json            # Site dependencies
    tsconfig.json           # TypeScript configuration
  .github/
    workflows/
      pages.yml             # GitHub Pages deployment workflow
  .gitignore
```

**Key files to know:**

- **`site-config.ts`** — This is where you define all your page content: titles, hero text, features, code examples, API docs. You rarely need to edit `.astro` files directly.
- **`global.css`** — Contains three critical lines that wire up Tailwind and the theme. You can add token overrides here.
- **`astro.config.mjs`** — Sets the `base` path for GitHub Pages. The CLI sets this automatically from your repo name.
- **`index.astro`** — The page file that imports components and renders your config. For the default template, you usually do not need to modify this.

## 5. How Astro components work

Astro components (`.astro` files) are single-file components that run at build time. They produce static HTML with zero JavaScript by default.

### Importing a component

```astro
---
import Hero from '@mcptoolshop/site-theme/components/Hero.astro';
---
<Hero badge="v1.0" headline="My Tool" headlineAccent="for developers"
      description="A great tool." primaryCta={{ href: '#', label: 'Get Started' }}
      secondaryCta={{ href: '#', label: 'Docs' }} />
```

The code between `---` fences is the **frontmatter** — it runs on the server at build time. Below the fences is the **template** — it produces HTML.

### Props

Components accept **props** — typed inputs that control what they render. The theme defines TypeScript interfaces for all props, so your editor will provide autocomplete and type checking.

### Slots

Some components like `BaseLayout` and `Section` accept **slot content** — the child elements you place between the opening and closing tags:

```astro
<Section id="features" title="Features">
  <!-- This content goes into the default slot -->
  <FeatureGrid features={myFeatures} />
</Section>
```

## 6. Customizing the look

### Changing colors with design tokens

The theme uses CSS custom properties (design tokens) for all colors. Override them in `global.css`:

```css
@import "tailwindcss";
@import "@mcptoolshop/site-theme/styles/theme.css";
@source "../../node_modules/@mcptoolshop/site-theme";

@theme {
  --color-accent: #60a5fa;       /* blue instead of emerald */
  --color-surface: #0a0a1a;      /* navy background         */
  --color-action: #60a5fa;       /* blue buttons             */
  --color-action-hover: #3b82f6;
}
```

You only need to override the tokens you want to change. See the [Design Tokens](/site-theme/handbook/design-tokens/) page for the full reference.

### Using Tailwind utilities

The theme's tokens generate standard Tailwind v4 utilities. For example, `--color-surface` creates `bg-surface`, `text-surface`, and `border-surface`. You can use these in your own components alongside the theme components.

### Adding your own CSS

Add custom styles after the theme import in `global.css`. Tailwind utilities and the theme tokens are both available.

## 7. Deploying to GitHub Pages

### Push your code

```bash
cd ..             # back to project root
git add -A
git commit -m "Initial site"
git remote add origin https://github.com/your-org/your-repo.git
git push -u origin main
```

### Enable GitHub Pages

1. Go to your repo on GitHub
2. Open **Settings > Pages**
3. Under **Build and deployment**, set **Source** to **GitHub Actions**
4. Push any change to `site/` to trigger the first build

Your site will be live at `https://<org>.github.io/<repo>/` within a few minutes.

### Common issues

- **404 on subpages** — Check that the `base` path in `astro.config.mjs` matches your repo name
- **Styles not loading** — Make sure `global.css` has all three import lines (see section 6 above)
- **Build fails** — Run `npm install` inside the `site/` directory first, then `npm run build` to check locally

For more deployment details, see the [Deployment](/site-theme/handbook/deployment/) page.
