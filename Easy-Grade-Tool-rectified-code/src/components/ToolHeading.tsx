import React from 'react';

interface ToolHeadingProps {
  /** Kept so existing call sites compile. The small badge above the title was removed in the minimal redesign. */
  badge?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  copy?: string;
  action?: React.ReactNode;
  headingTag?: 'h1' | 'h2';
}

/**
 * The header at the top of every tool and info page: a title, one line of context, and an optional action.
 * Flat on purpose (no card, no texture, no badge). Type sizes come from the h1/h2 scale in styles/base.css and the
 * layout from .page-header / .page-lead in styles/components.css, so every page starts the same way.
 */
export const ToolHeading: React.FC<ToolHeadingProps> = ({ title, description, copy, action, headingTag = 'h1' }) => {
  const descText = description || copy;
  const HeadingTag = headingTag;

  return (
    <header className="page-header">
      <div>
        <HeadingTag>{title}</HeadingTag>
        {descText && <p className="page-lead">{descText}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
};

export default ToolHeading;
