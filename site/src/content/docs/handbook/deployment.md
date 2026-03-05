---
title: Deployment
description: How to deploy your @mcptoolshop/site-theme site to GitHub Pages.
sidebar:
  order: 6
---

The theme is designed for GitHub Pages deployment. The `init` CLI creates the workflow file automatically.

## What the CLI sets up

When you run `npx @mcptoolshop/site-theme init`, the scaffold includes:

- `.github/workflows/pages.yml` — builds and deploys the site on push
- The `base` path in `astro.config.mjs` set to your repo name
- Static output mode (Astro default)

## Deploy steps

1. Push your repo to GitHub
2. Go to your repo settings: **Settings > Pages**
3. Under **Build and deployment**, set **Source** to **GitHub Actions**
4. Push any change to `site/` to trigger the first build

Your site will be live at `https://<org>.github.io/<repo>/`.

## Workflow details

The generated `pages.yml` workflow:

- Triggers on pushes that change files in `site/` or the workflow itself
- Runs on `ubuntu-latest`
- Installs dependencies, builds with Astro, and uploads the artifact
- Uses the official `actions/deploy-pages` action
- Includes concurrency control to cancel in-progress deploys

## Custom domain

To use a custom domain:

1. Add a `CNAME` file to `site/public/` with your domain
2. Update the `site` field in `astro.config.mjs` to your domain
3. Remove or adjust the `base` path if deploying to the root
4. Configure DNS as described in the GitHub Pages documentation

## Troubleshooting

### Build fails with missing dependencies

Make sure `npm install` runs inside the `site/` directory. The workflow handles this automatically, but local builds need it too.

### 404 on subpages

Check that the `base` path in `astro.config.mjs` matches your repo name. For a repo at `github.com/org/my-tool`, the base should be `/my-tool`.

### Styles not loading

Verify that `global.css` contains the three required lines:

```css
@import "tailwindcss";
@import "@mcptoolshop/site-theme/styles/theme.css";
@source "../../node_modules/@mcptoolshop/site-theme";
```

The `@source` directive is critical — without it, Tailwind will not generate the theme's utility classes.
