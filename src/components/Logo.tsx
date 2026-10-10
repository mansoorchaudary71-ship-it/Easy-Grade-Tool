import React, { useId } from 'react';
import { BRAND, LOCKUP, WORDMARK } from '../brand/brand';

/**
 * Easy Grade Tool brand logo.
 *
 * The mark: a deep-emerald squircle with a soft light sheen, a bold rounded white "A"
 * and a gold crossbar + "+" (grade "A+"). The wordmark is outlined vector text
 * ("Easy Grade" bold, "Tool" light), so it never depends on a web font.
 *
 * Exports:
 *   <Logo />          icon + wordmark (navbar, footer); `iconOnly` for the icon alone
 *   <BrandMark />     the standalone icon (also used to generate favicons / PWA icons)
 *   <LogoLockup />    the horizontal lockup as a single SVG (also used for public/logo.svg)
 *
 * Geometry and colours live in src/brand/brand.ts. After changing either, run
 * `npx tsx scripts/generateIcons.ts` to refresh the files in /public.
 */

export type MarkVariant = 'standard' | 'maskable';

/** Make an id that is unique per instance and safe inside url(#...). */
function useSvgId(prefix?: string): string {
  const reactId = useId();
  return (prefix ?? `egt${reactId}`).replace(/[^a-zA-Z0-9_-]/g, '');
}

/**
 * The icon artwork on a 512 x 512 canvas, without an <svg> wrapper so it can be embedded
 * both in <BrandMark /> and in the lockup. Gradient ids are unique per instance, because
 * a gradient defined in a display:none SVG will not resolve for another SVG on the page.
 */
const MarkArtwork: React.FC<{ uid: string; variant: MarkVariant }> = ({ uid, variant }) => {
  const maskable = variant === 'maskable';

  return (
    <>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="64" y1="0" x2="448" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={BRAND.bgFrom} />
          <stop offset="0.5" stopColor={BRAND.bgMid} />
          <stop offset="1" stopColor={BRAND.bgTo} />
        </linearGradient>
        <radialGradient id={`${uid}-sheen`} cx="0.22" cy="0.04" r="0.85">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.34" />
          <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-ink`} x1="0" y1="120" x2="0" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={BRAND.inkFrom} />
          <stop offset="1" stopColor={BRAND.inkTo} />
        </linearGradient>
        <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={BRAND.goldFrom} />
          <stop offset="1" stopColor={BRAND.goldTo} />
        </linearGradient>
        <filter id={`${uid}-drop`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#0B0E1C" floodOpacity="0.38" />
        </filter>
      </defs>

      {/* Squircle base. The maskable variant is full-bleed: the OS applies its own mask. */}
      <rect width="512" height="512" rx={maskable ? 0 : 124} fill={`url(#${uid}-bg)`} />
      <rect width="512" height="512" rx={maskable ? 0 : 124} fill={`url(#${uid}-sheen)`} />
      {!maskable && (
        <rect
          x="1.5"
          y="1.5"
          width="509"
          height="509"
          rx="122.5"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.16"
          strokeWidth="3"
        />
      )}

      {/* Letter A, gold crossbar and "+" (kept inside the 80% safe zone when maskable). */}
      <g
        filter={`url(#${uid}-drop)`}
        transform={maskable ? 'translate(256 256) scale(0.88) translate(-256 -256)' : undefined}
      >
        {/* Crossbar sits behind the legs so its ends tuck neatly into them */}
        <rect x="190" y="300" width="132" height="34" rx="17" fill={`url(#${uid}-gold)`} />
        <path
          d="M148 388 L254 142 L360 388"
          fill="none"
          stroke={`url(#${uid}-ink)`}
          strokeWidth="52"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g fill={`url(#${uid}-gold)`}>
          <rect x="352" y="130" width="84" height="26" rx="13" />
          <rect x="381" y="101" width="26" height="84" rx="13" />
        </g>
      </g>
    </>
  );
};

interface BrandMarkProps {
  /** CSS size of the icon (number = px). Ignored when the element is sized with className. */
  size?: number | string;
  variant?: MarkVariant;
  /** Fixed gradient id prefix. Only needed when generating static files. */
  idPrefix?: string;
  className?: string;
  /** Accessible name. Leave empty when the icon is decorative. */
  title?: string;
}

/** The standalone icon. */
export const BrandMark: React.FC<BrandMarkProps> = ({
  size,
  variant = 'standard',
  idPrefix,
  className,
  title,
}) => {
  const uid = useSvgId(idPrefix);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="none"
      className={className}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
    >
      <MarkArtwork uid={uid} variant={variant} />
    </svg>
  );
};

interface LogoLockupProps {
  className?: string;
  idPrefix?: string;
  /** Explicit fills for static files (public/logo.svg). Omit to inherit theme colours. */
  textFill?: string;
  accentFill?: string;
  /** Hover animation on the icon. Turned off when generating static files. */
  interactive?: boolean;
}

/** Icon + wordmark as one SVG. Height is controlled with CSS; the width follows the aspect ratio. */
export const LogoLockup: React.FC<LogoLockupProps> = ({
  className,
  idPrefix,
  textFill,
  accentFill,
  interactive = true,
}) => {
  const uid = useSvgId(idPrefix);
  const s = LOCKUP.scale;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${LOCKUP.width} ${LOCKUP.height}`}
      fill="none"
      role="img"
      aria-label="Easy Grade Tool"
      className={interactive ? `${className ?? ''} overflow-visible`.trim() : className}
    >
      <g
        className={
          interactive
            ? 'origin-center [transform-box:fill-box] transition-transform duration-200 ease-out group-hover:scale-105 [.brand:hover_&]:scale-105 motion-reduce:transition-none'
            : undefined
        }
      >
        <MarkArtwork uid={uid} variant="standard" />
      </g>

      <g transform={`translate(${LOCKUP.textX} ${LOCKUP.baseline}) scale(${s})`}>
        <path d={WORDMARK.easyGrade.d} fill={textFill ?? 'currentColor'} />
      </g>
      <g transform={`translate(${LOCKUP.toolX} ${LOCKUP.baseline}) scale(${s})`}>
        <path
          d={WORDMARK.tool.d}
          fill={accentFill}
          className={accentFill ? undefined : 'fill-[#4C5985] dark:fill-teal-400'}
        />
      </g>
    </svg>
  );
};

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LOCKUP_HEIGHT = {
  sm: 'h-7',
  md: 'h-7 sm:h-9',
  lg: 'h-12',
} as const;

const ICON_SIZE = {
  sm: 'size-7',
  md: 'size-7 sm:size-9',
  lg: 'size-12',
} as const;

/** Official Easy Grade Tool logo (same props as before, so existing usages keep working). */
export const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false, size = 'md' }) => {
  return (
    <div
      className={`inline-flex items-center select-none text-[#1B2038] dark:text-white ${className}`}
    >
      {iconOnly ? (
        <BrandMark
          className={`${ICON_SIZE[size]} shrink-0 transition-transform duration-200 ease-out group-hover:scale-105 [.brand:hover_&]:scale-105 motion-reduce:transition-none`}
        />
      ) : (
        <LogoLockup className={`${LOCKUP_HEIGHT[size]} w-auto shrink-0`} />
      )}
    </div>
  );
};

export default Logo;
