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
 * Surface: completely flat (.elev-chrome): white, a razor-thin 1px warm hairline underneath, no shadow, and the faint localized sheen from <ChromeAccents />.
 * Mounted once in App.tsx above <Routes>.
 */
export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTool, onSelectTool, onOpenCommandPalette }) => (
  <div
    className="elev-chrome sticky top-0 z-50 isolate print:hidden"
    data-site-chrome
  >
    <ChromeAccents variant="header" />
    <div className="relative z-10">
      <Navbar activeTool={activeTool} onSelectTool={onSelectTool} onOpenCommandPalette={onOpenCommandPalette} />
    </div>
  </div>
);

export default SiteHeader;
