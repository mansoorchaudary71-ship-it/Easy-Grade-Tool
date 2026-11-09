/**
 * Status sweep: requests every URL in sitemap.xml (plus the 404/500 pages) and reports anything
 * that is not HTTP 200. 5xx answers are retried with backoff so a one-off GitHub Pages / CDN
 * hiccup is told apart from a URL that is really broken.
 *
 * Usage:
 *   npm run check:status                          # https://www.easygradetool.com
 *   SITE_ORIGIN=http://localhost:4173 npm run check:status
 *   STATUS_CONCURRENCY=2 STATUS_DELAY_MS=500 npm run check:status   # gentler on the server
 *
 * Exit code 1 = at least one URL still failed after retries.
 */
const ORIGIN = (process.env.SITE_ORIGIN || 'https://www.easygradetool.com').replace(/\/+$/, '');
const CONCURRENCY = Math.max(1, Number(process.env.STATUS_CONCURRENCY || 3));
const DELAY_MS = Number(process.env.STATUS_DELAY_MS || 300);
const RETRIES = Number(process.env.STATUS_RETRIES || 3);
const BACKOFF_MS = Number(process.env.STATUS_BACKOFF_MS || 2000);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function status(url: string): Promise<{ code: number; attempts: number }> {
  let code = 0;
  for (let attempt = 1; attempt <= RETRIES + 1; attempt++) {
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': 'EasyGradeTool-StatusCheck/1.0', 'Cache-Control': 'no-cache' },
      });
      code = res.status;
      await res.arrayBuffer();
    } catch {
      code = 0; // network error / timeout
    }
    const retryable = code === 0 || code === 429 || code >= 500;
    if (!retryable) return { code, attempts: attempt };
    if (attempt <= RETRIES) await sleep(BACKOFF_MS * attempt);
  }
  return { code, attempts: RETRIES + 1 };
}

async function main() {
  const sitemapRes = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!sitemapRes.ok) {
    console.error(`sitemap.xml: HTTP ${sitemapRes.status}`);
    process.exit(1);
  }
  const xml = await sitemapRes.text();
  const urls = Array.from(xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g), (m) =>
    // Check the same host we were pointed at (lets this run against localhost).
    ORIGIN + new URL(m[1]).pathname,
  );
  console.log(`Checking ${urls.length} URLs on ${ORIGIN} (concurrency ${CONCURRENCY}, ${RETRIES} retries on 5xx/429)`);

  const failures: string[] = [];
  const flaky: string[] = [];
  let next = 0;
  async function worker() {
    while (next < urls.length) {
      const url = urls[next++];
      const { code, attempts } = await status(url);
      if (code !== 200) failures.push(`${code || 'NETWORK'}  ${url}`);
      else if (attempts > 1) flaky.push(`${url} (200 after ${attempts} attempts)`);
      await sleep(DELAY_MS);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  if (flaky.length) console.log(`\nTransient errors that recovered (CDN hiccups, not a code problem):\n  ${flaky.join('\n  ')}`);
  if (failures.length) {
    console.error(`\nStill failing after retries:\n  ${failures.join('\n  ')}`);
    process.exit(1);
  }
  console.log('\nAll URLs return 200.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
