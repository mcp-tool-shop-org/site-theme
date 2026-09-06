<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.md">English</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/site-theme/main/assets/preview.png" alt="site-theme preview" width="800" />
</p>

<h1 align="center">@mcptoolshop/site-theme</h1>

<p align="center">
  Multi-template Astro toolkit for landing pages, docs, product sites, portfolios, and SaaS dashboards —<br/>
  plus <strong>front-door</strong>, the verifier for a repo's AI-native README / AGENTS.md / llms.txt.<br/>
  Dark palette · Tailwind CSS v4 · GitHub Pages ready.
</p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/site-theme/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/site-theme/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/@mcptoolshop/site-theme"><img src="https://img.shields.io/npm/v/@mcptoolshop/site-theme" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/templates-default_·_docs_·_product_·_portfolio_·_app_·_tool-34d399" alt="Templates: default · docs · product · portfolio · app · tool" />
  <a href="https://mcp-tool-shop-org.github.io/site-theme/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-brightgreen" alt="MIT License" /></a>
</p>

<p align="center">
  <a href="#templates">Templates</a> &middot;
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#front-door">Front Door</a> &middot;
  <a href="#design-tokens">Design Tokens</a> &middot;
  <a href="#components">Components</a> &middot;
  <a href="#deploy">Deploy</a> &middot;
  <a href="#license">License</a>
</p>

---

## 模板

选择一个模板，搭建框架，开始构建。每个模板都经过 CI 测试，并可以直接用于 GitHub Pages。

| 模板 | 描述 | 页面 |
|----------|-------------|-------|
| **default** | 带有醒目标题、特色内容和代码示例的项目着陆页 | 1 |
| **docs** | 带有侧边栏导航和内容区域的文档站点 | 1 |
| **product** | 带有定价、用户评价和行动号召的营销着陆页 | 1 |
| **portfolio** | 用于工具、项目或任何集合的可筛选目录网格 | 1 |
| **app** | 具有 RBAC、功能标志和工作区路由的多租户 SaaS 仪表板 | 31 |
| **tool** | 带有命令、工作流程和证明的 CLI / MCP / npm 包着陆页 | 1 |

```bash
npx @mcptoolshop/site-theme list-templates            # see all options
npx @mcptoolshop/site-theme list-templates --json      # machine-readable output
npx @mcptoolshop/site-theme init --template app        # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run   # preview files
npx @mcptoolshop/site-theme init --out ../other-repo   # scaffold into another directory
```

---

## 快速入门

### 搭建一个新的站点

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

这将创建一个 `site/` 目录，其中包含 Astro 7 + Tailwind + 主题，以及一个 GitHub Pages 工作流程。CSS 导入、`@source` 路径和基本路径都已预配置——无需手动设置。现有用户在使用 Astro 5 或 6 时，其功能将继续可用（`peerDependencies.astro` 等于 `>=5`）。

### 编辑您的内容

所有页面内容都位于 `site/src/site-config.ts` 中。编辑配置对象以自定义您的着陆页：

```typescript
import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '@mcptoolshop/my-tool',
  description: 'What my tool does.',
  logoBadge: 'MT',
  brandName: 'my-tool',
  repoUrl: 'https://github.com/mcp-tool-shop-org/my-tool',
  packageUrl: 'https://www.npmjs.com/package/@mcptoolshop/my-tool',
  footerText: 'MIT Licensed',

  hero: { /* ... */ },
  sections: [ /* ... */ ],
};
```

---

## 前端门户

site-theme 渲染仓库的**人类**可见的前端门户；**front-door** 验证其**代理/机器**前端门户——即 README、`AGENTS.md` 和 `llms.txt`，这是人类、代理和工具首先读取的内容。它采用“先验证”的原则：它不会为您编写散文，而是证明您的散文是真实且简洁的。

```bash
npx @mcptoolshop/site-theme front-door verify                  # audit; exits 1 if the gate fails
npx @mcptoolshop/site-theme front-door verify --run-doctests   # also compile/run fenced JS examples
npx @mcptoolshop/site-theme front-door init                    # scaffold a minimal, verify-clean front door
npx @mcptoolshop/site-theme front-door standard                # print the front-door spine
npx @mcptoolshop/site-theme front-door eval                    # the verifier's self-eval receipt
npx @mcptoolshop/site-theme front-door mcp                     # start the MCP server (agents call verify)
```

它将每个已记录的声明路由到可以支持该声明的证据——无效的路径/脚本/链接、AGENTS.md↔README 重复、状态徽章不可信、示例导入与实际 `exports` 的对比（并且，通过 `--run-doctests`，确保示例可以实际编译和运行）、来源声明与实际证明的对比，以及冗余（`AGENTS.md` 的长度/可读性/指令预算）。结果按风险级别排序，分为四个类别：已验证/已驳斥/缺失/无法验证。

以编程方式使用它（shipcheck 使用此功能）：

```js
import { verify } from '@mcptoolshop/site-theme/front-door';

const scorecard = verify({ root: process.cwd() });
if (!scorecard.gate.pass) process.exit(1);
```

或者让代理调用它：`front-door mcp` 启动一个零依赖的 MCP 服务器（stdio），公开 `front_door_verify`——代理接收相同的结构化评分。

请参阅 [前端门户参考](docs/front-door.md)，了解完整的通道列表和标准。

---

## 设计令牌

该主题通过 `styles/theme.css` 提供语义设计令牌。组件引用这些令牌，而不是使用硬编码的颜色，因此您可以仅通过覆盖几个值来重新设计整个主题。

### 默认令牌

| 令牌 | 默认值 | 用于 |
|-------|---------|----------|
| `--color-surface` | `#09090b` | 页面背景 |
| `--color-surface-raised` | `#18181b` | 高亮元素、代码块 |
| `--color-surface-strong` | `#27272a` | 徽章、强调背景 |
| `--color-edge` | `#27272a` | 主要边框 |
| `--color-edge-subtle` | `#18181b` | 卡片/表格边框 |
| `--color-heading` | `#fafafa` | 标题、主要文本 |
| `--color-body` | `#e4e4e7` | 正文/辅助文本 |
| `--color-muted` | `#d4d4d8` | 柔和的文本 |
| `--color-dim` | `#a1a1aa` | 标签、描述 |
| `--color-accent` | `#34d399` | 状态指示器 |
| `--color-action` | `#fafafa` | 主要按钮背景 |
| `--color-action-text` | `#09090b` | 主要按钮文本 |
| `--color-action-hover` | `#e4e4e7` | 主要按钮悬停 |

### 自定义

通过在您的站点 `global.css` 中添加 `@theme` 块来覆盖任何令牌：

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

令牌生成标准的 Tailwind v4 实用程序（`bg-surface`、`text-heading`、`border-edge` 等），因此您也可以在自己的组件中使用它们。

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
import DocLayout from '@mcptoolshop/site-theme/components/DocLayout.astro';
import Sidebar from '@mcptoolshop/site-theme/components/Sidebar.astro';
import TableOfContents from '@mcptoolshop/site-theme/components/TableOfContents.astro';
import ContentSection from '@mcptoolshop/site-theme/components/ContentSection.astro';
import SocialProof from '@mcptoolshop/site-theme/components/SocialProof.astro';
import PricingGrid from '@mcptoolshop/site-theme/components/PricingGrid.astro';
import TestimonialGrid from '@mcptoolshop/site-theme/components/TestimonialGrid.astro';
import CtaBanner from '@mcptoolshop/site-theme/components/CtaBanner.astro';
import PortfolioGrid from '@mcptoolshop/site-theme/components/PortfolioGrid.astro';
import FilterBar from '@mcptoolshop/site-theme/components/FilterBar.astro';
---
```

该主题提供 17 个 Astro 组件，分为五个类别：布局框架、内容区域、营销模块、作品集和文档。

### BaseLayout

带有固定标题（徽标徽章、导航链接、GitHub/包按钮）和页脚的完整页面框架。命名插槽 `head` 是用于附加额外 `<head>` 标签（OG 图像、JSON-LD、preconnect）的扩展点。

| 属性 | 类型 | 描述 |
|------|------|-------------|
| `title` | `string` | 页面 `<title>` |
| `description` | `string` | 元描述 |
| `logoBadge` | `string` | 1-2 个字符的徽章（例如 `"RS"`） |
| `brandName` | `string` | 标题中的名称 |
| `nav` | `{ href, label }[]` | 锚导航链接（可选，默认为 `[]`） |
| `repoUrl` | `string` | GitHub 仓库 URL |
| `packageUrl?` | `string` | 主要的注册表列表（npm、PyPI、crates.io 等）。标签是从主机派生的。 |
| `packageLabel?` | `string` | 可选的 `packageUrl` 显示标签覆盖 |
| `npmUrl?` | `string` | `packageUrl` 的已弃用别名 |
| `footerText` | `string` | 页脚文本（允许 HTML） |

```astro
<BaseLayout {title} {description} {logoBadge} {brandName} {repoUrl} packageUrl={config.packageUrl} {footerText}>
  <Fragment slot="head">
    <meta property="og:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={ogImage} />
  </Fragment>
  <!-- page body -->
</BaseLayout>
```

### Hero

带有状态徽章、标题、行动号召和可选代码预览卡片的渐变醒目标题。

| 属性 | 类型 | 描述 |
|------|------|-------------|
| `badge` | `string` | 状态徽章文本 |
| `headline` | `string` | 主要标题 |
| `headlineAccent` | `string` | 柔和的后缀 |
| `description` | `string` | 描述（允许 HTML） |
| `primaryCta` | `{ href, label }` | 主要按钮 |
| `secondaryCta` | `{ href, label }` | 次要按钮 |
| `previews` | `{ label, code }[]` | 代码预览卡片（可选） |

### Section

带有锚 `id`、标题和可选副标题的区域包装器。

### FeatureGrid

3 列响应式卡片网格。属性：`features: { title, desc }[]`

### DataTable

基于网格的带边框的表格。属性：`columns: string[]`、`rows: string[][]`

### CodeCardGrid

2 列深色代码块卡片网格。属性：`cards: { title, code }[]`

### ApiList

全宽堆叠的 API 参考卡片。属性：`apis: { signature, description }[]`

### FilterBar

用于作品集网格的客户端搜索 + 标签筛选栏。属性：`tags: string[]`、`searchable?: boolean`、`searchPlaceholder?: string`

### PortfolioGrid

可配置的卡片网格，带有状态徽章、类别分组以及图像/徽章回退。属性：`items: PortfolioItem[]`、`columns?: 2 | 3 | 4`、`groupByCategory?: boolean`

### DocLayout

带有可折叠侧边栏和主要内容区域的两栏布局。由 **docs** 模板使用。属性：`sidebar: SidebarGroup[]`、`currentPath: string`

### Sidebar

带有活动链接高亮的组导航列表。属性：`groups: SidebarGroup[]`、`currentPath?: string`

### TableOfContents

页面内标题导航。属性：`headings?: { text, id, depth }[]`

### 内容区块

通过 `set:html` 渲染 HTML 的锚链接内容区块。属性：`id: string`、`title: string`、`content: string`

### 社交证明

带有标题和值/标签对的统计栏。属性：`headline?: string`、`stats?: { value, label }[]`

### 定价网格

带有突出显示的“热门”层级的响应式定价层级卡。属性：`tiers?: PricingTier[]`

### 推荐语网格

带有头像回退初始字母的两列引用卡。属性：`testimonials?: { quote, author, role, avatarUrl? }[]`

### 行动号召横幅

全宽渐变行动号召横幅。属性：`headline: string`、`description?: string`、`cta: { href, label }`

---

## 区块类型

配置中的 `sections` 数组支持以下 `kind` 值：

| 类型 | 组件 | 属性 |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

区块按照它们在数组中出现的顺序进行渲染。

---

## 部署

`init` CLI 会自动创建 `.github/workflows/pages.yml`。要上线：

1. 将您的仓库推送到 GitHub
2. 转到您的仓库 → **设置 → 页面**
3. 在“构建和部署”下，将“来源”设置为“GitHub Actions”
4. 推送任何更改到 `site/`，以触发第一次构建

您的网站将在 `https://<org>.github.io/<repo>/` 上线。

---

## 安全性和数据范围

| 方面 | 详情 |
|--------|--------|
| **Data touched** | 主题：Astro 组件、CSS 令牌、构建时的站点配置。前端：README / AGENTS.md / llms.txt / CLAUDE.md（位于磁盘上）。 |
| **Data NOT touched** | 没有用户帐户，没有运行时站点状态，没有分析，没有第三方 API |
| **Permissions** | 读取：项目源代码。写入：`init` 在 cwd（或 `--out`）中写入 `site/`。除非 `--run-doctests`，否则验证是只读的。 |
| **Network** | 默认情况下禁用。MCP 是 stdio。`--run-doctests` 是可选的子进程执行；它不会安装软件包或打开网络。 |
| **Telemetry** | 不收集或发送任何数据 |

### HTML 属性（set:html）

多个组件属性通过 Astro 的 `set:html` 指令渲染原始 HTML。如果您的数据源不可信（用户生成的内容、外部 API），请在使用像 [DOMPurify](https://github.com/cure53/DOMPurify) 或 [sanitize-html](https://github.com/apostrophecms/sanitize-html) 这样的库之前，**先清理 HTML**。

| 组件 | 使用 set:html 的属性 |
|-----------|---------------------|
| BaseLayout | `footerText` |
| Hero | `badge`, `description` |
| CodeCardGrid | `cards[].code` |
| ApiList | `apis[].signature`, `apis[].description` |
| 内容区块 | `content` |

有关漏洞报告，请参阅 [SECURITY.md](SECURITY.md)。

## 评分卡

| 类别 | 分数 |
|----------|-------|
| A. 安全性 | 10 |
| B. 错误处理 | 10 |
| C. 操作文档 | 10 |
| D. 发布规范 | 10 |
| E. 身份（软） | 10 |
| **Overall** | **50/50** |

> 完整审计：[SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## 许可证

MIT

---

由 [MCP Tool Shop](https://mcp-tool-shop.github.io/) 构建
