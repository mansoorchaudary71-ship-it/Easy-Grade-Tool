import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  generateRobotsTxt,
  SITE_URL,
  SITEMAP_VARIATIONS,
} from '../src/data/seoConfig';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');
const distDir = path.resolve(rootDir, 'dist');
const hashesFilePath = path.resolve(__dirname, 'sitemap-hashes.json');

const publicSitemapPath = path.resolve(publicDir, 'sitemap.xml');
const distSitemapPath = path.resolve(distDir, 'sitemap.xml');
const publicRobotsPath = path.resolve(publicDir, 'robots.txt');
const distRobotsPath = path.resolve(distDir, 'robots.txt');

interface HashEntry {
  hash: string;
  lastmod: string;
}

function extractMainContent(html: string): string {
  return html
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function computeHash(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex').slice(0, 16);
}

export function runSitemapGeneration(customOrigin?: string): string {
  const origin = customOrigin || SITE_URL;
  const cleanOrigin = origin.replace(/\/+$/, '');
  const today = '2026-10-02';

  console.log(`🗺️  Generating honest, per-URL content-hashed sitemap.xml for origin: ${origin}...`);

  // Load existing hashes if present
  let storedHashes: Record<string, HashEntry> = {};
  if (fs.existsSync(hashesFilePath)) {
    try {
      storedHashes = JSON.parse(fs.readFileSync(hashesFilePath, 'utf-8'));
    } catch (_) {}
  }

  const updatedHashes: Record<string, HashEntry> = {};
  const perUrlLastmod: Record<string, string> = {};

  console.log('\n--- Per-URL Honest lastmod Resolution ---');
  for (const entry of SITEMAP_VARIATIONS) {
    const route = entry.path;
    const cleanRoutePath = route.replace(/^\/+|\/+$/g, '');
    const distHtmlFile = cleanRoutePath === ''
      ? path.join(distDir, 'index.html')
      : path.join(distDir, cleanRoutePath, 'index.html');

    let currentHash = '';
    if (fs.existsSync(distHtmlFile)) {
      const html = fs.readFileSync(distHtmlFile, 'utf-8');
      const mainText = extractMainContent(html);
      currentHash = computeHash(mainText);
    }

    const previous = storedHashes[route];
    let resolvedLastmod = previous?.lastmod || today;

    if (previous && previous.hash && currentHash && previous.hash !== currentHash) {
      // Content changed: update lastmod to today
      resolvedLastmod = today;
    } else if (previous && previous.lastmod) {
      resolvedLastmod = previous.lastmod;
    }

    updatedHashes[route] = {
      hash: currentHash || previous?.hash || '',
      lastmod: resolvedLastmod,
    };
    perUrlLastmod[route] = resolvedLastmod;

    console.log(`  ${route.padEnd(52)} -> lastmod: ${resolvedLastmod} (hash: ${currentHash || 'pending-build'})`);
  }

  // Save updated hashes
  fs.writeFileSync(hashesFilePath, JSON.stringify(updatedHashes, null, 2) + '\n', 'utf-8');

  // Build clean XML sitemap with honest lastmod; without obsolete changefreq and priority
  const urlElements = SITEMAP_VARIATIONS.map((entry) => {
    const loc = `${cleanOrigin}${entry.path.startsWith('/') ? entry.path : `/${entry.path}`}`;
    const lastmod = perUrlLastmod[entry.path] || today;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
  }).join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>
`;

  const robotsTxt = generateRobotsTxt(origin);

  // Ensure directories exist
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf-8');
  fs.writeFileSync(publicRobotsPath, robotsTxt, 'utf-8');

  if (fs.existsSync(distDir)) {
    fs.writeFileSync(distSitemapPath, sitemapXml, 'utf-8');
    fs.writeFileSync(distRobotsPath, robotsTxt, 'utf-8');
  }

  console.log(`✅ Generated honest sitemap.xml with real per-URL lastmod stamps.`);
  return sitemapXml;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    runSitemapGeneration();
    console.log('🎉 Automated sitemap generation completed successfully!');
  } catch (error) {
    console.error('❌ Failed to generate sitemap.xml:', error);
    process.exit(1);
  }
}
