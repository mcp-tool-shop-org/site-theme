<p align="center">
  <a href="README.md">English</a> | <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <strong>Português</strong>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/site-theme/main/assets/preview.png" alt="pré-visualização do site-theme" width="800" />
</p>

<h1 align="center">@mcptoolshop/site-theme</h1>

<p align="center">
  Tema Astro orientado por configuração para páginas iniciais de projetos MCP Tool Shop.<br/>
  Paleta escura · Tailwind CSS v4 · Pronto para GitHub Pages.
</p>

<p align="center">
  <a href="#início-rápido">Início rápido</a> &middot;
  <a href="#tokens-de-design">Tokens de design</a> &middot;
  <a href="#componentes">Componentes</a> &middot;
  <a href="#implantação">Implantação</a> &middot;
  <a href="#licença">Licença</a>
</p>

---

## Início rápido

### Criar um novo site

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

Isso cria um diretório `site/` com Astro + Tailwind + tema já configurados, além de um workflow para GitHub Pages. A importação CSS, o caminho `@source` e o caminho base estão pré-configurados — nenhuma configuração manual necessária.

### Editar seu conteúdo

Todo o conteúdo da página fica em `site/src/site-config.ts`. Edite o objeto de configuração para personalizar sua página inicial:

```typescript
import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '@mcptoolshop/my-tool',
  description: 'O que minha ferramenta faz.',
  logoBadge: 'MT',
  brandName: 'my-tool',
  repoUrl: 'https://github.com/mcp-tool-shop-org/my-tool',
  npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/my-tool',
  footerText: 'Licença MIT',

  hero: { /* ... */ },
  sections: [ /* ... */ ],
};
```

---

## Tokens de design

O tema fornece tokens de design semânticos via `styles/theme.css`. Os componentes referenciam esses tokens em vez de cores fixas, então você pode personalizar o visual do tema inteiro sobrescrevendo apenas alguns valores.

### Tokens padrão

| Token | Padrão | Usado para |
|-------|--------|------------|
| `--color-surface` | `#09090b` | Fundo da página |
| `--color-surface-raised` | `#18181b` | Elementos elevados, blocos de código |
| `--color-surface-strong` | `#27272a` | Badges, fundos enfatizados |
| `--color-edge` | `#27272a` | Bordas principais |
| `--color-edge-subtle` | `#18181b` | Bordas de cards/tabelas |
| `--color-heading` | `#fafafa` | Títulos, texto principal |
| `--color-body` | `#e4e4e7` | Corpo / texto secundário |
| `--color-muted` | `#d4d4d8` | Texto atenuado |
| `--color-dim` | `#a1a1aa` | Rótulos, descrições |
| `--color-accent` | `#34d399` | Indicadores de status |
| `--color-action` | `#fafafa` | Fundo do botão principal |
| `--color-action-text` | `#09090b` | Texto do botão principal |
| `--color-action-hover` | `#e4e4e7` | Hover do botão principal |

### Personalização

Sobrescreva qualquer token no `global.css` do seu site adicionando um bloco `@theme` após as importações:

```css
@import "tailwindcss";
@import "@mcptoolshop/site-theme/styles/theme.css";
@source "../../node_modules/@mcptoolshop/site-theme";

/* Sobrescrever tokens */
@theme {
  --color-accent: #60a5fa;          /* ponto de status azul  */
  --color-surface: #0a0a1a;         /* fundo azul-marinho    */
  --color-action: #60a5fa;          /* botões azuis          */
  --color-action-hover: #3b82f6;
}
```

Os tokens geram utilitários padrão do Tailwind v4 (`bg-surface`, `text-heading`, `border-edge`, etc.) que também podem ser usados em seus próprios componentes.

---

## Componentes

Importe os componentes individualmente do pacote:

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

Estrutura de página completa com cabeçalho fixo (badge do logo, links de navegação, botões GitHub/npm) e rodapé.

| Prop | Tipo | Descrição |
|------|------|-----------|
| `title` | `string` | `<title>` da página |
| `description` | `string` | Meta descrição |
| `logoBadge` | `string` | Badge de 1–2 caracteres (ex. `"RS"`) |
| `brandName` | `string` | Nome no cabeçalho |
| `nav` | `{ href, label }[]` | Links de navegação por âncora |
| `repoUrl` | `string` | URL do repositório GitHub |
| `npmUrl?` | `string` | URL do pacote npm |
| `footerText` | `string` | Texto do rodapé (HTML permitido) |

### Hero

Hero com gradiente, badge de status, título, CTAs e cards de pré-visualização de código opcionais.

| Prop | Tipo | Descrição |
|------|------|-----------|
| `badge` | `string` | Texto do badge de status |
| `headline` | `string` | Título principal |
| `headlineAccent` | `string` | Sufixo atenuado |
| `description` | `string` | Descrição (HTML permitido) |
| `primaryCta` | `{ href, label }` | Botão principal |
| `secondaryCta` | `{ href, label }` | Botão secundário |
| `previews` | `{ label, code }[]` | Cards de pré-visualização de código |

### Section

Wrapper de seção com `id` de âncora, título e subtítulo opcional.

### FeatureGrid

Grade responsiva de cards em 3 colunas. Props: `features: { title, desc }[]`

### DataTable

Tabela com borda baseada em grade. Props: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

Grade de 2 colunas de cards com blocos de código escuros. Props: `cards: { title, code }[]`

### ApiList

Cards de referência de API empilhados em largura total. Props: `apis: { signature, description }[]`

---

## Tipos de seção

O array `sections` na sua configuração suporta estes valores de `kind`:

| Kind | Componente | Props |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

As seções são renderizadas na ordem em que aparecem no array.

---

## Implantação

A CLI `init` cria automaticamente `.github/workflows/pages.yml`. Para publicar:

1. Envie seu repositório para o GitHub
2. Acesse seu repositório → **Settings → Pages**
3. Em **Build and deployment**, defina **Source** como **GitHub Actions**
4. Envie qualquer alteração para `site/` para acionar o primeiro build

Seu site estará disponível em `https://<org>.github.io/<repo>/`.

---

## Licença

MIT
