import { BASE_CANONICAL_ORIGIN, SITE_LAUNCH_DATE, SITE_LAST_MODIFIED } from '../data/seoConfig.ts';
import { SITE_OWNER } from '../data/siteIdentity.ts';

/**
 * One Article / BlogPosting JSON-LD builder shared by the build-time injector (seoHtmlInjector.ts) and the
 * browser <SEO> component, so the static HTML and the client render always carry the same payload.
 */

/** About, privacy, terms and the 404 page are not articles. */
const NON_ARTICLE_PATHS = new Set([
  '/about', '/privacy', '/terms', '/methodology', '/about-methodology', '/privacy-policy', '/terms-of-service', '/404',
]);

function cleanPath(pathOrUrl: string): string {
  const noOrigin = pathOrUrl.replace(/^https?:\/\/[^/]+/i, '');
  return (noOrigin.split(/[?#]/)[0].replace(/\/+$/, '') || '/').toLowerCase();
}

export function shouldHaveArticle(pathOrUrl: string): boolean {
  return !NON_ARTICLE_PATHS.has(cleanPath(pathOrUrl));
}

/** Longer, guide-style headlines that the two hub pages already used before this round. */
const HEADLINE_OVERRIDES: Record<string, string> = {
  '/': 'Easy Grade Calculator: Grading Percentage & Grade Calculator Guide',
  '/grade-calculator': 'Weighted Grade Calculator: How to Calculate Weighted Grades',
};

function absolute(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${BASE_CANONICAL_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
}

export interface ArticleSchemaInput {
  /** Absolute canonical URL of the page. */
  url: string;
  title: string;
  description: string;
  image: string;
}

export function buildArticleSchema({ url, title, description, image }: ArticleSchemaInput): Record<string, unknown> {
  const path = cleanPath(url);
  const isPost = path.startsWith('/blog/');
  const headline = (HEADLINE_OVERRIDES[path] ?? title.replace(/\s*\|\s*Easy Grade Tool\s*$/i, '')).trim().slice(0, 110);

  return {
    '@context': 'https://schema.org',
    '@type': isPost ? 'BlogPosting' : 'Article',
    '@id': `${url}#article`,
    headline,
    name: headline,
    description,
    url,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    datePublished: SITE_LAUNCH_DATE,
    dateModified: SITE_LAST_MODIFIED,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    isPartOf: { '@id': `${BASE_CANONICAL_ORIGIN}/#website` },
    image: [absolute(image)],
    author: SITE_OWNER
      ? {
          '@type': 'Person',
          name: SITE_OWNER.name,
          jobTitle: SITE_OWNER.jobTitle,
          ...(SITE_OWNER.sameAs.length ? { sameAs: SITE_OWNER.sameAs } : {}),
        }
      : { '@type': 'Organization', name: 'Easy Grade Tool', url: `${BASE_CANONICAL_ORIGIN}/` },
    publisher: {
      '@type': 'Organization',
      name: 'Easy Grade Tool',
      url: `${BASE_CANONICAL_ORIGIN}/`,
      logo: { '@type': 'ImageObject', url: `${BASE_CANONICAL_ORIGIN}/pwa-512x512.png` },
    },
  };
}
