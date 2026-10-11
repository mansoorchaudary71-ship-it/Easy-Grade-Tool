import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Ellipsis } from 'lucide-react';
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
  'relative isolate inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 min-h-11 text-[13px] no-underline cursor-pointer select-none touch-manipulation [-webkit-tap-highlight-color:transparent]';

// slate-100 (not 300): the bar is translucent, so inactive labels need extra contrast over light pages.
const tabInactive = 'font-semibold text-slate-100 hover:bg-white/[0.1] hover:text-white';
const tabActive = 'font-bold text-white';

/** The sliding active pill: vibrant blue with a soft glow and a crisp 1px inner edge. */
const pillClass =
  'absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-[#3B82F6] to-[#2563EB] shadow-[0_8px_20px_-6px_rgba(37,99,235,0.75),inset_0_1px_0_rgba(255,255,255,0.22)] ring-1 ring-inset ring-white/15';

/**
 * Secondary "tool name" bar (Quick Grade, Weighted Grade, Final Exam, ...).
 *
 * Rendered by <SiteHeader /> directly under the main header, so it appears on EVERY route
 * (calculators, hub pages, grading-scale pages, legal/about pages and the 404 page).
 * Glass surface: translucent slate + backdrop blur + 1px hairline (see `.glass-bar` in premium.css).
 * Everything inside it stays fully opaque.
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
      <nav className="glass-bar glass-bar--tools relative z-40 md:sticky md:top-[65px] print:hidden" aria-label="Calculator tools">
        <LayoutGroup id="tool-nav-pill">
          <div
            ref={navInnerRef}
            className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-1.5 px-3.5 py-2 md:flex-nowrap md:justify-start md:overflow-x-auto md:overflow-y-hidden md:[scrollbar-width:none] sm:px-6 md:[&::-webkit-scrollbar]:hidden"
          >
            {primaryItems.map((tool) => {
              const Icon = tool.icon;
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
                  className={`${tabBase} ${headerFocusRing} ${isActive ? tabActive : tabInactive}`}
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
                  <Icon className="size-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  <span>{tool.label}</span>
                </Link>
              );
            })}

            {moreItems.length > 0 && (
              <button
                type="button"
                className={`${tabBase} ${headerFocusRing} ${moreIsActive ? tabActive : tabInactive}`}
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
                <Ellipsis className="size-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden="true" />
                <span>{moreIsActive ? activeMore?.label : 'More tools'}</span>
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
