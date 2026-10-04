import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Custom Vite plugin for Static Site Generation (SSG) / Pre-rendering.
 * Executes during `vite build` to inject fully rendered HTML of the main page
 * directly into `<div id="root"></div>`, and generates fully populated HTML files
 * for each dedicated calculator route in `dist/` so search engine crawlers receive
 * complete, crawlable HTML upon initial page load.
 */
function prerenderPlugin(): Plugin {
  return {
    name: 'vite-plugin-prerender-html',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      async handler(html) {
        try {
          const { render } = await import('./src/entry-server');
          const renderedApp = render('/');
          if (renderedApp && renderedApp.length > 0) {
            console.log(`\n✨ [prerenderPlugin] Injected ${renderedApp.length} bytes of pre-rendered root static HTML.`);
            return html.replace(
              /<div id="root">\s*<\/div>/,
              `<div id="root">${renderedApp}</div>`
            );
          }
        } catch (error) {
          console.warn('⚠️ [prerenderPlugin] Failed to pre-render static HTML:', error);
        }
        return html;
      },
    },
    async closeBundle() {
      try {
        const { runPrerender } = await import('./scripts/prerender');
        await runPrerender();
      } catch (error) {
        console.warn('⚠️ [prerenderPlugin] Failed multi-route SSG generation:', error);
      }
    },
  };
}

/**
 * Automated Vite plugin to generate a clean sitemap.xml in the public and dist directories.
 */
function sitemapPlugin(): Plugin {
  return {
    name: 'vite-plugin-automated-sitemap',
    apply: 'build',
    async closeBundle() {
      try {
        const { runSitemapGeneration } = await import('./scripts/generateSitemap');
        runSitemapGeneration();
      } catch (error) {
        console.warn('⚠️ [sitemapPlugin] Could not auto-generate sitemap.xml:', error);
      }
    },
  };
}

/**
 * Prevents client-side WebSocket send() errors when HMR is disabled in containerized iframe environments.
 */
function viteClientSafeSendPlugin(): Plugin {
  const legacyRouterProp = ['isOutside', 'Re', 'mix', 'App'].join('');
  return {
    name: 'vite-client-safe-send',
    enforce: 'post',
    transform(code, id) {
      if (id.includes('@vite/client') || id.includes('vite/dist/client')) {
        return code
          .replace(/ws\.send\(JSON\.stringify\(data\)\);/g, 'if (ws && ws.readyState === 1) ws.send(JSON.stringify(data));')
          .replace(/wsTransport\.send\(data\);/g, 'wsTransport?.send?.(data);');
      }
      if (id.includes('react-router') && code.includes(legacyRouterProp)) {
        return code.split(legacyRouterProp).join('isOutsideRouterApp');
      }
    },
  };
}

function resolveBaseUrl(): string {
  // If explicitly set via env var (and not just empty or root)
  if (process.env.VITE_BASE_URL) {
    const raw = process.env.VITE_BASE_URL.trim();
    if (raw && raw !== '/') {
      return raw.endsWith('/') ? raw : `${raw}/`;
    }
  }

  // FORCE ROOT PATH FOR CUSTOM DOMAIN
  return '/';
}

const base = resolveBaseUrl();

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifestFilename: 'manifest.json',
      includeAssets: [
        'favicon.png',
        'apple-touch-icon.png',
        'icon.svg',
        'icon-maskable.svg',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'pwa-maskable-512x512.png',
        'robots.txt',
        'sitemap.xml',
      ],
      manifest: {
        id: base,
        name: 'Easy Grade Tool',
        short_name: 'Easy Grade Tool',
        description: 'Calculate grades, weighted averages, GPA, needed final exam scores, tips, percentages, loans, and more.',
        theme_color: '#097362',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ['standalone', 'window-controls-overlay', 'minimal-ui'],
        orientation: 'any',
        start_url: base,
        scope: base,
        categories: ['education', 'utilities', 'productivity', 'finance'],
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
        shortcuts: [
          {
            name: 'Grade & Final Exam Calculator',
            short_name: 'Grade Calc',
            description: 'Calculate course grades, weighted averages, and final exam targets',
            url: '/grade-calculator',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'GPA Calculator',
            short_name: 'GPA Calc',
            description: 'Calculate semester, cumulative, and weighted 4.0 GPA',
            url: '/gpa-calculator',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Percentage Calculator',
            short_name: 'Percentages',
            description: 'Calculate percentage differences, increase, decrease, and fractions',
            url: '/percentage-calculator',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Loan & Mortgage Calculator',
            short_name: 'Loans',
            description: 'Calculate monthly loan payments, amortization, and mortgage schedules',
            url: '/loan-calculator',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2,json}'],
        navigateFallback: `${base}index.html`,
        navigateFallbackDenylist: [
          /^\/api/,
          /^\/easy-grade-calculator\/(gpa|semester-gpa-calculator|weighted-grade-calculator|test-score|college-final-grade-calculator|high-school-test-grader)(\/|$)/i,
          /^\/easy-grade-calculator\/?$/i,
        ],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          // Network-first navigation routes: never cache HTML shell forever (max 24 hours)
          // Excludes /api and non-GET requests entirely
          {
            urlPattern: ({ request, url }) => request.mode === 'navigate' && !url.pathname.startsWith('/api'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'v2-easygradetool-pages',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours max - never cache HTML shell forever
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Manifest file: Stale-While-Revalidate
          {
            urlPattern: ({ url }) => url.pathname.endsWith('/manifest.json') || url.pathname === '/manifest.json',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'v2-easygradetool-manifest',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Static JS & CSS bundles: Stale-While-Revalidate
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'v2-easygradetool-static-bundles',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Local Self-Hosted Fonts: CacheFirst for optimal performance
          {
            urlPattern: /\/fonts\/.*\.(?:woff|woff2|ttf|eot)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'v2-easygradetool-fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year immutable
              },
          // Images and icons cache (Stale-While-Revalidate)
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'v2-easygradetool-images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
    viteClientSafeSendPlugin(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router-dom',
      'react-helmet-async',
      'lucide-react',
      'motion/react',
      'recharts',
    ],
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    cssMinify: 'esbuild',
    minify: 'esbuild',
    modulePreload: {
      polyfill: false,
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !dep.includes('vendor-pdf') && !dep.includes('pdfExport')),
    },
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Isolate heavyweight PDF generation (jspdf, html2canvas, canvg)
          if (
            id.includes('node_modules/jspdf') ||
            id.includes('node_modules/html2canvas') ||
            id.includes('node_modules/canvg') ||
            id.includes('node_modules/dompurify')
          ) {
            return 'vendor-pdf';
          }
          // Isolate charting visualization engine (recharts)
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts';
          }
          // Isolate animation libraries (motion)
          if (id.includes('node_modules/motion')) {
            return 'vendor-motion';
          }
          // Isolate UI icon set (lucide-react)
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Core React runtime & routing
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/') ||
            id.includes('node_modules/react-is/') ||
            id.includes('node_modules/react-router/') ||
            id.includes('node_modules/react-router-dom/') ||
            id.includes('node_modules/react-helmet-async/')
          ) {
            return 'vendor-react';
          }
        },
      },
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify - file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
    // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
    forwardConsole: false,
  },
});
