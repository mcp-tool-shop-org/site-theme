---
import '../styles/global.css';
import BaseLayout from '@mcptoolshop/site-theme/components/BaseLayout.astro';
import DocLayout from '@mcptoolshop/site-theme/components/DocLayout.astro';
import ContentSection from '@mcptoolshop/site-theme/components/ContentSection.astro';
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
  <DocLayout sidebar={config.sidebar}>
    {config.sections.map((s) => (
      <ContentSection id={s.id} title={s.title} content={s.content} />
    ))}
  </DocLayout>
</BaseLayout>
