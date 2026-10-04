// Easy Grade Tool - Service Worker
// Strategy: Stale-While-Revalidate with Auto-Purging of Deprecated Caches

const CACHE_VERSION = 'v1.3.0';
const CACHE_PREFIX = 'easygrade-cache';

const CACHE_NAMES = {
  STATIC: `${CACHE_PREFIX}-static-${CACHE_VERSION}`,
  API: `${CACHE_PREFIX}-api-${CACHE_VERSION}`,
  MANIFEST: `${CACHE_PREFIX}-manifest-${CACHE_VERSION}`,
  PAGES: `${CACHE_PREFIX}-pages-${CACHE_VERSION}`,
  ASSETS: `${CACHE_PREFIX}-assets-${CACHE_VERSION}`,
};

// Core offline shell assets and tool guide images
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/icon.svg',
  '/icon-maskable.svg',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/images/easy-grade-calculator-guide.webp',
  '/images/gpa-calculator-guide.webp',
  '/images/cgpa-calculator-guide.webp',
  '/images/tip-calculator-guide.webp',
  '/images/percentage-calculator-guide.webp',
  '/images/loan-calculator-guide.webp',
  '/images/mortgage-calculator-guide.webp',
  '/images/password-generator-guide.webp',
];

// 1. Install Event: Cache offline shell and skip waiting immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAMES.STATIC).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Offline precaching encountered an issue:', err);
      });
    })
  );
});

// 2. Activate Event: Claim clients and purge all obsolete caches
self.addEventListener('activate', (event) => {
  const activeCacheValues = Object.values(CACHE_NAMES);

  event.waitUntil(
    caches
      .keys()
      .then((existingKeys) => {
        return Promise.all(
          existingKeys.map((key) => {
            if (key.startsWith(CACHE_PREFIX) && !activeCacheValues.includes(key)) {
              console.log(`[SW] Purging outdated cache version: ${key}`);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

/**
 * Generic Stale-While-Revalidate implementation:
 * 1. Checks if a cached response exists and serves it instantly.
 * 2. Fetches the newest copy in the background and updates the cache.
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((err) => {
      console.warn(`[SW] Background network refresh failed for: ${request.url}`, err);
      return null;
    });

  // Serve stale cached response immediately if present; fallback to network
  return cachedResponse || (await fetchPromise);
}

// 3. Fetch Event Listener
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle HTTP/HTTPS GET requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Strategy A: /manifest.json - Stale-While-Revalidate
  if (url.pathname === '/manifest.json' || url.pathname.endsWith('/manifest.json')) {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAMES.MANIFEST));
    return;
  }

  // Strategy B: Read-only API Routes (/api/health, /api/stats) - Network First with Cache Fallback
  if (url.pathname === '/api/health' || url.pathname === '/api/stats') {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAMES.API));
    return;
  }
  if (url.pathname.startsWith('/api/')) {
    // Pass all other API endpoints directly to network without caching
    return;
  }

  // Strategy C: Static Bundles & Assets (.js, .css, webfonts, images) - Stale-While-Revalidate
  if (
    url.pathname.match(/\.(?:js|css|woff2?|ttf|eot|png|jpg|jpeg|svg|gif|webp|ico)$/i) ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAMES.ASSETS));
    return;
  }

  // Strategy D: Page Navigations (HTML) - Network First with Cached Shell Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAMES.PAGES).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;

          const shell = await caches.match('/index.html');
          return shell || new Response('Offline', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }
});
