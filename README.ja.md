<p align="center">
  <a href="README.md">English</a> | <strong>日本語</strong> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/site-theme/main/assets/preview.png" alt="site-theme プレビュー" width="800" />
</p>

<h1 align="center">@mcptoolshop/site-theme</h1>

<p align="center">
  MCP Tool Shop プロジェクトのランディングページ向け、Config 駆動型 Astro テーマ。<br/>
  ダークパレット · Tailwind CSS v4 · GitHub Pages 対応。
</p>

<p align="center">
  <a href="#クイックスタート">クイックスタート</a> &middot;
  <a href="#デザイントークン">デザイントークン</a> &middot;
  <a href="#コンポーネント">コンポーネント</a> &middot;
  <a href="#デプロイ">デプロイ</a> &middot;
  <a href="#ライセンス">ライセンス</a>
</p>

---

## クイックスタート

### 新しいサイトをスキャフォールド

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

`site/` ディレクトリが作成され、Astro + Tailwind + テーマが設定済みの状態で配置されます。GitHub Pages ワークフローも含まれます。CSS インポート、`@source` パス、ベースパスはすべて自動設定されます。

### コンテンツを編集

すべてのページコンテンツは `site/src/site-config.ts` に集約されています。設定オブジェクトを編集してランディングページをカスタマイズしてください：

```typescript
import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '@mcptoolshop/my-tool',
  description: 'ツールの説明。',
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

テーマは `styles/theme.css` でセマンティックなデザイントークンを提供しています。コンポーネントはハードコードされた色ではなくこれらのトークンを参照するため、いくつかの値を上書きするだけでテーマ全体を変更できます。

### デフォルトトークン

| トークン | デフォルト | 用途 |
|---------|-----------|------|
| `--color-surface` | `#09090b` | ページ背景 |
| `--color-surface-raised` | `#18181b` | 浮き上がった要素、コードブロック |
| `--color-surface-strong` | `#27272a` | バッジ、強調背景 |
| `--color-edge` | `#27272a` | 主要ボーダー |
| `--color-edge-subtle` | `#18181b` | カード・テーブルのボーダー |
| `--color-heading` | `#fafafa` | 見出し、主要テキスト |
| `--color-body` | `#e4e4e7` | 本文・副テキスト |
| `--color-muted` | `#d4d4d8` | ミュートテキスト |
| `--color-dim` | `#a1a1aa` | ラベル、説明 |
| `--color-accent` | `#34d399` | ステータスインジケーター |
| `--color-action` | `#fafafa` | 主要ボタン背景 |
| `--color-action-text` | `#09090b` | 主要ボタンテキスト |
| `--color-action-hover` | `#e4e4e7` | 主要ボタンホバー |

### カスタマイズ

サイトの `global.css` でインポートの後に `@theme` ブロックを追加してトークンを上書きできます：

```css
@import "tailwindcss";
@import "@mcptoolshop/site-theme/styles/theme.css";
@source "../../node_modules/@mcptoolshop/site-theme";

/* トークンを上書き */
@theme {
  --color-accent: #60a5fa;          /* 青いステータスドット */
  --color-surface: #0a0a1a;         /* ネイビー背景         */
  --color-action: #60a5fa;          /* 青いボタン           */
  --color-action-hover: #3b82f6;
}
```

トークンは標準の Tailwind v4 ユーティリティ（`bg-surface`、`text-heading`、`border-edge` など）を生成するので、独自のコンポーネントでも使用できます。

---

## コンポーネント

パッケージから個別にインポートします：

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

スティッキーヘッダー（ロゴバッジ、ナビリンク、GitHub/npm ボタン）とフッターを含むページシェル。

| Prop | 型 | 説明 |
|------|----|------|
| `title` | `string` | ページ `<title>` |
| `description` | `string` | メタディスクリプション |
| `logoBadge` | `string` | 1〜2文字のロゴバッジ（例: `"RS"`） |
| `brandName` | `string` | ヘッダーの名前 |
| `nav` | `{ href, label }[]` | アンカーナビリンク |
| `repoUrl` | `string` | GitHub リポジトリ URL |
| `npmUrl?` | `string` | npm パッケージ URL |
| `footerText` | `string` | フッターテキスト（HTML 可） |

### Hero

グラデーションヒーローセクション。ステータスバッジ、見出し、CTA、オプションのコードプレビューカードを含みます。

| Prop | 型 | 説明 |
|------|----|------|
| `badge` | `string` | ステータスバッジテキスト |
| `headline` | `string` | メイン見出し |
| `headlineAccent` | `string` | ミュートサフィックス |
| `description` | `string` | 説明（HTML 可） |
| `primaryCta` | `{ href, label }` | 主要ボタン |
| `secondaryCta` | `{ href, label }` | 副次ボタン |
| `previews` | `{ label, code }[]` | コードプレビューカード |

### Section

アンカー `id`、見出し、オプションのサブタイトルを持つセクションラッパー。

### FeatureGrid

3カラムのレスポンシブカードグリッド。Props: `features: { title, desc }[]`

### DataTable

グリッドベースのボーダー付きテーブル。Props: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

ダークなコードブロックカードの2カラムグリッド。Props: `cards: { title, code }[]`

### ApiList

全幅のスタック型 API リファレンスカード。Props: `apis: { signature, description }[]`

---

## セクションタイプ

設定の `sections` 配列は以下の `kind` 値をサポートします：

| Kind | コンポーネント | Props |
|------|--------------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

セクションは配列に記載された順序でレンダリングされます。

---

## デプロイ

`init` CLI は `.github/workflows/pages.yml` を自動的に作成します。公開するには：

1. リポジトリを GitHub にプッシュ
2. リポジトリ → **Settings → Pages** へ移動
3. **Build and deployment** の **Source** を **GitHub Actions** に設定
4. `site/` への変更をプッシュして最初のビルドをトリガー

サイトは `https://<org>.github.io/<repo>/` で公開されます。

---

## ライセンス

MIT
