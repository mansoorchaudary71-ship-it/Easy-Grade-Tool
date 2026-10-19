import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Info } from 'lucide-react';
import { Link } from './SlashLink';
import { NavGroup, NavItem } from '../data/navItems';
import { isSamePath } from '../utils/paths';
import { useDialogA11y } from '../utils/useDialogA11y';
import { preloadForPath } from '../utils/lazyRoutes';

interface MobileNavDrawerProps {
  primary: NavItem;
  groups: NavGroup[];
  currentPath: string;
  shortcutLabel: string;
  onClose: () => void;
  onNavigate: (item: NavItem) => void;
  onOpenSearch: () => void;
}

/**
 * Phone / small-tablet navigation: a left drawer opened by the hamburger button.
 * Modal dialog (focus trap, Escape, scroll lock and focus restore come from useDialogA11y), every row is 48px tall,
 * and the content is grouped so the list is scannable instead of one long wall of links. Mount only while open.
 */
export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  primary,
  groups,
  currentPath,
  shortcutLabel,
  onClose,
  onNavigate,
  onOpenSearch,
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  useDialogA11y(panelRef, onClose);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (typeof document === 'undefined') return null;

  const rowBase =
    'flex min-h-12 items-center gap-3 rounded-xl px-3 text-base font-semibold tracking-[-0.011em] no-underline outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2563EB] dark:focus-visible:ring-[#60A5FA]';
  const rowClass = (active: boolean) =>
    `${rowBase} ${
      active
        ? 'bg-[#F3F3F6] text-[#0D0C22] dark:bg-white/10 dark:text-white'
        : 'text-[#0D0C22] hover:bg-[#F3F3F6] dark:text-slate-100 dark:hover:bg-white/10'
    }`;

  const renderItem = (item: NavItem) => {
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
          onTouchStart={() => void preloadForPath(item.path)}
          aria-current={active ? 'page' : undefined}
          className={rowClass(active)}
        >
          <Icon className="size-5 shrink-0" strokeWidth={2} aria-hidden="true" />
          <span>{item.label}</span>
        </Link>
      </li>
    );
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] bg-slate-950/60 transition-opacity duration-200 ease-out motion-reduce:transition-none ${shown ? 'opacity-100' : 'opacity-0'}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-nav-title"
        tabIndex={-1}
        className={`flex h-full w-[min(88vw,22rem)] flex-col bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus:outline-none dark:bg-slate-900 transition-transform duration-200 ease-out motion-reduce:transition-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] ${
          shown ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 dark:border-slate-700">
          <h2 id="mobile-nav-title" className="m-0 text-lg font-semibold tracking-[-0.02em] text-[#0D0C22] dark:text-slate-50">
            Menu
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 inline-flex size-12 cursor-pointer items-center justify-center rounded-full text-[#0D0C22] hover:bg-[#F3F3F6] dark:text-slate-200 dark:hover:bg-white/10"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Calculators" className="flex-1 overflow-y-auto overscroll-contain px-3 py-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="mb-3 flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-full bg-[#F3F3F6] px-4 text-left text-base font-normal tracking-[-0.011em] text-[#6E6D7A] hover:bg-[#EBEBF0] dark:bg-white/[0.08] dark:text-slate-300 dark:hover:bg-white/15"
          >
            <Search className="size-5 shrink-0" aria-hidden="true" />
            <span className="flex-1">What do you want to calculate?</span>
            <kbd className="hidden font-sans text-sm font-semibold text-[#3A3546] dark:text-slate-300 sm:inline">
              {shortcutLabel}
            </kbd>
          </button>

          <ul className="m-0 list-none p-0">{renderItem(primary)}</ul>

          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`drawer-${group.id}`} className="mt-3 border-t border-slate-200 pt-2 dark:border-slate-700">
              <h3 id={`drawer-${group.id}`} className="m-0 px-3 pb-1 pt-1 text-sm font-semibold tracking-[-0.011em] text-[#6E6D7A] dark:text-slate-300">
                {group.heading}
              </h3>
              <ul className="m-0 list-none space-y-0.5 p-0">{group.items.map(renderItem)}</ul>
            </section>
          ))}

          <ul className="m-0 mt-3 list-none border-t border-slate-200 p-0 pt-2 dark:border-slate-700">
            <li>
              <Link
                to="/about/"
                onClick={onClose}
                aria-current={currentPath.startsWith('/about') ? 'page' : undefined}
                className={rowClass(currentPath.startsWith('/about'))}
              >
                <Info className="size-5 shrink-0" strokeWidth={2} aria-hidden="true" />
                <span>About</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>,
    document.body
  );
};

export default MobileNavDrawer;
