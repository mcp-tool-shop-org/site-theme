---
import '../styles/global.css';
import BaseLayout from '@mcptoolshop/site-theme/components/BaseLayout.astro';
import Hero from '@mcptoolshop/site-theme/components/Hero.astro';
import Section from '@mcptoolshop/site-theme/components/Section.astro';
import FeatureGrid from '@mcptoolshop/site-theme/components/FeatureGrid.astro';
import DataTable from '@mcptoolshop/site-theme/components/DataTable.astro';
import CodeCardGrid from '@mcptoolshop/site-theme/components/CodeCardGrid.astro';
import ApiList from '@mcptoolshop/site-theme/components/ApiList.astro';
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
  nav={config.sections.map(s => ({ href: `#${s.id}`, label: s.title }))}
>
  {config.hero.imageUrl && (
    <div style="padding:2rem 1.5rem 0;max-width:1200px;margin:0 auto">
      <img src={config.hero.imageUrl} alt={config.title} width="540" height="540" style="border-radius:12px;display:block" />
    </div>
  )}

  <Hero {...config.hero} />

  {config.sections.map((s) => (
    <Section id={s.id} title={s.title} subtitle={s.subtitle}>
      {s.kind === 'features' && <FeatureGrid features={s.features} />}
      {s.kind === 'data-table' && <DataTable columns={s.columns} rows={s.rows} />}
      {s.kind === 'code-cards' && <CodeCardGrid cards={s.cards} />}
      {s.kind === 'api' && <ApiList apis={s.apis} />}
    </Section>
  ))}
</BaseLayout>
