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

const focusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900';

const tabBase =
  'relative isolate inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 min-h-11 text-[13px] no-underline cursor-pointer select-none touch-manipulation [-webkit-tap-highlight-color:transparent]';

const tabInactive =
  'font-semibold text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-400';

const tabActive = 'font-bold text-slate-900 dark:text-white';

const pillClass =
  'absolute inset-0 -z-10 rounded-full border border-gray-200/70 bg-white shadow-sm shadow-gray-400/20 dark:border-white/10 dark:bg-slate-700/80 dark:shadow-black/30';

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
    : { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.9 };

  return (
    <MotionConfig reducedMotion="user">
      <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/70 backdrop-blur-md print:hidden dark:border-white/10 dark:bg-slate-950/70">
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
            <Logo />
          </Link>

          <div className="flex items-center gap-4 sm:gap-5">
            {/* Search: compact icon button on phones, expanding field from md up */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              onTouchStart={() => preloadTool('command-palette')}
              aria-label={`Open calculator search (${shortcutLabel})`}
              className={`inline-flex size-11 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-teal-700 md:hidden dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:text-teal-400 ${focusRing}`}
            >
              <Search className="size-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </button>

            <div className="group relative hidden w-52 transition-[width] duration-300 ease-out md:block lg:w-64 md:focus-within:w-64 lg:focus-within:w-80">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors duration-300 group-focus-within:text-teal-600"
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
                className="h-11 w-full cursor-pointer rounded-full border border-gray-200 bg-white/80 py-2 pl-10 pr-16 text-[13px] font-medium text-slate-800 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-gray-300 focus:border-transparent focus:ring-2 focus:ring-teal-500/40 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-400"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-gray-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-slate-500 lg:inline-flex dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
                {shortcutLabel}
              </kbd>
            </div>

            {/* 100% Private badge */}
            <div className="hidden items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 lg:inline-flex dark:bg-teal-500/10 dark:text-teal-300">
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
              className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-teal-700 active:scale-95 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:text-teal-400 ${focusRing}`}
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
          className="border-t border-gray-200/60 bg-slate-50 dark:border-white/10 dark:bg-slate-900"
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
