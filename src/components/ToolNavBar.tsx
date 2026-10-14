import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { Link } from './SlashLink';
import { MoreToolsSheet } from './MoreToolsSheet';
import { MoreToolsMenu } from './MoreToolsMenu';
import { NAV_ITEMS } from '../data/navItems';
import { TOOL_PATHS } from '../data/constants';
import { isSamePath } from '../utils/paths';
import { preloadForPath } from '../utils/lazyRoutes';
import { preloadTool } from '../utils/toolPreloader';
import { ToolKey } from '../types';

export interface ToolNavBarProps {
  onSelectTool: (tool: ToolKey) => void;
}

/** One consistent stroke width for every toolbar / header icon. */
export const ICON_STROKE = 2;

/** Focus ring shared by the header and the tool bar. Light grey-blue surface; deep slate in dark mode. */
export const headerFocusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-blue-400/80 dark:focus-visible:ring-offset-[#1B2038]';

/**
 * Tabs are borderless, compact (36px) text links. Same font weight in every state so nothing shifts
 * when the active tab changes; state is carried by colour + the sliding underline.
 */
const tabBase =
  'relative isolate inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-3 min-h-9 text-[13.5px] font-medium leading-none tracking-[-0.005em] no-underline cursor-pointer select-none touch-manipulation transition-colors duration-200 ease-out [-webkit-tap-highlight-color:transparent]';

const tabFocusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-blue-400/80 dark:focus-visible:ring-offset-slate-900';

/** Neutral slate (about 7:1 on the light header, 6:1 on dark) that firms up to full strength on hover. */
const tabInactive =
  'text-slate-600 hover:bg-slate-900/[0.04] hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white';
const tabActive = 'text-slate-950 dark:text-white';

/**
 * Secondary "tool name" bar (Quick Grade, Weighted Grade, Final Exam, ...).
 *
 * Rendered by <SiteHeader /> directly under the main header, so it appears on EVERY route
 * (calculators, hub pages, grading-scale pages, legal/about pages and the 404 page).
 *
 * Design: no container box and no heavy border. The tabs sit straight on the shared gradient/contour
 * canvas, over a soft glass strip (`.avura-menu` in styles/premium.css) with a fading hairline on top.
 * The active tab is crisp dark text with a sliding blue underline + soft glow (Linear / Vercel style).
 * "More tools" is a regular tab that opens an anchored glass dropdown (bottom sheet on phones).
 */
export const ToolNavBar: React.FC<ToolNavBarProps> = ({ onSelectTool }) => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const navInnerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLAnchorElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreMode, setMoreMode] = useState<'menu' | 'sheet'>('menu');

  const isStaticPage =
    location.pathname.startsWith('/about') ||
    location.pathname.startsWith('/privacy') ||
    location.pathname.startsWith('/terms') ||
    location.pathname.startsWith('/methodology');

  // Academic tools are the primary row; general-purpose utilities live behind "More tools".
  const primaryItems = useMemo(() => NAV_ITEMS.filter((t) => t.group === 'academic'), []);
  const moreItems = useMemo(() => NAV_ITEMS.filter((t) => t.group === 'utility'), []);
  const activeMore = !isStaticPage
    ? moreItems.find((t) => isSamePath(location.pathname, t.path))
    : undefined;
  const moreIsActive = !!activeMore;

  // Center the active tool tab in the horizontally scrolling container on load and route change.
  useEffect(() => {
    const activeTab = activeTabRef.current;
    const navInner = navInnerRef.current;
    if (!activeTab || !navInner) return;

    const scrollBehavior = prefersReducedMotion ? 'instant' : 'smooth';
    const rafId = requestAnimationFrame(() => {
      try {
        // block: 'nearest' keeps the page from scrolling vertically
        activeTab.scrollIntoView({
          inline: 'center',
          block: 'nearest',
          behavior: scrollBehavior as ScrollBehavior,
        });
      } catch {
        const target = activeTab.offsetLeft - navInner.clientWidth / 2 + activeTab.offsetWidth / 2;
        navInner.scrollTo({ left: Math.max(0, target), behavior: scrollBehavior as ScrollBehavior });
      }
    });
    return () => cancelAnimationFrame(rafId);
  }, [location.pathname, prefersReducedMotion]);

  const indicatorTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 420, damping: 36, mass: 0.8 };

  const toggleMore = () => {
    if (moreOpen) {
      setMoreOpen(false);
      return;
    }
    // Anchored dropdown from tablet up, bottom sheet on phones.
    const wide = typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches;
    setMoreMode(wide ? 'menu' : 'sheet');
    setMoreOpen(true);
  };

  /** Sliding underline + soft glow. Rendered inside the active tab; behind its text. (A function, not a component, so the shared layoutId animation survives re-renders.) */
  const renderIndicator = () => (
    <motion.span
      layoutId="toolbar-active-indicator"
      transition={indicatorTransition}
      className="pointer-events-none absolute inset-x-0 -bottom-2 -z-10 h-5"
      aria-hidden="true"
    >
      <span className="absolute inset-x-2 bottom-1 h-4 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(37,99,235,0.20),transparent)] dark:bg-[radial-gradient(60%_100%_at_50%_100%,rgba(96,165,250,0.26),transparent)]" />
      <span className="absolute inset-x-3 bottom-[7px] h-[2px] rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 shadow-[0_0_12px_1px_rgba(37,99,235,0.5)] dark:from-blue-400 dark:via-blue-300 dark:to-sky-300 dark:shadow-[0_0_12px_1px_rgba(96,165,250,0.55)]" />
    </motion.span>
  );

  return (
    <>
      <nav className="avura-menu relative isolate px-2 sm:px-6 print:hidden" aria-label="Calculator tools">
        <LayoutGroup id="tool-nav-indicator">
          <div className="mx-auto flex max-w-[1240px] justify-center">
            {/* Horizontal scroller (hidden scrollbar) with a soft edge fade; pb leaves room for the glow. */}
            <div
              ref={navInnerRef}
              className="flex min-w-0 max-w-full items-center gap-0.5 overflow-x-auto overflow-y-hidden px-4 pb-2.5 pt-1 [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-16px),transparent)] [&::-webkit-scrollbar]:hidden"
            >
              {primaryItems.map((tool) => {
                const isActive = !isStaticPage && isSamePath(location.pathname, tool.path);
                const warm = () => {
                  preloadTool(tool.toolKey);
                  void preloadForPath(tool.path);
                };
                return (
                  <Link
                    key={tool.path}
                    ref={isActive ? activeTabRef : undefined}
                    to={tool.path}
                    onClick={() => {
                      // Only legacy tools map 1:1 to a ToolKey; hub pages share 'quick' and would bounce to Home.
                      if (isSamePath(TOOL_PATHS[tool.toolKey], tool.path)) onSelectTool(tool.toolKey);
                    }}
                    onMouseEnter={warm}
                    onFocus={warm}
                    onTouchStart={warm}
                    className={`${tabBase} ${tabFocusRing} ${isActive ? tabActive : tabInactive}`}
                    data-tool={tool.toolKey}
                    data-active={isActive}
                    aria-current={isActive ? 'page' : undefined}
                    title={tool.title}
                  >
                    {isActive && renderIndicator()}
                    <span>{tool.label}</span>
                  </Link>
                );
              })}

              {moreItems.length > 0 && (
                <button
                  ref={moreBtnRef}
                  type="button"
                  className={`${tabBase} ${tabFocusRing} ${moreIsActive || moreOpen ? tabActive : tabInactive}`}
                  aria-haspopup={moreMode === 'menu' ? 'true' : 'dialog'}
                  aria-expanded={moreOpen}
                  data-active={moreIsActive}
                  onClick={toggleMore}
                  onMouseEnter={() => moreItems.forEach((t) => void preloadForPath(t.path))}
                >
                  {moreIsActive && renderIndicator()}
                  <span>{moreIsActive ? activeMore?.label : 'More tools'}</span>
                  <ChevronDown
                    className={`size-3.5 shrink-0 opacity-60 transition-transform duration-200 ease-out motion-reduce:transition-none ${moreOpen ? 'rotate-180' : ''}`}
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </div>
        </LayoutGroup>
      </nav>

      {/* Portalled to <body>, so the bar's backdrop-filter cannot trap the fixed overlay */}
      {moreOpen && moreMode === 'menu' && (
        <MoreToolsMenu
          items={moreItems}
          currentPath={location.pathname}
          anchorRef={moreBtnRef}
          onClose={() => setMoreOpen(false)}
          onNavigate={(item) => {
            if (isSamePath(TOOL_PATHS[item.toolKey], item.path)) onSelectTool(item.toolKey);
          }}
        />
      )}
      {moreOpen && moreMode === 'sheet' && (
        <MoreToolsSheet
          items={moreItems}
          currentPath={location.pathname}
          onClose={() => setMoreOpen(false)}
          onNavigate={(item) => {
            if (isSamePath(TOOL_PATHS[item.toolKey], item.path)) onSelectTool(item.toolKey);
          }}
        />
      )}
    </>
  );
};

export default ToolNavBar;
