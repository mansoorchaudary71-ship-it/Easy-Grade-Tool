import React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { toSlashPath } from '../utils/paths';

/**
 * Drop-in replacement for react-router's <Link> that always emits the trailing-slash
 * URL GitHub Pages actually serves, so crawlers never hit an internal 301 hop and the
 * href in the HTML matches the canonical URL exactly.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function SlashLink(
  { to, ...rest },
  ref
) {
  const resolved = typeof to === 'string' ? toSlashPath(to) : to;
  return <RouterLink ref={ref} to={resolved} {...rest} />;
});

export default Link;
