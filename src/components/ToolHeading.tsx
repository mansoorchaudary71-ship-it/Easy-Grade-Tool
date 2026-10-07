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
  const descText = description || copy;
  const HeadingTag = headingTag;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
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
