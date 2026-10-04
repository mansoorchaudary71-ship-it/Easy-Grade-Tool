import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'compact' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'nav',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  // If already running inside installed standalone PWA, suppress the prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  // If not installable and not iOS, don't render clutter
  if (!isInstallable && !isIOS && !installSuccess) {
    return null;
  }

  if (installSuccess) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 text-white text-xs font-medium shadow-sm ${className}`}>
        <Check className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Installed!</span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer shadow-sm ${
          variant === 'banner'
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
            : 'bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-600/60 hover:border-emerald-500 active:scale-95'
        } ${className}`}
        aria-label={isIOS ? 'Install Easy Grade Tool on iOS' : 'Install Easy Grade App for offline use'}
        title="Install app to your home screen for full offline access"
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* iOS Safari Guided Installation Modal */}
      {showIOSModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-600/15 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="ios-install-title" className="text-base font-bold leading-tight">
                    Install on iPhone / iPad
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Use Easy Grade completely offline</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-sm">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
                  1
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">Tap the Share button</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 flex items-center gap-1.5">
                    Tap <Share2 className="w-3.5 h-3.5 text-blue-500 inline" /> in Safari&apos;s bottom toolbar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
                  2
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">Add to Home Screen</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 flex items-center gap-1.5">
                    Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 inline" /> <strong>Add to Home Screen</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
                  3
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">Launch anytime offline</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Open from your home screen like a native mobile app without cellular or WiFi!
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 py-2.5 text-xs font-semibold text-white shadow-sm shadow-teal-700/20 transition cursor-pointer"
            >
              Got it, close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
