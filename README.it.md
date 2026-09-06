<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.md">English</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

## Modelli

Scegli un modello, crea una struttura di base, sviluppa. Ogni modello viene fornito con test CI e pronto per GitHub Pages.

| Modello | Descrizione | Pagine |
|----------|-------------|-------|
| **default** | Pagina di destinazione del progetto con elementi di presentazione, funzionalità ed esempi di codice | 1 |
| **docs** | Sito di documentazione con navigazione a barra laterale e sezioni di contenuto | 1 |
| **product** | Pagina di destinazione di marketing con prezzi, testimonianze e inviti all'azione | 1 |
| **portfolio** | Griglia di cataloghi filtrabile per strumenti, progetti o qualsiasi raccolta | 1 |
| **app** | Dashboard SaaS multi-tenant con RBAC, flag di funzionalità e routing dello spazio di lavoro | 31 |
| **tool** | Pagina di destinazione di CLI / MCP / pacchetto npm con comandi, flusso di lavoro e prova | 1 |

```bash
npx @mcptoolshop/site-theme list-templates            # see all options
npx @mcptoolshop/site-theme list-templates --json      # machine-readable output
npx @mcptoolshop/site-theme init --template app        # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run   # preview files
npx @mcptoolshop/site-theme init --out ../other-repo   # scaffold into another directory
```

---

## Avvio rapido

### Crea un nuovo sito

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

Questo crea una directory `site/` con Astro 7 + Tailwind + tema configurato, oltre a un flusso di lavoro di GitHub Pages. L'importazione CSS, il percorso `@source` e il percorso di base sono tutti preconfigurati: non è necessaria alcuna configurazione manuale. Gli utenti esistenti che utilizzano Astro 5 o 6 possono continuare a utilizzare il sito senza problemi (`peerDependencies.astro` è `>=5`).

### Modifica il tuo contenuto

Tutto il contenuto delle pagine si trova in `site/src/site-config.ts`. Modifica l'oggetto di configurazione per personalizzare la tua pagina di destinazione:

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

## Porta d'accesso principale

site-theme crea la "porta d'accesso" **umana** di un repository; **front-door** verifica la sua "porta d'accesso" per **agenti/macchine** (il file README, `AGENTS.md` e `llms.txt`) che umani, agenti e strumenti leggono per primi. Si basa sulla verifica preventiva: non scrive il testo per te, ma dimostra che il tuo testo è corretto e conciso.

```bash
npx @mcptoolshop/site-theme front-door verify                  # audit; exits 1 if the gate fails
npx @mcptoolshop/site-theme front-door verify --run-doctests   # also compile/run fenced JS examples
npx @mcptoolshop/site-theme front-door init                    # scaffold a minimal, verify-clean front door
npx @mcptoolshop/site-theme front-door standard                # print the front-door spine
npx @mcptoolshop/site-theme front-door eval                    # the verifier's self-eval receipt
npx @mcptoolshop/site-theme front-door mcp                     # start the MCP server (agents call verify)
```

Instrada ogni affermazione documentata all'evidenza che può supportarla: percorsi/script/link non validi, duplicazione AGENTS.md↔README, mancanza di fiducia nei badge di stato, esempi di importazioni rispetto al reale `exports` (e, con `--run-doctests`, che gli esempi vengono effettivamente compilati ed eseguiti), affermazioni di provenienza rispetto alla reale attestazione e ridondanza (lunghezza/leggibilità/budget di direttive per `AGENTS.md`). I risultati vengono ordinati in base al rischio in quattro categorie: Verificato / Contraddetto / Mancante / Non verificabile.

Utilizzalo in modo programmatico (shipcheck lo utilizza):

```js
import { verify } from '@mcptoolshop/site-theme/front-door';

const scorecard = verify({ root: process.cwd() });
if (!scorecard.gate.pass) process.exit(1);
```

Oppure lascia che un agente lo chiami: `front-door mcp` avvia un server MCP senza dipendenze che espone `front_door_verify`: l'agente riceve lo stesso punteggio strutturato.

Consulta il [riferimento per la porta d'accesso principale](docs/front-door.md) per l'elenco completo dei canali e lo standard.

---

## Token di progettazione

Il tema fornisce token di progettazione semantici tramite `styles/theme.css`. I componenti fanno riferimento a questi token invece di utilizzare colori codificati, in modo da poter modificare l'aspetto dell'intero tema sovrascrivendo alcuni valori.

### Token predefiniti

| Token | Predefinito | Utilizzato per |
|-------|---------|----------|
| `--color-surface` | `#09090b` | Sfondo della pagina |
| `--color-surface-raised` | `#18181b` | Elementi in rilievo, blocchi di codice |
| `--color-surface-strong` | `#27272a` | Badge, sfondi evidenziati |
| `--color-edge` | `#27272a` | Bordi primari |
| `--color-edge-subtle` | `#18181b` | Bordi di schede/tabelle |
| `--color-heading` | `#fafafa` | Intestazioni, testo principale |
| `--color-body` | `#e4e4e7` | Testo del corpo/secondario |
| `--color-muted` | `#d4d4d8` | Testo attenuato |
| `--color-dim` | `#a1a1aa` | Etichette, descrizioni |
| `--color-accent` | `#34d399` | Indicatori di stato |
| `--color-action` | `#fafafa` | Sfondo del pulsante primario |
| `--color-action-text` | `#09090b` | Testo del pulsante primario |
| `--color-action-hover` | `#e4e4e7` | Pulsante primario al passaggio del mouse |

### Personalizzazione

Sovrascrivi qualsiasi token nel file `global.css` del tuo sito aggiungendo un blocco `@theme` dopo le importazioni:

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

I token generano le utility standard Tailwind v4 (`bg-surface`, `text-heading`, `border-edge`, ecc.), quindi puoi utilizzarli anche nei tuoi componenti.

---

## Componenti

Importa i componenti singolarmente dal pacchetto:

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

Il tema fornisce 17 componenti Astro suddivisi in cinque categorie: layout, sezioni di contenuto, blocchi di marketing, portfolio e documentazione.

### BaseLayout

Layout di pagina completo con intestazione fissa (badge del logo, collegamenti di navigazione, pulsanti GitHub/pacchetto) e piè di pagina. Lo slot denominato `head` è il punto di estensione per tag aggiuntivi `<head>` (immagine OG, JSON-LD, preconnect).

| Prop | Tipo | Descrizione |
|------|------|-------------|
| `title` | `string` | Titolo della pagina `<title>` |
| `description` | `string` | Meta descrizione |
| `logoBadge` | `string` | Badge di 1-2 caratteri (ad esempio, `"RS"`) |
| `brandName` | `string` | Nome nell'intestazione |
| `nav` | `{ href, label }[]` | Collegamenti di ancoraggio per la navigazione (facoltativo, per impostazione predefinita `[]`) |
| `repoUrl` | `string` | URL del repository GitHub |
| `packageUrl?` | `string` | Elenco primario del registro (npm, PyPI, crates.io, ecc.). L'etichetta viene derivata dall'host. |
| `packageLabel?` | `string` | Etichetta di visualizzazione facoltativa per sovrascrivere `packageUrl` |
| `npmUrl?` | `string` | Alias deprecato per `packageUrl` |
| `footerText` | `string` | Testo del piè di pagina (è consentito l'HTML) |

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

Hero sfumato con badge di stato, titolo, inviti all'azione e schede di anteprima del codice facoltative.

| Prop | Tipo | Descrizione |
|------|------|-------------|
| `badge` | `string` | Testo del badge di stato |
| `headline` | `string` | Titolo principale |
| `headlineAccent` | `string` | Suffisso attenuato |
| `description` | `string` | Descrizione (è consentito l'HTML) |
| `primaryCta` | `{ href, label }` | Pulsante primario |
| `secondaryCta` | `{ href, label }` | Pulsante secondario |
| `previews` | `{ label, code }[]` | Schede di anteprima del codice (facoltative) |

### Section

Wrapper di sezione con ancoraggio `id`, titolo e sottotitolo facoltativo.

### FeatureGrid

Griglia di schede reattiva a 3 colonne. Proprietà: `features: { title, desc }[]`

### DataTable

Tabella con bordi basata su griglia. Proprietà: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

Griglia di 2 colonne di schede di blocchi di codice scuri. Proprietà: `cards: { title, code }[]`

### ApiList

Schede di riferimento API impilate a larghezza intera. Proprietà: `apis: { signature, description }[]`

### FilterBar

Barra di ricerca e filtro per tag lato client per le griglie del portfolio. Proprietà: `tags: string[]`, `searchable?: boolean`, `searchPlaceholder?: string`

### PortfolioGrid

Griglia di schede configurabile con badge di stato, raggruppamento per categoria e fallback di immagini/badge. Proprietà: `items: PortfolioItem[]`, `columns?: 2 | 3 | 4`, `groupByCategory?: boolean`

### DocLayout

Layout a due colonne con barra laterale a scomparsa e area di contenuto principale. Utilizzato dal modello **docs**. Proprietà: `sidebar: SidebarGroup[]`, `currentPath: string`

### Sidebar

Elenco di navigazione raggruppato con evidenziazione del collegamento attivo. Proprietà: `groups: SidebarGroup[]`, `currentPath?: string`

### TableOfContents

Navigazione tramite intestazioni all'interno della pagina. Proprietà: `headings?: { text, id, depth }[]`

### ContentSection

Blocco di contenuto collegato tramite ancoraggio che esegue il rendering di HTML tramite `set:html`. Proprietà: `id: string`, `title: string`, `content: string`

### SocialProof

Barra delle statistiche con intestazione e coppie valore/etichetta. Proprietà: `headline?: string`, `stats?: { value, label }[]`

### PricingGrid

Schede dei prezzi responsive con evidenziazione del livello "Popolare". Proprietà: `tiers?: PricingTier[]`

### TestimonialGrid

Schede di citazioni a due colonne con iniziali di fallback per l'avatar. Proprietà: `testimonials?: { quote, author, role, avatarUrl? }[]`

### CtaBanner

Banner di invito all'azione a gradiente a schermo intero. Proprietà: `headline: string`, `description?: string`, `cta: { href, label }`

---

## Tipi di sezione

L'array `sections` nella configurazione supporta questi `kind` valori:

| Tipo | Componente | Proprietà |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

Le sezioni vengono eseguite nell'ordine in cui compaiono nell'array.

---

## Distribuzione

La CLI `init` crea `.github/workflows/pages.yml` automaticamente. Per rendere il sito attivo:

1. Carica il tuo repository su GitHub
2. Vai al tuo repository → **Impostazioni → Pagine**
3. In **Creazione e distribuzione**, imposta **Origine** su **GitHub Actions**
4. Applica qualsiasi modifica a `site/` per attivare la prima compilazione

Il tuo sito sarà attivo all'indirizzo `https://<org>.github.io/<repo>/`.

---

## Sicurezza e ambito dei dati

| Aspetto | Dettaglio |
|--------|--------|
| **Data touched** | Tema: componenti Astro, token CSS, configurazione del sito al momento della compilazione. Front-end: README / AGENTS.md / llms.txt / CLAUDE.md su disco. |
| **Data NOT touched** | Nessun account utente, nessun stato del sito in fase di esecuzione, nessuna analisi, nessuna API di terze parti |
| **Permissions** | Lettura: codice sorgente del progetto. Scrittura: `init` scrive `site/` nella directory di lavoro corrente (o `--out`). La verifica è in sola lettura a meno che `--run-doctests`. |
| **Network** | Disattivato per impostazione predefinita. MCP è stdio. `--run-doctests` è l'esecuzione di un processo figlio opzionale; non installa pacchetti né apre una rete. |
| **Telemetry** | Nessun dato raccolto o inviato |

### Proprietà HTML (imposta: html)

Diverse proprietà dei componenti eseguono il rendering di HTML non elaborato tramite la direttiva `set:html` di Astro. Se la tua fonte di dati non è affidabile (contenuti generati dagli utenti, API esterne), **sanifica l'HTML prima di passarlo** utilizzando una libreria come [DOMPurify](https://github.com/cure53/DOMPurify) o [sanitize-html](https://github.com/apostrophecms/sanitize-html).

| Componente | Proprietà che utilizzano set:html |
|-----------|---------------------|
| BaseLayout | `footerText` |
| Hero | `badge`, `description` |
| CodeCardGrid | `cards[].code` |
| ApiList | `apis[].signature`, `apis[].description` |
| ContentSection | `content` |

Consulta [SECURITY.md](SECURITY.md) per la segnalazione di vulnerabilità.

## Valutazione

| Categoria | Punteggio |
|----------|-------|
| A. Sicurezza | 10 |
| B. Gestione degli errori | 10 |
| C. Documentazione per gli operatori | 10 |
| D. Pratiche di rilascio | 10 |
| E. Identità (soft) | 10 |
| **Overall** | **50/50** |

> Audit completo: [SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## Licenza

MIT

---

Creato da [MCP Tool Shop](https://mcp-tool-shop.github.io/)
