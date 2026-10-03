import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolHeading } from './ToolHeading';
import { SEO } from './SEO';
import { PaymentResultCard } from './LoanCalculator';
import { parseNumber } from '../utils/formatters';
import { AmbientAura } from './AmbientAura';
import { SEO_ROUTES } from '../data/seoConfig';
import { GUIDE_IMAGES } from '../data/guideImages';
import { SemanticGuideImage } from './SemanticGuideImage';
import { FAQ } from './FAQ';
import { ScrollableTableContainer } from './ScrollableTableContainer';

interface MortgageCalculatorProps {
  setToast?: (msg: string) => void;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ setToast }) => {
  // Exactly three fields: Amount ($), Interest rate (%/yr), and Term (years)
  const [amount, setAmount] = useState<string>('300000');
  const [interestRate, setInterestRate] = useState<string>('6.5');
  const [termYears, setTermYears] = useState<string>('30');

  const principal = Math.max(0, parseNumber(amount));
  const rate = Math.max(0, parseNumber(interestRate));
  const years = Math.max(1, parseNumber(termYears, 30));

  return (
    <>
      <SEO
        title={SEO_ROUTES.mortgage.title}
        description={SEO_ROUTES.mortgage.description}
        canonicalUrl={SEO_ROUTES.mortgage.canonicalUrl}
        ogImage={SEO_ROUTES.mortgage.ogImagePlaceholder}
        keywords={SEO_ROUTES.mortgage.keywords}
        applicationCategory={SEO_ROUTES.mortgage.applicationCategory}
        featureList={SEO_ROUTES.mortgage.featureList}
      />
      <ToolHeading
        badge="Mortgage Calculator"
        title="Mortgage Calculator & Monthly Payment Estimator"
        description="Use our free Mortgage Calculator to estimate your monthly home loan payment, principal and interest split, and total interest paid over a 15-year or 30-year mortgage term."
      />

      <div className="relative tool-layout font-sans">
        <AmbientAura />

        {/* Exactly three inputs */}
        <section
          aria-label="Mortgage Details"
          className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col gap-6"
        >
          <div className="pb-5 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase block mb-1">
              Real Estate
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight m-0">Mortgage Details</h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base mt-1 m-0">Fixed-rate mortgage amortization.</p>
          </div>

          <div className="flex flex-col gap-5">
            {/* 1. Amount ($) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="mortgage-amount" className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Amount ($)
              </label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 transition-colors select-none bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 px-2 py-0.5 rounded-full pointer-events-none">
                  $
                </span>
                <input
                  id="mortgage-amount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="1000"
                  className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-lg text-center placeholder:text-slate-400"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="300000"
                />
              </div>
            </div>

            {/* 2. Interest rate (%/yr) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="mortgage-rate" className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Interest rate (%/yr)
              </label>
              <div className="relative group">
                <input
                  id="mortgage-rate"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-lg text-center placeholder:text-slate-400"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="6.5"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 transition-colors select-none bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 px-2 py-0.5 rounded-full pointer-events-none">
                  %
                </span>
              </div>
            </div>

            {/* 3. Term (years) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="mortgage-term" className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Term (years)
              </label>
              <input
                id="mortgage-term"
                type="number"
                inputMode="numeric"
                min="1"
                max="50"
                step="1"
                className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-lg text-center placeholder:text-slate-400"
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>
        </section>

        {/* Output */}
        <div>
          <PaymentResultCard
            principal={principal}
            rate={rate}
            years={years}
            title="Mortgage"
            setToast={setToast}
          />
        </div>
      </div>

      {/* Optimized Educational & SEO Content for Mortgage Calculator */}
      <section className="seo-content w-full max-w-4xl mx-auto mt-12 mb-16 px-4" aria-labelledby="mortgage-guide-title">
        <article className="seo-article bg-gradient-to-r from-slate-50/80 to-blue-50/70 backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/70 border border-white/60 dark:border-white/10 shadow-sm rounded-3xl p-6 sm:p-10 font-sans">
          <h2
            id="mortgage-guide-title"
            className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100 tracking-tight"
          >
            Mortgage Loan Calculator &amp; Payment Calculator | Home Mortgage Bank
          </h2>

          <div className="my-6">
            <SemanticGuideImage
              toolKey="mortgage"
              alt="A hand enters numbers on a calculator next to a small model house."
            />
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Are you looking to buy a new home, or simply curious about understanding the dynamics of mortgage payments? A mortgage loan calculator is an invaluable tool to help you navigate the complexities of home financing. This guide walks through how a mortgage calculator works and how it can empower your financial decisions. Comparing shorter-term personal or auto financing, or checking down-payment percentages? Explore our <Link to="/loan-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Loan Calculator</Link> and <Link to="/percentage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Percentage Calculator</Link>.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-100 tracking-tight">
            Understanding the Mortgage Calculator
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-gray-200">
            What is a Mortgage Calculator?
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            A mortgage calculator is a financial tool designed to help prospective homeowners and current mortgage holders estimate their monthly mortgage payment. This powerful calculator can help you understand the long-term cost of your home loan and identify ways to improve your financial outlook.
          </p>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            It takes into account key information to provide an illustrative breakdown of the principal and interest components:
          </p>

          <ScrollableTableContainer className="my-6" ariaLabel="Mortgage Payment Key Factors">
            <table className="w-full min-w-full sm:min-w-max border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700">
                  <th className="bg-gray-50 dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700 p-3 font-semibold text-gray-900 dark:text-gray-100 sticky left-0 z-10 min-w-[130px]">Factor</th>
                  <th className="bg-gray-50 dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700 p-3 font-semibold text-gray-900 dark:text-gray-100">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300 font-medium sticky left-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs shadow-[1px_0_0_0_rgba(226,232,240,0.8)] dark:shadow-[1px_0_0_0_rgba(51,65,85,0.8)]">Loan Amount</td>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300">The total sum of money being borrowed.</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300 font-medium sticky left-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs shadow-[1px_0_0_0_rgba(226,232,240,0.8)] dark:shadow-[1px_0_0_0_rgba(51,65,85,0.8)]">Interest Rate</td>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300">The percentage charged on the borrowed amount.</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300 font-medium sticky left-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs shadow-[1px_0_0_0_rgba(226,232,240,0.8)] dark:shadow-[1px_0_0_0_rgba(51,65,85,0.8)]">Loan Term</td>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300">The duration over which the loan will be repaid.</td>
                </tr>
              </tbody>
            </table>
          </ScrollableTableContainer>

          <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-gray-200">
            How to Use a Mortgage Calculator
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            To use a mortgage calculator, you&apos;ll typically need to input key loan details. The calculator will then quickly determine your monthly mortgage payment based on your principal, interest rate, and term.
          </p>

          <ScrollableTableContainer className="my-6" ariaLabel="Required Information for Mortgage Calculator">
            <table className="w-full min-w-full sm:min-w-max border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700">
                  <th className="bg-gray-50 dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700 p-3 font-semibold text-gray-900 dark:text-gray-100 sticky left-0 z-10 min-w-[150px]">Required Information</th>
                  <th className="bg-gray-50 dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700 p-3 font-semibold text-gray-900 dark:text-gray-100">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300 font-medium sticky left-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs shadow-[1px_0_0_0_rgba(226,232,240,0.8)] dark:shadow-[1px_0_0_0_rgba(51,65,85,0.8)]">Total Loan Amount</td>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300">The total amount you intend to borrow for your home.</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300 font-medium sticky left-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs shadow-[1px_0_0_0_rgba(226,232,240,0.8)] dark:shadow-[1px_0_0_0_rgba(51,65,85,0.8)]">Interest Rate</td>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300">The low rate offered by your bank.</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300 font-medium sticky left-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs shadow-[1px_0_0_0_rgba(226,232,240,0.8)] dark:shadow-[1px_0_0_0_rgba(51,65,85,0.8)]">Loan Term</td>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300">The desired duration of the loan.</td>
                </tr>
              </tbody>
            </table>
          </ScrollableTableContainer>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Some advanced mortgage calculators may also allow you to include other costs like property taxes, homeowner&apos;s insurance, and PMI (Private Mortgage Insurance) to give you an even more accurate monthly payment estimate.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-gray-200">
            Benefits of Using a Mortgage Calculator
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Utilizing a mortgage calculator offers numerous financial benefits. It provides a clear picture of how different interest rates and loan terms impact your payment, allowing you to explore various mortgage options and make an informed investment decision. It also helps you understand the amortization schedule and how much interest you will pay over the life of the loan.
          </p>

          <ScrollableTableContainer className="my-6" ariaLabel="Mortgage Calculator Features and Benefits">
            <table className="w-full min-w-full sm:min-w-max border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700">
                  <th className="bg-gray-50 dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700 p-3 font-semibold text-gray-900 dark:text-gray-100 sticky left-0 z-10 min-w-[160px]">Feature base</th>
                  <th className="bg-gray-50 dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700 p-3 font-semibold text-gray-900 dark:text-gray-100">Benefit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300 font-medium sticky left-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs shadow-[1px_0_0_0_rgba(226,232,240,0.8)] dark:shadow-[1px_0_0_0_rgba(51,65,85,0.8)]">Estimate potential monthly mortgage payment based on your location and financial profile.</td>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300">Helps you budget effectively and determine how much home you can truly afford.</td>
                </tr>
                <tr>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300 font-medium sticky left-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs shadow-[1px_0_0_0_rgba(226,232,240,0.8)] dark:shadow-[1px_0_0_0_rgba(51,65,85,0.8)]">See impact of interest rates and loan terms</td>
                  <td className="border-b border-gray-100 dark:border-slate-800 p-3 text-gray-700 dark:text-gray-300">Allows you to explore various low mortgage options and make an informed investment decision.</td>
                </tr>
              </tbody>
            </table>
          </ScrollableTableContainer>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-100 tracking-tight">
            Exploring Mortgage Options
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-gray-200">
            Types of Mortgage Loans
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            When considering a mortgage, it&apos;s crucial to understand the various types of mortgage loans available, as each option has different implications for your monthly payment and overall financial commitment. Common types include <strong className="font-semibold text-gray-900 dark:text-gray-100">fixed-rate mortgages, where the interest rate remains constant for the life of the loan</strong>, offering predictable low monthly payments based on your financial situation. Adjustable-rate mortgages (ARMs), on the other hand, have interest rates that can fluctuate, potentially leading to higher or lower monthly payments over time. It is important to use a mortgage calculator to determine the differences.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-gray-200">
            Choosing the Right Mortgage Option
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Selecting the right mortgage option requires careful consideration of your personal financial situation, risk tolerance, and long-term goals to improve your overall investment. A mortgage calculator can be an invaluable tool during this low process, allowing you to <strong className="font-semibold text-gray-900 dark:text-gray-100">compare the illustrative monthly payment for different loan amounts, interest rates, and loan terms.</strong> Factors such as your credit score, current income, and future financial stability will all impact which mortgage you qualify for and which option is most suitable for your specific needs, helping you make an informed investment.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-gray-200">
            Local Mortgage Options and Lenders
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Beyond the general types of mortgages, it’s beneficial to explore local mortgage options and lenders. Local banks and credit unions often offer unique low home loan programs tailored to residents in their location, which might include specific grants or lower interest rates. <strong className="font-semibold text-gray-900 dark:text-gray-100">Using a mortgage calculator to compare offers from different local lenders can help you find the best deal</strong> for your financial situation and ensure you secure a competitive monthly payment. Gathering all the required low information for this calculator will enable you to make a sound decision regarding your home.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-100 tracking-tight">
            Calculating Your Mortgage Payments
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-gray-200">
            Factors Affecting Mortgage Payments
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Several crucial factors directly influence your mortgage payment, and understanding them is key to managing your financial obligations. The primary components include the <strong className="font-semibold text-gray-900 dark:text-gray-100">principal loan amount, the interest rate offered by the bank, and the loan term. Additionally, other costs like property taxes, homeowner’s insurance, and low private mortgage insurance (PMI) can significantly improve your monthly payment.</strong> A mortgage calculator can help you estimate how each of these factors impacts your overall monthly mortgage payment.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-gray-200">
            Using a Payment Calculator
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Utilizing a payment calculator is an essential step in understanding your potential mortgage costs and how to apply for the best rates. To use this mortgage calculator effectively, you&apos;ll input the specific low loan amount you intend to borrow, the prevailing interest rate, and your desired loan term to apply for the best options. The calculator then provides an illustrative low monthly payment, helping you budget for your home loan. This tool can also be personalized to include additional costs like property taxes and low insurance for a more comprehensive estimate.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-gray-200">
            Understanding Amortization Schedules
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            An amortization schedule provides a detailed breakdown of each monthly payment, showing <strong className="font-semibold text-gray-900 dark:text-gray-100">how much interest and how much principal you pay over the life of the loan.</strong> This schedule illustrates how your estimated principal balance decreases over time. Understanding your amortization schedule is vital for financial planning, as it demonstrates the long-term cost of your mortgage and helps you see the difference in interest paid between various mortgage options. A mortgage calculator can often generate this schedule for illustrative purposes.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-100 tracking-tight">
            Finding the Right Lender
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-gray-200">
            Local Lender vs. National Lender
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            When seeking a home loan, you&apos;ll encounter both local and national lenders, each with distinct advantages. Local lenders often provide personalized service and may have unique mortgage options tailored to the community, while national lenders typically offer a broader range of products and potentially more competitive interest rates due to their scale. <strong className="font-semibold text-gray-900 dark:text-gray-100">Using a payment calculator to compare loan offers from both types of lenders can help you determine the best fit for your financial situation and location</strong> and ensure you secure a favorable monthly mortgage payment.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-gray-200">
            Questions to Ask Your Lender
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Engaging with potential lenders requires asking pertinent questions to ensure you fully understand your mortgage options. Inquire about the <strong className="font-semibold text-gray-900 dark:text-gray-100">interest rate, loan term, location, and any associated lender fees or closing costs.</strong> Ask about the potential for a lower monthly payment if you make a larger down payment, and understand if private mortgage insurance (PMI) is required. Gather all the information required for this calculator to personalize your comparison and determine the best home loan for your needs.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-gray-200">
            Comparing Loan Offers
          </h3>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Once you have received multiple loan offers, it&apos;s critical to meticulously compare them to identify the most advantageous mortgage. Focus on the <strong className="font-semibold text-gray-900 dark:text-gray-100">interest rate, the total loan amount, and the overall monthly payment, using a mortgage calculator to determine the long-term cost of each option</strong>, including how much interest you will pay over the life of the loan. This comprehensive comparison will empower you to make an informed investment decision for your home.
          </p>
        </article>
      </section>

      <section aria-label="Mortgage Frequently Asked Questions" className="w-full max-w-4xl mx-auto my-12 px-4">
        <FAQ tool="mortgage" />
      </section>
    </>
  );
};
