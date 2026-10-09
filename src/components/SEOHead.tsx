import React from 'react';
import { useLocation } from 'react-router-dom';
import { ToolKey } from '../types';
import { SEO_HOME, SEO_ROUTES, SEO_STATIC_PAGES, RouteSeoConfig } from '../data/seoConfig';
import { SEO } from './SEO';
import { isSelfManagedSeoPath } from '../data/selfManagedSeo';

export interface SEOHeadProps {
  tool: ToolKey;
  customTitle?: string;
  customDescription?: string;
  customCanonicalUrl?: string;
  customOgImage?: string;
}

/**
 * Convenience wrapper linking active route and tool key configuration to the dynamic SEO component.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  tool,
  customTitle,
  customDescription,
  customCanonicalUrl,
  customOgImage,
}) => {
  const location = useLocation();
  const cleanPath = location.pathname.replace(/\/+$/, '') || '/';

  // Pages whose own component renders <SEO> (home and weighted grade included) must not get a second one.
  if (isSelfManagedSeoPath(cleanPath)) {
    return null;
  }

  let config: RouteSeoConfig;
  if (cleanPath === '/') {
    config = SEO_HOME;
  } else if (cleanPath === '/about' || cleanPath === '/methodology' || cleanPath === '/about-methodology') {
    config = SEO_STATIC_PAGES.about;
  } else if (cleanPath === '/privacy' || cleanPath === '/privacy-policy') {
    config = SEO_STATIC_PAGES.privacy;
  } else {
    config = SEO_ROUTES[tool] || SEO_HOME;
  }

  const title = customTitle || config.title;
  const description = customDescription || config.description;
  const canonicalUrl = customCanonicalUrl || config.canonicalUrl;
  const ogImage = customOgImage || config.ogImagePlaceholder;

  return (
    <SEO
      title={title}
      description={description}
      canonicalUrl={canonicalUrl}
      ogImage={ogImage}
      ogType={config.ogType}
      keywords={config.keywords}
      schemaType={config.schemaType}
      applicationCategory={config.applicationCategory}
      featureList={config.featureList}
    />
  );
};

export default SEOHead;
