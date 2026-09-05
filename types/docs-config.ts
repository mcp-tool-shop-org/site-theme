import type { PackageLinkFields } from './config';

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  label: string;
  href: string;
}

export interface DocsSection {
  id: string;
  title: string;
  /** HTML content (rendered via set:html) */
  content: string;
  /** Sub-headings for TOC generation */
  headings?: { text: string; id: string; depth: 2 | 3 }[];
}

export interface DocsSiteConfig extends PackageLinkFields {
  template: 'docs';
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
  /** Footer left-side text */
  footerText: string;

  /** Sidebar navigation structure */
  sidebar: SidebarGroup[];

  /** Content sections rendered in the main area */
  sections: DocsSection[];
}
