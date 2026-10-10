import React, { useState, useEffect, useRef, useId } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from './SlashLink';
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
  Send,
  CheckCircle2,
  FileText,
  Loader2,
  MessageSquare,
  Bug,
  PlusCircle,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { getToolKeyFromPath, CONTACT_EMAIL, TOOL_PATHS } from '../data/constants';
import { NAV_ITEMS } from '../data/navItems';
import { isSamePath } from '../utils/paths';
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


const FOOTER_PREMIUM_CSS = `
.ft-news{position:relative;isolation:isolate;overflow:hidden;color:#fff;
  background:linear-gradient(120deg,#16206b 0%,#2f4bb8 40%,#5b3fc4 75%,#2f4bb8 100%);background-size:220% 220%;
  animation:ft-grad 16s ease-in-out infinite,ft-rise .7s cubic-bezier(.2,.8,.2,1) both;
  box-shadow:0 30px 70px -24px rgba(40,60,170,.7),inset 0 0 0 1px rgba(255,255,255,.16)}
.ft-news::before{content:"";position:absolute;inset:0;z-index:-1;opacity:.35;
  background-image:linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px);
  background-size:34px 34px;-webkit-mask-image:radial-gradient(ellipse at 30% 20%,#000 0%,transparent 70%);mask-image:radial-gradient(ellipse at 30% 20%,#000 0%,transparent 70%)}
.ft-orb{position:absolute;z-index:-1;border-radius:9999px;filter:blur(46px);pointer-events:none}
.ft-orb-a{width:15rem;height:15rem;left:-4rem;top:-5rem;background:rgba(99,179,255,.45);animation:ft-drift 11s ease-in-out infinite}
.ft-orb-b{width:17rem;height:17rem;right:-5rem;bottom:-7rem;background:rgba(236,110,190,.38);animation:ft-drift 14s ease-in-out infinite reverse}
.ft-title-accent{background:linear-gradient(90deg,#fde68a,#fdba74 45%,#f9a8d4);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.ft-float{animation:ft-float 6s ease-in-out infinite}
.ft-spark{transform-box:fill-box;transform-origin:center;animation:ft-twinkle 2.8s ease-in-out infinite}
.ft-spark:nth-of-type(2){animation-delay:.9s}.ft-spark:nth-of-type(3){animation-delay:1.7s}
.ft-chip{display:inline-flex;align-items:center;gap:.4rem;padding:.3rem .7rem;border-radius:9999px;font-size:.72rem;font-weight:600;color:rgba(255,255,255,.92);
  background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.ft-form{display:flex;align-items:center;gap:.4rem;padding:.4rem;border-radius:9999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.28);
  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);transition:box-shadow .25s,background .25s,border-color .25s}
.ft-form:focus-within{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.75);box-shadow:0 0 0 4px rgba(255,255,255,.18),0 10px 30px -10px rgba(253,230,138,.55)}
.ft-btn{position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:48px;padding:0 1.35rem;border:0;border-radius:9999px;cursor:pointer;flex-shrink:0;
  font-weight:800;font-size:.85rem;color:#18205c;background:linear-gradient(135deg,#fde68a 0%,#fdba74 55%,#f9a8d4 100%);
  box-shadow:0 10px 24px -8px rgba(253,186,116,.8);transition:transform .2s,box-shadow .2s,filter .2s}
.ft-btn::after{content:"";position:absolute;top:0;left:-70%;width:45%;height:100%;transform:skewX(-20deg);
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent);animation:ft-shine 5s ease-in-out infinite}
.ft-btn:hover:not(:disabled){transform:translateY(-1px) scale(1.03);box-shadow:0 14px 30px -8px rgba(253,186,116,.95);filter:saturate(1.1)}
.ft-btn:active:not(:disabled){transform:scale(.96)}
.ft-btn:disabled{opacity:.75;cursor:wait}
.ft-btn:focus-visible{outline:3px solid #fff;outline-offset:2px}
.ft-btn .ft-arrow{transition:transform .2s}.ft-btn:hover:not(:disabled) .ft-arrow{transform:translateX(3px)}
.ft-msg{animation:ft-pop .35s cubic-bezier(.2,1.2,.3,1) both}
.ft-more-btn{display:inline-flex;align-items:center;gap:.35rem;min-height:36px;padding:.3rem .85rem;border-radius:9999px;cursor:pointer;
  font-size:12px;font-weight:700;color:#3454be;background:#eef2ff;border:1px solid #c7d4fb;transition:background .2s,color .2s,transform .2s,box-shadow .2s}
.dark .ft-more-btn{color:#bfd0ff;background:rgb(30 41 59);border-color:rgb(71 85 105)}
.ft-more-btn:hover{background:#4468d8;color:#fff;border-color:#4468d8;transform:translateY(-1px);box-shadow:0 8px 18px -10px rgba(68,104,216,.9)}
.ft-more-btn:focus-visible{outline:3px solid #4468d8;outline-offset:2px}
.ft-more-chev{transition:transform .25s}
.ft-more-in{animation:ft-reveal .28s cubic-bezier(.2,.8,.2,1) both}
@keyframes ft-grad{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes ft-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes ft-drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(28px,18px) scale(1.12)}}
@keyframes ft-float{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-10px) rotate(1.5deg)}}
@keyframes ft-twinkle{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.15)}}
@keyframes ft-shine{0%,60%{left:-70%}100%{left:130%}}
@keyframes ft-pop{from{opacity:0;transform:translateY(6px) scale(.94)}to{opacity:1;transform:none}}
@keyframes ft-reveal{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
  .ft-news,.ft-orb,.ft-float,.ft-spark,.ft-btn::after,.ft-msg,.ft-more-in{animation:none!important}
  .ft-more-btn,.ft-more-chev,.ft-btn,.ft-btn .ft-arrow{transition:none!important}
}
`;

/**
 * Pages that are not in the top navigation but must stay one click from every page (and from the homepage),
 * which the launch audit (CHK-16) enforces for every sitemap URL.
 */
/** Links shown before the "More" button in each footer column (all columns line up at this height). */
const FOOTER_VISIBLE_LINKS = 4;

const FOOTER_EXTRA_ACADEMIC_LINKS: { label: string; title: string; path: string }[] = [
  { label: 'Average Grade', title: 'Average grade calculator', path: '/average-grade-calculator/' },
  { label: 'Grading Scales', title: 'Grading scale charts by number of questions', path: '/grading-scale/' },
];

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
    'contact' | 'reportIssue' | 'suggestFeature' | null
  >(null);

  // Share & copy states
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Newsletter subscribe form state
  const [subscribeEmail, setSubscribeEmail] = useState<string>('');
  const [subscribeLoading, setSubscribeLoading] = useState<boolean>(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  // Long footer link columns show a few links first and expand with the "More" button
  // undefined = automatic (collapsed, or open when the visitor is on a hidden link); true/false = the visitor's own choice
  const [openGroups, setOpenGroups] = useState<Record<string, boolean | undefined>>({});
  const setGroupOpen = (key: string) => (open: boolean) => setOpenGroups((g) => (g[key] === open ? g : { ...g, [key]: open }));
  // A new page starts from the automatic state again, so the active link is never left hidden.
  useEffect(() => {
    setOpenGroups({});
  }, [location.pathname]);

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

  // Shared footer styles (single place to tweak the look)
  const colHeadCls = 'text-[15px] font-bold text-slate-900 dark:text-white m-0 mb-5';
  const linkCls =
    'inline-flex items-center text-left text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-[#4468D8] dark:hover:text-blue-300 transition-colors cursor-pointer bg-transparent border-0 p-0';
  const iconBtnCls =
    'w-9 h-9 inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#4F73DF] hover:text-white dark:hover:bg-[#4F73DF] transition-colors cursor-pointer active:scale-95';

  return (
    <>
      <footer className="site-footer relative w-full mt-24 font-sans" aria-label="Site footer">
        <style dangerouslySetInnerHTML={{ __html: FOOTER_PREMIUM_CSS }} />
        {/* Newsletter banner: overlaps the top edge of the white footer panel (Backed by POST /api/subscribe) */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <section
            aria-label="Newsletter"
            className="ft-news grid md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] items-center gap-6 md:gap-10 px-6 py-9 sm:px-10 rounded-[24px]"
          >
            <span className="ft-orb ft-orb-a" aria-hidden="true" />
            <span className="ft-orb ft-orb-b" aria-hidden="true" />
            {/* Illustration (decorative) */}
            <div className="hidden md:flex justify-center ft-float" aria-hidden="true">
              <svg viewBox="0 0 240 230" className="w-56 h-auto -mt-16 drop-shadow-[0_18px_24px_rgba(20,35,100,0.35)]" fill="none">
                <defs>
                  <linearGradient id="fnScreen" x1="72" y1="70" x2="164" y2="106" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4468D8" />
                    <stop offset="1" stopColor="#7C5CE0" />
                  </linearGradient>
                  <linearGradient id="fnBody" x1="60" y1="50" x2="180" y2="200" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E3EDFF" />
                    <stop offset="1" stopColor="#9DBBF6" />
                  </linearGradient>
                  <linearGradient id="fnScreen" x1="76" y1="68" x2="164" y2="102" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2E4AAE" />
                    <stop offset="1" stopColor="#3E5FCC" />
                  </linearGradient>
                </defs>
                <ellipse cx="120" cy="214" rx="78" ry="9" fill="#1B2D78" opacity="0.28" />
                <rect x="66" y="62" width="120" height="146" rx="20" fill="#7FA0EC" />
                <rect x="58" y="54" width="120" height="146" rx="20" fill="url(#fnBody)" />
                <rect x="72" y="70" width="92" height="36" rx="10" fill="url(#fnScreen)" />
                <text x="118" y="95" textAnchor="middle" fontSize="22" fontWeight="800" fill="#fff" fontFamily="Inter, sans-serif">A+</text>
                {[0, 1, 2].map((r) =>
                  [0, 1, 2].map((c) => (
                    <rect
                      key={`${r}-${c}`}
                      x={74 + c * 31}
                      y={120 + r * 25}
                      width="24"
                      height="18"
                      rx="6"
                      fill={r === 2 && c === 2 ? '#E8795A' : '#FFFFFF'}
                      opacity={r === 2 && c === 2 ? 1 : 0.92}
                    />
                  ))
                )}
                <path d="M118 12 L184 36 L118 60 L52 36 Z" fill="#1E2B63" />
                <path d="M82 49 V68 C82 76 154 76 154 68 V49 L118 62 Z" fill="#2B3B80" />
                <path d="M174 40 V62" stroke="#E8795A" strokeWidth="3" strokeLinecap="round" />
                <circle cx="174" cy="66" r="4.5" fill="#E8795A" />
                <path className="ft-spark" d="M205 78 q0 12 12 12 q-12 0 -12 12 q0 -12 -12 -12 q12 0 12 -12 Z" fill="#fff" />
                <path className="ft-spark" d="M34 58 q0 9 9 9 q-9 0 -9 9 q0 -9 -9 -9 q9 0 9 -9 Z" fill="#fff" />
                <path className="ft-spark" d="M44 128 q0 7 7 7 q-7 0 -7 7 q0 -7 -7 -7 q7 0 7 -7 Z" fill="#fff" opacity="0.9" />
              </svg>
            </div>

            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-200 m-0 mb-3">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Free study updates
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-white m-0 max-w-lg [text-wrap:balance]">
                Subscribe to get updates on new <span className="ft-title-accent">grade formulas &amp; academic tools</span>
              </h2>
              <p className="mt-3 text-[13px] sm:text-sm font-medium text-white/85 m-0 max-w-lg">
                Get notified when new grading scales, curve calculators, and semester planning tools are added.
              </p>

              <form onSubmit={handleSubscribe} noValidate className="mt-5 max-w-lg">
                <label htmlFor={subscribeEmailId} className="sr-only">
                  Email address for updates
                </label>
                <div className="ft-form">
                  <Mail className="w-4 h-4 ml-3 text-white/85 shrink-0" aria-hidden="true" />
                  <input
                    id={subscribeEmailId}
                    type="email"
                    value={subscribeEmail}
                    onChange={(e) => {
                      setSubscribeEmail(e.target.value);
                      if (subscribeMessage) setSubscribeMessage(null);
                    }}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="flex-1 min-w-0 min-h-[44px] bg-transparent border-0 text-white placeholder:text-white/70 px-1 py-2 text-base sm:text-sm font-medium focus:outline-none focus:ring-0"
                  />
                  <button type="submit" disabled={subscribeLoading} className="ft-btn">
                    {subscribeLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="ft-arrow w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <ul className="mt-4 p-0 m-0 list-none flex flex-wrap gap-2">
                <li className="ft-chip"><Check className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />No spam</li>
                <li className="ft-chip"><Check className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />Free forever</li>
                <li className="ft-chip"><Check className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />Unsubscribe anytime</li>
              </ul>

              <p className="mt-3 text-[11px] leading-relaxed text-white/80 m-0 max-w-md">
                By subscribing, you agree to our{' '}
                <Link
                  to="/privacy"
                  onClick={scrollToTop}
                  className="text-white font-semibold underline underline-offset-2 hover:text-amber-200 transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              {subscribeMessage && (
                <div
                  role="status"
                  className={`ft-msg mt-3 max-w-md text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-lg ${
                    subscribeMessage.isError ? 'bg-rose-50 text-rose-800' : 'bg-white text-emerald-800'
                  }`}
                >
                  {subscribeMessage.isError ? (
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  )}
                  <span>{subscribeMessage.text}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* White footer panel */}
        <div className="relative -mt-16 pt-28 md:pt-24 bg-white dark:bg-slate-900 border-t border-slate-200/70 dark:border-slate-800 shadow-[0_-12px_50px_-20px_rgba(70,100,210,0.25)] dark:shadow-none transition-colors">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-10 pb-12">
              {/* Brand */}
              <div className="col-span-2 md:col-span-4 space-y-5">
                <Link
                  to="/"
                  onClick={() => {
                    scrollToTop();
                    if (onSelectTool) onSelectTool('quick');
                  }}
                  className="group inline-flex items-center text-left cursor-pointer transition-transform active:scale-95 focus:outline-none"
                  title="Go to Easy Grade Tool Home"
                >
                  <Logo size="md" />
                </Link>

                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs m-0">
                  An offline-first, private-by-design calculation suite built for students, educators, and everyday planning. Fast, accurate, and completely tracker-free.
                </p>

                {/* Quick action icons */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleOpenSearch}
                    className={iconBtnCls}
                    title="Search calculators (Ctrl+K or ⌘K)"
                    aria-label="Open search command palette"
                  >
                    <Search className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShareLink}
                    className={iconBtnCls}
                    title="Share current calculator or copy link"
                    aria-label="Share current calculator"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" /> : <Share2 className="w-4 h-4" aria-hidden="true" />}
                  </button>
                  <button
                    type="button"
                    onClick={scrollToTop}
                    className={iconBtnCls}
                    title="Scroll back to top"
                    aria-label="Scroll back to top"
                  >
                    <ArrowUp className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Calculators + More tools: original vertical lists, capped with a "More" button so every column is the same height */}
              {(['academic', 'utility'] as const).map((group) => {
                const isStaticPage =
                  location.pathname.startsWith('/about') ||
                  location.pathname.startsWith('/privacy') ||
                  location.pathname.startsWith('/terms') ||
                  location.pathname.startsWith('/methodology');
                const items = [
                  ...NAV_ITEMS.filter((t) => t.group === group).map((t) => ({
                    label: t.label,
                    title: t.title,
                    path: t.path,
                    toolKey: t.toolKey as ToolKey | null,
                  })),
                  ...(group === 'academic' ? FOOTER_EXTRA_ACADEMIC_LINKS.map((t) => ({ ...t, toolKey: null as ToolKey | null })) : []),
                ];
                const userChoice = openGroups[group];
                const hasMore = items.length > FOOTER_VISIBLE_LINKS;
                // Keep the expanded group open when the visitor is on one of its hidden pages.
                const hiddenActive = items.slice(FOOTER_VISIBLE_LINKS).some((t) => !isStaticPage && isSamePath(location.pathname, t.path));
                // An explicit click always wins; otherwise stay open only while the active page is a hidden link.
                const showAll = userChoice ?? hiddenActive;
                return (
                  <div key={group} className="md:col-span-2">
                    <h2 className={colHeadCls}>{group === 'academic' ? 'Grade Calculators' : 'More Tools'}</h2>
                    <ul className="space-y-3 list-none p-0 m-0">
                      {items.map((tool, idx) => {
                        const isActive = !isStaticPage && isSamePath(location.pathname, tool.path);
                        // Hidden items stay in the HTML (crawlable) but are not displayed until "More" is pressed.
                        const isHidden = idx >= FOOTER_VISIBLE_LINKS && !showAll;
                        return (
                          <li key={tool.path} className={isHidden ? 'hidden' : idx >= FOOTER_VISIBLE_LINKS ? 'ft-more-in' : undefined}>
                            <Link
                              to={tool.path}
                              onClick={() => {
                                scrollToTop();
                                // Skip for pages that share a tool key (e.g. Weighted/Final Exam) so we never jump back to Home.
                                if (tool.toolKey && isSamePath(TOOL_PATHS[tool.toolKey], tool.path)) onSelectTool?.(tool.toolKey);
                              }}
                              className={`${linkCls} no-underline ${isActive ? '!text-[#4468D8] dark:!text-blue-300 font-bold' : ''}`}
                              aria-current={isActive ? 'page' : undefined}
                              title={tool.title}
                            >
                              {tool.label}
                            </Link>
                          </li>
                        );
                      })}
                      {hasMore && (
                        <li>
                          <button
                            type="button"
                            onClick={() => setGroupOpen(group)(!showAll)}
                            aria-expanded={showAll}
                            className="ft-more-btn"
                          >
                            <span>{showAll ? 'Show less' : `More (${items.length - FOOTER_VISIBLE_LINKS})`}</span>
                            <ChevronDown className={`ft-more-chev w-3.5 h-3.5 ${showAll ? 'rotate-180' : ''}`} aria-hidden="true" />
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}

              {/* Support */}
              <div className="md:col-span-2">
                <h2 className={colHeadCls}>Support</h2>
                <ul className="space-y-3 list-none p-0 m-0">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setIssueSuccess(null);
                        setIssueError(null);
                        setActiveModal('reportIssue');
                      }}
                      className={linkCls}
                      title="Report a calculation error or UI bug directly to backend ticket system"
                    >
                      Report an Issue
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setFeatureSuccess(null);
                        setFeatureError(null);
                        setActiveModal('suggestFeature');
                      }}
                      className={linkCls}
                      title="Suggest a new grading scale, formula or calculator to the roadmap"
                    >
                      Request a Feature
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact Us */}
              <div className="md:col-span-2">
                <h2 className={colHeadCls}>Contact Us</h2>
                <ul className="space-y-3.5 list-none p-0 m-0">
                  <li>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className={`${linkCls} gap-2.5`}
                      title={`Copy direct email address: ${CONTACT_EMAIL}`}
                    >
                      <span className="w-6 h-6 rounded-md bg-[#4F73DF] text-white flex items-center justify-center shrink-0">
                        {copiedEmail ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Mail className="w-3.5 h-3.5" aria-hidden="true" />}
                      </span>
                      <span className="break-all">{copiedEmail ? 'Copied!' : CONTACT_EMAIL}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setContactSuccess(null);
                        setContactError(null);
                        setActiveModal('contact');
                      }}
                      className={`${linkCls} gap-2.5`}
                      title="Send a message or feedback directly to the engineering team via backend"
                    >
                      <span className="w-6 h-6 rounded-md bg-[#4F73DF] text-white flex items-center justify-center shrink-0">
                        <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                      <span>Contact &amp; Feedback</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-200/80 dark:border-slate-800">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <p className="m-0 text-center md:text-left">
                &copy; {currentYear} Easy Grade Tool. Free client-side calculation suite. Engineered with{' '}
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline -mt-0.5" aria-hidden="true" /> for students and educators.
              </p>
              <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium text-slate-600 dark:text-slate-300">
                <Link
                  to="/about"
                  onClick={scrollToTop}
                  onMouseEnter={() => preloadTool('about')}
                  onFocus={() => preloadTool('about')}
                  onTouchStart={() => preloadTool('about')}
                  className="no-underline hover:text-[#4468D8] dark:hover:text-blue-300 transition-colors"
                  title="Learn about our grading methodology, GPA formulas, and project mission"
                >
                  About &amp; Methodology
                </Link>
                <Link to="/privacy" onClick={scrollToTop} className="no-underline hover:text-[#4468D8] dark:hover:text-blue-300 transition-colors" title="Read our Privacy Policy">
                  Privacy Policy
                </Link>
                <Link to="/terms" onClick={scrollToTop} className="no-underline hover:text-[#4468D8] dark:hover:text-blue-300 transition-colors" title="View Terms of Service & Educational Disclaimer">
                  Terms of Service
                </Link>
              </nav>
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
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 id={contactTitleId} className="text-base font-bold text-slate-900 dark:text-white">Contact &amp; Feedback</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Send questions, formula inquiries, or feedback directly to our team at{' '}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium text-teal-600 dark:text-teal-400 underline underline-offset-2 hover:text-teal-700 dark:hover:text-teal-300"
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
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
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
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
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
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
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
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/90 text-slate-900 dark:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 hover:border-slate-300 dark:hover:border-slate-600 transition-all resize-none"
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

    </>
  );
};
