import React from 'react';
import { Navbar } from './Navbar';
import { ToolNavBar } from './ToolNavBar';
import { ToolKey } from '../types';

interface SiteHeaderProps {
  activeTool: ToolKey;
  onSelectTool: (tool: ToolKey) => void;
  onOpenCommandPalette: () => void;
}

/**
 * The single, global site chrome: main glass header + glass tool navigation bar.
 *
 * Mounted once in App.tsx above <Routes>, so the tool bar is guaranteed to appear directly
 * under the header on every page. The sticky wrapper carries NO backdrop-filter itself:
 * each bar owns its own glass layer, so both blur the page content scrolling underneath
 * (a parent with backdrop-filter would stop its children from blurring the page).
 */
export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTool, onSelectTool, onOpenCommandPalette }) => (
  <div className="site-chrome sticky top-0 z-50 print:hidden" data-site-chrome>
    <Navbar activeTool={activeTool} onSelectTool={onSelectTool} onOpenCommandPalette={onOpenCommandPalette} />
    <ToolNavBar onSelectTool={onSelectTool} />
  </div>
);

export default SiteHeader;
