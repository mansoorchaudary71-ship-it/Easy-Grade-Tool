import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Link } from './SlashLink';
import { Navbar } from './Navbar';
import { ToolKey } from '../types';
import { isSamePath } from '../utils/paths';

interface SiteHeaderProps {
  activeTool: ToolKey;
  onSelectTool: (tool: ToolKey) => void;
  onOpenCommandPalette: () => void;
}

/** Audience shortcuts shown in the thin bar above the header (like "For Individuals / For Businesses" on the reference). */
const AUDIENCES: { label: string; path: string }[] = [
  { label: 'For Teachers', path: '/' },
  { label: 'For Students', path: '/gpa-calculator/' },
  { label: 'For Everyone', path: '/percentage-calculator/' },
];

/**
 * The single, global site chrome (Coursera-style), mounted once in App.tsx above <Routes>:
 *   1. utility bar (hidden on phones): audience shortcuts on the left, privacy note on the right
 *   2. ONE sticky header row: logo | Explore menu | search | About | primary button | theme switch
 * Surface: flat white with a hairline underneath (.elev-chrome).
 */
export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTool, onSelectTool, onOpenCommandPalette }) => {
  const location = useLocation();
  return (
    <>
      {/* Utility bar: scrolls away with the page so it never costs screen space while reading */}
      <div className="cs-utility hidden md:block print:hidden">
        <div className="cs-container flex items-center justify-between">
          <nav aria-label="Audience" className="flex items-center gap-5">
            {AUDIENCES.map((a) => (
              <Link
                key={a.path}
                to={a.path}
                className="cs-utility-link"
                aria-current={isSamePath(location.pathname, a.path) ? 'page' : undefined}
              >
                {a.label}
              </Link>
            ))}
          </nav>
          <p className="m-0 inline-flex items-center gap-1.5 text-sm text-[color:var(--cs-muted)]">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Free, private and works offline
          </p>
        </div>
      </div>
      {/* Main header row: the only sticky part */}
      <div className="elev-chrome sticky top-0 z-50 isolate print:hidden" data-site-chrome>
        <Navbar activeTool={activeTool} onSelectTool={onSelectTool} onOpenCommandPalette={onOpenCommandPalette} />
      </div>
    </>
  );
};

export default SiteHeader;
