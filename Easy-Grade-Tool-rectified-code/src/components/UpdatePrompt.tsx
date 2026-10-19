import React, { useEffect, useState } from 'react';

/**
 * Offers a "Reload" button when a new version of the site has been downloaded in the background.
 * Mounted once in App. Renders nothing until main.tsx reports a waiting update (via window.__egtSwApply or the "egt:sw-update" event).
 */
export const UpdatePrompt: React.FC = () => {
  const [apply, setApply] = useState<null | (() => void)>(null);

  useEffect(() => {
    // An update may have been detected before this component mounted (the event is fire-and-forget).
    if (typeof window.__egtSwApply === 'function') {
      const pending = window.__egtSwApply;
      setApply(() => pending);
    }
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<{ apply: () => void }>).detail;
      if (detail && typeof detail.apply === 'function') setApply(() => detail.apply);
    };
    window.addEventListener('egt:sw-update', onUpdate);
    return () => window.removeEventListener('egt:sw-update', onUpdate);
  }, []);

  if (!apply) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 z-[80] flex items-center gap-2 rounded-2xl border border-line bg-surface p-3 pl-4 shadow-lg sm:inset-x-auto sm:right-4 sm:max-w-sm print:hidden"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      <span className="flex-1 text-sm font-medium text-ink">A new version is ready.</span>
      <button type="button" onClick={() => apply()} className="btn btn-primary">
        Reload
      </button>
      <button type="button" onClick={() => setApply(null)} className="btn btn-ghost" aria-label="Dismiss update message">
        Later
      </button>
    </div>
  );
};

export default UpdatePrompt;
