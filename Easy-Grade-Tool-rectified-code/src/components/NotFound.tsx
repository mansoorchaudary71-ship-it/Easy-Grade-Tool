import React, { useEffect } from 'react';
import { Link } from './SlashLink';
import { Helmet } from '../utils/helmet';

export const NotFound: React.FC = () => {
  // A 404 has no canonical URL. Remove any canonical / og:url left in <head> by the page the visitor came from.
  useEffect(() => {
    document.head.querySelectorAll('link[rel="canonical"], meta[property="og:url"]').forEach((el) => el.remove());
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <Helmet>
        <title>404 — Page Not Found | Easy Grade Tool</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <p className="text-sm font-semibold text-ink-3">Error 404</p>
      <h1>Page not found</h1>
      <p className="max-w-md text-ink-2">
        The calculator or page you requested could not be found. Please check the address or return to our calculation suite.
      </p>
      <Link to="/" className="btn btn-primary mt-2">
        &larr; Return to Easy Grade Tool
      </Link>
    </div>
  );
};

export default NotFound;
