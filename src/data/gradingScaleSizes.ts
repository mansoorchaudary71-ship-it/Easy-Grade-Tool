/**
 * Test sizes that get their own /grading-scale/N-questions/ page.
 * Kept in a tiny dependency-free module so App.tsx, the homepage links and the router can read the list
 * without pulling the page content into the main bundle.
 */
export const GRADING_SCALE_SIZES: number[] = [5, 10, 12, 15, 16, 18, 20, 25, 30, 35, 40, 45, 50, 60, 75, 80, 100];

export const gradingScaleSlug = (n: number): string => `grading-scale/${n}-questions`;
export const gradingScalePath = (n: number): string => `/grading-scale/${n}-questions/`;

/** True for "25-questions" style route params that have a page. */
export function isGradingScaleParam(param: string | undefined): boolean {
  if (!param) return false;
  const m = /^(\d+)-questions$/.exec(param);
  return !!m && GRADING_SCALE_SIZES.includes(Number(m[1]));
}
