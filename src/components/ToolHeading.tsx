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

export const ToolHeading: React.FC<ToolHeadingProps> = ({
  badge,
  eyebrow,
  title,
  description,
  copy,
  action,
  headingTag = 'h1',
}) => {
  const badgeText = badge || eyebrow;
  const descText = description || copy;
  const HeadingTag = headingTag;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        {badgeText && (
          <div className="flex items-center gap-2 text-xs font-semibold font-mono uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 shrink-0" aria-hidden="true" />
            <span>{badgeText}</span>
          </div>
        )}
        <HeadingTag className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
          {title}
        </HeadingTag>
        {descText && (
          <p className="mt-1.5 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {descText}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
