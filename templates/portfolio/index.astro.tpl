---
import '../styles/global.css';
import BaseLayout from '@mcptoolshop/site-theme/components/BaseLayout.astro';
import Hero from '@mcptoolshop/site-theme/components/Hero.astro';
import Section from '@mcptoolshop/site-theme/components/Section.astro';
import FilterBar from '@mcptoolshop/site-theme/components/FilterBar.astro';
import PortfolioGrid from '@mcptoolshop/site-theme/components/PortfolioGrid.astro';
import CtaBanner from '@mcptoolshop/site-theme/components/CtaBanner.astro';
import { config } from '../site-config';

// Extract unique tags from all items
const allTags = [...new Set(config.items.flatMap((item) => item.tags ?? []))].sort();
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
  {config.hero && (
    <Hero {...config.hero} />
  )}

  <Section
    id="catalog"
    title={config.portfolioHeading ?? 'Portfolio'}
    subtitle={config.portfolioSubtitle}
  >
    {(config.filterable !== false || config.searchable !== false) && (
      <div class="mt-6">
        <FilterBar
          tags={config.filterable !== false ? allTags : []}
          searchable={config.searchable !== false}
        />
      </div>
    )}

    <PortfolioGrid
      items={config.items}
      columns={config.columns}
      groupByCategory={config.groupByCategory}
    />
  </Section>

  {config.ctaBanner && (
    <CtaBanner
      headline={config.ctaBanner.headline}
      description={config.ctaBanner.description}
      cta={config.ctaBanner.cta}
    />
  )}
</BaseLayout>
