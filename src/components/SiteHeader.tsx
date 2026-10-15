import React from 'react';
import { Navbar } from './Navbar';
import { ToolKey } from '../types';

interface SiteHeaderProps {
  activeTool: ToolKey;
  onSelectTool: (tool: ToolKey) => void;
  onOpenCommandPalette: () => void;
}

/**
 * The single, global site chrome: ONE sticky header row (logo, Quick Grade link, Tools dropdown, search, theme).
 *
 * Mounted once in App.tsx above <Routes>. The former second row of 10+ tool tabs was removed (Hick's Law):
 * the Tools dropdown (desktop) and the hamburger drawer (mobile) now hold every calculator on every page.
 * This wrapper owns the shared background (`.avura-chrome` in styles/premium.css) and the hairline contour artwork.
 */
export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTool, onSelectTool, onOpenCommandPalette }) => (
  <div className="site-chrome avura-chrome sticky top-0 z-50 isolate print:hidden" data-site-chrome>
    <div className="avura-lines" aria-hidden="true" />
    <Navbar activeTool={activeTool} onSelectTool={onSelectTool} onOpenCommandPalette={onOpenCommandPalette} />
  </div>
);

export default SiteHeader;
