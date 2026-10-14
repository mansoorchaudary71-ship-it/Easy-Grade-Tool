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

/** Bottom sheet on phones, centered card on larger screens. Mount only while open.
 *  Items use the same Primary / Secondary buttons as the menu bar. */
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
                  className={`flex items-center gap-3 min-h-[52px] px-4 py-3 rounded-2xl border-[1.5px] no-underline text-base font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#4D63DA]/60 dark:focus-visible:ring-[#8B9CFF]/80 ${
                    active
                      ? 'border-transparent bg-gradient-to-b from-[#5A6FE6] to-[#4157CC] text-white shadow-[0_12px_22px_-12px_rgba(65,87,204,0.8),inset_0_1px_0_rgba(255,255,255,0.28)] dark:from-[#6E82F5] dark:to-[#4A5FDB]'
                      : 'border-[#4D63DA]/45 bg-white text-[#4D63DA] hover:border-[#4D63DA] hover:bg-[#F3F5FF] dark:border-[#8B9CFF]/35 dark:bg-white/[0.05] dark:text-[#B4C0FF] dark:hover:border-[#8B9CFF]/80 dark:hover:bg-white/[0.10] dark:hover:text-white'
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
