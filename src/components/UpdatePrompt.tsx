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
      className="fixed left-3 right-3 sm:left-auto sm:right-4 sm:max-w-sm z-[9000] flex items-center gap-3 rounded-3xl bg-white text-[#0E1424] border border-[#E6E9F2] shadow-[0_24px_60px_-20px_rgba(36,87,245,0.35)] px-4 py-3 print:hidden"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      <span className="text-sm font-medium flex-1">A new version is ready.</span>
      <button
        type="button"
        onClick={() => apply()}
        className="min-h-[48px] px-5 rounded-full bg-[#2457F5] text-white text-sm font-bold cursor-pointer hover:bg-[#1A41C9] transition-colors"
      >
        Reload
      </button>
      <button
        type="button"
        onClick={() => setApply(null)}
        className="min-h-[48px] px-3 rounded-full text-sm font-semibold text-slate-200 cursor-pointer"
        aria-label="Dismiss update message"
      >
        Later
      </button>
    </div>
  );
};

export default UpdatePrompt;
