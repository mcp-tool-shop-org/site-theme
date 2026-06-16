#!/usr/bin/env node
/**
 * front-door — MCP server (agent-callable surface).
 *
 * Exposes the verifier as Model Context Protocol tools so an agent can audit a
 * repo's front door and receive the structured scorecard. Deliberately
 * HAND-ROLLED over stdio (newline-delimited JSON-RPC 2.0) with ZERO runtime
 * dependencies — front-door is a zero-dep toolkit, and the MCP SDK + zod would
 * weigh down the core package. The wire protocol an agent speaks is identical
 * either way (initialize · tools/list · tools/call). See DESIGN.md (slice 12).
 *
 * Tools:
 *   front_door_verify   — verify({ root, runDoctests }) -> structured scorecard
 *   front_door_standard — the front-door spine (README + AGENTS.md)
 *
 * Launch: `site-theme front-door mcp`  (or `node cli/front-door/mcp.mjs`).
 *
 * --- Standards compliance (memory/workflow_standards.md) ---
 * PIN_PER_STEP              2 — deterministic dispatch; same request -> same response (verify is pure).
 * ANDON_AUTHORITY          2 — the scorecard gate (pass:false) is surfaced verbatim; the agent halts on it.
 * NAMED_COMPENSATORS       n/a — read-only surface; verify writes nothing to the repo, server holds no state.
 * DECOMPOSE_BY_SECRETS     3 — separate zero-dep module; hand-rolled stdio keeps the core dependency-light.
 * UNCERTAINTY_GATED_HUMANS 2 — UNVERIFIABLE findings pass through unchanged; the agent/human decides.
 * EXTERNAL_VERIFIER        2 — an out-of-process tool checks the agent's front-door claims, not the agent itself.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderStandard } from './standard.mjs';
import { verify } from './verify.mjs';

const SERVER_NAME = 'front-door';
const PROTOCOL_VERSION = '2025-06-18';
const VERSION = (() => {
  try {
    return JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')).version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
})();

export const TOOLS = [
  {
    name: 'front_door_verify',
    description:
      "Verify a repo's AI-native front door (README / AGENTS.md / llms.txt / CLAUDE.md) and return the " +
      'structured scorecard: risk-ordered findings, four-bucket counts (verified/contradicted/missing/' +
      'unverifiable), and a pass/fail gate. Read-only unless runDoctests is set.',
    inputSchema: {
      type: 'object',
      properties: {
        root: {
          type: 'string',
          description: 'Repo root to verify. Defaults to the server working directory.',
        },
        runDoctests: {
          type: 'boolean',
          description:
            'Also compile/run fenced JS examples (rustdoc-style). Executes code in child processes; off by default.',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'front_door_standard',
    description:
      'Print the front-door standard spine — the minimal README + AGENTS.md structure the verifier scores against.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
];

function result(id, res) {
  return { jsonrpc: '2.0', id: id ?? null, result: res };
}

function errorResp(id, code, message) {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message } };
}

/** A tool that executed but produced an error — surfaced to the model, not a protocol error. */
function toolError(id, message) {
  return result(id, { content: [{ type: 'text', text: message }], isError: true });
}

function handleToolCall(id, params, cwd) {
  const name = params?.name;
  const args = params?.arguments ?? {};

  if (name === 'front_door_verify') {
    let scorecard;
    try {
      const root = args.root ? resolve(cwd, String(args.root)) : cwd;
      scorecard = verify({ root, runDoctests: Boolean(args.runDoctests) });
    } catch (e) {
      return toolError(id, `front_door_verify failed: ${e?.message ?? e}`);
    }
    const summary = `Gate ${scorecard.gate.pass ? 'PASS' : 'FAIL'} — ${scorecard.gate.reason} (${
      scorecard.counts.total
    } finding(s)).`;
    return result(id, {
      content: [{ type: 'text', text: `${summary}\n\n${JSON.stringify(scorecard, null, 2)}` }],
      structuredContent: scorecard,
      isError: false,
    });
  }

  if (name === 'front_door_standard') {
    return result(id, { content: [{ type: 'text', text: renderStandard() }], isError: false });
  }

  return toolError(id, `Unknown tool: ${name}. Available: ${TOOLS.map((t) => t.name).join(', ')}`);
}

/**
 * Pure JSON-RPC dispatch: a parsed request in, a response object out (or null
 * for notifications, which get no reply). Testable without spawning the loop.
 * @param {object} req parsed JSON-RPC request
 * @param {{cwd?: string}} [opts]
 */
export function handleRequest(req, opts = {}) {
  const cwd = opts.cwd ?? process.cwd();
  if (!req || typeof req !== 'object') return errorResp(null, -32600, 'Invalid Request');
  const { id, method, params } = req;
  if (typeof method !== 'string') return errorResp(id ?? null, -32600, 'Invalid Request: missing method');
  if (method.startsWith('notifications/')) return null; // notifications expect no response

  switch (method) {
    case 'initialize':
      return result(id, {
        protocolVersion: typeof params?.protocolVersion === 'string' ? params.protocolVersion : PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: SERVER_NAME, version: VERSION },
      });
    case 'ping':
      return result(id, {});
    case 'tools/list':
      return result(id, { tools: TOOLS });
    case 'tools/call':
      return handleToolCall(id, params, cwd);
    default:
      return errorResp(id ?? null, -32601, `Method not found: ${method}`);
  }
}

/** Start the stdio JSON-RPC loop. Reads newline-delimited requests on stdin. */
export function startServer() {
  let buf = '';
  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', (chunk) => {
    buf += chunk;
    let nl = buf.indexOf('\n');
    while (nl >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (line) {
        let req;
        try {
          req = JSON.parse(line);
        } catch {
          send(errorResp(null, -32700, 'Parse error'));
          nl = buf.indexOf('\n');
          continue;
        }
        let resp;
        try {
          resp = handleRequest(req, { cwd: process.cwd() });
        } catch (e) {
          resp = errorResp(req?.id ?? null, -32603, `Internal error: ${e?.message ?? e}`);
        }
        if (resp) send(resp);
      }
      nl = buf.indexOf('\n');
    }
  });
  process.stdin.on('end', () => {
    // Flush any buffered stdout before exiting (POSIX pipes are async).
    if (process.stdout.writableLength === 0) process.exit(0);
    else process.stdout.once('drain', () => process.exit(0));
  });
  const shutdown = () => process.exit(0);
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.stderr.write(`front-door MCP server (v${VERSION}) running on stdio\n`);
}

function send(obj) {
  process.stdout.write(`${JSON.stringify(obj)}\n`);
}

// Auto-start only when invoked directly (not when imported by the CLI or tests).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}
