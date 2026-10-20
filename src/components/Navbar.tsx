import React, { useMemo, useEffect, useState } from 'react';
import { Link } from './SlashLink';
import { Sun, Moon, Search, Menu } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { ToolKey } from '../types';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { preloadTool } from '../utils/toolPreloader';
import { preloadForPath } from '../utils/lazyRoutes';
import { Logo } from './Logo';
import { ToolNavBar, headerFocusRing } from './ToolNavBar';
import { MobileNavDrawer } from './MobileNavDrawer';
import { PRIMARY_NAV_ITEM, TOOL_GROUPS } from '../data/navItems';
import { TOOL_PATHS } from '../data/constants';
import { isSamePath } from '../utils/paths';

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

/** Round ghost buttons (hamburger, search icon on small screens, theme switch): no border, grey chip on hover. */
const ghostControl =
  'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#0F1114] transition-colors duration-150 hover:bg-[#F0F6FF] active:scale-95 dark:text-slate-100 dark:hover:bg-white/10';

/** Dark pill call to action (same role as "Log in" in the reference). White in dark mode. */
const ctaPill =
  'relative h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#0056D2] px-5 text-base font-semibold text-white no-underline transition-colors duration-150 hover:bg-[#00419E] active:scale-[0.98] dark:bg-[#4F9CFF] dark:text-[#0B1220] dark:hover:bg-[#7DB6FF]';

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export const Navbar: React.FC<NavbarProps> = ({
  activeTool,
  onSelectTool,
  onOpenCommandPalette,
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const isStaticPage = ['/about', '/privacy', '/terms', '/methodology'].some((p) => location.pathname.startsWith(p));
  const primaryActive = !isStaticPage && isSamePath(location.pathname, PRIMARY_NAV_ITEM.path);

  const warmPrimary = () => {
    preloadTool(PRIMARY_NAV_ITEM.toolKey);
    void preloadForPath(PRIMARY_NAV_ITEM.path);
  };

  return (
    <MotionConfig reducedMotion="user">
      <header className="relative print:hidden">
        {/*
          One row, same structure as the reference header:
          logo | search pill (grows) | grouped menus | text link | dark pill | theme.
          Below lg the menus, text link and pill move into the hamburger drawer.
        */}
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-2 px-4 sm:px-6 lg:h-[72px] lg:gap-4 lg:px-8 xl:gap-5">
          {/* ------------------------------ Logo ------------------------------ */}
          <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-3">
            {/* Hamburger: below xl only. Opens the grouped tools drawer. */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
              className={`-ml-2 ${ghostControl} xl:hidden ${headerFocusRing}`}
            >
              <Menu className="size-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </button>
            <Link
              className={`brand rounded-xl ${headerFocusRing}`}
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
              {/* The logo is an SVG, so give the link real text for crawlers (invisible on screen). */}
              <span className="sr-only">Easy Grade Tool Home</span>
            </Link>
          </div>

          {/* ------------------------------ Search pill (lg and up) ------------------------------ */}
          {/*
            The pill is the entry point to the command palette (which owns the real search UI).
            Click, Enter, or the first typed character hands off to the palette.
          */}
          <div className="hidden min-w-0 flex-1 lg:block lg:max-w-[360px]">
            <div className="flex h-12 items-center rounded-full border border-[#8A94A6] bg-white pl-5 pr-1 transition-colors duration-200 hover:border-[#0F1114] focus-within:border-[#0056D2] focus-within:ring-1 focus-within:ring-[#0056D2] dark:border-slate-500 dark:bg-white/[0.06]">
              <input
                type="text"
                readOnly
                role="searchbox"
                autoComplete="off"
                spellCheck={false}
                placeholder="What do you want to calculate?"
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
                className="header-search-field h-full min-w-0 flex-1 cursor-pointer truncate bg-transparent text-[15px] font-normal tracking-[-0.011em] text-[#0F1114] outline-none placeholder:text-[#6E6D7A] 2xl:text-base dark:text-slate-100 dark:placeholder:text-slate-400"
              />
              <span
                className="mr-3 hidden shrink-0 text-[15px] font-semibold tracking-[-0.011em] text-[#3A3546] 2xl:inline dark:text-slate-300"
                aria-hidden="true"
              >
                {shortcutLabel}
              </span>
              <button
                type="button"
                onClick={onOpenCommandPalette}
                onTouchStart={() => preloadTool('command-palette')}
                onMouseEnter={() => preloadTool('command-palette')}
                aria-label={`Open calculator search (${shortcutLabel})`}
                className={`inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0056D2] text-white transition-colors duration-150 hover:bg-[#00419E] active:scale-95 ${headerFocusRing}`}
              >
                <Search className="size-[18px]" strokeWidth={ICON_STROKE} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* ------------------------------ Quick Grade, then the three group menus ------------------------------ */}
          {/* Quick Grade pill: sits right after the search bar (lg and up) */}
          <Link
            to={PRIMARY_NAV_ITEM.path}
            onClick={() => {
              if (isSamePath(TOOL_PATHS[PRIMARY_NAV_ITEM.toolKey], PRIMARY_NAV_ITEM.path)) onSelectTool(PRIMARY_NAV_ITEM.toolKey);
            }}
            onMouseEnter={warmPrimary}
            onFocus={warmPrimary}
            onTouchStart={warmPrimary}
            aria-current={primaryActive ? 'page' : undefined}
            title={PRIMARY_NAV_ITEM.title}
            className={`${ctaPill} ${headerFocusRing} hidden lg:inline-flex`}
          >
            {PRIMARY_NAV_ITEM.label}
          </Link>

          <ToolNavBar onSelectTool={onSelectTool} />

          {/* ------------------------------ Right cluster ------------------------------ */}
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 xl:gap-3">
            {/* Search icon: below lg only (the pill takes over from lg) */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              onTouchStart={() => preloadTool('command-palette')}
              onMouseEnter={() => preloadTool('command-palette')}
              aria-label={`Open calculator search (${shortcutLabel})`}
              title={`Search calculators (${shortcutLabel})`}
              className={`${ghostControl} lg:hidden ${headerFocusRing}`}
            >
              <Search className="size-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </button>

            {/* 100% Private: icon only, min-[1700px] and up (the words stay available as the tooltip and to screen readers) */}
            <div
              role="img"
              aria-label="100% Private: everything runs in your browser"
              title="100% Private: everything runs in your browser"
              className="hidden size-11 items-center justify-center text-[#6E6D7A] min-[1700px]:inline-flex dark:text-slate-400"
            >
              <PrivacyShieldIcon className="size-5" />
            </div>

            {/* Theme switcher: System -> Light -> Dark (icon-only to keep the header clean) */}
            <button
              type="button"
              onClick={cycleTheme}
              aria-label={`Current theme: ${theme}. Click to switch theme.`}
              title={`Theme: ${themeLabel} (Click to cycle)`}
              className={`${ghostControl} ${headerFocusRing}`}
            >
              <span className="relative inline-flex size-5 items-center justify-center">
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
                      <SunMoonSplitIcon className="size-5" />
                    ) : resolvedTheme === 'dark' ? (
                      <Moon className="size-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
                    ) : (
                      <Sun className="size-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <MobileNavDrawer
          primary={PRIMARY_NAV_ITEM}
          groups={TOOL_GROUPS}
          currentPath={location.pathname}
          shortcutLabel={shortcutLabel}
          onClose={() => setDrawerOpen(false)}
          onNavigate={(item) => {
            if (isSamePath(TOOL_PATHS[item.toolKey], item.path)) onSelectTool(item.toolKey);
          }}
          onOpenSearch={() => window.setTimeout(onOpenCommandPalette, 0)}
        />
      )}
    </MotionConfig>
  );
};
