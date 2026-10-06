import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from '../src/entry-server';
import { ToolKey } from '../src/types';
import { injectRouteSeoIntoHtml } from '../src/utils/seoHtmlInjector';
import { PROGRAMMATIC_SEO_REGISTRY } from '../src/data/programmaticSeoData';
import { TOOL_PAGE_LIST } from '../src/data/toolPages';
import { LEGACY_REDIRECTS, renderRedirectStub } from './redirectStubs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const distIndexHtmlPath = path.resolve(distDir, 'index.html');

export interface PrerenderRouteDef {
  route: string;
  toolKey: ToolKey;
  targetFile: string;
  isSubDir: boolean;
}

// All canonical routes (Homepage + tools + dedicated academic pages + About/Privacy/Terms)
export const PRERENDER_ROUTES: PrerenderRouteDef[] = [
  {
    route: '/',
    toolKey: 'quick',
    targetFile: path.resolve(distDir, 'index.html'),
    isSubDir: false,
  },
  {
    route: '/grade-calculator',
    toolKey: 'quick',
    targetFile: path.resolve(distDir, 'grade-calculator', 'index.html'),
    isSubDir: true,
  },
  {
    route: '/gpa-calculator',
    toolKey: 'gpa',
    targetFile: path.resolve(distDir, 'gpa-calculator', 'index.html'),
    isSubDir: true,
  },
  {
    route: '/cgpa-to-percentage-calculator',
    toolKey: 'cgpa',
    targetFile: path.resolve(distDir, 'cgpa-to-percentage-calculator', 'index.html'),
    isSubDir: true,
  },
  {
    route: '/tip-calculator',
    toolKey: 'tip',
    targetFile: path.resolve(distDir, 'tip-calculator', 'index.html'),
    isSubDir: true,
  },
  {
    route: '/percentage-calculator',
    toolKey: 'percentage',
    targetFile: path.resolve(distDir, 'percentage-calculator', 'index.html'),
    isSubDir: true,
  },
  {
    route: '/loan-calculator',
    toolKey: 'loan',
    targetFile: path.resolve(distDir, 'loan-calculator', 'index.html'),
    isSubDir: true,
  },
  {
    route: '/mortgage-calculator',
    toolKey: 'mortgage',
    targetFile: path.resolve(distDir, 'mortgage-calculator', 'index.html'),
    isSubDir: true,
  },
  {
    route: '/password-generator',
    toolKey: 'password',
    targetFile: path.resolve(distDir, 'password-generator', 'index.html'),
    isSubDir: true,
  },
  {
    route: '/about',
    toolKey: 'quick',
    targetFile: path.resolve(distDir, 'about', 'index.html'),
    isSubDir: true,
  },
  {
    route: '/privacy',
    toolKey: 'quick',
    targetFile: path.resolve(distDir, 'privacy', 'index.html'),
    isSubDir: true,
  },
  {
    route: '/terms',
    toolKey: 'quick',
    targetFile: path.resolve(distDir, 'terms', 'index.html'),
    isSubDir: true,
  },
  // Programmatic SEO routes pre-rendered with genuine on-page content, distinct syllabi & custom FAQs
  ...Object.values(PROGRAMMATIC_SEO_REGISTRY).map((entry) => ({
    route: entry.path,
    toolKey: entry.toolKey,
    targetFile: path.resolve(distDir, entry.slug, 'index.html'),
    isSubDir: true,
  })),
  // Dedicated calculators (test grade, grade curve, letter grade)
  ...TOOL_PAGE_LIST.map((entry) => ({
    route: entry.path,
    toolKey: 'quick' as ToolKey,
    targetFile: path.resolve(distDir, entry.slug, 'index.html'),
    isSubDir: true,
  })),
];

function getBasePrefix(): string {
  if (process.env.VITE_BASE_URL) {
    const raw = process.env.VITE_BASE_URL.trim();
    if (raw && raw !== '/') {
      return raw.endsWith('/') ? raw : `${raw}/`;
    }
  }
  if (process.env.GITHUB_ACTIONS === 'true' || process.env.GITHUB_PAGES === 'true') {
    if (process.env.GITHUB_REPOSITORY) {
      const parts = process.env.GITHUB_REPOSITORY.split('/');
      const repoName = parts[1];
      if (repoName && !repoName.toLowerCase().endsWith('.github.io')) {
        return `/${repoName}/`;
      }
    }
  }
  return '/';
}

/**
 * Injects route-specific head metadata and pre-rendered body into the HTML template.
 */
function injectPrerenderedContent(
  cleanTemplateHtml: string,
  renderedBodyHtml: string,
  route: string,
  isSubDir: boolean
): string {
  let html = cleanTemplateHtml.replace(
    '<div id="root"></div>',
    `<div id="root">${renderedBodyHtml}</div>`
  );

  html = injectRouteSeoIntoHtml(html, route);

  if (isSubDir) {
    const p = getBasePrefix();
    html = html.replace(/href="\.\/assets\//g, `href="${p}assets/`);
    html = html.replace(/src="\.\/assets\//g, `src="${p}assets/`);
    html = html.replace(/href="\.\/favicon/g, `href="${p}favicon`);
    html = html.replace(/href="\.\/og-image/g, `href="${p}og-image`);
    html = html.replace(/href="\.\/manifest/g, `href="${p}manifest`);
  }

  return html;
}

/**
 * Main Static Site Generation (SSG) pre-rendering runner.
 */
export async function runPrerender(): Promise<void> {
  console.log('⚡ Starting clean static site generation (SSG) for all 11 canonical routes...');

  if (!fs.existsSync(distIndexHtmlPath)) {
    console.error(`❌ dist/index.html not found. Run 'vite build' first.`);
    throw new Error('dist/index.html not found');
  }

  let baseTemplate = fs.readFileSync(distIndexHtmlPath, 'utf-8');
  baseTemplate = baseTemplate.replace(
    /<div id="root">[\s\S]*?<\/body>/i,
    '<div id="root"></div>\n  </body>'
  );

  const flatFilesToRemove = [
    'gpa-calculator.html',
    'cgpa-to-percentage-calculator.html',
    'tip-calculator.html',
    'percentage-calculator.html',
    'loan-calculator.html',
    'mortgage-calculator.html',
    'password-generator.html',
    'grade-calculator.html',
  ];
  for (const flatFile of flatFilesToRemove) {
    const fullPath = path.resolve(distDir, flatFile);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (_) {}
    }
  }

  // Old nested directory (/easy-grade-calculator/...) is replaced entirely by redirect stubs below
  const egcDir = path.resolve(distDir, 'easy-grade-calculator');
  if (fs.existsSync(egcDir)) {
    try {
      fs.rmSync(egcDir, { recursive: true, force: true });
    } catch (_) {}
  }

  const dist404Path = path.resolve(distDir, '404.html');
  const prefix = getBasePrefix();
  let notFoundHtml = baseTemplate;
  if (!notFoundHtml.includes('noindex')) {
    notFoundHtml = notFoundHtml.replace(
      '<head>',
      `<head>\n    <meta name="robots" content="noindex, follow" />\n    <script>
      (function(){
        try {
          var l = window.location;
          var p = l.pathname;
          var s = l.search || '';
          var h = l.hash || '';
          
          var isGitHubIo = l.hostname.endsWith('github.io');
          var segments = p.split('/').filter(Boolean);
          var repoPrefix = (isGitHubIo && segments.length > 0 && !segments[0].includes('.')) 
            ? '/' + segments[0] + '/' 
            : '${prefix}';

          if (p && p !== repoPrefix && !p.endsWith('/404.html')) {
            sessionStorage.setItem('spa_redirect_target', p + s + h);
            l.replace(repoPrefix);
          }
        } catch (_) {}
      })();
    </script>`
    );
  }
  notFoundHtml = notFoundHtml.replace(
    /<title>.*?<\/title>/i,
    '<title>404 — Page Not Found | Easy Grade Tool</title>'
  );
  const notFoundBody = `
    <div class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 font-sans">
      <span class="text-xs font-mono font-bold tracking-widest uppercase text-teal-700 dark:text-teal-400 mb-2">Error 404</span>
      <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Page Not Found</h1>
      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        The calculator or page you requested could not be found. Please check the address or return to our calculation suite.
      </p>
      <a href="${prefix}" class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow-sm transition-all active:scale-95">
        &larr; Return to Easy Grade Tool
      </a>
    </div>
  `;
  notFoundHtml = notFoundHtml.replace(
    '<div id="root"></div>',
    `<div id="root">${notFoundBody}</div>`
  );
  fs.writeFileSync(dist404Path, notFoundHtml, 'utf-8');
  console.log(`✅ [SSG] Generated clean GitHub Pages fallback with noindex: ${dist404Path}`);

  // Guarantee .nojekyll in dist/ to disable Jekyll processing on GitHub Pages
  const distNoJekyllPath = path.resolve(distDir, '.nojekyll');
  fs.writeFileSync(distNoJekyllPath, '', 'utf-8');
  console.log(`✅ [SSG] Generated .nojekyll flag file in dist/ for GitHub Pages.`);

  let successCount = 0;

  for (const item of PRERENDER_ROUTES) {
    try {
      const appHtml = render(item.route);

      if (!appHtml || appHtml.length === 0) {
        console.warn(`⚠️ Render for route ${item.route} produced empty output.`);
        continue;
      }

      const fullHtml = injectPrerenderedContent(
        baseTemplate,
        appHtml,
        item.route,
        item.isSubDir
      );

      fs.mkdirSync(path.dirname(item.targetFile), { recursive: true });
      fs.writeFileSync(item.targetFile, fullHtml, 'utf-8');

      console.log(`✅ [SSG] Route ${item.route.padEnd(32)} → ${item.targetFile} (${appHtml.length} bytes pre-rendered)`);
      successCount++;
    } catch (err) {
      console.error(`❌ [SSG] Failed to pre-render route ${item.route}:`, err);
    }
  }

  // Static redirect stubs for every legacy / alias URL. GitHub Pages cannot send real 301s,
  // so each old URL gets a tiny page with meta-refresh + canonical pointing at the new URL.
  let stubCount = 0;
  for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
    const clean = from.replace(/^\/+|\/+$/g, '');
    if (!clean) continue;
    const target = path.resolve(distDir, clean, 'index.html');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, renderRedirectStub(to), 'utf-8');
    stubCount++;
  }
  console.log(`✅ [SSG] Wrote ${stubCount} legacy redirect stubs`);

  console.log(`🎉 SSG completed: ${successCount}/${PRERENDER_ROUTES.length} primary routes pre-rendered with zero duplicate content!`);
}

if (process.argv[1] && process.argv[1].endsWith('prerender.ts')) {
  runPrerender().catch((err) => {
    console.error('❌ Error during pre-rendering:', err);
    process.exit(1);
  });
}
