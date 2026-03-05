---
title: Components
description: All seven Astro components in @mcptoolshop/site-theme with props and usage examples.
sidebar:
  order: 3
---

The theme ships seven Astro components. Import them individually from the package.

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

## BaseLayout

Full page shell with a sticky header (logo badge, nav links, GitHub/npm buttons) and footer. Wrap all your page content inside this component.

### Props

| Prop         | Type               | Required | Description                        |
|--------------|--------------------|----------|------------------------------------|
| `title`      | `string`           | yes      | Page `<title>`                     |
| `description`| `string`           | yes      | Meta description                   |
| `logoBadge`  | `string`           | yes      | 1-2 character badge (e.g. `"RS"`)  |
| `brandName`  | `string`           | yes      | Name displayed in header           |
| `nav`        | `{ href, label }[]`| yes      | Anchor nav links                   |
| `repoUrl`    | `string`           | yes      | GitHub repo URL                    |
| `npmUrl`     | `string`           | no       | npm package URL                    |
| `footerText` | `string`           | yes      | Footer text (HTML allowed)         |

## Hero

Gradient hero section with a status badge, large headline, call-to-action buttons, and optional code preview cards.

### Props

| Prop             | Type                    | Required | Description                  |
|------------------|-------------------------|----------|------------------------------|
| `badge`          | `string`                | yes      | Status badge text            |
| `headline`       | `string`                | yes      | Main headline                |
| `headlineAccent` | `string`                | yes      | Muted suffix after headline  |
| `description`    | `string`                | yes      | Description (HTML allowed)   |
| `primaryCta`     | `{ href, label }`       | yes      | Primary button               |
| `secondaryCta`   | `{ href, label }`       | yes      | Secondary button             |
| `previews`       | `{ label, code }[]`     | no       | Code preview cards           |

## Section

Anchor section wrapper with a heading and optional subtitle. Content goes in the default slot.

### Props

| Prop       | Type     | Required | Description                |
|------------|----------|----------|----------------------------|
| `id`       | `string` | yes      | Anchor ID for navigation   |
| `title`    | `string` | yes      | Section heading            |
| `subtitle` | `string` | no       | Text below the heading     |

## FeatureGrid

Three-column responsive card grid. Each card displays a bold title and a short description.

### Props

| Prop       | Type                      | Required | Description       |
|------------|---------------------------|----------|-------------------|
| `features` | `{ title, desc }[]`       | yes      | Array of features |

## DataTable

Grid-based bordered table. The first cell in each row is styled as a row header.

### Props

| Prop      | Type         | Required | Description        |
|-----------|--------------|----------|--------------------|
| `columns` | `string[]`   | yes      | Column headers     |
| `rows`    | `string[][]` | yes      | Row data           |

## CodeCardGrid

Two-column grid of dark code block cards. Each card has a title and a code snippet.

### Props

| Prop    | Type                    | Required | Description           |
|---------|-------------------------|----------|-----------------------|
| `cards` | `{ title, code }[]`     | yes      | Array of code cards   |

## ApiList

Full-width stacked API reference cards. Each card displays a monospace signature with a description below.

### Props

| Prop   | Type                              | Required | Description             |
|--------|-----------------------------------|----------|-------------------------|
| `apis` | `{ signature, description }[]`    | yes      | Array of API entries    |
