import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import './styles/a11y-touch.css';
import './styles/premium.css';
import { preloadForPath } from './utils/lazyRoutes';
import { installPrintFocus } from './utils/printFocus';

installPrintFocus();

declare global {
  interface Window {
    /** Set when a new version is waiting. <UpdatePrompt /> reads it on mount, so a banner is never missed. */
    __egtSwApply?: () => void;
  }
}

// Register the PWA service worker. A new version waits instead of swapping code mid-session. How it is applied:
//   1. Right after page load, before the person has touched anything, it is applied silently (a single reload).
//      This heals the "this device still shows the old site" case: a waiting update is picked up on the next visit.
//   2. Otherwise <UpdatePrompt /> offers a "Reload" button. The apply callback is also parked on `window`, because
//      the update is often detected before React has mounted and a one-shot event would be lost.
//   3. Open tabs re-check for a new version every 30 minutes and whenever the tab becomes visible again.
if ('serviceWorker' in navigator) {
  let interacted = false;
  const markInteracted = () => {
    interacted = true;
  };
  for (const type of ['pointerdown', 'keydown', 'touchstart', 'input']) {
    window.addEventListener(type, markInteracted, { once: true, passive: true, capture: true });
  }

  /** Silent apply is allowed only right after load, with no input yet, and at most once a minute per tab. */
  const mayApplySilently = (): boolean => {
    if (interacted || performance.now() > 8000) return false;
    try {
      const last = Number(sessionStorage.getItem('egt:sw-auto-apply') ?? 0);
      if (Date.now() - last < 60_000) return false;
      sessionStorage.setItem('egt:sw-auto-apply', String(Date.now()));
    } catch {
      // Storage blocked: fall through and allow it; the reload itself clears the waiting worker.
    }
    return true;
  };

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      const apply = () => void updateSW(true);
      if (mayApplySilently()) {
        apply();
        return;
      }
      window.__egtSwApply = apply;
      window.dispatchEvent(new CustomEvent('egt:sw-update', { detail: { apply } }));
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      const check = () => {
        if (navigator.onLine) registration.update().catch(() => undefined);
      };
      window.setInterval(check, 30 * 60 * 1000);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
    },
  });
}

/** Longest we wait for the current route's chunk before hydrating anyway. */
const PRELOAD_TIMEOUT_MS = 1500;

function preloadWithTimeout(pathname: string): Promise<void> {
  const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, PRELOAD_TIMEOUT_MS));
  const preload = preloadForPath(pathname).then(
    () => undefined,
    () => undefined, // the Suspense fallback covers a failed or slow chunk
  );
  return Promise.race([preload, timeout]);
}

async function start() {
  const container = document.getElementById('root');
  if (!container) return;

  // Give the route chunk a short head start so hydration finds it ready, but never block on it.
  await preloadWithTimeout(window.location.pathname);

  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );

  if (container.hasChildNodes()) {
    // Pre-rendered HTML is present: hydrate it. Mismatches are reported through onRecoverableError, not try/catch.
    hydrateRoot(container, app, {
      onRecoverableError(error) {
        if (import.meta.env.DEV) console.warn('Hydration mismatch recovered:', error);
      },
    });
  } else {
    createRoot(container).render(app);
  }
}

void start();
