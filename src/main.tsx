// Ensure window.fetch has both getter and setter to prevent TypeError in sandboxed/iframe environments
if (typeof window !== 'undefined') {
  try {
    const _origFetch = window.fetch ? window.fetch.bind(window) : undefined;
    let _assignedFetch: any = null;
    Object.defineProperty(window, 'fetch', {
      get() {
        return _assignedFetch || _origFetch;
      },
      set(fn) {
        _assignedFetch = typeof fn === 'function' ? fn.bind(window) : fn;
      },
      configurable: true,
      enumerable: true,
    });
  } catch (_) {}
}

import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import './styles/a11y-touch.css';
import { preloadForPath } from './utils/lazyRoutes';
import { installPrintFocus } from './utils/printFocus';

installPrintFocus();

// Register the PWA service worker. A new version waits until the person accepts it: <UpdatePrompt /> listens
// for this event and offers a "Reload" button, so code is never swapped mid-session.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    const updateSW = registerSW({
      immediate: true,
      onOfflineReady() {},
      onNeedRefresh() {
        window.dispatchEvent(new CustomEvent('egt:sw-update', { detail: { apply: () => updateSW(true) } }));
      },
    });
  } catch (err) {
    console.warn('PWA service worker registration skipped in current environment:', err);
  }
}

const container = document.getElementById('root')!;

async function start() {
  // Load the current route's chunk first so hydration finds it ready (no skeleton flash).
  try {
    await preloadForPath(window.location.pathname);
  } catch {
    /* fall through: Suspense fallback handles it */
  }

// Seamlessly hydrate pre-rendered HTML if present (from SSG / pre-render),
// otherwise fall back gracefully to client createRoot
if (container.hasChildNodes()) {
  try {
    hydrateRoot(
      container,
      <StrictMode>
        <App />
      </StrictMode>,
      {
        onRecoverableError(error) {
          // Suppress uncaught hydration mismatch error from breaking the page
          console.warn('Hydration discrepancy handled gracefully:', error);
        },
      }
    );
  } catch {
    createRoot(container).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
} else {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
}

start();
