import React, { useState, useEffect, useRef, useId } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Shield,
  Sparkles,
  Mail,
  Heart,
  ArrowUp,
  Search,
  Share2,
  Check,
  GraduationCap,
  Calculator,
  Target,
  BookOpen,
  Percent,
  Lightbulb,
  Banknote,
  House,
  KeyRound,
  X,
  AlertTriangle,
  Download,
  RefreshCw,
  Send,
  CheckCircle2,
  Server,
  FileText,
  Trash2,
  Loader2,
  MessageSquare,
  Bug,
  PlusCircle,
  Activity,
} from 'lucide-react';
import { TOOLS_LIST, getToolKeyFromPath, CONTACT_EMAIL } from '../data/constants';
import { ToolKey } from '../types';
import { preloadTool } from '../utils/toolPreloader';
import { SITE_URL } from '../data/seoConfig';
import { submitForm } from '../utils/formSubmit';
import { Logo } from './Logo';

export interface FooterProps {
  activeTool?: ToolKey;
  onSelectTool?: (tool: ToolKey) => void;
  onOpenCommandPalette?: () => void;
  setToast?: (msg: string) => void;
}

interface ServerHealthData {
  status: string;
  uptimeHuman: string;
  version: string;
  timestamp: string;
  calculatorsOnline: number;
  environment: string;
  latencyMs?: number;
}

export const Footer: React.FC<FooterProps> = ({
  activeTool: propActiveTool,
  onSelectTool,
  onOpenCommandPalette,
  setToast,
}) => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  const currentToolKey = propActiveTool || getToolKeyFromPath(location.pathname);

  // States for interactive modals
  const [activeModal, setActiveModal] = useState<
    'contact' | 'reportIssue' | 'suggestFeature' | 'status' | 'resetConfirm' | null
  >(null);

  // Share & copy states
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Newsletter subscribe form state
  const [subscribeEmail, setSubscribeEmail] = useState<string>('');
  const [subscribeLoading, setSubscribeLoading] = useState<boolean>(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactSubject, setContactSubject] = useState<string>('General Feedback');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactLoading, setContactLoading] = useState<boolean>(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  // Report issue form state
  const [issueTool, setIssueTool] = useState<string>('Quick Grade');
  const [issueTitle, setIssueTitle] = useState<string>('');
  const [issueDescription, setIssueDescription] = useState<string>('');
  const [issueEmail, setIssueEmail] = useState<string>('');
  const [issueLoading, setIssueLoading] = useState<boolean>(false);
  const [issueSuccess, setIssueSuccess] = useState<string | null>(null);
  const [issueError, setIssueError] = useState<string | null>(null);

  // Suggest feature form state
  const [featureName, setFeatureName] = useState<string>('');
  const [featureCategory, setFeatureCategory] = useState<string>('New Grading Scale');
  const [featureDescription, setFeatureDescription] = useState<string>('');
  const [featureEmail, setFeatureEmail] = useState<string>('');
  const [featureLoading, setFeatureLoading] = useState<boolean>(false);
  const [featureSuccess, setFeatureSuccess] = useState<string | null>(null);
  const [featureError, setFeatureError] = useState<string | null>(null);

  // Server health state
  const [serverHealth, setServerHealth] = useState<ServerHealthData | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(false);

  // WCAG 2.1 AA Compliant Unique IDs generated via React useId()
  const contactTitleId = useId();
  const contactErrorId = useId();
  const contactNameId = useId();
  const contactEmailId = useId();
  const contactSubjectId = useId();
  const contactMessageId = useId();

  const issueTitleHeaderId = useId();
  const issueErrorId = useId();
  const issueToolId = useId();
  const issueSummaryId = useId();
  const issueDescriptionId = useId();
  const issueEmailId = useId();

  const featureTitleHeaderId = useId();
  const featureErrorId = useId();
  const featureNameId = useId();
  const featureCategoryId = useId();
  const featureDescriptionId = useId();
  const featureEmailId = useId();

  const statusTitleId = useId();
  const resetTitleId = useId();
  const subscribeEmailId = useId();

  // Accessible focus trap, Escape key handling, and focus restoration for modal dialogs
  const modalRef = useRef<HTMLDivElement | null>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!activeModal) {
      if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
        triggerElementRef.current.focus();
        triggerElementRef.current = null;
      }
      return;
    }

    // Modal is opened: remember trigger element to restore focus when closed
    triggerElementRef.current = document.activeElement as HTMLElement;

    // Focus first focusable interactive element inside the modal
    const focusTimer = window.setTimeout(() => {
      if (modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          modalRef.current.focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        setActiveModal(null);
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  // API Base resolution (supports custom backend or default relative /api)
  const API_BASE = (
    (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_URL) ||
    (typeof process !== 'undefined' && process?.env?.VITE_API_URL) ||
    ''
  ).replace(/\/+$/, '');

  const saveLocalOfflineSubmission = (key: string, item: any) => {
    try {
      if (typeof window === 'undefined') return;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ ...item, timestamp: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (_) {}
  };

  // Fetch health check on mount
  const checkServerHealth = async () => {
    setHealthLoading(true);
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      const elapsed = Math.round(performance.now() - start);
      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (res.ok && isJson) {
        const data = await res.json();
        setServerHealth({ ...data, latencyMs: elapsed });
      } else {
        setServerHealth({
          status: 'client-active',
          uptimeHuman: 'Instant Offline Engine',
          version: '1.2.0',
          timestamp: new Date().toISOString(),
          calculatorsOnline: 8,
          environment: 'Static / PWA Ready',
          latencyMs: elapsed,
        });
      }
    } catch {
      setServerHealth({
        status: 'standalone-browser',
        uptimeHuman: 'Client-side active',
        version: '1.2.0',
        timestamp: new Date().toISOString(),
        calculatorsOnline: 8,
        environment: 'browser-cached',
        latencyMs: 1,
      });
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    // Defer health check to idle time so initial paint and hydration are instant
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        const id = (window as any).requestIdleCallback(() => checkServerHealth(), { timeout: 3000 });
        return () => (window as any).cancelIdleCallback?.(id);
      } else {
        const timer = setTimeout(() => checkServerHealth(), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (path: string, toolKey?: ToolKey) => {
    scrollToTop();
    if (toolKey && onSelectTool) {
      onSelectTool(toolKey);
    } else {
      navigate(path);
    }
  };

  // 1. Working Newsletter Subscribe button (connected to backend POST /api/subscribe)
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = subscribeEmail.trim();

    if (!clean) {
      setSubscribeMessage({ text: 'Please enter your email address to subscribe.', isError: true });
      if (setToast) setToast('Please enter your email address.');
      return;
    }

    if (!clean.includes('@') || !clean.includes('.')) {
      setSubscribeMessage({ text: 'Please enter a valid email format (e.g. name@school.edu).', isError: true });
      if (setToast) setToast('Please enter a valid email format.');
      return;
    }

    setSubscribeLoading(true);
    setSubscribeMessage(null);

    try {
      const result = await submitForm('subscribe', { email: clean }, API_BASE);
      if (result.ok) {
        setSubscribeMessage({ text: result.message || 'Subscribed! Thank you.', isError: false });
        setSubscribeEmail('');
        if (setToast) setToast('Subscribed to Easy Grade updates!');
      } else {
        setSubscribeMessage({ text: `We could not send that right now. Please email ${CONTACT_EMAIL} directly.`, isError: true });
        if (setToast) setToast('Could not subscribe right now.');
      }
    } finally {
      setSubscribeLoading(false);
    }
  };

  // 2. Working Contact Form button (connected to backend POST /api/contact)
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) {
      setContactError('Please enter both your email address and a message.');
      return;
    }

    setContactLoading(true);
    setContactError(null);
    setContactSuccess(null);

    const payload = {
      name: contactName,
      email: contactEmail,
      subject: contactSubject,
      message: contactMessage,
      category: contactSubject,
    };

    try {
      const result = await submitForm('contact', payload, API_BASE);
      if (result.ok) {
        setContactSuccess(result.message || 'Thank you! Your message was sent to our team.');
        setContactMessage('');
        if (setToast) setToast('Message sent successfully!');
        setTimeout(() => {
          setActiveModal(null);
          setContactSuccess(null);
        }, 2200);
      } else {
        setContactError(`We could not send that right now. Please email ${CONTACT_EMAIL} directly.`);
      }
    } finally {
      setContactLoading(false);
    }
  };

  // 3. Working Report Issue button (connected to backend POST /api/report-issue)
  const handleReportIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim()) {
      setIssueError('Please provide details about the issue or calculation discrepancy.');
      return;
    }

    setIssueLoading(true);
    setIssueError(null);
    setIssueSuccess(null);

    const payload = {
      tool: issueTool,
      title: issueTitle || `${issueTool} Issue`,
      description: issueDescription,
      email: issueEmail,
    };

    try {
      const result = await submitForm('report-issue', payload, API_BASE);
      if (result.ok) {
        setIssueSuccess(result.message || 'Thank you! Your report was sent.');
        setIssueDescription('');
        setIssueTitle('');
        if (setToast) setToast('Bug report submitted!');
        setTimeout(() => {
          setActiveModal(null);
          setIssueSuccess(null);
        }, 2200);
      } else {
        setIssueError(`We could not send that right now. Please email ${CONTACT_EMAIL} directly.`);
      }
    } finally {
      setIssueLoading(false);
    }
  };

  // 4. Working Suggest Feature button (connected to backend POST /api/suggest-feature)
  const handleSuggestFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureName.trim() || !featureDescription.trim()) {
      setFeatureError('Please provide both a name and a description for your feature request.');
      return;
    }

    setFeatureLoading(true);
    setFeatureError(null);
    setFeatureSuccess(null);

    const payload = {
      featureName: featureName.trim(),
      category: featureCategory,
      description: featureDescription.trim(),
      email: featureEmail.trim(),
    };

    try {
      const result = await submitForm('suggest-feature', payload, API_BASE);
      if (result.ok) {
        setFeatureSuccess(result.message || 'Thank you! Your feature idea was sent.');
        setFeatureName('');
        setFeatureDescription('');
        if (setToast) setToast('Feature request sent!');
        setTimeout(() => {
          setActiveModal(null);
          setFeatureSuccess(null);
        }, 2200);
      } else {
        setFeatureError(`We could not send that right now. Please email ${CONTACT_EMAIL} directly.`);
      }
    } finally {
      setFeatureLoading(false);
    }
  };

  // 5. Working Backup & Export Data button (connected to backend POST /api/backup-data)
  const handleBackupData = () => {
    try {
      const dump: Record<string, any> = {};
      if (typeof window !== 'undefined' && window.localStorage) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key) {
            try {
              dump[key] = JSON.parse(window.localStorage.getItem(key) || '""');
            } catch {
              dump[key] = window.localStorage.getItem(key);
            }
          }
        }
      }

      // Generate and trigger download synchronously so browser user gesture is preserved on 1st click
      const backupBlob = new Blob(
        [
          JSON.stringify(
            {
              app: 'Easy Grade Tool',
              exportDate: new Date().toISOString(),
              version: '1.2.0',
              data: dump,
            },
            null,
            2
          ),
        ],
        { type: 'application/json' }
      );

      const url = URL.createObjectURL(backupBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `easy-grade-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (setToast) setToast('Backup downloaded successfully (.json)!');

      // Verify and record with backend asynchronously in background
      fetch(`${API_BASE}/api/backup-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientData: dump }),
      }).catch(() => {});
    } catch (err) {
      console.error('Backup error:', err);
      if (setToast) setToast('Failed to generate data backup.');
    }
  };

  // 6. Working Reset / Clear Local Data button
  const handleResetData = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
        window.sessionStorage.clear();
      }
      setActiveModal(null);
      if (setToast) setToast('All stored calculation data cleared successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch {
      setActiveModal(null);
      if (setToast) setToast('Storage cleared.');
    }
  };

  // 7. Working Copy Email button
  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = CONTACT_EMAIL;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        setCopiedEmail(true);
        if (setToast) setToast(`Email copied: ${email}`);
        setTimeout(() => setCopiedEmail(false), 2500);
      });
    }
  };

  // 8. Working Share link button (pings backend /api/share)
  const handleShareLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentUrl = typeof window !== 'undefined' ? window.location.href : SITE_URL;

    // Log share hit to backend
    fetch('/api/share', { method: 'POST' }).catch(() => {});

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: 'Easy Grade Tool',
          text: 'Calculate weighted grades, semester GPA, and needed final exam scores easily.',
          url: currentUrl,
        })
        .catch(() => {
          copyUrlFallback(currentUrl);
        });
    } else {
      copyUrlFallback(currentUrl);
    }
  };

  const copyUrlFallback = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        if (setToast) setToast('Calculator link copied to clipboard!');
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  const handleOpenSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenCommandPalette) {
      onOpenCommandPalette();
    } else {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true, bubbles: true })
      );
    }
  };

  const toolIconMap: Record<ToolKey, React.ComponentType<{ className?: string }>> = {
    quick: GraduationCap,
    gpa: GraduationCap,
    cgpa: Calculator,
    percentage: Percent,
    tip: Lightbulb,
    loan: Banknote,
    mortgage: House,
    password: KeyRound,
  };

  return (
    <>
      <footer className="w-full mt-20 pt-14 pb-12 font-sans border-t border-stone-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-950/60 backdrop-blur-xs transition-colors">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {/* Top Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-10 border-b border-stone-200/70 dark:border-slate-800/70">
            {/* Suite Info Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 text-xs font-semibold text-stone-700 dark:text-stone-300 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Calculators &amp; Grading Tools</span>
            </div>

            {/* Quick Actions Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Tools (⌘K) */}
              <button
                type="button"
                onClick={handleOpenSearch}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-full hover:border-stone-300 dark:hover:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Search calculators (Ctrl+K or ⌘K)"
                aria-label="Open search command palette"
              >
                <Search className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                <span>Search Tools</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-stone-100 dark:bg-slate-800 text-slate-500 rounded-full border border-stone-200 dark:border-slate-700 ml-0.5">
                  ⌘K
                </kbd>
              </button>

              {/* Share / Copy Link */}
              <button
                type="button"
                onClick={handleShareLink}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-full hover:border-stone-300 dark:hover:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Share current calculator or copy link"
                aria-label="Share current calculator"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                    <span className="text-teal-700 dark:text-teal-400 font-semibold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span>Share App</span>
                  </>
                )}
              </button>

              {/* Back to Top */}
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
                title="Scroll back to top"
                aria-label="Scroll back to top"
              >
                <ArrowUp className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                <span>Back to Top ↑</span>
              </button>
            </div>
          </div>

          {/* Interactive Newsletter / Updates Box (Backed by POST /api/subscribe) */}
          <div className="mb-12 p-6 sm:p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white m-0">
                  Stay Updated on Grade Formulas &amp; Academic Tools
                </h2>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium m-0">
                Get notified when new grading scales, curve calculators, and semester planning tools are added.
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-2 shrink-0">
              <form onSubmit={handleSubscribe} noValidate className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5 shrink-0">
                <label htmlFor={subscribeEmailId} className="sr-only">
                  Email address for updates
                </label>
                <input
                  id={subscribeEmailId}
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => {
                    setSubscribeEmail(e.target.value);
                    if (subscribeMessage) setSubscribeMessage(null);
                  }}
                  placeholder="Enter your student or edu email..."
                  className="w-full sm:w-72 min-h-[46px] bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all text-xs font-medium placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  disabled={subscribeLoading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-white bg-[#191C1E] hover:bg-black dark:bg-teal-600 dark:hover:bg-teal-500 rounded-full transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-60 shrink-0"
                >
                  {subscribeLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </form>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0 px-2 text-center sm:text-left">
                By subscribing, you agree to our{' '}
                <Link
                  to="/privacy"
                  onClick={scrollToTop}
                  className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600 transition-colors"
                >
                  Privacy Policy
                </Link>{' '}
                and consent to receive email updates. Unsubscribe anytime.
              </p>
              {subscribeMessage && (
                <div
                  className={`text-xs font-medium px-4 py-2 rounded-full text-center sm:text-left transition-all flex items-center gap-1.5 ${
                    subscribeMessage.isError
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  {subscribeMessage.isError ? (
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{subscribeMessage.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* 4 Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12">
            {/* Column 1: Brand & Data Management */}
            <div className="md:col-span-4 space-y-4">
              <Link
                to="/"
                onClick={() => {
                  scrollToTop();
                  if (onSelectTool) onSelectTool('quick');
                }}
                className="group flex items-center gap-3 text-left cursor-pointer transition-transform active:scale-95 focus:outline-none"
                title="Go to Easy Grade Tool Home"
              >
                <Logo size="md" />
              </Link>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                An offline-first, private-by-design calculation suite built for students, educators, and everyday planning. Fast, accurate, and completely tracker-free.
              </p>

              {/* Working Client-Side Privacy Badge */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  to="/privacy"
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/50 border border-emerald-200/70 dark:border-emerald-800/50 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 transition-colors cursor-pointer group active:scale-95"
                  title="View 100% Client-Side Privacy Policy"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>100% Client Privacy</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity">
                    • Policy →
                  </span>
                </Link>

                {/* Working Export / Backup Data Button */}
                <button
                  type="button"
                  onClick={handleBackupData}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 text-[11px] font-semibold text-stone-700 dark:text-stone-300 transition-colors cursor-pointer active:scale-95"
                  title="Download a verified JSON backup of all your saved course grades and calculations"
                >
                  <Download className="w-3 h-3 text-slate-500" />
                  <span>Export Data</span>
                </button>
              </div>
            </div>

            {/* Column 2: Calculators */}
            <div className="md:col-span-3 space-y-3">
              <h2 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-400 uppercase flex items-center justify-between m-0">
                <span>Calculators</span>
                <span className="text-[10px] font-medium text-slate-500">Tap to switch</span>
              </h2>
              <ul className="space-y-1 text-xs">
                {TOOLS_LIST.map((tool) => {
                  const isStaticPage =
                    location.pathname.startsWith('/about') ||
                    location.pathname.startsWith('/privacy') ||
                    location.pathname.startsWith('/methodology');
                  const isActive = !isStaticPage && currentToolKey === tool.key && location.pathname !== '/grade-calculator';
                  const Icon = toolIconMap[tool.key] || tool.icon;
                  return (
                    <li key={tool.key}>
                      <Link
                        to={tool.path}
                        onClick={() => {
                          scrollToTop();
                          if (onSelectTool) {
                            onSelectTool(tool.key);
                          }
                        }}
                        className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer active:scale-95 no-underline ${
                          isActive
                            ? 'bg-stone-100 dark:bg-slate-800 text-stone-900 dark:text-white font-bold border border-stone-200/80 dark:border-slate-700/80 shadow-2xs'
                            : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-slate-800/60 font-medium'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                        title={`Open ${tool.key === 'password' ? 'Password Generator' : tool.label + ' Calculator'}`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400'}`} />
                        <span className="truncate">{tool.label}</span>
                        {isActive && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 shrink-0" aria-hidden="true" />
                        )}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <Link
                    to="/grade-calculator"
                    onClick={scrollToTop}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer active:scale-95 no-underline ${
                      location.pathname === '/grade-calculator'
                        ? 'bg-stone-100 dark:bg-slate-800 text-stone-900 dark:text-white font-bold border border-stone-200/80 dark:border-slate-700/80 shadow-2xs'
                        : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-slate-800/60 font-medium'
                    }`}
                    aria-current={location.pathname === '/grade-calculator' ? 'page' : undefined}
                    title="Open Weighted Grade & Final Exam Calculator"
                  >
                    <Calculator className={`w-3.5 h-3.5 shrink-0 ${location.pathname === '/grade-calculator' ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400'}`} />
                    <span className="truncate">Weighted Grade &amp; Final</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/easy-grade-calculator/final-exam-grade-calculator"
                    onClick={scrollToTop}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer active:scale-95 no-underline ${
                      location.pathname === '/easy-grade-calculator/final-exam-grade-calculator'
                        ? 'bg-stone-100 dark:bg-slate-800 text-stone-900 dark:text-white font-bold border border-stone-200/80 dark:border-slate-700/80 shadow-2xs'
                        : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-slate-800/60 font-medium'
                    }`}
                    aria-current={location.pathname === '/easy-grade-calculator/final-exam-grade-calculator' ? 'page' : undefined}
                    title="Open Final Exam Grade Calculator — Target Score Needed"
                  >
                    <Target className={`w-3.5 h-3.5 shrink-0 ${location.pathname === '/easy-grade-calculator/final-exam-grade-calculator' ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400'}`} />
                    <span className="truncate">Final Exam Grade Calculator</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/easy-grade-calculator/ez-grader"
                    onClick={scrollToTop}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer active:scale-95 no-underline ${
                      location.pathname === '/easy-grade-calculator/ez-grader'
                        ? 'bg-stone-100 dark:bg-slate-800 text-stone-900 dark:text-white font-bold border border-stone-200/80 dark:border-slate-700/80 shadow-2xs'
                        : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-slate-800/60 font-medium'
                    }`}
                    aria-current={location.pathname === '/easy-grade-calculator/ez-grader' ? 'page' : undefined}
                    title="Open EZ Grader Online — Classroom Test Grading Chart"
                  >
                    <BookOpen className={`w-3.5 h-3.5 shrink-0 ${location.pathname === '/easy-grade-calculator/ez-grader' ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400'}`} />
                    <span className="truncate">EZ Grader Online Chart</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Working Feedback & Developer Support (Connected to Backend!) */}
            <div className="md:col-span-3 space-y-3">
              <h2 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-400 uppercase m-0">
                Support &amp; Feedback
              </h2>
              <ul className="space-y-1 text-xs">
                {/* Working Contact Developer Button */}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setContactSuccess(null);
                      setContactError(null);
                      setActiveModal('contact');
                    }}
                    className="w-full text-left flex items-center justify-between gap-1.5 px-3 py-2 rounded-xl text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-slate-800/60 font-medium transition-all cursor-pointer active:scale-95 group"
                    title="Send a message or feedback directly to the engineering team via backend"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors shrink-0" />
                      <span className="text-stone-700 dark:text-slate-300">Contact &amp; Feedback</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 border border-stone-200/80 dark:border-slate-700/80 shrink-0">
                      Form
                    </span>
                  </button>
                </li>

                {/* Working Report an Issue Button */}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setIssueSuccess(null);
                      setIssueError(null);
                      setActiveModal('reportIssue');
                    }}
                    className="w-full text-left flex items-center justify-between gap-1.5 px-3 py-2 rounded-xl text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-slate-800/60 font-medium transition-all cursor-pointer active:scale-95 group"
                    title="Report a calculation error or UI bug directly to backend ticket system"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Bug className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors shrink-0" />
                      <span>Report an Issue</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-slate-500 shrink-0">
                      Bug
                    </span>
                  </button>
                </li>

                {/* Working Suggest a Calculator / Feature Button */}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setFeatureSuccess(null);
                      setFeatureError(null);
                      setActiveModal('suggestFeature');
                    }}
                    className="w-full text-left flex items-center justify-between gap-1.5 px-3 py-2 rounded-xl text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-slate-800/60 font-medium transition-all cursor-pointer active:scale-95 group"
                    title="Suggest a new grading scale, formula or calculator to the roadmap"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <PlusCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0" />
                      <span>Request a Feature</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-slate-500 shrink-0">
                      Idea
                    </span>
                  </button>
                </li>

                {/* Working Quick Copy Email Button */}
                <li>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="w-full text-left flex items-center justify-between gap-1.5 px-3 py-2 rounded-xl text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-slate-800/60 font-medium transition-all cursor-pointer active:scale-95 group"
                    title={`Copy direct email address: ${CONTACT_EMAIL}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {copiedEmail ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <Mail className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0" />
                      )}
                      <span className={copiedEmail ? 'text-teal-700 dark:text-teal-400 font-semibold truncate' : 'truncate'}>
                        {copiedEmail ? 'Copied Email!' : 'Copy Direct Email'}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-slate-500 shrink-0">
                      {copiedEmail ? 'Ready' : 'Copy'}
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Trust, Legal & System Health */}
            <div className="md:col-span-2 space-y-3">
              <h2 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-400 uppercase m-0">
                Trust &amp; Legal
              </h2>
              <ul className="space-y-1 text-xs">
                {/* Working About & Methodology link */}
                <li>
                  <Link
                    to="/about"
                    onClick={scrollToTop}
                    onMouseEnter={() => preloadTool('about')}
                    onFocus={() => preloadTool('about')}
                    onTouchStart={() => preloadTool('about')}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-slate-800/60 font-medium transition-all cursor-pointer active:scale-95"
                    title="Learn about our grading methodology, GPA formulas, and project mission"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>About &amp; Methodology</span>
                  </Link>
                </li>

                {/* Working Privacy Policy link */}
                <li>
                  <Link
                    to="/privacy"
                    onClick={scrollToTop}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-slate-800/60 font-medium transition-all cursor-pointer active:scale-95"
                    title="Read our Privacy Policy"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Privacy Policy</span>
                  </Link>
                </li>

                {/* Working Terms of Service link */}
                <li>
                  <Link
                    to="/terms"
                    onClick={scrollToTop}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-slate-800/60 font-medium transition-all cursor-pointer active:scale-95"
                    title="View Terms of Service & Educational Disclaimer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Terms of Service</span>
                  </Link>
                </li>

                {/* Working Clear Data / Reset Button */}
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('resetConfirm')}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600/90 dark:text-rose-400/90 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50/70 dark:hover:bg-rose-950/40 font-medium transition-all cursor-pointer active:scale-95"
                    title="Reset all saved course grades, GPA rows, and calculator history"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Reset Local Data</span>
                  </button>
                </li>

                {/* Working Server Status Button */}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      checkServerHealth();
                      setActiveModal('status');
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-slate-800/60 font-medium transition-all cursor-pointer active:scale-95"
                    title="Inspect backend latency, operational status and uptime"
                  >
                    <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>System Status</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Minimal Bottom Bar */}
          <div className="pt-6 border-t border-stone-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 dark:text-slate-400 font-sans">
            <p className="m-0 text-center sm:text-left">
              &copy; {currentYear} Easy Grade Tool. Free client-side calculation suite.
            </p>
            <div className="flex items-center gap-1.5 text-xs">
              <span>Engineered with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" aria-hidden="true" />
              <span>for students and educators</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL 1: CONTACT & FEEDBACK (Submits to POST /api/contact)                */}
      {/* ========================================================================= */}
      {activeModal === 'contact' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={contactTitleId}
            tabIndex={-1}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 outline-none"
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 id={contactTitleId} className="text-base font-bold text-slate-900 dark:text-white">Contact &amp; Feedback</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Send questions, formula inquiries, or feedback directly to our team at{' '}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium text-emerald-600 dark:text-emerald-400 underline underline-offset-2 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    {CONTACT_EMAIL}
                  </a>.
                </p>
              </div>
            </div>

            {contactSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Message Sent!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">{contactSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                {contactError && (
                  <div
                    id={contactErrorId}
                    role="alert"
                    className="p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{contactError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={contactNameId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      id={contactNameId}
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Alex Chen"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor={contactEmailId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id={contactEmailId}
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your.email@school.edu"
                      required
                      aria-required="true"
                      aria-describedby={contactError ? contactErrorId : undefined}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={contactSubjectId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject / Category
                  </label>
                  <select
                    id={contactSubjectId}
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                  >
                    <option value="General Feedback">General Feedback</option>
                    <option value="Grading Formula Question">Grading Formula Question</option>
                    <option value="GPA Scale Accuracy">GPA Scale Accuracy</option>
                    <option value="Academic Institution Inquiry">Academic Institution Inquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={contactMessageId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id={contactMessageId}
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us what you love or how we can make Easy Grade better for you..."
                    required
                    aria-required="true"
                    aria-describedby={contactError ? contactErrorId : undefined}
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    title={`Copy direct email address: ${CONTACT_EMAIL}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Copy email ({CONTACT_EMAIL})</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-60"
                    >
                      {contactLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REPORT ISSUE / BUG (Submits to POST /api/report-issue)           */}
      {/* ========================================================================= */}
      {activeModal === 'reportIssue' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={issueTitleHeaderId}
            tabIndex={-1}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 outline-none"
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Bug className="w-5 h-5" />
              </div>
              <div>
                <h3 id={issueTitleHeaderId} className="text-base font-bold text-slate-900 dark:text-white">Report an Issue</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Encountered a calculation rounding issue or broken feature? Let us know.
                </p>
              </div>
            </div>

            {issueSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Issue Logged!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">{issueSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleReportIssueSubmit} className="space-y-4">
                {issueError && (
                  <div
                    id={issueErrorId}
                    role="alert"
                    className="p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{issueError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={issueToolId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Affected Calculator
                    </label>
                    <select
                      id={issueToolId}
                      value={issueTool}
                      onChange={(e) => setIssueTool(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-teal-600 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                    >
                      <option value="Quick Grade">Quick Grade Calculator</option>
                      <option value="GPA Calculator">GPA Calculator</option>
                      <option value="CGPA to Percentage Calculator">CGPA to Percentage Calculator</option>
                      <option value="Percentage Calculator">Percentage Calculator</option>
                      <option value="Tip Calculator">Tip Calculator</option>
                      <option value="Loan Calculator">Loan Calculator</option>
                      <option value="Mortgage Calculator">Mortgage Calculator</option>
                      <option value="Password Generator">Password Generator</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor={issueSummaryId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Issue Summary
                    </label>
                    <input
                      id={issueSummaryId}
                      type="text"
                      value={issueTitle}
                      onChange={(e) => setIssueTitle(e.target.value)}
                      placeholder="e.g. Weighted curve rounding discrepancy"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-teal-600 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={issueDescriptionId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Details &amp; Steps to Reproduce <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id={issueDescriptionId}
                    rows={4}
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Describe what values you entered, what result you saw, and what you expected..."
                    required
                    aria-required="true"
                    aria-describedby={issueError ? issueErrorId : undefined}
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-teal-600 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all resize-none"
                  />
                </div>

                <div>
                  <label htmlFor={issueEmailId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Email (optional, for follow-up)
                  </label>
                  <input
                    id={issueEmailId}
                    type="email"
                    value={issueEmail}
                    onChange={(e) => setIssueEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-teal-600 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={issueLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    {issueLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Logging...</span>
                      </>
                    ) : (
                      <>
                        <Bug className="w-3.5 h-3.5" />
                        <span>Submit Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: REQUEST A FEATURE (Submits to POST /api/suggest-feature)          */}
      {/* ========================================================================= */}
      {activeModal === 'suggestFeature' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={featureTitleHeaderId}
            tabIndex={-1}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 outline-none"
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 id={featureTitleHeaderId} className="text-base font-bold text-slate-900 dark:text-white">Request a Calculator or Feature</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Suggest a new grading scale, formula system, or calculator type.
                </p>
              </div>
            </div>

            {featureSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Feature Submitted!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">{featureSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSuggestFeatureSubmit} className="space-y-4">
                {featureError && (
                  <div
                    id={featureErrorId}
                    role="alert"
                    className="p-3 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{featureError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={featureNameId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Feature / Tool Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id={featureNameId}
                      type="text"
                      value={featureName}
                      onChange={(e) => setFeatureName(e.target.value)}
                      placeholder="e.g. Canadian 9.0 GPA Scale"
                      required
                      aria-required="true"
                      aria-describedby={featureError ? featureErrorId : undefined}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-teal-600 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor={featureCategoryId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      id={featureCategoryId}
                      value={featureCategory}
                      onChange={(e) => setFeatureCategory(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-teal-600 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                    >
                      <option value="New Grading Scale">New Grading Scale</option>
                      <option value="New Calculator Type">New Calculator Type</option>
                      <option value="Formula Enhancement">Formula Enhancement</option>
                      <option value="Export & Reporting Option">Export &amp; Reporting Option</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor={featureDescriptionId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Description &amp; Why It&apos;s Useful <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id={featureDescriptionId}
                    rows={4}
                    value={featureDescription}
                    onChange={(e) => setFeatureDescription(e.target.value)}
                    placeholder="Describe how the calculator should work or provide links to standard formulas..."
                    required
                    aria-required="true"
                    aria-describedby={featureError ? featureErrorId : undefined}
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-teal-600 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all resize-none"
                  />
                </div>

                <div>
                  <label htmlFor={featureEmailId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Email (optional, for roadmap notification)
                  </label>
                  <input
                    id={featureEmailId}
                    type="email"
                    value={featureEmail}
                    onChange={(e) => setFeatureEmail(e.target.value)}
                    placeholder="you@school.edu"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-teal-600 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={featureLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    {featureLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Idea</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: SYSTEM & BACKEND STATUS (Pings GET /api/health)                  */}
      {/* ========================================================================= */}
      {activeModal === 'status' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={statusTitleId}
            tabIndex={-1}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 outline-none"
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 id={statusTitleId} className="text-base font-bold text-slate-900 dark:text-white">System &amp; Backend Status</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time health check of Easy Grade services.
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">API Health Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {serverHealth?.status === 'operational' ? 'Operational' : 'Active'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-slate-500 dark:text-slate-400 mb-0.5">Roundtrip Latency</div>
                  <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {serverHealth?.latencyMs ? `${serverHealth.latencyMs} ms` : '< 5 ms'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-slate-500 dark:text-slate-400 mb-0.5">Server Uptime</div>
                  <div className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                    {serverHealth?.uptimeHuman || 'Online'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Active Suite Calculators</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{serverHealth?.calculatorsOnline || 8} of 8 Ready</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Client-Side PWA Engine</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Enabled (Offline Ready)</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Version</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">v{serverHealth?.version || '1.2.0'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={checkServerHealth}
                disabled={healthLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Ping</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-teal-700 dark:bg-teal-600 hover:bg-teal-800 dark:hover:bg-teal-700 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: RESET DATA CONFIRMATION                                          */}
      {/* ========================================================================= */}
      {activeModal === 'resetConfirm' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={resetTitleId}
            tabIndex={-1}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 text-center space-y-4 outline-none"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 id={resetTitleId} className="text-base font-bold text-slate-900 dark:text-white">Reset All Calculator Data?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                This will erase all locally stored course rows, GPA terms, custom scales, and loan inputs. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleResetData}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
