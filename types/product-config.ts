import type { HeroDef, CtaDef } from './config';

export interface SocialProofDef {
  headline?: string;
  stats: { value: string; label: string }[];
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: CtaDef;
  highlighted?: boolean;
}

export interface PricingDef {
  headline: string;
  subtitle?: string;
  tiers: PricingTier[];
}

export interface TestimonialDef {
  quote: string;
  author: string;
  role: string;
  avatarUrl?: string;
}

export interface CtaBannerDef {
  headline: string;
  description?: string;
  cta: CtaDef;
}

export interface ProductSiteConfig {
  template: 'product';
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

  /** Hero section */
  hero: HeroDef;

  /** Social proof / trust signals */
  socialProof?: SocialProofDef;

  /** Feature highlights */
  features?: { title: string; desc: string }[];

  /** Pricing tiers */
  pricing?: PricingDef;

  /** Testimonials */
  testimonials?: TestimonialDef[];

  /** Bottom CTA banner */
  ctaBanner?: CtaBannerDef;
}
