<p align="center">
  <a href="README.md">English</a> | <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <strong>Español</strong> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/site-theme/main/assets/preview.png" alt="vista previa de site-theme" width="800" />
</p>

<h1 align="center">@mcptoolshop/site-theme</h1>

<p align="center">
  Tema Astro orientado por configuración para páginas de inicio de proyectos de MCP Tool Shop.<br/>
  Paleta oscura · Tailwind CSS v4 · Listo para GitHub Pages.
</p>

<p align="center">
  <a href="#inicio-rápido">Inicio rápido</a> &middot;
  <a href="#tokens-de-diseño">Tokens de diseño</a> &middot;
  <a href="#componentes">Componentes</a> &middot;
  <a href="#despliegue">Despliegue</a> &middot;
  <a href="#licencia">Licencia</a>
</p>

---

## Inicio rápido

### Crear un nuevo sitio

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

Esto crea un directorio `site/` con Astro + Tailwind + tema ya configurados, más un flujo de trabajo para GitHub Pages. La importación CSS, la ruta `@source` y la ruta base están preconfiguradas — no se necesita ninguna configuración manual.

### Editar tu contenido

Todo el contenido de la página reside en `site/src/site-config.ts`. Edita el objeto de configuración para personalizar tu página de inicio:

```typescript
import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: '@mcptoolshop/my-tool',
  description: 'Lo que hace mi herramienta.',
  logoBadge: 'MT',
  brandName: 'my-tool',
  repoUrl: 'https://github.com/mcp-tool-shop-org/my-tool',
  npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/my-tool',
  footerText: 'Licencia MIT',

  hero: { /* ... */ },
  sections: [ /* ... */ ],
};
```

---

## Tokens de diseño

El tema incluye tokens de diseño semánticos a través de `styles/theme.css`. Los componentes hacen referencia a estos tokens en lugar de colores fijos, por lo que puedes cambiar todo el aspecto del tema sobreescribiendo unos pocos valores.

### Tokens predeterminados

| Token | Valor predeterminado | Usado para |
|-------|---------------------|------------|
| `--color-surface` | `#09090b` | Fondo de página |
| `--color-surface-raised` | `#18181b` | Elementos elevados, bloques de código |
| `--color-surface-strong` | `#27272a` | Insignias, fondos enfatizados |
| `--color-edge` | `#27272a` | Bordes principales |
| `--color-edge-subtle` | `#18181b` | Bordes de tarjetas/tablas |
| `--color-heading` | `#fafafa` | Encabezados, texto principal |
| `--color-body` | `#e4e4e7` | Cuerpo / texto secundario |
| `--color-muted` | `#d4d4d8` | Texto atenuado |
| `--color-dim` | `#a1a1aa` | Etiquetas, descripciones |
| `--color-accent` | `#34d399` | Indicadores de estado |
| `--color-action` | `#fafafa` | Fondo del botón principal |
| `--color-action-text` | `#09090b` | Texto del botón principal |
| `--color-action-hover` | `#e4e4e7` | Hover del botón principal |

### Personalización

Sobreescribe cualquier token en el `global.css` de tu sitio añadiendo un bloque `@theme` después de las importaciones:

```css
@import "tailwindcss";
@import "@mcptoolshop/site-theme/styles/theme.css";
@source "../../node_modules/@mcptoolshop/site-theme";

/* Sobreescribir tokens */
@theme {
  --color-accent: #60a5fa;          /* punto de estado azul  */
  --color-surface: #0a0a1a;         /* fondo azul marino     */
  --color-action: #60a5fa;          /* botones azules        */
  --color-action-hover: #3b82f6;
}
```

Los tokens generan utilidades estándar de Tailwind v4 (`bg-surface`, `text-heading`, `border-edge`, etc.) para que también puedas usarlos en tus propios componentes.

---

## Componentes

Importa los componentes individualmente desde el paquete:

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

Esqueleto de página completo con cabecera fija (insignia de logo, enlaces de navegación, botones de GitHub/npm) y pie de página.

| Prop | Tipo | Descripción |
|------|------|-------------|
| `title` | `string` | `<title>` de la página |
| `description` | `string` | Meta descripción |
| `logoBadge` | `string` | Insignia de 1–2 caracteres (ej. `"RS"`) |
| `brandName` | `string` | Nombre en la cabecera |
| `nav` | `{ href, label }[]` | Enlaces de navegación por ancla |
| `repoUrl` | `string` | URL del repositorio GitHub |
| `npmUrl?` | `string` | URL del paquete npm |
| `footerText` | `string` | Texto del pie (HTML permitido) |

### Hero

Hero con gradiente, insignia de estado, titular, CTAs y tarjetas de vista previa de código opcionales.

| Prop | Tipo | Descripción |
|------|------|-------------|
| `badge` | `string` | Texto de la insignia de estado |
| `headline` | `string` | Titular principal |
| `headlineAccent` | `string` | Sufijo atenuado |
| `description` | `string` | Descripción (HTML permitido) |
| `primaryCta` | `{ href, label }` | Botón principal |
| `secondaryCta` | `{ href, label }` | Botón secundario |
| `previews` | `{ label, code }[]` | Tarjetas de vista previa de código |

### Section

Envoltorio de sección con `id` de ancla, título y subtítulo opcional.

### FeatureGrid

Cuadrícula responsiva de tarjetas de 3 columnas. Props: `features: { title, desc }[]`

### DataTable

Tabla con borde basada en cuadrícula. Props: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

Cuadrícula de 2 columnas de tarjetas de bloques de código oscuros. Props: `cards: { title, code }[]`

### ApiList

Tarjetas de referencia de API apiladas a ancho completo. Props: `apis: { signature, description }[]`

---

## Tipos de sección

El array `sections` en tu configuración admite estos valores de `kind`:

| Kind | Componente | Props |
|------|------------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

Las secciones se renderizan en el orden en que aparecen en el array.

---

## Despliegue

La CLI `init` crea `.github/workflows/pages.yml` automáticamente. Para publicar:

1. Sube tu repositorio a GitHub
2. Ve a tu repositorio → **Settings → Pages**
3. En **Build and deployment**, establece **Source** como **GitHub Actions**
4. Envía cualquier cambio a `site/` para lanzar el primer despliegue

Tu sitio estará disponible en `https://<org>.github.io/<repo>/`.

---

## Licencia

MIT
