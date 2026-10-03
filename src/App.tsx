import React, { useState, useEffect, useCallback, Suspense, lazy, useTransition } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
  BrowserRouter,
  MemoryRouter,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { TOOLS_LIST, TOOL_PATHS, getToolKeyFromPath } from './data/constants';
import { ToolKey } from './types';
import { GradeCalculator } from './components/GradeCalculator';
import { NotFound } from './components/NotFound';
import { Footer } from './components/Footer';
import { SEOHead } from './components/SEOHead';

// Non-active calculator components are lazy-loaded to optimize initial page speed and defer scripts/DOM until navigation
const LazyGpaCalculator = lazy(() => import('./components/GpaCalculator').then(m => ({ default: m.GpaCalculator })));
const LazyCgpaToPercentage = lazy(() => import('./components/CgpaToPercentage').then(m => ({ default: m.CgpaToPercentage })));
const LazyTipCalculator = lazy(() => import('./components/TipCalculator').then(m => ({ default: m.TipCalculator })));
const LazyPercentageCalculator = lazy(() => import('./components/PercentageCalculator').then(m => ({ default: m.PercentageCalculator })));
const LazyLoanCalculator = lazy(() => import('./components/LoanCalculator').then(m => ({ default: m.LoanCalculator })));
const LazyMortgageCalculator = lazy(() => import('./components/MortgageCalculator').then(m => ({ default: m.MortgageCalculator })));
const LazyPasswordGenerator = lazy(() => import('./components/PasswordGenerator').then(m => ({ default: m.PasswordGenerator })));
const LazyPrivacyPolicy = lazy(() => import('./components/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const LazyTermsOfService = lazy(() => import('./components/TermsOfService').then(m => ({ default: m.TermsOfService })));
const LazyAboutMethodology = lazy(() => import('./components/AboutMethodology').then(m => ({ default: m.AboutMethodology })));
const LazyProgrammaticCalculatorView = lazy(() => import('./components/ProgrammaticCalculatorView').then(m => ({ default: m.ProgrammaticCalculatorView })));

// Modals and command palette are lazy-loaded to keep initial execution lightweight
const CommandPalette = lazy(() => import('./components/CommandPalette').then(m => ({ default: m.CommandPalette })));

// Zero CLS loading placeholder for lazy routes
const CalculatorSkeleton: React.FC = () => (
  <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-pulse" aria-hidden="true">
    <div className="h-8 w-60 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-3" />
    <div className="h-4 w-96 max-w-full bg-slate-200/70 dark:bg-slate-800/70 rounded-lg mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-7 h-96 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl border border-slate-200/80 dark:border-slate-800/80" />
      <div className="md:col-span-5 h-96 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl border border-slate-200/80 dark:border-slate-800/80" />
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
}

function AppMain({ syncComponents }: { syncComponents?: AppSyncComponents }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Component resolution: prioritize sync components for SSR/prerender, otherwise defer non-active tools with lazy loading
  const CompGrade = syncComponents?.GradeCalculator || GradeCalculator;
  const CompGpa = syncComponents?.GpaCalculator || LazyGpaCalculator;
  const CompCgpa = syncComponents?.CgpaToPercentage || LazyCgpaToPercentage;
  const CompTip = syncComponents?.TipCalculator || LazyTipCalculator;
  const CompPct = syncComponents?.PercentageCalculator || LazyPercentageCalculator;
  const CompLoan = syncComponents?.LoanCalculator || LazyLoanCalculator;
  const CompMortgage = syncComponents?.MortgageCalculator || LazyMortgageCalculator;
  const CompPassword = syncComponents?.PasswordGenerator || LazyPasswordGenerator;
  const CompPrivacy = syncComponents?.PrivacyPolicy || LazyPrivacyPolicy;
  const CompTerms = syncComponents?.TermsOfService || LazyTermsOfService;
  const CompAbout = syncComponents?.AboutMethodology || LazyAboutMethodology;
  const CompProgrammatic = syncComponents?.ProgrammaticCalculatorView || LazyProgrammaticCalculatorView;

  // Derive active tool dynamically from URL pathname with immediate local state sync
  const pathTool = getToolKeyFromPath(location.pathname);
  const [activeTool, setActiveTool] = useState<ToolKey>(pathTool);

  useEffect(() => {
    setActiveTool(pathTool);
  }, [pathTool]);

  const isProgrammaticRoute =
    location.pathname.startsWith('/easy-grade-calculator/') ||
    location.pathname.startsWith('/calculator/') ||
    location.pathname.startsWith('/about') ||
    location.pathname.startsWith('/privacy') ||
    location.pathname.startsWith('/terms') ||
    location.pathname.startsWith('/methodology');

  // Restore deep link route from GitHub Pages SPA 404 redirect if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const redirectTarget = sessionStorage.getItem('spa_redirect_target');
      if (redirectTarget) {
        sessionStorage.removeItem('spa_redirect_target');
        const base = (typeof import.meta !== 'undefined' && import.meta?.env?.BASE_URL) || '/';
        let targetRoute = redirectTarget;
        if (base !== '/' && targetRoute.startsWith(base)) {
          targetRoute = targetRoute.slice(base.length - 1);
        }
        if (targetRoute && targetRoute !== location.pathname) {
          navigate(targetRoute, { replace: true });
        }
      }
    } catch (_) {}
  }, [navigate, location.pathname]);

  // Automatically scroll smoothly to top whenever route changes so footer and nav clicks immediately show the target view
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

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
      startTransition(() => {
        setActiveTool(tool);
        const targetPath = TOOL_PATHS[tool] || '/grade-calculator';
        navigate(targetPath);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate, startTransition]
  );

  return (
    <div className={`app-shell tool-theme-${activeTool} w-full max-w-full overflow-x-hidden`}>
      {!isProgrammaticRoute && <SEOHead tool={activeTool} />}
      <Navbar
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <main className={`main-wrap tool-theme-${activeTool} w-full max-w-full overflow-hidden px-4 sm:px-6`}>
        <div className="tool-transition-container w-full max-w-full">
          <Suspense fallback={<CalculatorSkeleton />}>
            <Routes>
              <Route path="/" element={<CompGrade setToast={setToastMessage} />} />
              <Route path="/grade-calculator" element={<CompGrade setToast={setToastMessage} />} />
              <Route path="/gpa-calculator" element={<CompGpa setToast={setToastMessage} />} />
              <Route path="/cgpa-to-percentage-calculator" element={<CompCgpa setToast={setToastMessage} />} />
              <Route path="/tip-calculator" element={<CompTip setToast={setToastMessage} />} />
              <Route path="/percentage-calculator" element={<CompPct setToast={setToastMessage} />} />
              <Route path="/loan-calculator" element={<CompLoan setToast={setToastMessage} />} />
              <Route path="/mortgage-calculator" element={<CompMortgage setToast={setToastMessage} />} />
              <Route path="/password-generator" element={<CompPassword setToast={setToastMessage} />} />
              <Route path="/privacy" element={<CompPrivacy />} />
              <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
              <Route path="/terms" element={<CompTerms />} />
              <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />
              <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />
              <Route path="/about" element={<CompAbout />} />
              <Route path="/methodology" element={<Navigate to="/about" replace />} />
              <Route path="/about-methodology" element={<Navigate to="/about" replace />} />

              {/* Programmatic Route Merges & 301 Redirects */}
              <Route
                path="/easy-grade-calculator/gpa"
                element={<Navigate to="/gpa-calculator" replace />}
              />
              <Route
                path="/easy-grade-calculator/semester-gpa-calculator"
                element={<Navigate to="/gpa-calculator" replace />}
              />
              <Route
                path="/easy-grade-calculator/weighted-grade-calculator"
                element={<Navigate to="/grade-calculator" replace />}
              />
              <Route
                path="/easy-grade-calculator/test-score"
                element={<Navigate to="/grade-calculator" replace />}
              />
              <Route
                path="/easy-grade-calculator/college-final-grade-calculator"
                element={<Navigate to="/easy-grade-calculator/final-exam-grade-calculator" replace />}
              />
              <Route
                path="/easy-grade-calculator/high-school-test-grader"
                element={<Navigate to="/easy-grade-calculator/ez-grader" replace />}
              />

              {/* Parameter-Driven Programmatic SEO Routes (Active: final-exam-grade-calculator & ez-grader) */}
              <Route
                path="/easy-grade-calculator/:slug"
                element={<CompProgrammatic setToast={setToastMessage} />}
              />
              <Route
                path="/easy-grade-calculator"
                element={<Navigate to="/grade-calculator" replace />}
              />
              <Route
                path="/calculator/:slug"
                element={<CompProgrammatic setToast={setToastMessage} />}
              />

              {/* Backwards-compatibility redirects */}
              <Route path="/gpa" element={<Navigate to="/gpa-calculator" replace />} />
              <Route path="/cgpa" element={<Navigate to="/cgpa-to-percentage-calculator" replace />} />
              <Route path="/cgpa-to-percentage" element={<Navigate to="/cgpa-to-percentage-calculator" replace />} />
              <Route path="/cgpa-calculator" element={<Navigate to="/cgpa-to-percentage-calculator" replace />} />
              <Route path="/tip" element={<Navigate to="/tip-calculator" replace />} />
              <Route path="/percentage" element={<Navigate to="/percentage-calculator" replace />} />
              <Route path="/loan" element={<Navigate to="/loan-calculator" replace />} />
              <Route path="/mortgage" element={<Navigate to="/mortgage-calculator" replace />} />
              <Route path="/password" element={<Navigate to="/password-generator" replace />} />
              <Route path="/final-grade" element={<Navigate to="/grade-calculator" replace />} />
              <Route path="/weighted-grade" element={<Navigate to="/grade-calculator" replace />} />

              {/* Fallback for unknown routes: render true 404 page, never home shell */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      <Footer
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        setToast={setToastMessage}
      />

      {isCommandPaletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette
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

export interface AppProps {
  initialUrl?: string;
  syncComponents?: AppSyncComponents;
}

export default function App({ initialUrl, syncComponents }: AppProps) {
  const isServer = typeof window === 'undefined' || !!initialUrl;

  const RouterWrapper = isServer
    ? ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter initialEntries={[initialUrl || '/']}>{children}</MemoryRouter>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter basename={(typeof import.meta !== 'undefined' && import.meta?.env?.BASE_URL) || '/'}>{children}</BrowserRouter>
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
