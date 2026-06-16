import { describe, expect, it } from 'vitest';
import {
  classifyBadge,
  extractBadges,
  extractCodeBlocks,
  extractCommands,
  extractInlineCode,
  extractLinks,
  findDuplication,
  isBadge,
  looksLikePath,
} from '../../cli/front-door/extract.mjs';

describe('extractCodeBlocks', () => {
  it('captures fenced blocks with language and start line', () => {
    const md = 'intro\n\n```bash\nnpm install\nnpm run build\n```\n';
    const blocks = extractCodeBlocks(md);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].lang).toBe('bash');
    expect(blocks[0].code).toContain('npm run build');
    expect(blocks[0].startLine).toBe(4);
  });

  it('ignores inline backticks outside fences', () => {
    expect(extractCodeBlocks('see `foo` here')).toHaveLength(0);
  });
});

describe('looksLikePath', () => {
  it('accepts repo dir prefixes and slashed code paths', () => {
    expect(looksLikePath('src/index.ts')).toBe(true);
    expect(looksLikePath('./cli/init.mjs')).toBe(true);
  });

  it('rejects bare filenames, npm specifiers, urls, and prose', () => {
    expect(looksLikePath('package.json')).toBe(false);
    expect(looksLikePath('llms.txt')).toBe(false);
    expect(looksLikePath('global.css')).toBe(false);
    expect(looksLikePath('@astrojs/starlight')).toBe(false);
    expect(looksLikePath('https://example.com/x')).toBe(false);
    expect(looksLikePath('some thing')).toBe(false);
  });
});

describe('extractInlineCode + extractLinks', () => {
  it('extracts inline code with line numbers', () => {
    const codes = extractInlineCode('a\nuse `src/x.ts` now');
    expect(codes[0]).toMatchObject({ text: 'src/x.ts', line: 2 });
  });

  it('extracts links and images, not those inside fences', () => {
    const links = extractLinks('[docs](./docs/index.md) and ![b](https://img.shields.io/x.svg)');
    expect(links.find((l) => !l.isImage).target).toBe('./docs/index.md');
    expect(links.find((l) => l.isImage).target).toContain('shields.io');
  });
});

describe('badges', () => {
  it('detects shields badges and classifies status vs decorative', () => {
    expect(isBadge('https://img.shields.io/badge/x')).toBe(true);
    expect(classifyBadge('build', 'https://img.shields.io/x/ci.svg')).toBe('status');
    expect(classifyBadge('license MIT', 'https://img.shields.io/badge/license-MIT')).toBe('decorative');
  });

  it('extractBadges tags image badges', () => {
    const links = extractLinks('![CI](https://img.shields.io/github/actions/workflow/status/o/r/ci.yml)');
    const badges = extractBadges(links);
    expect(badges).toHaveLength(1);
    expect(badges[0].kind).toBe('status');
  });
});

describe('extractCommands', () => {
  it('flags explicit run scripts and tags non-run subcommands', () => {
    const blocks = extractCodeBlocks('```bash\nnpm run build\nnpm install\n```');
    const cmds = extractCommands(blocks);
    expect(cmds.find((c) => c.explicitRun).script).toBe('build');
    expect(cmds.some((c) => c.script === 'install' && !c.explicitRun)).toBe(true);
  });
});

describe('findDuplication', () => {
  it('finds substantial lines shared between two docs', () => {
    const line = 'This is a sufficiently long shared sentence about the tool.';
    expect(findDuplication(`# R\n${line}\n`, `# A\n${line}\n`)).toHaveLength(1);
  });

  it('ignores short lines', () => {
    expect(findDuplication('short\n', 'short\n')).toHaveLength(0);
  });
});
