import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { ToolsMenu } from './ToolsMenu';
import { TOOL_GROUPS } from '../data/navItems';
import { TOOL_PATHS } from '../data/constants';
import { isSamePath } from '../utils/paths';
import { preloadForPath } from '../utils/lazyRoutes';
import { ToolKey } from '../types';

export interface ToolNavBarProps {
  onSelectTool: (tool: ToolKey) => void;
}

/** One consistent stroke width for every toolbar / header icon. */
export const ICON_STROKE = 2;

/** Focus ring shared by the header controls (Coursera blue, offset follows the theme). */
export const headerFocusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-[#0056D2] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-[#4F9CFF] dark:focus-visible:ring-offset-[#0F172A]';

/** Header text link style: 16px semibold, near-black ink, pale-blue chip on hover. */
export const headerTextBase =
  'relative inline-flex h-11 shrink-0 cursor-pointer select-none items-center gap-1 whitespace-nowrap rounded-lg px-3 text-base font-semibold no-underline touch-manipulation transition-colors duration-150 [-webkit-tap-highlight-color:transparent]';
export const headerTextIdle = 'text-[#0F1114] hover:bg-[#F0F6FF] dark:text-slate-100 dark:hover:bg-white/10';

const STATIC_PREFIXES = ['/about', '/privacy', '/terms', '/methodology'];

/**
 * Desktop primary navigation (lg and up): ONE "Explore" button (the same pattern as the reference) that opens a
 * three-column menu with every tool group. Rendered inside the single header row by <Navbar />.
 * On phones and tablets the same groups live in <MobileNavDrawer /> behind the hamburger button.
 */
export const ToolNavBar: React.FC<ToolNavBarProps> = ({ onSelectTool }) => {
  const location = useLocation();
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  const isStaticPage = STATIC_PREFIXES.some((p) => location.pathname.startsWith(p));
  const hasActive = !isStaticPage && TOOL_GROUPS.some((g) => g.items.some((t) => isSamePath(location.pathname, t.path)));

  return (
    <>
      <nav className="hidden items-center lg:flex" aria-label="Main">
        <button
          ref={anchorRef}
          type="button"
          aria-haspopup="true"
          aria-expanded={open}
          data-active={hasActive}
          onClick={() => setOpen((o) => !o)}
          onMouseEnter={() => TOOL_GROUPS.forEach((g) => g.items.slice(0, 2).forEach((t) => void preloadForPath(t.path)))}
          className={`cs-explore ${headerFocusRing}`}
        >
          <span>Explore</span>
          <ChevronDown
            className={`size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
            strokeWidth={ICON_STROKE}
            aria-hidden="true"
          />
        </button>
      </nav>

      {open && (
        <ToolsMenu
          groups={TOOL_GROUPS}
          currentPath={location.pathname}
          anchorRef={anchorRef}
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
