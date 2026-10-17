import React from 'react';

interface ToolHeadingProps {
  badge?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  copy?: string;
  action?: React.ReactNode;
  headingTag?: 'h1' | 'h2';
}

/**
 * Decorative texture: a faint geometric grid plus two soft wave lines, drawn as inline SVG so it needs no extra request.
 * Sits behind the text (z-0), is non-interactive, hidden from assistive tech and print, and clips itself so it can never
 * cause horizontal scroll. Colours come from CSS (.hero-lines), so it adapts to light and dark mode.
 */
const HeroTexture: React.FC = () => (
  <div
    className="hero-lines pointer-events-none absolute inset-0 overflow-hidden print:hidden"
    aria-hidden="true"
  >
    <svg
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMaxYMid slice"
      focusable="false"
    >
      <defs>
        <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
        <linearGradient id="hero-grid-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="hero-grid-mask">
          <rect width="100%" height="100%" fill="url(#hero-grid-fade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-grid)" mask="url(#hero-grid-mask)" className="hero-lines-grid" />
    </svg>

    {/* Soft waves, anchored bottom-right so they never sit under the heading */}
    <svg
      className="hero-lines-wave absolute -bottom-10 -right-16 h-[260px] w-[620px] max-w-none sm:-right-10 sm:h-[300px] sm:w-[760px]"
      viewBox="0 0 760 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
    >
      <path d="M0 170C90 120 170 120 260 165S430 215 520 160 680 90 760 130" stroke="currentColor" strokeWidth="1.5" />
      <path d="M0 205C90 155 170 155 260 200S430 250 520 195 680 125 760 165" stroke="currentColor" strokeWidth="1.5" />
      <path d="M0 240C90 190 170 190 260 235S430 285 520 230 680 160 760 200" stroke="currentColor" strokeWidth="1.5" />
      <path d="M0 275C90 225 170 225 260 270S430 320 520 265 680 195 760 235" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  </div>
);

/**
 * Tool name hero: a mobile-first, One UI-inspired card with generous padding, heavily rounded corners, a highly diffused
 * soft-UI shadow, a vibrant blue pill badge above a fluid Plus Jakarta Sans heading, a muted-gray subheading, and a
 * low-opacity SVG grid + wave texture behind the text. Used by every tool and info page, so changing it here restyles them all.
 *
 * Colours, shadow and fluid type sizes live in premium.css (.hero-card, .hero-title, .hero-sub, .hero-badge) because
 * index.css colours h1-h6 outside Tailwind's layers. Layout and spacing are Tailwind utilities below.
 */
export const ToolHeading: React.FC<ToolHeadingProps> = ({
  badge,
  eyebrow,
  title,
  description,
  copy,
  action,
  headingTag = 'h1',
}) => {
  const descText = description || copy;
  const pillText = badge || eyebrow;
  const HeadingTag = headingTag;

  return (
    <div className="chrome-bar hero-card relative isolate mb-8 flex flex-col gap-6 overflow-hidden rounded-[32px] p-7 sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:rounded-[40px] sm:p-12 lg:p-14">
      <HeroTexture />

      <div className="relative z-10 min-w-0">
        {pillText && (
          <span className="hero-badge mb-4 inline-flex max-w-full items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] sm:mb-5 sm:text-xs">
            <span className="hero-badge-dot h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
            <span className="truncate">{pillText}</span>
          </span>
        )}

        <HeadingTag className="hero-title m-0 [text-wrap:balance]">{title}</HeadingTag>

        {descText && (
          <p className="hero-sub mt-3 max-w-2xl font-medium sm:mt-4">{descText}</p>
        )}
      </div>

      {action && <div className="relative z-10 shrink-0">{action}</div>}
    </div>
  );
};
