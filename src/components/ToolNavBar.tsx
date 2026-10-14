import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { Link } from './SlashLink';
import { MoreToolsSheet } from './MoreToolsSheet';
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

const tabBase =
  'relative isolate inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 min-h-10 text-[13.5px] leading-none no-underline cursor-pointer select-none touch-manipulation transition-[color,background-color,transform] duration-200 ease-out [-webkit-tap-highlight-color:transparent]';

/** Focus ring for tabs inside the frosted pill. */
const tabFocusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-blue-400/80 dark:focus-visible:ring-offset-slate-800';

const tabInactive =
  'font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white';
const tabActive = 'font-semibold text-slate-900 dark:text-white';

/** The sliding active pill: a clean white chip that lifts off the frosted bar (translucent white in dark mode). */
const pillClass =
  'absolute inset-0 -z-10 rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.08),0_4px_10px_-4px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/[0.05] dark:bg-white/[0.14] dark:shadow-none dark:ring-white/10';

/**
 * Secondary "tool name" bar (Quick Grade, Weighted Grade, Final Exam, ...).
 *
 * Rendered by <SiteHeader /> directly under the main header, so it appears on EVERY route
 * (calculators, hub pages, grading-scale pages, legal/about pages and the 404 page).
 * A centered, frosted "floating pill" menu (see `.avura-pill` in styles/premium.css) on the shared gradient +
 * contour-line canvas painted by <SiteHeader />. The bar itself is transparent. The active tab is a white chip
 * that slides between tabs (translucent white in dark mode).
 */
export const ToolNavBar: React.FC<ToolNavBarProps> = ({ onSelectTool }) => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const navInnerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLAnchorElement>(null);
  const [moreOpen, setMoreOpen] = useState(false);

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

  const pillTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] };

  return (
    <>
      <nav
        className="relative isolate px-3 pb-3 sm:px-6 sm:pb-3.5 print:hidden"
        aria-label="Calculator tools"
      >
        <LayoutGroup id="tool-nav-pill">
          <div className="mx-auto flex max-w-[1240px] justify-center">
            {/* Outer = frosted pill (must not be masked); inner = horizontal scroller with soft edge fade. */}
            <div className="avura-pill flex min-w-0 max-w-full rounded-full">
              <div
                ref={navInnerRef}
                className="flex min-w-0 items-center gap-0.5 overflow-x-auto overflow-y-hidden rounded-full px-1.5 py-1 [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,#000_12px,#000_calc(100%-12px),transparent)] [&::-webkit-scrollbar]:hidden"
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
                  {isActive && (
                    <motion.span
                      layoutId="toolbar-active-pill"
                      className={pillClass}
                      transition={pillTransition}
                      aria-hidden="true"
                    />
                  )}
                  <span>{tool.label}</span>
                </Link>
              );
            })}

            {moreItems.length > 0 && (
              <button
                type="button"
                className={`${tabBase} ${tabFocusRing} ${moreIsActive ? tabActive : tabInactive}`}
                aria-haspopup="dialog"
                aria-expanded={moreOpen}
                data-active={moreIsActive}
                onClick={() => setMoreOpen(true)}
                onMouseEnter={() => moreItems.forEach((t) => void preloadForPath(t.path))}
              >
                {moreIsActive && (
                  <motion.span
                    layoutId="toolbar-active-pill"
                    className={pillClass}
                    transition={pillTransition}
                    aria-hidden="true"
                  />
                )}
                <span>{moreIsActive ? activeMore?.label : 'More tools'}</span>
                <ChevronDown className="size-3.5 shrink-0 opacity-70" strokeWidth={2.25} aria-hidden="true" />
              </button>
            )}
              </div>
            </div>
          </div>
        </LayoutGroup>
      </nav>

      {/* Portalled to <body>, so the bar's backdrop-filter cannot trap its fixed overlay */}
      {moreOpen && (
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
