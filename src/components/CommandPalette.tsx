import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Search,
  X,
  CornerDownLeft,
  Check,
  Sun,
  Moon,
  GraduationCap,
  Lightbulb,
  Percent,
  Banknote,
  House,
  KeyRound,
  Calculator,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { ToolKey } from '../types';
import { useTheme } from '../context/ThemeContext';
import { preloadTool } from '../utils/toolPreloader';
import { Logo } from './Logo';
import { useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../data/navItems';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  activeTool: ToolKey;
  onSelectTool: (tool: ToolKey) => void;
  setToast?: (message: string) => void;
}

interface PaletteToolItem {
  type: 'tool';
  key: ToolKey;
  label: string;
  title: string;
  description: string;
  category: 'Academic' | 'Everyday' | 'Finance' | 'Security';
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  keywords: string[];
  shortcutDigit?: string;
  badge: string;
}

interface PaletteActionItem {
  type: 'action';
  key: string;
  label: string;
  title: string;
  description: string;
  category: 'Quick Actions' | 'Academic';
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  keywords: string[];
  action: () => void;
  badge?: string;
}

type PaletteItem = PaletteToolItem | PaletteActionItem;

const PALETTE_TOOLS: PaletteToolItem[] = [
  {
    type: 'tool',
    key: 'quick',
    label: 'Quick Grade',
    title: 'Quick Grade Calculator',
    description: 'Weighted and points grade calculator with letter grades and final exam target planner.',
    category: 'Academic',
    icon: GraduationCap,
    keywords: [
      'quick grade',
      'weighted grade',
      'points grade',
      'final exam',
      'target score',
      'what if',
      'grade average',
      'report card',
      'assignments',
      'syllabus',
    ],
    shortcutDigit: '1',
    badge: 'Weighted & Points',
  },
  {
    type: 'tool',
    key: 'gpa',
    label: 'GPA Calculator',
    title: 'College & High School GPA Calculator',
    description: 'Calculate semester and cumulative 4.0 grade point average with credit hours.',
    category: 'Academic',
    icon: GraduationCap,
    keywords: [
      'gpa',
      'grade point average',
      'college',
      'cumulative',
      'credits',
      'semester',
      'courses',
      'transcript',
      'honors',
      '4.0 scale',
    ],
    shortcutDigit: '2',
    badge: '4.0 Scale',
  },
  {
    type: 'tool',
    key: 'cgpa',
    label: 'CGPA to %',
    title: 'CGPA to Percentage Calculator',
    description: 'Convert 10.0, 5.0, and 4.0 scale CGPA to percentage with 30+ university formulas (VTU, Mumbai, MAKAUT, GTU, SPPU).',
    category: 'Academic',
    icon: Calculator,
    keywords: [
      'cgpa',
      'cgpa to percentage',
      'sgpa to cgpa',
      'percentage to cgpa',
      '10 point scale',
      '9.5 multiplier',
      'vtu',
      'mumbai university',
      'makaut',
      'gtu',
      'sppu',
      'anna university',
      'cbse',
      'ugc',
    ],
    shortcutDigit: '3',
    badge: '10.0 / 5.0 / 4.0',
  },
  {
    type: 'tool',
    key: 'tip',
    label: 'Tip Calculator',
    title: 'Tip & Bill Split Calculator',
    description: 'Calculate gratuity percentages, custom bill split per person, and rounded totals.',
    category: 'Everyday',
    icon: Lightbulb,
    keywords: [
      'tip',
      'gratuity',
      'bill split',
      'split check',
      'dining',
      'restaurant',
      'service',
      'per person',
      'round up',
      'receipt',
    ],
    shortcutDigit: '4',
    badge: 'Bill Split',
  },
  {
    type: 'tool',
    key: 'percentage',
    label: 'Percentage Calculator',
    title: 'All-in-One Percentage Calculator',
    description: 'Calculate X% of Y, percent increase or decrease, discount savings, and relative differences.',
    category: 'Everyday',
    icon: Percent,
    keywords: [
      'percentage',
      'percent',
      'discount',
      'increase',
      'decrease',
      'difference',
      'fraction',
      'markup',
      'sale price',
      'ratio',
    ],
    shortcutDigit: '5',
    badge: 'Multi-Mode',
  },
  {
    type: 'tool',
    key: 'loan',
    label: 'Loan Calculator',
    title: 'Personal & Auto Loan Calculator',
    description: 'Estimate fixed monthly payments, total loan interest costs, and full payoff amortization.',
    category: 'Finance',
    icon: Banknote,
    keywords: [
      'loan',
      'auto loan',
      'car loan',
      'personal loan',
      'apr',
      'interest rate',
      'monthly payment',
      'principal',
      'amortization',
      'borrowing',
      'debt payoff',
    ],
    shortcutDigit: '6',
    badge: 'Amortization',
  },
  {
    type: 'tool',
    key: 'mortgage',
    label: 'Mortgage Calculator',
    title: 'Home Mortgage Calculator',
    description: 'Calculate monthly home payments with principal, interest, property taxes, and PMI schedule.',
    category: 'Finance',
    icon: House,
    keywords: [
      'mortgage',
      'home loan',
      'house',
      'down payment',
      'property tax',
      'homeowner',
      'pmi',
      'real estate',
      '30 year',
      '15 year',
      'amortization',
    ],
    shortcutDigit: '7',
    badge: 'P&I Breakdown',
  },
  {
    type: 'tool',
    key: 'password',
    label: 'Password Generator',
    title: 'Cryptographic Password Generator',
    description: 'Generate high-entropy, cryptographically strong passwords and passphrases with custom character sets.',
    category: 'Security',
    icon: KeyRound,
    keywords: [
      'password',
      'security',
      'generator',
      'passphrase',
      'random',
      'entropy',
      'pin',
      'credentials',
      'symbols',
      'cryptographic',
    ],
    shortcutDigit: '8',
    badge: 'High Entropy',
  },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  activeTool,
  onSelectTool,
  setToast,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const { theme, resolvedTheme, setTheme } = useTheme();
  const routerNavigate = useNavigate();

  // Detect Mac OS for modifier key symbol
  const isMac = useMemo(() => {
    return (
      typeof navigator !== 'undefined' &&
      /Mac|iPod|iPhone|iPad/i.test(navigator.userAgent || '')
    );
  }, []);

  // Quick actions
  const quickActions: PaletteActionItem[] = useMemo(() => {
    return [
      {
        type: 'action',
        key: 'action-theme',
        label: 'Toggle Theme',
        title: 'Cycle Color Theme',
        description: `Currently ${theme} (${resolvedTheme} mode). Click to cycle light, dark, or system.`,
        category: 'Quick Actions',
        icon: resolvedTheme === 'dark' ? Sun : Moon,
        keywords: ['theme', 'dark mode', 'light mode', 'system theme', 'appearance', 'toggle dark', 'colors'],
        action: () => {
          const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
          setTheme(next);
          if (setToast) {
            setToast(`Theme set to ${next.charAt(0).toUpperCase() + next.slice(1)}`);
          }
        },
        badge: theme,
      },
    ];
  }, [theme, resolvedTheme, setTheme, setToast]);

  // Extra academic pages (not in the 8 legacy tool slots)
  const pageItems: PaletteActionItem[] = useMemo(
    () =>
      NAV_ITEMS.filter((n) => ['Weighted Grade', 'Final Exam', 'Test Grade', 'Grade Curve', 'Letter Grade'].includes(n.label)).map((n) => ({
        type: 'action' as const,
        key: `page-${n.path}`,
        label: n.title.charAt(0).toUpperCase() + n.title.slice(1),
        title: n.title,
        description: `Open the ${n.title}.`,
        category: 'Academic' as const,
        icon: n.icon,
        keywords: [n.label.toLowerCase(), n.title.toLowerCase(), 'grade', 'academic'],
        action: () => {
          routerNavigate(n.path);
          onClose();
        },
        badge: 'Page',
      })),
    [routerNavigate, onClose]
  );

  // Combined filtered items
  const filteredItems: PaletteItem[] = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return [...PALETTE_TOOLS, ...pageItems, ...quickActions];
    }

    const matchesQuery = (item: PaletteItem) => {
      if (item.label.toLowerCase().includes(trimmed)) return true;
      if (item.title.toLowerCase().includes(trimmed)) return true;
      if (item.description.toLowerCase().includes(trimmed)) return true;
      if (item.category.toLowerCase().includes(trimmed)) return true;
      if (item.keywords.some((kw) => kw.toLowerCase().includes(trimmed))) return true;
      if (item.type === 'tool' && item.shortcutDigit === trimmed) return true;
      return false;
    };

    const toolsMatching = PALETTE_TOOLS.filter(matchesQuery);
    const actionsMatching = [...pageItems, ...quickActions].filter(matchesQuery);

    return [...toolsMatching, ...actionsMatching];
  }, [query, quickActions, pageItems]);

  // Keep selected index within bounds when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Manage focus and scroll lock when palette opens/closes
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setQuery('');
      setSelectedIndex(0);

      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus input on next frame
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      });

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      // Restore previous focus when closed
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedEl = listRef.current.querySelector(
      `[data-palette-index="${selectedIndex}"]`
    ) as HTMLElement | null;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Execute selected item
  const handleExecuteItem = useCallback(
    (item: PaletteItem) => {
      onClose();
      if (item.type === 'tool') {
        onSelectTool(item.key);
        if (setToast && item.key !== activeTool) {
          setToast(`Switched to ${item.label}`);
        }
      } else {
        item.action();
      }
    },
    [activeTool, onClose, onSelectTool, setToast]
  );

  // Keyboard navigation within the palette
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0
        );
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredItems.length > 0
            ? (prev - 1 + filteredItems.length) % filteredItems.length
            : 0
        );
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleExecuteItem(filteredItems[selectedIndex]);
        }
        return;
      }

      // Quick jump via number keys when no query or single digit
      if (!query && e.key >= '1' && e.key <= '8') {
        const targetTool = PALETTE_TOOLS.find((t) => t.shortcutDigit === e.key);
        if (targetTool) {
          e.preventDefault();
          handleExecuteItem(targetTool);
        }
      }
    },
    [filteredItems, selectedIndex, handleExecuteItem, onClose, query]
  );

  if (!isOpen) return null;

  return (
    <div
      className="command-palette-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="command-palette-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Calculator command palette"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="command-palette-header">
          <div className="command-palette-search-icon" aria-hidden="true">
            <Search />
          </div>

          <input
            ref={inputRef}
            type="text"
            className="command-palette-input"
            placeholder="Type a calculator name, keyword, or action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-activedescendant={
              filteredItems[selectedIndex]
                ? `command-item-${filteredItems[selectedIndex].key}`
                : undefined
            }
          />

          {query ? (
            <button
              type="button"
              className="command-palette-clear-btn"
              onClick={() => {
                setQuery('');
                if (inputRef.current) inputRef.current.focus();
              }}
              aria-label="Clear search query"
            >
              <X aria-hidden="true" />
            </button>
          ) : (
            <kbd className="command-palette-kbd-hint" title="Close command palette">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="command-palette-body">
          {filteredItems.length === 0 ? (
            <div className="command-palette-empty">
              <div className="command-palette-empty-icon" aria-hidden="true">
                <Calculator />
              </div>
              <p className="command-palette-empty-title">
                No matching calculators found
              </p>
              <p className="command-palette-empty-desc">
                We couldn&apos;t find anything matching &ldquo;
                <strong>{query}</strong>&rdquo;. Try searching for <em>grades</em>, <em>loans</em>, <em>tips</em>, or <em>passwords</em>.
              </p>
              <button
                type="button"
                className="command-palette-empty-action"
                onClick={() => {
                  setQuery('');
                  if (inputRef.current) inputRef.current.focus();
                }}
              >
                Clear search query
              </button>
            </div>
          ) : (
            <ul
              ref={listRef}
              id="command-palette-list"
              className="command-palette-list"
              role="listbox"
              aria-label="Calculator options"
            >
              {filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                const isActive = item.type === 'tool' && item.key === activeTool;

                // Group header insertion if needed
                const isFirstOfCategory =
                  index === 0 ||
                  filteredItems[index - 1].category !== item.category;

                return (
                  <React.Fragment key={item.key}>
                    {isFirstOfCategory && (
                      <li
                        className="command-palette-group-header"
                        role="presentation"
                      >
                        <span>{item.category}</span>
                      </li>
                    )}

                    <li
                      id={`command-item-${item.key}`}
                      role="option"
                      aria-selected={isSelected}
                      data-palette-index={index}
                      className={`command-palette-item ${
                        isSelected ? 'is-selected' : ''
                      } ${isActive ? 'is-active' : ''}`}
                      onMouseEnter={() => {
                        setSelectedIndex(index);
                        if (item.type === 'tool') preloadTool(item.key);
                      }}
                      onPointerDown={() => {
                        if (item.type === 'tool') preloadTool(item.key);
                      }}
                      onTouchStart={() => {
                        if (item.type === 'tool') preloadTool(item.key);
                      }}
                      onClick={() => handleExecuteItem(item)}
                    >
                      <div
                        className={`command-palette-item-icon ${
                          item.type === 'tool' ? `tool-icon-${item.key}` : 'action-icon'
                        }`}
                        aria-hidden="true"
                      >
                        <Icon />
                      </div>

                      <div className="command-palette-item-content">
                        <div className="command-palette-item-title-row">
                          <span className="command-palette-item-title">
                            {item.title}
                          </span>

                          {isActive && (
                            <span className="command-palette-item-active-tag">
                              <Check aria-hidden="true" />
                              <span>Current Tool</span>
                            </span>
                          )}

                          {item.badge && !isActive && (
                            <span className="command-palette-item-badge">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <p className="command-palette-item-desc">
                          {item.description}
                        </p>
                      </div>

                      <div className="command-palette-item-meta">
                        {item.type === 'tool' && item.shortcutDigit && !query && (
                          <kbd
                            className="command-palette-item-key"
                            title={`Press ${item.shortcutDigit} to jump`}
                          >
                            {item.shortcutDigit}
                          </kbd>
                        )}
                        <span
                          className="command-palette-item-enter"
                          aria-hidden="true"
                        >
                          <CornerDownLeft />
                        </span>
                      </div>
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="command-palette-footer">
          <div className="command-palette-footer-shortcuts">
            <span className="command-palette-shortcut-pill">
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="command-palette-shortcut-pill">
              <kbd>↵</kbd>
              <span>Select</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="command-palette-shortcut-pill hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border-0"
              title="Close Command Palette"
            >
              <kbd>esc</kbd>
              <span>Close</span>
            </button>
            {!query && (
              <span className="command-palette-shortcut-pill desktop-only">
                <kbd>1-8</kbd>
                <span>Jump</span>
              </span>
            )}
          </div>

          <div className="command-palette-footer-brand">
            <Logo iconOnly size="sm" />
            <span>Easy Grade Tool ({isMac ? '⌘K' : 'Ctrl+K'})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
