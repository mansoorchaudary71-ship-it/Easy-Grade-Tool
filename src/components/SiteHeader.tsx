import React from 'react';
import { Navbar } from './Navbar';
import { ToolKey } from '../types';

interface SiteHeaderProps {
  activeTool: ToolKey;
  onSelectTool: (tool: ToolKey) => void;
  onOpenCommandPalette: () => void;
}

/**
 * The single, global site chrome: ONE sticky header row (layout modelled on the Dribbble header).
 *   left    logo (and the hamburger below lg)
 *   centre  search pill (opens the command palette, Ctrl+K) + three grouped tool menus
 *   right   About link, dark Quick Grade pill, theme switch
 *
 * Surface: completely flat (.elev-chrome): white (slate in dark mode) with a very faint 1px hairline underneath. No sheen, no shadow.
 * Mounted once in App.tsx above <Routes>.
 */
export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTool, onSelectTool, onOpenCommandPalette }) => (
  <div
    className="elev-chrome sticky top-0 z-50 isolate print:hidden"
    data-site-chrome
  >
    <div className="relative z-10">
      <Navbar activeTool={activeTool} onSelectTool={onSelectTool} onOpenCommandPalette={onOpenCommandPalette} />
    </div>
  </div>
);

export default SiteHeader;
