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
 * The single, global site chrome: airy main header + floating pill menu bar.
 *
 * Mounted once in App.tsx above <Routes>, so the one-row tool bar sits directly under the header on
 * every page. This wrapper is the sticky element (both rows stay pinned together on every screen
 * size) and it owns the shared background: a soft grey-to-blue gradient (see `.avura-chrome` in
 * styles/premium.css) with hairline contour / wave lines (`.avura-lines`) flowing behind both rows.
 * Both rows are transparent so the artwork reads as one continuous surface.
 *
 * There must be exactly ONE tool bar: a second one would share the sliding pill's layoutId and the
 * pill would jump between the two.
 */
export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTool, onSelectTool, onOpenCommandPalette }) => (
  <div className="site-chrome avura-chrome sticky top-0 z-50 isolate print:hidden" data-site-chrome>
    <div className="avura-lines" aria-hidden="true" />
    <Navbar activeTool={activeTool} onSelectTool={onSelectTool} onOpenCommandPalette={onOpenCommandPalette} />
    <ToolNavBar onSelectTool={onSelectTool} />
  </div>
);

export default SiteHeader;
