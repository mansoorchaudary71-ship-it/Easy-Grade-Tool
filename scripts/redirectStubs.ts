import { SITE_URL } from '../src/data/constants';

/**
 * Legacy / alias URL -> canonical URL.
 * GitHub Pages cannot issue server-side 301s, so build-time stubs are the next best thing:
 * Google treats an instant meta refresh as a redirect and consolidates signals on the canonical target.
 * If you later put Cloudflare (or any host with real redirects) in front, mirror this table there.
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  // Old nested URLs (before flattening to hub-and-spoke)
  '/easy-grade-calculator/final-exam-grade-calculator': '/final-exam-grade-calculator/',
  '/easy-grade-calculator/ez-grader': '/ez-grader/',
  '/easy-grade-calculator/college-final-grade-calculator': '/final-exam-grade-calculator/',
  '/easy-grade-calculator/high-school-test-grader': '/ez-grader/',
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
  '/easy-grader': '/ez-grader/',
  // Policy / methodology aliases
  '/privacy-policy': '/privacy/',
  '/terms-of-service': '/terms/',
  '/terms-and-conditions': '/terms/',
  '/methodology': '/about/',
  '/about-methodology': '/about/',
};

export function renderRedirectStub(toPath: string): string {
  const url = `${SITE_URL}${toPath}`;
  return `<!doctype html>
<html lang="en" data-redirect-stub>
  <head>
    <meta charset="UTF-8" />
    <title>Redirecting to Easy Grade Tool</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href="${url}" />
    <meta http-equiv="refresh" content="0; url=${toPath}" />
    <script>location.replace(${JSON.stringify(toPath)} + location.search + location.hash);</script>
  </head>
  <body>
    <p>This page has moved to <a href="${toPath}">${url}</a>.</p>
  </body>
</html>
`;
}
