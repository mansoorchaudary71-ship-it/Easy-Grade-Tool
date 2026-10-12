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
 * The single, global site chrome: glass main header + glass tool navigation bar.
 *
 * Mounted once in App.tsx above <Routes>, so the one-row tool bar sits directly under the header on
 * every page. This wrapper is the sticky element (both bars stay pinned together on every screen
 * size); each bar owns its own backdrop-blur layer, so neither nests inside the other's blur.
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
