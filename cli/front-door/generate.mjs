/**
 * front-door — the generator (`front-door init`).
 *
 * Emits a MINIMAL, verify-clean front-door skeleton for a human to fill — not
 * bulk prose. The evidence says LLM-generated context lowers agent task success
 * (Gloaguen et al., arXiv:2602.11988), so the generator's job is the spine +
 * the evidence layer, with placeholders the human (not the model) completes.
 *
 * Overwrite-guarded: never clobbers an existing file unless `force` is set
 * (the named compensator for this irreversible-ish step — see DESIGN.md). The
 * spine it emits is designed to pass `front-door verify` as-is.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { AGENTS_SPINE, SPINE } from './standard.mjs';

function readName(root) {
  const path = join(root, 'package.json');
  if (existsSync(path)) {
    try {
      return JSON.parse(readFileSync(path, 'utf-8')).name || 'project-name';
    } catch {
      /* fall through */
    }
  }
  return 'project-name';
}

/** llms.txt is a docs-SITE artifact — only meaningful when a docs site exists. */
function hasDocsSite(root) {
  return existsSync(join(root, 'site')) || existsSync(join(root, 'docs'));
}

function buildLlmsTxt(name) {
  return `# ${name}

> One-sentence summary of this project for an LLM reading the docs site.

## Docs

<!-- Add links to your published docs, e.g. [Guide](https://your-site/guide) -->

## Optional

<!-- Lower-priority links an LLM can skip when context is tight -->
`;
}

/**
 * The files `init` would create. README + AGENTS.md always; llms.txt only when a
 * docs site is present. Returns [{ rel, content }].
 */
export function planScaffold(root) {
  const name = readName(root);
  const plan = [
    { rel: 'README.md', content: SPINE.replace(/\{\{name\}\}/g, name) },
    { rel: 'AGENTS.md', content: AGENTS_SPINE },
  ];
  if (hasDocsSite(root)) plan.push({ rel: 'llms.txt', content: buildLlmsTxt(name) });
  return plan;
}

/**
 * @param {{root: string, force?: boolean, dryRun?: boolean}} opts
 * @returns {{created: string[], skipped: string[], dryRun: boolean}}
 */
export function generate({ root, force = false, dryRun = false }) {
  const result = { created: [], skipped: [], dryRun };
  for (const item of planScaffold(root)) {
    const target = join(root, item.rel);
    if (existsSync(target) && !force) {
      result.skipped.push(item.rel);
      continue;
    }
    if (!dryRun) {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, item.content, 'utf-8');
    }
    result.created.push(item.rel);
  }
  return result;
}
