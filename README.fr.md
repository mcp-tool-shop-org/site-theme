<p align="center">
  <a href="README.md">English</a> | <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <strong>Français</strong> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/site-theme/main/assets/preview.png" alt="aperçu de site-theme" width="800" />
</p>

<h1 align="center">@mcptoolshop/site-theme</h1>

<p align="center">
  Thème Astro piloté par configuration pour les pages d'accueil des projets MCP Tool Shop.<br/>
  Palette sombre · Tailwind CSS v4 · Prêt pour GitHub Pages.
</p>

<p align="center">
  <a href="#démarrage-rapide">Démarrage rapide</a> &middot;
  <a href="#tokens-de-conception">Tokens de conception</a> &middot;
  <a href="#composants">Composants</a> &middot;
  <a href="#déploiement">Déploiement</a> &middot;
  <a href="#licence">Licence</a>
</p>

---

## Démarrage rapide

### Créer un nouveau site

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

Cela crée un répertoire `site/` avec Astro + Tailwind + le thème déjà configurés, ainsi qu'un workflow GitHub Pages. L'import CSS, le chemin `@source` et le chemin de base sont préconfigurés — aucune configuration manuelle requise.

### Modifier votre contenu

Tout le contenu de la page se trouve dans `site/src/site-config.ts`. Modifiez l'objet de configuration pour personnaliser votre page d'accueil :

```typescript
import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '@mcptoolshop/my-tool',
  description: 'Ce que fait mon outil.',
  logoBadge: 'MT',
  brandName: 'my-tool',
  repoUrl: 'https://github.com/mcp-tool-shop-org/my-tool',
  npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/my-tool',
  footerText: 'Licence MIT',

  hero: { /* ... */ },
  sections: [ /* ... */ ],
};
```

---

## Tokens de conception

Le thème fournit des tokens de conception sémantiques via `styles/theme.css`. Les composants référencent ces tokens plutôt que des couleurs codées en dur, ce qui permet de personnaliser l'apparence entière du thème en remplaçant quelques valeurs.

### Tokens par défaut

| Token | Valeur par défaut | Utilisé pour |
|-------|------------------|--------------|
| `--color-surface` | `#09090b` | Arrière-plan de la page |
| `--color-surface-raised` | `#18181b` | Éléments surélevés, blocs de code |
| `--color-surface-strong` | `#27272a` | Badges, arrière-plans accentués |
| `--color-edge` | `#27272a` | Bordures principales |
| `--color-edge-subtle` | `#18181b` | Bordures des cartes/tableaux |
| `--color-heading` | `#fafafa` | Titres, texte principal |
| `--color-body` | `#e4e4e7` | Corps / texte secondaire |
| `--color-muted` | `#d4d4d8` | Texte atténué |
| `--color-dim` | `#a1a1aa` | Étiquettes, descriptions |
| `--color-accent` | `#34d399` | Indicateurs d'état |
| `--color-action` | `#fafafa` | Arrière-plan du bouton principal |
| `--color-action-text` | `#09090b` | Texte du bouton principal |
| `--color-action-hover` | `#e4e4e7` | Survol du bouton principal |

### Personnalisation

Remplacez n'importe quel token dans le `global.css` de votre site en ajoutant un bloc `@theme` après les imports :

```css
@import "tailwindcss";
@import "@mcptoolshop/site-theme/styles/theme.css";
@source "../../node_modules/@mcptoolshop/site-theme";

/* Remplacement des tokens */
@theme {
  --color-accent: #60a5fa;          /* point d'état bleu    */
  --color-surface: #0a0a1a;         /* fond bleu marine     */
  --color-action: #60a5fa;          /* boutons bleus        */
  --color-action-hover: #3b82f6;
}
```

Les tokens génèrent des utilitaires Tailwind v4 standards (`bg-surface`, `text-heading`, `border-edge`, etc.) utilisables également dans vos propres composants.

---

## Composants

Importez les composants individuellement depuis le package :

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

Coquille de page complète avec en-tête fixe (badge logo, liens de navigation, boutons GitHub/npm) et pied de page.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | `<title>` de la page |
| `description` | `string` | Meta description |
| `logoBadge` | `string` | Badge de 1–2 caractères (ex. `"RS"`) |
| `brandName` | `string` | Nom dans l'en-tête |
| `nav` | `{ href, label }[]` | Liens de navigation par ancre |
| `repoUrl` | `string` | URL du dépôt GitHub |
| `npmUrl?` | `string` | URL du package npm |
| `footerText` | `string` | Texte du pied de page (HTML autorisé) |

### Hero

Hero avec dégradé, badge d'état, titre, CTAs et cartes de prévisualisation de code optionnelles.

| Prop | Type | Description |
|------|------|-------------|
| `badge` | `string` | Texte du badge d'état |
| `headline` | `string` | Titre principal |
| `headlineAccent` | `string` | Suffixe atténué |
| `description` | `string` | Description (HTML autorisé) |
| `primaryCta` | `{ href, label }` | Bouton principal |
| `secondaryCta` | `{ href, label }` | Bouton secondaire |
| `previews` | `{ label, code }[]` | Cartes de prévisualisation de code |

### Section

Wrapper de section avec `id` d'ancre, titre et sous-titre optionnel.

### FeatureGrid

Grille responsive de cartes à 3 colonnes. Props : `features: { title, desc }[]`

### DataTable

Tableau avec bordure basé sur une grille. Props : `columns: string[]`, `rows: string[][]`

### CodeCardGrid

Grille à 2 colonnes de cartes de blocs de code sombres. Props : `cards: { title, code }[]`

### ApiList

Cartes de référence API empilées pleine largeur. Props : `apis: { signature, description }[]`

---

## Types de section

Le tableau `sections` dans votre configuration prend en charge ces valeurs de `kind` :

| Kind | Composant | Props |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

Les sections sont rendues dans l'ordre où elles apparaissent dans le tableau.

---

## Déploiement

La CLI `init` crée automatiquement `.github/workflows/pages.yml`. Pour mettre en ligne :

1. Poussez votre dépôt sur GitHub
2. Accédez à votre dépôt → **Settings → Pages**
3. Sous **Build and deployment**, définissez **Source** sur **GitHub Actions**
4. Poussez n'importe quelle modification dans `site/` pour déclencher le premier déploiement

Votre site sera disponible à l'adresse `https://<org>.github.io/<repo>/`.

---

## Licence

MIT
