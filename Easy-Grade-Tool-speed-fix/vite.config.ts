import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

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
      registerType: 'prompt',
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
        description: 'Free grade calculators for students and teachers: quick grade chart, weighted grades, final exam score, test grade, curve, letter grade, GPA and CGPA.',
        theme_color: '#F3F4F6',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ['standalone', 'window-controls-overlay', 'minimal-ui'],
        orientation: 'any',
        start_url: base,
        scope: base,
        categories: ['education', 'productivity', 'utilities'],
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
          { name: 'Quick Grade Chart', short_name: 'Quick Grade', description: 'Print a score chart for any test length', url: '/', icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }] },
          { name: 'Weighted Grade Calculator', short_name: 'Weighted', description: 'Course grade from weighted categories', url: '/grade-calculator/', icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }] },
          { name: 'Final Exam Calculator', short_name: 'Final Exam', description: 'Score needed on the final for your target grade', url: '/final-exam-grade-calculator/', icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }] },
          { name: 'GPA Calculator', short_name: 'GPA', description: 'Semester and cumulative GPA', url: '/gpa-calculator/', icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        // Precache ONLY what the app shell needs. The old pattern also downloaded every OG card PNG (~1.7 MB),
        // every guide image (~0.9 MB) and every font subset in the background on the first visit, competing with
        // the page itself for bandwidth. Images and fonts are still cached offline, on first use, by the
        // runtimeCaching rules below.
        globPatterns: [
          '**/*.{js,css}',
          'index.html',
          'fonts/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yw.woff2',
          'fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2',
        ],
        globIgnores: ['og-cards/**', 'images/**', '**/node_modules/**'],
        navigateFallback: `${base}index.html`,
        navigateFallbackDenylist: [
          /^\/api/,
          /^\/easy-grade-calculator(\/|$)/i,
        ],
        cleanupOutdatedCaches: true,
        // The new service worker waits until the person taps "Reload" in the update banner (see UpdatePrompt),
        // so code is never swapped under someone who is in the middle of entering grades.
        clientsClaim: false,
        skipWaiting: false,
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
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
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
});
