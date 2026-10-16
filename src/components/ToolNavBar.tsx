import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Link } from './SlashLink';
import { ToolsMenu } from './ToolsMenu';
import { PRIMARY_NAV_ITEM, TOOL_GROUPS, TOOLS_MENU_ITEMS } from '../data/navItems';
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

/** Focus ring shared by the header controls. */
export const headerFocusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-[#0B0F17]';

const STATIC_PREFIXES = ['/about', '/privacy', '/terms', '/methodology'];

/** 44px-tall text link: small tracked capitals; state is carried by colour AND a hairline underline so it never relies on colour alone. */
const linkBase =
  'relative inline-flex min-h-11 shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[12.5px] font-medium uppercase tracking-[0.12em] no-underline touch-manipulation transition-colors duration-150 lg:px-5 [-webkit-tap-highlight-color:transparent]';
const linkIdle =
  'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white';
const linkActive =
  'text-slate-950 dark:text-white after:absolute after:inset-x-4 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-blue-600 dark:after:bg-blue-400 lg:after:inset-x-5';

/**
 * Desktop primary navigation (md and up): ONE visible link (Quick Grade) plus ONE "Tools" dropdown that holds
 * every other calculator, grouped. Rendered inside the header row by <Navbar />, so there is no second tab row.
 * On phones the same list lives in <MobileNavDrawer /> behind the hamburger button.
 */
export const ToolNavBar: React.FC<ToolNavBarProps> = ({ onSelectTool }) => {
  const location = useLocation();
  const toolsBtnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const isStaticPage = STATIC_PREFIXES.some((p) => location.pathname.startsWith(p));
  const primaryActive = !isStaticPage && isSamePath(location.pathname, PRIMARY_NAV_ITEM.path);
  const activeTool = !isStaticPage ? TOOLS_MENU_ITEMS.find((t) => isSamePath(location.pathname, t.path)) : undefined;

  const warmPrimary = () => {
    preloadTool(PRIMARY_NAV_ITEM.toolKey);
    void preloadForPath(PRIMARY_NAV_ITEM.path);
  };

  return (
    <>
      <nav className="hidden items-center gap-1 md:flex lg:gap-3" aria-label="Main">
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
          className={`${linkBase} ${headerFocusRing} ${primaryActive ? linkActive : linkIdle}`}
        >
          {PRIMARY_NAV_ITEM.label}
        </Link>

        <button
          ref={toolsBtnRef}
          type="button"
          aria-haspopup="true"
          aria-expanded={open}
          data-active={!!activeTool}
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={() => TOOLS_MENU_ITEMS.slice(0, 3).forEach((t) => void preloadForPath(t.path))}
          className={`${linkBase} ${headerFocusRing} ${activeTool || open ? linkActive : linkIdle}`}
        >
          <span>{activeTool ? activeTool.label : 'Tools'}</span>
          <ChevronDown
            className={`size-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
            strokeWidth={ICON_STROKE}
            aria-hidden="true"
          />
        </button>
      </nav>

      {open && (
        <ToolsMenu
          groups={TOOL_GROUPS}
          currentPath={location.pathname}
          anchorRef={toolsBtnRef}
          onClose={() => setOpen(false)}
          onNavigate={(item) => {
            if (isSamePath(TOOL_PATHS[item.toolKey], item.path)) onSelectTool(item.toolKey);
          }}
        />
      )}
    </>
  );
};

export default ToolNavBar;
