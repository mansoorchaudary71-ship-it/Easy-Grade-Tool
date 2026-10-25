import React, { useId } from 'react';
import { BRAND, LOCKUP, WORDMARK } from '../brand/brand';

/**
 * Easy Grade Tool brand logo.
 *
 * The mark: a deep indigo-blue squircle with a soft light sheen, a bold rounded white "A"
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
          className={accentFill ? undefined : 'fill-[#0056D2] dark:fill-teal-400'}
        />
      </g>
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/* Thin wordmark (current brand look)                                          */
/* -------------------------------------------------------------------------- */

/**
 * Modern, light "monoline" wordmark: EASY GRADE in hairline geometric capitals with wide tracking,
 * a blue crossbar on each "A", and a small tracked "TOOL" + hairline rule underneath.
 *
 * Every letter is a stroked vector path (no font), so it renders identically everywhere with no
 * font loading and no layout shift. Colours: letters use `currentColor` (set by <Logo />), the
 * accent uses brand blue (lighter blue on dark surfaces).
 */
const ThinWordmark: React.FC<{ className?: string; onDark?: boolean }> = ({ className, onDark = false }) => {
  const accent = onDark ? 'stroke-blue-400' : 'stroke-[#0056D2] dark:stroke-blue-400';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-6 -6 844 174"
      fill="none"
      role="img"
      aria-label="Easy Grade Tool"
      className={className}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeMiterlimit={2.5}
    >
      {/* EASY GRADE */}
      <g stroke="currentColor" strokeWidth={6.5}>
        <path transform="translate(0 0)" d="M54 0H0V100H54M0 50H46" />
        <path transform="translate(80 0)" d="M0 100L39 0L78 100" />
        <path transform="translate(184 0)" d="M51 19C51 7 41 0 27 0C13 0 3 8 3 23C3 38 14 44 27 50C40 56 51 62 51 77C51 92 41 100 27 100C13 100 3 93 2 81" />
        <path transform="translate(264 0)" d="M0 0L32 52L64 0M32 52V100" />
        <path transform="translate(398 0)" d="M70 20C62 7 50 0 37 0C15 0 0 19 0 50C0 81 15 100 37 100C58 100 72 86 72 60V54H40" />
        <path transform="translate(498 0)" d="M0 100V0H30C47 0 56 10 56 26C56 42 47 52 30 52H0M30 52L56 100" />
        <path transform="translate(580 0)" d="M0 100L39 0L78 100" />
        <path transform="translate(684 0)" d="M0 0H26C54 0 68 20 68 50C68 80 54 100 26 100H0Z" />
        <path transform="translate(778 0)" d="M54 0H0V100H54M0 50H46" />
      </g>
      {/* Blue crossbars of the two A's */}
      <g className={accent} strokeWidth={6.5}>
        <path transform="translate(80 0)" d="M14 66H64" />
        <path transform="translate(580 0)" d="M14 66H64" />
      </g>
      {/* TOOL */}
      <g transform="translate(0 132)" className={accent} strokeWidth={13.3}>
        <path transform="translate(0.0 0) scale(0.3)" d="M0 0H60M30 0V100" />
        <path transform="translate(31.8 0) scale(0.3)" d="M42 0C65 0 84 20 84 50C84 80 65 100 42 100C19 100 0 80 0 50C0 20 19 0 42 0Z" />
        <path transform="translate(70.8 0) scale(0.3)" d="M42 0C65 0 84 20 84 50C84 80 65 100 42 100C19 100 0 80 0 50C0 20 19 0 42 0Z" />
        <path transform="translate(109.8 0) scale(0.3)" d="M0 0V100H48" />
      </g>
      {/* Hairline rule that runs out to the end of the wordmark */}
      <path
        d="M148.8 147H832"
        className={accent}
        strokeWidth={2.2}
        strokeOpacity={0.45}
      />
    </svg>
  );
};

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Use on the dark slate header: white wordmark + light-blue "Tool". */
  onDark?: boolean;
}

const LOCKUP_HEIGHT = {
  sm: 'h-7',
  md: 'h-8 sm:h-10',
  lg: 'h-14',
} as const;

const ICON_SIZE = {
  sm: 'size-7',
  md: 'size-7 sm:size-9',
  lg: 'size-12',
} as const;

/**
 * Official Easy Grade Tool logo (same props as before, so existing usages keep working).
 * The full logo is the thin monoline wordmark; `iconOnly` still returns the square app-icon mark.
 */
export const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false, size = 'md', onDark = false }) => {
  return (
    <div
      className={`inline-flex items-center select-none ${onDark ? 'text-white' : 'text-[#0F172A] dark:text-white'} ${className}`}
    >
      {iconOnly ? (
        <BrandMark
          className={`${ICON_SIZE[size]} shrink-0 transition-transform duration-200 ease-out group-hover:scale-105 [.brand:hover_&]:scale-105 motion-reduce:transition-none`}
        />
      ) : (
        <ThinWordmark className={`${LOCKUP_HEIGHT[size]} w-auto shrink-0`} onDark={onDark} />
      )}
    </div>
  );
};

export default Logo;
