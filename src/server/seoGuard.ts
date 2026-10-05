import type { NextFunction, Request, Response } from 'express';
import { SITE_URL } from '../data/constants.ts';

/**
 * SEO guard — the last line of defence for canonical/social tags.
 *
 * Even if a stale build, a bad environment variable or a copy-pasted snippet puts a
 * foreign domain into a page, this middleware corrects it in every HTML / XML / text
 * response BEFORE it leaves the server, so Google never sees the wrong domain.
 *
 * It also marks temporary hosting URLs (run.app, replit, github.io, ...) as noindex so
 * they can never compete with, or be mistaken for, the real domain.
 *
 * To block another domain in future, add it to BLOCKED_DOMAINS (one line).
 */

// Domains that must NEVER appear in anything this site outputs.
export const BLOCKED_DOMAINS: string[] = ['easygradecalculator.com'];

// Hosting/preview hostnames that must never be indexed. The real domain is never matched here.
const PREVIEW_HOST_SUFFIXES = [
  '.run.app',
  '.replit.app',
  '.replit.dev',
  '.repl.co',
  '.github.io',
  '.vercel.app',
  '.netlify.app',
  '.web.app',
  '.firebaseapp.com',
  '.onrender.com',
  '.herokuapp.com',
  '.pages.dev',
  '.ngrok-free.app',
];

const SITE_HOST = new URL(SITE_URL).host;
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// https://foreign.com, http://www.foreign.com, //foreign.com  ->  SITE_URL
const URL_RE = new RegExp(
  `(?:https?:)?\\/\\/(?:www\\.)?(?:${BLOCKED_DOMAINS.map(escapeRe).join('|')})`,
  'gi'
);
// bare "foreign.com" or "www.foreign.com" (text, emails, JSON-LD)  ->  site host
const BARE_RE = new RegExp(`(?:www\\.)?(?:${BLOCKED_DOMAINS.map(escapeRe).join('|')})`, 'gi');

/** Replaces every blocked domain in `text` with this site's domain. */
export function scrubForeignDomains(text: string): { text: string; count: number } {
  let count = 0;
  let out = text.replace(URL_RE, () => {
    count += 1;
    return SITE_URL;
  });
  out = out.replace(BARE_RE, () => {
    count += 1;
    return SITE_HOST;
  });
  return { text: out, count };
}

const isRewritableType = (contentType: string) =>
  /text\/html|application\/xml|text\/xml|text\/plain|application\/ld\+json|application\/manifest\+json/i.test(
    contentType
  );

export function seoGuard() {
  const warned = new Set<string>();

  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Never index temporary hosting URLs.
    const host = (req.hostname || '').toLowerCase();
    if (PREVIEW_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))) {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    }

    // 2. Scrub foreign domains from outgoing text responses.
    const originalSend = res.send.bind(res);
    res.send = ((body?: any) => {
      try {
        const type = String(res.getHeader('Content-Type') || '');
        if (isRewritableType(type) && (typeof body === 'string' || Buffer.isBuffer(body))) {
          const original = typeof body === 'string' ? body : body.toString('utf-8');
          const { text, count } = scrubForeignDomains(original);
          if (count > 0) {
            const key = req.path;
            if (!warned.has(key)) {
              warned.add(key);
              console.warn(
                `[seoGuard] corrected ${count} foreign-domain reference(s) in ${key} — rebuild/redeploy to fix the source.`
              );
            }
            return originalSend(text);
          }
        }
      } catch (err) {
        console.warn('[seoGuard] scrub skipped:', err);
      }
      return originalSend(body);
    }) as Response['send'];

    next();
  };
}
