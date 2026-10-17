/**
 * "How many can I miss?" math. Uses the same rule as the quick chart: the percentage is rounded to one decimal
 * first, and that displayed value is what is compared with a letter's minimum.
 */
import { LetterBand, roundTo } from './academicMath';

/** Largest whole number of wrong answers that still leaves at least `minPercent`. Null when even 0 wrong cannot. */
export function maxWrongForMinPercent(total: number, minPercent: number): number | null {
  if (!Number.isInteger(total) || total < 1) return null;
  if (!(minPercent >= 0) || minPercent > 100) return null;
  let best: number | null = null;
  for (let wrong = 0; wrong <= total; wrong++) {
    const pct = roundTo(((total - wrong) / total) * 100, 1);
    if (pct >= minPercent) best = wrong;
    else break;
  }
  return best;
}

export interface MissRow {
  letter: string;
  min: number;
  maxWrong: number;
  /** Displayed percentage when exactly `maxWrong` are missed. */
  percentAtMax: number;
}

/** One row per passing letter (the F band is skipped). */
export function buildMissTable(total: number, bands: LetterBand[]): MissRow[] {
  const rows: MissRow[] = [];
  for (const band of [...bands].sort((a, b) => b.min - a.min)) {
    if (band.min <= 0) continue;
    const maxWrong = maxWrongForMinPercent(total, band.min);
    if (maxWrong === null) continue;
    rows.push({
      letter: band.letter,
      min: band.min,
      maxWrong,
      percentAtMax: roundTo(((total - maxWrong) / total) * 100, 1),
    });
  }
  return rows;
}
