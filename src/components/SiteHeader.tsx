import React from 'react';
import { Navbar } from './Navbar';
import { ToolKey } from '../types';

interface SiteHeaderProps {
  activeTool: ToolKey;
  onSelectTool: (tool: ToolKey) => void;
  onOpenCommandPalette: () => void;
}

/**
 * Decorative, minimalist geometric accents that overlap the header edges (thick + hairline curves and one
 * small rotated square). Purely visual: pointer-events are off, it is hidden from assistive tech, and it is
 * clipped to the header box so it never causes horizontal scroll.
 */
const HeaderAccents: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    {/* Green arc: crosses the top edge between the logo and the centred links (lg and up) */}
    <svg
      className="absolute -top-9 left-[24%] hidden h-[120px] w-[200px] lg:block"
      viewBox="0 0 200 120"
      fill="none"
    >
      <path d="M6 2C58 8 112 40 142 104" stroke="#14B885" strokeWidth="7" strokeLinecap="round" className="opacity-90 dark:opacity-70" />
      <path d="M40 0C96 10 152 50 176 120" stroke="#14B885" strokeWidth="1" className="opacity-60 dark:opacity-40" />
    </svg>

    {/* Orange ring: overlaps the top edge on the right */}
    <svg
      className="absolute -top-12 right-[7%] hidden h-[130px] w-[130px] md:block"
      viewBox="0 0 130 130"
      fill="none"
    >
      <circle cx="65" cy="65" r="58" stroke="#F2603E" strokeWidth="1" className="opacity-60 dark:opacity-40" />
      <path d="M112 36A58 58 0 0 1 78 122" stroke="#F2603E" strokeWidth="7" strokeLinecap="round" className="opacity-95 dark:opacity-75" />
    </svg>

    {/* Pale blue tile tucked against the bottom edge */}
    <span className="absolute -bottom-3 right-[5.4%] hidden size-6 rotate-[28deg] rounded-[5px] bg-[#B9D0FF] dark:bg-[#3B5BA8] md:block" />
  </div>
);

/**
 * The single, global site chrome: ONE sticky header row.
 *   left   logo (and the hamburger on phones)
 *   centre Quick Grade link + Tools dropdown
 *   right  search (Ctrl+K), 100% Private, theme, Install App
 *
 * Background is a clean, stark surface (white / near-black) with a hairline bottom edge and the geometric accents above.
 * Mounted once in App.tsx above <Routes>.
 */
export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTool, onSelectTool, onOpenCommandPalette }) => (
  <div
    className="sticky top-0 z-50 isolate border-b border-slate-200/80 bg-white print:hidden dark:border-white/10 dark:bg-[#0B0F17]"
    data-site-chrome
  >
    <HeaderAccents />
    <div className="relative z-10">
      <Navbar activeTool={activeTool} onSelectTool={onSelectTool} onOpenCommandPalette={onOpenCommandPalette} />
    </div>
  </div>
);

export default SiteHeader;
