import type { ToolPageEntry } from './toolPages';

/**
 * On-page keyword placement (SEO round 5).
 *
 * Rule: the exact primary keyword of every registry page appears in the <title>, the <h1> and the first
 * paragraph (the intro shown under the H1). Pages that already satisfy a rule are left untouched, so this is
 * safe to run on every build and cannot double-apply.
 *
 * Wording stays third person. The intro lead is "<Keyword>: <existing intro>", which keeps the original
 * copy intact and puts the exact phrase first.
 */

const SMALL_WORDS = new Set(['to', 'vs', 'for', 'a', 'of', 'the', 'and', 'on', 'in', 'or']);
const ACRONYMS = new Set([
  'gpa', 'cgpa', 'sgpa', 'vtu', 'gtu', 'sppu', 'aicte', 'aktu', 'bhu', 'bput', 'cbse', 'bamu', 'jntu', 'ktu',
  'rgpv', 'vit', 'makaut', 'srm', 'bits', 'ez', 'cbcs', 'ap', 'ib', 'mu', 'wbut', 'sgbau', 'srmist',
]);

/** "vtu cgpa to percentage" -> "VTU CGPA to Percentage" */
export function displayKeyword(keyword: string): string {
  return keyword
    .split(/\s+/)
    .map((word, i) => {
      if (ACRONYMS.has(word)) return word.toUpperCase();
      if (i > 0 && SMALL_WORDS.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/** Primary keywords that need a better exact phrase than the first entry of `keywords`. */
const PRIMARY_OVERRIDES: Record<string, string> = {
  'cgpa-to-percentage/mumbai-university-eng': 'mumbai university engineering cgpa to percentage',
  'cgpa-to-percentage/pune-university-direct': 'pune university cgpa to percentage',
};

/** Hand-written title / H1 for pages where a mechanical rewrite would read badly. */
const MANUAL: Record<string, { title?: string; h1?: string }> = {
  'for-schools': {
    title: 'Embed Grade Calculator — Free for School Websites',
    h1: 'Embed Grade Calculator on Your School Website',
  },
  'blog/how-to-grade-30-tests-in-15-minutes': {
    title: 'How to Grade Tests Faster — 30 Tests in 15 Minutes',
    h1: 'How to Grade Tests Faster: A Stack of 30 in 15 Minutes, Without Errors',
  },
  'grading-scale': {
    title: 'Grading Scale Chart Generator — 5 to 100 Questions',
    h1: 'Grading Scale Chart Generator',
  },
  'final-grade-planner': {
    title: 'Final Grade Planner — What You Need on Every Final',
  },
  'how-many-questions-can-i-miss': {
    h1: 'How Many Questions Can You Miss?',
  },
};

export function primaryKeywordFor(entry: ToolPageEntry): string {
  if (PRIMARY_OVERRIDES[entry.slug]) return PRIMARY_OVERRIDES[entry.slug];
  if (entry.slug.startsWith('grading-scale/') && entry.questions) return `grading scale for ${entry.questions} questions`;
  return (entry.keywords[0] || entry.h1).toLowerCase();
}

export function applyOnPageSeo(pages: Record<string, ToolPageEntry>): void {
  for (const entry of Object.values(pages)) {
    const kw = primaryKeywordFor(entry);
    const shown = displayKeyword(kw);
    const manual = MANUAL[entry.slug] ?? {};

    // Keep the primary keyword first in the list so every consumer agrees on it.
    entry.keywords = [kw, ...entry.keywords.filter((k) => k.toLowerCase() !== kw)];

    if (manual.title) entry.title = manual.title;
    if (manual.h1) entry.h1 = manual.h1;

    if (!entry.title.toLowerCase().includes(kw)) {
      const tail = entry.title.includes(' — ') ? entry.title.slice(entry.title.indexOf(' — ')) : '';
      entry.title = `${shown}${tail}`;
    }
    if (!entry.h1.toLowerCase().includes(kw)) {
      entry.h1 = entry.slug.startsWith('grading-scale/') ? shown : `${shown} Calculator`;
    }
    if (!entry.intro.toLowerCase().includes(kw)) {
      entry.intro = `${shown}: ${entry.intro}`;
    }
  }
}
