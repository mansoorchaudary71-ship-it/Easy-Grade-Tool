/**
 * Single source of truth for WHO is behind the site (E-E-A-T signal).
 *
 * Both audit reports flag the lack of a named, accountable owner. Edit the values below
 * once; they flow into the About page, every tool-page byline, the footer and the
 * Person/Organization JSON-LD.
 *
 * - Leave `reviewer` as null until a real, named academic reviewer has agreed to be listed.
 *   Never invent one: unverifiable credentials hurt trust more than having none.
 * - `sameAs` should list real profiles (GitHub, LinkedIn, X ...). Empty arrays are omitted from schema.
 */
export interface SitePerson {
  name: string;
  jobTitle: string;
  sameAs: string[];
}

/** Keep null to publish no personal name anywhere (About page, bylines, schema). Set an object to show one. */
export const SITE_OWNER: SitePerson | null = null;

export const ACADEMIC_REVIEWER: (SitePerson & { credential: string }) | null = null;

/** ISO date (YYYY-MM-DD) the formulas and grading tables were last checked. Bump when you re-verify. */
export const CONTENT_REVIEWED_ON = '2026-10-06';

export const CORRECTIONS_EMAIL = 'support@easygradetool.com';
