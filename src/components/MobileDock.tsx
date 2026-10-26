import React from 'react';
import { useLocation } from 'react-router-dom';
import { Calculator, GraduationCap, House, Search } from 'lucide-react';
import { Link } from './SlashLink';
import { isSamePath } from '../utils/paths';
import { preloadTool } from '../utils/toolPreloader';

interface MobileDockProps {
  onOpenSearch: () => void;
}

const LINKS = [
  { label: 'Home', path: '/', icon: House, title: 'Quick Grade chart' },
  { label: 'Grade', path: '/grade-calculator/', icon: Calculator, title: 'Weighted grade calculator' },
  { label: 'GPA', path: '/gpa-calculator/', icon: GraduationCap, title: 'GPA calculator' },
] as const;

/**
 * Floating bottom dock for phones and small tablets (hidden from the lg breakpoint up, and in print).
 * Thumb-reach navigation: the three most-used calculators plus search, which opens the command palette
 * where every other tool lives. Styling is in styles/lumen.css (.lm-dock).
 */
export const MobileDock: React.FC<MobileDockProps> = ({ onOpenSearch }) => {
  const { pathname } = useLocation();

  return (
    <nav className="lm-dock" aria-label="Quick navigation">
      <ul className="lm-dock-list">
        {LINKS.map(({ label, path, icon: Icon, title }) => {
          const active = isSamePath(pathname, path);
          return (
            <li key={path}>
              <Link
                to={path}
                title={title}
                aria-current={active ? 'page' : undefined}
                className="lm-dock-item"
                data-active={active ? 'true' : 'false'}
              >
                <Icon className="lm-dock-icon" strokeWidth={2} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            className="lm-dock-item"
            data-active="false"
            aria-label="Search all calculators"
            onClick={onOpenSearch}
            onTouchStart={() => preloadTool('command-palette')}
          >
            <Search className="lm-dock-icon" strokeWidth={2} aria-hidden="true" />
            <span>Search</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default MobileDock;
