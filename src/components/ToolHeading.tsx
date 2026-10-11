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
 * Page banner: deep slate (#1E293B) card with a faint SVG arc/wave overlay.
 * The overlay lives in an absolutely positioned, overflow-hidden, pointer-events-none wrapper,
 * so it never clips the content or blocks a click.
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
  const HeadingTag = headingTag;

  return (
    <div className="banner-slate relative isolate mb-6 flex flex-col gap-4 overflow-hidden rounded-[28px] border border-white/10 bg-[#1E293B] px-6 py-7 shadow-[0_24px_48px_-24px_rgba(15,23,42,0.6)] sm:flex-row sm:items-center sm:justify-between sm:rounded-[32px] sm:px-10 sm:py-9">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 800 260"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          focusable="false"
        >
          <g stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5">
            <circle cx="700" cy="40" r="70" />
            <circle cx="700" cy="40" r="130" />
            <circle cx="700" cy="40" r="195" />
            <circle cx="700" cy="40" r="265" />
            <path d="M-20 210 C 130 150, 260 270, 430 205 S 680 130, 830 190" />
            <path d="M-20 238 C 150 184, 280 292, 450 232 S 700 166, 830 220" />
          </g>
        </svg>
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#2563EB]/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-[#2563EB]/10 blur-3xl" />
      </div>

      <div>
        <HeadingTag className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl [text-wrap:balance]">
          {title}
        </HeadingTag>
        {descText && (
          <p className="mt-1.5 max-w-2xl text-sm font-medium leading-relaxed text-slate-300 sm:text-base">
            {descText}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
