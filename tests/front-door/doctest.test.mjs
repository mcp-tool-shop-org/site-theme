import { describe, expect, it } from 'vitest';
import { checkDoctest } from '../../cli/front-door/doctest.mjs';

const pkg = {
  name: '@scope/tool',
  exports: { '.': './index.js', './front-door': './fd.js', './components/*': './components/*' },
};

function doc(content) {
  return checkDoctest({ files: [{ name: 'README.md', content }], pkg });
}

describe('checkDoctest — self-import export check', () => {
  it('flags an import of an unexported subpath', () => {
    const f = doc('```js\nimport { x } from "@scope/tool/nope";\n```');
    expect(f).toHaveLength(1);
    expect(f[0].severity).toBe('contradicted');
    expect(f[0].channel).toBe('doctest');
  });

  it('accepts a real root import', () => {
    expect(doc('```js\nimport { x } from "@scope/tool";\n```')).toHaveLength(0);
  });

  it('accepts a real subpath export', () => {
    expect(doc('```ts\nimport { verify } from "@scope/tool/front-door";\n```')).toHaveLength(0);
  });

  it('accepts a wildcard-matched subpath', () => {
    expect(doc('```astro\nimport Hero from "@scope/tool/components/Hero.astro";\n```')).toHaveLength(0);
  });

  it('ignores third-party imports', () => {
    expect(doc('```js\nimport React from "react";\n```')).toHaveLength(0);
  });

  it('ignores non-code (bash) blocks', () => {
    expect(doc('```bash\nimport { x } from "@scope/tool/nope"\n```')).toHaveLength(0);
  });

  it('handles require()', () => {
    expect(doc('```js\nconst x = require("@scope/tool/nope");\n```')).toHaveLength(1);
  });

  it('is a no-op when the package declares no exports', () => {
    const files = [{ name: 'README.md', content: '```js\nimport "@x/y/z";\n```' }];
    expect(checkDoctest({ files, pkg: { name: '@x/y' } })).toHaveLength(0);
  });
});
