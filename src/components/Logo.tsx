import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Official Easy Grade Tool Logo Component.
 * Features:
 * - Geometric squircle icon in dark teal (#004851)
 * - White "A+" insignia with ascending 3-bar histogram crossbar
 * - Upper-right 4-point sparkle accent
 * - Bold wordmark "Easy Grade Tool"
 */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
}) => {
  const iconDimensions = {
    sm: { box: 28, radius: 7 },
    md: { box: 34, radius: 8.5 },
    lg: { box: 44, radius: 11 },
  }[size];

  const textClasses = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon Squircle */}
      <svg
        width={iconDimensions.box}
        height={iconDimensions.box}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-xs rounded-[22%]"
        aria-hidden="true"
      >
        {/* Dark Teal Squircle Base */}
        <rect width="512" height="512" rx="118" fill="#004851" />

        {/* Crisp White A+ with 3-bar Chart Crossbar */}
        <g fill="#FFFFFF">
          {/* Left Leg of A */}
          <polygon points="106,400 134,400 220,132 192,132" />
          {/* Right Leg of A */}
          <polygon points="278,400 250,400 164,132 192,132" />
          {/* Apex Cap */}
          <circle cx="192" cy="132" r="5" />

          {/* Chart Base Bar inside A */}
          <rect x="134" y="312" width="118" height="14" rx="3" />

          {/* 3 Ascending Bar Chart Columns */}
          {/* Short Bar */}
          <rect x="146" y="280" width="18" height="32" rx="2" />
          {/* Medium Bar */}
          <rect x="174" y="252" width="18" height="60" rx="2" />
          {/* Tall Bar */}
          <rect x="202" y="222" width="18" height="90" rx="2" />

          {/* Plus Sign */}
          <rect x="306" y="246" width="102" height="28" rx="4" />
          <rect x="343" y="209" width="28" height="102" rx="4" />

          {/* 4-point Sparkle Star */}
          <path d="M 412,126 Q 412,142 428,142 Q 412,142 412,158 Q 412,142 396,142 Q 412,142 412,126 Z" />
        </g>
      </svg>

      {/* Brand Wordmark */}
      {!iconOnly && (
        <span
          className={`font-extrabold tracking-tight text-[#004851] dark:text-white transition-colors leading-none ${textClasses}`}
        >
          Easy Grade Tool
        </span>
      )}
    </div>
  );
};

export default Logo;
