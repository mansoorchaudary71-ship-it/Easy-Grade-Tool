import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Link } from './SlashLink';
import { NavItem } from '../data/navItems';
import { isSamePath } from '../utils/paths';

interface MoreToolsMenuProps {
  items: NavItem[];
  currentPath: string;
  /** The "More tools" tab button. The menu anchors to it and ignores clicks on it (it toggles itself). */
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  onNavigate: (item: NavItem) => void;
}

const WIDTH = 264;
const GAP = 10;
const MARGIN = 12;

/**
 * Anchored glass dropdown for the "More tools" tab (tablet + desktop; phones keep the bottom sheet).
 *
 * Non-modal on purpose: the page stays scrollable and the header stays reachable, like a normal menu.
 *  - opens right under the tab, right-aligned to it and clamped inside the viewport
 *  - closes on Escape, outside click, Tab (focus returns to the tab) and on resize
 *  - ArrowUp / ArrowDown move between tools, focus starts on the first one
 * Mount it only while open. Portalled to <body> so the header's backdrop-filter can't trap it.
 */
export const MoreToolsMenu: React.FC<MoreToolsMenuProps> = ({ items, currentPath, anchorRef, onClose, onNavigate }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    const left = Math.min(Math.max(r.right - WIDTH, MARGIN), window.innerWidth - WIDTH - MARGIN);
    setPos({ top: r.bottom + GAP, left });
  }, [anchorRef]);

  useEffect(() => {
    const anchor = anchorRef.current;
    const close = () => onCloseRef.current();

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
        // Non-modal: leaving the menu with Tab closes it and continues from the tab button.
        anchor?.focus();
        close();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const links = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href]') ?? []);
        if (!links.length) return;
        e.preventDefault();
        const i = links.indexOf(document.activeElement as HTMLElement);
        const next = e.key === 'ArrowDown' ? (i + 1) % links.length : (i - 1 + links.length) % links.length;
        links[next].focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', close);

    const frame = requestAnimationFrame(() => {
      setShown(true);
      panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
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
      aria-label="More tools"
      style={{ top: pos.top, left: pos.left, width: WIDTH }}
      className={`fixed z-[9999] origin-top-right overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 p-1.5 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45),0_2px_6px_rgba(15,23,42,0.05)] backdrop-blur-xl backdrop-saturate-150 transition duration-150 ease-out motion-reduce:transition-none dark:border-white/10 dark:bg-slate-900/85 dark:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] ${
        shown ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-1 scale-[0.98] opacity-0'
      }`}
    >
      <p className="m-0 px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
        General tools
      </p>
      <ul className="m-0 list-none space-y-0.5 p-0">
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
                className={`group flex min-h-10 items-center gap-3 rounded-xl px-2.5 text-[13.5px] font-medium no-underline outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-blue-500/70 dark:focus-visible:ring-blue-400/80 ${
                  active
                    ? 'bg-slate-900/[0.05] text-slate-950 dark:bg-white/10 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-900/[0.04] hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/[0.07] dark:hover:text-white'
                }`}
              >
                <span
                  className={`inline-flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${
                    active
                      ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300'
                      : 'bg-slate-900/[0.05] text-slate-500 group-hover:text-slate-800 dark:bg-white/[0.06] dark:text-slate-400 dark:group-hover:text-slate-100'
                  }`}
                >
                  <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="flex-1">{item.label}</span>
                {active && (
                  <span
                    className="size-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.7)] dark:bg-blue-400"
                    aria-hidden="true"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>,
    document.body
  );
};

export default MoreToolsMenu;
