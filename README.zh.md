<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.md">English</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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
  <a href="https://github.com/mcp-tool-shop-org/site-theme/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/site-theme/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/@mcptoolshop/site-theme"><img src="https://img.shields.io/npm/v/@mcptoolshop/site-theme" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/templates-default_·_docs_·_product_·_app-34d399" alt="Templates: default · docs · product · app" />
  <a href="https://mcp-tool-shop-org.github.io/site-theme/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-brightgreen" alt="MIT License" /></a>
</p>

<p align="center">
  <a href="#templates">Templates</a> &middot;
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#design-tokens">Design Tokens</a> &middot;
  <a href="#components">Components</a> &middot;
  <a href="#deploy">Deploy</a> &middot;
  <a href="#license">License</a>
</p>

---

## 模板

选择一个模板，构建一个框架，开始构建。每个模板都经过了 CI 测试，并且可以直接部署到 GitHub Pages。

| 模板 | 描述 | 页面 |
|----------|-------------|-------|
| **default** | 带有标题、特性和代码示例的项目主页。 | 1 |
| **docs** | 带有侧边栏导航和内容部分的文档网站。 | 1 |
| **product** | 带有定价、客户评价和行动号召按钮的营销主页。 | 1 |
| **app** | 具有 RBAC（基于角色的访问控制）、特性开关和工作区路由的多租户 SaaS 控制面板。 | 31 |

```bash
npx @mcptoolshop/site-theme list-templates        # see all options
npx @mcptoolshop/site-theme init --template app    # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run  # preview files
```

---

## 快速开始

### 构建一个新的网站

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

这会在 `site/` 目录下创建一个目录，其中包含 Astro + Tailwind + 主题的配置，以及 GitHub Pages 的工作流程。CSS 导入、`@source` 路径和基本路径都已预配置，无需手动设置。

### 编辑你的内容

所有页面内容都位于 `site/src/site-config.ts` 文件中。编辑配置文件对象以自定义你的主页：

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

## 设计令牌

该主题通过 `styles/theme.css` 文件提供语义化的设计令牌。组件引用这些令牌，而不是硬编码的颜色值，因此你可以通过覆盖几个值来更改整个主题的外观。

### 默认令牌

| 令牌 | 默认值 | 用于 |
|-------|---------|----------|
| `--color-surface` | `#09090b` | 页面背景 |
| `--color-surface-raised` | `#18181b` | 突出显示元素、代码块 |
| `--color-surface-strong` | `#27272a` | 徽章、强调背景 |
| `--color-edge` | `#27272a` | 主要边框 |
| `--color-edge-subtle` | `#18181b` | 卡片/表格边框 |
| `--color-heading` | `#fafafa` | 标题、主要文本 |
| `--color-body` | `#e4e4e7` | 正文/次要文本 |
| `--color-muted` | `#d4d4d8` | 淡化文本 |
| `--color-dim` | `#a1a1aa` | 标签、描述 |
| `--color-accent` | `#34d399` | 状态指示器 |
| `--color-action` | `#fafafa` | 主要按钮背景 |
| `--color-action-text` | `#09090b` | 主要按钮文本 |
| `--color-action-hover` | `#e4e4e7` | 主要按钮悬停效果 |

### 自定义

通过在导入语句之后添加 `@theme` 块，可以在你网站的 `global.css` 文件中覆盖任何令牌：

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

令牌会生成标准的 Tailwind v4 工具类（例如 `bg-surface`、`text-heading`、`border-edge` 等），因此你也可以在自己的组件中使用它们。

---

## 组件

从包中单独导入组件：

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

带有固定标题（包含徽章、导航链接、GitHub/npm 按钮）和页脚的完整页面布局。

| 属性 | 类型 | 描述 |
|------|------|-------------|
| `title` | `string` | 页面 `<title>` |
| `description` | `string` | Meta 描述 |
| `logoBadge` | `string` | 1–2 个字符的徽章（例如 "RS"） |
| `brandName` | `string` | 标题中的名称 |
| `nav` | `{ href, label }[]` | 导航链接 |
| `repoUrl` | `string` | GitHub 仓库 URL |
| `npmUrl?` | `string` | npm 包 URL |
| `footerText` | `string` | 页脚文本（允许使用 HTML） |

### Hero

带有状态徽章、标题、行动号召按钮和可选代码预览卡的渐变背景区域。

| 属性 | 类型 | 描述 |
|------|------|-------------|
| `badge` | `string` | 状态徽章文本 |
| `headline` | `string` | 主要标题 |
| `headlineAccent` | `string` | 淡化后缀 |
| `description` | `string` | 描述（允许使用 HTML） |
| `primaryCta` | `{ href, label }` | 主要按钮 |
| `secondaryCta` | `{ href, label }` | 次要按钮 |
| `previews` | `{ label, code }[]` | 代码预览卡片 |

### Section

带有锚点 `id`、标题和可选子标题的部分包装器。

### FeatureGrid

3 列响应式卡片网格。属性：`features: { title, desc }[]`

### DataTable

基于网格的带边框的表格。属性：`columns: string[]`, `rows: string[][]`

### CodeCardGrid

2 列的深色代码块卡片网格。属性：`cards: { title, code }[]`

### ApiList

全宽堆叠的 API 参考卡片。属性：`apis: { signature, description }[]`

---

## Section 类型

你的配置文件中的 `sections` 数组支持以下 `kind` 值：

| 类型 | 组件 | 属性 |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

各个部分按照它们在数组中出现的顺序进行渲染。

---

## 部署

`init` 命令行工具会自动创建 `.github/workflows/pages.yml` 文件。要使网站上线：

1. 将您的代码仓库推送到 GitHub。
2. 访问您的代码仓库 → **设置 → Pages**。
3. 在 **构建与部署** 选项下，将 **源** 设置为 **GitHub Actions**。
4. 将任何更改推送到 `site/` 目录以触发首次构建。

您的网站将在 `https://<org>.github.io/<repo>/` 上线。

---

## 安全与数据范围

| 方面 | 详情 |
|--------|--------|
| **Data touched** | Astro 组件文件、CSS 令牌、站点配置——仅在构建时使用。 |
| **Data NOT touched** | 不涉及任何用户数据、运行时状态或服务器端处理。 |
| **Permissions** | 读取：项目源代码文件。写入：构建输出到 `site/dist/` 目录。 |
| **Network** | 无——这是一个静态站点生成器，不涉及任何运行时网络访问。 |
| **Telemetry** | 无数据被收集或发送。 |

请参阅 [SECURITY.md](SECURITY.md) 文件，了解漏洞报告。

## 评分卡

| 类别 | 评分 |
|----------|-------|
| A. 安全性 | 10 |
| B. 错误处理 | 10 |
| C. 操作文档 | 10 |
| D. 发布规范 | 10 |
| E. 身份验证（软性） | 10 |
| **Overall** | **50/50** |

> 完整审计：[SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## 许可证

MIT
