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
 * The single, global site chrome: solid slate main header + slate tool navigation bar.
 *
 * Mounted once in App.tsx above <Routes>, so the one-row tool bar sits directly under the header on
 * every page. This wrapper is the sticky element (both bars stay pinned together on every screen
 * size); the two bars share the slate banner look.
 * There must be exactly ONE tool bar: a second one would share the sliding pill's layoutId and the
 * pill would jump between the two.
 */
export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTool, onSelectTool, onOpenCommandPalette }) => (
  <div className="site-chrome sticky top-0 z-50 print:hidden" data-site-chrome>
    <Navbar activeTool={activeTool} onSelectTool={onSelectTool} onOpenCommandPalette={onOpenCommandPalette} />
    <ToolNavBar onSelectTool={onSelectTool} />
  </div>
);

export default SiteHeader;
