/**
 * Grade calculation helpers for the Quick Grade chart and the Weighted Grade calculator.
 *
 * Rules every function here follows:
 *  - The letter grade is chosen from the SAME rounded percentage that is displayed.
 *  - Scales come from academicMath (one source of truth).
 *  - Invalid input produces an error message, never a silent substitute value.
 */
import {
  LetterBand,
  SCALE_PLUS_MINUS,
  SCALE_STANDARD,
  letterForDisplayed,
  parseStrictNumber,
  roundTo,
} from './academicMath';

export type GradingScale = 'standard' | 'plus-minus';
export type DecimalPrecision = 0 | 1 | 2;

export const MAX_QUESTIONS = 1000;

export function scaleBands(scale: GradingScale): LetterBand[] {
  return scale === 'plus-minus' ? SCALE_PLUS_MINUS : SCALE_STANDARD;
}

/** Safely parse any input value to a number. Unlike Number(), "", "0x1F" and "1e2" never sneak through. */
export function safeParseFloat(val: unknown, fallback = 0): number {
  const n = parseStrictNumber(val as string | number | null | undefined);
  return n === null ? fallback : n;
}

/** Letter for a percentage, chosen from the rounded value that is shown on screen. */
export function calculateLetterFromPercentage(
  percent: number,
  scale: GradingScale = 'standard',
  decimals: DecimalPrecision = 1
): string {
  const safe = Math.max(0, Math.min(150, Number.isFinite(percent) ? percent : 0));
  return letterForDisplayed(safe, scaleBands(scale), decimals).letter;
}

/* ------------------------------------------------------------------ */
/* Quick Grade chart                                                   */
/* ------------------------------------------------------------------ */

export interface QuestionCountCheck {
  value: number | null;
  error: string | null;
}

/** Validates the "number of questions" field. No coercion: bad input returns an error and no value. */
export function validateQuestionCount(raw: string): QuestionCountCheck {
  const text = (raw ?? '').trim();
  if (text === '') return { value: null, error: `Enter how many questions the test has (1 to ${MAX_QUESTIONS}).` };
  const n = parseStrictNumber(text);
  if (n === null) return { value: null, error: 'Use digits only, for example 25.' };
  if (!Number.isInteger(n)) return { value: null, error: 'Questions must be a whole number. Use partial credit for halves.' };
  if (n < 1) return { value: null, error: 'A test needs at least 1 question.' };
  if (n > MAX_QUESTIONS) return { value: null, error: `The most this chart can show is ${MAX_QUESTIONS} questions.` };
  return { value: n, error: null };
}

export interface WrongCountCheck {
  value: number | null;
  error: string | null;
}

/** Validates a wrong-answer count for a test of `total` questions. Halves are allowed when `half` is true. */
export function validateWrongCount(raw: string, total: number, half: boolean): WrongCountCheck {
  const text = (raw ?? '').trim();
  if (text === '') return { value: null, error: null };
  const n = parseStrictNumber(text);
  if (n === null) return { value: null, error: 'Use digits only, for example 3.' };
  if (!half && !Number.isInteger(n)) return { value: null, error: 'Whole numbers only. Turn on half points for partial credit.' };
  if (half && Math.round(n * 2) !== n * 2) return { value: null, error: 'Half points go in steps of 0.5.' };
  if (n > total) return { value: null, error: `Wrong answers cannot be more than ${total}.` };
  return { value: n, error: null };
}

export interface QuickChartRow {
  wrong: number;
  correct: number;
  /** Unrounded percentage. */
  rawPercentage: number;
  /** Percentage rounded to the displayed precision. */
  percentage: number;
  formattedPercentage: string;
  letter: string;
}

export interface QuickChartOptions {
  total: number;
  decimals: DecimalPrecision;
  /** Half-point steps (0.5 wrong) for partial credit. Capped at 200 questions to keep the table small. */
  halfPoints?: boolean;
  bands: LetterBand[];
}

/** Every row of the quick chart, from 0 wrong to all wrong. */
export function buildQuickChart(opts: QuickChartOptions): QuickChartRow[] {
  const total = Math.max(1, Math.min(MAX_QUESTIONS, Math.floor(opts.total)));
  const step = opts.halfPoints && total <= 200 ? 0.5 : 1;
  const rows: QuickChartRow[] = [];
  const count = Math.round(total / step);
  for (let i = 0; i <= count; i++) {
    const wrong = i * step;
    const correct = total - wrong;
    const raw = Math.max(0, Math.min(100, (correct / total) * 100));
    const percentage = roundTo(raw, opts.decimals);
    rows.push({
      wrong,
      correct,
      rawPercentage: raw,
      percentage,
      formattedPercentage: percentage.toFixed(opts.decimals),
      letter: letterForDisplayed(raw, opts.bands, opts.decimals).letter,
    });
  }
  return rows;
}

/** One student: percent and letter for a wrong-answer count. */
export function gradeOneStudent(total: number, wrong: number, decimals: DecimalPrecision, bands: LetterBand[]) {
  // Callers validate input first (validateQuestionCount / validateWrongCount). This guard keeps the function
  // total-safe on its own: a zero or invalid total can never produce NaN, and "correct" is never negative.
  if (!Number.isFinite(total) || total <= 0) {
    return {
      correct: 0,
      percentage: 0,
      formattedPercentage: (0).toFixed(decimals),
      letter: letterForDisplayed(0, bands, decimals).letter,
    };
  }
  const wrongClamped = Number.isFinite(wrong) ? Math.max(0, Math.min(total, wrong)) : 0;
  const raw = Math.max(0, Math.min(100, ((total - wrongClamped) / total) * 100));
  const percentage = roundTo(raw, decimals);
  return {
    correct: total - wrongClamped,
    percentage,
    formattedPercentage: percentage.toFixed(decimals),
    letter: letterForDisplayed(raw, bands, decimals).letter,
  };
}

/* ------------------------------------------------------------------ */
/* Weighted / points calculator                                        */
/* ------------------------------------------------------------------ */

export interface MultiAssessmentItem {
  id: number | string;
  name: string;
  score: string | number;
  max: string | number;
  weight?: string | number;
}

export interface RowIssue {
  id: number | string;
  message: string;
}

export interface MultiAssessmentResult {
  /** Percentage rounded to the displayed precision. */
  percentage: number;
  /** Exact percentage. Use this, never `percentage`, when feeding the value into another formula. */
  rawPercentage: number;
  formattedPercentage: string;
  letterGrade: string;
  validItemCount: number;
  /** Rows that were left out of the result, with the reason. Blank rows are not reported. */
  issues: RowIssue[];
  /** Sum of the weights of the rows that were counted (weighted mode). */
  totalWeight: number;
  /** Rows that are completely blank and ignored. */
  blankRowCount: number;
}

function isBlankRow(item: MultiAssessmentItem): boolean {
  return String(item.score ?? '').trim() === '';
}

/**
 * Calculates a weighted or points-based course grade.
 * Rows without a score are treated as "not graded yet" and ignored. Rows with a bad value are
 * ignored AND reported in `issues` so the UI can say why.
 */
export function calculateMultiAssessmentGrade(
  items: MultiAssessmentItem[],
  mode: 'points' | 'weighted',
  options: { decimalPrecision?: DecimalPrecision; scale?: GradingScale } = {}
): MultiAssessmentResult {
  const { decimalPrecision = 1, scale = 'standard' } = options;
  const bands = scaleBands(scale);
  const issues: RowIssue[] = [];
  let blankRowCount = 0;

  const valid: { score: number; max: number; weight: number }[] = [];
  for (const item of items) {
    if (isBlankRow(item)) {
      blankRowCount++;
      continue;
    }
    const score = parseStrictNumber(item.score);
    const max = parseStrictNumber(item.max);
    const weight = mode === 'weighted' ? parseStrictNumber(item.weight ?? '') : 1;
    const label = item.name?.trim() || 'A row';
    if (score === null) {
      issues.push({ id: item.id, message: `${label}: the score is not a number.` });
    } else if (max === null || max <= 0) {
      issues.push({ id: item.id, message: `${label}: "Out of" must be a number above 0.` });
    } else if (mode === 'weighted' && (weight === null || weight <= 0)) {
      issues.push({ id: item.id, message: `${label}: the weight must be a number above 0.` });
    } else {
      valid.push({ score, max, weight: weight ?? 1 });
    }
  }

  const empty = (): MultiAssessmentResult => ({
    percentage: 0,
    rawPercentage: 0,
    formattedPercentage: (0).toFixed(decimalPrecision),
    letterGrade: '',
    validItemCount: 0,
    issues,
    totalWeight: 0,
    blankRowCount,
  });
  if (!valid.length) return empty();

  let raw: number;
  let totalWeight = 0;
  if (mode === 'weighted') {
    totalWeight = valid.reduce((a, r) => a + r.weight, 0);
    const weightedSum = valid.reduce((a, r) => a + (r.score / r.max) * r.weight, 0);
    raw = (weightedSum / totalWeight) * 100;
  } else {
    const possible = valid.reduce((a, r) => a + r.max, 0);
    raw = (valid.reduce((a, r) => a + r.score, 0) / possible) * 100;
  }
  // Extra credit may legitimately push a course above 100%, so only a floor is applied.
  raw = Math.max(0, raw);
  const percentage = roundTo(raw, decimalPrecision);
  return {
    percentage,
    rawPercentage: raw,
    formattedPercentage: percentage.toFixed(decimalPrecision),
    letterGrade: letterForDisplayed(raw, bands, decimalPrecision).letter,
    validItemCount: valid.length,
    issues,
    totalWeight,
    blankRowCount,
  };
}
