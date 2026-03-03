<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.md">English</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

## Templates

Choisissez un modèle, créez une structure de base, développez. Chaque modèle est testé avec CI et prêt pour GitHub Pages.

| Modèle | Description | Pages |
|----------|-------------|-------|
| **default** | Page d'accueil de projet avec une section d'introduction, des fonctionnalités et des exemples de code. | 1 |
| **docs** | Site de documentation avec une barre de navigation latérale et des sections de contenu. | 1 |
| **product** | Page d'atterrissage marketing avec des informations sur les prix, des témoignages et des appels à l'action. | 1 |
| **app** | Tableau de bord SaaS multi-tenant avec contrôle d'accès basé sur les rôles, fonctionnalités et routage des espaces de travail. | 31 |

```bash
npx @mcptoolshop/site-theme list-templates        # see all options
npx @mcptoolshop/site-theme init --template app    # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run  # preview files
```

---

## Démarrage rapide

### Créez un nouveau site

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

Cela crée un répertoire `site/` avec Astro + Tailwind + un thème préconfiguré, ainsi qu'un flux de travail pour GitHub Pages. Les importations CSS, le chemin `@source` et le chemin de base sont tous préconfigurés : aucun paramétrage manuel n'est nécessaire.

### Modifiez votre contenu

Tout le contenu des pages se trouve dans `site/src/site-config.ts`. Modifiez l'objet de configuration pour personnaliser votre page d'accueil :

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

## Jetons de conception

Le thème fournit des jetons de conception sémantiques via `styles/theme.css`. Les composants référencent ces jetons au lieu de couleurs codées en dur, ce qui vous permet de modifier l'apparence de l'ensemble du thème en remplaçant quelques valeurs.

### Jetons par défaut

| Jeton | Valeur par défaut | Utilisation |
|-------|---------|----------|
| `--color-surface` | `#09090b` | Couleur de fond de la page |
| `--color-surface-raised` | `#18181b` | Éléments mis en évidence, blocs de code |
| `--color-surface-strong` | `#27272a` | Boutons, arrière-plans mis en évidence |
| `--color-edge` | `#27272a` | Bordures principales |
| `--color-edge-subtle` | `#18181b` | Bordures de cartes/tableaux |
| `--color-heading` | `#fafafa` | Titres, texte principal |
| `--color-body` | `#e4e4e7` | Texte du corps/secondaire |
| `--color-muted` | `#d4d4d8` | Texte atténué |
| `--color-dim` | `#a1a1aa` | Étiquettes, descriptions |
| `--color-accent` | `#34d399` | Indicateurs d'état |
| `--color-action` | `#fafafa` | Couleur de fond du bouton principal |
| `--color-action-text` | `#09090b` | Couleur du texte du bouton principal |
| `--color-action-hover` | `#e4e4e7` | Couleur de survol du bouton principal |

### Personnalisation

Remplacez n'importe quel jeton dans le fichier `global.css` de votre site en ajoutant un bloc `@theme` après les importations :

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

Les jetons génèrent des utilitaires Tailwind v4 standard (`bg-surface`, `text-heading`, `border-edge`, etc.), vous pouvez donc également les utiliser dans vos propres composants.

---

## Composants

Importez les composants individuellement depuis le paquet :

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

Structure de page complète avec une barre d'en-tête fixe (badge du logo, liens de navigation, boutons GitHub/npm) et un pied de page.

| Propriété | Type | Description |
|------|------|-------------|
| `title` | `string` | Titre de la page `<title>` |
| `description` | `string` | Description méta |
| `logoBadge` | `string` | Badge de 1 à 2 caractères (par exemple, "RS") |
| `brandName` | `string` | Nom dans l'en-tête |
| `nav` | `{ href, label }[]` | Liens de navigation ancrés |
| `repoUrl` | `string` | URL du dépôt GitHub |
| `npmUrl?` | `string` | URL du paquet npm |
| `footerText` | `string` | Texte du pied de page (HTML autorisé) |

### Hero

Bannière avec un dégradé, un badge d'état, un titre, des appels à l'action et des cartes de prévisualisation de code facultatives.

| Propriété | Type | Description |
|------|------|-------------|
| `badge` | `string` | Texte du badge d'état |
| `headline` | `string` | Titre principal |
| `headlineAccent` | `string` | Suffixe atténué |
| `description` | `string` | Description (HTML autorisé) |
| `primaryCta` | `{ href, label }` | Bouton principal |
| `secondaryCta` | `{ href, label }` | Bouton secondaire |
| `previews` | `{ label, code }[]` | Cartes de prévisualisation de code |

### Section

Conteneur de section avec un identifiant d'ancrage, un titre et un sous-titre facultatif.

### FeatureGrid

Grille de cartes réactive en 3 colonnes. Propriétés : `features: { title, desc }[]`

### DataTable

Tableau borduré basé sur une grille. Propriétés : `columns: string[]`, `rows: string[][]`

### CodeCardGrid

Grille de 2 colonnes de cartes de code sombres. Propriétés : `cards: { title, code }[]`

### ApiList

Cartes de référence d'API empilées en largeur. Propriétés : `apis: { signature, description }[]`

---

## Types de sections

Le tableau `sections` dans votre configuration prend en charge les valeurs `kind` suivantes :

| Kind | Composant | Propriété |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

Les sections sont affichées dans l'ordre dans lequel elles apparaissent dans le tableau.

---

## Déploiement

L'outil en ligne de commande `init` crée automatiquement le fichier `.github/workflows/pages.yml`. Pour mettre votre site en ligne :

1. Poussez votre dépôt sur GitHub.
2. Allez dans votre dépôt → **Paramètres → Pages**.
3. Sous **Construction et déploiement**, définissez **Source** sur **GitHub Actions**.
4. Effectuez une modification et envoyez-la vers le dossier `site/` pour déclencher la première construction.

Votre site sera accessible à l'adresse `https://<org>.github.io/<repo>/`.

---

## Sécurité et portée des données

| Aspect | Détail |
|--------|--------|
| **Data touched** | Fichiers de composants Astro, jetons CSS, configuration du site : uniquement pendant la phase de construction. |
| **Data NOT touched** | Aucune donnée utilisateur, aucun état en cours d'exécution, aucun traitement côté serveur. |
| **Permissions** | Lecture : fichiers sources du projet. Écriture : résultats de la construction vers `site/dist/`. |
| **Network** | Aucun – générateur de site statique sans accès réseau en cours d'exécution. |
| **Telemetry** | Aucune donnée collectée ou envoyée. |

Consultez le fichier [SECURITY.md](SECURITY.md) pour signaler les vulnérabilités.

## Tableau de bord

| Catégorie | Score |
|----------|-------|
| A. Sécurité | 10 |
| B. Gestion des erreurs | 10 |
| C. Documentation pour les utilisateurs | 10 |
| D. Hygiène de déploiement | 10 |
| E. Identité (logicielle) | 10 |
| **Overall** | **50/50** |

> Audit complet : [SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## Licence

MIT

---

Créé par [MCP Tool Shop](https://mcp-tool-shop.github.io/)
