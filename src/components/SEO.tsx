import React, { useEffect, useMemo } from 'react';
import { BASE_CANONICAL_ORIGIN, OG_IMAGES, CONTACT_EMAIL, SITE_LAUNCH_DATE, SITE_LAST_MODIFIED } from '../data/seoConfig';

export interface SEOProps {
  /**
   * Highly targeted, unique page title (<title>, og:title, twitter:title).
   * E.g. 'Free Online GPA Calculator — Calculate Your Cumulative GPA'
   */
  title: string;

  /**
   * High-converting, descriptive meta description (120-160 characters).
   */
  description: string;

  /**
   * Absolute canonical URL for the active calculator route.
   */
  canonicalUrl: string;

  /**
   * 1200x630px social share card image URL (Open Graph & Twitter Card).
   * Default fallback points to dedicated placeholder image URLs in /og-cards/.
   * You can swap in your custom hosted 1200x630px social cards anytime.
   */
  ogImage?: string;

  /**
   * Open Graph type (defaults to 'website').
   */
  ogType?: 'website' | 'article';

  /**
   * Twitter Card layout (defaults to 'summary_large_image' for 1200x630px cards).
   */
  twitterCard?: 'summary' | 'summary_large_image';

  /**
   * Kept for backwards compatibility. Google ignores the keywords meta tag, so it is no longer written.
   */
  keywords?: string[];

  /**
   * Short product name for the WebApplication schema (for example "Weighted Grade Calculator").
   * Defaults to the first part of the title, before a "|" or an em dash.
   */
  name?: string;

  /**
   * Label used for the last breadcrumb item. Defaults to `name`.
   */
  breadcrumbLabel?: string;

  /**
   * Type of software schema ('WebApplication' or 'SoftwareApplication').
   * Defaults to 'WebApplication'.
   */
  schemaType?: 'WebApplication' | 'SoftwareApplication';

  /**
   * Specific features provided by this utility/educational tool.
   */
  featureList?: string[];

  /**
   * Custom Schema.org JSON-LD structured data payload.
   */
  schemaData?: Record<string, any>;

  /**
   * Category for default WebApplication structured data.
   * Explicitly set to 'UtilityApplication' or 'EducationalApplication'.
   */
  applicationCategory?: 'UtilityApplication' | 'EducationalApplication' | string;
}

/**
 * Reusable SEO component for dynamic head management powered by `react-helmet-async`.
 *
 * Provides:
 * 1. Synchronized <title>, <meta name="description">, and <link rel="canonical">
 * 2. Open Graph meta tags (og:title, og:description, og:image, og:url, og:type, og:site_name)
 * 3. Twitter Card meta tags (twitter:card, twitter:title, twitter:description, twitter:image)
 * 4. 1200x630px social card placeholder image fallbacks ready for custom replacements
 * 5. Structured Data (Schema.org JSON-LD WebApplication/SoftwareApplication) for rich search engine snippets
 */
/** First segment of a title such as "Weighted Grade Calculator | Easy Grade Tool". */
function shortNameFromTitle(title: string): string {
  const first = title.split(/\s[|\u2014\u2013]\s|\s-\s/)[0].trim();
  return first || title;
}

function imageMimeType(url: string): string {
  const clean = url.split(/[?#]/)[0].toLowerCase();
  if (clean.endsWith('.jpg') || clean.endsWith('.jpeg')) return 'image/jpeg';
  if (clean.endsWith('.webp')) return 'image/webp';
  if (clean.endsWith('.svg')) return 'image/svg+xml';
  if (clean.endsWith('.gif')) return 'image/gif';
  return 'image/png';
}

/**
 * Reusable SEO component that keeps the document head in sync with the active route.
 *
 * Performance note: the three JSON-LD payloads are built inside useMemo and the effect depends only
 * on primitive strings. The head is therefore rewritten when the page's SEO data really changes,
 * not on every render of the calculator below it.
 */
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage = OG_IMAGES.default,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  schemaType = 'WebApplication',
  featureList,
  schemaData,
  applicationCategory = 'EducationalApplication',
  name,
  breadcrumbLabel,
}) => {
  const resolvedCanonical = canonicalUrl.startsWith('http')
    ? canonicalUrl
    : `${BASE_CANONICAL_ORIGIN}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`;

  const resolvedImage = ogImage.startsWith('http')
    ? ogImage
    : `${BASE_CANONICAL_ORIGIN}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  const normalizedCategory: 'EducationalApplication' | 'UtilityApplication' =
    applicationCategory === 'EducationalApplication' ? 'EducationalApplication' : 'UtilityApplication';

  const productName = name || shortNameFromTitle(title);
  const crumbLabel = breadcrumbLabel || productName;
  const featureKey = featureList ? featureList.join('\u0001') : '';
  const schemaKey = schemaData ? JSON.stringify(schemaData) : '';

  const { webAppJson, breadcrumbJson, orgJson } = useMemo(() => {
    const structuredData =
      schemaData ||
      {
        '@context': 'https://schema.org',
        '@type': schemaType,
        '@id': `${resolvedCanonical}#webapp`,
        name: productName,
        url: resolvedCanonical,
        applicationCategory: normalizedCategory,
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        softwareVersion: '1.0.0',
        inLanguage: 'en-US',
        isAccessibleForFree: true,
        description,
        datePublished: SITE_LAUNCH_DATE,
        dateModified: SITE_LAST_MODIFIED,
        author: {
          '@type': 'Organization',
          name: 'Easy Grade Tool',
          url: `${BASE_CANONICAL_ORIGIN}/`,
          email: CONTACT_EMAIL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Easy Grade Tool',
          url: `${BASE_CANONICAL_ORIGIN}/`,
          logo: { '@type': 'ImageObject', url: `${BASE_CANONICAL_ORIGIN}/icon.svg` },
        },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        ...(featureList && featureList.length > 0 ? { featureList } : {}),
      };

    const isRoot =
      resolvedCanonical === `${BASE_CANONICAL_ORIGIN}/` || resolvedCanonical === BASE_CANONICAL_ORIGIN;

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${resolvedCanonical}#breadcrumb`,
      itemListElement: isRoot
        ? [{ '@type': 'ListItem', position: 1, name: 'Easy Grade Tool', item: `${BASE_CANONICAL_ORIGIN}/` }]
        : [
            { '@type': 'ListItem', position: 1, name: 'Easy Grade Tool', item: `${BASE_CANONICAL_ORIGIN}/` },
            { '@type': 'ListItem', position: 2, name: crumbLabel, item: resolvedCanonical },
          ],
    };

    const organization = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${BASE_CANONICAL_ORIGIN}/#organization`,
      name: 'Easy Grade Tool',
      url: `${BASE_CANONICAL_ORIGIN}/`,
      email: CONTACT_EMAIL,
      logo: { '@type': 'ImageObject', url: `${BASE_CANONICAL_ORIGIN}/icon.svg`, width: 512, height: 512 },
    };

    return {
      webAppJson: JSON.stringify(structuredData, null, 2),
      breadcrumbJson: JSON.stringify(breadcrumb, null, 2),
      orgJson: JSON.stringify(organization, null, 2),
    };
    // featureKey and schemaKey stand in for the array/object props so the memo is stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedCanonical, productName, crumbLabel, description, schemaType, normalizedCategory, featureKey, schemaKey]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Remove any legacy duplicate data-rh tags injected by react-helmet-async
    document.head
      .querySelectorAll('meta[data-rh="true"], link[data-rh="true"], script[data-rh="true"]')
      .forEach((el) => el.remove());

    document.title = title;

    const updateMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let meta = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('name', 'description', description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', resolvedCanonical);

    updateMeta('property', 'og:type', ogType);
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:url', resolvedCanonical);
    updateMeta('property', 'og:image', resolvedImage);
    updateMeta('property', 'og:image:secure_url', resolvedImage);
    updateMeta('property', 'og:image:type', imageMimeType(resolvedImage));
    updateMeta('property', 'og:image:width', '1200');
    updateMeta('property', 'og:image:height', '630');
    updateMeta('property', 'og:image:alt', title);
    updateMeta('property', 'og:site_name', 'Easy Grade Tool');

    updateMeta('name', 'twitter:card', twitterCard);
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', resolvedImage);
    updateMeta('name', 'twitter:image:alt', title);

    // The keywords meta tag is ignored by Google; remove a stale one left by an earlier version.
    document.querySelector('meta[name="keywords"]')?.remove();

    const upsertJsonLd = (id: string, json: string, reuseFirst = false) => {
      let tag = document.querySelector(`script#${id}`) as HTMLScriptElement | null;
      if (!tag && reuseFirst) {
        tag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
      }
      if (!tag) {
        tag = document.createElement('script');
        tag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(tag);
      }
      tag.setAttribute('id', id);
      if (tag.textContent !== json) tag.textContent = json;
    };
    upsertJsonLd('schema-org-webapp', webAppJson, true);
    upsertJsonLd('schema-org-breadcrumb', breadcrumbJson);
    upsertJsonLd('schema-org-organization', orgJson);

    // WebSite schema belongs to the home page only
    if (typeof window !== 'undefined' && window.location.pathname.replace(/\/+$/, '') !== '') {
      document.querySelector('script#schema-org-website')?.remove();
    }

    // Static informational pages must not retain FAQ or HowTo schemas
    const path = resolvedCanonical.replace(/\/+$/, '');
    if (path.endsWith('/about') || path.endsWith('/privacy')) {
      document.querySelector('script#schema-org-faq')?.remove();
      document.querySelector('script#schema-org-howto')?.remove();
      document.querySelector('script#schema-org-cgpa-howto')?.remove();
    } else if (!path.endsWith('/cgpa-to-percentage-calculator')) {
      document.querySelector('script#schema-org-cgpa-howto')?.remove();
    }
  }, [title, description, resolvedCanonical, resolvedImage, ogType, twitterCard, webAppJson, breadcrumbJson, orgJson]);

  return null;
};
