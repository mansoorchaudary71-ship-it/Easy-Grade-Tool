/**
 * Draws every page figure as an SVG into public/images/figures/.
 * Run:  npm run figures
 * Sources: getRegistryFigures() for the 69 registry pages and CORE_FIGURES for the ten component pages.
 * Re-run after changing any page's example, feature list, lookup table or related links, then commit the SVGs.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOOL_PAGE_LIST } from '../src/data/toolPages';
import { CORE_FIGURES } from '../src/data/coreFigures';
import { getRegistryFigures, FIGURE_WIDTH as W, FIGURE_HEIGHT as H, type FigureSpec } from '../src/data/pageFigures';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'figures');
const FONT = "font-family=\"Segoe UI, Helvetica, Arial, sans-serif\"";
const TEAL = '#0f766e';
const INK = '#0f172a';
const MUTED = '#475569';
const LINE = '#cbd5e1';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clip = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n - 1).trimEnd()}…`);

function wrap(text: string, max: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = clip(kept[maxLines - 1] + '…', max);
    return kept;
  }
  return lines;
}

const text = (x: number, y: number, s: string, size: number, fill = INK, weight = 400, anchor = 'start', extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}" ${FONT} ${extra}>${esc(s)}</text>`;

function frame(spec: FigureSpec, body: string): string {
  const single = spec.title.length <= 44;
  const titleLines = single ? [spec.title] : wrap(spec.title, 52, 2);
  const titleSvg = titleLines
    .map((l, i) => (single ? text(40, 52, l, 28, '#ffffff', 700) : text(40, 40 + i * 28, l, 23, '#ffffff', 700)))
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
<title id="t">${esc(spec.title)}</title>
<desc id="d">${esc(spec.alt)}</desc>
<rect width="${W}" height="${H}" rx="18" fill="#f8fafc"/>
<path d="M0 18a18 18 0 0 1 18-18h${W - 36}a18 18 0 0 1 18 18v92H0z" fill="${TEAL}"/>
${titleSvg}
${spec.subtitle ? text(40, 98, spec.subtitle, 15, '#99f6e4', 600, 'start', 'letter-spacing="1"') : ''}
${body}
${text(W - 30, H - 14, 'easygradetool.com', 13, '#94a3b8', 600, 'end')}
</svg>
`;
}

function renderExample(s: FigureSpec): string {
  const rows = (s.rows ?? []).slice(0, 6);
  const step = rows.length > 5 ? 40 : 46;
  const body = rows
    .map((r, i) => {
      const y = 150 + i * step;
      const last = i === rows.length - 1;
      return `<rect x="30" y="${y - 26}" width="${W - 60}" height="${step - 6}" rx="8" fill="${last ? '#ccfbf1' : '#ffffff'}" stroke="${LINE}"/>
${text(46, y - 2, clip(r.label, 46), 18, MUTED, 500)}${text(W - 46, y - 2, clip(r.value, 30), 18, INK, 700, 'end')}`;
    })
    .join('\n');
  const foot = s.footer ? wrap(s.footer, 92, 2).map((l, i) => text(40, H - 40 + i * 18, l, 14, MUTED)).join('') : '';
  return frame(s, body + foot);
}

function renderChecklist(s: FigureSpec): string {
  const items = (s.items ?? []).slice(0, 6);
  let y = 150;
  const body = items
    .map((it) => {
      const lines = wrap(it, 54, 2);
      const cy = y;
      const block = `<circle cx="58" cy="${cy - 7}" r="14" fill="${TEAL}"/>
<path d="M51 ${cy - 7}l5 5 9-10" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
${lines.map((l, i) => text(86, cy - 1 + i * 24, l, 20, INK, 500)).join('')}`;
      y += lines.length > 1 ? 62 : 50;
      return block;
    })
    .join('\n');
  return frame(s, body);
}

function renderTable(s: FigureSpec): string {
  const t = s.table!;
  const cols = t.columns.length;
  const x0 = 30;
  const tw = W - 60;
  const cw = tw / cols;
  const maxChars = Math.max(6, Math.floor(cw / 10.5));
  const rowH = t.rows.length > 6 ? 36 : 40;
  let y = 128;
  let out = `<rect x="${x0}" y="${y}" width="${tw}" height="${rowH}" rx="8" fill="#e2e8f0"/>`;
  t.columns.forEach((c, i) => {
    out += text(x0 + 14 + i * cw, y + rowH / 2 + 6, clip(c, maxChars), 15, INK, 700);
  });
  t.rows.forEach((r, ri) => {
    y += rowH;
    out += `<rect x="${x0}" y="${y}" width="${tw}" height="${rowH}" fill="${ri % 2 ? '#f1f5f9' : '#ffffff'}" stroke="${LINE}" stroke-width="0.5"/>`;
    r.forEach((c, i) => {
      out += text(x0 + 14 + i * cw, y + rowH / 2 + 6, clip(c, maxChars), 15, i === 0 ? INK : MUTED, i === 0 ? 700 : 500);
    });
  });
  return frame(s, out);
}

function renderFormula(s: FigureSpec): string {
  const lines = (s.lines ?? []).slice(0, 3);
  let y = 175;
  let body = '';
  const boxH = 30 + lines.length * 44;
  body += `<rect x="30" y="130" width="${W - 60}" height="${boxH}" rx="12" fill="#ffffff" stroke="${TEAL}" stroke-width="2"/>`;
  lines.forEach((l, i) => {
    const size = l.length > 52 ? 20 : 25;
    body += text(W / 2, y + i * 44, clip(l, 64), size, INK, 700, 'middle', 'font-family="Consolas, Menlo, monospace"');
  });
  y = 130 + boxH + 44;
  (s.rows ?? []).slice(0, 3).forEach((r, i) => {
    body += `<rect x="30" y="${y - 28 + i * 52}" width="${W - 60}" height="44" rx="8" fill="#ccfbf1" stroke="${LINE}"/>`;
    body += text(46, y + i * 52, clip(r.label, 40), 18, MUTED, 500);
    body += text(W - 46, y + i * 52, clip(r.value, 40), 18, INK, 700, 'end');
  });
  return frame(s, body);
}

function renderMap(s: FigureSpec): string {
  const around = (s.around ?? []).slice(0, 5);
  const cx = W / 2;
  const cy = 300;
  let out = '';
  const pts = around.map((_, i) => {
    const a = Math.PI + (Math.PI * (i + 0.5)) / around.length;
    return { x: cx + 310 * Math.cos(a), y: cy + 130 * Math.sin(a) + 10 };
  });
  pts.forEach((p) => (out += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="${LINE}" stroke-width="2"/>`));
  const cl = wrap(s.center ?? '', 22, 2);
  out += `<rect x="${cx - 125}" y="${cy - 32}" width="250" height="64" rx="32" fill="${TEAL}"/>`;
  cl.forEach((l, i) => (out += text(cx, cy + 6 - (cl.length - 1) * 10 + i * 21, l, 18, '#fff', 700, 'middle')));
  pts.forEach((p, i) => {
    const ll = wrap(around[i], 15, 2);
    out += `<rect x="${p.x - 78}" y="${p.y - 27}" width="156" height="54" rx="27" fill="#fff" stroke="${TEAL}" stroke-width="2"/>`;
    ll.forEach((l, k) => (out += text(p.x, p.y + 5 - (ll.length - 1) * 9 + k * 18, l, 14, INK, 600, 'middle')));
  });
  return frame(s, out);
}

function render(s: FigureSpec): string {
  switch (s.kind) {
    case 'example': return renderExample(s);
    case 'checklist': return renderChecklist(s);
    case 'table': return renderTable(s);
    case 'formula': return renderFormula(s);
    case 'map': return renderMap(s);
  }
}

mkdirSync(OUT, { recursive: true });
const all: FigureSpec[] = [
  ...TOOL_PAGE_LIST.flatMap((e) => getRegistryFigures(e)),
  ...Object.values(CORE_FIGURES).flatMap((c) => c.figures),
];
const wanted = new Set(all.map((f) => f.file.replace(/^figures\//, '')));
for (const f of all) writeFileSync(join(OUT, f.file.replace(/^figures\//, '')), render(f), 'utf8');
if (existsSync(OUT)) for (const f of readdirSync(OUT)) if (f.endsWith('.svg') && !wanted.has(f)) unlinkSync(join(OUT, f));
console.log(`Wrote ${all.length} figures to public/images/figures/`);
