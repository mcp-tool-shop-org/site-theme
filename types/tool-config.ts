import type { HeroDef, PackageLinkFields } from './config';

export interface ToolCommand {
  name: string;
  description: string;
  /** Full usage string, e.g. "my-tool run [options] <input>" */
  usage?: string;
}

export interface ToolCommandGroup {
  group: string;
  description?: string;
  commands: ToolCommand[];
}

export interface ToolProof {
  tests?: string;
  ci?: string;
  dogfood?: string;
  version?: string;
}

export interface ToolSiteConfig extends PackageLinkFields {
  template: 'tool';
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

  /** Hero section */
  hero: HeroDef;

  /** 3-step quickstart: install, run, verify */
  quickstart: { title: string; code: string }[];

  /** Flat command list (use when commands don't need grouping) */
  commands?: ToolCommand[];

  /** Commands grouped by job-to-be-done */
  commandGroups?: ToolCommandGroup[];

  /** Realistic end-to-end workflow example */
  workflow?: {
    title: string;
    description?: string;
    steps: { title: string; code: string }[];
  };

  /** Test, CI, and dogfood proof */
  proof?: ToolProof;

  /** Integration snippets — npm, MCP config, local setup */
  integration?: {
    title?: string;
    subtitle?: string;
    cards: { title: string; code: string }[];
  };
}
