import React from 'react';

export type ChromeAccentsVariant = 'header' | 'bar' | 'footer';

/**
 * Minimalist geometric accents shared by the header, the tool name bar and the footer, so all three
 * surfaces read as one family: a thick + hairline green curve, an orange ring with one heavy arc,
 * and a small pale-blue tile. Each variant places them differently, but always overlapping an edge.
 *
 * Purely decorative: pointer-events are off, it is hidden from assistive tech and from print, and the
 * parent must be `relative overflow-hidden` so nothing ever causes horizontal scroll.
 */

const GREEN = '#14B885';
const ORANGE = '#F2603E';

const Arc: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 200 120" fill="none" focusable="false">
    <path d="M6 2C58 8 112 40 142 104" stroke={GREEN} strokeWidth="7" strokeLinecap="round" className="opacity-90 dark:opacity-70" />
    <path d="M40 0C96 10 152 50 176 120" stroke={GREEN} strokeWidth="1" className="opacity-60 dark:opacity-40" />
  </svg>
);

const Ring: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 130 130" fill="none" focusable="false">
    <circle cx="65" cy="65" r="58" stroke={ORANGE} strokeWidth="1" className="opacity-60 dark:opacity-40" />
    <path d="M112 36A58 58 0 0 1 78 122" stroke={ORANGE} strokeWidth="7" strokeLinecap="round" className="opacity-95 dark:opacity-75" />
  </svg>
);

const Tile: React.FC<{ className: string }> = ({ className }) => (
  <span className={`absolute rotate-[28deg] rounded-[5px] bg-[#B9D0FF] dark:bg-[#3B5BA8] ${className}`} />
);

export const ChromeAccents: React.FC<{ variant: ChromeAccentsVariant }> = ({ variant }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden print:hidden" aria-hidden="true" data-chrome-accents={variant}>
    {variant === 'header' && (
      <>
        <Arc className="absolute -top-9 left-[24%] hidden h-[120px] w-[200px] lg:block" />
        <Ring className="absolute -top-12 right-[7%] hidden h-[130px] w-[130px] md:block" />
        <Tile className="-bottom-3 right-[5.4%] hidden size-6 md:block" />
      </>
    )}

    {variant === 'bar' && (
      <>
        {/* Ring crosses the top-right corner; arc and tile tuck against the bottom edge, well clear of the text */}
        <Ring className="absolute -right-10 -top-14 h-[150px] w-[150px] sm:-right-6 sm:-top-16 sm:h-[170px] sm:w-[170px]" />
        <Arc className="absolute -bottom-12 right-[22%] hidden h-[120px] w-[200px] md:block" />
        <Tile className="-bottom-3 right-[12%] hidden size-6 sm:block" />
      </>
    )}

    {variant === 'footer' && (
      <>
        <Arc className="absolute -top-10 left-[6%] hidden h-[120px] w-[200px] md:block" />
        <Ring className="absolute -bottom-14 -right-8 h-[150px] w-[150px] sm:right-[6%] sm:h-[170px] sm:w-[170px]" />
        <Tile className="bottom-10 right-[3%] hidden size-6 lg:block" />
      </>
    )}
  </div>
);

export default ChromeAccents;
