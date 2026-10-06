/**
 * Pure, dependency-free grade math for the Test Grade, Grade Curve and Letter Grade
 * calculators. Kept separate from React so it can be unit-tested by scripts/verify-academic-math.ts
 * and reused by prerendered content (worked examples are generated from these functions,
 * so the numbers printed on the page can never drift from the calculator).
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

/** Common US plus/minus scale (93/90/87/83/80/77/73/70/67/63/60). */
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

export function roundTo(value: number, decimals = 1): number {
  const f = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * f) / f;
}

export function lookupBand(percent: number, scale: LetterBand[]): LetterBand {
  const sorted = [...scale].sort((a, b) => b.min - a.min);
  for (const band of sorted) {
    if (percent >= band.min) return band;
  }
  return sorted[sorted.length - 1];
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
}

export function calculateTestGrade(input: TestGradeInput): TestGradeResult {
  const { earned, possible } = input;
  const bonus = input.bonus ?? 0;
  const penalty = input.penalty ?? 0;
  if (!Number.isFinite(earned) || !Number.isFinite(possible) || possible <= 0) {
    return { valid: false, percent: 0, adjustedEarned: 0, missed: 0, error: 'Enter points possible greater than 0.' };
  }
  if (earned < 0 || bonus < 0 || penalty < 0) {
    return { valid: false, percent: 0, adjustedEarned: 0, missed: 0, error: 'Scores cannot be negative.' };
  }
  const adjustedEarned = Math.max(0, earned + bonus - penalty);
  return {
    valid: true,
    percent: (adjustedEarned / possible) * 100,
    adjustedEarned,
    missed: Math.max(0, possible - earned),
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
  /** linear-target: desired class average after curving. */
  targetAverage?: number;
  /** Highest possible score (default 100). */
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
 * Applies one of four widely used curving methods to raw scores.
 *  - flat:          score + k
 *  - scale-top:     score + (maxScore - highest score)       (top student becomes 100)
 *  - sqrt:          10 * sqrt(score)  when maxScore = 100     (generalised: maxScore * sqrt(score / maxScore))
 *  - linear-target: score + (target average - current average)
 */
export function applyCurve(scores: number[], params: CurveParams): number[] {
  const maxScore = params.maxScore ?? 100;
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

/** Parses "88, 92 75\n60;71" style input into numbers; returns the numbers and any tokens that were rejected. */
export function parseScoreList(raw: string): { scores: number[]; rejected: string[] } {
  const tokens = raw
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  const scores: number[] = [];
  const rejected: string[] = [];
  for (const t of tokens) {
    const n = Number(t.replace(/%$/, ''));
    if (Number.isFinite(n) && n >= 0 && n <= 1000) scores.push(n);
    else rejected.push(t);
  }
  return { scores, rejected };
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
  const hit = ranges.find((r) => r.letter.toUpperCase() === letter.trim().toUpperCase().replace('−', '-'));
  if (!hit) return null;
  return roundTo((hit.from + hit.to) / 2, 1);
}
