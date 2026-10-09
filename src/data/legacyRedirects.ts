/**
 * Legacy / alias URL -> canonical URL. ONE table, used by:
 *  - src/App.tsx (client-side <Navigate> routes)
 *  - scripts/redirectStubs.ts (build-time redirect stubs for crawlers on GitHub Pages)
 * Targets always use the trailing-slash form that the canonicals and sitemap use.
 * If you later put Cloudflare (or any host with real redirects) in front, mirror this table there.
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  // Old nested URLs (before flattening to hub-and-spoke)
  '/easy-grade-calculator/final-exam-grade-calculator': '/final-exam-grade-calculator/',
  '/easy-grade-calculator/ez-grader': '/',
  '/ez-grader': '/',
  '/easy-grade-calculator/college-final-grade-calculator': '/final-exam-grade-calculator/',
  '/easy-grade-calculator/high-school-test-grader': '/',
  '/easy-grade-calculator/weighted-grade-calculator': '/grade-calculator/',
  '/easy-grade-calculator/test-score': '/test-grade-calculator/',
  '/easy-grade-calculator/gpa': '/gpa-calculator/',
  '/easy-grade-calculator/semester-gpa-calculator': '/gpa-calculator/',
  '/easy-grade-calculator': '/grade-calculator/',
  // Short aliases
  '/gpa': '/gpa-calculator/',
  '/cgpa': '/cgpa-to-percentage-calculator/',
  '/cgpa-to-percentage': '/cgpa-to-percentage-calculator/',
  '/cgpa-calculator': '/cgpa-to-percentage-calculator/',
  '/tip': '/tip-calculator/',
  '/percentage': '/percentage-calculator/',
  '/loan': '/loan-calculator/',
  '/mortgage': '/mortgage-calculator/',
  '/password': '/password-generator/',
  '/final-grade': '/final-exam-grade-calculator/',
  '/final-grade-calculator': '/final-exam-grade-calculator/',
  '/weighted-grade': '/grade-calculator/',
  '/weighted-grade-calculator': '/grade-calculator/',
  '/curve-calculator': '/grade-curve-calculator/',
  '/test-score-calculator': '/test-grade-calculator/',
  '/quiz-grade-calculator': '/test-grade-calculator/',
  '/easy-grader': '/',
  // Policy / methodology aliases
  '/privacy-policy': '/privacy/',
  '/terms-of-service': '/terms/',
  '/terms-and-conditions': '/terms/',
  '/methodology': '/about/',
  '/about-methodology': '/about/',
};
