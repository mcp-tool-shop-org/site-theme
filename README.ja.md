<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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
  <img src="https://img.shields.io/badge/templates-default_·_docs_·_product_·_portfolio_·_app-34d399" alt="Templates: default · docs · product · portfolio · app" />
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

## テンプレート

テンプレートを選択して、スキャフォールディングを行い、ビルドします。すべてのテンプレートには、CIテストが施され、GitHub Pagesで利用できる状態で提供されます。

| テンプレート | 説明 | ページ |
|----------|-------------|-------|
| **default** | ヒーロー、機能、コード例を備えたプロジェクトのランディングページ | 1 |
| **docs** | サイドバーナビゲーションとコンテンツセクションを備えたドキュメントサイト | 1 |
| **product** | 価格設定、お客様の声、CTAを備えたマーケティングランディングページ | 1 |
| **portfolio** | ツール、プロジェクト、またはその他のコレクションのフィルタリング可能なカタロググリッド | 1 |
| **app** | RBAC、機能フラグ、ワークスペースルーティングを備えたマルチテナントSaaSダッシュボード | 31 |

```bash
npx @mcptoolshop/site-theme list-templates            # see all options
npx @mcptoolshop/site-theme list-templates --json      # machine-readable output
npx @mcptoolshop/site-theme init --template app        # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run   # preview files
npx @mcptoolshop/site-theme init --out ../other-repo   # scaffold into another directory
```

---

## クイックスタート

### 新しいサイトをスキャフォールディングします

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

これにより、Astro + Tailwind + テーマが設定された`site/`ディレクトリと、GitHub Pagesワークフローが作成されます。CSSインポート、`@source`パス、およびベースパスはすべて事前に構成されているため、手動でのセットアップは必要ありません。

### コンテンツを編集します

すべてのページコンテンツは`site/src/site-config.ts`にあります。ランディングページをカスタマイズするには、configオブジェクトを編集してください。

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

## フロントドア

`site-theme`はリポジトリの**人間が閲覧する**ためのフロントドアをレンダリングします。`front-door`は、その**エージェント/マシン**用のフロントドア（README、`AGENTS.md`、および`llms.txt`）を検証します。これは、まず検証を行うように設計されています。文章を作成するのではなく、文章が真実であり、最小限であることを証明します。

```bash
npx @mcptoolshop/site-theme front-door verify                  # audit; exits 1 if the gate fails
npx @mcptoolshop/site-theme front-door verify --run-doctests   # also compile/run fenced JS examples
npx @mcptoolshop/site-theme front-door init                    # scaffold a minimal, verify-clean front door
npx @mcptoolshop/site-theme front-door standard                # print the front-door spine
npx @mcptoolshop/site-theme front-door eval                    # the verifier's self-eval receipt
npx @mcptoolshop/site-theme front-door mcp                     # start the MCP server (agents call verify)
```

各ドキュメント化された主張は、それを裏付ける証拠にルーティングされます。これには、存在しないパス/スクリプト/リンク、`AGENTS.md`とREADMEの重複、ステータスバッジに対する不信感、例のインポートと実際の`exports`との比較（および、`--run-doctests`を使用すると、例が実際にコンパイルされ実行されること）、プロベナンスの主張と実際の認証との比較、および冗長性（`AGENTS.md`の長さ/可読性/ディレクティブ予算）が含まれます。結果はリスクに基づいて4つのバケットに分類されます：検証済み/矛盾/未検出/検証不能。

プログラムで利用できます（shipcheckがこれを使用します）。

```js
import { verify } from '@mcptoolshop/site-theme/front-door';

const scorecard = verify({ root: process.cwd() });
if (!scorecard.gate.pass) process.exit(1);
```

または、エージェントに実行させることができます。`front-door mcp`は、ゼロ依存のMCPサーバー（stdio）を起動し、`front_door_verify`を公開します。エージェントは同じ構造化されたスコアカードを受信します。

完全なチャンネルリストと標準については、[フロントドアリファレンス](docs/front-door.md)を参照してください。

---

## デザイントークン

このテーマには、`styles/theme.css`を介してセマンティックなデザイントークンが含まれています。コンポーネントはハードコードされた色ではなく、これらのトークンを参照するため、いくつかの値をオーバーライドすることで、テーマ全体の外観を変更できます。

### デフォルトのトークン

| トークン | デフォルト値 | 使用箇所 |
|-------|---------|----------|
| `--color-surface` | `#09090b` | ページ背景 |
| `--color-surface-raised` | `#18181b` | 強調された要素、コードブロック |
| `--color-surface-strong` | `#27272a` | バッジ、強調表示された背景 |
| `--color-edge` | `#27272a` | プライマリボーダー |
| `--color-edge-subtle` | `#18181b` | カード/テーブルのボーダー |
| `--color-heading` | `#fafafa` | 見出し、主要なテキスト |
| `--color-body` | `#e4e4e7` | 本文/二次的なテキスト |
| `--color-muted` | `#d4d4d8` | 薄暗いテキスト |
| `--color-dim` | `#a1a1aa` | ラベル、説明 |
| `--color-accent` | `#34d399` | ステータスインジケーター |
| `--color-action` | `#fafafa` | プライマリボタンの背景 |
| `--color-action-text` | `#09090b` | プライマリボタンのテキスト |
| `--color-action-hover` | `#e4e4e7` | プライマリボタンのホバー時 |

### カスタマイズ

サイトの`global.css`で、インポート後に`@theme`ブロックを追加することで、任意のトークンをオーバーライドできます。

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

トークンは標準のTailwind v4ユーティリティ（`bg-surface`、`text-heading`、`border-edge`など）を生成するため、独自のコンポーネントでも使用できます。

---

## コンポーネント

パッケージから個々のコンポーネントをインポートします。

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

このテーマには、5つのカテゴリ（レイアウトシェル、コンテンツセクション、マーケティングブロック、ポートフォリオ、ドキュメント）にまたがる17のAstroコンポーネントが含まれています。

### BaseLayout

ステッカーヘッダー（ロゴバッジ、ナビゲーションリンク、GitHub/npmボタン）、およびフッターを備えたフルページシェル。

| プロパティ | 型 | 説明 |
|------|------|-------------|
| `title` | `string` | ページの`<title>` |
| `description` | `string` | メタ記述 |
| `logoBadge` | `string` | 1〜2文字のバッジ（例：`"RS"`） |
| `brandName` | `string` | ヘッダーの名前 |
| `nav` | `{ href, label }[]` | アンカーナビゲーションリンク（オプション、デフォルトは[]） |
| `repoUrl` | `string` | GitHubリポジトリURL |
| `npmUrl?` | `string` | npmパッケージURL |
| `footerText` | `string` | フッターテキスト（HTMLを許可） |

### Hero

グラデーションヒーロー、ステータスバッジ、見出し、CTA、およびオプションのコードプレビューカード。

| プロパティ | 型 | 説明 |
|------|------|-------------|
| `badge` | `string` | ステータスバッジのテキスト |
| `headline` | `string` | メインの見出し |
| `headlineAccent` | `string` | 薄暗いサフィックス |
| `description` | `string` | 説明（HTMLを許可） |
| `primaryCta` | `{ href, label }` | プライマリボタン |
| `secondaryCta` | `{ href, label }` | セカンダリボタン |
| `previews` | `{ label, code }[]` | コードプレビューカード（オプション） |

### Section

アンカー`id`、見出し、およびオプションのサブタイトルを備えたセクションラッパー。

### FeatureGrid

3列のレスポンシブカードグリッド。プロパティ：`features: { title, desc }[]`

### DataTable

グリッドベースのボーダー付きテーブル。プロパティ：`columns: string[]`, `rows: string[][]`

### CodeCardGrid

2列のダークコードブロックカードグリッド。プロパティ：`cards: { title, code }[]`

### ApiList

フル幅の積み重ねられたAPIリファレンスカード。プロパティ：`apis: { signature, description }[]`

### FilterBar

ポートフォリオグリッド用のクライアント側の検索+タグフィルタリングバー。プロパティ：`tags: string[]`, `searchable?: boolean`, `searchPlaceholder?: string`

### PortfolioGrid

ステータスバッジ、カテゴリグループ化、および画像/バッジのフォールバックを備えた構成可能なカードグリッド。プロパティ：`items: PortfolioItem[]`, `columns?: 2 | 3 | 4`, `groupByCategory?: boolean`

### DocLayout

折りたたみ式のサイドバーとメインコンテンツエリアを備えた2列レイアウト。**docs**テンプレートで使用されます。プロパティ：`sidebar: SidebarGroup[]`, `currentPath: string`

### Sidebar

アクティブなリンクを強調表示するグループ化されたナビゲーションリスト。プロパティ：`groups: SidebarGroup[]`, `currentPath?: string`

### 目次

ページ内の見出しによるナビゲーション。プロパティ：`headings?: { text, id, depth }[]`

### コンテンツセクション

アンカーリンクされたコンテンツブロックで、`set:html` を使用して HTML をレンダリングします。プロパティ：`id: string`, `title: string`, `content: string`

### ソーシャルプルーフ

見出しと値/ラベルのペアを持つ統計バー。プロパティ：`headline?: string`, `stats?: { value, label }[]`

### 価格表

「人気」ティアを強調表示した、レスポンシブな価格帯カード。プロパティ：`tiers?: PricingTier[]`

### お客様の声グリッド

アバターの代替画像（初期文字）付きの2列の引用カード。プロパティ：`testimonials?: { quote, author, role, avatarUrl? }[]`

### CTAバナー

画面全体に広がるグラデーションを使用した、行動を促すバナー。プロパティ：`headline: string`, `description?: string`, `cta: { href, label }`

---

## セクションの種類

構成ファイルの `sections` 配列は、これらの `kind` 値をサポートしています。

| 種類 | コンポーネント | プロパティ |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

セクションは、配列内の表示順にレンダリングされます。

---

## デプロイ

`init` CLI は、`.github/workflows/pages.yml` を自動的に作成します。公開するには：

1. リポジトリを GitHub にプッシュします。
2. リポジトリに移動し、**[設定] → [Pages]** を選択します。
3. **[ビルドとデプロイ]** の下で、**[ソース]** を **[GitHub Actions]** に設定します。
4. `site/` に変更をプッシュして、最初のビルドを開始します。

サイトは `https://<org>.github.io/<repo>/` で公開されます。

---

## セキュリティとデータ範囲

| 側面 | 詳細 |
|--------|--------|
| **Data touched** | Astro コンポーネントファイル、CSS トークン、サイト構成 — ビルド時にのみ使用 |
| **Data NOT touched** | ユーザーデータなし、実行時の状態なし、サーバー側の処理なし |
| **Permissions** | 読み取り：プロジェクトのソースファイル。書き込み：ビルド出力を `site/dist/` に出力 |
| **Network** | なし — 実行時のネットワークアクセスがない静的サイトジェネレーター |
| **Telemetry** | 収集または送信されるデータはなし |

### HTML プロパティ (set:html)

いくつかのコンポーネントのプロパティは、Astro の `set:html` ディレクティブを使用して生の HTML をレンダリングします。データのソースが信頼できない場合（ユーザー生成コンテンツ、外部 API）、[DOMPurify](https://github.com/cure53/DOMPurify) や [sanitize-html](https://github.com/apostrophecms/sanitize-html) などのライブラリを使用して、**HTML を渡す前にサニタイズしてください**。

| コンポーネント | `set:html` を使用するプロパティ |
|-----------|---------------------|
| BaseLayout | `footerText` |
| Hero | `badge`, `description` |
| CodeCardGrid | `cards[].code` |
| ApiList | `apis[].signature`, `apis[].description` |
| コンテンツセクション | `content` |

脆弱性の報告については、[SECURITY.md](SECURITY.md) を参照してください。

## スコアカード

| カテゴリ | スコア |
|----------|-------|
| A. セキュリティ | 10 |
| B. エラー処理 | 10 |
| C. 運用ドキュメント | 10 |
| D. リリース衛生管理 | 10 |
| E. ID (ソフト) | 10 |
| **Overall** | **50/50** |

> 完全な監査：[SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## ライセンス

MIT

---

[MCP Tool Shop](https://mcp-tool-shop.github.io/) によって作成されました。
