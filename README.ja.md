<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

## テンプレート

テンプレートを選択し、雛形を作成し、ビルドします。すべてのテンプレートは、CIテスト済みで、GitHub Pagesに対応しています。

| テンプレート | 説明 | ページ |
|----------|-------------|-------|
| **default** | ヒーロー画像、機能、コード例を含むプロジェクトのランディングページ | 1 |
| **docs** | サイドバーナビゲーションとコンテンツセクションを備えたドキュメントサイト | 1 |
| **product** | 価格、お客様の声、CTAボタンを含むマーケティングランディングページ | 1 |
| **app** | RBAC（役割ベースのアクセス制御）、機能フラグ、ワークスペースルーティングを備えたマルチテナントSaaSダッシュボード | 31 |

```bash
npx @mcptoolshop/site-theme list-templates        # see all options
npx @mcptoolshop/site-theme init --template app    # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run  # preview files
```

---

## クイックスタート

### 新しいサイトの雛形を作成

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

これにより、`site/` ディレクトリが作成され、Astro + Tailwind + テーマが設定され、さらにGitHub Pagesのワークフローが設定されます。CSSのインポート、`@source` パス、およびベースパスはすべて事前に設定されているため、手動での設定は不要です。

### コンテンツを編集

すべてのページコンテンツは `site/src/site-config.ts` にあります。設定オブジェクトを編集して、ランディングページをカスタマイズします。

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

## デザイントークン

このテーマは、`styles/theme.css` を通じて、意味のあるデザイントークンを提供します。コンポーネントは、ハードコードされた色ではなく、これらのトークンを参照するため、いくつかの値を上書きするだけで、テーマ全体を再構成できます。

### デフォルトのトークン

| トークン | デフォルト | 用途 |
|-------|---------|----------|
| `--color-surface` | `#09090b` | ページ背景 |
| `--color-surface-raised` | `#18181b` | 強調表示された要素、コードブロック |
| `--color-surface-strong` | `#27272a` | バッジ、強調表示された背景 |
| `--color-edge` | `#27272a` | プライマリボーダー |
| `--color-edge-subtle` | `#18181b` | カード/テーブルボーダー |
| `--color-heading` | `#fafafa` | 見出し、プライマリテキスト |
| `--color-body` | `#e4e4e7` | 本文/セカンダリテキスト |
| `--color-muted` | `#d4d4d8` | ミュートされたテキスト |
| `--color-dim` | `#a1a1aa` | ラベル、説明 |
| `--color-accent` | `#34d399` | ステータスインジケーター |
| `--color-action` | `#fafafa` | プライマリボタンの背景色 |
| `--color-action-text` | `#09090b` | プライマリボタンのテキスト色 |
| `--color-action-hover` | `#e4e4e7` | プライマリボタンのホバー時の状態 |

### カスタマイズ

サイトの `global.css` で、インポートの後に `@theme` ブロックを追加することで、任意のトークンを上書きできます。

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

トークンは、標準のTailwind v4ユーティリティ (`bg-surface`, `text-heading`, `border-edge` など) を生成するため、これらのトークンを独自のコンポーネントで使用することもできます。

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
---
```

### BaseLayout

ヘッダー（ロゴバッジ、ナビゲーションリンク、GitHub/npmボタン）とフッターを備えたフルページのシェル。

| プロパティ | 型 | 説明 |
|------|------|-------------|
| `title` | `string` | ページタイトル |
| `description` | `string` | メタディスクリプション |
| `logoBadge` | `string` | 1～2文字のバッジ（例：「RS」） |
| `brandName` | `string` | ヘッダーに表示される名前 |
| `nav` | `{ href, label }[]` | ナビゲーションリンク |
| `repoUrl` | `string` | GitHubリポジトリのURL |
| `npmUrl?` | `string` | npmパッケージのURL |
| `footerText` | `string` | フッターのテキスト（HTMLを使用可能） |

### ヒーロー

ステータスバッジ、見出し、CTAボタン、およびオプションのコードプレビューカードを備えたグラデーションヒーロー。

| プロパティ | 型 | 説明 |
|------|------|-------------|
| `badge` | `string` | ステータスバッジのテキスト |
| `headline` | `string` | メインの見出し |
| `headlineAccent` | `string` | ミュートされたサフィックス |
| `description` | `string` | 説明（HTMLを使用可能） |
| `primaryCta` | `{ href, label }` | プライマリボタン |
| `secondaryCta` | `{ href, label }` | セカンダリボタン |
| `previews` | `{ label, code }[]` | コードプレビューカード |

### セクション

アンカーID、見出し、およびオプションのサブタイトルを備えたセクションラッパー。

### FeatureGrid

3列のレスポンシブカードグリッド。プロパティ：`features: { title, desc }[]`

### DataTable

境界線付きのグリッドテーブル。プロパティ：`columns: string[]`, `rows: string[][]`

### CodeCardGrid

2列のダークなコードブロックカードグリッド。プロパティ：`cards: { title, code }[]`

### ApiList

フル幅のスタックされたAPIリファレンスカード。プロパティ：`apis: { signature, description }[]`

---

## セクションの種類

設定ファイル内の `sections` 配列は、次の `kind` 値をサポートしています。

| 種類 | コンポーネント | プロパティ |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

セクションは、配列に記述された順序で表示されます。

---

## デプロイ

`init` コマンドラインツールは、`.github/workflows/pages.yml` ファイルを自動的に作成します。公開するには、以下の手順に従ってください。

1. リポジトリをGitHubにプッシュします。
2. リポジトリ → **設定 → Pages** に移動します。
3. **ビルドとデプロイ** の下で、**ソース** を **GitHub Actions** に設定します。
4. `site/` フォルダに変更をプッシュして、最初のビルドをトリガーします。

サイトは `https://<組織名>.github.io/<リポジトリ名>/` で公開されます。

---

## セキュリティとデータ範囲

| 側面 | 詳細 |
|--------|--------|
| **Data touched** | Astroコンポーネントファイル、CSSトークン、サイト設定 - ビルド時のみ |
| **Data NOT touched** | ユーザーデータは一切含まれません。また、実行時状態やサーバーサイド処理も行われません。 |
| **Permissions** | 読み取り: プロジェクトのソースファイル。書き込み: ビルド出力ファイル（site/dist/） |
| **Network** | なし - 実行時ネットワークアクセスを行わない静的サイトジェネレーターです。 |
| **Telemetry** | 収集も送信も行いません。 |

脆弱性に関する報告については、[SECURITY.md](SECURITY.md) を参照してください。

## スコアカード

| カテゴリ | スコア |
|----------|-------|
| A. セキュリティ | 10 |
| B. エラー処理 | 10 |
| C. 運用ドキュメント | 10 |
| D. リリース時の品質 | 10 |
| E. 認証 (ソフト) | 10 |
| **Overall** | **50/50** |

> 詳細な監査: [SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## ライセンス

MIT
