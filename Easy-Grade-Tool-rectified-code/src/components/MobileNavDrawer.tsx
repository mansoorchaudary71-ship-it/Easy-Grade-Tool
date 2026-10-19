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

  const rowClass = (active: boolean) =>
    `flex min-h-12 items-center gap-3 rounded-xl px-3 text-base font-medium no-underline transition-colors ${
      active ? 'bg-brand-soft text-brand-ink' : 'text-ink hover:bg-sunken'
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
      className={`drawer-backdrop transition-opacity duration-200 ease-out motion-reduce:transition-none ${shown ? 'opacity-100' : 'opacity-0'}`}
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
        className={`flex h-full w-[min(88vw,22rem)] flex-col border-r border-line bg-surface shadow-lg transition-transform duration-200 ease-out motion-reduce:transition-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] focus:outline-none ${
          shown ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <h2 id="mobile-nav-title" className="m-0 text-lg">
            Menu
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="btn btn-ghost btn-icon -mr-2"
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
            className="btn btn-secondary btn-block mb-3 justify-start gap-3 rounded-xl px-3 text-left"
          >
            <Search className="size-5 shrink-0" aria-hidden="true" />
            <span className="flex-1">Search calculators</span>
            <kbd className="hidden sm:inline-flex">
              {shortcutLabel}
            </kbd>
          </button>

          <ul className="m-0 list-none p-0">{renderItem(primary)}</ul>

          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`drawer-${group.id}`} className="mt-3 border-t border-line pt-2">
              <h3 id={`drawer-${group.id}`} className="m-0 px-3 pb-1 pt-1 text-sm font-semibold text-ink-2">
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
