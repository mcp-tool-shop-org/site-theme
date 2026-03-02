---
import '../styles/global.css';
import BaseLayout from '@mcptoolshop/site-theme/components/BaseLayout.astro';
import Hero from '@mcptoolshop/site-theme/components/Hero.astro';
import Section from '@mcptoolshop/site-theme/components/Section.astro';
import FeatureGrid from '@mcptoolshop/site-theme/components/FeatureGrid.astro';
import SocialProof from '@mcptoolshop/site-theme/components/SocialProof.astro';
import PricingGrid from '@mcptoolshop/site-theme/components/PricingGrid.astro';
import TestimonialGrid from '@mcptoolshop/site-theme/components/TestimonialGrid.astro';
import CtaBanner from '@mcptoolshop/site-theme/components/CtaBanner.astro';
import { config } from '../site-config';
---

<BaseLayout
  title={config.title}
  description={config.description}
  logoBadge={config.logoBadge}
  brandName={config.brandName}
  repoUrl={config.repoUrl}
  npmUrl={config.npmUrl}
  footerText={config.footerText}
>
  <Hero {...config.hero} />

  {config.socialProof && (
    <SocialProof headline={config.socialProof.headline} stats={config.socialProof.stats} />
  )}

  {config.features && (
    <Section id="features" title="Features">
      <FeatureGrid features={config.features} />
    </Section>
  )}

  {config.pricing && (
    <Section id="pricing" title={config.pricing.headline} subtitle={config.pricing.subtitle}>
      <PricingGrid tiers={config.pricing.tiers} />
    </Section>
  )}

  {config.testimonials && (
    <Section id="testimonials" title="What people say">
      <TestimonialGrid testimonials={config.testimonials} />
    </Section>
  )}

  {config.ctaBanner && (
    <CtaBanner headline={config.ctaBanner.headline} description={config.ctaBanner.description} cta={config.ctaBanner.cta} />
  )}
</BaseLayout>
