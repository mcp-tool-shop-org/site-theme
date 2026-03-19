import type { CtaDef, HeroDef } from './config';

export interface PortfolioItem {
  /** Display title */
  title: string;
  /** Short description */
  description: string;
  /** Primary link (card click target) */
  href: string;
  /** Image URL or path (optional, displayed as card thumbnail) */
  image?: string;
  /** 1-2 char badge fallback when no image is provided */
  badge?: string;
  /** Tags for filtering (e.g. ["python", "cli", "mcp"]) */
  tags?: string[];
  /** Category for grouping (e.g. "Tools", "Libraries", "Integrations") */
  category?: string;
  /** Status label (e.g. "stable", "beta", "new", "archived") */
  status?: string;
  /** Secondary metadata line (e.g. "v2.1.0", "MIT License", "Updated Mar 2026") */
  meta?: string;
  /** Secondary action link (e.g. docs, demo, npm) */
  secondaryAction?: CtaDef;
}

export interface PortfolioSiteConfig {
  template: 'portfolio';
  /** Page <title> */
  title: string;
  /** Meta description */
  description: string;
  /** 1-2 char logo badge */
  logoBadge: string;
  /** Brand name in header */
  brandName: string;
  /** GitHub repo URL */
  repoUrl: string;
  /** npm package URL (omit to hide npm header button) */
  npmUrl?: string;
  /** Footer left-side text */
  footerText: string;

  /** Optional hero section at the top */
  hero?: HeroDef;

  /** Heading above the portfolio grid */
  portfolioHeading?: string;
  /** Subtitle below the heading */
  portfolioSubtitle?: string;

  /** Enable client-side tag filtering (default: true) */
  filterable?: boolean;
  /** Enable client-side text search (default: true) */
  searchable?: boolean;
  /** Group items by category with section headings (default: false) */
  groupByCategory?: boolean;

  /** Grid column count on large screens: 2 | 3 | 4 (default: 3) */
  columns?: 2 | 3 | 4;

  /** The items to display */
  items: PortfolioItem[];

  /** Optional bottom CTA banner */
  ctaBanner?: {
    headline: string;
    description?: string;
    cta: CtaDef;
  };
}
