import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from '../utils/helmet';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 font-sans">
      <Helmet>
        <title>404 — Page Not Found | Easy Grade Tool</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-4 shadow-sm">
        <AlertCircle className="w-8 h-8" aria-hidden="true" />
      </div>
      <span className="text-xs font-mono font-bold tracking-widest uppercase text-teal-700 dark:text-teal-400 mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        The calculator or page you requested could not be found. Please check the address or return to our calculation suite.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Return to Easy Grade Tool</span>
      </Link>
    </div>
  );
};

export default NotFound;
