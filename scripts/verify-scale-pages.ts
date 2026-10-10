/**
 * Sanity checks for the generated pages (/grading-scale/N-questions/, /grading-scale/, /average-grade-calculator/).
 * Run with: npx tsx scripts/verify-scale-pages.ts   (also part of `npm run verify:math`)
 */
import { TOOL_PAGE_LIST, TOOL_PAGES } from '../src/data/toolPages';
import { GRADING_SCALE_SIZES, gradingScalePath } from '../src/data/gradingScaleSizes';
import { SITEMAP_VARIATIONS } from '../src/data/seoConfig';
import { LEGACY_REDIRECTS } from '../src/data/legacyRedirects';

let failed = 0;
function check(name: string, ok: boolean, detail = '') {
  if (ok) console.log(`✅ ${name}`);
  else {
    failed++;
    console.error(`❌ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const titles = new Map<string, string>();
const descriptions = new Map<string, string>();
const h1s = new Map<string, string>();
const dupes: string[] = [];
for (const e of TOOL_PAGE_LIST) {
  for (const [map, value, label] of [
    [titles, e.title, 'title'],
    [descriptions, e.metaDescription, 'description'],
    [h1s, e.h1, 'h1'],
  ] as const) {
    if (map.has(value)) dupes.push(`${label}: ${e.slug} = ${map.get(value)}`);
    map.set(value, e.slug);
  }
}
check('every page has a unique title, description and H1', dupes.length === 0, dupes.slice(0, 3).join('; '));
check('all titles are 65 characters or fewer', TOOL_PAGE_LIST.every((e) => e.title.length <= 65), TOOL_PAGE_LIST.filter((e) => e.title.length > 65).map((e) => e.slug).join(', '));
check('all meta descriptions are 175 characters or fewer', TOOL_PAGE_LIST.every((e) => e.metaDescription.length <= 175));
check('every page has at least 3 FAQs and 2 sections', TOOL_PAGE_LIST.every((e) => e.faqs.length >= 3 && e.sections.length >= 2));
check('every size has a page', GRADING_SCALE_SIZES.every((n) => !!TOOL_PAGES[`grading-scale/${n}-questions`]));
check('page paths match slugs', TOOL_PAGE_LIST.every((e) => e.path === `/${e.slug}/`));

const sitemapPaths = new Set(SITEMAP_VARIATIONS.map((s) => s.path));
check('every generated page is in the sitemap list', TOOL_PAGE_LIST.every((e) => sitemapPaths.has(e.path)), TOOL_PAGE_LIST.filter((e) => !sitemapPaths.has(e.path)).map((e) => e.path).join(', '));
check('sitemap has no redirect sources', Object.keys(LEGACY_REDIRECTS).every((from) => !sitemapPaths.has(from.endsWith('/') ? from : `${from}/`)));

// Numbers on the 25-question page must match the chart math
const p25 = TOOL_PAGES['grading-scale/25-questions'];
check('25 questions: each worth 4%', p25.faqs[0].answer.includes('4%'));
check('25 questions: 3 wrong = 88.0% B', p25.example.rows.some((r) => r.value === '88.0%') && p25.example.rows.some((r) => r.value === 'B'));

// Internal links on generated pages point at real pages
const known = new Set<string>([...sitemapPaths, '/']);
const broken: string[] = [];
for (const e of TOOL_PAGE_LIST) for (const r of e.related) if (!known.has(r.path)) broken.push(`${e.slug} -> ${r.path}`);
check('related links resolve', broken.length === 0, broken.slice(0, 3).join('; '));
check('size path helper', gradingScalePath(25) === '/grading-scale/25-questions/');

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\n🎉 generated pages: all checks passed');
