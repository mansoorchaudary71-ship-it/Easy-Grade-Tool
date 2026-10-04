import { ToolKey } from '../types.ts';
export type { ToolKey };
export { CONTACT_EMAIL, SITE_URL, BASE_CANONICAL_ORIGIN } from './constants.ts';
import { SITE_URL, BASE_CANONICAL_ORIGIN } from './constants.ts';
import { PROGRAMMATIC_SEO_REGISTRY } from './programmaticSeoData.ts';

export interface RouteSeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  canonicalUrl: string;
  ogImagePlaceholder: string;
  ogType: 'website' | 'article';
  keywords: string[];
  schemaType: 'WebApplication' | 'SoftwareApplication';
  applicationCategory: string;
  featureList: string[];
}

/**
 * Single source of truth for platform launch and structured data timestamps (ISO 8601).
 * SITE_LAUNCH_DATE represents the initial platform publication date.
 * SITE_LAST_MODIFIED represents the date of the latest content, formula, and methodology review.
 */
export const SITE_LAUNCH_DATE: string = '2024-01-15T00:00:00Z';
export const SITE_LAST_MODIFIED: string = '2026-10-04T00:00:00Z';

/**
 * Returns the resolved canonical origin.
 */
export function getBaseOrigin(): string {
  return SITE_URL;
}

/**
 * 1200x630px social share card image assets.
 */
export const OG_IMAGES: Record<ToolKey | 'default', string> = {
  quick: `${BASE_CANONICAL_ORIGIN}/og-cards/grade-calculator-1200x630.png`,
  gpa: `${BASE_CANONICAL_ORIGIN}/og-cards/gpa-calculator-1200x630.png`,
  cgpa: `${BASE_CANONICAL_ORIGIN}/og-cards/cgpa-calculator-1200x630.png`,
  tip: `${BASE_CANONICAL_ORIGIN}/og-cards/tip-calculator-1200x630.png`,
  percentage: `${BASE_CANONICAL_ORIGIN}/og-cards/percentage-calculator-1200x630.png`,
  loan: `${BASE_CANONICAL_ORIGIN}/og-cards/loan-calculator-1200x630.png`,
  mortgage: `${BASE_CANONICAL_ORIGIN}/og-cards/mortgage-calculator-1200x630.png`,
  password: `${BASE_CANONICAL_ORIGIN}/og-cards/password-generator-1200x630.png`,
  default: `${BASE_CANONICAL_ORIGIN}/og-cards/grade-calculator-1200x630.png`,
};
export const OG_IMAGE_PLACEHOLDERS = OG_IMAGES;

export const SEO_HOME: RouteSeoConfig = {
  title: 'Easy Grade Calculator & EZ Grader Chart | Easy Grade Tool',
  description:
    'Free easy grade calculator and EZ grader chart. Enter the number of questions to see percentage scores, letter grades and a printable chart for any test.',
  canonicalPath: '/',
  canonicalUrl: `${BASE_CANONICAL_ORIGIN}/`,
  ogImagePlaceholder: OG_IMAGES.quick,
  ogType: 'website',
  keywords: [
    'easy grade calculator',
    'quick grade calculator',
    'ez grader',
    'test score calculator',
    'grading chart',
    'grade calculator',
  ],
  schemaType: 'WebApplication',
  applicationCategory: 'EducationalApplication',
  featureList: [
    'Instant Quick Grade & EZ Grader Test Chart',
    'Customizable Standard and Plus/Minus Grading Scales',
    'Weighted Course Grade & Final Exam Simulator',
    'Printable & Downloadable PDF Grading Charts',
    'Offline PWA Utility Support',
  ],
};

export const SEO_STATIC_PAGES: Record<'about' | 'privacy' | 'terms', RouteSeoConfig> = {
  about: {
    title: 'About & Grading Methodology — Easy Grade Tool',
    description:
      'Learn the mathematical formulas behind Easy Grade Tool: weighted course grades, 4.0 US GPA, CGPA to percentage ordinances, and global scales.',
    canonicalPath: '/about',
    canonicalUrl: `${BASE_CANONICAL_ORIGIN}/about`,
    ogImagePlaceholder: OG_IMAGES.default,
    ogType: 'website',
    keywords: [
      'grading methodology',
      'gpa formula',
      'weighted grade formula',
      'cgpa to percentage formula',
      '4.0 scale explained',
      'ects credit conversion',
    ],
    schemaType: 'WebApplication',
    applicationCategory: 'EducationalApplication',
    featureList: [
      'Standard 4.0 US GPA Scale Documentation',
      'Normalized Weighted Grade Formula Breakdown',
      '10.0, 5.0 & 4.0 CGPA University Conversion Ordinances',
      'International Grading Equivalencies (ECTS, UK, Canada)',
    ],
  },
  privacy: {
    title: 'Privacy Policy — Easy Grade Tool',
    description:
      'Easy Grade Tool privacy policy. Transparent client-side calculations, clear data retention policies for voluntary submissions, and user rights.',
    canonicalPath: '/privacy',
    canonicalUrl: `${BASE_CANONICAL_ORIGIN}/privacy`,
    ogImagePlaceholder: OG_IMAGES.default,
    ogType: 'website',
    keywords: [
      'privacy policy',
      'client side calculations',
      'student privacy',
      'secure grade calculator',
      'data retention policy',
    ],
    schemaType: 'WebApplication',
    applicationCategory: 'EducationalApplication',
    featureList: [
      'Private Client-Side Browser Calculations',
      'Transparent Voluntary Form Data Handling',
      'No Behavioral Tracking or Third-Party Ad Cookies',
    ],
  },
  terms: {
    title: 'Terms of Service — Easy Grade Tool',
    description:
      'Read the terms of service, calculation disclaimers, educational license, and usage policies for Easy Grade Tool\'s suite of academic tools.',
    canonicalPath: '/terms',
    canonicalUrl: `${BASE_CANONICAL_ORIGIN}/terms`,
    ogImagePlaceholder: OG_IMAGES.default,
    ogType: 'website',
    keywords: [
      'terms of service',
      'educational license',
      'grade calculation disclaimer',
      'easy grade calculator terms',
    ],
    schemaType: 'WebApplication',
    applicationCategory: 'EducationalApplication',
    featureList: [
      'Free Educational Use License',
      'Transparent Calculation Disclaimers',
      'No Third-Party Advertising Trackers',
    ],
  },
};

export const SEO_ROUTES: Record<ToolKey, RouteSeoConfig> = {
  quick: {
    title: 'Grade Calculator — Weighted Average & Final Exam Score',
    description:
      'Calculate weighted course grades, assignment percentages, and the exact final exam score needed for your target letter grade. Free for students and teachers.',
    canonicalPath: '/grade-calculator',
    canonicalUrl: `${BASE_CANONICAL_ORIGIN}/grade-calculator`,
    ogImagePlaceholder: OG_IMAGE_PLACEHOLDERS.quick,
    ogType: 'website',
    keywords: [
      'grade calculator',
      'weighted grade calculator',
      'final exam grade calculator',
      'course grade calculator',
      'grading scale',
      'test score calculator',
    ],
    schemaType: 'WebApplication',
    applicationCategory: 'EducationalApplication',
    featureList: [
      'Weighted & Points-based Grade Calculation',
      'Target Final Exam Score Simulator',
      'Customizable Standard and Plus/Minus Grading Scales',
      'Comprehensive Grade History & Trajectory Tracking',
      'PDF Grade Report Export',
    ],
  },
  gpa: {
    title: 'GPA Calculator — College & High School 4.0 Scale GPA',
    description:
      'Calculate college and high school semester or cumulative GPA on a 4.0 scale with credit hours, plus/minus grades, and printable PDF transcript reports.',
    canonicalPath: '/gpa-calculator',
    canonicalUrl: `${BASE_CANONICAL_ORIGIN}/gpa-calculator`,
    ogImagePlaceholder: OG_IMAGE_PLACEHOLDERS.gpa,
    ogType: 'website',
    keywords: [
      'gpa calculator',
      'college gpa calculator',
      'cumulative gpa',
      'semester gpa',
      '4.0 scale gpa',
      'credit hours quality points',
    ],
    schemaType: 'WebApplication',
    applicationCategory: 'EducationalApplication',
    featureList: [
      '4.0 and 4.33 Scale GPA Calculation',
      'Weighted Credit Hours & Quality Points',
      'Prior Cumulative GPA & Credits Integration',
      'Dynamic Course List Management',
      'PDF Transcript Summary Export',
    ],
  },
  cgpa: {
    title: 'CGPA to Percentage Calculator — 10.0, 5.0 & 4.0 Scales',
    description:
      'Convert CGPA to percentage and SGPA to CGPA on 10.0, 5.0, and 4.0 scales using verified CBSE, UGC, VTU, Mumbai University, GTU, and SPPU formulas.',
    canonicalPath: '/cgpa-to-percentage-calculator',
    canonicalUrl: `${BASE_CANONICAL_ORIGIN}/cgpa-to-percentage-calculator`,
    ogImagePlaceholder: OG_IMAGE_PLACEHOLDERS.cgpa,
    ogType: 'website',
    keywords: [
      'cgpa to percentage calculator',
      'cgpa to percentage converter',
      'convert cgpa to percentage',
      '10 point cgpa to percentage',
      'vtu cgpa to percentage',
      'mumbai university cgpa to percentage',
      'gtu cgpa to percentage',
      'makaut cgpa to percentage',
      'sppu cgpa to percentage',
      'sgpa to cgpa calculator',
    ],
    schemaType: 'WebApplication',
    applicationCategory: 'EducationalApplication',
    featureList: [
      '10.0, 5.0, and 4.0 Grading Scale CGPA to Percentage Conversion',
      'Verified University Formulas (VTU, Mumbai University, MAKAUT, GTU, SPPU, CBSE, Anna University, BHU, AKTU)',
      'Reverse Percentage to CGPA Calculator',
      'Multi-Semester SGPA to CGPA & Percentage Calculator',
      'Printable & Downloadable PDF Conversion Report',
    ],
  },
  tip: {
    title: 'Tip Calculator — Calculate Gratuity & Split the Bill',
    description:
      'Calculate restaurant tips and split bills evenly among any group in seconds. Choose quick tip percentage presets or custom gratuity with per-person totals.',
    canonicalPath: '/tip-calculator',
    canonicalUrl: `${BASE_CANONICAL_ORIGIN}/tip-calculator`,
    ogImagePlaceholder: OG_IMAGE_PLACEHOLDERS.tip,
    ogType: 'website',
    keywords: [
      'tip calculator',
      'bill splitter',
      'restaurant tip calculator',
      'split the bill',
      'gratuity calculator',
      'per person bill split',
    ],
    schemaType: 'WebApplication',
    applicationCategory: 'UtilityApplication',
    featureList: [
      'Instant Tip Percentage Computation',
      'Multi-Person Bill Splitting',
      'Custom Tip Presets (10%, 15%, 18%, 20%, 25%)',
      'Per-Person and Total Gratuity Breakdown',
    ],
  },
  percentage: {
    title: 'Percentage Calculator — % of a Number & Percent Change',
    description:
      'Calculate percentages instantly: find X% of Y, determine what percent one number is of another, and compute percentage increase or decrease online.',
    canonicalPath: '/percentage-calculator',
    canonicalUrl: `${BASE_CANONICAL_ORIGIN}/percentage-calculator`,
    ogImagePlaceholder: OG_IMAGE_PLACEHOLDERS.percentage,
    ogType: 'website',
    keywords: [
      'percentage calculator',
      'percent of number',
      'percent change calculator',
      'percent difference',
      'percentage increase calculator',
    ],
    schemaType: 'WebApplication',
    applicationCategory: 'UtilityApplication',
    featureList: [
      'Percent of a Number Calculation (X% of Y)',
      'Proportion Percentage Computation (X is what % of Y)',
      'Percentage Increase & Decrease (Percent Change)',
      'Instant Real-Time Formula Results',
    ],
  },
  loan: {
    title: 'Loan Calculator — Monthly Payment & Amortization Table',
    description:
      'Estimate monthly loan payments, total interest costs, and year-by-year amortization schedules for personal, auto, and student loans in seconds.',
    canonicalPath: '/loan-calculator',
    canonicalUrl: `${BASE_CANONICAL_ORIGIN}/loan-calculator`,
    ogImagePlaceholder: OG_IMAGE_PLACEHOLDERS.loan,
    ogType: 'website',
    keywords: [
      'loan calculator',
      'monthly payment calculator',
      'loan interest calculator',
      'amortization schedule',
      'auto and student loan calculator',
    ],
    schemaType: 'WebApplication',
    applicationCategory: 'UtilityApplication',
    featureList: [
      'Monthly Loan Payment Estimation',
      'Principal vs. Total Interest Breakdown',
      'Annual Amortization Payoff Schedule',
      'PDF Loan Report Export',
    ],
  },
  mortgage: {
    title: 'Mortgage Calculator — Monthly Home Loan & Interest Cost',
    description:
      'Calculate your monthly home mortgage payment, principal and interest split, and total loan cost over 15-year or 30-year fixed mortgage terms.',
    canonicalPath: '/mortgage-calculator',
    canonicalUrl: `${BASE_CANONICAL_ORIGIN}/mortgage-calculator`,
    ogImagePlaceholder: OG_IMAGE_PLACEHOLDERS.mortgage,
    ogType: 'website',
    keywords: [
      'mortgage calculator',
      'home loan calculator',
      'monthly mortgage payment',
      'mortgage interest calculator',
      'fixed rate mortgage payment',
    ],
    schemaType: 'WebApplication',
    applicationCategory: 'UtilityApplication',
    featureList: [
      'Monthly Mortgage Payment Estimation',
      'Principal & Total Interest Breakdown',
      'Fixed-Rate Term Comparison',
      'PDF Mortgage Summary Export',
    ],
  },
  password: {
    title: 'Password Generator — Create Strong, Random Passwords',
    description:
      'Generate high-entropy, cryptographically secure random passwords locally in your browser with customizable length, numbers, and symbols.',
    canonicalPath: '/password-generator',
    canonicalUrl: `${BASE_CANONICAL_ORIGIN}/password-generator`,
    ogImagePlaceholder: OG_IMAGE_PLACEHOLDERS.password,
    ogType: 'website',
    keywords: [
      'password generator',
      'secure password generator',
      'random password generator',
      'strong password creator',
      'client side password tool',
    ],
    schemaType: 'WebApplication',
    applicationCategory: 'UtilityApplication',
    featureList: [
      'Cryptographically Secure Random Generation (Web Crypto API)',
      'Configurable Character Sets (Letters, Digits, Symbols)',
      'Look-Alike Character Filtering (Excludes I, O, l, 1, 0)',
      '100% In-Browser Cryptographic Generation',
    ],
  },
};

export interface SitemapRouteEntry {
  path: string;
  name: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const SITEMAP_VARIATIONS: SitemapRouteEntry[] = [
  {
    path: '/',
    name: SEO_HOME.title,
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    path: '/grade-calculator',
    name: SEO_ROUTES.quick.title,
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    path: '/gpa-calculator',
    name: SEO_ROUTES.gpa.title,
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    path: '/cgpa-to-percentage-calculator',
    name: SEO_ROUTES.cgpa.title,
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    path: '/tip-calculator',
    name: SEO_ROUTES.tip.title,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/percentage-calculator',
    name: SEO_ROUTES.percentage.title,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/loan-calculator',
    name: SEO_ROUTES.loan.title,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/mortgage-calculator',
    name: SEO_ROUTES.mortgage.title,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/password-generator',
    name: SEO_ROUTES.password.title,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: '/about',
    name: SEO_STATIC_PAGES.about.title,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/privacy',
    name: SEO_STATIC_PAGES.privacy.title,
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/terms',
    name: SEO_STATIC_PAGES.terms.title,
    changefreq: 'yearly',
    priority: 0.3,
  },
  ...Object.values(PROGRAMMATIC_SEO_REGISTRY).map((entry) => ({
    path: entry.path,
    name: entry.title,
    changefreq: 'weekly' as const,
    priority: 0.7,
  })),
];

/**
 * Dynamically builds a valid XML sitemap string based on current routes and calculator variations.
 */
export function generateSitemapXml(
  origin: string = SITE_URL,
  perUrlLastmod?: Record<string, string>
): string {
  const cleanOrigin = origin.replace(/\/+$/, '');
  const fallbackLastMod = SITE_LAST_MODIFIED.split('T')[0];

  const urlElements = SITEMAP_VARIATIONS.map((entry) => {
    const loc = `${cleanOrigin}${entry.path.startsWith('/') ? entry.path : `/${entry.path}`}`;
    const lastmod = (perUrlLastmod && perUrlLastmod[entry.path]) || fallbackLastMod;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>
`;
}

/**
 * Generates an optimized robots.txt specifically configured for an interactive web tool application.
 * Grants search engine crawlers (Googlebot, Bingbot, etc.) unrestricted access to all essential
 * JavaScript bundles, CSS stylesheets, web fonts, and static assets needed for accurate DOM rendering.
 */
export function generateRobotsTxt(origin: string = SITE_URL): string {
  const cleanOrigin = origin.replace(/\/+$/, '');
  const sitemapUrl = `${cleanOrigin}/sitemap.xml`;
  const domainHost = cleanOrigin.replace(/^https?:\/\//, '');

  return `# robots.txt for Easy Grade Tool (${domainHost})
User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${sitemapUrl}
`;
}


