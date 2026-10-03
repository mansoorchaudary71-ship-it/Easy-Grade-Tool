import { ToolKey } from '../types.ts';
import {
  SEO_HOME,
  SEO_ROUTES,
  SEO_STATIC_PAGES,
  RouteSeoConfig,
  BASE_CANONICAL_ORIGIN,
  CONTACT_EMAIL,
  SITE_LAUNCH_DATE,
  SITE_LAST_MODIFIED,
} from '../data/seoConfig.ts';
import { resolveProgrammaticSeo } from '../data/programmaticSeoData.ts';
import { getFaqSchema, TOOL_FAQS, WEIGHTED_COURSE_FAQS, FAQItem } from '../components/FAQ.tsx';
import { getHowToSchema } from '../components/ManualGradeHowTo.tsx';
import { getCgpaHowToSchema } from '../components/CgpaEducationalGuide.tsx';

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export interface ResolvedRouteSeo {
  config: RouteSeoConfig;
  toolKey: ToolKey;
  hasFaq: boolean;
  customFaqItems?: FAQItem[];
  hasGradeHowTo: boolean;
  hasCgpaHowTo: boolean;
  cleanPath: string;
}

export function resolveSeoForPath(rawPath: string): ResolvedRouteSeo {
  const cleanPath = (rawPath.split('?')[0].replace(/\/+$/, '') || '/').toLowerCase();

  if (cleanPath === '/') {
    return {
      config: SEO_HOME,
      toolKey: 'quick',
      hasFaq: true,
      hasGradeHowTo: true,
      hasCgpaHowTo: false,
      cleanPath,
    };
  }

  if (cleanPath === '/grade-calculator') {
    return {
      config: SEO_ROUTES.quick,
      toolKey: 'quick',
      hasFaq: true,
      customFaqItems: WEIGHTED_COURSE_FAQS,
      hasGradeHowTo: false,
      hasCgpaHowTo: false,
      cleanPath,
    };
  }

  if (cleanPath === '/gpa-calculator') {
    return {
      config: SEO_ROUTES.gpa,
      toolKey: 'gpa',
      hasFaq: true,
      hasGradeHowTo: false,
      hasCgpaHowTo: false,
      cleanPath,
    };
  }

  if (cleanPath === '/cgpa-to-percentage-calculator') {
    return {
      config: SEO_ROUTES.cgpa,
      toolKey: 'cgpa',
      hasFaq: true,
      hasGradeHowTo: false,
      hasCgpaHowTo: true,
      cleanPath,
    };
  }

  if (cleanPath === '/tip-calculator') {
    return {
      config: SEO_ROUTES.tip,
      toolKey: 'tip',
      hasFaq: true,
      hasGradeHowTo: false,
      hasCgpaHowTo: false,
      cleanPath,
    };
  }

  if (cleanPath === '/percentage-calculator') {
    return {
      config: SEO_ROUTES.percentage,
      toolKey: 'percentage',
      hasFaq: true,
      hasGradeHowTo: false,
      hasCgpaHowTo: false,
      cleanPath,
    };
  }

  if (cleanPath === '/loan-calculator') {
    return {
      config: SEO_ROUTES.loan,
      toolKey: 'loan',
      hasFaq: true,
      hasGradeHowTo: false,
      hasCgpaHowTo: false,
      cleanPath,
    };
  }

  if (cleanPath === '/mortgage-calculator') {
    return {
      config: SEO_ROUTES.mortgage,
      toolKey: 'mortgage',
      hasFaq: true,
      hasGradeHowTo: false,
      hasCgpaHowTo: false,
      cleanPath,
    };
  }

  if (cleanPath === '/password-generator') {
    return {
      config: SEO_ROUTES.password,
      toolKey: 'password',
      hasFaq: true,
      hasGradeHowTo: false,
      hasCgpaHowTo: false,
      cleanPath,
    };
  }

  if (
    cleanPath === '/about' ||
    cleanPath === '/methodology' ||
    cleanPath === '/about-methodology'
  ) {
    return {
      config: SEO_STATIC_PAGES.about,
      toolKey: 'quick',
      hasFaq: false,
      hasGradeHowTo: false,
      hasCgpaHowTo: false,
      cleanPath: '/about',
    };
  }

  if (cleanPath === '/privacy' || cleanPath === '/privacy-policy') {
    return {
      config: SEO_STATIC_PAGES.privacy,
      toolKey: 'quick',
      hasFaq: false,
      hasGradeHowTo: false,
      hasCgpaHowTo: false,
      cleanPath: '/privacy',
    };
  }

  if (
    cleanPath === '/terms' ||
    cleanPath === '/terms-of-service' ||
    cleanPath === '/terms-and-conditions'
  ) {
    return {
      config: SEO_STATIC_PAGES.terms,
      toolKey: 'quick',
      hasFaq: false,
      hasGradeHowTo: false,
      hasCgpaHowTo: false,
      cleanPath: '/terms',
    };
  }

  if (
    cleanPath.startsWith('/easy-grade-calculator/') ||
    cleanPath.startsWith('/calculator/')
  ) {
    const slug = cleanPath.split('/').pop() || 'final-exam-grade-calculator';
    const entry = resolveProgrammaticSeo(slug);
    const canonicalPath = entry.path;
    const canonicalUrl = `${BASE_CANONICAL_ORIGIN}${entry.path}`;

    return {
      config: {
        title: entry.title,
        description: entry.metaDescription,
        canonicalPath,
        canonicalUrl,
        ogImagePlaceholder: SEO_ROUTES[entry.toolKey]?.ogImagePlaceholder || SEO_HOME.ogImagePlaceholder,
        ogType: 'website',
        keywords: [
          entry.h1.toLowerCase(),
          'final exam grade calculator',
          'ez grader online',
          'test scoring chart',
          'target grade simulator',
        ],
        schemaType: 'WebApplication',
        applicationCategory: 'EducationalApplication',
        featureList: [
          `${entry.h1} Engine`,
          'Step-by-Step Mathematical Walkthrough',
          'Interactive Target Solver',
          'Print & PDF Friendly Format',
          'Zero Account Needed & 100% Client-Side Privacy',
        ],
      },
      toolKey: entry.toolKey,
      hasFaq: true,
      customFaqItems: entry.customFaqs,
      hasGradeHowTo: false,
      hasCgpaHowTo: false,
      cleanPath: entry.path,
    };
  }

  return {
    config: SEO_HOME,
    toolKey: 'quick',
    hasFaq: true,
    hasGradeHowTo: true,
    hasCgpaHowTo: false,
    cleanPath: '/',
  };
}

/**
 * Injects route-specific <title>, <meta>, <link rel="canonical">, OpenGraph/Twitter tags,
 * and Schema.org JSON-LD scripts into an HTML template string.
 */
export function injectRouteSeoIntoHtml(rawHtml: string, rawPath: string): string {
  const {
    config,
    toolKey,
    hasFaq,
    customFaqItems,
    hasGradeHowTo,
    hasCgpaHowTo,
    cleanPath,
  } = resolveSeoForPath(rawPath);

  let html = rawHtml;
  const safeTitle = escapeHtmlAttr(config.title);
  const safeDesc = escapeHtmlAttr(config.description);
  const safeCanonical = escapeHtmlAttr(config.canonicalUrl);
  const safeOgImage = escapeHtmlAttr(config.ogImagePlaceholder);

  // 1. <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);

  // 2. <meta name="description">
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${safeDesc}" />`
  );

  // 3. <link rel="canonical">
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${safeCanonical}" />`
  );

  // 4. OpenGraph & Twitter Card tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${safeCanonical}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${safeOgImage}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image:secure_url" content="${safeOgImage}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${safeOgImage}" />`
  );

  // Deduplicate <link rel="manifest"> if vite-plugin-pwa injected a second tag
  let manifestCount = 0;
  html = html.replace(/<link\s+rel="manifest"\s+href="[^"]*"\s*\/?>/gi, (match) => {
    manifestCount += 1;
    return manifestCount === 1 ? '<link rel="manifest" href="/manifest.json" />' : '';
  });

  // 5. Build JSON-LD Schemas
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': config.schemaType || 'WebApplication',
    '@id': `${config.canonicalUrl}#webapp`,
    name: config.title,
    url: config.canonicalUrl,
    applicationCategory: config.applicationCategory,
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0.0',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    description: config.description,
    datePublished: SITE_LAUNCH_DATE,
    dateModified: SITE_LAST_MODIFIED,
    author: {
      '@type': 'Organization',
      name: 'Easy Grade Calculator',
      url: config.canonicalUrl,
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
    ...(config.featureList && config.featureList.length > 0
      ? { featureList: config.featureList }
      : {}),
  };

  const isRootCanonical =
    config.canonicalUrl === `${BASE_CANONICAL_ORIGIN}/` ||
    config.canonicalUrl === BASE_CANONICAL_ORIGIN;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${config.canonicalUrl}#breadcrumb`,
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
            name: config.title.split('—')[0].trim(),
            item: config.canonicalUrl,
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

  const scripts: string[] = [
    `<script id="schema-org-webapp" type="application/ld+json">\n${JSON.stringify(webAppSchema, null, 2)}\n</script>`,
    `<script id="schema-org-breadcrumb" type="application/ld+json">\n${JSON.stringify(breadcrumbSchema, null, 2)}\n</script>`,
    `<script id="schema-org-organization" type="application/ld+json">\n${JSON.stringify(organizationSchema, null, 2)}\n</script>`,
  ];

  if (hasFaq) {
    const faqSchema = customFaqItems
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: customFaqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : getFaqSchema(toolKey);
    scripts.push(
      `<script id="schema-org-faq" type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n</script>`
    );
  }

  if (hasGradeHowTo) {
    const howToSchema = getHowToSchema(BASE_CANONICAL_ORIGIN, cleanPath);
    scripts.push(
      `<script id="schema-org-howto" type="application/ld+json">\n${JSON.stringify(howToSchema, null, 2)}\n</script>`
    );
  }

  if (hasCgpaHowTo) {
    const cgpaHowToSchema = getCgpaHowToSchema(BASE_CANONICAL_ORIGIN);
    scripts.push(
      `<script id="schema-org-cgpa-howto" type="application/ld+json">\n${JSON.stringify(cgpaHowToSchema, null, 2)}\n</script>`
    );
  }

  // Remove any existing JSON-LD scripts in <head> so we insert a clean, duplicate-free set
  html = html.replace(
    /\s*<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi,
    ''
  );

  html = html.replace('</head>', `    ${scripts.join('\n    ')}\n  </head>`);

  return html;
}
