import { describe, expect, it } from 'vitest';
import { checkMinimality, fleschReadingEase } from '../../cli/front-door/minimality.mjs';

function only(name, content) {
  return checkMinimality({ files: [{ name, content }] });
}

describe('checkMinimality — targeting', () => {
  it('ignores README.md (only agent-context files are scored)', () => {
    const long = `# R\n${'a line of readme text here padding it out.\n'.repeat(300)}`;
    expect(only('README.md', long)).toHaveLength(0);
  });
});

describe('checkMinimality — length', () => {
  it('flags a long AGENTS.md', () => {
    const long = `# AGENTS\n${'Do the thing in a scoped way right here.\n'.repeat(200)}`;
    const f = only('AGENTS.md', long);
    const lenFinding = f.find((x) => x.title.includes('is long'));
    expect(lenFinding).toBeDefined();
    expect(lenFinding.severity).toBe('bloat');
  });

  it('does not flag a short AGENTS.md', () => {
    const f = only('AGENTS.md', '# AGENTS\n\nRun `npm test`. Keep changes small.\n');
    expect(f.some((x) => x.title.includes('is long'))).toBe(false);
  });
});

describe('checkMinimality — directives', () => {
  it('flags excessive broad directives', () => {
    const many = `# AGENTS\n${'You must always do this and never do that for every file.\n'.repeat(5)}`;
    expect(only('AGENTS.md', many).some((x) => x.title.includes('broad directives'))).toBe(true);
  });
});

describe('fleschReadingEase', () => {
  it('returns null for too little prose', () => {
    expect(fleschReadingEase('# Hi\n`code`')).toBeNull();
  });

  it('scores simple prose higher than dense prose', () => {
    const simple = 'The cat sat on the mat. The dog ran fast. We go home now. It is a nice day today. '.repeat(2);
    const dense =
      'Notwithstanding the aforementioned considerations, the implementation necessitates comprehensive architectural reconfiguration. '.repeat(
        3,
      );
    expect(fleschReadingEase(simple)).toBeGreaterThan(fleschReadingEase(dense));
  });
});
