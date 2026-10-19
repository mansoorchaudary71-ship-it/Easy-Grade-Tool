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
      <header className="print:hidden">
        {/* Phones: logo left, actions right. md+: 3-column grid so the links are centred (see .site-header__row). */}
        <div className="shell site-header__row">
          {/* ------------------------------ Left: logo ------------------------------ */}
          <div className="flex min-w-0 items-center gap-1 sm:gap-3 md:justify-self-start">
            {/* Hamburger: phones only. Opens the grouped tools drawer. */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
              className="btn btn-ghost btn-icon -ml-2 md:hidden"
            >
              <Menu className="size-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </button>
            <Link
              className="inline-flex rounded-lg"
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
          </div>

          {/* ------------------------------ Centre: main links ------------------------------ */}
          <div className="hidden md:flex md:justify-center">
            <ToolNavBar onSelectTool={onSelectTool} />
          </div>

          {/* ------------------------------ Right: actions ------------------------------ */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:justify-self-end">
            {/* Search: icon button on phones and tablets, a field from xl up */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              onTouchStart={() => preloadTool('command-palette')}
              onMouseEnter={() => preloadTool('command-palette')}
              aria-label={`Open calculator search (${shortcutLabel})`}
              title={`Search calculators (${shortcutLabel})`}
              className="btn btn-ghost btn-icon xl:hidden"
            >
              <Search className="size-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </button>

            <div className="group relative hidden w-64 xl:block">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-3 group-focus-within:text-brand"
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
                className="field cursor-pointer pl-11 pr-[4.75rem] text-sm font-medium"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                {shortcutLabel}
              </kbd>
            </div>

            {/* Theme switcher: System -> Light -> Dark (icon-only to keep the header clean) */}
            <button
              type="button"
              onClick={cycleTheme}
              aria-label={`Current theme: ${theme}. Click to switch theme.`}
              title={`Theme: ${themeLabel} (Click to cycle)`}
              className="btn btn-ghost btn-icon"
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
