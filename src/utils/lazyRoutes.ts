import { lazy } from 'react';
import type { ComponentType } from 'react';

/**
 * Route-level code splitting. Previously every calculator (CGPA data, loan/mortgage maths, PDF helpers ...)
 * was statically imported by App.tsx, so the homepage downloaded all of it (~550 KB JS before gzip).
 * Now each secondary route is its own chunk; the homepage and weighted-grade route stay in the main bundle.
 *
 * Pre-rendered HTML is unaffected (prerender passes real components via `syncComponents`), and main.tsx
 * awaits the current route's chunk before hydrating, so there is never a visible loading state.
 */
const loaders = {
  gpa: () => import('../components/GpaCalculator').then((m) => ({ default: m.GpaCalculator as ComponentType<any> })),
  cgpa: () => import('../components/CgpaToPercentage').then((m) => ({ default: m.CgpaToPercentage as ComponentType<any> })),
  tip: () => import('../components/TipCalculator').then((m) => ({ default: m.TipCalculator as ComponentType<any> })),
  percentage: () => import('../components/PercentageCalculator').then((m) => ({ default: m.PercentageCalculator as ComponentType<any> })),
  loan: () => import('../components/LoanCalculator').then((m) => ({ default: m.LoanCalculator as ComponentType<any> })),
  mortgage: () => import('../components/MortgageCalculator').then((m) => ({ default: m.MortgageCalculator as ComponentType<any> })),
  password: () => import('../components/PasswordGenerator').then((m) => ({ default: m.PasswordGenerator as ComponentType<any> })),
  privacy: () => import('../components/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicy as ComponentType<any> })),
  terms: () => import('../components/TermsOfService').then((m) => ({ default: m.TermsOfService as ComponentType<any> })),
  about: () => import('../components/AboutMethodology').then((m) => ({ default: m.AboutMethodology as ComponentType<any> })),
  programmatic: () => import('../components/ProgrammaticCalculatorView').then((m) => ({ default: m.ProgrammaticCalculatorView as ComponentType<any> })),
  toolPage: () => import('../components/ToolPage').then((m) => ({ default: m.ToolPage as ComponentType<any> })),
  palette: () => import('../components/CommandPalette').then((m) => ({ default: m.CommandPalette as ComponentType<any> })),
};

export const LazyGpa = lazy(loaders.gpa);
export const LazyCgpa = lazy(loaders.cgpa);
export const LazyTip = lazy(loaders.tip);
export const LazyPercentage = lazy(loaders.percentage);
export const LazyLoan = lazy(loaders.loan);
export const LazyMortgage = lazy(loaders.mortgage);
export const LazyPassword = lazy(loaders.password);
export const LazyPrivacy = lazy(loaders.privacy);
export const LazyTerms = lazy(loaders.terms);
export const LazyAbout = lazy(loaders.about);
export const LazyProgrammatic = lazy(loaders.programmatic);
export const LazyToolPage = lazy(loaders.toolPage);
export const LazyPalette = lazy(loaders.palette);

/** Loads the chunk for a pathname (used before hydration and on hover/focus intent). */
export function preloadForPath(pathname: string): Promise<unknown> {
  const p = (pathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
  if (p === '/' || p === '/grade-calculator') return Promise.resolve();
  if (p === '/gpa-calculator') return loaders.gpa();
  if (p === '/cgpa-to-percentage-calculator') return loaders.cgpa();
  if (p === '/tip-calculator') return loaders.tip();
  if (p === '/percentage-calculator') return loaders.percentage();
  if (p === '/loan-calculator') return loaders.loan();
  if (p === '/mortgage-calculator') return loaders.mortgage();
  if (p === '/password-generator') return loaders.password();
  if (p === '/privacy') return loaders.privacy();
  if (p === '/terms') return loaders.terms();
  if (p === '/about') return loaders.about();
  if (p === '/final-exam-grade-calculator') return loaders.programmatic();
  if (['/test-grade-calculator', '/grade-curve-calculator', '/letter-grade-calculator', '/average-grade-calculator', '/grading-scale'].includes(p)) return loaders.toolPage();
  if (p.startsWith('/grading-scale/')) return loaders.toolPage();
  return Promise.resolve();
}
