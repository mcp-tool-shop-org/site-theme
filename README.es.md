<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.md">English</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

## Plantillas

Elige una plantilla, crea la estructura, construye. Cada plantilla se entrega con pruebas de CI y lista para GitHub Pages.

| Plantilla | Descripción | Páginas |
|----------|-------------|-------|
| **default** | Página de inicio de proyecto con encabezado, características y ejemplos de código | 1 |
| **docs** | Sitio de documentación con navegación en la barra lateral y secciones de contenido | 1 |
| **product** | Página de inicio de marketing con precios, testimonios y llamadas a la acción | 1 |
| **portfolio** | Cuadrícula de catálogo filtrable para herramientas, proyectos o cualquier colección | 1 |
| **app** | Panel de control SaaS multi-inquilino con RBAC, indicadores de características y enrutamiento de espacios de trabajo | 31 |
| **tool** | Página de inicio del paquete CLI / MCP / npm con comandos, flujo de trabajo y prueba | 1 |

```bash
npx @mcptoolshop/site-theme list-templates            # see all options
npx @mcptoolshop/site-theme list-templates --json      # machine-readable output
npx @mcptoolshop/site-theme init --template app        # scaffold a template
npx @mcptoolshop/site-theme init --template app --dry-run   # preview files
npx @mcptoolshop/site-theme init --out ../other-repo   # scaffold into another directory
```

---

## Primeros pasos

### Crea un nuevo sitio

```bash
npx @mcptoolshop/site-theme init
cd site && npm install
npm run dev
```

Esto crea un directorio `site/` con Astro 7 + Tailwind + tema configurado, además de un flujo de trabajo de GitHub Pages. La importación de CSS, la ruta `@source` y la ruta base están preconfiguradas; no se necesita configuración manual. Los usuarios existentes de Astro 5 o 6 pueden seguir utilizándolo (`peerDependencies.astro` es `>=5`).

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
  packageUrl: 'https://www.npmjs.com/package/@mcptoolshop/my-tool',
  footerText: 'MIT Licensed',

  hero: { /* ... */ },
  sections: [ /* ... */ ],
};
```

---

## Fachada

site-theme renderiza la **fachada** "humana" de un repositorio; **front-door** verifica su fachada de **agente/máquina** (el archivo README, `AGENTS.md` y `llms.txt`) que los humanos, los agentes y las herramientas leen primero. Primero verifica: no escribe prosa por ti, sino que demuestra que tu prosa es verdadera y concisa.

```bash
npx @mcptoolshop/site-theme front-door verify                  # audit; exits 1 if the gate fails
npx @mcptoolshop/site-theme front-door verify --run-doctests   # also compile/run fenced JS examples
npx @mcptoolshop/site-theme front-door init                    # scaffold a minimal, verify-clean front door
npx @mcptoolshop/site-theme front-door standard                # print the front-door spine
npx @mcptoolshop/site-theme front-door eval                    # the verifier's self-eval receipt
npx @mcptoolshop/site-theme front-door mcp                     # start the MCP server (agents call verify)
```

Enruta cada afirmación documentada a la evidencia que la respalda: rutas/scripts/enlaces muertos, duplicación de AGENTS.md↔README, desconfianza en las insignias de estado, ejemplos de importaciones frente a `exports` reales (y, con `--run-doctests`, que los ejemplos realmente se compilan y se ejecutan), afirmaciones de procedencia frente a la verificación real y la hinchazón (longitud/legibilidad/presupuesto de directivas para `AGENTS.md`). Los resultados se ordenan por riesgo en cuatro categorías: Verificado/Contradicho/Faltante/No verificable.

Úsalo de forma programática (shipcheck lo utiliza):

```js
import { verify } from '@mcptoolshop/site-theme/front-door';

const scorecard = verify({ root: process.cwd() });
if (!scorecard.gate.pass) process.exit(1);
```

O permite que un agente lo invoque: `front-door mcp` inicia un servidor MCP sin dependencias que expone `front_door_verify`; el agente recibe la misma tarjeta de puntuación estructurada.

Consulta la [referencia de la fachada](docs/front-door.md) para obtener la lista completa de canales y el estándar.

---

## Tokens de diseño

El tema incluye tokens de diseño semánticos a través de `styles/theme.css`. Los componentes hacen referencia a estos tokens en lugar de a colores codificados, por lo que puedes cambiar el aspecto de todo el tema modificando algunos valores.

### Tokens predeterminados

| Token | Predeterminado | Se utiliza para |
|-------|---------|----------|
| `--color-surface` | `#09090b` | Fondo de la página |
| `--color-surface-raised` | `#18181b` | Elementos elevados, bloques de código |
| `--color-surface-strong` | `#27272a` | Insignias, fondos resaltados |
| `--color-edge` | `#27272a` | Bordes primarios |
| `--color-edge-subtle` | `#18181b` | Bordes de tarjeta/tabla |
| `--color-heading` | `#fafafa` | Encabezados, texto principal |
| `--color-body` | `#e4e4e7` | Texto del cuerpo/secundario |
| `--color-muted` | `#d4d4d8` | Texto atenuado |
| `--color-dim` | `#a1a1aa` | Etiquetas, descripciones |
| `--color-accent` | `#34d399` | Indicadores de estado |
| `--color-action` | `#fafafa` | Fondo del botón primario |
| `--color-action-text` | `#09090b` | Texto del botón primario |
| `--color-action-hover` | `#e4e4e7` | Botón primario al pasar el cursor |

### Personalización

Anula cualquier token en el archivo `global.css` de tu sitio agregando un bloque `@theme` después de las importaciones:

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

Importa componentes individualmente desde el paquete:

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

El tema incluye 17 componentes de Astro en cinco categorías: diseños de página, secciones de contenido, bloques de marketing, portafolio y documentación.

### BaseLayout

Diseño de página completo con encabezado fijo (insignia de logotipo, enlaces de navegación, botones de GitHub/paquete) y pie de página. La ranura con nombre `head` es el punto de extensión para etiquetas `<head>` adicionales (imagen OG, JSON-LD, preconexión).

| Propiedad | Tipo | Descripción |
|------|------|-------------|
| `title` | `string` | Título de la página `<title>` |
| `description` | `string` | Meta descripción |
| `logoBadge` | `string` | Insignia de 1 a 2 caracteres (por ejemplo, `"RS"`) |
| `brandName` | `string` | Nombre en el encabezado |
| `nav` | `{ href, label }[]` | Enlaces de navegación de anclaje (opcional, por defecto `[]`) |
| `repoUrl` | `string` | URL del repositorio de GitHub |
| `packageUrl?` | `string` | Listado principal del registro (npm, PyPI, crates.io, ...). La etiqueta se deriva del host. |
| `packageLabel?` | `string` | Anulación opcional de la etiqueta de visualización para `packageUrl` |
| `npmUrl?` | `string` | Alias obsoleto para `packageUrl` |
| `footerText` | `string` | Texto del pie de página (se permite HTML) |

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

Hero degradado con insignia de estado, título, llamadas a la acción y tarjetas de vista previa de código opcionales.

| Propiedad | Tipo | Descripción |
|------|------|-------------|
| `badge` | `string` | Texto de la insignia de estado |
| `headline` | `string` | Título principal |
| `headlineAccent` | `string` | Sufijo atenuado |
| `description` | `string` | Descripción (se permite HTML) |
| `primaryCta` | `{ href, label }` | Botón primario |
| `secondaryCta` | `{ href, label }` | Botón secundario |
| `previews` | `{ label, code }[]` | Tarjetas de vista previa de código (opcional) |

### Section

Contenedor de sección con anclaje `id`, título y subtítulo opcional.

### FeatureGrid

Cuadrícula de tarjetas responsiva de 3 columnas. Propiedades: `features: { title, desc }[]`

### DataTable

Tabla con bordes basada en cuadrícula. Propiedades: `columns: string[]`, `rows: string[][]`

### CodeCardGrid

Cuadrícula de 2 columnas de tarjetas de bloques de código oscuros. Propiedades: `cards: { title, code }[]`

### ApiList

Tarjetas de referencia de API apiladas de ancho completo. Propiedades: `apis: { signature, description }[]`

### FilterBar

Barra de búsqueda y filtrado por etiquetas para cuadrículas de portafolio. Propiedades: `tags: string[]`, `searchable?: boolean`, `searchPlaceholder?: string`

### PortfolioGrid

Cuadrícula de tarjetas configurable con insignias de estado, agrupación por categorías y alternativas de imagen/insignia. Propiedades: `items: PortfolioItem[]`, `columns?: 2 | 3 | 4`, `groupByCategory?: boolean`

### DocLayout

Diseño de dos columnas con barra lateral plegable y área de contenido principal. Se utiliza en la plantilla **docs**. Propiedades: `sidebar: SidebarGroup[]`, `currentPath: string`

### Sidebar

Lista de navegación agrupada con resaltado de enlaces activos. Propiedades: `groups: SidebarGroup[]`, `currentPath?: string`

### TableOfContents

Navegación por encabezados dentro de la página. Props: `headings?: { text, id, depth }[]`

### ContentSection

Bloque de contenido vinculado a un ancla que renderiza HTML a través de `set:html`. Props: `id: string`, `title: string`, `content: string`

### SocialProof

Barra de estadísticas con un encabezado y pares de valor/etiqueta. Props: `headline?: string`, `stats?: { value, label }[]`

### PricingGrid

Tarjetas de precios responsivas con la opción "Popular" resaltada. Props: `tiers?: PricingTier[]`

### TestimonialGrid

Tarjetas de citas de dos columnas con iniciales como alternativa para el avatar. Props: `testimonials?: { quote, author, role, avatarUrl? }[]`

### CtaBanner

Banner de llamada a la acción de ancho completo con un degradado. Props: `headline: string`, `description?: string`, `cta: { href, label }`

---

## Tipos de sección

El array `sections` en su configuración admite estos valores `kind`:

| Tipo | Componente | Props |
|------|-----------|-------|
| `features` | FeatureGrid | `features: { title, desc }[]` |
| `data-table` | DataTable | `columns: string[]`, `rows: string[][]` |
| `code-cards` | CodeCardGrid | `cards: { title, code }[]` |
| `api` | ApiList | `apis: { signature, description }[]` |

Las secciones se renderizan en el orden en que aparecen en el array.

---

## Deploy

La CLI `init` crea `.github/workflows/pages.yml` automáticamente. Para ponerlo en funcionamiento:

1. Suba su repositorio a GitHub
2. Vaya a su repositorio → **Configuración → Páginas**
3. En **Compilación y despliegue**, establezca **Origen** en **GitHub Actions**
4. Realice cualquier cambio en `site/` para activar la primera compilación

Su sitio estará en funcionamiento en `https://<org>.github.io/<repo>/`.

---

## Seguridad y alcance de los datos

| Aspecto | Detalle |
|--------|--------|
| **Data touched** | Tema: componentes de Astro, tokens CSS, configuración del sitio en tiempo de compilación. Front-end: README / AGENTS.md / llms.txt / CLAUDE.md en el disco. |
| **Data NOT touched** | No hay cuentas de usuario, no hay estado del sitio en tiempo de ejecución, no hay análisis, no hay API de terceros |
| **Permissions** | Lectura: código fuente del proyecto. Escritura: `init` escribe `site/` en el directorio de trabajo (o `--out`). La verificación es de solo lectura a menos que `--run-doctests`. |
| **Network** | Desactivado por defecto. MCP es stdio. `--run-doctests` es la ejecución opcional de un proceso hijo; no instala paquetes ni abre una red. |
| **Telemetry** | Ninguno recopilado ni enviado |

### Props de HTML (set:html)

Varios props de componentes renderizan HTML sin formato a través de la directiva `set:html` de Astro. Si su fuente de datos no es de confianza (contenido generado por el usuario, API externas), **saneé el HTML antes de pasarlo** utilizando una biblioteca como [DOMPurify](https://github.com/cure53/DOMPurify) o [sanitize-html](https://github.com/apostrophecms/sanitize-html).

| Componente | Props que utilizan set:html |
|-----------|---------------------|
| BaseLayout | `footerText` |
| Hero | `badge`, `description` |
| CodeCardGrid | `cards[].code` |
| ApiList | `apis[].signature`, `apis[].description` |
| ContentSection | `content` |

Consulte [SECURITY.md](SECURITY.md) para informar sobre vulnerabilidades.

## Scorecard

| Categoría | Puntuación |
|----------|-------|
| A. Seguridad | 10 |
| B. Manejo de errores | 10 |
| C. Documentación para operadores | 10 |
| D. Buenas prácticas de envío | 10 |
| E. Identidad (suave) | 10 |
| **Overall** | **50/50** |

> Auditoría completa: [SHIP_GATE.md](SHIP_GATE.md) · [SCORECARD.md](SCORECARD.md)

## Licencia

MIT

---

Creado por [MCP Tool Shop](https://mcp-tool-shop.github.io/)
