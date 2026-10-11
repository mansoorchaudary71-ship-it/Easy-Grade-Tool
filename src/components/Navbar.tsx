import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from './SlashLink';
import { Sun, Moon, Search, Ellipsis } from 'lucide-react';
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { NAV_ITEMS } from '../data/navItems';
import { TOOL_PATHS } from '../data/constants';
import { isSamePath } from '../utils/paths';
import { preloadForPath } from '../utils/lazyRoutes';
import { ToolKey } from '../types';
import { useTheme } from '../context/ThemeContext';
import { PWAInstallButton } from './PWAInstallButton';
import { preloadTool } from '../utils/toolPreloader';
import { Logo } from './Logo';
import { MoreToolsSheet } from './MoreToolsSheet';

interface NavbarProps {
  activeTool: ToolKey;
  onSelectTool: (tool: ToolKey) => void;
  onOpenCommandPalette: () => void;
}

/** One consistent stroke width for every toolbar / header icon. */
const ICON_STROKE = 2;

/* -------------------------------------------------------------------------- */
/* Icons                                                                       */
/* -------------------------------------------------------------------------- */

/** Small inline shield-with-check used inside the "100% Private" badge. */
const PrivacyShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={ICON_STROKE}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.1 7.5 9.5 4.4-1.4 7.5-4.9 7.5-9.5V6L12 3Z" />
    <path d="m9 12 2.2 2.2L15.2 10" />
  </svg>
);

/**
 * Dedicated "System" theme icon: one circle split down the middle.
 * Left half = sun (with rays), right half = moon (solid half-disc).
 */
const SunMoonSplitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={ICON_STROKE}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* Disc outline */}
    <circle cx="12" cy="12" r="5" />
    {/* Moon half (right) */}
    <path d="M12 7a5 5 0 0 1 0 10Z" fill="currentColor" />
    {/* Sun rays (left only) */}
    <path d="M12 2.5v2M12 19.5v2M4.6 12H2.5M6.3 6.3 4.9 4.9M6.3 17.7l-1.4 1.4" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* Shared class strings                                                        */
/* -------------------------------------------------------------------------- */

/** The header is always the deep slate surface (#1E293B), so the focus ring offset matches it in both themes. */
const focusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E293B]';

const tabBase =
  'relative isolate inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 min-h-11 text-[13px] no-underline cursor-pointer select-none touch-manipulation [-webkit-tap-highlight-color:transparent]';

const tabInactive =
  'font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white';

const tabActive = 'font-bold text-white';

/** The sliding active pill: vibrant blue with a soft glow and a crisp 1px inner edge. */
const pillClass =
  'absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-[#3B82F6] to-[#2563EB] shadow-[0_8px_20px_-6px_rgba(37,99,235,0.75),inset_0_1px_0_rgba(255,255,255,0.22)] ring-1 ring-inset ring-white/15';

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export const Navbar: React.FC<NavbarProps> = ({
  activeTool,
  onSelectTool,
  onOpenCommandPalette,
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const isStaticPage =
    location.pathname.startsWith('/about') ||
    location.pathname.startsWith('/privacy') ||
    location.pathname.startsWith('/methodology');
  const navInnerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLAnchorElement>(null);

  // Center the active tool tab in the horizontally scrolling container on load and route/tool change
  useEffect(() => {
    const activeTab = activeTabRef.current;
    const navInner = navInnerRef.current;
    if (!activeTab || !navInner) return;

    const scrollBehavior = prefersReducedMotion ? 'instant' : 'smooth';

    // requestAnimationFrame ensures layout and DOM widths are stable across viewports
    const rafId = requestAnimationFrame(() => {
      // block: 'nearest' makes sure the whole page is NOT scrolled vertically
      try {
        activeTab.scrollIntoView({
          inline: 'center',
          block: 'nearest',
          behavior: scrollBehavior as ScrollBehavior,
        });
      } catch {
        // Fallback for older browsers: scroll only the nav container
        const tabLeft = activeTab.offsetLeft;
        const tabWidth = activeTab.offsetWidth;
        const containerWidth = navInner.clientWidth;
        const targetScrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2;
        navInner.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: scrollBehavior as ScrollBehavior,
        });
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [activeTool, location.pathname, prefersReducedMotion]);

  const [moreOpen, setMoreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isMac = useMemo(() => {
    return (
      mounted &&
      typeof navigator !== 'undefined' &&
      /Mac|iPod|iPhone|iPad/i.test(navigator.userAgent || '')
    );
  }, [mounted]);

  // Academic tools are the primary row; general-purpose utilities live behind "More tools".
  const primaryItems = useMemo(() => NAV_ITEMS.filter((t) => t.group === 'academic'), []);
  const moreItems = useMemo(() => NAV_ITEMS.filter((t) => t.group === 'utility'), []);
  const activeMore = !isStaticPage
    ? moreItems.find((t) => isSamePath(location.pathname, t.path))
    : undefined;
  const moreIsActive = !!activeMore;

  const cycleTheme = () => {
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K';
  const themeLabel = theme.charAt(0).toUpperCase() + theme.slice(1);

  // The shared sliding pill spring (instant when the user prefers reduced motion)
  const pillTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] };

  return (
    <MotionConfig reducedMotion="user">
      <header className="header-slate sticky top-0 z-50 border-b border-white/10 bg-[#1E293B]/95 shadow-[0_12px_32px_-16px_rgba(15,23,42,0.7)] backdrop-blur-xl print:hidden">
        {/* Decorative overlay: faint concentric arcs + a wave. Non-interactive, clipped by its own overflow-hidden parent. */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1440 120"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            focusable="false"
          >
            <g stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.25">
              <circle cx="1290" cy="-12" r="64" />
              <circle cx="1290" cy="-12" r="118" />
              <circle cx="1290" cy="-12" r="176" />
              <circle cx="1290" cy="-12" r="238" />
              <path d="M-40 92 C 180 40, 360 142, 600 84 S 980 18, 1180 74 S 1400 96, 1500 52" />
              <path d="M-40 112 C 200 66, 380 160, 620 106 S 1000 44, 1200 98 S 1420 118, 1500 78" />
            </g>
          </svg>
          <div className="absolute -right-24 -top-28 h-64 w-96 rounded-full bg-[#2563EB]/25 blur-3xl" />
        </div>
        {/* ------------------------------ Top bar ------------------------------ */}
        <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between px-3.5 sm:h-16 sm:px-6">
          <Link
            className={`brand rounded-xl ${focusRing}`}
            to="/"
            onClick={() => {
              onSelectTool('quick');
            }}
            onMouseEnter={() => preloadTool('quick')}
            onPointerDown={() => preloadTool('quick')}
            onTouchStart={() => preloadTool('quick')}
            aria-label="Easy Grade Tool Home"
          >
            <Logo onDark />
          </Link>

          <div className="flex items-center gap-4 sm:gap-5">
            {/* Search: compact icon button on phones, expanding field from md up */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              onTouchStart={() => preloadTool('command-palette')}
              aria-label={`Open calculator search (${shortcutLabel})`}
              className={`inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-200 shadow-sm hover:bg-white/10 hover:text-white md:hidden ${focusRing}`}
            >
              <Search className="size-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </button>

            <div className="group relative hidden w-52 transition-[width] duration-300 ease-out md:block lg:w-64 md:focus-within:w-64 lg:focus-within:w-80">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8] transition-colors duration-300 group-focus-within:text-blue-300"
                strokeWidth={ICON_STROKE}
                aria-hidden="true"
              />
              {/*
                The field is the entry point to the command palette (which owns the real
                search UI). Focusing it expands + rings it; click, Enter, or the first
                typed character hands off to the palette.
              */}
              <input
                type="text"
                readOnly
                role="searchbox"
                autoComplete="off"
                spellCheck={false}
                placeholder="Search calculators..."
                aria-label={`Search calculators (${shortcutLabel})`}
                title={`Switch calculators with the command palette (${shortcutLabel})`}
                onClick={onOpenCommandPalette}
                onMouseEnter={() => preloadTool('command-palette')}
                onFocus={() => preloadTool('command-palette')}
                onKeyDown={(e) => {
                  const isPrintable = e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey;
                  if (e.key === 'Enter' || e.key === 'ArrowDown' || isPrintable) {
                    e.preventDefault();
                    onOpenCommandPalette();
                  }
                }}
                className="h-11 w-full cursor-pointer rounded-full border border-white/10 bg-white/[0.06] py-2 pl-10 pr-16 text-[13px] font-medium text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition-all duration-300 placeholder:text-[#94A3B8] hover:border-white/20 hover:bg-white/10 focus:border-transparent focus:bg-white/10 focus:ring-2 focus:ring-blue-400/60"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-[#94A3B8] lg:inline-flex">
                {shortcutLabel}
              </kbd>
            </div>

            {/* 100% Private badge */}
            <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-[#2563EB]/20 px-3 py-1.5 text-xs font-semibold text-blue-200 lg:inline-flex">
              <PrivacyShieldIcon className="size-3.5 shrink-0" />
              <span>100% Private</span>
            </div>

            {/* In-app PWA install trigger */}
            <PWAInstallButton />

            {/* Theme switcher: System -> Light -> Dark */}
            <button
              type="button"
              onClick={cycleTheme}
              aria-label={`Current theme: ${theme}. Click to switch theme.`}
              title={`Theme: ${themeLabel} (Click to cycle)`}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 text-xs font-semibold text-slate-100 shadow-sm hover:bg-white/10 hover:text-white ${focusRing}`}
            >
              <span className="relative inline-flex size-4 items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme === 'system' ? 'system' : resolvedTheme}
                    className="inline-flex"
                    initial={prefersReducedMotion ? false : { opacity: 0, rotate: -60, scale: 0.7 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotate: 60, scale: 0.7 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    {theme === 'system' ? (
                      <SunMoonSplitIcon className="size-4" />
                    ) : resolvedTheme === 'dark' ? (
                      <Moon className="size-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                    ) : (
                      <Sun className="size-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="hidden capitalize lg:inline">{theme}</span>
            </button>
          </div>
        </div>

        {/* --------------------------- Secondary toolbar ------------------------ */}
        <nav
          className="border-t border-white/10 bg-black/20"
          aria-label="Calculator tools"
        >
          <LayoutGroup id="tool-nav-pill">
            <div
              ref={navInnerRef}
              className="mx-auto flex max-w-[1240px] items-center gap-1.5 overflow-x-auto overflow-y-hidden px-3.5 py-2 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
            >
              {primaryItems.map((tool) => {
                const Icon = tool.icon;
                const isActive = !isStaticPage && isSamePath(location.pathname, tool.path);
                return (
                  <Link
                    key={tool.path}
                    ref={isActive ? activeTabRef : undefined}
                    to={tool.path}
                    onClick={() => {
                      // Only the legacy tools map 1:1 to a ToolKey. Pages like Weighted/Final Exam/Test Grade/
                      // Grade Curve/Letter Grade share the 'quick' key, so selecting them via onSelectTool would
                      // navigate back to Home. The <Link> already navigates to the right page.
                      if (isSamePath(TOOL_PATHS[tool.toolKey], tool.path)) onSelectTool(tool.toolKey);
                    }}
                    onMouseEnter={() => {
                      preloadTool(tool.toolKey);
                      void preloadForPath(tool.path);
                    }}
                    onFocus={() => {
                      preloadTool(tool.toolKey);
                      void preloadForPath(tool.path);
                    }}
                    onTouchStart={() => {
                      preloadTool(tool.toolKey);
                      void preloadForPath(tool.path);
                    }}
                    className={`${tabBase} ${focusRing} ${isActive ? tabActive : tabInactive}`}
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
                  className={`${tabBase} ${focusRing} ${moreIsActive ? tabActive : tabInactive}`}
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
      </header>
    </MotionConfig>
  );
};
