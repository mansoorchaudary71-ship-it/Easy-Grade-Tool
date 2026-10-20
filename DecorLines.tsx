import React from 'react';

/**
 * Decorative SVG line art (purely visual: aria-hidden, no pointer events, no ids, server-render safe).
 * Strokes use currentColor, so the colour comes from the CSS class (.cs-lines in styles/coursera.css) and follows
 * the site's existing blue palette in light and dark mode.
 *
 *   waves   - flowing parallel curves, for banners and the newsletter card
 *   arcs    - concentric quarter arcs, for corners of cards
 *   squiggle - a short hand-drawn underline, to sit under a section heading
 *   divider - a long gentle wave, used as a section separator
 *   plane   - paper plane with a dashed flight path (newsletter illustration)
 */
export type DecorVariant = 'waves' | 'arcs' | 'squiggle' | 'divider' | 'plane';

interface DecorLinesProps {
  variant: DecorVariant;
  className?: string;
}

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const DecorLines: React.FC<DecorLinesProps> = ({ variant, className = '' }) => {
  const cls = `cs-lines pointer-events-none select-none ${className}`.trim();

  if (variant === 'waves') {
    return (
      <svg className={cls} viewBox="0 0 600 240" preserveAspectRatio="xMaxYMid slice" aria-hidden="true" focusable="false" {...common} strokeWidth={1.5}>
        <path d="M-10 190 C 90 120, 170 250, 280 170 S 470 90, 610 150" />
        <path d="M-10 168 C 90 98, 170 228, 280 148 S 470 68, 610 128" />
        <path d="M-10 146 C 90 76, 170 206, 280 126 S 470 46, 610 106" />
        <path d="M-10 124 C 90 54, 170 184, 280 104 S 470 24, 610 84" />
        <path d="M-10 102 C 90 32, 170 162, 280 82 S 470 2, 610 62" />
        <path d="M-10 80 C 90 10, 170 140, 280 60 S 470 -20, 610 40" />
      </svg>
    );
  }

  if (variant === 'arcs') {
    return (
      <svg className={cls} viewBox="0 0 200 200" aria-hidden="true" focusable="false" {...common} strokeWidth={1.5}>
        <path d="M200 0 A 200 200 0 0 0 0 200" />
        <path d="M200 30 A 170 170 0 0 0 30 200" />
        <path d="M200 60 A 140 140 0 0 0 60 200" />
        <path d="M200 90 A 110 110 0 0 0 90 200" />
        <path d="M200 120 A 80 80 0 0 0 120 200" />
      </svg>
    );
  }

  if (variant === 'squiggle') {
    return (
      <svg className={cls} viewBox="0 0 120 12" aria-hidden="true" focusable="false" {...common} strokeWidth={2.5}>
        <path d="M2 7 C 12 1, 18 1, 28 7 S 44 13, 54 7 S 70 1, 80 7 S 96 13, 106 7 S 114 3, 118 5" />
      </svg>
    );
  }

  if (variant === 'divider') {
    return (
      <svg className={cls} viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true" focusable="false" {...common} strokeWidth={1.5}>
        <path d="M0 12 C 100 -2, 200 26, 300 12 S 500 -2, 600 12 S 800 26, 900 12 S 1100 -2, 1200 12" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  }

  /* plane */
  return (
    <svg className={cls} viewBox="0 0 200 120" aria-hidden="true" focusable="false" {...common} strokeWidth={2}>
      <path d="M6 104 C 40 118, 60 60, 100 76 S 130 66, 146 50" strokeDasharray="2 9" />
      <path d="M190 18 L 154 54" />
      <path d="M190 18 L 168 96 L 154 54 L 112 40 Z" />
      <path d="M154 54 L 160 74" />
    </svg>
  );
};

export default DecorLines;
