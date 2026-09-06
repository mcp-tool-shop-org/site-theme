<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.md">English</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

## Modèles

Choisissez un modèle, créez une structure, construisez. Chaque modèle est livré avec des tests CI et est prêt pour GitHub Pages.

| Modèle | Description | Pages |
|----------|-------------|-------|
| **default** | Page d’accueil de projet avec une section d’introduction, des fonctionnalités et des exemples de code | 1 |
| **docs** | Site de documentation avec une navigation dans la barre latérale et des sections de contenu | 1 |
| **product** | Page d’accueil marketing avec des tarifs, des témoignages et des appels à l’action | 1 |
| **portfolio** | Grille de catalogue filtrable pour les outils, les projets ou toute collection | 1 |
| **app** | Tableau de bord SaaS multi-tenant avec RBAC, indicateurs de fonctionnalités et routage d’espace de travail | 31 |
| **tool** | Page d’accueil de CLI / MCP / package npm avec des commandes, un flux de travail et une preuve | 1 |

```bash
npx @mcptoolshop/site-theme list-templates            # see all options
npx @mcptoolshop/site-theme list-templates --json      # machine-readable output
npx @mcptoolshop/site-theme init --template app        # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run   # preview files
npx @mcptoolshop/site-theme init --out ../other-repo   # scaffold into another directory
```

---

## Démarrage rapide

### Créez un nouveau site

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

Cela crée un répertoire `site/` avec Astro 7 + Tailwind + thème configuré, ainsi qu’un flux de travail GitHub Pages. L’importation CSS, le chemin `@source` et le chemin de base sont tous préconfigurés, aucun paramétrage manuel n’est nécessaire. Les utilisateurs existants d’Astro 5 ou 6 peuvent continuer à utiliser le site (`peerDependencies.astro` est `>=5`).

### Modifiez votre contenu

Tout le contenu des pages se trouve dans `site/src/site-config.ts`. Modifiez l’objet de configuration pour personnaliser votre page d’accueil :

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

## Porte d’entrée

site-theme affiche la « porte d’entrée » **humaine** d’un dépôt ; **front-door** vérifie sa « porte d’entrée » **agent/machine** (le fichier README, `AGENTS.md` et `llms.txt`) que les humains, les agents et les outils lisent en premier. Il effectue une vérification en premier : il n’écrit pas de texte pour vous, il prouve que votre texte est vrai et minimal.

```bash
npx @mcptoolshop/site-theme front-door verify                  # audit; exits 1 if the gate fails
npx @mcptoolshop/site-theme front-door verify --run-doctests   # also compile/run fenced JS examples
npx @mcptoolshop/site-theme front-door init                    # scaffold a minimal, verify-clean front door
npx @mcptoolshop/site-theme front-door standard                # print the front-door spine
npx @mcptoolshop/site-theme front-door eval                    # the verifier's self-eval receipt
npx @mcptoolshop/site-theme front-door mcp                     # start the MCP server (agents call verify)
```

Il dirige chaque affirmation documentée vers les preuves qui peuvent la corroborer : chemins/scripts/liens inexistants, duplication AGENTS.md↔README, manque de confiance dans les badges d’état, exemples d’importations par rapport au `exports` réel (et, avec `--run-doctests`, que les exemples se compilent et s’exécutent réellement), affirmations de provenance par rapport à une attestation réelle et surcharge (longueur/lisibilité/budget de directives pour `AGENTS.md`). Les résultats sont classés par ordre de risque dans quatre catégories : vérifié/contredit/manquant/non vérifiable.

Utilisez-le de manière programmatique (shipcheck l’utilise) :

```js
import { verify } from '@mcptoolshop/site-theme/front-door';

const scorecard = verify({ root: process.cwd() });
if (!scorecard.gate.pass) process.exit(1);
```

Ou laissez un agent l’appeler : `front-door mcp` démarre un serveur MCP sans dépendances (stdio) qui expose `front_door_verify` ; l’agent reçoit le même tableau de bord structuré.

Consultez la [référence de la porte d’entrée](docs/front-door.md) pour obtenir la liste complète des canaux et la norme.

---

## Jetons de conception

Le thème fournit des jetons de conception sémantiques via `styles/theme.css`. Les composants font référence à ces jetons au lieu d’utiliser des couleurs codées en dur, de sorte que vous pouvez modifier l’apparence de l’ensemble du thème en remplaçant quelques valeurs.

### Jetons par défaut

| Jeton | Valeur par défaut | Utilisé pour |
|-------|---------|----------|
| `--color-surface` | `#09090b` | Arrière-plan de la page |
| `--color-surface-raised` | `#18181b` | Éléments surélevés, blocs de code |
| `--color-surface-strong` | `#27272a` | Badges, arrière-plans mis en évidence |
| `--color-edge` | `#27272a` | Bordures principales |
| `--color-edge-subtle` | `#18181b` | Bordures des cartes/tableaux |
| `--color-heading` | `#fafafa` | Titres, texte principal |
| `--color-body` | `#e4e4e7` | Texte du corps/texte secondaire |
| `--color-muted` | `#d4d4d8` | Texte atténué |
| `--color-dim` | `#a1a1aa` | Étiquettes, descriptions |
| `--color-accent` | `#34d399` | Indicateurs d’état |
| `--color-action` | `#fafafa` | Arrière-plan du bouton principal |
| `--color-action-text` | `#09090b` | Texte du bouton principal |
| `--color-action-hover` | `#e4e4e7` | Survol du bouton principal |

### Personnalisation

Remplacez n’importe quel jeton dans le fichier `global.css` de votre site en ajoutant un bloc `@theme` après les importations :

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

Les jetons génèrent des utilitaires standard Tailwind v4 (`bg-surface`, `text-heading`, `border-edge`, etc.), vous pouvez donc également les utiliser dans vos propres composants.

---

## Composants

Importez les composants individuellement à partir du package :

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

Le thème fournit 17 composants Astro répartis dans cinq catégories : modèles de mise en page, sections de contenu, blocs marketing, portfolio et documentation.

### BaseLayout

Modèle de page complète avec un en-tête fixe (badge de logo, liens de navigation, boutons GitHub/package) et un pied de page. L’emplacement nommé `head` est le point d’extension pour les balises `<head>` supplémentaires (image OG, JSON-LD, préconnexion).

| Propriété | Type | Description |
|------|------|-------------|
| `title` | `string` | Titre de la page `<title>` |
| `description` | `string` | Méta-description |
| `logoBadge` | `string` | Badge de 1 à 2 caractères (par exemple, `"RS"`) |
| `brandName` | `string` | Nom dans l’en-tête |
| `nav` | `{ href, label }[]` | Liens de navigation d’ancrage (facultatif, par défaut `[]`) |
| `repoUrl` | `string` | URL du dépôt GitHub |
| `packageUrl?` | `string` | Référentiel principal (npm, PyPI, crates.io, …). L’étiquette est dérivée de l’hôte. |
| `packageLabel?` | `string` | Remplacement facultatif de l’étiquette d’affichage pour `packageUrl` |
| `npmUrl?` | `string` | Alias obsolète pour `packageUrl` |
| `footerText` | `string` | Texte du pied de page (HTML autorisé) |

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

### Héros

Héros dégradé avec un badge d’état, un titre, des appels à l’action et des cartes de prévisualisation de code facultatives.

| Propriété | Type | Description |
|------|------|-------------|
| `badge` | `string` | Texte du badge d’état |
| `headline` | `string` | Titre principal |
| `headlineAccent` | `string` | Suffixe atténué |
| `description` | `string` | Description (HTML autorisé) |
| `primaryCta` | `{ href, label }` | Bouton principal |
| `secondaryCta` | `{ href, label }` | Bouton secondaire |
| `previews` | `{ label, code }[]` | Cartes de prévisualisation de code (facultatif) |

### Section

Enveloppe de section avec un ancrage `id`, un titre et un sous-titre facultatif.

### FeatureGrid

Grille de cartes réactive à 3 colonnes. Propriétés : `features: { title, desc }[]`

### DataTable

Tableau bordé basé sur une grille. Propriétés : `columns: string[]`, `rows: string[][]`

### CodeCardGrid

Grille de 2 colonnes de cartes de blocs de code sombres. Propriétés : `cards: { title, code }[]`

### ApiList

Cartes de référence d’API empilées sur toute la largeur. Propriétés : `apis: { signature, description }[]`

### FilterBar

Barre de recherche et de filtrage par balises côté client pour les grilles de portfolio. Propriétés : `tags: string[]`, `searchable?: boolean`, `searchPlaceholder?: string`

### PortfolioGrid

Grille de cartes configurable avec des badges d’état, un regroupement par catégorie et des substitutions d’image/badge. Propriétés : `items: PortfolioItem[]`, `columns?: 2 | 3 | 4`, `groupByCategory?: boolean`

### DocLayout

Mise en page à deux colonnes avec une barre latérale rétractable et une zone de contenu principale. Utilisé par le modèle **docs**. Propriétés : `sidebar: SidebarGroup[]`, `currentPath: string`

### Sidebar

Liste de navigation groupée avec mise en évidence des liens actifs. Propriétés : `groups: SidebarGroup[]`, `currentPath?: string`

### TableOfContents

Navigation dans la page via les titres. Propriétés : `headings?: { text, id, depth }[]`

### Section de contenu

Bloc de contenu lié à une ancre qui affiche du HTML via `set:html`. Propriétés : `id: string`, `title: string`, `content: string`

### Preuve sociale

Barre de statistiques avec un titre et des paires valeur/libellé. Propriétés : `headline?: string`, `stats?: { value, label }[]`

### Grille de prix

Cartes de niveaux de prix réactives avec la section « Populaire » mise en évidence. Propriétés : `tiers?: PricingTier[]`

### Grille de témoignages

Cartes de citations à deux colonnes avec des initiales par défaut pour les avatars. Propriétés : `testimonials?: { quote, author, role, avatarUrl? }[]`

### Bannière d’appel à l’action

Bannière d’appel à l’action en dégradé sur toute la largeur. Propriétés : `headline: string`, `description?: string`, `cta: { href, label }`

---

## Types de sections

Le tableau `sections` dans votre configuration prend en charge ces `kind` valeurs :

| Type | Composant | Propriétés |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

Les sections sont affichées dans l’ordre dans lequel elles apparaissent dans le tableau.

---

## Déploiement

L’interface de ligne de commande `init` crée `.github/workflows/pages.yml` automatiquement. Pour mettre en ligne :

1. Envoyez votre dépôt sur GitHub
2. Accédez à votre dépôt → **Paramètres → Pages**
3. Dans la section **Création et déploiement**, définissez **Source** sur **GitHub Actions**
4. Effectuez une modification quelconque dans `site/` pour déclencher la première création

Votre site sera accessible à l’adresse `https://<org>.github.io/<repo>/`.

---

## Sécurité et portée des données

| Aspect | Détail |
|--------|--------|
| **Data touched** | Thème : composants Astro, jetons CSS, configuration du site au moment de la création. Front-door : README / AGENTS.md / llms.txt / CLAUDE.md sur le disque. |
| **Data NOT touched** | Aucun compte utilisateur, aucun état de site en cours d’exécution, aucune analyse, aucune API tierce |
| **Permissions** | Lecture : source du projet. Écriture : `init` écrit `site/` dans le répertoire de travail (ou `--out`). La vérification est en lecture seule, sauf si `--run-doctests`. |
| **Network** | Désactivé par défaut. MCP utilise stdio. `--run-doctests` est l’exécution optionnelle d’un processus enfant ; il n’installe pas de packages et n’ouvre pas de réseau. |
| **Telemetry** | Aucune donnée collectée ou envoyée |

### Propriétés HTML (définir : html)

Plusieurs propriétés de composants affichent du HTML brut via la directive `set:html` d’Astro. Si votre source de données n’est pas fiable (contenu généré par l’utilisateur, API externes), **nettoyez le HTML avant de le transmettre** à l’aide d’une bibliothèque telle que [DOMPurify](https://github.com/cure53/DOMPurify) ou [sanitize-html](https://github.com/apostrophecms/sanitize-html).

| Composant | Propriétés utilisant définir : html |
|-----------|---------------------|
| BaseLayout | `footerText` |
| Héros | `badge`, `description` |
| CodeCardGrid | `cards[].code` |
| ApiList | `apis[].signature`, `apis[].description` |
| Section de contenu | `content` |

Consultez [SECURITY.md](SECURITY.md) pour signaler les vulnérabilités.

## Tableau de bord

| Catégorie | Score |
|----------|-------|
| A. Sécurité | 10 |
| B. Gestion des erreurs | 10 |
| C. Documentation pour les opérateurs | 10 |
| D. Bonnes pratiques de publication | 10 |
| E. Identité (souple) | 10 |
| **Overall** | **50/50** |

> Audit complet : [SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## Licence

MIT

---

Créé par [MCP Tool Shop](https://mcp-tool-shop.github.io/)
