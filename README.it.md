<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.md">English</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

## Modelli

Scegli un modello, crea la struttura, sviluppa. Ogni modello è testato con CI ed è pronto per GitHub Pages.

| Modello | Descrizione | Pagine |
|----------|-------------|-------|
| **default** | Pagina di presentazione del progetto con sezione introduttiva, caratteristiche ed esempi di codice. | 1 |
| **docs** | Sito di documentazione con navigazione laterale e sezioni di contenuto. | 1 |
| **product** | Pagina di presentazione per il marketing con prezzi, testimonianze e call to action. | 1 |
| **app** | Dashboard SaaS multi-tenant con controllo degli accessi basato sui ruoli, feature flags e routing degli spazi di lavoro. | 31 |

```bash
npx @mcptoolshop/site-theme list-templates        # see all options
npx @mcptoolshop/site-theme init --template app    # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run  # preview files
```

---

## Inizio rapido

### Crea un nuovo sito

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

Questo crea una directory `site/` con Astro + Tailwind + tema configurati, oltre a un workflow per GitHub Pages. Gli import CSS, il percorso `@source` e il percorso di base sono tutti preconfigurati: non è necessaria alcuna configurazione manuale.

### Modifica il contenuto

Tutto il contenuto delle pagine si trova in `site/src/site-config.ts`. Modifica l'oggetto di configurazione per personalizzare la tua pagina di presentazione:

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

## Token di stile

Il tema fornisce token di stile semantici tramite `styles/theme.css`. I componenti fanno riferimento a questi token invece di colori hardcoded, quindi puoi personalizzare completamente il tema sovrascrivendo alcuni valori.

### Token predefiniti

| Token | Predefinito | Utilizzato per |
|-------|---------|----------|
| `--color-surface` | `#09090b` | Sfondo della pagina |
| `--color-surface-raised` | `#18181b` | Elementi in evidenza, blocchi di codice |
| `--color-surface-strong` | `#27272a` | Badge, sfondi evidenziati |
| `--color-edge` | `#27272a` | Bordi primari |
| `--color-edge-subtle` | `#18181b` | Bordi di schede/tabelle |
| `--color-heading` | `#fafafa` | Titoli, testo primario |
| `--color-body` | `#e4e4e7` | Testo principale/secondario |
| `--color-muted` | `#d4d4d8` | Testo attenuato |
| `--color-dim` | `#a1a1aa` | Etichette, descrizioni |
| `--color-accent` | `#34d399` | Indicatori di stato |
| `--color-action` | `#fafafa` | Sfondo del pulsante primario |
| `--color-action-text` | `#09090b` | Testo del pulsante primario |
| `--color-action-hover` | `#e4e4e7` | Hover del pulsante primario |

### Personalizzazione

Sovrascrivi qualsiasi token nel file `global.css` del tuo sito aggiungendo un blocco `@theme` dopo gli import:

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

I token generano utility standard di Tailwind v4 (`bg-surface`, `text-heading`, `border-edge`, ecc.), quindi puoi anche utilizzarli nei tuoi componenti.

---

## Componenti

Importa i componenti individualmente dal pacchetto:

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

Struttura di pagina completa con intestazione fissa (badge del logo, link di navigazione, pulsanti GitHub/npm) e piè di pagina.

| Proprietà | Tipo | Descrizione |
|------|------|-------------|
| `title` | `string` | Titolo della pagina `<title>` |
| `description` | `string` | Meta descrizione |
| `logoBadge` | `string` | Badge di 1-2 caratteri (es. "RS") |
| `brandName` | `string` | Nome nell'intestazione |
| `nav` | `{ href, label }[]` | Link di navigazione |
| `repoUrl` | `string` | URL del repository GitHub |
| `npmUrl?` | `string` | URL del pacchetto npm |
| `footerText` | `string` | Testo del piè di pagina (consentito HTML) |

### Hero

Sezione introduttiva con gradiente, badge di stato, titolo, call to action e, opzionalmente, schede di anteprima del codice.

| Proprietà | Tipo | Descrizione |
|------|------|-------------|
| `badge` | `string` | Testo del badge di stato |
| `headline` | `string` | Titolo principale |
| `headlineAccent` | `string` | Suffisso attenuato |
| `description` | `string` | Descrizione (consentito HTML) |
| `primaryCta` | `{ href, label }` | Pulsante primario |
| `secondaryCta` | `{ href, label }` | Pulsante secondario |
| `previews` | `{ label, code }[]` | Schede di anteprima del codice |

### Sezione

Contenitore di sezione con ID di ancoraggio, titolo e sottotitolo opzionale.

### FeatureGrid

Griglia di schede responsive a 3 colonne. Proprietà: `features: { title, desc }[]`

### DataTable

Tabella bordata basata su griglia. Proprietà: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

Griglia a 2 colonne di schede di codice scure. Proprietà: `cards: { title, code }[]`

### ApiList

Schede di riferimento API a larghezza intera e impilate. Proprietà: `apis: { signature, description }[]`

---

## Tipi di sezione

L'array `sections` nella tua configurazione supporta questi valori di `kind`:

| Tipo | Componente | Proprietà |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

Le sezioni vengono visualizzate nell'ordine in cui appaiono nell'array.

---

## Distribuzione

L'interfaccia a riga di comando `init` crea automaticamente il file `.github/workflows/pages.yml`. Per rendere il sito pubblico:

1. Caricare il repository su GitHub.
2. Andare al repository → **Impostazioni → Pagine**.
3. Nella sezione **Build e distribuzione**, impostare **Origine** su **GitHub Actions**.
4. Effettuare una modifica a `site/` per avviare la prima compilazione.

Il sito sarà disponibile all'indirizzo `https://<org>.github.io/<repo>/`.

---

## Sicurezza e ambito dei dati

| Aspetto | Dettaglio |
|--------|--------|
| **Data touched** | File dei componenti Astro, token CSS, configurazione del sito: solo durante la compilazione. |
| **Data NOT touched** | Nessun dato utente, nessun stato di runtime, nessuna elaborazione lato server. |
| **Permissions** | Lettura: file sorgente del progetto. Scrittura: output della compilazione nella cartella `site/dist/`. |
| **Network** | Nessuno: generatore di siti statici senza accesso alla rete in runtime. |
| **Telemetry** | Nessun dato raccolto o trasmesso. |

Consultare il file [SECURITY.md](SECURITY.md) per segnalare eventuali vulnerabilità.

## Valutazione

| Categoria | Punteggio |
|----------|-------|
| A. Sicurezza | 10 |
| B. Gestione degli errori | 10 |
| C. Documentazione per gli operatori | 10 |
| D. Igiene nella distribuzione | 10 |
| E. Identità (soft) | 10 |
| **Overall** | **50/50** |

> Analisi completa: [SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## Licenza

MIT

---

Creato da [MCP Tool Shop](https://mcp-tool-shop.github.io/)
