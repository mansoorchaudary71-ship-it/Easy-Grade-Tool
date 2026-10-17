/**
 * Weighted vs unweighted GPA math for the weighted GPA calculator.
 *
 * Unweighted GPA uses the plain 4.0 points for each letter (A+ and A are both 4.0, A- is 3.7 ...), the same
 * points the main GPA calculator uses. Weighted GPA adds a bonus to harder courses before averaging.
 * Schools set their own bonuses, so the bonus values are inputs, never constants baked into the result.
 * A course graded F earns no bonus (a bonus on a failing grade would reward a failed course).
 */
import { SCALE_PLUS_MINUS, roundTo } from './academicMath';

export type CourseLevel = 'regular' | 'honors' | 'ap';

export interface WeightedCourse {
  letter: string;
  credits: number;
  level: CourseLevel;
}

export interface CourseBonus {
  honors: number;
  ap: number;
}

/** Common starting point only. Many schools use +0.5 for honors and +1.0 for AP/IB, but each school decides. */
export const DEFAULT_BONUS: CourseBonus = { honors: 0.5, ap: 1.0 };

export const MAX_BONUS = 2;

export const GPA_LETTERS: string[] = SCALE_PLUS_MINUS.map((b) => b.letter);

export function pointsForLetter(letter: string): number | null {
  const band = SCALE_PLUS_MINUS.find((b) => b.letter === letter);
  return band ? band.gpa : null;
}

export function bonusFor(level: CourseLevel, bonus: CourseBonus): number {
  return level === 'honors' ? bonus.honors : level === 'ap' ? bonus.ap : 0;
}

export interface WeightedGpaResult {
  unweighted: number;
  weighted: number;
  totalCredits: number;
  courseCount: number;
}

/** Credit-weighted average. Returns null when there is nothing valid to average. */
export function calculateWeightedGpa(courses: WeightedCourse[], bonus: CourseBonus): WeightedGpaResult | null {
  let credits = 0;
  let plain = 0;
  let boosted = 0;
  let count = 0;
  for (const c of courses) {
    const pts = pointsForLetter(c.letter);
    if (pts === null || !Number.isFinite(c.credits) || c.credits <= 0) continue;
    const extra = pts > 0 ? bonusFor(c.level, bonus) : 0;
    credits += c.credits;
    plain += pts * c.credits;
    boosted += (pts + extra) * c.credits;
    count += 1;
  }
  if (credits === 0) return null;
  return {
    unweighted: roundTo(plain / credits, 2),
    weighted: roundTo(boosted / credits, 2),
    totalCredits: roundTo(credits, 2),
    courseCount: count,
  };
}
