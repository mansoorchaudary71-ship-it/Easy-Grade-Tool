import React from 'react';
import { DecorLines } from './DecorLines';

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
  /** Hide the "how it works" journey stepper (info/legal pages). Calculators show it. */
  hideSteps?: boolean;
  /** Page-specific journey steps. When omitted, the generic calculator steps are used.
      ToolPage passes its own steps so the banner text stays unique per page (CHK-08). */
  steps?: { title: string; sub: string }[];
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
  hideSteps = false,
  steps,
}) => {
  const journeySteps = steps ?? [
    { title: 'Enter your numbers', sub: 'Type scores, grades or credits.' },
    { title: 'See the answer instantly', sub: 'Results update as you type.' },
    { title: 'Keep it, no sign-up', sub: 'Print it, save it as PDF, come back any time.' },
  ];
  const descText = description || copy;
  const eyebrowText = badge || eyebrow;
  const HeadingTag = headingTag;

  return (
    <div className="chrome-bar cs-banner mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <DecorLines variant="rings" className="cs-banner-lines" />
      <div className="relative z-10 min-w-0">
        {eyebrowText && <p className="cs-eyebrow">{eyebrowText}</p>}
        <HeadingTag className="cs-banner-title [text-wrap:balance]">{title}</HeadingTag>
        {descText && <p className="cs-banner-sub">{descText}</p>}
        {children}
        {!hideSteps && (
          <ol className="nova-steps" aria-label="How it works">
            {journeySteps.map((s) => (
              <li key={s.title}><strong>{s.title}</strong><span>{s.sub}</span></li>
            ))}
          </ol>
        )}
      </div>
      {action && <div className="relative z-10 shrink-0">{action}</div>}
    </div>
  );
};
