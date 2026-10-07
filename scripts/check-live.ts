/**
 * Live deployment check.
 *
 * Fetches the real production pages and confirms that what Google will see matches
 * what this repo builds: correct canonical, og:url, og:image, twitter:image, no
 * foreign domain, and the same <title> as the local dist/ build (catches a stale deploy).
 *
 * Usage:
 *   npm run check:live                      # checks https://www.easygradetool.com
 *   SITE_ORIGIN=http://localhost:4173 npm run check:live
 *   CHECK_LIVE_RETRIES=20 npm run check:live   # wait for a fresh deploy to propagate
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.resolve(rootDir, 'dist');

const EXPECTED_ORIGIN = 'https://www.easygradetool.com';
const ORIGIN = (process.env.SITE_ORIGIN || EXPECTED_ORIGIN).replace(/\/+$/, '');
const RETRIES = Number(process.env.CHECK_LIVE_RETRIES || 1);
const RETRY_DELAY_MS = Number(process.env.CHECK_LIVE_DELAY_MS || 15000);
const BLOCKED = /easygradecalculator\.com/i;

const PAGES = [
  '/',
  '/gpa-calculator',
  '/grade-calculator',
  '/cgpa-to-percentage-calculator',
  '/easy-grade-calculator/final-exam-grade-calculator',
];

const attr = (html: string, re: RegExp) => re.exec(html)?.[1]?.trim() ?? '';

function readLocalTitle(urlPath: string): string {
  const file = urlPath === '/' ? 'index.html' : path.join(urlPath.replace(/^\//, ''), 'index.html');
  const full = path.join(distDir, file);
  if (!fs.existsSync(full)) return '';
  return attr(fs.readFileSync(full, 'utf-8'), /<title>([\s\S]*?)<\/title>/i);
}

async function checkPage(urlPath: string): Promise<string[]> {
  const problems: string[] = [];
  const res = await fetch(ORIGIN + urlPath, {
    redirect: 'follow',
    headers: { 'User-Agent': 'EasyGradeTool-LiveCheck/1.0', 'Cache-Control': 'no-cache' },
  });
  if (res.status !== 200) {
    return [`${urlPath}: HTTP ${res.status}`];
  }
  const html = await res.text();
  const expected = EXPECTED_ORIGIN + (urlPath === '/' ? '/' : urlPath);

  const canonical = attr(html, /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
  const ogUrl = attr(html, /<meta[^>]*property="og:url"[^>]*content="([^"]+)"/i);
  const ogImage = attr(html, /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
  const twImage = attr(html, /<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/i);
  const title = attr(html, /<title>([\s\S]*?)<\/title>/i);

  if (canonical !== expected) problems.push(`${urlPath}: canonical is "${canonical}" (expected "${expected}")`);
  if (ogUrl !== expected) problems.push(`${urlPath}: og:url is "${ogUrl}" (expected "${expected}")`);
  if (!ogImage.startsWith(EXPECTED_ORIGIN + '/')) problems.push(`${urlPath}: og:image is "${ogImage}"`);
  if (!twImage.startsWith(EXPECTED_ORIGIN + '/')) problems.push(`${urlPath}: twitter:image is "${twImage}"`);
  if (BLOCKED.test(html)) problems.push(`${urlPath}: page contains a blocked foreign domain`);

  const localTitle = readLocalTitle(urlPath);
  if (localTitle && title !== localTitle) {
    problems.push(`${urlPath}: live <title> differs from this build (stale deploy?)\n      live : ${title}\n      local: ${localTitle}`);
  }
  return problems;
}

async function checkRobotsAndSitemap(): Promise<string[]> {
  const problems: string[] = [];
  for (const file of ['/robots.txt', '/sitemap.xml']) {
    const res = await fetch(ORIGIN + file, { headers: { 'Cache-Control': 'no-cache' } });
    if (res.status !== 200) {
      problems.push(`${file}: HTTP ${res.status}`);
      continue;
    }
    const body = await res.text();
    if (BLOCKED.test(body)) problems.push(`${file}: contains a blocked foreign domain`);
    if (file === '/sitemap.xml' && !body.includes(`${EXPECTED_ORIGIN}/`)) {
      problems.push(`${file}: does not list ${EXPECTED_ORIGIN} URLs`);
    }
  }
  return problems;
}

async function checkBuildStamp(): Promise<string[]> {
  const localFile = path.join(distDir, 'build-info.json');
  if (!fs.existsSync(localFile)) return [];
  const local = JSON.parse(fs.readFileSync(localFile, 'utf-8'));
  try {
    const res = await fetch(ORIGIN + '/build-info.json?cb=' + Date.now(), { headers: { 'Cache-Control': 'no-cache' } });
    if (res.status !== 200) return [`/build-info.json: HTTP ${res.status} (live site is serving an older build)`];
    const live = await res.json();
    if (live.commit !== local.commit) {
      return [`live build is commit ${live.commit}, this build is ${local.commit} (deploy not finished or hosting is stale)`];
    }
    return [];
  } catch (err) {
    return [`/build-info.json: could not read (${(err as Error).message})`];
  }
}

async function runOnce(): Promise<string[]> {
  const problems: string[] = [];
  problems.push(...(await checkBuildStamp()));
  for (const p of PAGES) {
    try {
      problems.push(...(await checkPage(p)));
    } catch (err) {
      problems.push(`${p}: request failed (${(err as Error).message})`);
    }
  }
  try {
    problems.push(...(await checkRobotsAndSitemap()));
  } catch (err) {
    problems.push(`robots/sitemap: request failed (${(err as Error).message})`);
  }
  return problems;
}

async function main() {
  console.log(`🌐 Checking live site: ${ORIGIN}`);
  let problems: string[] = [];
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    problems = await runOnce();
    if (problems.length === 0) break;
    if (attempt < RETRIES) {
      console.log(`⏳ Attempt ${attempt}/${RETRIES}: ${problems.length} issue(s), retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }

  if (problems.length) {
    console.error('\n❌ Live site does NOT match this build:\n');
    problems.forEach((p) => console.error('  • ' + p));
    console.error('\nThe deployed site is stale or misconfigured. Redeploy the latest commit, then re-run.\n');
    process.exit(1);
  }
  console.log('✅ Live site matches this build: canonicals, social tags, robots and sitemap are correct.');
}

main();
