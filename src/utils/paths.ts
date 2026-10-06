/**
 * URL helpers.
 *
 * WHY THIS EXISTS
 * The site is hosted on GitHub Pages, which serves every page from a directory
 * (`/gpa-calculator/index.html`). A request for `/gpa-calculator` is therefore
 * answered with a 301 redirect to `/gpa-calculator/`. If canonicals, sitemap
 * entries and internal links all say `/gpa-calculator` (no slash), Google is told
 * "the canonical URL is the one that redirects" - a conflicting signal that causes
 * "Page with redirect" / "Google chose different canonical" statuses and slow
 * indexing. Every URL we publish must therefore use the trailing-slash form that
 * the server really serves.
 */

const EXTERNAL = /^([a-z][a-z0-9+.-]*:|\/\/|#|mailto:|tel:)/i;

/** '/gpa-calculator' -> '/gpa-calculator/'. Keeps '/', query strings, hashes, and file URLs (.xml, .png ...). */
export function toSlashPath(to: string): string {
  if (!to || EXTERNAL.test(to) || !to.startsWith('/')) return to;
  const match = to.match(/^([^?#]*)(.*)$/);
  const pathPart = match ? match[1] : to;
  const rest = match ? match[2] : '';
  if (pathPart === '/' || pathPart.endsWith('/')) return to;
  const last = pathPart.split('/').pop() || '';
  if (last.includes('.')) return to; // file, e.g. /sitemap.xml
  return `${pathPart}/${rest}`;
}

/** '/gpa-calculator/' -> '/gpa-calculator' ; '/' stays '/'. Use for comparing pathnames. */
export function normalizePath(pathname: string): string {
  const p = (pathname || '/').split(/[?#]/)[0].replace(/\/+$/, '');
  return (p || '/').toLowerCase();
}

/** Compare a runtime pathname with a route, ignoring trailing slashes and case. */
export function isSamePath(pathname: string, route: string): boolean {
  return normalizePath(pathname) === normalizePath(route);
}
