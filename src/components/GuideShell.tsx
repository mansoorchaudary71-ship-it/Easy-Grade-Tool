import React from 'react';

export interface ContentSectionProps {
  /** id of the heading inside the card, used for aria-labelledby */
  labelledBy?: string;
  /** optional data-tool-guide marker */
  guide?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Single frame used for the "Content" (guide / article) section of EVERY tool.
 * Width, centering, card background, border, radius, padding and typography all come from the
 * `.guide-shell` / `.guide-card` rules in index.css, which the FAQ section shares, so the two
 * sections always look like a matched pair. Only the content inside differs from tool to tool.
 */
export const ContentSection: React.FC<ContentSectionProps> = ({ labelledBy, guide, className = '', children }) => (
  <section
    className={`seo-content guide-shell ${className}`.trim()}
    aria-labelledby={labelledBy}
    data-tool-guide={guide}
  >
    <article className="seo-article guide-card font-sans">{children}</article>
  </section>
);

export default ContentSection;
