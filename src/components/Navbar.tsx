import React, { useMemo, useEffect, useState } from 'react';
import { Link } from './SlashLink';
import { Sun, Moon, Search, Menu } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { ToolKey } from '../types';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { preloadTool } from '../utils/toolPreloader';
import { Logo } from './Logo';
import { ToolNavBar } from './ToolNavBar';
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

/** The header is a flat white surface (canvas colour in dark mode), so the focus ring offset follows the theme. */
const focusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-[#A68A6D] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-[#D6BEA0] dark:focus-visible:ring-offset-[#0F172A]';

/** Shared look for the round header controls (search icon on phones, hamburger, theme switch): pure white, 1px edge, weightless pills. */
const glassControl =
  'elev-pill text-[#5E4A36] hover:text-[#2A221A] active:translate-y-px dark:text-slate-200 dark:hover:text-white';

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

  return (
    <MotionConfig reducedMotion="user">
      <header className="relative print:hidden">
        {/* Phones: logo left, actions right.  md+: 3-column grid so the links are perfectly centred. */}
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-2 px-4 sm:px-8 md:grid md:h-20 md:grid-cols-[1fr_auto_1fr] lg:px-12">
          {/* ------------------------------ Left: logo ------------------------------ */}
          <div className="flex min-w-0 items-center gap-1 sm:gap-3 md:justify-self-start">
            {/* Hamburger: phones only. Opens the grouped tools drawer. */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
              className={`-ml-1 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full ${glassControl} md:hidden ${focusRing}`}
            >
              <Menu className="size-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </button>
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
              {/* The logo is an SVG, so give the link real text for crawlers (invisible on screen). */}
              <span className="sr-only">Easy Grade Tool Home</span>
            </Link>
          </div>

          {/* ------------------------------ Centre: main links ------------------------------ */}
          <div className="hidden md:flex md:justify-center">
            <ToolNavBar onSelectTool={onSelectTool} />
          </div>

          {/* ------------------------------ Right: actions ------------------------------ */}
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3.5 md:justify-self-end">
            {/* Search: icon button on phones and tablets, pure-white pill field from xl up */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              onTouchStart={() => preloadTool('command-palette')}
              onMouseEnter={() => preloadTool('command-palette')}
              aria-label={`Open calculator search (${shortcutLabel})`}
              title={`Search calculators (${shortcutLabel})`}
              className={`inline-flex size-11 items-center justify-center rounded-full ${glassControl} xl:hidden ${focusRing}`}
            >
              <Search className="size-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </button>

            <div className="group relative hidden w-64 transition-[width] duration-300 ease-out xl:block 2xl:w-72 xl:focus-within:w-72 2xl:focus-within:w-80">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#A39583] transition-colors duration-300 group-focus-within:text-[#7A6149] dark:text-slate-400 dark:group-focus-within:text-[#D6BEA0]"
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
                className="elev-pill h-11 w-full cursor-pointer rounded-full py-2 pl-11 pr-[4.75rem] text-[13.5px] font-medium tracking-tight text-[#2A221A] outline-none placeholder:text-[#8C7F70] dark:text-slate-100 dark:placeholder:text-slate-400"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center rounded-full border border-[#7A6149]/15 bg-[#FAF9F7] px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-[#8C7F70] dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                {shortcutLabel}
              </kbd>
            </div>

            {/* 100% Private: white pill with a 1px edge, shield only from lg, with the words from xl */}
            <div
              className="elev-pill elev-pill--ok hidden h-11 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium tracking-tight text-[#5E4A36] dark:text-[#E6D5BF] lg:inline-flex"
              title="100% Private: everything runs in your browser"
            >
              <PrivacyShieldIcon className="size-4 shrink-0" />
              <span className="hidden xl:inline">100% Private</span>
              <span className="sr-only xl:hidden">100% Private</span>
            </div>

            {/* Theme switcher: System -> Light -> Dark (icon-only to keep the header clean) */}
            <button
              type="button"
              onClick={cycleTheme}
              aria-label={`Current theme: ${theme}. Click to switch theme.`}
              title={`Theme: ${themeLabel} (Click to cycle)`}
              className={`inline-flex size-11 items-center justify-center rounded-full ${glassControl} ${focusRing}`}
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
