export interface SiteConfig {
  /** Page <title>, e.g. "@mcptoolshop/registry-stats" */
  title: string;
  /** Meta description */
  description: string;
  /** 1-2 char logo badge, e.g. "RS" */
  logoBadge: string;
  /** Brand name in header, e.g. "registry-stats" */
  brandName: string;
  /** GitHub repo URL */
  repoUrl: string;
  /** npm package URL (omit to hide npm header button) */
  npmUrl?: string;
  /** Footer left-side text, e.g. "MIT Licensed" */
  footerText: string;

  /** Hero section */
  hero: HeroDef;

  /** Ordered page sections (rendered top-to-bottom) */
  sections: SectionDef[];
}

export interface HeroDef {
  /** Status badge text */
  badge: string;
  /** Main headline */
  headline: string;
  /** Muted/accent suffix of headline */
  headlineAccent: string;
  /** Description paragraph (HTML allowed, rendered via set:html) */
  description: string;
  /** Primary CTA button */
  primaryCta: CtaDef;
  /** Secondary CTA button */
  secondaryCta: CtaDef;
  /** Code preview cards (typically 3) */
  previews: PreviewDef[];
}

export interface CtaDef {
  href: string;
  label: string;
}

export interface PreviewDef {
  label: string;
  code: string;
}

export interface NavItem {
  href: string;
  label: string;
}

// --- Section variants ---

export type SectionDef =
  | FeatureSectionDef
  | DataTableSectionDef
  | CodeCardSectionDef
  | ApiSectionDef;

interface BaseSectionDef {
  id: string;
  title: string;
  subtitle?: string;
}

export interface FeatureSectionDef extends BaseSectionDef {
  kind: 'features';
  features: { title: string; desc: string }[];
}

export interface DataTableSectionDef extends BaseSectionDef {
  kind: 'data-table';
  columns: string[];
  rows: string[][];
}

export interface CodeCardSectionDef extends BaseSectionDef {
  kind: 'code-cards';
  cards: { title: string; code: string }[];
}

export interface ApiSectionDef extends BaseSectionDef {
  kind: 'api';
  apis: { signature: string; description: string }[];
}
