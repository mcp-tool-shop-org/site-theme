import { join } from 'node:path';
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

const REPO_ROOT = join(import.meta.dirname, '..', '..');

function docExec(content, exec = true) {
  return checkDoctest({ files: [{ name: 'README.md', content }], pkg, repoRoot: REPO_ROOT, exec });
}

describe('checkDoctest — executable channel (exec)', () => {
  it('does not execute when exec is off (default): +SKIP is ignored', () => {
    expect(docExec('```js\n// doctest: +SKIP\nthrow new Error("nope");\n```', false)).toHaveLength(0);
  });

  it('flags a +SKIP fence example as UNBACKED (not passing)', () => {
    const f = docExec('```js +SKIP\nconsole.log(1);\n```');
    expect(f).toHaveLength(1);
    expect(f[0].severity).toBe('unbacked');
    expect(f[0].channel).toBe('doctest');
  });

  it('flags an inline `// doctest: +SKIP` comment as UNBACKED', () => {
    const f = docExec('```js\n// doctest: +SKIP\nconsole.log(1);\n```');
    expect(f).toHaveLength(1);
    expect(f[0].severity).toBe('unbacked');
  });

  it('passes a runnable builtin-only example with no findings', () => {
    expect(docExec('```js\nimport assert from "node:assert";\nassert.equal(1 + 1, 2);\n```')).toHaveLength(0);
  });

  it('flags a runnable example that throws as CONTRADICTED', () => {
    const f = docExec('```js\nthrow new Error("boom");\n```');
    expect(f).toHaveLength(1);
    expect(f[0].severity).toBe('contradicted');
    expect(f[0].title).toMatch(/fails to run/);
  });

  it('compile-checks (does not run) a third-party-import example: bad syntax is CONTRADICTED', () => {
    const f = docExec('```js\nimport x from "totally-not-installed-xyz";\nconst y = (\n```');
    expect(f).toHaveLength(1);
    expect(f[0].severity).toBe('contradicted');
    expect(f[0].title).toMatch(/fails to compile/);
  });

  it('compile-checks a third-party-import example without installing it: valid syntax passes', () => {
    // If we RAN this it would throw "Cannot find module"; 0 findings proves compile-only.
    expect(docExec('```js\nimport x from "totally-not-installed-xyz";\nconst y = x;\n```')).toHaveLength(0);
  });

  it('does not run a no_run example (would throw, but is only compiled)', () => {
    expect(docExec('```js no_run\nthrow new Error("not executed");\n```')).toHaveLength(0);
  });

  it('runs a CommonJS require() example', () => {
    expect(docExec('```js\nconst assert = require("node:assert");\nassert.equal(1, 1);\n```')).toHaveLength(0);
  });

  it('does not execute non-JS langs (ts stays static-only)', () => {
    expect(docExec('```ts\nthrow new Error("never run");\n```')).toHaveLength(0);
  });

  it('reports the static self-import contradiction and does not also execute the block', () => {
    const f = docExec('```js\nimport { x } from "@scope/tool/nope";\n```');
    expect(f).toHaveLength(1);
    expect(f[0].title).toMatch(/unexported entry/);
  });
});
