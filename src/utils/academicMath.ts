/**
 * Pure, dependency-free grade math for the Quick Grade, Weighted Grade, Test Grade, Grade Curve,
 * Letter Grade and Final Exam calculators. Kept separate from React so it can be unit-tested by
 * scripts/verify-academic-math.ts and reused by prerendered content (worked examples are generated
 * from these functions, so the numbers printed on the page can never drift from the calculator).
 *
 * This module is the ONLY place grading scales are defined. src/data/constants.ts derives
 * GRADING_SCALES and GRADE_POINT_MAP from it, so every tool assigns the same letter to the same
 * percentage.
 */

export interface LetterBand {
  letter: string;
  min: number;
  gpa: number;
}

/** Common US 10-point scale without plus/minus. */
export const SCALE_STANDARD: LetterBand[] = [
  { letter: 'A', min: 90, gpa: 4.0 },
  { letter: 'B', min: 80, gpa: 3.0 },
  { letter: 'C', min: 70, gpa: 2.0 },
  { letter: 'D', min: 60, gpa: 1.0 },
  { letter: 'F', min: 0, gpa: 0.0 },
];

/** Common US plus/minus scale (97/93/90/87/83/80/77/73/70/67/63/60). ASCII "-" only. */
export const SCALE_PLUS_MINUS: LetterBand[] = [
  { letter: 'A+', min: 97, gpa: 4.0 },
  { letter: 'A', min: 93, gpa: 4.0 },
  { letter: 'A-', min: 90, gpa: 3.7 },
  { letter: 'B+', min: 87, gpa: 3.3 },
  { letter: 'B', min: 83, gpa: 3.0 },
  { letter: 'B-', min: 80, gpa: 2.7 },
  { letter: 'C+', min: 77, gpa: 2.3 },
  { letter: 'C', min: 73, gpa: 2.0 },
  { letter: 'C-', min: 70, gpa: 1.7 },
  { letter: 'D+', min: 67, gpa: 1.3 },
  { letter: 'D', min: 63, gpa: 1.0 },
  { letter: 'D-', min: 60, gpa: 0.7 },
  { letter: 'F', min: 0, gpa: 0.0 },
];

export interface Cutoffs {
  A: number;
  B: number;
  C: number;
  D: number;
}

export const DEFAULT_CUTOFFS: Cutoffs = { A: 90, B: 80, C: 70, D: 60 };

/** Builds an A-F scale from custom minimum percentages (used by the Quick Grade cutoff editor). */
export function scaleFromCutoffs(c: Cutoffs): LetterBand[] {
  return [
    { letter: 'A', min: c.A, gpa: 4.0 },
    { letter: 'B', min: c.B, gpa: 3.0 },
    { letter: 'C', min: c.C, gpa: 2.0 },
    { letter: 'D', min: c.D, gpa: 1.0 },
    { letter: 'F', min: 0, gpa: 0.0 },
  ];
}

/** Returns an error message when custom cutoffs are not strictly descending within 0-100, else null. */
export function validateCutoffs(c: Cutoffs): string | null {
  const vals = [c.A, c.B, c.C, c.D];
  if (vals.some((n) => typeof n !== 'number' || !Number.isFinite(n))) {
    return 'Every cutoff must be a number.';
  }
  if (c.A > 100) return 'The A cutoff cannot be above 100%.';
  if (c.D <= 0) return 'The D cutoff must be above 0%, because that is where F starts.';
  if (!(c.A > c.B)) return 'A must be higher than B.';
  if (!(c.B > c.C)) return 'B must be higher than C.';
  if (!(c.C > c.D)) return 'C must be higher than D.';
  return null;
}

export function roundTo(value: number, decimals = 1): number {
  const f = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * f) / f;
}

/** Percentage exactly as it is displayed (rounded to `decimals`). */
export const roundPercent = roundTo;

export function lookupBand(percent: number, scale: LetterBand[]): LetterBand {
  const sorted = [...scale].sort((a, b) => b.min - a.min);
  for (const band of sorted) {
    if (percent >= band.min) return band;
  }
  return sorted[sorted.length - 1];
}

/**
 * The letter for a percentage, chosen from the SAME rounded value that is displayed.
 * With one decimal, 89.96 displays as "90.0%" and is therefore an A- (never "90.0%" next to a B).
 */
export function letterForDisplayed(percent: number, scale: LetterBand[], decimals = 1): LetterBand {
  return lookupBand(roundTo(percent, decimals), scale);
}

/* ------------------------------------------------------------------ */
/* Strict number parsing                                               */
/* ------------------------------------------------------------------ */

const PLAIN_DECIMAL = /^(\d+(\.\d+)?|\.\d+)$/;

/**
 * Parses one plain decimal such as "12", "12.5", ".5" or "12,5" (decimal comma). Rejects blank text,
 * hex ("0x1F"), exponents ("1e2"), signs and anything else Number() would quietly accept.
 * A trailing "%" is allowed. Returns null when the text is not a plain number.
 */
export function parseStrictNumber(raw: string | number | null | undefined): number | null {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  let s = String(raw ?? '').trim().replace(/%$/, '').trim();
  if (!s) return null;
  if (/^\d+,\d+$/.test(s)) s = s.replace(',', '.');
  if (!PLAIN_DECIMAL.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/* ------------------------------------------------------------------ */
/* Test grade                                                          */
/* ------------------------------------------------------------------ */

export interface TestGradeInput {
  /** Points (or questions) earned. */
  earned: number;
  /** Points (or questions) possible, before any extra credit. */
  possible: number;
  /** Optional bonus / extra-credit points added to the earned total. */
  bonus?: number;
  /** Optional: points deducted (late penalty etc.). */
  penalty?: number;
}

export interface TestGradeResult {
  valid: boolean;
  percent: number;
  adjustedEarned: number;
  missed: number;
  error?: string;
  /** Non-blocking notes, e.g. earned above possible or a penalty larger than the score. */
  warnings: string[];
}

export function calculateTestGrade(input: TestGradeInput): TestGradeResult {
  const { earned, possible } = input;
  const bonus = input.bonus ?? 0;
  const penalty = input.penalty ?? 0;
  if (!Number.isFinite(earned) || !Number.isFinite(possible) || possible <= 0) {
    return { valid: false, percent: 0, adjustedEarned: 0, missed: 0, error: 'Enter points possible greater than 0.', warnings: [] };
  }
  if (!Number.isFinite(bonus) || !Number.isFinite(penalty)) {
    return { valid: false, percent: 0, adjustedEarned: 0, missed: 0, error: 'Bonus and penalty must be numbers.', warnings: [] };
  }
  if (earned < 0 || bonus < 0 || penalty < 0) {
    return { valid: false, percent: 0, adjustedEarned: 0, missed: 0, error: 'Scores cannot be negative.', warnings: [] };
  }
  const warnings: string[] = [];
  if (earned > possible && bonus === 0) {
    warnings.push(`You entered more points earned (${earned}) than points possible (${possible}). That is only correct if the test had extra credit.`);
  }
  if (penalty > earned + bonus) {
    warnings.push('The penalty is larger than the points earned, so the score is shown as 0%.');
  }
  const adjustedEarned = Math.max(0, earned + bonus - penalty);
  return {
    valid: true,
    percent: (adjustedEarned / possible) * 100,
    adjustedEarned,
    missed: Math.max(0, possible - earned),
    warnings,
  };
}

/** Points needed on a test of `possible` points to reach `targetPercent`. */
export function pointsNeededForTarget(possible: number, targetPercent: number): number {
  return Math.ceil(((targetPercent / 100) * possible) * 100) / 100;
}

/* ------------------------------------------------------------------ */
/* Grade curve                                                         */
/* ------------------------------------------------------------------ */

export type CurveMethod = 'flat' | 'scale-top' | 'sqrt' | 'linear-target';

export interface CurveParams {
  method: CurveMethod;
  /** flat: points added to every score. */
  flatPoints?: number;
  /** linear-target: desired class average after curving. Leave undefined to keep the current mean. */
  targetAverage?: number;
  /** Highest possible score (default 100). Must be above 0. */
  maxScore?: number;
  /** Cap curved scores at maxScore (default true). */
  capAtMax?: boolean;
}

export interface CurveStats {
  count: number;
  mean: number;
  median: number;
  min: number;
  max: number;
}

export function computeStats(scores: number[]): CurveStats {
  const n = scores.length;
  if (n === 0) return { count: 0, mean: 0, median: 0, min: 0, max: 0 };
  const sorted = [...scores].sort((a, b) => a - b);
  const mean = scores.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 === 1 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  return { count: n, mean, median, min: sorted[0], max: sorted[n - 1] };
}

/**
 * Returns a message when the curve inputs cannot produce a sensible result, otherwise null.
 * The Grade Curve tool calls this BEFORE applyCurve so an empty field never turns into 0.
 */
export function validateCurveParams(scores: number[], params: CurveParams): string | null {
  const maxScore = params.maxScore ?? 100;
  if (!Number.isFinite(maxScore) || maxScore <= 0) return 'Maximum score must be greater than 0.';
  if (scores.length === 0) return 'Enter at least one score to see the curve.';
  if (params.method === 'flat' && !Number.isFinite(params.flatPoints ?? NaN)) {
    return 'Enter how many points to add.';
  }
  if (params.method === 'linear-target') {
    const t = params.targetAverage;
    if (t === undefined || !Number.isFinite(t)) return 'Enter the class average you want after curving.';
    if (t < 0 || t > maxScore) return `The target average must be between 0 and ${maxScore}.`;
  }
  if (params.method === 'scale-top' && Math.max(...scores) <= 0) {
    return 'The highest score is 0, so there is nothing to scale.';
  }
  return null;
}

/**
 * Applies one of four widely used curving methods to raw scores.
 *  - flat:          score + k
 *  - scale-top:     score + (maxScore - highest score)       (top student becomes maxScore)
 *  - sqrt:          maxScore * sqrt(score / maxScore)         (10 * sqrt(score) when maxScore = 100)
 *  - linear-target: score + (target average - current average)
 * An invalid maxScore (0, negative, NaN) returns the scores unchanged instead of NaN.
 */
export function applyCurve(scores: number[], params: CurveParams): number[] {
  const maxScore = params.maxScore ?? 100;
  if (!Number.isFinite(maxScore) || maxScore <= 0) return [...scores];
  const cap = params.capAtMax ?? true;
  if (scores.length === 0) return [];
  const stats = computeStats(scores);
  let out: number[];
  switch (params.method) {
    case 'flat':
      out = scores.map((s) => s + (params.flatPoints ?? 0));
      break;
    case 'scale-top':
      out = scores.map((s) => s + (maxScore - stats.max));
      break;
    case 'sqrt':
      out = scores.map((s) => maxScore * Math.sqrt(Math.max(0, s) / maxScore));
      break;
    case 'linear-target':
      out = scores.map((s) => s + ((params.targetAverage ?? stats.mean) - stats.mean));
      break;
    default:
      out = [...scores];
  }
  return out.map((s) => {
    const floored = Math.max(0, s);
    return cap ? Math.min(maxScore, floored) : floored;
  });
}

export interface RejectedToken {
  token: string;
  reason: string;
}

export interface ParsedScores {
  scores: number[];
  rejected: RejectedToken[];
  /** Plain-language notes, e.g. that "88,5" was read as 88.5. */
  notes: string[];
}

/**
 * Strict score-list parser. Separators: whitespace, semicolons, newlines and commas.
 * A comma between digits with no spaces around it ("88,5 92,5") is read as a decimal comma, but only
 * when no comma anywhere in the text is used as a separator ("88, 92" or "70,80,90"). Lone "%",
 * hex ("0x1F"), exponents ("1e2"), negatives and values above `maxScore` are rejected with a reason.
 */
export function parseScoreListDetailed(raw: string, maxScore = 1000): ParsedScores {
  const text = raw ?? '';
  const scores: number[] = [];
  const rejected: RejectedToken[] = [];
  const notes: string[] = [];

  const coarse = text.split(/[\s;]+/).filter(Boolean);
  const commaTokens = coarse.filter((t) => t.includes(','));
  const commaIsSeparator = commaTokens.some((t) => !/^\d+,\d+%?$/.test(t));
  const decimalComma = commaTokens.length > 0 && !commaIsSeparator;

  const accept = (token: string) => {
    const bare = token.replace(/%$/, '');
    if (!bare) {
      rejected.push({ token, reason: 'no number' });
      return;
    }
    if (bare.startsWith('-')) {
      rejected.push({ token, reason: 'negative score' });
      return;
    }
    const n = parseStrictNumber(bare);
    if (n === null) {
      rejected.push({ token, reason: 'not a plain number' });
      return;
    }
    if (n > maxScore) {
      rejected.push({ token, reason: `above the maximum score of ${maxScore}` });
      return;
    }
    scores.push(n);
  };

  for (const piece of coarse) {
    if (decimalComma && /^\d+,\d+%?$/.test(piece)) {
      const asDecimal = piece.replace(',', '.');
      if (!notes.length) notes.push(`Read "${piece}" as ${asDecimal.replace(/%$/, '')} (decimal comma).`);
      accept(asDecimal);
    } else if (piece.includes(',')) {
      piece.split(',').filter(Boolean).forEach(accept);
    } else {
      accept(piece);
    }
  }
  return { scores, rejected, notes };
}

/** Backwards-compatible wrapper: rejected tokens are returned as plain strings. */
export function parseScoreList(raw: string, maxScore = 1000): { scores: number[]; rejected: string[] } {
  const r = parseScoreListDetailed(raw, maxScore);
  return { scores: r.scores, rejected: r.rejected.map((t) => t.token) };
}

/* ------------------------------------------------------------------ */
/* Letter grade                                                        */
/* ------------------------------------------------------------------ */

export function percentToLetter(percent: number, scale: LetterBand[]): LetterBand {
  return lookupBand(percent, scale);
}

/** Returns inclusive display ranges, e.g. B+ -> 87.0-89.99. Top band ends at 100. */
export function bandRanges(scale: LetterBand[]): { letter: string; from: number; to: number; gpa: number }[] {
  const sorted = [...scale].sort((a, b) => b.min - a.min);
  return sorted.map((b, i) => ({
    letter: b.letter,
    from: b.min,
    to: i === 0 ? 100 : roundTo(sorted[i - 1].min - 0.01, 2),
    gpa: b.gpa,
  }));
}

/** Midpoint percentage most tools use when converting a letter grade back to a percent. */
export function letterToMidpoint(letter: string, scale: LetterBand[]): number | null {
  const ranges = bandRanges(scale);
  const wanted = letter.trim().toUpperCase().replace('\u2212', '-');
  const hit = ranges.find((r) => r.letter.toUpperCase() === wanted);
  if (!hit) return null;
  return roundTo((hit.from + hit.to) / 2, 1);
}

/** True when `letter` exists on `scale` (case-insensitive, accepts the Unicode minus). */
export function letterExistsOnScale(letter: string, scale: LetterBand[]): boolean {
  const wanted = letter.trim().toUpperCase().replace('\u2212', '-');
  return scale.some((b) => b.letter.toUpperCase() === wanted);
}

/** Maps a letter chosen on one scale to the closest valid letter on another (B+ on plus/minus -> B on A-F). */
export function mapLetterToScale(letter: string, scale: LetterBand[]): string {
  if (letterExistsOnScale(letter, scale)) return letter;
  const base = letter.trim().toUpperCase().charAt(0);
  const hit = scale.find((b) => b.letter.toUpperCase() === base);
  return hit ? hit.letter : scale[0].letter;
}
