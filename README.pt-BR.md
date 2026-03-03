<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.md">English</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/site-theme/main/assets/preview.png" alt="site-theme preview" width="800" />
</p>

<h1 align="center">@mcptoolshop/site-theme</h1>

<p align="center">
  Multi-template Astro toolkit for landing pages, docs, product sites, and SaaS dashboards.<br/>
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

## Modelos

Escolha um modelo, crie a estrutura básica e desenvolva. Cada modelo é testado com integração contínua e está pronto para ser publicado no GitHub Pages.

| Modelo | Descrição | Páginas |
|----------|-------------|-------|
| **default** | Página de apresentação do projeto com destaque, recursos e exemplos de código. | 1 |
| **docs** | Site de documentação com navegação lateral e seções de conteúdo. | 1 |
| **product** | Página de marketing com preços, depoimentos e chamadas para ação. | 1 |
| **app** | Painel de controle SaaS multi-tenant com controle de acesso baseado em função, flags de recursos e roteamento de workspaces. | 31 |

```bash
npx @mcptoolshop/site-theme list-templates        # see all options
npx @mcptoolshop/site-theme init --template app    # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run  # preview files
```

---

## Como começar

### Crie a estrutura básica de um novo site

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

Isso cria um diretório `site/` com Astro + Tailwind + tema configurados, além de um fluxo de trabalho para o GitHub Pages. As importações de CSS, o caminho `@source` e o caminho base estão todos pré-configurados — nenhuma configuração manual é necessária.

### Edite seu conteúdo

Todo o conteúdo da página está localizado em `site/src/site-config.ts`. Edite o objeto de configuração para personalizar sua página de apresentação:

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

## Tokens de Design

O tema fornece tokens de design semânticos através do arquivo `styles/theme.css`. Os componentes referenciam esses tokens em vez de cores codificadas, permitindo que você personalize completamente o tema alterando apenas alguns valores.

### Tokens padrão

| Token | Padrão | Usado para |
|-------|---------|----------|
| `--color-surface` | `#09090b` | Fundo da página |
| `--color-surface-raised` | `#18181b` | Elementos em destaque, blocos de código |
| `--color-surface-strong` | `#27272a` | Selos, fundos destacados |
| `--color-edge` | `#27272a` | Bordas primárias |
| `--color-edge-subtle` | `#18181b` | Bordas de cartões/tabelas |
| `--color-heading` | `#fafafa` | Títulos, texto principal |
| `--color-body` | `#e4e4e7` | Texto do corpo/secundário |
| `--color-muted` | `#d4d4d8` | Texto discreto |
| `--color-dim` | `#a1a1aa` | Rótulos, descrições |
| `--color-accent` | `#34d399` | Indicadores de status |
| `--color-action` | `#fafafa` | Cor de fundo do botão primário |
| `--color-action-text` | `#09090b` | Cor do texto do botão primário |
| `--color-action-hover` | `#e4e4e7` | Cor do botão primário ao passar o mouse |

### Personalização

Substitua qualquer token no arquivo `global.css` do seu site adicionando um bloco `@theme` após as importações:

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

Os tokens geram utilitários padrão do Tailwind v4 (`bg-surface`, `text-heading`, `border-edge`, etc.), então você também pode usá-los em seus próprios componentes.

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

Estrutura de página completa com cabeçalho fixo (selo de logotipo, links de navegação, botões do GitHub/npm) e rodapé.

| Propriedade | Tipo | Descrição |
|------|------|-------------|
| `title` | `string` | Título da página `<title>` |
| `description` | `string` | Descrição meta |
| `logoBadge` | `string` | Selo de 1 a 2 caracteres (por exemplo, "RS") |
| `brandName` | `string` | Nome no cabeçalho |
| `nav` | `{ href, label }[]` | Links de navegação |
| `repoUrl` | `string` | URL do repositório do GitHub |
| `npmUrl?` | `string` | URL do pacote npm |
| `footerText` | `string` | Texto do rodapé (HTML permitido) |

### Hero

Destaque com gradiente, selo de status, título, chamadas para ação e cartões de visualização de código opcionais.

| Propriedade | Tipo | Descrição |
|------|------|-------------|
| `badge` | `string` | Texto do selo de status |
| `headline` | `string` | Título principal |
| `headlineAccent` | `string` | Sufixo discreto |
| `description` | `string` | Descrição (HTML permitido) |
| `primaryCta` | `{ href, label }` | Botão primário |
| `secondaryCta` | `{ href, label }` | Botão secundário |
| `previews` | `{ label, code }[]` | Cartões de visualização de código |

### Seção

Contêiner de seção com ID de âncora, título e subtítulo opcional.

### FeatureGrid

Grade responsiva de cartões com 3 colunas. Propriedades: `features: { title, desc }[]`

### DataTable

Tabela com bordas baseada em grade. Propriedades: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

Grade de 2 colunas de cartões de código escuros. Propriedades: `cards: { title, code }[]`

### ApiList

Cartões de referência de API empilhados em largura total. Propriedades: `apis: { signature, description }[]`

---

## Tipos de Seção

O array `sections` na sua configuração suporta os seguintes valores para `kind`:

| Tipo | Componente | Propriedades |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

As seções são renderizadas na ordem em que aparecem no array.

---

## Implementação

A interface de linha de comando (CLI) `init` cria automaticamente o arquivo `.github/workflows/pages.yml`. Para colocar o site no ar:

1. Envie seu repositório para o GitHub.
2. Vá para o seu repositório → **Configurações → Páginas**.
3. Em **Construção e implantação**, defina **Origem** como **GitHub Actions**.
4. Envie qualquer alteração para a pasta `site/` para iniciar a primeira construção.

Seu site estará disponível em `https://<org>.github.io/<repo>/`.

---

## Segurança e Escopo de Dados

| Aspecto | Detalhe |
|--------|--------|
| **Data touched** | Arquivos de componentes Astro, tokens CSS, configuração do site — apenas durante a construção. |
| **Data NOT touched** | Nenhum dado do usuário, nenhum estado em tempo de execução, nenhum processamento no lado do servidor. |
| **Permissions** | Leitura: arquivos de origem do projeto. Escrita: saída da construção para `site/dist/`. |
| **Network** | Nenhum — gerador de sites estáticos sem acesso à rede em tempo de execução. |
| **Telemetry** | Nenhum dado coletado ou enviado. |

Consulte o arquivo [SECURITY.md](SECURITY.md) para relatar vulnerabilidades.

## Avaliação

| Categoria | Pontuação |
|----------|-------|
| A. Segurança | 10 |
| B. Tratamento de Erros | 10 |
| C. Documentação para Operadores | 10 |
| D. Higiene na Distribuição | 10 |
| E. Identidade (suave) | 10 |
| **Overall** | **50/50** |

> Auditoria completa: [SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## Licença

MIT

---

Criado por [MCP Tool Shop](https://mcp-tool-shop.github.io/)
