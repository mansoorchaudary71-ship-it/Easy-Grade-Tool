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

/** Focus ring shared by the header controls (blue ring, offset follows the theme). */
export const headerFocusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-[#60A5FA] dark:focus-visible:ring-offset-[#0F172A]';

/**
 * Header text style (taken from the reference header): semibold, near-black ink, slightly tightened tracking, sentence case.
 * Shared by the dropdown triggers and the plain text link so every header label looks identical.
 */
export const headerTextBase =
  'relative inline-flex h-11 shrink-0 cursor-pointer select-none items-center gap-1 whitespace-nowrap rounded-full px-3 text-[15px] font-semibold tracking-[-0.011em] no-underline touch-manipulation transition-colors duration-150 2xl:px-4 2xl:text-base [-webkit-tap-highlight-color:transparent]';
export const headerTextIdle = 'text-[#0D0C22] hover:bg-[#F3F3F6] dark:text-slate-100 dark:hover:bg-white/10';
/** Active = soft grey chip plus a 2px blue bar under the label, so it never relies on colour alone. */
const headerTextActive =
  'bg-[#F3F3F6] text-[#0D0C22] after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:rounded-full after:bg-[#2563EB] dark:bg-white/10 dark:text-white dark:after:bg-[#60A5FA]';

/** Short trigger labels (the full group headings stay inside the dropdown for screen readers and the mobile drawer). */
const TRIGGER_LABEL: Record<string, string> = {
  grades: 'Grade tools',
  gpa: 'GPA & percent',
  everyday: 'Everyday tools',
};

const STATIC_PREFIXES = ['/about', '/privacy', '/terms', '/methodology'];

/**
 * Desktop primary navigation (lg and up): one trigger per tool group, each with a chevron and its own dropdown
 * (same pattern as the reference: Explore / Hire Talent / Get Hired / Community). Rendered inside the single header row by <Navbar />.
 * On phones and tablets the same groups live in <MobileNavDrawer /> behind the hamburger button.
 */
export const ToolNavBar: React.FC<ToolNavBarProps> = ({ onSelectTool }) => {
  const location = useLocation();
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const isStaticPage = STATIC_PREFIXES.some((p) => location.pathname.startsWith(p));
  const openGroup = TOOL_GROUPS.find((g) => g.id === openId);

  return (
    <>
      <nav className="hidden items-center gap-0.5 lg:flex 2xl:gap-1" aria-label="Main">
        {TOOL_GROUPS.map((group) => {
          const isOpen = openId === group.id;
          const hasActive = !isStaticPage && group.items.some((t) => isSamePath(location.pathname, t.path));
          return (
            <button
              key={group.id}
              type="button"
              aria-haspopup="true"
              aria-expanded={isOpen}
              data-active={hasActive}
              onClick={(e) => {
                anchorRef.current = e.currentTarget;
                setOpenId(isOpen ? null : group.id);
              }}
              onMouseEnter={() => group.items.slice(0, 3).forEach((t) => void preloadForPath(t.path))}
              className={`${headerTextBase} ${headerFocusRing} ${hasActive || isOpen ? headerTextActive : headerTextIdle}`}
            >
              <span>{TRIGGER_LABEL[group.id] ?? group.heading}</span>
              <ChevronDown
                className={`size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
                strokeWidth={ICON_STROKE}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </nav>

      {openGroup && (
        <ToolsMenu
          key={openGroup.id}
          groups={[openGroup]}
          currentPath={location.pathname}
          anchorRef={anchorRef}
          onClose={() => setOpenId(null)}
          onNavigate={(item) => {
            if (isSamePath(TOOL_PATHS[item.toolKey], item.path)) onSelectTool(item.toolKey);
          }}
        />
      )}
    </>
  );
};

export default ToolNavBar;
