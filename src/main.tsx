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

// Automatically register PWA Service Worker for offline caching
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    registerSW({
      immediate: true,
      onOfflineReady() {},
      onNeedRefresh() {},
    });
  } catch (err) {
    console.warn('PWA service worker registration skipped in current environment:', err);
  }
}

const container = document.getElementById('root')!;

// Seamlessly hydrate pre-rendered HTML if present (from SSG / pre-render),
// otherwise fall back gracefully to client createRoot
if (container.hasChildNodes()) {
  hydrateRoot(
    container,
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

