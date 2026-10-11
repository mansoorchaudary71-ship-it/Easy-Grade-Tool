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
 * under the header on every page. The wrapper is `display: contents`: the header is sticky on
 * every screen size, the tool bar docks under it from `md` up (on phones it wraps into pill
 * rows and scrolls away so it never eats the screen). Each bar owns its own glass layer.
 */
export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTool, onSelectTool, onOpenCommandPalette }) => (
  <div className="site-chrome contents print:hidden" data-site-chrome>
    <Navbar activeTool={activeTool} onSelectTool={onSelectTool} onOpenCommandPalette={onOpenCommandPalette} />
    <ToolNavBar onSelectTool={onSelectTool} />
  </div>
);

export default SiteHeader;
