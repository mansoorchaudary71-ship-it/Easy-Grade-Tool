/**
 * Routes whose own component renders <SEO>. The shared SEOHead must stay out of the way on these,
 * otherwise two SEO instances rewrite the same <head> (title, canonical, Open Graph, JSON-LD).
 *
 * Single list used by both App.tsx and SEOHead.tsx.
 */
import { normalizePath } from '../utils/paths';

/** Exact routes (trailing slash and case ignored). */
export const SELF_MANAGED_SEO_PATHS: string[] = [
  '/',
  '/grade-calculator',
  '/final-exam-grade-calculator',
  '/test-grade-calculator',
  '/grade-curve-calculator',
  '/letter-grade-calculator',
  '/average-grade-calculator',
  '/grading-scale',
];

/** Route prefixes whose pages render their own <SEO>. */
export const SELF_MANAGED_SEO_PREFIXES: string[] = ['/easy-grade-calculator/', '/calculator/', '/grading-scale/'];

export function isSelfManagedSeoPath(pathname: string): boolean {
  const clean = normalizePath(pathname);
  if (SELF_MANAGED_SEO_PATHS.includes(clean)) return true;
  const withSlash = clean === '/' ? '/' : `${clean}/`;
  return SELF_MANAGED_SEO_PREFIXES.some((p) => withSlash.startsWith(p.endsWith('/') ? p : `${p}/`) || clean === p);
}
