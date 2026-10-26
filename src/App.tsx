import React, { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
  useParams,
  BrowserRouter,
  MemoryRouter,
} from 'react-router-dom';
import { HelmetProvider } from './utils/helmet';
import { SiteHeader } from './components/SiteHeader';
import { UpdatePrompt } from './components/UpdatePrompt';
import { Toast } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { TOOLS_LIST, TOOL_PATHS, getToolKeyFromPath } from './data/constants';
import { ToolKey } from './types';
import { GradeCalculator } from './components/GradeCalculator';
import { NotFound } from './components/NotFound';
import { isSelfManagedSeoPath } from './data/selfManagedSeo';
import { isGradingScaleParam } from './data/gradingScaleSizes';
import { CGPA_UNIVERSITY_PAGES } from './data/cgpaUniversityPages';
import { LEGACY_REDIRECTS } from './data/legacyRedirects';
import { Footer } from './components/Footer';
import { SEOHead } from './components/SEOHead';
import { preloadAllTools } from './utils/toolPreloader';
import { normalizePath } from './utils/paths';
import {
  LazyGpa, LazyCgpa, LazyTip, LazyPercentage, LazyLoan, LazyMortgage, LazyPassword,
  LazyPrivacy, LazyTerms, LazyAbout, LazyProgrammatic, LazyToolPage, LazyPalette,
} from './utils/lazyRoutes';

// Zero CLS loading placeholder for lazy routes
const CalculatorSkeleton: React.FC = () => (
  <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-pulse" aria-hidden="true">
    <div className="h-8 w-60 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-3" />
    <div className="h-4 w-96 max-w-full bg-slate-200/70 dark:bg-slate-800/70 rounded-lg mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-7 min-h-[32rem] bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl border border-slate-200/80 dark:border-slate-800/80" />
      <div className="md:col-span-5 min-h-[32rem] bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl border border-slate-200/80 dark:border-slate-800/80" />
    </div>
  </div>
);

export interface AppSyncComponents {
  GradeCalculator?: React.ComponentType<any>;
  GpaCalculator?: React.ComponentType<any>;
  CgpaToPercentage?: React.ComponentType<any>;
  TipCalculator?: React.ComponentType<any>;
  PercentageCalculator?: React.ComponentType<any>;
  LoanCalculator?: React.ComponentType<any>;
  MortgageCalculator?: React.ComponentType<any>;
  PasswordGenerator?: React.ComponentType<any>;
  PrivacyPolicy?: React.ComponentType<any>;
  TermsOfService?: React.ComponentType<any>;
  AboutMethodology?: React.ComponentType<any>;
  ProgrammaticCalculatorView?: React.ComponentType<any>;
  ToolPage?: React.ComponentType<any>;
}

/** /grading-scale/25-questions/ -> the page for that test size; unknown sizes go to the index. */
const GradingScaleRoute: React.FC<{ ToolPage: React.ComponentType<{ slug: string }> }> = ({ ToolPage }) => {
  const { size } = useParams();
  if (!isGradingScaleParam(size)) return <Navigate to="/grading-scale/" replace />;
  return <ToolPage slug={`grading-scale/${size}`} />;
};

const CgpaUniversityRoute: React.FC<{ ToolPage: React.ComponentType<{ slug: string }> }> = ({ ToolPage }) => {
  const { uni } = useParams();
  if (!uni || !CGPA_UNIVERSITY_PAGES.some((u) => u.id === uni)) {
    return <Navigate to="/cgpa-to-percentage-calculator/" replace />;
  }
  return <ToolPage slug={`cgpa-to-percentage/${uni}`} />;
};

function AppMain({ syncComponents }: { syncComponents?: AppSyncComponents }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Component resolution: prioritize sync components for SSR/prerender, with direct component fallbacks
  const CompGrade = syncComponents?.GradeCalculator || GradeCalculator;
  const CompGpa = syncComponents?.GpaCalculator || LazyGpa;
  const CompCgpa = syncComponents?.CgpaToPercentage || LazyCgpa;
  const CompTip = syncComponents?.TipCalculator || LazyTip;
  const CompPct = syncComponents?.PercentageCalculator || LazyPercentage;
  const CompLoan = syncComponents?.LoanCalculator || LazyLoan;
  const CompMortgage = syncComponents?.MortgageCalculator || LazyMortgage;
  const CompPassword = syncComponents?.PasswordGenerator || LazyPassword;
  const CompPrivacy = syncComponents?.PrivacyPolicy || LazyPrivacy;
  const CompTerms = syncComponents?.TermsOfService || LazyTerms;
  const CompAbout = syncComponents?.AboutMethodology || LazyAbout;
  const CompToolPage = syncComponents?.ToolPage || LazyToolPage;
  const CompProgrammatic = syncComponents?.ProgrammaticCalculatorView || LazyProgrammatic;

  // Embed mode (?embed=1): chrome-free view used by the free school embeds (/for-schools/).
  // The tool section stays; header, footer and in-page content are hidden (see .embed-mode in index.css).
  const isEmbed = useMemo(() => new URLSearchParams(location.search).get('embed') === '1', [location.search]);

  // Derive active tool dynamically from URL pathname with immediate local state sync
  const activeTool: ToolKey = useMemo(() => getToolKeyFromPath(location.pathname), [location.pathname]);

  // Segment-boundary match: '/about' and '/about/x' qualify, '/about-us-fake' does not.
  const isProgrammaticRoute = useMemo(() => {
    const path = normalizePath(location.pathname);
    const underPrefix = (prefix: string) => path === prefix || path.startsWith(`${prefix}/`);
    return (
      isSelfManagedSeoPath(location.pathname) ||
      ['/easy-grade-calculator', '/calculator', '/about', '/privacy', '/terms', '/methodology'].some(underPrefix)
    );
  }, [location.pathname]);

  // Restore deep link route from GitHub Pages SPA 404 redirect if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const redirectTarget = sessionStorage.getItem('spa_redirect_target');
      if (redirectTarget) {
        sessionStorage.removeItem('spa_redirect_target');
        const base = getClientBasename();
        let targetRoute = redirectTarget;
        if (base && targetRoute.startsWith(base)) {
          targetRoute = targetRoute.slice(base.length);
        }
        if (targetRoute && !targetRoute.startsWith('/')) {
          targetRoute = `/${targetRoute}`;
        }
        if (targetRoute && targetRoute !== location.pathname) {
          navigate(targetRoute, { replace: true });
        }
      }
    } catch (_) {}
  }, [navigate, location.pathname]);

  // On every client-side route change: scroll to top, move focus to <main> and announce the new page
  // to screen readers. The first render is skipped so a fresh page load does not steal focus.
  const mainRef = useRef<HTMLElement | null>(null);
  const firstRoute = useRef(true);
  const [routeAnnouncement, setRouteAnnouncement] = useState<string>('');
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      mainRef.current?.focus({ preventScroll: true });
      const heading = document.querySelector('main h1');
      setRouteAnnouncement(`${(heading?.textContent || document.title || 'Page').trim()} page loaded`);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  // Warm up all calculator tool chunks during idle time for 0ms instantaneous switching
  useEffect(() => {
    preloadAllTools();
  }, []);

  // Auto-dismiss toast after 2.6 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => {
      setToastMessage('');
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  // Global keyboard shortcut listener for Ctrl+K, Cmd+K, and '/'
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        e.stopPropagation();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (e.key === '/' && !isCommandPaletteOpen) {
        const target = e.target as HTMLElement | null;
        const isInput =
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable);
        if (!isInput) {
          e.preventDefault();
          setIsCommandPaletteOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isCommandPaletteOpen]);

  const handleSelectTool = useCallback(
    (tool: ToolKey) => {
      const targetPath = TOOL_PATHS[tool] || '/grade-calculator';
      navigate(targetPath);
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [navigate]
  );

  return (
    <div className={`app-shell tool-theme-${activeTool}${isEmbed ? ' embed-mode' : ''} w-full max-w-full overflow-x-clip`}>
      {!isProgrammaticRoute && <SEOHead tool={activeTool} />}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{routeAnnouncement}</div>
      {!isEmbed && (
      <SiteHeader
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />
      )}

      <main id="main-content" ref={mainRef} tabIndex={-1} className={`main-wrap premium-surface tool-theme-${activeTool} w-full max-w-full overflow-x-clip px-4 sm:px-6 focus:outline-none`}>
        <div className="tool-transition-container w-full max-w-full">
          {isEmbed && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-3 m-0">
              Free grading tools by{' '}
              <a href="https://www.easygradetool.com/" target="_top" rel="noopener" className="font-semibold underline">
                Easy Grade Tool
              </a>
            </p>
          )}
          <Suspense fallback={<CalculatorSkeleton />}>
            <Routes>
              <Route path="/" element={<CompGrade setToast={setToastMessage} onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />} />
              <Route path="/grade-calculator" element={<CompGrade setToast={setToastMessage} onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />} />
              <Route path="/gpa-calculator" element={<CompGpa setToast={setToastMessage} />} />
              <Route path="/cgpa-to-percentage-calculator" element={<CompCgpa setToast={setToastMessage} />} />
              <Route path="/tip-calculator" element={<CompTip setToast={setToastMessage} />} />
              <Route path="/percentage-calculator" element={<CompPct setToast={setToastMessage} />} />
              <Route path="/loan-calculator" element={<CompLoan setToast={setToastMessage} />} />
              <Route path="/mortgage-calculator" element={<CompMortgage setToast={setToastMessage} />} />
              <Route path="/password-generator" element={<CompPassword setToast={setToastMessage} />} />
              <Route path="/privacy" element={<CompPrivacy />} />
              <Route path="/terms" element={<CompTerms />} />
              <Route path="/about" element={<CompAbout />} />

              {/* Flat, hub-and-spoke academic pages */}
              <Route path="/final-exam-grade-calculator" element={<CompProgrammatic presetSlug="final-exam-grade-calculator" setToast={setToastMessage} />} />
              <Route path="/test-grade-calculator" element={<CompToolPage slug="test-grade-calculator" />} />
              <Route path="/grade-curve-calculator" element={<CompToolPage slug="grade-curve-calculator" />} />
              <Route path="/letter-grade-calculator" element={<CompToolPage slug="letter-grade-calculator" />} />
              <Route path="/average-grade-calculator" element={<CompToolPage slug="average-grade-calculator" />} />
              <Route path="/weighted-gpa-calculator" element={<CompToolPage slug="weighted-gpa-calculator" />} />
              <Route path="/semester-gpa-calculator" element={<CompToolPage slug="semester-gpa-calculator" />} />
              <Route path="/cumulative-gpa-calculator" element={<CompToolPage slug="cumulative-gpa-calculator" />} />
              <Route path="/for-schools" element={<CompToolPage slug="for-schools" />} />
              <Route path="/blog" element={<CompToolPage slug="blog" />} />
              <Route path="/blog/how-to-grade-30-tests-in-15-minutes" element={<CompToolPage slug="blog/how-to-grade-30-tests-in-15-minutes" />} />
              <Route path="/blog/when-to-curve-grades" element={<CompToolPage slug="blog/when-to-curve-grades" />} />
              <Route path="/blog/grading-systems-explained" element={<CompToolPage slug="blog/grading-systems-explained" />} />
              <Route path="/blog/high-school-vs-college-gpa" element={<CompToolPage slug="blog/high-school-vs-college-gpa" />} />
              <Route path="/gpa-to-letter-grade" element={<CompToolPage slug="gpa-to-letter-grade" />} />
              <Route path="/letter-grade-to-gpa" element={<CompToolPage slug="letter-grade-to-gpa" />} />
              <Route path="/high-school-gpa-calculator" element={<CompToolPage slug="high-school-gpa-calculator" />} />
              <Route path="/college-gpa-calculator" element={<CompToolPage slug="college-gpa-calculator" />} />
              <Route path="/final-grade-planner" element={<CompToolPage slug="final-grade-planner" />} />
              <Route path="/cgpa-to-percentage/:uni" element={<CgpaUniversityRoute ToolPage={CompToolPage} />} />
              <Route path="/weighted-vs-unweighted-gpa" element={<CompToolPage slug="weighted-vs-unweighted-gpa" />} />
              <Route path="/how-many-questions-can-i-miss" element={<CompToolPage slug="how-many-questions-can-i-miss" />} />
              <Route path="/grading-scale" element={<CompToolPage slug="grading-scale" />} />
              <Route path="/grading-scale/:size" element={<GradingScaleRoute ToolPage={CompToolPage} />} />

              {/* Legacy and alias URLs. Generated from the SAME table as the build-time redirect stubs. */}
              {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
                <Route key={from} path={from} element={<Navigate to={to} replace />} />
              ))}
              <Route path="/easy-grade-calculator/:slug" element={<Navigate to="/grade-calculator/" replace />} />
              <Route path="/calculator/:slug" element={<Navigate to="/grade-calculator/" replace />} />

              {/* Fallback for unknown routes: render true 404 page, never home shell */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </main>
      {!isEmbed && <UpdatePrompt />}

      {!isEmbed && (
      <Footer
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        setToast={setToastMessage}
      />
      )}

      {isCommandPaletteOpen && (
        <Suspense fallback={null}>
          <LazyPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            activeTool={activeTool}
            onSelectTool={handleSelectTool}
            setToast={setToastMessage}
          />
        </Suspense>
      )}

      <Toast message={toastMessage} />
    </div>
  );
}

/**
 * Resolves the client application router basename dynamically,
 * ensuring seamless routing both on root domains and GitHub Pages subpaths.
 */
export function getClientBasename(): string {
  if (typeof window === 'undefined') return '';
  const viteBase = typeof import.meta !== 'undefined' && import.meta?.env?.BASE_URL;
  if (viteBase && viteBase !== '/' && viteBase !== './') {
    return viteBase.replace(/\/+$/, '');
  }
  // Auto-detect GitHub Pages repository subpath: e.g. /Easy-Grade-Tool
  if (window.location.hostname.endsWith('github.io')) {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length > 0 && !parts[0].includes('.')) {
      return `/${parts[0]}`;
    }
  }
  return '';
}

export interface AppProps {
  initialUrl?: string;
  syncComponents?: AppSyncComponents;
}

export default function App({ initialUrl, syncComponents }: AppProps) {
  const isServer = typeof window === 'undefined' || !!initialUrl;
  const basename = getClientBasename();

  const RouterWrapper = isServer
    ? ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter initialEntries={[initialUrl || '/']}>{children}</MemoryRouter>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter basename={basename}>{children}</BrowserRouter>
      );

  return (
    <HelmetProvider>
      <RouterWrapper>
        <ThemeProvider>
          <AppMain syncComponents={syncComponents} />
        </ThemeProvider>
      </RouterWrapper>
    </HelmetProvider>
  );
}
