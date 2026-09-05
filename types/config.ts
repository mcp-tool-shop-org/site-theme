import type { DocsSiteConfig } from './docs-config';
import type { PortfolioSiteConfig } from './portfolio-config';
import type { ProductSiteConfig } from './product-config';
import type { ToolSiteConfig } from './tool-config';

/** Registry listing link — shared by every SiteConfig variant. */
export interface PackageLinkFields {
  /**
   * URL of the package's primary registry listing (npm, PyPI, crates.io, ...).
   * Preferred over `npmUrl`.
   */
  packageUrl?: string;
  /**
   * Optional display label for the package link. When omitted, BaseLayout
   * derives a label from the URL host (npm, PyPI, crates.io, ...).
   */
  packageLabel?: string;
  /**
   * @deprecated since 2.2.0 — use `packageUrl`. Kept as a back-compat alias.
   */
  npmUrl?: string;
}

export interface DefaultSiteConfig extends PackageLinkFields {
  /** Template discriminant (optional for backward compat) */
  template?: 'default';
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
  /** Footer left-side text, e.g. "MIT Licensed" */
  footerText: string;

  /** Hero section */
  hero: HeroDef;

  /** Ordered page sections (rendered top-to-bottom) */
  sections: SectionDef[];
}

/** Discriminated union — determines which template config is in use */
export type SiteConfig = DefaultSiteConfig | DocsSiteConfig | ProductSiteConfig | PortfolioSiteConfig | ToolSiteConfig;

export type { DocsSection, DocsSiteConfig, SidebarGroup, SidebarItem } from './docs-config';
export type { PortfolioItem, PortfolioSiteConfig } from './portfolio-config';
export type {
  CtaBannerDef,
  PricingDef,
  PricingTier,
  ProductSiteConfig,
  SocialProofDef,
  TestimonialDef,
} from './product-config';
export type { ToolCommand, ToolCommandGroup, ToolProof, ToolSiteConfig } from './tool-config';

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

export type SectionDef = FeatureSectionDef | DataTableSectionDef | CodeCardSectionDef | ApiSectionDef;

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
