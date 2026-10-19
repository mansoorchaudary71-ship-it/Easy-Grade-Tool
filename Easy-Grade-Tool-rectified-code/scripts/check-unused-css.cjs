#!/usr/bin/env node
/**
 * Lists CSS class selectors in src/styles/tools.css that no TSX/TS/HTML file uses any more.
 * Run after migrating markup to the shared components (.btn, .field, .card ...); delete what it reports.
 *   node scripts/check-unused-css.cjs
 * Needs `postcss` (a Vite dependency) and `postcss-selector-parser` (npm i -D postcss-selector-parser).
 */
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const selParser = require('postcss-selector-parser');
const root = path.resolve(__dirname, '..');
const walk = (d, out = []) => {
  for (const n of fs.readdirSync(d)) {
    const p = path.join(d, n);
    if (fs.statSync(p).isDirectory()) { if (n !== 'node_modules' && n !== 'dist') walk(p, out); }
    else if (/\.(tsx?|html)$/.test(n)) out.push(p);
  }
  return out;
};
const src = [...walk(path.join(root, 'src')), ...walk(path.join(root, 'scripts')), path.join(root, 'index.html')].map((f) => fs.readFileSync(f, 'utf8')).join('\n');
const dyn = [...src.matchAll(/([A-Za-z][\w-]*-)\$\{/g)].map((m) => m[1]);
const live = (c) => src.includes(c) || dyn.some((p) => c.startsWith(p));
const css = fs.readFileSync(path.join(root, 'src/styles/tools.css'), 'utf8');
const dead = new Set();
postcss.parse(css).walkRules((r) => {
  if (r.parent && r.parent.type === 'atrule' && /keyframes$/i.test(r.parent.name)) return;
  r.selectors.forEach((s) => selParser((t) => t.walkClasses((c) => { if (!live(c.value)) dead.add(c.value); })).processSync(s));
});
console.log(dead.size ? `Unused classes in tools.css (${dead.size}):\n  ` + [...dead].sort().join('\n  ') : 'tools.css: no unused classes.');
