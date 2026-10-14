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
 * Menu buttons follow a two-state Primary / Secondary system:
 *
 *   Primary   = the page you are on. Solid indigo, white text, soft coloured shadow, top highlight.
 *   Secondary = every other tool. White fill, indigo outline + text; fills with a faint tint on hover.
 *
 * Both states share the same size, radius, border width and font weight, so nothing shifts when the
 * active tool changes. The Primary fill is a sliding pill (shared layoutId) that glides between tabs.
 * Brand indigo is #4D63DA (taken from the reference); tweak the three hex values below to retheme.
 */
const tabBase =
  'relative isolate inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border-[1.5px] px-3.5 min-h-10 text-[13px] font-semibold leading-none tracking-[-0.005em] no-underline cursor-pointer select-none touch-manipulation [-webkit-tap-highlight-color:transparent]';

const tabFocusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-[#4D63DA]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-[#8B9CFF]/80 dark:focus-visible:ring-offset-slate-900';

/** Secondary: white fill, indigo outline. Hover firms the outline and adds a lift + faint tint. */
const tabSecondary =
  'border-[#4D63DA]/50 bg-white/90 text-[#4D63DA] shadow-[0_1px_2px_rgba(30,41,90,0.06)] hover:-translate-y-px hover:border-[#4D63DA] hover:bg-[#F3F5FF] hover:shadow-[0_6px_14px_-8px_rgba(77,99,218,0.45)] dark:border-[#8B9CFF]/35 dark:bg-white/[0.05] dark:text-[#B4C0FF] dark:shadow-none dark:hover:border-[#8B9CFF]/80 dark:hover:bg-white/[0.10] dark:hover:text-white';

/** Secondary while its dropdown is open (the "More tools" button). */
const tabSecondaryOpen =
  'border-[#4D63DA] bg-[#F3F5FF] text-[#3F54C7] shadow-[0_6px_14px_-8px_rgba(77,99,218,0.45)] dark:border-[#8B9CFF]/80 dark:bg-white/[0.10] dark:text-white dark:shadow-none';

/** Primary: the solid fill is painted by the sliding pill, so the tab itself stays transparent. z-10 keeps the gliding pill above its neighbours. */
const tabPrimary = 'z-10 border-transparent bg-transparent text-white';

/**
 * Secondary "tool name" bar (Quick Grade, Weighted Grade, Final Exam, ...).
 *
 * Rendered by <SiteHeader /> directly under the main header, so it appears on EVERY route
 * (calculators, hub pages, grading-scale pages, legal/about pages and the 404 page).
 *
 * Design: Primary / Secondary buttons. The active tool is a solid indigo button (sliding pill), every
 * other tool is a white outlined button. They sit on the shared gradient/contour canvas, over a soft
 * glass strip (`.avura-menu` in styles/premium.css).
 * "More tools" is a Secondary button that opens an anchored glass dropdown (bottom sheet on phones).
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

  /** Sliding Primary fill (gradient, top highlight, coloured shadow). Rendered inside the active tab, behind its text. (A function, not a component, so the shared layoutId animation survives re-renders.) */
  const renderIndicator = () => (
    <motion.span
      layoutId="toolbar-active-indicator"
      transition={indicatorTransition}
      style={{ borderRadius: 12 }}
      className="pointer-events-none absolute -inset-[1.5px] -z-10 bg-gradient-to-b from-[#5A6FE6] to-[#4157CC] shadow-[0_10px_20px_-10px_rgba(65,87,204,0.75),0_2px_4px_rgba(65,87,204,0.25),inset_0_1px_0_rgba(255,255,255,0.28)] dark:from-[#6E82F5] dark:to-[#4A5FDB] dark:shadow-[0_10px_22px_-10px_rgba(0,0,0,0.7),0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)]"
      aria-hidden="true"
    />
  );

  return (
    <>
      <nav className="avura-menu relative isolate px-2 sm:px-6 print:hidden" aria-label="Calculator tools">
        <LayoutGroup id="tool-nav-indicator">
          <div className="mx-auto flex max-w-[1400px] justify-center">
            {/* Horizontal scroller (hidden scrollbar) with a soft edge fade; the padding leaves room for the button shadows. */}
            <div
              ref={navInnerRef}
              className="flex min-w-0 max-w-full items-center gap-1.5 overflow-x-auto overflow-y-hidden px-4 pb-3.5 pt-1.5 [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-16px),transparent)] [&::-webkit-scrollbar]:hidden"
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
                    className={`${tabBase} ${tabFocusRing} ${isActive ? tabPrimary : tabSecondary}`}
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
                  className={`${tabBase} ${tabFocusRing} ${moreIsActive ? tabPrimary : moreOpen ? tabSecondaryOpen : tabSecondary}`}
                  aria-haspopup={moreMode === 'menu' ? 'true' : 'dialog'}
                  aria-expanded={moreOpen}
                  data-active={moreIsActive}
                  onClick={toggleMore}
                  onMouseEnter={() => moreItems.forEach((t) => void preloadForPath(t.path))}
                >
                  {moreIsActive && renderIndicator()}
                  <span>{moreIsActive ? activeMore?.label : 'More tools'}</span>
                  <ChevronDown
                    className={`size-3.5 shrink-0 opacity-80 transition-transform duration-200 ease-out motion-reduce:transition-none ${moreOpen ? 'rotate-180' : ''}`}
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
