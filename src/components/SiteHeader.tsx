import React from 'react';
import { Navbar } from './Navbar';
import { ChromeAccents } from './ChromeAccents';
import { ToolKey } from '../types';

interface SiteHeaderProps {
  activeTool: ToolKey;
  onSelectTool: (tool: ToolKey) => void;
  onOpenCommandPalette: () => void;
}

/**
 * The single, global site chrome: ONE sticky header row.
 *   left   logo (and the hamburger on phones)
 *   centre Quick Grade link + Tools dropdown
 *   right  search (Ctrl+K), 100% Private, theme
 *
 * Background is a clean, stark surface (white / near-black) with a hairline bottom edge and the shared geometric accents.
 * Mounted once in App.tsx above <Routes>.
 */
export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTool, onSelectTool, onOpenCommandPalette }) => (
  <div
    className="sticky top-0 z-50 isolate border-b border-slate-200/80 bg-white print:hidden dark:border-white/10 dark:bg-[#0B0F17]"
    data-site-chrome
  >
    <ChromeAccents variant="header" />
    <div className="relative z-10">
      <Navbar activeTool={activeTool} onSelectTool={onSelectTool} onOpenCommandPalette={onOpenCommandPalette} />
    </div>
  </div>
);

export default SiteHeader;
