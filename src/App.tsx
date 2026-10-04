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
import { HelmetProvider } from './utils/helmet';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { TOOLS_LIST, TOOL_PATHS, getToolKeyFromPath } from './data/constants';
import { ToolKey } from './types';
import { GradeCalculator } from './components/GradeCalculator';
import { GpaCalculator } from './components/GpaCalculator';
import { CgpaToPercentage } from './components/CgpaToPercentage';
import { TipCalculator } from './components/TipCalculator';
import { PercentageCalculator } from './components/PercentageCalculator';
import { LoanCalculator } from './components/LoanCalculator';
import { MortgageCalculator } from './components/MortgageCalculator';
import { PasswordGenerator } from './components/PasswordGenerator';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { AboutMethodology } from './components/AboutMethodology';
import { ProgrammaticCalculatorView } from './components/ProgrammaticCalculatorView';
import { CommandPalette } from './components/CommandPalette';
import { NotFound } from './components/NotFound';
import { Footer } from './components/Footer';
import { SEOHead } from './components/SEOHead';
import { preloadAllTools } from './utils/toolPreloader';

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

  // Component resolution: prioritize sync components for SSR/prerender, with direct component fallbacks
  const CompGrade = syncComponents?.GradeCalculator || GradeCalculator;
  const CompGpa = syncComponents?.GpaCalculator || GpaCalculator;
  const CompCgpa = syncComponents?.CgpaToPercentage || CgpaToPercentage;
  const CompTip = syncComponents?.TipCalculator || TipCalculator;
  const CompPct = syncComponents?.PercentageCalculator || PercentageCalculator;
  const CompLoan = syncComponents?.LoanCalculator || LoanCalculator;
  const CompMortgage = syncComponents?.MortgageCalculator || MortgageCalculator;
  const CompPassword = syncComponents?.PasswordGenerator || PasswordGenerator;
  const CompPrivacy = syncComponents?.PrivacyPolicy || PrivacyPolicy;
  const CompTerms = syncComponents?.TermsOfService || TermsOfService;
  const CompAbout = syncComponents?.AboutMethodology || AboutMethodology;
  const CompProgrammatic = syncComponents?.ProgrammaticCalculatorView || ProgrammaticCalculatorView;

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

  // Automatically scroll to top whenever route changes so footer and nav clicks immediately show the target view
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
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
      setActiveTool(tool);
      const targetPath = TOOL_PATHS[tool] || '/grade-calculator';
      navigate(targetPath);
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [navigate]
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
