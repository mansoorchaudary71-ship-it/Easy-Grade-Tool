import React, { useMemo, useEffect, useState } from 'react';
import { Link } from './SlashLink';
import { Search, Menu } from 'lucide-react';
import { MotionConfig } from 'motion/react';
import { ToolKey } from '../types';
import { useLocation } from 'react-router-dom';
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
/* Icons */
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

/* -------------------------------------------------------------------------- */
/* Shared class strings */
/* -------------------------------------------------------------------------- */

/** Round ghost buttons (hamburger, search icon on small screens, theme switch): no border, grey chip on hover. */
const ghostControl =
  'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#0F1114] transition-colors duration-150 hover:bg-[#EEF2FF] active:scale-95 ';

/** Solid pill call to action (the "Sign up" slot in the Dribbble-style header). Colour unchanged. White in dark mode. */
const ctaPill =
  'relative h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#2457F5] px-5 text-base font-semibold text-white no-underline transition-colors duration-150 hover:bg-[#1A41C9] active:scale-[0.98] ';

/* -------------------------------------------------------------------------- */
/* Component */
/* -------------------------------------------------------------------------- */

export const Navbar: React.FC<NavbarProps> = ({
  activeTool,
  onSelectTool,
  onOpenCommandPalette,
}) => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  /*
    Dribbble's header morphs on scroll: at the top it shows only the logo,
    nav links and buttons, and once the page is scrolled a search pill
    appears in the header row. Same here: the pill mounts once the page is
    scrolled past the banner. Initial state (false) matches the prerendered
    HTML, so hydration never flashes.
  */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 160);
    // Initial read is deferred until the browser is idle: reading scrollY during hydration forces a synchronous layout.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const idle = w.requestIdleCallback ? w.requestIdleCallback(onScroll, { timeout: 1500 }) : window.setTimeout(onScroll, 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (w.requestIdleCallback && w.cancelIdleCallback) w.cancelIdleCallback(idle); else window.clearTimeout(idle);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const isMac = useMemo(() => {
    return (
      mounted &&
      typeof navigator !== 'undefined' &&
      /Mac|iPod|iPhone|iPad/i.test(navigator.userAgent || '')
    );
  }, [mounted]);

  const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K';

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
          One row, Dribbble-style structure:
          at the top: logo | plain-text nav links | text link | solid pill | theme.
          once scrolled: the grey search pill appears between logo and nav.
          Below xl the group nav links move into the hamburger drawer; the
          For Schools text link stays visible from lg (it is the embed
          programme, so it earns a permanent header slot).
          Below lg the search icon opens the palette (the pill is desktop only).
          Colours follow the NOVA system: brand blue (#2457F5) for the pill,
          focus rings and hovers — no Dribbble pink anywhere.
        */}
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-2 px-4 sm:px-6 lg:h-20 lg:gap-4 lg:px-8 xl:gap-5">
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

          {/* ------------------------------ Search pill, on scroll only (Dribbble morph) ------------------------------ */}
          {/*
            Grey filled pill with the magnifier inside, as on the reference.
            The pill is the entry point to the command palette (which owns the real search UI).
            Click, Enter, or the first typed character hands off to the palette.
          */}
          {scrolled && (
          <div className="header-search-in hidden min-w-0 flex-1 lg:block lg:max-w-[300px]">
            <div className="flex h-12 items-center gap-2 rounded-full bg-[#F3F3F4] pl-4 pr-4 transition-colors duration-200 hover:bg-[#E7E7E9] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2457F5] ">
              <Search className="size-[18px] shrink-0 text-[#6E6D7A] " strokeWidth={ICON_STROKE} aria-hidden="true" />
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
                className="header-search-field h-full min-w-0 flex-1 cursor-pointer truncate bg-transparent text-[15px] font-normal tracking-[-0.011em] text-[#0F1114] outline-none placeholder:text-[#6E6D7A] 2xl:text-base "
              />
              <span
                className="hidden shrink-0 text-[15px] font-semibold tracking-[-0.011em] text-[#6E6D7A] 2xl:inline "
                aria-hidden="true"
              >
                {shortcutLabel}
              </span>
            </div>
          </div>
          )}

          {/* ------------------------------ Plain-text group menus (Dribbble-style) ------------------------------ */}
          <ToolNavBar onSelectTool={onSelectTool} />

          {/* ------------------------------ Right cluster ------------------------------ */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 xl:gap-3">
            {/* For Schools: plain text link in the "Log in" slot. Visible from lg. */}
            <Link
              to="/for-schools/"
              title="Embed free grade calculators on your school website"
              className={`hidden h-11 shrink-0 items-center whitespace-nowrap px-3 text-base font-semibold text-[#0F1114] no-underline transition-colors duration-150 hover:text-[#2457F5] lg:inline-flex ${headerFocusRing} `}
            >
              For Schools
            </Link>

            {/* Quick Grade: solid pill in the "Sign up" slot (colour unchanged). */}
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
              className="hidden size-11 items-center justify-center text-[#6E6D7A] min-[1700px]:inline-flex "
            >
              <PrivacyShieldIcon className="size-5" />
            </div>
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
