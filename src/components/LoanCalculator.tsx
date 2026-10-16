import React, { useState, useMemo } from 'react';
import { Link } from './SlashLink';
import { ArrowDown, Calendar, Download, Printer } from 'lucide-react';
import { ToolHeading } from './ToolHeading';
import { SEO } from './SEO';
import { formatCurrency, parseNumber } from '../utils/formatters';
import { AmbientAura } from './AmbientAura';
import { SEO_ROUTES } from '../data/seoConfig';
import { GUIDE_IMAGES } from '../data/guideImages';
import { SemanticGuideImage } from './SemanticGuideImage';
import { FAQ } from './FAQ';
import { ContentSection } from './GuideShell';
import { ScrollableTableContainer } from './ScrollableTableContainer';

interface PaymentResultCardProps {
  principal: number;
  rate: number;
  years: number;
  title?: string;
  setToast?: (msg: string) => void;
}

export interface AmortizationRow {
  year: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export function computeAmortizationSchedule(principal: number, rate: number, years: number): AmortizationRow[] {
  const schedule: AmortizationRow[] = [];
  const safeYears = Math.min(40, Math.max(1, years));
  const months = safeYears * 12;
  const monthlyRate = rate / 100 / 12;
  const monthlyPayment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  let balance = principal;

  for (let y = 1; y <= safeYears; y++) {
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (let m = 1; m <= 12; m++) {
      if (balance <= 0) break;
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = Math.min(balance, monthlyPayment - interestForMonth);
      yearInterest += interestForMonth;
      yearPrincipal += principalForMonth;
      balance = Math.max(0, balance - principalForMonth);
    }

    schedule.push({
      year: y,
      principalPaid: yearPrincipal,
      interestPaid: yearInterest,
      remainingBalance: balance,
    });

    if (balance <= 0) break;
  }

  return schedule;
}

export const AmortizationScheduleTable: React.FC<{
  principal: number;
  rate: number;
  years: number;
}> = ({ principal, rate, years }) => {
  const schedule = useMemo(
    () => computeAmortizationSchedule(principal, rate, years),
    [principal, rate, years]
  );

  return (
    <section
      id="amortization-schedule"
      className="w-full mt-10 scroll-mt-24 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-50/95 to-blue-50/90 backdrop-blur-xl dark:from-slate-900/95 dark:to-slate-800/90 border border-white/80 dark:border-white/10 shadow-sm"
      aria-labelledby="amortization-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase block mb-1">
            Amortization
          </span>
          <h2
            id="amortization-heading"
            className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 m-0"
          >
            <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-300" aria-hidden="true" />
            <span>Annual Amortization Schedule</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-sm mt-1 mb-0">
            Year-by-year principal vs. interest payoff trajectory over {years} {years === 1 ? 'year' : 'years'}.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 self-start sm:self-auto shadow-xs">
          {schedule.length} {schedule.length === 1 ? 'Year' : 'Years'} Total
        </span>
      </div>

      <ScrollableTableContainer
        className="mt-4"
        ariaLabel="Annual Amortization Schedule table"
      >
        <table className="w-full min-w-full sm:min-w-max text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3 sticky left-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xs min-w-[80px]">
                Year
              </th>
              <th className="py-3 px-3 whitespace-nowrap">Principal Paid</th>
              <th className="py-3 px-3 whitespace-nowrap">Interest Paid</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">Ending Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-600 dark:text-slate-300">
            {schedule.map((row) => (
              <tr key={row.year} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white sticky left-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs shadow-[1px_0_0_0_rgba(226,232,240,0.8)] dark:shadow-[1px_0_0_0_rgba(51,65,85,0.8)]">
                  Year {row.year}
                </td>
                <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">{formatCurrency(row.principalPaid)}</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatCurrency(row.interestPaid)}</td>
                <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">{formatCurrency(row.remainingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTableContainer>
    </section>
  );
};

export const PaymentResultCard: React.FC<PaymentResultCardProps> = ({
  principal,
  rate,
  years,
  title = 'Loan',
  setToast,
}) => {
  const { totalMonthly, totalInterest, totalCost, principalShare, interestShare } = useMemo(() => {
    const months = Math.max(1, years * 12);
    const monthlyRate = rate / 100 / 12;

    const monthlyPrincipalAndInterest =
      monthlyRate === 0
        ? principal / months
        : (principal *
            monthlyRate *
            Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

    const paid = monthlyPrincipalAndInterest * months;
    const interest = Math.max(0, paid - principal);
    const pShare = paid > 0 ? (principal / paid) * 100 : 100;
    const iShare = paid > 0 ? (interest / paid) * 100 : 0;

    return {
      totalMonthly: monthlyPrincipalAndInterest,
      totalInterest: interest,
      totalCost: paid,
      principalShare: Math.min(100, Math.max(0, pShare)),
      interestShare: Math.min(100, Math.max(0, iShare)),
    };
  }, [principal, rate, years]);

  return (
    <section
      aria-label="Payment Calculation Results"
      className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between"
      aria-live="polite"
    >
      <div>
        <div className="bg-[#DBEAFE] dark:bg-teal-950/60 border border-[#BFDBFE] dark:border-teal-800/60 rounded-[28px] p-5 shadow-sm">
          <span className="text-xs font-semibold tracking-widest text-teal-800 dark:text-teal-300 uppercase block">
            Monthly Payment
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tracking-tight mt-2" aria-live="polite">
            {formatCurrency(totalMonthly)}
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-sm mt-1 m-0">
            Fixed monthly payment over {years} {years === 1 ? 'year' : 'years'}.
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-2 m-0 leading-tight">
            * Estimates only, not financial advice. Actual payment terms, interest rates, and loan fees vary by lender.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800">
          <div className="bg-[#FFE8C2] dark:bg-amber-950/55 rounded-[24px] p-4 border border-black/5 dark:border-amber-800/50 shadow-xs">
            <strong className="block text-xl font-bold text-slate-800 dark:text-white">{formatCurrency(totalCost)}</strong>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total cost</span>
          </div>
          <div className="bg-[#D6E1FF] dark:bg-indigo-950/55 rounded-[24px] p-4 border border-black/5 dark:border-indigo-800/50 shadow-xs">
            <strong className="block text-xl font-bold text-slate-800 dark:text-white">{formatCurrency(totalInterest)}</strong>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total interest</span>
          </div>
        </div>

        {/* Horizontal gradient progress bar visualizing percentage split between Principal and Interest */}
        <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold font-mono">
            <span className="text-slate-800 dark:text-slate-200">Principal vs Interest</span>
            <span className="text-slate-600 dark:text-slate-300">
              {principalShare.toFixed(1)}% / {interestShare.toFixed(1)}%
            </span>
          </div>

          {/* Horizontal Progress Bar */}
          <div
            className="h-3.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner border border-slate-200/60 dark:border-slate-700/60"
            role="progressbar"
            aria-valuenow={Math.round(principalShare)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="bg-gradient-to-r from-teal-500 to-teal-500 h-full transition-all duration-300"
              style={{ width: `${principalShare}%` }}
              title={`Principal: ${principalShare.toFixed(1)}%`}
            />
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
              style={{ width: `${interestShare}%` }}
              title={`Interest: ${interestShare.toFixed(1)}%`}
            />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs font-mono pt-1 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block flex-shrink-0" aria-hidden="true" />
              <span className="text-slate-800 dark:text-slate-200 font-medium">Principal: <strong>{formatCurrency(principal)}</strong></span>
              <span className="text-slate-600 dark:text-slate-300">({principalShare.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block flex-shrink-0" aria-hidden="true" />
              <span className="text-slate-800 dark:text-slate-200 font-medium">Interest: <strong>{formatCurrency(totalInterest)}</strong></span>
              <span className="text-slate-600 dark:text-slate-300">({interestShare.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* Skip to Schedule Anchor Link & PDF Export / Print */}
        <div className="pt-4 mt-4 border-t border-slate-100/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <a
              href="#amortization-schedule"
              onClick={(e) => {
                const el = document.getElementById('amortization-schedule');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors group cursor-pointer"
            >
              <span>Skip to Amortization Schedule</span>
              <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
            </a>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {years} {years === 1 ? 'Year' : 'Years'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              type="button"
              aria-label={`Export ${title.toLowerCase()} calculation report as PDF`}
              onClick={async () => {
                try {
                  setToast?.(`Generating ${title} PDF report...`);
                  const { exportLoanReportPdf } = await import('../utils/pdfExport');
                  await exportLoanReportPdf({
                    title,
                    principal,
                    rate,
                    years,
                    monthlyPayment: totalMonthly,
                    totalInterest,
                    totalPaid: totalCost,
                  });
                  setToast?.(`${title} report PDF downloaded!`);
                } catch {
                  setToast?.(`Could not generate ${title} PDF.`);
                }
              }}
              className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold shadow-md text-xs transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Export PDF</span>
            </button>
            <button
              type="button"
              aria-label={`Print ${title.toLowerCase()} summary`}
              onClick={() => {
                try {
                  window.print();
                } catch {
                  setToast?.('Use Export PDF to save a printable report.');
                }
              }}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/60 font-semibold shadow-sm text-xs transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

interface LoanCalculatorProps {
  setToast?: (msg: string) => void;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({ setToast }) => {
  // Exactly three fields: Amount ($), Interest rate (%/yr), and Term (years)
  const [amount, setAmount] = useState<string>('25000');
  const [interestRate, setInterestRate] = useState<string>('7.5');
  const [termYears, setTermYears] = useState<string>('5');

  const principal = Math.max(0, parseNumber(amount));
  const rate = Math.max(0, parseNumber(interestRate));
  const years = Math.max(1, parseNumber(termYears, 1));

  return (
    <>
      <SEO
        title={SEO_ROUTES.loan.title}
        description={SEO_ROUTES.loan.description}
        canonicalUrl={SEO_ROUTES.loan.canonicalUrl}
        ogImage={SEO_ROUTES.loan.ogImagePlaceholder}
        keywords={SEO_ROUTES.loan.keywords}
        applicationCategory={SEO_ROUTES.loan.applicationCategory}
        featureList={SEO_ROUTES.loan.featureList}
      />
      <ToolHeading
        badge="Loan Calculator"
        title="Loan Calculator — Monthly Payment, Interest & Payoff for Car & Personal Loans"
        description="Use this free online loan calculator to find the monthly payment, total interest and amortization schedule for a car, auto, personal, boat, RV or business loan. Enter the amount, APR and term, then compare shorter terms to see how to pay it off early."
      />

      <div className="relative tool-layout font-sans" data-print-area data-print-title="Loan Payment Summary">
        <AmbientAura />

        {/* Exactly three inputs */}
        <section
          aria-label="Loan Configuration"
          className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col gap-6"
        >
          <div className="pb-5 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase block mb-1">
              Financing
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight m-0">Loan Details</h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base mt-1 m-0">Enter your loan terms.</p>
          </div>

          <div className="flex flex-col gap-5">
            {/* 1. Amount ($) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="loan-amount" className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Amount ($)
              </label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 transition-colors select-none bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 px-2 py-0.5 rounded-full pointer-events-none">
                  $
                </span>
                <input
                  id="loan-amount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="100"
                  className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-lg text-center placeholder:text-slate-400"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="25000"
                />
              </div>
            </div>

            {/* 2. Interest rate (%/yr) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="loan-rate" className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Interest rate (%/yr)
              </label>
              <div className="relative group">
                <input
                  id="loan-rate"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-lg text-center placeholder:text-slate-400"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="7.5"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 transition-colors select-none bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 px-2 py-0.5 rounded-full pointer-events-none">
                  %
                </span>
              </div>
            </div>

            {/* 3. Term (years) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="loan-term" className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Term (years)
              </label>
              <input
                id="loan-term"
                type="number"
                inputMode="numeric"
                min="1"
                max="50"
                step="1"
                className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-lg text-center placeholder:text-slate-400"
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
                placeholder="5"
              />
            </div>
          </div>
        </section>

        {/* Output */}
        <PaymentResultCard
          principal={principal}
          rate={rate}
          years={years}
          title="Loan"
          setToast={setToast}
        />
      </div>

      <AmortizationScheduleTable
        principal={principal}
        rate={rate}
        years={years}
      />

      {/* Optimized Educational & SEO Content for Loan Calculator */}
      <ContentSection labelledBy="loan-guide-title">
          <h2
            id="loan-guide-title"
            className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100 tracking-tight"
          >
            Loan Calculator Guide: Monthly Payment, APR &amp; Amortization Schedule
          </h2>

          <div className="my-6">
            <SemanticGuideImage
              toolKey="loan"
              alt="A calculator on a desk next to papers labeled loan details, used to work out a car or personal loan payment."
            />
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            An online loan calculator is a practical financial tool that helps borrowers make informed decisions about car loans, personal loans, student loans, boat and motorcycle financing, and small business loans. <strong className="font-semibold text-slate-900 dark:text-white">Understanding your potential monthly payments and total interest costs is crucial for effective financial planning before signing a loan agreement.</strong> If you are specifically comparing 15-year or 30-year home financing, visit our dedicated <Link to="/mortgage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Mortgage Calculator</Link>, or use our <Link to="/percentage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Percentage Calculator</Link> to evaluate APR changes and down-payment ratios.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Understanding the Loan Payment Calculator
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            What is a Loan Payment Calculator?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A loan payment calculator is an online financial utility designed to help borrowers estimate their fixed monthly loan payments and total interest over the life of a loan. By inputting three core variables—the loan principal amount, annual interest rate (APR), and loan term in years—the calculator immediately computes your monthly obligation and generates a complete year-by-year amortization schedule. In some countries the same fixed monthly payment is called an EMI (equated monthly installment); the math is identical, so the calculator works for any currency even though the results display a dollar sign.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How Does a Loan Calculator Work?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The calculator applies the standard fixed-rate amortization formula: <code className="font-mono text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">M = P × [r(1 + r)^n] ÷ [(1 + r)^n − 1]</code>, where <code className="font-mono text-xs">P</code> is the principal balance, <code className="font-mono text-xs">r</code> is the monthly interest rate (annual APR divided by 12), and <code className="font-mono text-xs">n</code> is the total number of monthly payments (years × 12). It then tracks how each monthly payment splits between interest charges and principal reduction from year one through payoff.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Benefits of Using a Loan Payment Calculator
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Using a loan calculator before borrowing offers clear advantages. <strong className="font-semibold text-slate-900 dark:text-white">It allows you to estimate your monthly payment and compare total interest costs across different loan terms and APR offers.</strong> Whether you are evaluating an auto loan, a college student loan, or debt consolidation, modeling different repayment horizons helps you avoid overextending your monthly budget.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Types of Loans Covered
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Personal &amp; Consolidation Loans
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Unsecured personal loans typically carry fixed terms between 2 and 7 years. By entering the principal amount, APR, and term into our loan calculator, <strong className="font-semibold text-slate-900 dark:text-white">borrowers gain a transparent breakdown of their monthly principal and interest obligations and the exact total cost of borrowing</strong> before comparing offers from banks or credit unions.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Auto Loans
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            When financing a new or used vehicle, enter the net amount financed (vehicle price minus down payment and trade-in value) along with your lender&apos;s interest rate and term (commonly 3 to 6 years). <strong className="font-semibold text-slate-900 dark:text-white">The loan calculator shows how choosing a 36-month or 48-month term versus a 72-month term reduces total interest paid.</strong>
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Student Loans
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Navigating student loan repayment is much easier when you can visualize your 10-year standard repayment plan alongside shorter or extended horizons. <strong className="font-semibold text-slate-900 dark:text-white">Students and graduates can enter their total loan balance and interest rate to forecast monthly payments and plan their post-graduation budget alongside our academic <Link to="/gpa-calculator" className="text-teal-700 dark:text-teal-400 underline hover:text-teal-600">GPA Calculator</Link>.</strong>
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            How to Use This Calculator
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Step-by-Step Guide to Estimate Your Monthly Payments
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Using our loan payment calculator to estimate your monthly obligation is straightforward. <strong className="font-semibold text-slate-900 dark:text-white">Enter your loan amount, interest rate, and repayment term above to view your monthly payment, principal-to-interest ratio, and annual amortization table in real time.</strong> You can also export or print a clean PDF loan report for your records.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Entering Loan Amount and Term
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Start by entering the net principal balance you plan to borrow, then select or type the repayment duration in years. The calculator immediately updates both your monthly payment summary card and the year-by-year amortization schedule below it.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Understanding Interest Rates
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The interest rate (APR) is a critical factor in determining both your monthly payment and cumulative finance charges. <strong className="font-semibold text-slate-900 dark:text-white">Even a 1% reduction in interest rate can save hundreds or thousands of dollars over a multi-year repayment term.</strong> The APR quoted on a loan offer also includes lender fees, so entering the APR gives the most realistic estimate of what the loan will cost you.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Estimating Your Monthly Loan Payments
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Comparing Personal Loans vs. Home Mortgages
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            While personal, student, and auto loans typically span 1 to 10 years, home loans usually amortize over 15 to 30 years. <strong className="font-semibold text-slate-900 dark:text-white">Understanding the principal and interest breakdown within each payment is crucial for long-term financial planning.</strong> For home purchases, you can also compare long-term scenarios in our <Link to="/mortgage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Mortgage Calculator</Link>.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Estimating Monthly Auto &amp; Equipment Payments
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            When financing a vehicle or equipment purchase, testing multiple term lengths side by side reveals the trade-off between monthly cash flow and total interest cost. <strong className="font-semibold text-slate-900 dark:text-white">You can quickly determine your estimated monthly payment and see exactly how much principal remains at the end of each year.</strong>
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Factors Affecting Loan Payments
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Three primary variables govern your fixed loan payment: the principal borrowed, the annual interest rate, and the repayment term. <strong className="font-semibold text-slate-900 dark:text-white">A longer repayment period lowers your monthly payment but increases the total interest paid over the life of the loan.</strong>
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Loan Repayment Strategies
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Amortizing Your Loan Payments
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Amortization is the process of paying off a debt with regular equal installments that cover both accrued interest and principal reduction. In the early years of an amortized loan, a larger share of each payment goes toward interest; as the principal balance declines, <strong className="font-semibold text-slate-900 dark:text-white">an increasing share of every monthly payment goes directly toward reducing your remaining loan balance.</strong>
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Choosing the Right Loan Term
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Selecting the right loan term balances monthly affordability against total borrowing cost. <strong className="font-semibold text-slate-900 dark:text-white">A shorter loan term results in higher monthly payments but substantially less total interest paid overall</strong> because the principal compounds for fewer months.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Managing Your Loan Repayment Effectively
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Strategic loan management—such as making extra principal payments, avoiding prepayment penalties, and refinancing when interest rates drop—can shorten your payoff timeline significantly. <strong className="font-semibold text-slate-900 dark:text-white">Use the amortization schedule above to track how quickly your principal balance decreases each year and plan ahead with confidence.</strong>
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Car Loan Calculator: Auto, Boat, Motorcycle, RV, Land &amp; Business Loans
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How Do I Calculate a Car Loan Payment?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Subtract your down payment and trade-in value from the vehicle price, then enter the remaining balance as the loan amount. <strong className="font-semibold text-slate-900 dark:text-white">For example, a $30,000 car loan at 7% APR costs about $511.47 per month over 6 years and about $452.78 per month over 7 years, but the longer term adds roughly $1,200 in total interest.</strong> Comparing terms side by side is the quickest way to see what a lower payment really costs. The same steps work for a new car, a used car or a vehicle you are refinancing: for a refinance, enter the current payoff balance, the new lender&apos;s rate and the new term.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Boat, Motorcycle, RV, Truck &amp; Equipment Loans
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Any fixed-rate installment loan follows the same amortization math, so this loan calculator also works for boats, motorcycles, recreational vehicles, trucks, and equipment. Enter the amount you finance, the lender&apos;s rate, and the term in years to see the monthly payment and total interest before you visit a dealer.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Land &amp; Small Business Loans
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Business and land loans often carry longer terms and extra fees, but the monthly principal-and-interest estimate still comes from the same formula. <strong className="font-semibold text-slate-900 dark:text-white">Use the result as a planning figure, then confirm fees, balloon terms, and government-backed program rules (such as SBA loans) directly with your lender.</strong>
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Loan Term in Months: 36, 48, 60, 72 &amp; 84 Months
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            This loan calculator takes the term in years, so convert months by dividing by 12:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <li><strong className="font-semibold text-slate-900 dark:text-white">36 months</strong> = 3 years</li>
            <li><strong className="font-semibold text-slate-900 dark:text-white">48 months</strong> = 4 years</li>
            <li><strong className="font-semibold text-slate-900 dark:text-white">60 months</strong> = 5 years</li>
            <li><strong className="font-semibold text-slate-900 dark:text-white">72 months</strong> = 6 years</li>
            <li><strong className="font-semibold text-slate-900 dark:text-white">84 months</strong> = 7 years</li>
          </ul>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">Worked example:</strong> a $25,000 loan at 7.5% APR costs about $777.66 per month over 3 years ($2,995.60 total interest), $500.95 per month over 5 years ($5,056.92 total interest), and $383.46 per month over 7 years ($7,210.38 total interest). A longer term lowers the monthly payment but raises the total cost of the loan.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Down Payments, Extra Payments &amp; Paying Off a Loan Early
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How Does a Down Payment Change My Loan Payment?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A down payment reduces the amount you borrow. Subtract it from the purchase price and enter the remainder as the loan amount to see the lower monthly payment and the interest you save.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How Do Extra Payments Pay Off a Loan Early?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Extra payments are applied to principal, which reduces the interest charged in every later month and shortens the loan. <strong className="font-semibold text-slate-900 dark:text-white">This calculator shows the standard fixed-payment schedule, so to preview paying a loan off early, enter a shorter term and compare the monthly payment and total interest against your original plan.</strong> Check with your lender that there is no prepayment penalty first.
          </p>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">Worked example:</strong> on a $25,000 loan at 7.5% APR over 5 years, the regular payment is about $500.95 and total interest is $5,056.92. Adding $100 to every payment pays the loan off in about 49 months instead of 60 and cuts total interest to roughly $4,043, saving about $1,014 and 11 months. This calculator shows the standard schedule, so to preview a similar payoff, enter a 4-year term: the payment rises to about $604.47 and total interest falls to about $4,015, close to the extra-payment result.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Do Biweekly or Weekly Payments Pay a Loan Off Faster?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            They can. Paying half of the monthly payment every two weeks means 26 half-payments a year, which equals 13 full monthly payments instead of 12. If your lender applies each payment as soon as it arrives, that extra payment goes to principal and trims interest and months from the loan. <strong className="font-semibold text-slate-900 dark:text-white">Confirm with your lender how biweekly payments are applied</strong>, because some only credit them once a month. This calculator shows the standard monthly schedule, so use it as the baseline to compare against.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Which Loan Should I Pay Off First?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Make the minimum payment on every loan, then send extra money to the one with the <strong className="font-semibold text-slate-900 dark:text-white">highest interest rate</strong> (the avalanche method) to minimize total interest. Some people prefer to clear the smallest balance first (the snowball method) for motivation. Run each loan through the calculator to compare monthly payments and total interest, and check for prepayment penalties first.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Balloon Payments and Interest-Only Loans
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Balloon loans and interest-only periods use a different schedule, with smaller early payments and a large final payment. This calculator assumes equal payments that fully repay the loan by the end of the term, so ask your lender for balloon or interest-only terms. To compare home financing, use the <Link to="/mortgage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Mortgage Calculator</Link>.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Simple Interest vs. Amortized Loan Interest
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The simple interest formula is <code className="font-mono text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">I = P × r × t</code>: principal times annual rate times years. Applied to the original balance for the whole term, a $25,000 loan at 7.5% for 5 years would cost $9,375 in interest. Real installment loans do not work that way. With an amortizing loan, interest is charged only on the balance you still owe, which falls with every payment, so the same loan costs $5,056.92. <strong className="font-semibold text-slate-900 dark:text-white">This calculator uses the amortized method</strong>, which is how car loans, personal loans and most other fixed-rate installment loans are priced. Auto lenders often call their loans simple interest because interest accrues daily on the unpaid balance; the result is still an amortized schedule.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Home Equity, VA, FHA, USDA, SBA and Mortgage Loans
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Can I Use It for a Home Equity Loan or Mortgage?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            For a fixed-rate loan with a lump-sum payout, such as a home equity loan, the principal-and-interest payment uses the same formula, so you can enter the amount, rate and term here. A HELOC is different: it is a revolving line of credit, usually with a variable rate and an interest-only draw period, so one fixed payment will not describe it. For a home purchase, use the <Link to="/mortgage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Mortgage Calculator</Link> to see a long-term payment estimate for a 15-year or 30-year home loan.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            What About VA, FHA, USDA and SBA Loans?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Government-backed programs set their own fees and rules, such as funding fees, mortgage insurance or guarantee fees, so the final cost can be higher than the payment shown here. Enter the loan amount including any financed fee and the quoted APR to get a solid principal-and-interest baseline, then confirm the full terms with your lender.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            What Is Loan-to-Value (LTV)?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Loan-to-value is the loan amount divided by the value of the asset that secures it. A $20,000 car loan on a $25,000 vehicle is an 80% LTV. Lenders use it to judge risk, and a larger down payment lowers it. A lower LTV can help you qualify for a better rate.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            How Much Loan Can I Afford?
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            There is no separate field for a target payment, but you can work backward in seconds. Decide the monthly payment that fits your budget, enter a loan amount, and raise or lower it until the monthly payment shown matches. <strong className="font-semibold text-slate-900 dark:text-white">Then change the term to see how a longer or shorter loan changes the amount you can borrow at the same payment.</strong> Keep in mind that your lender&apos;s approved amount also depends on your income, existing debts and credit.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Should I Refinance a Car or Personal Loan?
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Refinancing replaces your loan with a new one, ideally at a lower rate. Enter your current balance, the new APR and the new term, then compare the new monthly payment and total interest with what you would pay on your existing loan. <strong className="font-semibold text-slate-900 dark:text-white">Add any refinancing fees to the new loan amount</strong>, and make sure the interest you save is larger than those costs. Stretching the term can lower the payment while increasing the total interest, so compare both numbers.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            How Is Total Interest Calculated on a Loan?
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Each month&apos;s interest equals the remaining balance times the annual rate divided by 12. <strong className="font-semibold text-slate-900 dark:text-white">Total interest is the sum of all monthly payments minus the amount you borrowed</strong>, which the results card shows as Total interest next to Total cost. A lower APR, a shorter term, or a larger down payment all reduce it.
          </p>
        </ContentSection>

      <FAQ tool="loan" />
    </>
  );
};
