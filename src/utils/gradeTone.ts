import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

/**
 * Semantic grade colouring, shared by the Quick Chart, the one-student panel and the weighted calculator.
 *
 *   A / B  -> "good"  emerald
 *   C      -> "fair"  amber
 *   D / F  -> "poor"  rose
 *
 * Colour is never the only signal (WCAG 1.4.1, and red/green is the commonest colour-vision deficiency):
 *   - every tone has its own ICON SHAPE (check circle / warning triangle / cross circle),
 *   - every tone has a plain-language LABEL ("Strong", "Fair", "Needs work"),
 *   - the letter itself is always printed next to the colour.
 *
 * All text/background pairs below are >= 4.5:1 (WCAG 2.1 AA). The measured ratios are listed in
 * docs/UX-CONTRAST-REPORT.md and can be re-checked with scripts/check-contrast.py.
 */

export type GradeToneKey = 'good' | 'fair' | 'poor';

export interface GradeTone {
  key: GradeToneKey;
  /** Short plain-language meaning, used as visible text next to the colour. */
  label: string;
  /** Distinct glyph per tone so the meaning survives without colour. */
  Icon: typeof CheckCircle2;
  /** Pill / badge: background + text + border. */
  badge: string;
  /** Large tinted surface (result readout, group header). */
  surface: string;
  /** Large grade text on top of `surface` (or on the plain card). */
  text: string;
  /** Slightly softer text for percentages inside a row. */
  textSoft: string;
  /** Coloured left rule for a table row (a second, non-text cue). */
  rule: string;
  /** Subtle row tint for tables. */
  row: string;
}

const GOOD: GradeTone = {
  key: 'good',
  label: 'Strong',
  Icon: CheckCircle2,
  badge:
    'bg-emerald-100 text-emerald-900 border-emerald-300 ',
  surface: 'bg-emerald-50 border-emerald-200 ',
  text: 'text-emerald-800 ',
  textSoft: 'text-emerald-800 ',
  rule: 'border-l-emerald-600 ',
  row: 'bg-emerald-50/70 ',
};

const FAIR: GradeTone = {
  key: 'fair',
  label: 'Fair',
  Icon: AlertTriangle,
  badge: 'bg-amber-100 text-amber-900 border-amber-300 ',
  surface: 'bg-amber-50 border-amber-200 ',
  text: 'text-amber-900 ',
  textSoft: 'text-amber-900 ',
  rule: 'border-l-amber-500 ',
  row: 'bg-amber-50/70 ',
};

const POOR: GradeTone = {
  key: 'poor',
  label: 'Needs work',
  Icon: XCircle,
  badge: 'bg-rose-100 text-rose-900 border-rose-300 ',
  surface: 'bg-rose-50 border-rose-200 ',
  text: 'text-rose-800 ',
  textSoft: 'text-rose-800 ',
  rule: 'border-l-rose-600 ',
  row: 'bg-rose-50/70 ',
};

/** Neutral tone for "no result yet". */
export const NEUTRAL_TONE = {
  surface: 'bg-slate-50 border-slate-200 ',
  text: 'text-slate-800 ',
} as const;

/** Maps any letter grade ("A", "A+", "B-", "C", "D+", "F") to its tone. Unknown letters count as "poor". */
export function gradeTone(letter: string): GradeTone {
  switch ((letter || '').trim().charAt(0).toUpperCase()) {
    case 'A':
    case 'B':
      return GOOD;
    case 'C':
      return FAIR;
    default:
      return POOR;
  }
}
