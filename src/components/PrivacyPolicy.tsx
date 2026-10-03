import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, EyeOff, ServerOff, Mail } from 'lucide-react';
import { SEO } from './SEO';
import { ToolHeading } from './ToolHeading';
import { AmbientAura } from './AmbientAura';
import { SEO_STATIC_PAGES, CONTACT_EMAIL } from '../data/seoConfig';

export const PrivacyPolicy: React.FC = () => {
  const seo = SEO_STATIC_PAGES.privacy;
  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        canonicalUrl={seo.canonicalUrl}
        ogImage={seo.ogImagePlaceholder}
        keywords={seo.keywords}
        applicationCategory={seo.applicationCategory}
        featureList={seo.featureList}
      />

      <ToolHeading
        badge="Legal & Privacy"
        title="Privacy Policy"
        description="Your academic, financial, and personal calculation data never leaves your browser."
      />

      <div className="relative tool-layout font-sans">
        <AmbientAura />

        <div className="w-full max-w-4xl mx-auto space-y-8">
          {/* Key Privacy Highlights Card */}
          <div className="bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm p-6 sm:p-8 md:p-10 w-full">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-4 flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>Core Privacy Commitment</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              Easy Grade Calculator is engineered from the ground up on a <strong className="font-semibold text-slate-900 dark:text-white">Zero-Knowledge, Client-Side First</strong> architecture. We believe academic records, financial projections, and security credentials belong exclusively to you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <ServerOff className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">No Server Storage</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  Inputs and scores execute entirely in device memory without database persistence.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <EyeOff className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Zero Trackers</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  No behavioral tracking pixels, biometric logging, or third-party advertising cookies.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Local Crypto</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  Passwords use the Web Cryptography API locally without any network transmission.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Policy Article */}
          <article className="seo-article bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm p-6 sm:p-10 font-sans space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                1. Data Processing and Storage
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                When you use Easy Grade Calculator—including the <Link to="/" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Easy Grade Chart</Link>, <Link to="/grade-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Weighted Grade Calculator</Link>, <Link to="/gpa-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">GPA Calculator</Link>, <Link to="/cgpa-to-percentage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">CGPA to Percentage Calculator</Link>, <Link to="/percentage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Percentage Calculator</Link>, <Link to="/tip-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Tip Calculator</Link>, <Link to="/loan-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Loan Calculator</Link>, <Link to="/mortgage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Mortgage Calculator</Link>, and <Link to="/password-generator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Password Generator</Link>—all algorithms execute locally within your browser using JavaScript and HTML5, as detailed in our <Link to="/about" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Academic Methodology</Link>. We do not transmit, log, store, or inspect your course names, grades, loan principals, or generated credentials.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                2. Browser Cookies and Local Storage
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                This application does not use tracking cookies or advertising identifiers; only essential client-side localStorage is utilized to retain your light/dark theme preference and temporary calculator inputs on your device. We utilize standard browser <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">localStorage</code> solely to save your local UI preferences:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>Your light/dark theme preference</li>
                <li>Your selected grading scale setting (e.g., standard vs. plus/minus)</li>
                <li>Temporary working state in active tabs for your convenience</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
                This data stays on your physical device and can be cleared at any time via your browser settings.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                3. Offline Service Worker &amp; Progressive Web App (PWA)
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We register a Progressive Web App service worker that caches static code bundles (HTML, CSS, JS, web fonts, and vector icons) so the calculator functions offline in classrooms, flights, and low-connectivity environments. The service worker operates entirely on your device and does not send telemetry to external hosts.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                4. Third-Party Services
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We load typography fonts through Google Fonts. Font requests communicate with Google servers solely to deliver web font files; no personal identity or user input is provided to these endpoints.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                5. Contact &amp; Inquiries
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                If you have questions, feedback, or concerns regarding our privacy architecture, feel free to reach out directly to our maintainer:
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>{CONTACT_EMAIL}</span>
              </a>
            </div>

            <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/80 text-xs font-mono text-slate-600 dark:text-slate-300">
              Last updated: September 2026. Effective immediately for all visitors worldwide.
            </div>
          </article>
        </div>
      </div>
    </>
  );
};
