---
import '../styles/global.css';
import BaseLayout from '@mcptoolshop/site-theme/components/BaseLayout.astro';
import Hero from '@mcptoolshop/site-theme/components/Hero.astro';
import Section from '@mcptoolshop/site-theme/components/Section.astro';
import CodeCardGrid from '@mcptoolshop/site-theme/components/CodeCardGrid.astro';
import ApiList from '@mcptoolshop/site-theme/components/ApiList.astro';
import FeatureGrid from '@mcptoolshop/site-theme/components/FeatureGrid.astro';
import { config } from '../site-config';

const nav = [
  { href: '#quickstart', label: 'Quickstart' },
  ...(config.commands || config.commandGroups ? [{ href: '#commands', label: 'Commands' }] : []),
  ...(config.workflow ? [{ href: '#workflow', label: 'Workflow' }] : []),
  ...(config.proof ? [{ href: '#proof', label: 'Proof' }] : []),
  ...(config.integration ? [{ href: '#integration', label: 'Integration' }] : []),
];

const commandApis = config.commandGroups
  ? config.commandGroups.flatMap((g) =>
      g.commands.map((c) => ({
        signature: c.usage ?? c.name,
        description: `[${g.group}] ${c.description}`,
      }))
    )
  : (config.commands ?? []).map((c) => ({
      signature: c.usage ?? c.name,
      description: c.description,
    }));
---

<BaseLayout
  title={config.title}
  description={config.description}
  logoBadge={config.logoBadge}
  brandName={config.brandName}
  repoUrl={config.repoUrl}
  npmUrl={config.npmUrl}
  footerText={config.footerText}
  nav={nav}
>
  <Hero {...config.hero} />

  <Section id="quickstart" title="Quickstart" subtitle="Up and running in three steps.">
    <CodeCardGrid cards={config.quickstart} />
  </Section>

  {commandApis.length > 0 && (
    <Section id="commands" title="Commands" subtitle="Full command surface.">
      <ApiList apis={commandApis} />
    </Section>
  )}

  {config.workflow && (
    <Section id="workflow" title={config.workflow.title} subtitle={config.workflow.description}>
      <CodeCardGrid cards={config.workflow.steps} />
    </Section>
  )}

  {config.proof && (
    <Section id="proof" title="Proof" subtitle="Verified and tested.">
      <FeatureGrid features={[
        ...(config.proof.version ? [{ title: 'Version', desc: config.proof.version }] : []),
        ...(config.proof.tests ? [{ title: 'Tests', desc: config.proof.tests }] : []),
        ...(config.proof.ci ? [{ title: 'CI', desc: config.proof.ci }] : []),
        ...(config.proof.dogfood ? [{ title: 'Dogfood', desc: config.proof.dogfood }] : []),
      ]} />
    </Section>
  )}

  {config.integration && (
    <Section
      id="integration"
      title={config.integration.title ?? 'Integration'}
      subtitle={config.integration.subtitle}
    >
      <CodeCardGrid cards={config.integration.cards} />
    </Section>
  )}
</BaseLayout>
