import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleRequest, TOOLS } from '../../cli/front-door/mcp.mjs';

const CLI = join(import.meta.dirname, '..', '..', 'cli', 'init.mjs');

const dirs = [];
function makeRepo(files) {
  const dir = mkdtempSync(join(tmpdir(), 'fd-mcp-'));
  dirs.push(dir);
  for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content);
  return dir;
}
afterEach(() => {
  while (dirs.length) rmSync(dirs.pop(), { recursive: true, force: true });
});

const CLEAN = {
  'README.md': '# t\n\nA small CLI.\n',
  'AGENTS.md': '# AGENTS\n\nRun `npm test`.\n',
  'package.json': JSON.stringify({ name: 't', scripts: { test: 'x' } }),
};
const DIRTY = {
  'README.md': 'See `src/missing.ts`.\n',
  'AGENTS.md': '# A\n\nNotes.\n',
  'package.json': JSON.stringify({ name: 't' }),
};

function call(name, args, cwd) {
  return handleRequest({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }, { cwd });
}

describe('front-door MCP — handleRequest', () => {
  it('initialize returns serverInfo + tools capability', () => {
    const r = handleRequest({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18' } });
    expect(r.result.serverInfo.name).toBe('front-door');
    expect(r.result.serverInfo.version).toMatch(/^\d+\.\d+\.\d+/);
    expect(r.result.capabilities.tools).toBeDefined();
    expect(r.result.protocolVersion).toBe('2025-06-18');
  });

  it('tools/list advertises front_door_verify with an input schema', () => {
    const r = handleRequest({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
    const names = r.result.tools.map((t) => t.name);
    expect(names).toContain('front_door_verify');
    expect(names).toContain('front_door_standard');
    const verifyTool = r.result.tools.find((t) => t.name === 'front_door_verify');
    expect(verifyTool.inputSchema.properties.runDoctests.type).toBe('boolean');
    expect(TOOLS.length).toBeGreaterThanOrEqual(2);
  });

  it('tools/call front_door_verify returns the structured scorecard (gate PASS) on a clean repo', () => {
    const dir = makeRepo(CLEAN);
    const r = call('front_door_verify', { root: dir });
    expect(r.result.isError).toBe(false);
    expect(r.result.structuredContent.gate.pass).toBe(true);
    expect(r.result.content[0].text).toContain('Gate PASS');
  });

  it('a failing gate is a valid result, not a tool error', () => {
    const dir = makeRepo(DIRTY);
    const r = call('front_door_verify', { root: dir });
    expect(r.result.isError).toBe(false);
    expect(r.result.structuredContent.gate.pass).toBe(false);
    expect(r.result.structuredContent.counts.total).toBeGreaterThan(0);
  });

  it('front_door_verify resolves root from the server cwd when no arg is given', () => {
    const dir = makeRepo(CLEAN);
    const r = call('front_door_verify', {}, dir);
    expect(r.result.structuredContent.gate.pass).toBe(true);
  });

  it('front_door_standard returns the spine', () => {
    const r = call('front_door_standard', {});
    expect(r.result.content[0].text).toContain('README.md spine');
  });

  it('an unknown tool is a tool error (isError), not a protocol error', () => {
    const r = call('front_door_nope', {});
    expect(r.result.isError).toBe(true);
    expect(r.result.content[0].text).toMatch(/Unknown tool/);
  });

  it('an unknown method is a JSON-RPC method-not-found error', () => {
    const r = handleRequest({ jsonrpc: '2.0', id: 9, method: 'resources/list' });
    expect(r.error.code).toBe(-32601);
  });

  it('a notification gets no response', () => {
    expect(handleRequest({ jsonrpc: '2.0', method: 'notifications/initialized' })).toBeNull();
  });
});

describe('front-door MCP — stdio loop (spawn smoke test)', () => {
  it('answers an initialize handshake over stdio via `front-door mcp`', () => {
    const req = `${JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18' } })}\n`;
    const res = spawnSync('node', [CLI, 'front-door', 'mcp'], { input: req, encoding: 'utf-8', timeout: 15000 });
    const line = res.stdout.trim().split('\n').filter(Boolean)[0];
    const parsed = JSON.parse(line);
    expect(parsed.result.serverInfo.name).toBe('front-door');
  });
});
