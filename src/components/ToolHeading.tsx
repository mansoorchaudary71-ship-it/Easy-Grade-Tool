import React from 'react';
import { ChromeAccents } from './ChromeAccents';

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
 * Tool name bar: the same lit surface as the header and footer (.elev-card in premium.css: frosted faint-blue gradient,
 * 1px low-opacity edge, layered shadows), a fluid heading and the shared layered accents. Used by every tool and info page, so changing it here restyles them all.
 *
 * The accents live in an absolutely positioned, overflow-hidden, pointer-events-none layer (see <ChromeAccents />),
 * so they never clip the text or block a click. Heading colours are set in premium.css (.chrome-bar-title) because
 * index.css colours h1-h6 outside Tailwind's layers.
 */
export const ToolHeading: React.FC<ToolHeadingProps> = ({
  title,
  description,
  copy,
  action,
  headingTag = 'h1',
}) => {
  const descText = description || copy;
  const HeadingTag = headingTag;

  return (
    <div className="chrome-bar elev-card relative isolate mb-8 flex flex-col gap-5 overflow-hidden rounded-[28px] px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:rounded-[32px] sm:px-10 sm:py-10">
      <ChromeAccents variant="bar" />

      <div className="relative z-10 min-w-0">
        <HeadingTag className="chrome-bar-title m-0 [text-wrap:balance]">{title}</HeadingTag>
        {descText && (
          <p className="mt-2.5 max-w-2xl text-[15px] font-normal leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            {descText}
          </p>
        )}
      </div>
      {action && <div className="relative z-10 shrink-0">{action}</div>}
    </div>
  );
};
