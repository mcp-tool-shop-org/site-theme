<p align="center">
  <a href="README.md">English</a> | <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <strong>Italiano</strong> | <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/site-theme/main/assets/preview.png" alt="anteprima di site-theme" width="800" />
</p>

<h1 align="center">@mcptoolshop/site-theme</h1>

<p align="center">
  Tema Astro basato su configurazione per le landing page dei progetti MCP Tool Shop.<br/>
  Palette scura · Tailwind CSS v4 · Pronto per GitHub Pages.
</p>

<p align="center">
  <a href="#avvio-rapido">Avvio rapido</a> &middot;
  <a href="#token-di-design">Token di design</a> &middot;
  <a href="#componenti">Componenti</a> &middot;
  <a href="#distribuzione">Distribuzione</a> &middot;
  <a href="#licenza">Licenza</a>
</p>

---

## Avvio rapido

### Creare un nuovo sito

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

Questo crea una directory `site/` con Astro + Tailwind + tema già configurati, più un workflow per GitHub Pages. L'import CSS, il percorso `@source` e il percorso base sono preconfigurati — nessuna configurazione manuale necessaria.

### Modificare i contenuti

Tutti i contenuti della pagina si trovano in `site/src/site-config.ts`. Modifica l'oggetto di configurazione per personalizzare la tua landing page:

```typescript
import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '@mcptoolshop/my-tool',
  description: 'Cosa fa il mio strumento.',
  logoBadge: 'MT',
  brandName: 'my-tool',
  repoUrl: 'https://github.com/mcp-tool-shop-org/my-tool',
  npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/my-tool',
  footerText: 'Licenza MIT',

  hero: { /* ... */ },
  sections: [ /* ... */ ],
};
```

---

## Token di design

Il tema fornisce token di design semantici tramite `styles/theme.css`. I componenti fanno riferimento a questi token invece di colori fissi, quindi puoi ridisegnare l'intero tema sovrascrivendo pochi valori.

### Token predefiniti

| Token | Valore predefinito | Utilizzato per |
|-------|-------------------|----------------|
| `--color-surface` | `#09090b` | Sfondo della pagina |
| `--color-surface-raised` | `#18181b` | Elementi elevati, blocchi di codice |
| `--color-surface-strong` | `#27272a` | Badge, sfondi enfatizzati |
| `--color-edge` | `#27272a` | Bordi principali |
| `--color-edge-subtle` | `#18181b` | Bordi di card/tabelle |
| `--color-heading` | `#fafafa` | Intestazioni, testo principale |
| `--color-body` | `#e4e4e7` | Corpo / testo secondario |
| `--color-muted` | `#d4d4d8` | Testo attenuato |
| `--color-dim` | `#a1a1aa` | Etichette, descrizioni |
| `--color-accent` | `#34d399` | Indicatori di stato |
| `--color-action` | `#fafafa` | Sfondo del pulsante principale |
| `--color-action-text` | `#09090b` | Testo del pulsante principale |
| `--color-action-hover` | `#e4e4e7` | Hover del pulsante principale |

### Personalizzazione

Sovrascrivi qualsiasi token nel `global.css` del tuo sito aggiungendo un blocco `@theme` dopo gli import:

```css
@import "tailwindcss";
@import "@mcptoolshop/site-theme/styles/theme.css";
@source "../../node_modules/@mcptoolshop/site-theme";

/* Sovrascrittura dei token */
@theme {
  --color-accent: #60a5fa;          /* punto di stato blu   */
  --color-surface: #0a0a1a;         /* sfondo blu navy      */
  --color-action: #60a5fa;          /* pulsanti blu         */
  --color-action-hover: #3b82f6;
}
```

I token generano utility standard Tailwind v4 (`bg-surface`, `text-heading`, `border-edge`, ecc.) utilizzabili anche nei propri componenti.

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

Struttura di pagina completa con intestazione fissa (badge logo, link di navigazione, pulsanti GitHub/npm) e piè di pagina.

| Prop | Tipo | Descrizione |
|------|------|-------------|
| `title` | `string` | `<title>` della pagina |
| `description` | `string` | Meta descrizione |
| `logoBadge` | `string` | Badge di 1–2 caratteri (es. `"RS"`) |
| `brandName` | `string` | Nome nell'intestazione |
| `nav` | `{ href, label }[]` | Link di navigazione ad ancora |
| `repoUrl` | `string` | URL del repository GitHub |
| `npmUrl?` | `string` | URL del pacchetto npm |
| `footerText` | `string` | Testo del piè di pagina (HTML consentito) |

### Hero

Hero con gradiente, badge di stato, titolo, CTA e card di anteprima codice opzionali.

| Prop | Tipo | Descrizione |
|------|------|-------------|
| `badge` | `string` | Testo del badge di stato |
| `headline` | `string` | Titolo principale |
| `headlineAccent` | `string` | Suffisso attenuato |
| `description` | `string` | Descrizione (HTML consentito) |
| `primaryCta` | `{ href, label }` | Pulsante principale |
| `secondaryCta` | `{ href, label }` | Pulsante secondario |
| `previews` | `{ label, code }[]` | Card di anteprima codice |

### Section

Wrapper di sezione con `id` di ancora, titolo e sottotitolo opzionale.

### FeatureGrid

Griglia responsiva di card a 3 colonne. Props: `features: { title, desc }[]`

### DataTable

Tabella con bordo basata su griglia. Props: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

Griglia a 2 colonne di card con blocchi di codice scuri. Props: `cards: { title, code }[]`

### ApiList

Card di riferimento API impilate a larghezza piena. Props: `apis: { signature, description }[]`

---

## Tipi di sezione

L'array `sections` nella tua configurazione supporta questi valori di `kind`:

| Kind | Componente | Props |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

Le sezioni vengono renderizzate nell'ordine in cui appaiono nell'array.

---

## Distribuzione

La CLI `init` crea automaticamente `.github/workflows/pages.yml`. Per andare live:

1. Carica il tuo repository su GitHub
2. Vai al repository → **Settings → Pages**
3. Sotto **Build and deployment**, imposta **Source** su **GitHub Actions**
4. Effettua un push con qualsiasi modifica a `site/` per avviare la prima build

Il tuo sito sarà disponibile su `https://<org>.github.io/<repo>/`.

---

## Licenza

MIT
