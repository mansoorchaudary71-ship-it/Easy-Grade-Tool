#!/usr/bin/env node
/**
 * Sends the security headers from public/_headers (X-Frame-Options, X-Content-Type-Options,
 * Referrer-Policy, Content-Security-Policy, ...) on every response, while the site stays on
 * GitHub Pages. GitHub Pages ignores public/_headers, so the headers are added at the Cloudflare
 * edge with one "Modify Response Header" Transform Rule.
 *
 * Needs: the domain on Cloudflare with the www record Proxied (orange cloud).
 *
 *   CLOUDFLARE_API_TOKEN=...  token with Zone > Transform Rules > Edit (and Zone > Zone > Read)
 *   CLOUDFLARE_ZONE_ID=...    Zone ID (domain Overview page, right sidebar)
 *
 *   node scripts/cloudflare-security-headers.mjs --dry-run   print the rule, change nothing
 *   node scripts/cloudflare-security-headers.mjs             create or update the rule
 *   node scripts/cloudflare-security-headers.mjs --check     test the live site for the four headers
 *
 * Only the rule named below is touched; other rules in the same phase are kept.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RULE_REF = 'easygradetool-security-headers';
const SITE = process.env.SITE_URL || 'https://www.easygradetool.com';
const HOSTNAME = new URL(SITE).hostname;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Read the `/*` block of public/_headers so there is one source of truth. */
function readHeaders() {
  const lines = fs.readFileSync(path.join(root, 'public', '_headers'), 'utf8').split(/\r?\n/);
  const out = {};
  let inGlobal = false;
  for (const raw of lines) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (!/^\s/.test(raw)) { inGlobal = raw.trim() === '/*'; continue; }
    if (!inGlobal) continue;
    const i = raw.indexOf(':');
    if (i > 0) out[raw.slice(0, i).trim()] = raw.slice(i + 1).trim();
  }
  for (const h of ['X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'Content-Security-Policy']) {
    if (!out[h]) throw new Error(`public/_headers is missing ${h} under "/*"`);
  }
  return out;
}

function buildRule(headers) {
  const set = {};
  for (const [name, value] of Object.entries(headers)) set[name] = { operation: 'set', value };
  return {
    ref: RULE_REF,
    description: 'Security headers (from public/_headers)',
    expression: `(http.host eq "${HOSTNAME}")`,
    action: 'rewrite',
    action_parameters: { headers: set },
    enabled: true,
  };
}

async function check() {
  const urls = [`${SITE}/`, `${SITE}/gpa-calculator/`, `${SITE}/grading-scale/100-questions/`, `${SITE}/favicon.png`];
  const need = {
    'x-frame-options': (v) => /^(deny|sameorigin)$/i.test(v),
    'x-content-type-options': (v) => /^nosniff$/i.test(v),
    'referrer-policy': (v) => /(strict-origin-when-cross-origin|no-referrer|strict-origin|no-referrer-when-downgrade)/i.test(v),
    'content-security-policy': (v) => v.length > 0,
  };
  let bad = 0;
  for (const u of urls) {
    const res = await fetch(u, { method: 'HEAD', redirect: 'follow' });
    const miss = Object.entries(need).filter(([h, ok]) => !ok(res.headers.get(h) || '')).map(([h]) => h);
    console.log(`${miss.length ? 'FAIL' : 'ok  '} ${res.status} ${u}${miss.length ? '  missing: ' + miss.join(', ') : ''}`);
    if (miss.length && res.status < 400) bad++;
  }
  process.exit(bad ? 1 : 0);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--check')) return check();

  const rule = buildRule(readHeaders());
  if (args.includes('--dry-run')) {
    console.log(JSON.stringify(rule, null, 2));
    return;
  }

  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zone = process.env.CLOUDFLARE_ZONE_ID;
  if (!token || !zone) throw new Error('Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID (or use --dry-run).');

  const base = `https://api.cloudflare.com/client/v4/zones/${zone}/rulesets/phases/http_response_headers_transform/entrypoint`;
  const api = async (method, body) => {
    const res = await fetch(base, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    return { res, json };
  };

  // Keep any rules that already exist in this phase; replace only ours.
  const current = await api('GET');
  let existing = [];
  if (current.res.ok) existing = current.json.result?.rules || [];
  else if (current.res.status !== 404) throw new Error(`Cloudflare GET failed: ${JSON.stringify(current.json.errors)}`);

  const keep = existing
    .filter((r) => r.ref !== RULE_REF)
    .map(({ id, version, last_updated, categories, logging, ...r }) => r);
  const put = await api('PUT', { rules: [...keep, rule] });
  if (!put.res.ok) throw new Error(`Cloudflare PUT failed: ${JSON.stringify(put.json.errors)}`);

  console.log(`Rule "${RULE_REF}" saved (${keep.length} other rule(s) kept).`);
  console.log('Wait about a minute, then run: node scripts/cloudflare-security-headers.mjs --check');
}

main().catch((e) => { console.error(e.message); process.exit(1); });
