import React from 'react';

interface ToolHeadingProps {
  badge?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  copy?: string;
  action?: React.ReactNode;
  /** Optional extra content under the description (call-to-action buttons, quick facts). */
  children?: React.ReactNode;
  headingTag?: 'h1' | 'h2';
}

/**
 * Page banner used by every tool and info page (Coursera-style): a pale-blue band with a small blue eyebrow,
 * a large left-aligned heading and a calm grey sub-heading. Colours, radius and type sizes live in
 * styles/coursera.css (.cs-banner, .cs-banner-title, .cs-banner-sub, .cs-eyebrow). Changing it here restyles every page.
 */
export const ToolHeading: React.FC<ToolHeadingProps> = ({
  badge,
  eyebrow,
  title,
  description,
  copy,
  action,
  children,
  headingTag = 'h1',
}) => {
  const descText = description || copy;
  const eyebrowText = badge || eyebrow;
  const HeadingTag = headingTag;

  return (
    <div className="chrome-bar cs-banner mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="relative z-10 min-w-0">
        {eyebrowText && <p className="cs-eyebrow">{eyebrowText}</p>}
        <HeadingTag className="cs-banner-title [text-wrap:balance]">{title}</HeadingTag>
        {descText && <p className="cs-banner-sub">{descText}</p>}
        {children}
      </div>
      {action && <div className="relative z-10 shrink-0">{action}</div>}
    </div>
  );
};
