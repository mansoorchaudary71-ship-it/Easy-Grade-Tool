import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Link } from './SlashLink';
import { NavGroup, NavItem } from '../data/navItems';
import { isSamePath } from '../utils/paths';
import { preloadForPath } from '../utils/lazyRoutes';

interface ToolsMenuProps {
  groups: NavGroup[];
  currentPath: string;
  /** The "Tools" button. The menu anchors to it and ignores clicks on it (it toggles itself). */
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  onNavigate: (item: NavItem) => void;
}

const WIDTH = 300;
const GAP = 8;
const MARGIN = 12;

/**
 * Desktop tool-group dropdown (Hick's Law: the header shows three grouped menus instead of 14 tabs).
 *
 * Non-modal, keyboard friendly:
 *  - opens under the button, clamped inside the viewport; focus starts on the first link
 *  - ArrowUp/ArrowDown/Home/End move between links, Escape closes and returns focus to the button
 *  - Tab, outside click and resize close it
 * Every row is at least 44px tall (Fitts's Law). Portalled to <body> so the header's backdrop-filter cannot trap it.
 */
export const ToolsMenu: React.FC<ToolsMenuProps> = ({ groups, currentPath, anchorRef, onClose, onNavigate }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    const left = Math.min(Math.max(r.left, MARGIN), window.innerWidth - WIDTH - MARGIN);
    setPos({ top: r.bottom + GAP, left });
  }, [anchorRef]);

  useEffect(() => {
    const anchor = anchorRef.current;
    const close = () => onCloseRef.current();
    const links = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href]') ?? []);

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || anchor?.contains(target)) return;
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        anchor?.focus();
        close();
        return;
      }
      if (e.key === 'Tab') {
        anchor?.focus();
        close();
        return;
      }
      const list = links();
      if (!list.length) return;
      const i = list.indexOf(document.activeElement as HTMLElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        list[(i + 1) % list.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        list[(i - 1 + list.length) % list.length].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        list[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        list[list.length - 1].focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', close);

    const frame = requestAnimationFrame(() => {
      setShown(true);
      links()[0]?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', close);
    };
  }, [anchorRef]);

  if (typeof document === 'undefined' || !pos) return null;

  return createPortal(
    <div
      ref={panelRef}
      role="group"
      aria-label={groups.length === 1 ? groups[0].heading : 'Tools'}
      style={{ top: pos.top, left: pos.left, width: WIDTH }}
      className={`fixed z-[9999] max-h-[calc(100vh-96px)] origin-top-left overflow-y-auto overscroll-contain rounded-2xl border border-[#0D0C22]/10 bg-white p-2 shadow-[0_12px_32px_rgba(13,12,34,0.10)] transition duration-150 ease-out motion-reduce:transition-none dark:border-white/10 dark:bg-[#161B2E] dark:shadow-black/40 ${
        shown ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-1 scale-[0.98] opacity-0'
      }`}
    >
      {groups.map((group, gi) => (
        <section key={group.id} aria-labelledby={`tools-menu-${group.id}`} className={gi > 0 ? 'mt-1.5 border-t border-[#0D0C22]/8 pt-1.5 dark:border-white/10' : ''}>
          <h2
            id={`tools-menu-${group.id}`}
            className={groups.length === 1 ? 'sr-only' : 'm-0 px-3 pb-1 pt-2 text-sm font-semibold tracking-[-0.011em] text-[#6E6D7A] dark:text-slate-300'}
          >
            {group.heading}
          </h2>
          <ul className="m-0 list-none space-y-0.5 p-0">
            {group.items.map((item) => {
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
                    onMouseEnter={() => void preloadForPath(item.path)}
                    onFocus={() => void preloadForPath(item.path)}
                    aria-current={active ? 'page' : undefined}
                    title={item.title}
                    className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold tracking-[-0.011em] no-underline outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#2563EB] dark:focus-visible:ring-[#60A5FA] ${
                      active
                        ? 'bg-[#F3F3F6] text-[#0D0C22] dark:bg-white/10 dark:text-white'
                        : 'text-[#0D0C22] hover:bg-[#F3F3F6] dark:text-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <span
                      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg ${
                        active
                          ? 'bg-[#DBE6FD] text-[#2563EB] dark:bg-[#2563EB]/25 dark:text-[#93B4FB]'
                          : 'bg-[#F3F3F6] text-[#3A3546] dark:bg-white/10 dark:text-slate-200'
                      }`}
                    >
                      <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span className="flex-1">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>,
    document.body
  );
};

export default ToolsMenu;
