import React, { useMemo, useEffect, useState } from 'react';
import { Link } from './SlashLink';
import { Sun, Moon, Search } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { ToolKey } from '../types';
import { useTheme } from '../context/ThemeContext';
import { PWAInstallButton } from './PWAInstallButton';
import { preloadTool } from '../utils/toolPreloader';
import { Logo } from './Logo';

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
      <header className="slate-bar relative isolate print:hidden">
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
      </header>
    </MotionConfig>
  );
};
