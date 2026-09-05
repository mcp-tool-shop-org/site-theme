---
title: Components
description: All 17 Astro components in @mcptoolshop/site-theme with props and usage examples.
sidebar:
  order: 3
---

The theme ships 17 Astro components across five categories: layout shells, content sections, marketing blocks, portfolio, and documentation. Import them individually from the package.

## Layout

### BaseLayout

Full page shell with a sticky header (logo badge, nav links, GitHub / package buttons) and footer. Wrap all your page content inside this component. Extra `<head>` tags go in the named `head` slot.

```astro
---
import BaseLayout from '@mcptoolshop/site-theme/components/BaseLayout.astro';
---
<BaseLayout title="My Tool" description="..." logoBadge="MT" brandName="my-tool" repoUrl="..." packageUrl="https://pypi.org/project/my-tool/" footerText="MIT">
  <Fragment slot="head">
    <meta property="og:image" content={ogImage} />
  </Fragment>
  <!-- page content -->
</BaseLayout>
```

#### Props

| Prop         | Type               | Required | Description                        |
|--------------|--------------------|----------|------------------------------------|
| `title`      | `string`           | yes      | Page `<title>`                     |
| `description`| `string`           | yes      | Meta description                   |
| `logoBadge`  | `string`           | yes      | 1-2 character badge (e.g. `"RS"`)  |
| `brandName`  | `string`           | yes      | Name displayed in header           |
| `nav`        | `{ href, label }[]`| no       | Anchor nav links (defaults to `[]`) |
| `repoUrl`    | `string`           | yes      | GitHub repo URL                    |
| `packageUrl` | `string`           | no       | Primary registry listing (npm, PyPI, crates.io, …) |
| `packageLabel` | `string`         | no       | Optional label override            |
| `npmUrl`     | `string`           | no       | Deprecated alias for `packageUrl`  |
| `footerText` | `string`           | yes      | Footer text (HTML allowed)         |

### DocLayout

Two-column layout with a collapsible sidebar on mobile and a sticky sidebar on desktop. Used by the **docs** template.

```astro
---
import DocLayout from '@mcptoolshop/site-theme/components/DocLayout.astro';
---
<DocLayout sidebar={sidebarGroups} currentPath={Astro.url.pathname}>
  <!-- main content -->
</DocLayout>
```

#### Props

| Prop          | Type               | Required | Description                        |
|---------------|--------------------|----------|------------------------------------|
| `sidebar`     | `SidebarGroup[]`   | yes      | Navigation groups for the sidebar  |
| `currentPath` | `string`           | yes      | Current page path for active link highlighting |

## Content Sections

### Hero

Gradient hero section with a status badge, large headline, call-to-action buttons, and optional code preview cards.

#### Props

| Prop             | Type                    | Required | Description                  |
|------------------|-------------------------|----------|------------------------------|
| `badge`          | `string`                | yes      | Status badge text            |
| `headline`       | `string`                | yes      | Main headline                |
| `headlineAccent` | `string`                | yes      | Muted suffix after headline  |
| `description`    | `string`                | yes      | Description (HTML allowed)   |
| `primaryCta`     | `{ href, label }`       | yes      | Primary button               |
| `secondaryCta`   | `{ href, label }`       | yes      | Secondary button             |
| `previews`       | `{ label, code }[]`     | no       | Code preview cards           |

### Section

Anchor section wrapper with a heading and optional subtitle. Content goes in the default slot.

#### Props

| Prop       | Type     | Required | Description                |
|------------|----------|----------|----------------------------|
| `id`       | `string` | yes      | Anchor ID for navigation   |
| `title`    | `string` | yes      | Section heading            |
| `subtitle` | `string` | no       | Text below the heading     |

### FeatureGrid

Three-column responsive card grid. Each card displays a bold title and a short description.

#### Props

| Prop       | Type                      | Required | Description       |
|------------|---------------------------|----------|-------------------|
| `features` | `{ title, desc }[]`       | yes      | Array of features |

### DataTable

Grid-based bordered table. The first cell in each row is styled as a row header.

#### Props

| Prop      | Type         | Required | Description        |
|-----------|--------------|----------|--------------------|
| `columns` | `string[]`   | yes      | Column headers     |
| `rows`    | `string[][]` | yes      | Row data           |

### CodeCardGrid

Two-column grid of dark code block cards. Each card has a title and a code snippet.

#### Props

| Prop    | Type                    | Required | Description           |
|---------|-------------------------|----------|-----------------------|
| `cards` | `{ title, code }[]`     | yes      | Array of code cards   |

### ApiList

Full-width stacked API reference cards. Each card displays a monospace signature with a description below.

#### Props

| Prop   | Type                              | Required | Description             |
|--------|-----------------------------------|----------|-------------------------|
| `apis` | `{ signature, description }[]`    | yes      | Array of API entries    |

### ContentSection

Anchor-linked content block that renders HTML content via Astro's `set:html` directive. Used by the **docs** template for rich content sections.

#### Props

| Prop      | Type     | Required | Description                          |
|-----------|----------|----------|--------------------------------------|
| `id`      | `string` | yes      | Anchor ID for navigation             |
| `title`   | `string` | yes      | Section heading (linkable)           |
| `content` | `string` | yes      | HTML content (rendered via set:html) |

## Marketing

### SocialProof

Stats bar with an optional headline and value/label pairs. Used by the **product** template for trust signals.

#### Props

| Prop       | Type                        | Required | Description                    |
|------------|-----------------------------|----------|--------------------------------|
| `headline` | `string`                    | no       | Text above the stats           |
| `stats`    | `{ value, label }[]`        | no       | Array of stat entries          |

### PricingGrid

Responsive pricing tier cards. One tier can be marked as `highlighted` to show a "Popular" badge. Used by the **product** template.

#### Props

| Prop    | Type             | Required | Description                     |
|---------|------------------|----------|---------------------------------|
| `tiers` | `PricingTier[]`  | no       | Array of pricing tiers          |

**PricingTier shape:**

| Field         | Type              | Required | Description                          |
|---------------|-------------------|----------|--------------------------------------|
| `name`        | `string`          | yes      | Tier name (e.g. "Free", "Pro")       |
| `price`       | `string`          | yes      | Price display (e.g. "$0", "$29/mo")  |
| `description` | `string`          | yes      | Short description                    |
| `features`    | `string[]`        | yes      | Feature list items                   |
| `cta`         | `{ href, label }` | yes      | Call-to-action button                |
| `highlighted` | `boolean`         | no       | Show "Popular" badge if true         |

### TestimonialGrid

Two-column grid of quote cards with author info. Falls back to initials when no avatar URL is provided.

#### Props

| Prop           | Type                | Required | Description                      |
|----------------|---------------------|----------|----------------------------------|
| `testimonials` | `TestimonialDef[]`  | no       | Array of testimonial entries     |

**TestimonialDef shape:**

| Field       | Type     | Required | Description                  |
|-------------|----------|----------|------------------------------|
| `quote`     | `string` | yes      | The testimonial text         |
| `author`    | `string` | yes      | Author name                  |
| `role`      | `string` | yes      | Author role or title         |
| `avatarUrl` | `string` | no       | Avatar image URL             |

### CtaBanner

Full-width gradient call-to-action banner with headline, optional description, and a button.

#### Props

| Prop          | Type              | Required | Description                    |
|---------------|-------------------|----------|--------------------------------|
| `headline`    | `string`          | yes      | Banner headline                |
| `description` | `string`          | no       | Text below the headline        |
| `cta`         | `{ href, label }` | yes      | Call-to-action button          |

## Portfolio

### FilterBar

Client-side search and tag filtering bar. Works with `PortfolioGrid` — filters elements matching `[data-portfolio-card]` by reading `data-tags` and `data-search-text` attributes.

#### Props

| Prop                | Type       | Required | Description                          |
|---------------------|------------|----------|--------------------------------------|
| `tags`              | `string[]` | yes      | Available tags for filter buttons    |
| `searchable`        | `boolean`  | no       | Show text search input (default: true) |
| `searchPlaceholder` | `string`   | no       | Search input placeholder text        |

### PortfolioGrid

Configurable card grid for collections of any content type. Supports category grouping, status badges, images or badge fallbacks, tags, metadata, and secondary action links.

#### Props

| Prop              | Type              | Required | Description                                  |
|-------------------|-------------------|----------|----------------------------------------------|
| `items`           | `PortfolioItem[]` | yes      | Array of items to display                    |
| `columns`         | `2 \| 3 \| 4`    | no       | Grid columns on large screens (default: 3)   |
| `groupByCategory` | `boolean`         | no       | Group items under category headings (default: false) |

**PortfolioItem shape:**

| Field             | Type                | Required | Description                              |
|-------------------|---------------------|----------|------------------------------------------|
| `title`           | `string`            | yes      | Display title                            |
| `description`     | `string`            | yes      | Short description                        |
| `href`            | `string`            | yes      | Primary link (card click target)         |
| `image`           | `string`            | no       | Card thumbnail URL                       |
| `badge`           | `string`            | no       | 1-2 char fallback when no image          |
| `tags`            | `string[]`          | no       | Tags for filtering                       |
| `category`        | `string`            | no       | Category for grouping                    |
| `status`          | `string`            | no       | Status label (stable, beta, new, archived) |
| `meta`            | `string`            | no       | Secondary metadata line                  |
| `secondaryAction` | `{ href, label }`   | no       | Secondary action link                    |

## Documentation

### Sidebar

Grouped navigation list with active-link highlighting. Used inside `DocLayout`.

#### Props

| Prop          | Type               | Required | Description                               |
|---------------|--------------------|----------|-------------------------------------------|
| `groups`      | `SidebarGroup[]`   | yes      | Navigation groups with title and items     |
| `currentPath` | `string`           | no       | Current page path for active highlighting  |

**SidebarGroup shape:** `{ title: string, items: { label: string, href: string }[] }`

### TableOfContents

On-page heading navigation. Renders a bordered list of heading links indented by depth.

#### Props

| Prop       | Type                               | Required | Description                     |
|------------|-------------------------------------|----------|---------------------------------|
| `headings` | `{ text, id, depth: 2 \| 3 }[]`   | no       | Array of page headings for TOC  |
