import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { ToolKey } from '../types';

interface SiteHeaderProps {
  activeTool: ToolKey;
  onSelectTool: (tool: ToolKey) => void;
  onOpenCommandPalette: () => void;
}

/**
 * The single, global site chrome, mounted once in App.tsx above <Routes>.
 * ONE sticky header row, Dribbble-style layout:
 *   at the top: logo | Grade tools | GPA and percentages | Everyday tools | For Schools | Quick Grade
 *   once scrolled: a grey search pill appears between the logo and the nav links.
 * Surface (Lumen): a frosted-white floating bar; once the page scrolls it gains a soft shadow so it
 * floats over content.
 * NOTE 2026-10-26: the <MobileDock /> thumb rail (Home / Grade / GPA / Search) was removed here
 * at the owner's request — it was rendering as an unstyled vertical list above the banner on every
 * screen because its stylesheet (styles/lumen.css) is never imported. The header search pill and the
 * mobile hamburger drawer still carry navigation on small screens.
 */
export const SiteHeader: React.FC<SiteHeaderProps> = ({ activeTool, onSelectTool, onOpenCommandPalette }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={`elev-chrome lm-chrome sticky top-0 z-50 isolate print:hidden${scrolled ? ' is-scrolled' : ''}`} data-site-chrome>
      <Navbar activeTool={activeTool} onSelectTool={onSelectTool} onOpenCommandPalette={onOpenCommandPalette} />
    </div>
  );
};

export default SiteHeader;
