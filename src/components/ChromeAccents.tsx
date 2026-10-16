import React, { useId } from 'react';

export type ChromeAccentsVariant = 'header' | 'bar' | 'footer';

/**
 * Layered geometric accents shared by the header, the tool name bar and the footer, so all three surfaces read
 * as one family. Each shape is built from three layers: a blurred glow underneath, a crisp gradient stroke that
 * fades out toward its tail, and a soft drop shadow. They overlap the edges of their surface but fade away before
 * they reach the text.
 *
 * Purely decorative: pointer-events are off, hidden from assistive tech and print, and the layer clips itself
 * (overflow-hidden) so nothing causes horizontal scroll. Gradient and filter ids are unique per instance, because a
 * gradient defined in a display:none SVG will not resolve for another SVG on the page.
 */

const FADE_LEFT = 'linear-gradient(to left, #000 0%, #000 34%, transparent 74%)';

const Arc: React.FC<{ className: string; uid: string }> = ({ className, uid }) => (
  <svg className={className} viewBox="0 0 200 120" fill="none" overflow="visible" focusable="false">
    <defs>
      <linearGradient id={`${uid}-g`} x1="6" y1="2" x2="142" y2="104" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#5EEAD4" stopOpacity="0.15" />
        <stop offset="0.45" stopColor="#14B885" />
        <stop offset="1" stopColor="#0E9F6E" />
      </linearGradient>
      <linearGradient id={`${uid}-h`} x1="40" y1="0" x2="176" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#14B885" stopOpacity="0" />
        <stop offset="0.5" stopColor="#14B885" stopOpacity="0.65" />
        <stop offset="1" stopColor="#14B885" stopOpacity="0.1" />
      </linearGradient>
      <filter id={`${uid}-b`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
      <filter id={`${uid}-s`} x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="#0E9F6E" floodOpacity="0.32" />
      </filter>
    </defs>
    <path d="M6 2C58 8 112 40 142 104" stroke="#14B885" strokeWidth="14" strokeLinecap="round" opacity="0.28" filter={`url(#${uid}-b)`} />
    <path d="M6 2C58 8 112 40 142 104" stroke={`url(#${uid}-g)`} strokeWidth="7" strokeLinecap="round" filter={`url(#${uid}-s)`} />
    <path d="M40 0C96 10 152 50 176 120" stroke={`url(#${uid}-h)`} strokeWidth="1.25" />
  </svg>
);

const Ring: React.FC<{ className: string; uid: string }> = ({ className, uid }) => (
  <svg className={className} viewBox="0 0 130 130" fill="none" overflow="visible" focusable="false">
    <defs>
      <linearGradient id={`${uid}-g`} x1="112" y1="36" x2="78" y2="122" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FF8A5B" />
        <stop offset="1" stopColor="#F2603E" />
      </linearGradient>
      <linearGradient id={`${uid}-h`} x1="10" y1="10" x2="120" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#F2603E" stopOpacity="0.1" />
        <stop offset="1" stopColor="#F2603E" stopOpacity="0.7" />
      </linearGradient>
      <radialGradient id={`${uid}-d`} cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#FFB48F" stopOpacity="0.2" />
        <stop offset="1" stopColor="#F2603E" stopOpacity="0" />
      </radialGradient>
      <filter id={`${uid}-b`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <filter id={`${uid}-s`} x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="6" stdDeviation="4.5" floodColor="#C2410C" floodOpacity="0.3" />
      </filter>
    </defs>
    <circle cx="65" cy="65" r="58" fill={`url(#${uid}-d)`} />
    <circle cx="65" cy="65" r="58" stroke={`url(#${uid}-h)`} strokeWidth="1.25" />
    <path d="M112 36A58 58 0 0 1 78 122" stroke="#F2603E" strokeWidth="13" strokeLinecap="round" opacity="0.3" filter={`url(#${uid}-b)`} />
    <path d="M112 36A58 58 0 0 1 78 122" stroke={`url(#${uid}-g)`} strokeWidth="7" strokeLinecap="round" filter={`url(#${uid}-s)`} />
  </svg>
);

const Tile: React.FC<{ className: string }> = ({ className }) => (
  <span
    className={`absolute rotate-[28deg] rounded-[6px] border border-white/70 bg-gradient-to-br from-[#DCE8FF] to-[#9DBBFF] shadow-[0_8px_14px_-4px_rgba(59,91,168,0.5),inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-white/10 dark:from-[#4A6BC0] dark:to-[#2F4A92] dark:shadow-[0_8px_14px_-4px_rgba(0,0,0,0.6)] ${className}`}
  />
);

export const ChromeAccents: React.FC<{ variant: ChromeAccentsVariant }> = ({ variant }) => {
  const uid = `ca${useId()}`.replace(/[^a-zA-Z0-9_-]/g, '');
  // The name bar fades its art out toward the text on the left; the other surfaces keep it sparse by placement.
  const mask = variant === 'bar' ? { WebkitMaskImage: FADE_LEFT, maskImage: FADE_LEFT } : undefined;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-95 print:hidden dark:opacity-80"
      style={mask}
      aria-hidden="true"
      data-chrome-accents={variant}
    >
      {variant === 'header' && (
        <>
          <Arc uid={`${uid}a`} className="absolute -top-9 left-[24%] hidden h-[120px] w-[200px] lg:block" />
          <Ring uid={`${uid}r`} className="absolute -right-9 -top-[4.5rem] hidden h-[130px] w-[130px] md:block" />
          <Tile className="-bottom-3 left-[calc(50%+11rem)] hidden size-6 xl:block" />
        </>
      )}

      {variant === 'bar' && (
        <>
          <Ring uid={`${uid}r`} className="absolute -right-12 -top-16 h-[150px] w-[150px] sm:-right-8 sm:-top-[4.5rem] sm:h-[180px] sm:w-[180px]" />
          <Arc uid={`${uid}a`} className="absolute -bottom-14 right-[10%] hidden h-[130px] w-[216px] md:block" />
          <Tile className="-bottom-3 right-[4%] hidden size-7 sm:block" />
        </>
      )}

      {variant === 'footer' && (
        <>
          <Arc uid={`${uid}a`} className="absolute -top-10 left-[5%] hidden h-[120px] w-[200px] md:block" />
          <Ring uid={`${uid}r`} className="absolute -bottom-16 -right-10 h-[150px] w-[150px] sm:right-[5%] sm:h-[170px] sm:w-[170px]" />
          <Tile className="bottom-12 right-[2.5%] hidden size-6 lg:block" />
        </>
      )}
    </div>
  );
};

export default ChromeAccents;
