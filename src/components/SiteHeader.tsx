import React from 'react';
import { Navbar } from './Navbar';
import { ToolKey } from '../types';

interface SiteHeaderProps {
  activeTool: ToolKey;
  onSelectTool: (tool: ToolKey) => void;
  onOpenCommandPalette: () => void;
}

/**
 * The single, global site chrome, mounted once in App.tsx above <Routes>.
 * ONE sticky header row (the old "For Teachers / For Students / For Everyone" utility bar is gone):
 *   logo | search | Quick Grade | Grade tools | GPA and percentages | Everyday tools | theme switch
 * Surface: flat white with a hairline underneath (.elev-chrome).
 */
export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTool, onSelectTool, onOpenCommandPalette }) => {
  return (
    <div className="elev-chrome sticky top-0 z-50 isolate print:hidden" data-site-chrome>
      <Navbar activeTool={activeTool} onSelectTool={onSelectTool} onOpenCommandPalette={onOpenCommandPalette} />
    </div>
  );
};

export default SiteHeader;
