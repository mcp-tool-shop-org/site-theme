<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.md">English</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

## Plantillas

Elige una plantilla, crea una estructura básica y construye. Cada plantilla se somete a pruebas de integración continua y está lista para GitHub Pages.

| Plantilla | Descripción | Páginas |
|----------|-------------|-------|
| **default** | Página de inicio del proyecto con un encabezado, características y ejemplos de código. | 1 |
| **docs** | Sitio de documentación con navegación lateral y secciones de contenido. | 1 |
| **product** | Página de inicio para marketing con precios, testimonios y llamadas a la acción. | 1 |
| **app** | Panel de control SaaS multi-inquilino con control de acceso basado en roles, indicadores de características y enrutamiento de espacios de trabajo. | 31 |

```bash
npx @mcptoolshop/site-theme list-templates        # see all options
npx @mcptoolshop/site-theme init --template app    # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run  # preview files
```

---

## Comienzo rápido

### Crea una nueva página web

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

Esto crea un directorio `site/` con Astro + Tailwind + un tema preconfigurado, además de un flujo de trabajo para GitHub Pages. La importación de CSS, la ruta `@source` y la ruta base están preconfiguradas; no se requiere configuración manual.

### Edita tu contenido

Todo el contenido de la página se encuentra en `site/src/site-config.ts`. Edita el objeto de configuración para personalizar tu página de inicio:

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

## Tokens de diseño

El tema proporciona tokens de diseño semánticos a través de `styles/theme.css`. Los componentes hacen referencia a estos tokens en lugar de colores codificados, por lo que puedes cambiar el aspecto de todo el tema sobrescribiendo algunos valores.

### Tokens predeterminados

| Token | Valor predeterminado | Usado para |
|-------|---------|----------|
| `--color-surface` | `#09090b` | Fondo de la página |
| `--color-surface-raised` | `#18181b` | Elementos destacados, bloques de código |
| `--color-surface-strong` | `#27272a` | Insignias, fondos resaltados |
| `--color-edge` | `#27272a` | Bordes primarios |
| `--color-edge-subtle` | `#18181b` | Bordes de tarjetas/tablas |
| `--color-heading` | `#fafafa` | Encabezados, texto principal |
| `--color-body` | `#e4e4e7` | Texto del cuerpo/secundario |
| `--color-muted` | `#d4d4d8` | Texto atenuado |
| `--color-dim` | `#a1a1aa` | Etiquetas, descripciones |
| `--color-accent` | `#34d399` | Indicadores de estado |
| `--color-action` | `#fafafa` | Fondo del botón principal |
| `--color-action-text` | `#09090b` | Texto del botón principal |
| `--color-action-hover` | `#e4e4e7` | Efecto al pasar el ratón sobre el botón principal |

### Personalización

Sobrescribe cualquier token en el archivo `global.css` de tu sitio agregando un bloque `@theme` después de las importaciones:

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

Los tokens generan utilidades estándar de Tailwind v4 (`bg-surface`, `text-heading`, `border-edge`, etc.), por lo que también puedes usarlos en tus propios componentes.

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

Estructura de página completa con encabezado fijo (insignia de logotipo, enlaces de navegación, botones de GitHub/npm) y pie de página.

| Propiedad | Tipo | Descripción |
|------|------|-------------|
| `title` | `string` | Título de la página `<title>` |
| `description` | `string` | Descripción meta |
| `logoBadge` | `string` | Insignia de 1 a 2 caracteres (ej. "RS") |
| `brandName` | `string` | Nombre en el encabezado |
| `nav` | `{ href, label }[]` | Enlaces de navegación anclados |
| `repoUrl` | `string` | URL del repositorio de GitHub |
| `npmUrl?` | `string` | URL del paquete npm |
| `footerText` | `string` | Texto del pie de página (se permite HTML) |

### Hero

Encabezado con degradado, insignia de estado, título, llamadas a la acción y tarjetas de vista previa de código opcionales.

| Propiedad | Tipo | Descripción |
|------|------|-------------|
| `badge` | `string` | Texto de la insignia de estado |
| `headline` | `string` | Título principal |
| `headlineAccent` | `string` | Sufijo atenuado |
| `description` | `string` | Descripción (se permite HTML) |
| `primaryCta` | `{ href, label }` | Botón principal |
| `secondaryCta` | `{ href, label }` | Botón secundario |
| `previews` | `{ label, code }[]` | Tarjetas de vista previa de código |

### Sección

Contenedor de sección con ID de anclaje, título y subtítulo opcional.

### FeatureGrid

Cuadrícula de tarjetas responsiva de 3 columnas. Propiedades: `features: { title, desc }[]`

### DataTable

Tabla con bordes basada en cuadrícula. Propiedades: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

Cuadrícula de 2 columnas de tarjetas de código oscuras. Propiedades: `cards: { title, code }[]`

### ApiList

Tarjetas de referencia de API apiladas de ancho completo. Propiedades: `apis: { signature, description }[]`

---

## Tipos de sección

El array `sections` en tu configuración admite estos valores de `kind`:

| Tipo | Componente | Propiedad |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

Las secciones se renderizan en el orden en que aparecen en el array.

---

## Implementación

La interfaz de línea de comandos (CLI) `init` crea automáticamente el archivo `.github/workflows/pages.yml`. Para poner en marcha:

1. Sube tu repositorio a GitHub.
2. Ve a tu repositorio → **Configuración → Páginas**.
3. En la sección **Construcción e implementación**, establece **Origen** en **GitHub Actions**.
4. Realiza cualquier cambio en el directorio `site/` para iniciar la primera compilación.

Tu sitio estará disponible en `https://<org>.github.io/<repo>/`.

---

## Seguridad y alcance de los datos

| Aspecto | Detalle |
|--------|--------|
| **Data touched** | Archivos de componentes de Astro, tokens CSS, configuración del sitio: solo durante la compilación. |
| **Data NOT touched** | No se recopilan datos de usuario, ni se guarda ningún estado en tiempo de ejecución, ni se realiza ningún procesamiento del lado del servidor. |
| **Permissions** | Lectura: archivos de origen del proyecto. Escritura: salida de la compilación en `site/dist/`. |
| **Network** | Ninguno: generador de sitios estáticos sin acceso a la red en tiempo de ejecución. |
| **Telemetry** | Ninguno se recopila ni se envía. |

Consulta [SECURITY.md](SECURITY.md) para informar sobre vulnerabilidades.

## Evaluación

| Categoría | Puntuación |
|----------|-------|
| A. Seguridad | 10 |
| B. Manejo de errores | 10 |
| C. Documentación para operadores | 10 |
| D. Higiene en la entrega | 10 |
| E. Identidad (suave) | 10 |
| **Overall** | **50/50** |

> Auditoría completa: [SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## Licencia

MIT

---

Creado por [MCP Tool Shop](https://mcp-tool-shop.github.io/)
