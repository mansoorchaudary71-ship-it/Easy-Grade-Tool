/**
 * Compatibility wrapper for react-helmet-async.
 *
 * Version 3 ships a CommonJS bundle whose named exports Node's native ESM loader
 * cannot detect. That broke `npm run build` at the prerender step with:
 *   "The requested module 'react-helmet-async' does not provide an export named 'Helmet'"
 * Importing the namespace and reading from `default` (Node) or the namespace itself
 * (Vite/browser) works in both environments.
 */
import * as RHA from 'react-helmet-async';

const mod: any = (RHA as any).default ?? RHA;

export const Helmet: typeof RHA.Helmet = mod.Helmet;
export const HelmetProvider: typeof RHA.HelmetProvider = mod.HelmetProvider;
