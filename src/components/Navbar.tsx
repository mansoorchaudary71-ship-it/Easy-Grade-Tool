import React, { useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from './SlashLink';
import { Sun, Moon, Laptop, Search } from 'lucide-react';
import { NAV_ITEMS } from '../data/navItems';
import { TOOL_PATHS } from '../data/constants';
import { isSamePath } from '../utils/paths';
import { preloadForPath } from '../utils/lazyRoutes';
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

export const Navbar: React.FC<NavbarProps> = ({
  activeTool,
  onSelectTool,
  onOpenCommandPalette,
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const location = useLocation();
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

    // On mobile the tool list wraps into rows (no horizontal scroll), so there is nothing to center.
    if (typeof window !== 'undefined' && window.matchMedia?.('(max-width: 640px)')?.matches) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    const scrollBehavior = prefersReducedMotion ? 'instant' : 'smooth';

    // Small delay via requestAnimationFrame ensures layout and DOM widths are stabilized across viewports
    const rafId = requestAnimationFrame(() => {
      // 1. Primary method requested: scrollIntoView with inline: center, block: nearest
      // block: 'nearest' ensures the whole page is NOT scrolled vertically
      try {
        activeTab.scrollIntoView({
          inline: 'center',
          block: 'nearest',
          behavior: scrollBehavior as ScrollBehavior,
        });
      } catch {
        // Fallback for older browsers: scroll only the navInner container directly to avoid vertical page jump
        const tabLeft = activeTab.offsetLeft;
        const tabWidth = activeTab.offsetWidth;
        const containerWidth = navInner.clientWidth;
        const targetScrollLeft = tabLeft - (containerWidth / 2) + (tabWidth / 2);
        navInner.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: scrollBehavior as ScrollBehavior,
        });
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [activeTool, location.pathname]);

  const [mounted, setMounted] = React.useState(false);
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

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link
          className="brand"
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

        <div className="topbar-right">
          {/* Quick Command Palette Trigger */}
          <button
            type="button"
            className="command-nav-trigger"
            onClick={onOpenCommandPalette}
            onMouseEnter={() => preloadTool('command-palette')}
            onFocus={() => preloadTool('command-palette')}
            onTouchStart={() => preloadTool('command-palette')}
            aria-label={`Open calculator search and command palette (${isMac ? '⌘K' : 'Ctrl+K'})`}
            title={`Switch calculators with Command Palette (${isMac ? '⌘K' : 'Ctrl+K'})`}
          >
            <Search aria-hidden="true" />
            <span className="command-nav-label">Search calculators...</span>
            <kbd className="command-nav-kbd">
              <span>{isMac ? '⌘' : 'Ctrl+'}</span>K
            </kbd>
          </button>

          <div className="topbar-note hidden sm:inline-flex">
            <span>100% Private</span>
          </div>

          {/* In-app PWA install trigger */}
          <PWAInstallButton />

          {/* Theme switcher */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={cycleTheme}
            aria-label={`Current theme: ${theme}. Click to switch theme.`}
            title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)} (Click to cycle)`}
          >
            {theme === 'system' ? (
              <Laptop aria-hidden="true" />
            ) : resolvedTheme === 'dark' ? (
              <Moon aria-hidden="true" />
            ) : (
              <Sun aria-hidden="true" />
            )}
            <span className="theme-toggle-label">{theme}</span>
          </button>
        </div>
      </div>

      <nav
        className="tool-nav"
        aria-label="Calculator tools"
      >
        <div className="tool-nav-inner" ref={navInnerRef}>
          {NAV_ITEMS.map((tool, idx) => {
            const Icon = tool.icon;
            const isActive = !isStaticPage && isSamePath(location.pathname, tool.path);
            const startsUtility = tool.group === 'utility' && NAV_ITEMS[idx - 1]?.group === 'academic';
            return (
              <React.Fragment key={tool.path}>
                {startsUtility && (
                  <span className="tool-nav-divider shrink-0 self-center mx-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400" role="separator" aria-label="More tools">
                    <span className="w-px h-5 bg-stone-300 dark:bg-slate-700" aria-hidden="true" />
                    <span>More</span>
                  </span>
                )}
                <Link
                  ref={isActive ? activeTabRef : undefined}
                  to={tool.path}
                  onClick={() => {
                    // Only the 8 legacy tools map 1:1 to a ToolKey. Pages like Weighted/Final Exam/Test Grade/
                    // Grade Curve/Letter Grade share the 'quick' key, so selecting them via onSelectTool would
                    // navigate back to Home. The <Link> already navigates to the right page.
                    if (isSamePath(TOOL_PATHS[tool.toolKey], tool.path)) onSelectTool(tool.toolKey);
                  }}
                  onMouseEnter={() => { preloadTool(tool.toolKey); void preloadForPath(tool.path); }}
                  onFocus={() => { preloadTool(tool.toolKey); void preloadForPath(tool.path); }}
                  onTouchStart={() => { preloadTool(tool.toolKey); void preloadForPath(tool.path); }}
                  className={`tool-nav-item inline-flex items-center no-underline cursor-pointer ${
                    isActive
                      ? 'bg-white text-stone-900 font-bold rounded-full shadow-sm border border-stone-200 px-4 py-1.5'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/50 rounded-full font-semibold px-4 py-1.5 transition-all'
                  }`}
                  data-tool={tool.toolKey}
                  data-active={isActive}
                  aria-current={isActive ? 'page' : undefined}
                  title={tool.title}
                >
                  <Icon aria-hidden="true" />
                  <span>{tool.label}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
