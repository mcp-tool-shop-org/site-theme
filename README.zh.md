<p align="center">
  <a href="README.md">English</a> | <a href="README.ja.md">日本語</a> | <strong>中文</strong> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/site-theme/main/assets/preview.png" alt="site-theme 预览" width="800" />
</p>

<h1 align="center">@mcptoolshop/site-theme</h1>

<p align="center">
  面向 MCP Tool Shop 项目落地页的配置驱动型 Astro 主题。<br/>
  深色调 · Tailwind CSS v4 · 支持 GitHub Pages。
</p>

<p align="center">
  <a href="#快速开始">快速开始</a> &middot;
  <a href="#设计令牌">设计令牌</a> &middot;
  <a href="#组件">组件</a> &middot;
  <a href="#部署">部署</a> &middot;
  <a href="#许可证">许可证</a>
</p>

---

## 快速开始

### 创建新站点

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

命令将创建 `site/` 目录，其中包含已配置好的 Astro + Tailwind + 主题，以及 GitHub Pages 工作流。CSS 导入、`@source` 路径和基础路径均已自动配置，无需手动设置。

### 编辑内容

所有页面内容均存放于 `site/src/site-config.ts`。编辑配置对象即可自定义落地页：

```typescript
import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '@mcptoolshop/my-tool',
  description: '工具的功能描述。',
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

## 设计令牌

主题通过 `styles/theme.css` 提供语义化设计令牌。组件引用这些令牌而非硬编码颜色，因此只需覆盖少量值即可对整个主题进行重新配色。

### 默认令牌

| 令牌 | 默认值 | 用途 |
|------|--------|------|
| `--color-surface` | `#09090b` | 页面背景 |
| `--color-surface-raised` | `#18181b` | 悬浮元素、代码块 |
| `--color-surface-strong` | `#27272a` | 徽章、强调背景 |
| `--color-edge` | `#27272a` | 主要边框 |
| `--color-edge-subtle` | `#18181b` | 卡片/表格边框 |
| `--color-heading` | `#fafafa` | 标题、主要文字 |
| `--color-body` | `#e4e4e7` | 正文/次要文字 |
| `--color-muted` | `#d4d4d8` | 弱化文字 |
| `--color-dim` | `#a1a1aa` | 标签、说明 |
| `--color-accent` | `#34d399` | 状态指示器 |
| `--color-action` | `#fafafa` | 主按钮背景 |
| `--color-action-text` | `#09090b` | 主按钮文字 |
| `--color-action-hover` | `#e4e4e7` | 主按钮悬停 |

### 自定义

在站点的 `global.css` 中，于导入语句之后添加 `@theme` 块来覆盖令牌：

```css
@import "tailwindcss";
@import "@mcptoolshop/site-theme/styles/theme.css";
@source "../../node_modules/@mcptoolshop/site-theme";

/* 覆盖令牌 */
@theme {
  --color-accent: #60a5fa;          /* 蓝色状态点   */
  --color-surface: #0a0a1a;         /* 深海军蓝背景 */
  --color-action: #60a5fa;          /* 蓝色按钮     */
  --color-action-hover: #3b82f6;
}
```

令牌会生成标准 Tailwind v4 工具类（`bg-surface`、`text-heading`、`border-edge` 等），也可在自定义组件中直接使用。

---

## 组件

从包中单独导入各组件：

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

包含固定头部（徽标、导航链接、GitHub/npm 按钮）和页脚的完整页面框架。

| 属性 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 页面 `<title>` |
| `description` | `string` | Meta 描述 |
| `logoBadge` | `string` | 1–2 字符徽标（如 `"RS"`） |
| `brandName` | `string` | 头部显示名称 |
| `nav` | `{ href, label }[]` | 锚点导航链接 |
| `repoUrl` | `string` | GitHub 仓库地址 |
| `npmUrl?` | `string` | npm 包地址 |
| `footerText` | `string` | 页脚文字（支持 HTML） |

### Hero

包含状态徽章、大标题、CTA 按钮和可选代码预览卡的渐变英雄区。

| 属性 | 类型 | 说明 |
|------|------|------|
| `badge` | `string` | 状态徽章文字 |
| `headline` | `string` | 主标题 |
| `headlineAccent` | `string` | 弱化后缀 |
| `description` | `string` | 描述（支持 HTML） |
| `primaryCta` | `{ href, label }` | 主按钮 |
| `secondaryCta` | `{ href, label }` | 次按钮 |
| `previews` | `{ label, code }[]` | 代码预览卡 |

### Section

带锚点 `id`、标题和可选副标题的区块包装器。

### FeatureGrid

3 列响应式卡片网格。属性：`features: { title, desc }[]`

### DataTable

基于网格的带边框表格。属性：`columns: string[]`，`rows: string[][]`

### CodeCardGrid

深色代码块卡片的 2 列网格。属性：`cards: { title, code }[]`

### ApiList

全宽堆叠式 API 参考卡。属性：`apis: { signature, description }[]`

---

## 区块类型

配置中的 `sections` 数组支持以下 `kind` 值：

| Kind | 组件 | 属性 |
|------|------|------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

区块按数组中的顺序渲染。

---

## 部署

`init` CLI 会自动创建 `.github/workflows/pages.yml`。发布步骤：

1. 将仓库推送到 GitHub
2. 进入仓库 → **Settings → Pages**
3. 在 **Build and deployment** 下，将 **Source** 设置为 **GitHub Actions**
4. 向 `site/` 推送任意更改以触发首次构建

站点将发布于 `https://<org>.github.io/<repo>/`。

---

## 许可证

MIT
