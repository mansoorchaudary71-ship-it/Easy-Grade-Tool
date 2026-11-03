import type { ToolPageEntry } from './toolPages';
import { displayKeyword } from './onPageSeo';

/**
 * Figures shown on every content page (SEO round 5: 3 to 5 images per page, each with descriptive alt text).
 *
 * Each figure is an SVG file under public/images/figures/, drawn by scripts/generate-figures.ts from the SAME
 * spec objects that produce the alt text and caption here, so image, alt text and page data cannot drift apart.
 * Re-run `npm run figures` after editing any page's example, feature list, lookup table or related links.
 */

export type FigureKind = 'example' | 'checklist' | 'table' | 'formula' | 'map';

export interface FigureSpec {
  /** File name under public/images/ (always starts with "figures/"). */
  file: string;
  kind: FigureKind;
  title: string;
  /** Descriptive alt text: says what the picture shows, with the real numbers. */
  alt: string;
  caption: string;
  subtitle?: string;
  lines?: string[];
  rows?: { label: string; value: string }[];
  items?: string[];
  table?: { columns: string[]; rows: string[][] };
  center?: string;
  around?: string[];
  footer?: string;
}

export const FIGURE_WIDTH = 800;
export const FIGURE_HEIGHT = 450;

export function figureFileName(slug: string, suffix: string): string {
  return `figures/${slug.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}-${suffix}.svg`;
}

function clip(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

/** Three figures for a registry page: worked example, feature checklist, and lookup table (or related-pages map). */
export function getRegistryFigures(entry: ToolPageEntry): FigureSpec[] {
  const kw = entry.keywords[0] ?? entry.h1.toLowerCase();
  const name = displayKeyword(kw);
  const figures: FigureSpec[] = [];

  const exampleRows = entry.example.rows.slice(0, 6);
  figures.push({
    file: figureFileName(entry.slug, 'example'),
    kind: 'example',
    title: entry.example.heading,
    subtitle: name,
    rows: exampleRows,
    footer: clip(entry.example.takeaway, 190),
    alt: clip(
      `Worked example for the ${kw}: ${exampleRows.map((r) => `${r.label} ${r.value}`).join(', ')}.`,
      240
    ),
    caption: `Worked example: ${entry.example.heading}`,
  });

  const features = entry.featureList.slice(0, 6);
  if (features.length >= 2) {
    figures.push({
      file: figureFileName(entry.slug, 'features'),
      kind: 'checklist',
      title: `Key points: ${name}`,
      subtitle: 'Easy Grade Tool',
      items: features,
      alt: clip(`Checklist of key points for the ${kw}: ${features.join(', ')}.`, 240),
      caption: `Key points: ${name}`,
    });
  }

  const table = entry.lookupTables?.[0];
  if (table) {
    const cols = table.columns.slice(0, 5);
    const rows = table.rows.slice(0, 7).map((r) => r.slice(0, 5));
    figures.push({
      file: figureFileName(entry.slug, 'table'),
      kind: 'table',
      title: table.heading,
      subtitle: name,
      table: { columns: cols, rows },
      alt: clip(
        `Lookup table "${table.heading}" with columns ${cols.join(', ')}; first row: ${rows[0]?.join(', ') ?? ''}.`,
        240
      ),
      caption: table.heading,
    });
  }

  if (figures.length < 3) {
    const around = entry.related.slice(0, 5).map((r) => r.label);
    figures.push({
      file: figureFileName(entry.slug, 'map'),
      kind: 'map',
      title: `${name} and related tools`,
      subtitle: 'Easy Grade Tool',
      center: entry.navLabel,
      around,
      alt: clip(`Map linking the ${kw} to related calculators: ${around.join(', ')}.`, 240),
      caption: `Related tools for the ${kw}`,
    });
  }

  return figures;
}
