import { describe, expect, it } from 'vitest';
import { ARMS, buildArmWorkspace, matchesAny, stripDocs } from '../../../cli/front-door/ablation/arms.mjs';

const BASE = {
  'src/widget.mjs': 'export const x = 1;\n',
  'README.md': '# readme\n',
  'docs/guide.md': '# guide\n',
  'tests/x.test.mjs': 'test\n',
};
const FRONT_DOOR = { 'AGENTS.md': '# AGENTS\n', 'llms.txt': 'llms\n' };

describe('glob matching', () => {
  it('matches markdown anywhere and docs subtrees', () => {
    expect(matchesAny('README.md', ['**/*.md'])).toBe(true);
    expect(matchesAny('docs/a/b.md', ['**/*.md'])).toBe(true);
    expect(matchesAny('docs/deep/file.txt', ['docs/**'])).toBe(true);
    expect(matchesAny('src/widget.mjs', ['**/*.md', 'docs/**'])).toBe(false);
  });
});

describe('stripDocs', () => {
  it('removes prose, keeps source and tests', () => {
    const out = stripDocs(BASE);
    expect(out['src/widget.mjs']).toBeDefined();
    expect(out['tests/x.test.mjs']).toBeDefined();
    expect(out['README.md']).toBeUndefined();
    expect(out['docs/guide.md']).toBeUndefined();
  });
});

describe('buildArmWorkspace', () => {
  const arm = (id) => ARMS.find((a) => a.id === id);

  it('A is the repo as-is (no front door, no strip)', () => {
    const ws = buildArmWorkspace({ baseFiles: BASE, frontDoor: FRONT_DOOR, arm: arm('A') });
    expect(ws['README.md']).toBeDefined();
    expect(ws['AGENTS.md']).toBeUndefined();
  });

  it('B adds the front door, keeps the docs', () => {
    const ws = buildArmWorkspace({ baseFiles: BASE, frontDoor: FRONT_DOOR, arm: arm('B') });
    expect(ws['README.md']).toBeDefined();
    expect(ws['AGENTS.md']).toBe('# AGENTS\n');
    expect(ws['llms.txt']).toBeDefined();
  });

  it('C strips the docs but keeps the front door and the code', () => {
    const ws = buildArmWorkspace({ baseFiles: BASE, frontDoor: FRONT_DOOR, arm: arm('C') });
    expect(ws['README.md']).toBeUndefined();
    expect(ws['docs/guide.md']).toBeUndefined();
    expect(ws['src/widget.mjs']).toBeDefined();
    expect(ws['AGENTS.md']).toBe('# AGENTS\n'); // front door survives the strip (re-added after)
  });

  it('does not mutate the inputs', () => {
    const snapshot = JSON.stringify(BASE);
    buildArmWorkspace({ baseFiles: BASE, frontDoor: FRONT_DOOR, arm: arm('C') });
    expect(JSON.stringify(BASE)).toBe(snapshot);
  });
});
