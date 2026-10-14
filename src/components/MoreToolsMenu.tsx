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
 * Anchored glass dropdown for the "More tools" button (tablet + desktop; phones keep the bottom sheet).
 * Items use the same Primary / Secondary buttons as the menu bar: current page = solid indigo, others = outlined.
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
      className={`fixed z-[9999] origin-top-right overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-2 shadow-[0_24px_60px_-24px_rgba(30,41,90,0.45),0_2px_6px_rgba(15,23,42,0.05)] backdrop-blur-xl backdrop-saturate-150 transition duration-150 ease-out motion-reduce:transition-none dark:border-white/10 dark:bg-slate-900/90 dark:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] ${
        shown ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-1 scale-[0.98] opacity-0'
      }`}
    >
      <p className="m-0 px-1.5 pb-2 pt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        General tools
      </p>
      <ul className="m-0 list-none space-y-1.5 p-0">
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
                className={`group relative flex min-h-11 items-center gap-3 rounded-xl border-[1.5px] px-2.5 text-[13.5px] font-semibold no-underline outline-none focus-visible:ring-2 focus-visible:ring-[#4D63DA]/60 focus-visible:ring-offset-1 dark:focus-visible:ring-[#8B9CFF]/80 dark:focus-visible:ring-offset-slate-900 ${
                  active
                    ? 'border-transparent bg-gradient-to-b from-[#5A6FE6] to-[#4157CC] text-white shadow-[0_10px_20px_-10px_rgba(65,87,204,0.75),inset_0_1px_0_rgba(255,255,255,0.28)] dark:from-[#6E82F5] dark:to-[#4A5FDB]'
                    : 'border-[#4D63DA]/40 bg-white/90 text-[#4D63DA] hover:-translate-y-px hover:border-[#4D63DA] hover:bg-[#F3F5FF] hover:shadow-[0_6px_14px_-8px_rgba(77,99,218,0.45)] dark:border-[#8B9CFF]/30 dark:bg-white/[0.04] dark:text-[#B4C0FF] dark:hover:border-[#8B9CFF]/80 dark:hover:bg-white/[0.10] dark:hover:text-white'
                }`}
              >
                <span
                  className={`inline-flex size-7 shrink-0 items-center justify-center rounded-lg ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-[#4D63DA]/10 text-[#4D63DA] dark:bg-white/[0.08] dark:text-[#B4C0FF] dark:group-hover:text-white'
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
    </div>,
    document.body
  );
};

export default MoreToolsMenu;
