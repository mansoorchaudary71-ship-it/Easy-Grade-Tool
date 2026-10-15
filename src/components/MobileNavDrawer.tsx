import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search } from 'lucide-react';
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
    'flex min-h-12 items-center gap-3 rounded-xl px-3 text-base font-medium no-underline outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400';
  const rowClass = (active: boolean) =>
    `${rowBase} ${
      active
        ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200'
        : 'text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800'
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
        className={`flex h-full w-[min(88vw,22rem)] flex-col bg-white shadow-2xl focus:outline-none dark:bg-slate-900 transition-transform duration-200 ease-out motion-reduce:transition-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] ${
          shown ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 dark:border-slate-700">
          <h2 id="mobile-nav-title" className="m-0 text-lg font-bold text-slate-900 dark:text-slate-50">
            Menu
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 inline-flex size-12 cursor-pointer items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
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
            className="mb-3 flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-3 text-left text-base font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Search className="size-5 shrink-0" aria-hidden="true" />
            <span className="flex-1">Search calculators</span>
            <kbd className="hidden rounded-md border border-slate-300 px-1.5 py-0.5 font-mono text-xs text-slate-600 dark:border-slate-600 dark:text-slate-300 sm:inline">
              {shortcutLabel}
            </kbd>
          </button>

          <ul className="m-0 list-none p-0">{renderItem(primary)}</ul>

          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`drawer-${group.id}`} className="mt-3 border-t border-slate-200 pt-2 dark:border-slate-700">
              <h3 id={`drawer-${group.id}`} className="m-0 px-3 pb-1 pt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                {group.heading}
              </h3>
              <ul className="m-0 list-none space-y-0.5 p-0">{group.items.map(renderItem)}</ul>
            </section>
          ))}
        </nav>
      </div>
    </div>,
    document.body
  );
};

export default MobileNavDrawer;
