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

// Register the PWA service worker. A new version waits until the person accepts it: <UpdatePrompt /> listens
// for this event and offers a "Reload" button, so code is never swapped mid-session.
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      window.dispatchEvent(new CustomEvent('egt:sw-update', { detail: { apply: () => updateSW(true) } }));
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
