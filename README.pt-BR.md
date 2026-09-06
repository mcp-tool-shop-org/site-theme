<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.md">English</a>
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

## Templates

Escolha um template, crie a estrutura, construa. Cada template é fornecido com testes de CI e pronto para o GitHub Pages.

| Template | Descrição | Páginas |
|----------|-------------|-------|
| **default** | Página de destino do projeto com destaque, recursos e exemplos de código | 1 |
| **docs** | Site de documentação com navegação na barra lateral e seções de conteúdo | 1 |
| **product** | Página de destino de marketing com preços, depoimentos e CTAs | 1 |
| **portfolio** | Grade de catálogo filtrável para ferramentas, projetos ou qualquer coleção | 1 |
| **app** | Painel SaaS multi-tenant com RBAC, flags de recursos e roteamento de espaço de trabalho | 31 |
| **tool** | Página de destino de CLI / MCP / pacote npm com comandos, fluxo de trabalho e prova | 1 |

```bash
npx @mcptoolshop/site-theme list-templates            # see all options
npx @mcptoolshop/site-theme list-templates --json      # machine-readable output
npx @mcptoolshop/site-theme init --template app        # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run   # preview files
npx @mcptoolshop/site-theme init --out ../other-repo   # scaffold into another directory
```

---

## Primeiros passos

### Crie um novo site

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

Isso cria um diretório `site/` com Astro 7 + Tailwind + tema configurado, além de um fluxo de trabalho do GitHub Pages. A importação de CSS, o caminho `@source` e o caminho base são todos pré-configurados — não é necessário nenhum ajuste manual. Os usuários existentes no Astro 5 ou 6 continuarão funcionando (`peerDependencies.astro` é `>=5`).

### Edite seu conteúdo

Todo o conteúdo da página está em `site/src/site-config.ts`. Edite o objeto de configuração para personalizar sua página de destino:

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

## Fachada

site-theme renderiza a **fachada** "humana" de um repositório; **front-door** verifica sua fachada **agente/máquina** — o README, `AGENTS.md` e `llms.txt` que humanos, agentes e ferramentas leem primeiro. É "verificar primeiro": não escreve prosa para você, mas prova que sua prosa é verdadeira e mínima.

```bash
npx @mcptoolshop/site-theme front-door verify                  # audit; exits 1 if the gate fails
npx @mcptoolshop/site-theme front-door verify --run-doctests   # also compile/run fenced JS examples
npx @mcptoolshop/site-theme front-door init                    # scaffold a minimal, verify-clean front door
npx @mcptoolshop/site-theme front-door standard                # print the front-door spine
npx @mcptoolshop/site-theme front-door eval                    # the verifier's self-eval receipt
npx @mcptoolshop/site-theme front-door mcp                     # start the MCP server (agents call verify)
```

Ele roteia cada afirmação documentada para a evidência que pode comprová-la — caminhos/scripts/links inválidos, duplicação AGENTS.md↔README, desconfiança do status-badge, exemplos de importações vs. `exports` real (e, com `--run-doctests`, que os exemplos realmente compilam e são executados), afirmações de procedência vs. atestado real e excesso (comprimento/legibilidade/orçamento de diretivas para `AGENTS.md`). As descobertas são classificadas por risco em quatro categorias: Verificado / Contraditório / Ausente / Não verificável.

Use-o programaticamente (shipcheck usa isso):

```js
import { verify } from '@mcptoolshop/site-theme/front-door';

const scorecard = verify({ root: process.cwd() });
if (!scorecard.gate.pass) process.exit(1);
```

Ou deixe um agente chamá-lo: `front-door mcp` inicia um servidor MCP sem dependências, expondo `front_door_verify` — o agente recebe o mesmo painel estruturado.

Consulte a [referência da Fachada](docs/front-door.md) para obter a lista completa de canais e o padrão.

---

## Tokens de design

O tema fornece tokens de design semânticos por meio de `styles/theme.css`. Os componentes referenciam esses tokens em vez de cores codificadas, para que você possa redesenhar todo o tema substituindo alguns valores.

### Tokens padrão

| Token | Padrão | Usado para |
|-------|---------|----------|
| `--color-surface` | `#09090b` | Fundo da página |
| `--color-surface-raised` | `#18181b` | Elementos elevados, blocos de código |
| `--color-surface-strong` | `#27272a` | Badges, fundos destacados |
| `--color-edge` | `#27272a` | Bordas primárias |
| `--color-edge-subtle` | `#18181b` | Bordas de cartão/tabela |
| `--color-heading` | `#fafafa` | Títulos, texto primário |
| `--color-body` | `#e4e4e7` | Texto do corpo/secundário |
| `--color-muted` | `#d4d4d8` | Texto atenuado |
| `--color-dim` | `#a1a1aa` | Rótulos, descrições |
| `--color-accent` | `#34d399` | Indicadores de status |
| `--color-action` | `#fafafa` | Fundo do botão primário |
| `--color-action-text` | `#09090b` | Texto do botão primário |
| `--color-action-hover` | `#e4e4e7` | Hover do botão primário |

### Personalização

Substitua qualquer token em `global.css` do seu site adicionando um bloco `@theme` após as importações:

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

Os tokens geram utilitários padrão do Tailwind v4 (`bg-surface`, `text-heading`, `border-edge`, etc.), para que você também possa usá-los em seus próprios componentes.

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

O tema fornece 17 componentes Astro em cinco categorias: layouts, seções de conteúdo, blocos de marketing, portfólio e documentação.

### BaseLayout

Layout de página completa com cabeçalho fixo (badge de logotipo, links de navegação, botões do GitHub/pacote) e rodapé. O slot nomeado `head` é o ponto de extensão para tags extras `<head>` (imagem OG, JSON-LD, preconnect).

| Propriedade | Tipo | Descrição |
|------|------|-------------|
| `title` | `string` | Page `<title>` |
| `description` | `string` | Meta descrição |
| `logoBadge` | `string` | Badge de 1 a 2 caracteres (por exemplo, `"RS"`) |
| `brandName` | `string` | Nome no cabeçalho |
| `nav` | `{ href, label }[]` | Links de navegação de âncora (opcional, o padrão é `[]`) |
| `repoUrl` | `string` | URL do repositório do GitHub |
| `packageUrl?` | `string` | Listagem primária do registro (npm, PyPI, crates.io, ...). O rótulo é derivado do host. |
| `packageLabel?` | `string` | Substituição opcional do rótulo de exibição para `packageUrl` |
| `npmUrl?` | `string` | Alias obsoleto para `packageUrl` |
| `footerText` | `string` | Texto do rodapé (HTML permitido) |

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

Hero com gradiente, badge de status, título, CTAs e cartões de visualização de código opcionais.

| Propriedade | Tipo | Descrição |
|------|------|-------------|
| `badge` | `string` | Texto do badge de status |
| `headline` | `string` | Título principal |
| `headlineAccent` | `string` | Sufixo atenuado |
| `description` | `string` | Descrição (HTML permitido) |
| `primaryCta` | `{ href, label }` | Botão primário |
| `secondaryCta` | `{ href, label }` | Botão secundário |
| `previews` | `{ label, code }[]` | Cartões de visualização de código (opcional) |

### Section

Wrapper de seção com âncora `id`, título e subtítulo opcional.

### FeatureGrid

Grade de cartões responsiva de 3 colunas. Props: `features: { title, desc }[]`

### DataTable

Tabela com bordas baseada em grade. Props: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

Grade de 2 colunas de cartões de blocos de código escuros. Props: `cards: { title, code }[]`

### ApiList

Cartões de referência de API empilhados em tela cheia. Props: `apis: { signature, description }[]`

### FilterBar

Barra de pesquisa e filtragem de tags do lado do cliente para grades de portfólio. Props: `tags: string[]`, `searchable?: boolean`, `searchPlaceholder?: string`

### PortfolioGrid

Grade de cartões configurável com badges de status, agrupamento de categorias e substituições de imagem/badge. Props: `items: PortfolioItem[]`, `columns?: 2 | 3 | 4`, `groupByCategory?: boolean`

### DocLayout

Layout de duas colunas com barra lateral recolhível e área de conteúdo principal. Usado pelo template **docs**. Props: `sidebar: SidebarGroup[]`, `currentPath: string`

### Sidebar

Lista de navegação agrupada com destaque de link ativo. Props: `groups: SidebarGroup[]`, `currentPath?: string`

### TableOfContents

Navegação por títulos na página. Props: `headings?: { text, id, depth }[]`

### ContentSection

Bloco de conteúdo vinculado a uma âncora que renderiza HTML via `set:html`. Props: `id: string`, `title: string`, `content: string`

### SocialProof

Barra de estatísticas com título e pares de valor/rótulo. Props: `headline?: string`, `stats?: { value, label }[]`

### PricingGrid

Cartões de preços responsivos com a opção "Popular" destacada. Props: `tiers?: PricingTier[]`

### TestimonialGrid

Cartões de citações em duas colunas com as iniciais do avatar como fallback. Props: `testimonials?: { quote, author, role, avatarUrl? }[]`

### CtaBanner

Banner de chamada para ação em gradiente de tela cheia. Props: `headline: string`, `description?: string`, `cta: { href, label }`

---

## Tipos de seção

O array `sections` na sua configuração suporta estes valores `kind`:

| Tipo | Componente | Props |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

As seções são renderizadas na ordem em que aparecem no array.

---

## Implementação

A CLI `init` cria `.github/workflows/pages.yml` automaticamente. Para colocar o site no ar:

1. Envie seu repositório para o GitHub
2. Vá para o seu repositório → **Configurações → Páginas**
3. Em **Construção e implementação**, defina **Origem** como **GitHub Actions**
4. Envie qualquer alteração para `site/` para acionar a primeira construção

Seu site estará no ar em `https://<org>.github.io/<repo>/`.

---

## Segurança e escopo de dados

| Aspecto | Detalhe |
|--------|--------|
| **Data touched** | Tema: componentes Astro, tokens CSS, configuração do site no momento da construção. Front-end: README / AGENTS.md / llms.txt / CLAUDE.md no disco. |
| **Data NOT touched** | Sem contas de usuário, sem estado do site em tempo de execução, sem análises, sem APIs de terceiros |
| **Permissions** | Leitura: código-fonte do projeto. Escrita: `init` grava `site/` no diretório de trabalho atual (ou `--out`). A verificação é somente leitura, a menos que `--run-doctests`. |
| **Network** | Desativado por padrão. MCP é stdio. `--run-doctests` é a execução opcional de um processo filho; não instala pacotes nem abre uma rede. |
| **Telemetry** | Nenhum dado coletado ou enviado |

### Props HTML (set:html)

Vários props de componentes renderizam HTML bruto por meio da diretiva `set:html` do Astro. Se sua fonte de dados não for confiável (conteúdo gerado pelo usuário, APIs externas), **sanitize o HTML antes de passá-lo** usando uma biblioteca como [DOMPurify](https://github.com/cure53/DOMPurify) ou [sanitize-html](https://github.com/apostrophecms/sanitize-html).

| Componente | Props que usam set:html |
|-----------|---------------------|
| BaseLayout | `footerText` |
| Hero | `badge`, `description` |
| CodeCardGrid | `cards[].code` |
| ApiList | `apis[].signature`, `apis[].description` |
| ContentSection | `content` |

Consulte [SECURITY.md](SECURITY.md) para relatar vulnerabilidades.

## Scorecard

| Categoria | Pontuação |
|----------|-------|
| A. Segurança | 10 |
| B. Tratamento de erros | 10 |
| C. Documentação do operador | 10 |
| D. Boas práticas de envio | 10 |
| E. Identidade (suave) | 10 |
| **Overall** | **50/50** |

> Auditoria completa: [SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## Licença

MIT

---

Criado por [MCP Tool Shop](https://mcp-tool-shop.github.io/)
