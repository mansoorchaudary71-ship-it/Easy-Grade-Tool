import React, { useEffect } from 'react';
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
   * Targeted search keyword phrases.
   */
  keywords?: string[];

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
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage = OG_IMAGES.default,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords,
  schemaType = 'WebApplication',
  featureList,
  schemaData,
  applicationCategory = 'EducationalApplication',
}) => {
  // Normalize canonical URL to always be absolute
  const resolvedCanonical = canonicalUrl.startsWith('http')
    ? canonicalUrl
    : `${BASE_CANONICAL_ORIGIN}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`;

  // Normalize image URL to always be absolute
  const resolvedImage = ogImage.startsWith('http')
    ? ogImage
    : `${BASE_CANONICAL_ORIGIN}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  // Ensure applicationCategory is explicitly 'EducationalApplication' or 'UtilityApplication'
  const normalizedCategory: 'EducationalApplication' | 'UtilityApplication' =
    applicationCategory === 'EducationalApplication'
      ? 'EducationalApplication'
      : 'UtilityApplication';

  // Default structured data matching WebApplication / SoftwareApplication Schema.org specification
  const structuredData = schemaData || {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${resolvedCanonical}#webapp`,
    name: title,
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
      name: 'Easy Grade Calculator',
      url: resolvedCanonical,
      email: CONTACT_EMAIL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Easy Grade Calculator',
      url: `${BASE_CANONICAL_ORIGIN}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_CANONICAL_ORIGIN}/icon.svg`,
      },
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    ...(featureList && featureList.length > 0 ? { featureList } : {}),
  };

  const isRootCanonical =
    resolvedCanonical === `${BASE_CANONICAL_ORIGIN}/` ||
    resolvedCanonical === BASE_CANONICAL_ORIGIN;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${resolvedCanonical}#breadcrumb`,
    itemListElement: isRootCanonical
      ? [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Easy Grade Calculator',
            item: `${BASE_CANONICAL_ORIGIN}/`,
          },
        ]
      : [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Easy Grade Calculator',
            item: `${BASE_CANONICAL_ORIGIN}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: title.split('—')[0].trim(),
            item: resolvedCanonical,
          },
        ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_CANONICAL_ORIGIN}/#organization`,
    name: 'Easy Grade Calculator',
    url: `${BASE_CANONICAL_ORIGIN}/`,
    email: CONTACT_EMAIL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_CANONICAL_ORIGIN}/icon.svg`,
      width: 512,
      height: 512,
    },
  };

  // Immediate DOM synchronization for headless browser crawlers & client tabs without duplicating tags
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Remove any legacy duplicate data-rh tags injected by react-helmet-async
    document.head
      .querySelectorAll('meta[data-rh="true"], link[data-rh="true"], script[data-rh="true"]')
      .forEach((el) => el.remove());

    // Direct document title sync
    document.title = title;

    // Helper to safely upsert meta elements
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
    if (keywords && keywords.length > 0) {
      updateMeta('name', 'keywords', keywords.join(', '));
    }

    // Canonical link tag sync
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', resolvedCanonical);

    // OpenGraph direct sync
    updateMeta('property', 'og:type', ogType);
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:url', resolvedCanonical);
    updateMeta('property', 'og:image', resolvedImage);
    updateMeta('property', 'og:image:secure_url', resolvedImage);
    updateMeta('property', 'og:image:type', 'image/png');
    updateMeta('property', 'og:image:width', '1200');
    updateMeta('property', 'og:image:height', '630');
    updateMeta('property', 'og:image:alt', title);
    updateMeta('property', 'og:site_name', 'Easy Grade Calculator');

    // Twitter Card direct sync
    updateMeta('name', 'twitter:card', twitterCard);
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', resolvedImage);
    updateMeta('name', 'twitter:image:alt', title);

    // Direct DOM sync for JSON-LD Structured Data script
    let scriptTag = document.querySelector('script#schema-org-webapp') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
    }
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('id', 'schema-org-webapp');
      document.head.appendChild(scriptTag);
    } else {
      scriptTag.setAttribute('id', 'schema-org-webapp');
    }
    scriptTag.textContent = JSON.stringify(structuredData, null, 2);

    // Direct DOM sync for BreadcrumbList JSON-LD script
    let breadcrumbTag = document.querySelector('script#schema-org-breadcrumb') as HTMLScriptElement | null;
    if (!breadcrumbTag) {
      breadcrumbTag = document.createElement('script');
      breadcrumbTag.setAttribute('type', 'application/ld+json');
      breadcrumbTag.setAttribute('id', 'schema-org-breadcrumb');
      document.head.appendChild(breadcrumbTag);
    }
    breadcrumbTag.textContent = JSON.stringify(breadcrumbSchema, null, 2);

    // Direct DOM sync for Organization JSON-LD script
    let orgTag = document.querySelector('script#schema-org-organization') as HTMLScriptElement | null;
    if (!orgTag) {
      orgTag = document.createElement('script');
      orgTag.setAttribute('type', 'application/ld+json');
      orgTag.setAttribute('id', 'schema-org-organization');
      document.head.appendChild(orgTag);
    }
    orgTag.textContent = JSON.stringify(organizationSchema, null, 2);

    // Ensure static informational pages (/about, /privacy) do not retain FAQ or HowTo schemas
    if (resolvedCanonical.endsWith('/about') || resolvedCanonical.endsWith('/privacy')) {
      document.querySelector('script#schema-org-faq')?.remove();
      document.querySelector('script#schema-org-howto')?.remove();
      document.querySelector('script#schema-org-cgpa-howto')?.remove();
    } else if (!resolvedCanonical.endsWith('/cgpa-to-percentage-calculator')) {
      document.querySelector('script#schema-org-cgpa-howto')?.remove();
    }
  }, [
    title,
    description,
    resolvedCanonical,
    resolvedImage,
    ogType,
    twitterCard,
    keywords,
    structuredData,
    breadcrumbSchema,
    organizationSchema,
  ]);

  return null;
};
