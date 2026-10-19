import React from 'react';
import { Navbar } from './Navbar';
import { ToolKey } from '../types';

interface SiteHeaderProps {
  activeTool: ToolKey;
  onSelectTool: (tool: ToolKey) => void;
  onOpenCommandPalette: () => void;
}

/**
 * The single, global site header: ONE sticky row (.site-header in styles/components.css).
 *   left    logo (and the menu button on phones)
 *   centre  Quick Grade link + Tools dropdown
 *   right   search (Ctrl+K) and theme
 * Mounted once in App.tsx above <Routes>.
 */
export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTool, onSelectTool, onOpenCommandPalette }) => (
  <div className="site-header print:hidden" data-site-chrome>
    <Navbar activeTool={activeTool} onSelectTool={onSelectTool} onOpenCommandPalette={onOpenCommandPalette} />
  </div>
);

export default SiteHeader;
