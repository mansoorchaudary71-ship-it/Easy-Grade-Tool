/**
 * Final-exam solver with real validation instead of silent defaults.
 * Used by the Final Exam page and the target simulator inside the Weighted Grade calculator.
 */
import { parseStrictNumber } from './academicMath';

export type FinalExamResult =
  | { status: 'invalid'; errors: string[] }
  | { status: 'secured'; required: number; banked: number; maxPossible: number }
  | { status: 'unreachable'; required: number; banked: number; maxPossible: number }
  | { status: 'ok'; required: number; banked: number; maxPossible: number };

export interface FinalExamInput {
  /** Current course grade in percent, as typed (blank is an error, never 0). */
  current: string | number;
  /** Desired course grade in percent, as typed. */
  target: string | number;
  /** Final exam weight in percent, above 0 and up to 100. */
  weight: string | number;
  /** Highest score the final can earn in percent (default 100; raise it for extra credit). */
  maxFinal?: number;
}

export function solveFinalExam(input: FinalExamInput): FinalExamResult {
  const errors: string[] = [];
  const current = parseStrictNumber(input.current);
  const target = parseStrictNumber(input.target);
  const weight = parseStrictNumber(input.weight);
  const maxFinal = input.maxFinal ?? 100;

  if (current === null) errors.push('Enter your current grade as a number.');
  if (target === null) errors.push('Enter the grade you want as a number.');
  if (weight === null) errors.push('Enter the final exam weight as a number.');
  else if (weight <= 0 || weight > 100) errors.push('The final exam weight must be above 0% and no more than 100%.');
  if (current !== null && current > 200) errors.push('Current grade looks too high. Enter a percentage such as 84.');
  if (target !== null && target > 200) errors.push('Target grade looks too high. Enter a percentage such as 90.');

  if (errors.length || current === null || target === null || weight === null) {
    return { status: 'invalid', errors };
  }

  const w = weight / 100;
  // Always the exact current grade: a rounded value must never be fed back into the formula.
  const banked = current * (1 - w);
  const required = (target - banked) / w;
  const maxPossible = banked + maxFinal * w;

  if (required <= 0) return { status: 'secured', required: 0, banked, maxPossible };
  if (required > maxFinal) return { status: 'unreachable', required, banked, maxPossible };
  return { status: 'ok', required, banked, maxPossible };
}
