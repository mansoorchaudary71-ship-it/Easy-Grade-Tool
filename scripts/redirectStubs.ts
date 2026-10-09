import { SITE_URL } from '../src/data/constants';
import { LEGACY_REDIRECTS } from '../src/data/legacyRedirects';

/**
 * The redirect table now lives in src/data/legacyRedirects.ts so the client router and these build-time
 * stubs can never disagree. GitHub Pages cannot issue server-side 301s, so build-time stubs are the next
 * best thing: Google treats an instant meta refresh as a redirect and consolidates signals on the target.
 */
export { LEGACY_REDIRECTS };

export function renderRedirectStub(toPath: string): string {
  const url = `${SITE_URL}${toPath}`;
  return `<!doctype html>
<html lang="en" data-redirect-stub>
  <head>
    <meta charset="UTF-8" />
    <title>Redirecting to Easy Grade Tool</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href="${url}" />
    <meta http-equiv="refresh" content="0; url=${toPath}" />
    <script>location.replace(${JSON.stringify(toPath)} + location.search + location.hash);</script>
  </head>
  <body>
    <p>This page has moved to <a href="${toPath}">${url}</a>.</p>
  </body>
</html>
`;
}
