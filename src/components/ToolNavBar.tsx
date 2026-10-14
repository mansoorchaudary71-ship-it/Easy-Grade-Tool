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

/** Focus ring shared by the header and the tool bar. The glass bars sit on the slate hue, so the offset matches it. */
export const headerFocusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E293B]';

const tabBase =
  'relative isolate inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 min-h-11 text-[14px] leading-none tracking-[-0.005em] no-underline cursor-pointer select-none touch-manipulation transition-[color,background-color,transform] duration-200 ease-out active:scale-[0.97] [-webkit-tap-highlight-color:transparent]';

/** Light, calm focus ring for the white bar (the shared `headerFocusRing` above is tuned for the dark header). */
const tabFocusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-indigo-400/80 dark:focus-visible:ring-offset-slate-900';

const tabInactive =
  'font-medium text-slate-500 hover:bg-slate-900/[0.045] hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/[0.07] dark:hover:text-slate-100';
const tabActive = 'font-semibold text-indigo-600 dark:text-indigo-300';

/** The sliding active pill: soft lavender fill, hairline indigo edge, a lifted glow and a crisp top highlight. */
const pillClass =
  'absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-indigo-50 to-[#E6E8FF] ring-1 ring-inset ring-indigo-200/70 shadow-[0_6px_16px_-8px_rgba(79,70,229,0.55),inset_0_1px_0_rgba(255,255,255,0.9)] dark:from-indigo-400/20 dark:to-indigo-500/15 dark:ring-indigo-300/25 dark:shadow-[0_8px_20px_-10px_rgba(99,102,241,0.7),inset_0_1px_0_rgba(255,255,255,0.12)]';

/**
 * Secondary "tool name" bar (Quick Grade, Weighted Grade, Final Exam, ...).
 *
 * Rendered by <SiteHeader /> directly under the main header, so it appears on EVERY route
 * (calculators, hub pages, grading-scale pages, legal/about pages and the 404 page).
 * Light frosted bar with text-only pill tabs (soft lavender active pill that slides between tabs).
 * Dark mode gets a deep slate surface with an indigo-tinted pill. The main header above is not touched.
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
        className="relative isolate border-b border-slate-200/80 bg-white/90 shadow-[0_12px_28px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl print:hidden dark:border-white/10 dark:bg-slate-900/90 dark:shadow-[0_14px_32px_-18px_rgba(0,0,0,0.7)]"
        aria-label="Calculator tools"
      >
        <LayoutGroup id="tool-nav-pill">
          <div
            ref={navInnerRef}
            className="mx-auto flex max-w-[1240px] items-center gap-1 overflow-x-auto overflow-y-hidden px-6 py-2.5 [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,#000_20px,#000_calc(100%-20px),transparent)] sm:px-8 [&::-webkit-scrollbar]:hidden [&>*:first-child]:ml-auto [&>*:last-child]:mr-auto"
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
