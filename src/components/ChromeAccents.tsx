import React from 'react';

export type ChromeAccentsVariant = 'header' | 'bar' | 'footer';

/**
 * The localized gloss shared by the header, the tool name bar and the footer.
 *
 * It is NOT a frosted overlay: it is one crisp-edged diagonal light sweep (plus a thin specular streak) that sits in the
 * top-right corner of the surface and fades out before it reaches the text, like light catching the edge of a physical card.
 * The geometry and colours live in premium.css (.chrome-sheen, .chrome-sheen--header | --bar | --footer).
 *
 * Purely decorative: pointer-events are off, hidden from assistive tech and print, and the layer clips itself
 * (overflow-hidden) so it can never cause horizontal scroll or cover a click target. The component name and props are
 * unchanged, so SiteHeader, ToolHeading and Footer keep working as they are.
 */
export const ChromeAccents: React.FC<{ variant: ChromeAccentsVariant }> = ({ variant }) => (
  <div
    className="pointer-events-none absolute inset-0 overflow-hidden print:hidden"
    aria-hidden="true"
    data-chrome-accents={variant}
  >
    <span className={`chrome-sheen chrome-sheen--${variant} ${variant === 'header' ? 'hidden md:block' : ''}`} />
  </div>
);

export default ChromeAccents;
