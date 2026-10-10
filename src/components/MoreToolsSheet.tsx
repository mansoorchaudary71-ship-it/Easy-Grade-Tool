import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Link } from './SlashLink';
import { NavItem } from '../data/navItems';
import { isSamePath } from '../utils/paths';
import { useDialogA11y } from '../utils/useDialogA11y';

interface MoreToolsSheetProps {
  items: NavItem[];
  currentPath: string;
  onClose: () => void;
  onNavigate: (item: NavItem) => void;
}

/** Bottom sheet on phones, centered card on larger screens. Mount only while open. */
export const MoreToolsSheet: React.FC<MoreToolsSheetProps> = ({ items, currentPath, onClose, onNavigate }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  useDialogA11y(panelRef, onClose);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-200 ease-out ${shown ? 'opacity-100' : 'opacity-0'}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="more-tools-title"
        tabIndex={-1}
        className={`w-full sm:max-w-sm bg-white dark:bg-slate-900 rounded-t-[28px] sm:rounded-[28px] border border-white/80 dark:border-slate-800 shadow-2xl p-5 space-y-3 max-h-[85vh] overflow-y-auto overscroll-contain focus:outline-none pb-[max(1.25rem,env(safe-area-inset-bottom))] transition-all duration-200 ease-out ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <div className="sm:hidden mx-auto h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" aria-hidden="true" />
        <div className="flex items-center justify-between">
          <h2 id="more-tools-title" className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">More tools</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close more tools"
            className="w-12 h-12 -mr-2 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 m-0">General-purpose calculators that sit outside the grade tools.</p>
        <ul className="m-0 p-0 list-none space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isSamePath(currentPath, item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => {
                    onNavigate(item);
                    onClose();
                  }}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 min-h-[48px] px-4 py-3 rounded-2xl no-underline text-base font-semibold border transition-colors ${
                    active
                      ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-600 text-teal-900 dark:text-teal-200'
                      : 'bg-white dark:bg-slate-800 border-stone-200 dark:border-slate-700 text-stone-800 dark:text-slate-100 hover:bg-stone-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body
  );
};
