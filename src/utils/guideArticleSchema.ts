import { BASE_CANONICAL_ORIGIN, SITE_LAUNCH_DATE, SITE_LAST_MODIFIED, CONTACT_EMAIL } from '../data/seoConfig';

/**
 * Generates Schema.org Article structured data for the Educational Guide.
 * Pure module (no React) so both the client-side guide component and the
 * prerender SEO injector share this one definition.
 */
export function getEducationalGuideSchema(
  canonicalOrigin: string = BASE_CANONICAL_ORIGIN,
  routePath: string = '/'
) {
  const cleanOrigin = canonicalOrigin.replace(/\/+$/, '');
  const isWeighted = routePath.replace(/\/+$/, '') === '/grade-calculator';
  const normalizedPath = isWeighted ? '/grade-calculator' : '/';
  const url = `${cleanOrigin}${normalizedPath}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#educational-guide`,
    headline: isWeighted
      ? 'Weighted Grade Calculator: How to Calculate Weighted Grades'
      : 'Easy Grade Calculator: Grading Percentage & Grade Calculator Guide',
    name: isWeighted
      ? 'Weighted Grade Calculator: How to Calculate Weighted Grades'
      : 'Easy Grade Calculator: Grading Percentage & Grade Calculator Guide',
    description: isWeighted
      ? 'Guide to weighted grade calculation, how final exam weight affects your course grade, and how to work out the score you need on the final exam.'
      : 'Complete educational guide explaining test score percentages, wrong-answer deductions, EZ grader charts, and institutional grading scales.',
    inLanguage: 'en-US',
    datePublished: SITE_LAUNCH_DATE,
    dateModified: SITE_LAST_MODIFIED,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: `${cleanOrigin}/images/easy-grade-calculator-guide.webp`,
    author: {
      '@type': 'Organization',
      name: 'Easy Grade Tool',
      url: `${cleanOrigin}/`,
      email: CONTACT_EMAIL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Easy Grade Tool',
      url: `${cleanOrigin}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${cleanOrigin}/pwa-512x512.png`,
      },
    },
  };
}
