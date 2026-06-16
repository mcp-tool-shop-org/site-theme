import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { checkAttestation } from '../../cli/front-door/attestation.mjs';

const TMP = join(import.meta.dirname, '..', '.test-tmp-fd-attest');

beforeEach(() => {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(join(TMP, '.github', 'workflows'), { recursive: true });
});

afterEach(() => rmSync(TMP, { recursive: true, force: true }));

function att(content) {
  return checkAttestation({ files: [{ name: 'README.md', content }], repoRoot: TMP });
}

describe('checkAttestation', () => {
  it('flags a provenance claim with no evidence', () => {
    const f = att('## Security\n\nEvery release ships with SLSA provenance.\n');
    expect(f).toHaveLength(1);
    expect(f[0].severity).toBe('unbacked');
    expect(f[0].channel).toBe('attestation');
  });

  it('passes when a workflow publishes with --provenance', () => {
    writeFileSync(
      join(TMP, '.github', 'workflows', 'release.yml'),
      'jobs:\n  publish:\n    steps:\n      - run: npm publish --provenance\n',
    );
    expect(att('Every release ships with SLSA provenance.')).toHaveLength(0);
  });

  it('passes with cosign/sigstore signing evidence', () => {
    writeFileSync(join(TMP, '.github', 'workflows', 'sign.yml'), 'steps:\n  - run: cosign sign ...\n');
    expect(att('Artifacts are signed with Sigstore.')).toHaveLength(0);
  });

  it('does not fire when there is no provenance claim', () => {
    expect(att('# Tool\n\nA simple CLI with no security claims.\n')).toHaveLength(0);
  });
});
