import React, { useId, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, ArrowUp, Check, Loader2, Mail, Search, Share2, ShieldCheck } from 'lucide-react';
import { Link } from './SlashLink';
import { Logo } from './Logo';
import { FeedbackDialog, type FeedbackKind } from './FeedbackDialog';
import { CONTACT_EMAIL, TOOL_PATHS } from '../data/constants';
import { PRIMARY_NAV_ITEM, TOOL_GROUPS, type NavItem } from '../data/navItems';
import { SITE_URL } from '../data/seoConfig';
import { isSamePath } from '../utils/paths';
import { preloadTool } from '../utils/toolPreloader';
import { submitForm } from '../utils/formSubmit';
import { ToolKey } from '../types';

export interface FooterProps {
  activeTool?: ToolKey;
  onSelectTool?: (tool: ToolKey) => void;
  onOpenCommandPalette?: () => void;
  setToast?: (msg: string) => void;
}

interface FooterLink {
  label: string;
  title: string;
  path: string;
  toolKey?: ToolKey;
}

const fromNav = (item: NavItem): FooterLink => ({ label: item.label, title: item.title, path: item.path, toolKey: item.toolKey });

/** Guide pages that are not calculators. They live in the footer so every page stays reachable from the home page. */
const GUIDE_LINKS: Record<string, FooterLink> = {
  scales: { label: 'Grading scales', title: 'Grading scale charts by number of questions', path: '/grading-scale/' },
  miss: { label: 'How many can I miss', title: 'How many questions can you miss calculator', path: '/how-many-questions-can-i-miss/' },
  weightedVs: { label: 'Weighted vs unweighted GPA', title: 'Weighted vs unweighted GPA explained', path: '/weighted-vs-unweighted-gpa/' },
};

/** Same three groups as the header menu, so the site has ONE structure. Guides are appended to the group they belong to. */
const COLUMNS: Array<{ id: string; heading: string; links: FooterLink[] }> = [
  { id: 'grades', heading: TOOL_GROUPS[0].heading, links: [fromNav(PRIMARY_NAV_ITEM), ...TOOL_GROUPS[0].items.map(fromNav), GUIDE_LINKS.scales, GUIDE_LINKS.miss] },
  { id: 'gpa', heading: TOOL_GROUPS[1].heading, links: [...TOOL_GROUPS[1].items.map(fromNav), GUIDE_LINKS.weightedVs] },
  { id: 'everyday', heading: TOOL_GROUPS[2].heading, links: TOOL_GROUPS[2].items.map(fromNav) },
];

const API_BASE = (
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process?.env?.VITE_API_URL) ||
  ''
).replace(/\/+$/, '');

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

/** Email sign-up. Posts through submitForm('subscribe'), exactly as before. */
const NewsletterForm: React.FC<{ setToast?: (msg: string) => void }> = ({ setToast }) => {
  const id = useId();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim();
    if (!clean) {
      setMessage({ text: 'Please enter your email address to subscribe.', isError: true });
      setToast?.('Please enter your email address.');
      return;
    }
    if (!clean.includes('@') || !clean.includes('.')) {
      setMessage({ text: 'Please enter a valid email format (e.g. name@school.edu).', isError: true });
      setToast?.('Please enter a valid email format.');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const result = await submitForm('subscribe', { email: clean }, API_BASE);
      if (result.ok) {
        setMessage({ text: result.message || 'Subscribed! Thank you.', isError: false });
        setEmail('');
        setToast?.('Subscribed to Easy Grade updates!');
      } else {
        setMessage({ text: `We could not send that right now. Please email ${CONTACT_EMAIL} directly.`, isError: true });
        setToast?.('Could not subscribe right now.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-label="Newsletter" className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg">Free study updates</h2>
        <p className="mt-1 text-sm text-ink-2">Get notified when new grading scales, curve calculators and planning tools are added.</p>
      </div>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={id} className="sr-only">
          Email address for updates
        </label>
        <input
          id={id}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (message) setMessage(null);
          }}
          placeholder="Enter your email"
          autoComplete="email"
          className="field flex-1"
        />
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      <p className="text-sm text-ink-3">
        No spam, unsubscribe anytime. See our <Link to="/privacy" onClick={scrollToTop}>Privacy Policy</Link>.
      </p>
      {message && (
        <p
          role="status"
          className={`flex items-center gap-2 text-sm font-semibold ${message.isError ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}
        >
          {message.isError ? <AlertTriangle className="size-4 shrink-0" aria-hidden="true" /> : <Check className="size-4 shrink-0" aria-hidden="true" />}
          {message.text}
        </p>
      )}
    </section>
  );
};

export const Footer: React.FC<FooterProps> = ({ onSelectTool, onOpenCommandPalette, setToast }) => {
  const location = useLocation();
  const [dialog, setDialog] = useState<FeedbackKind | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
        setCopiedEmail(true);
        setToast?.(`Email copied: ${CONTACT_EMAIL}`);
        window.setTimeout(() => setCopiedEmail(false), 2500);
      });
    }
  };

  const copyUrl = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setToast?.('Calculator link copied to clipboard!');
        window.setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : SITE_URL;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({ title: 'Easy Grade Tool', text: 'Calculate weighted grades, semester GPA, and needed final exam scores easily.', url })
        .catch(() => copyUrl(url));
    } else {
      copyUrl(url);
    }
  };

  const handleOpenSearch = () => {
    if (onOpenCommandPalette) onOpenCommandPalette();
    else window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true, bubbles: true }));
  };

  const onLinkClick = (link: FooterLink) => {
    scrollToTop();
    // Skip for pages that share a tool key (Weighted Grade, Final Exam...) so we never jump back to Home.
    if (link.toolKey && onSelectTool && isSamePath(TOOL_PATHS[link.toolKey], link.path)) onSelectTool(link.toolKey);
  };

  return (
    <>
      <footer aria-label="Site footer" className="site-footer print:hidden">
        <div className="shell flex flex-col gap-10 py-10 sm:py-12">
          {/* Row 1: who we are + newsletter */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col items-start gap-4">
              <Link
                to="/"
                onClick={() => {
                  scrollToTop();
                  onSelectTool?.('quick');
                }}
                title="Go to Easy Grade Tool Home"
                className="inline-flex rounded-lg"
              >
                <Logo />
              </Link>
              <p className="max-w-md text-sm text-ink-2">
                Free grade, GPA and everyday calculators for students and educators. Fast, accurate and tracker-free.
              </p>
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <ShieldCheck className="size-5 text-brand" aria-hidden="true" />
                100% private: everything runs in your browser.
              </p>
              <div className="-ml-2 flex items-center gap-1">
                <button type="button" onClick={handleOpenSearch} className="btn btn-ghost btn-icon" title="Search calculators (Ctrl+K or ⌘K)" aria-label="Open search">
                  <Search aria-hidden="true" />
                </button>
                <button type="button" onClick={handleShare} className="btn btn-ghost btn-icon" title="Share this calculator or copy the link" aria-label="Share current calculator">
                  {copiedLink ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
                </button>
              </div>
            </div>
            <NewsletterForm setToast={setToast} />
          </div>

          {/* Row 2: link columns, same groups as the header menu */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-10 lg:grid-cols-4">
            {COLUMNS.map((col) => (
              <nav key={col.id} aria-labelledby={`footer-${col.id}`}>
                <h2 id={`footer-${col.id}`} className="mb-2 text-sm">
                  {col.heading}
                </h2>
                <ul className="m-0 flex list-none flex-col p-0">
                  {col.links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        onClick={() => onLinkClick(link)}
                        title={link.title}
                        aria-current={isSamePath(location.pathname, link.path) ? 'page' : undefined}
                        className="footer-link aria-[current=page]:font-semibold aria-[current=page]:text-brand"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="mb-2 text-sm">Help</h2>
              <ul className="m-0 flex list-none flex-col p-0">
                <li>
                  <button type="button" onClick={() => setDialog('report-issue')} className="footer-link" title="Report a calculation error or a bug">
                    Report an issue
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setDialog('suggest-feature')} className="footer-link" title="Suggest a new grading scale, formula or calculator">
                    Request a feature
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setDialog('contact')} className="footer-link" title="Send a message or feedback">
                    Contact &amp; feedback
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleCopyEmail} className="footer-link gap-2" title={`Copy email address: ${CONTACT_EMAIL}`}>
                    {copiedEmail ? <Check className="size-4" aria-hidden="true" /> : <Mail className="size-4" aria-hidden="true" />}
                    {copiedEmail ? 'Copied!' : CONTACT_EMAIL}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Row 3: legal */}
          <div className="flex flex-col gap-3 border-t border-line pt-6 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} Easy Grade Tool</p>
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5">
              <Link
                to="/about"
                onClick={scrollToTop}
                onMouseEnter={() => preloadTool('about')}
                onFocus={() => preloadTool('about')}
                onTouchStart={() => preloadTool('about')}
                title="Our grading methodology, GPA formulas and mission"
                className="footer-link"
              >
                About &amp; methodology
              </Link>
              <Link to="/privacy" onClick={scrollToTop} title="Read our Privacy Policy" className="footer-link">
                Privacy policy
              </Link>
              <Link to="/terms" onClick={scrollToTop} title="Terms of Service and educational disclaimer" className="footer-link">
                Terms of service
              </Link>
              <button type="button" onClick={scrollToTop} className="footer-link gap-1" aria-label="Scroll back to top">
                <ArrowUp className="size-4" aria-hidden="true" />
                Top
              </button>
            </nav>
          </div>
        </div>
      </footer>

      {dialog && <FeedbackDialog kind={dialog} apiBase={API_BASE} setToast={setToast} onClose={() => setDialog(null)} />}
    </>
  );
};

export default Footer;
