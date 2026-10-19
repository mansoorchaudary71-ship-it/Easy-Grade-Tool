import React, { useState, useMemo } from 'react';
import { Link } from './SlashLink';
import { ToolHeading } from './ToolHeading';
import { SEO } from './SEO';
import { formatCurrency, parseNumber } from '../utils/formatters';
import { triggerHapticFeedback, handleNumericKeyDownHaptic, DEFAULT_HAPTIC_DURATION } from '../utils/haptics';
import { SEO_ROUTES } from '../data/seoConfig';
import { GUIDE_IMAGES } from '../data/guideImages';
import { SemanticGuideImage } from './SemanticGuideImage';
import { FAQ } from './FAQ';
import { ContentSection } from './GuideShell';
import { ScrollableTableContainer } from './ScrollableTableContainer';

interface TipCalculatorProps {
  setToast?: (msg: string) => void;
}

export const TipCalculator: React.FC<TipCalculatorProps> = () => {
  const [billAmount, setBillAmount] = useState<string>('84');
  const [tipPercent, setTipPercent] = useState<string>('20');
  const [people, setPeople] = useState<string>('2');

  const { tipAmount, totalWithTip, eachPersonPays } = useMemo(() => {
    const bill = Math.max(0, parseNumber(billAmount));
    const tip = Math.max(0, parseNumber(tipPercent));
    const numPeople = Math.max(1, Math.floor(parseNumber(people, 1)));

    const tAmount = (bill * tip) / 100;
    const totWithTip = bill + tAmount;
    const perPerson = totWithTip / numPeople;

    return {
      tipAmount: tAmount,
      totalWithTip: totWithTip,
      eachPersonPays: perPerson,
    };
  }, [billAmount, tipPercent, people]);

  const TIP_PRESETS = [10, 15, 18, 20, 25];

  return (
    <>
      <SEO
        title={SEO_ROUTES.tip.title}
        description={SEO_ROUTES.tip.description}
        canonicalUrl={SEO_ROUTES.tip.canonicalUrl}
        ogImage={SEO_ROUTES.tip.ogImagePlaceholder}
        keywords={SEO_ROUTES.tip.keywords}
        applicationCategory={SEO_ROUTES.tip.applicationCategory}
        featureList={SEO_ROUTES.tip.featureList}
      />
      <ToolHeading
        badge="Tip Calculator"
        title="Tip Calculator — Calculate Gratuity & Split the Bill"
        description="Use our free Tip Calculator to set your gratuity percentage, select quick restaurant presets, and instantly calculate per-person bill splits."
      />

      <div className="relative tool-layout">

        {/* Left Inputs Card */}
        <section
          aria-label="Bill Details and Tip Preferences"
          className="bg-surface rounded-2xl border border-line/80 shadow-sm dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col gap-6"
        >
          <div className="pb-5 border-b border-line/60">
            <span className="text-xs font-semibold text-ink-2 block mb-1">
              Dining &amp; Gratuity
            </span>
            <h2 className="m-0">Bill Details</h2>
            <p className="text-ink-2 font-medium text-sm sm:text-base mt-1 m-0">Enter your bill and tip preferences.</p>
          </div>

          <div className="flex flex-col gap-5">
            {/* 1. Bill amount ($) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="bill-amount" className="text-xs font-semibold text-ink-2">
                Bill amount ($)
              </label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs tabular-nums font-bold text-ink-3 group-focus-within:text-brand-600 transition-colors select-none bg-sunken border border-line/80 px-2 py-0.5 rounded-full pointer-events-none">
                  $
                </span>
                <input
                  id="bill-amount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  className="field w-full px-5 py-3.5 transition-all font-bold text-lg text-center"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  onKeyDown={handleNumericKeyDownHaptic}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* 2. Tip (%) with quick-select buttons for 10%, 15%, 18%, 20%, and 25% */}
            <div className="flex flex-col gap-2">
              <label htmlFor="tip-percent" className="text-xs font-semibold text-ink-2">
                Tip (%)
              </label>
              <div className="relative group">
                <input
                  id="tip-percent"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="1"
                  className="field w-full px-5 py-3.5 transition-all font-bold text-lg text-center"
                  value={tipPercent}
                  onChange={(e) => setTipPercent(e.target.value)}
                  onKeyDown={handleNumericKeyDownHaptic}
                  placeholder="20"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs tabular-nums font-bold text-ink-3 group-focus-within:text-brand-600 transition-colors select-none bg-sunken border border-line/80 px-2 py-0.5 rounded-full pointer-events-none">
                  %
                </span>
              </div>

              {/* Quick-select buttons specifically for 10%, 15%, 18%, 20%, and 25% */}
              <div className="grid grid-cols-5 gap-1.5 pt-1 w-full">
                {TIP_PRESETS.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    title="Select tip percentage"
                    aria-label={`Select ${pct}% tip`}
                    className={`preset-btn text-xs w-full text-center transition-all cursor-pointer py-1.5 font-semibold ${
                      parseNumber(tipPercent) === pct
                        ? 'bg-brand text-on-brand rounded-full font-bold px-4 py-1.5 shadow-sm'
                        : 'bg-surface text-ink-2 border border-line hover:bg-sunken rounded-full font-semibold shadow-sm px-4 py-1.5 transition-all'
                    }`}
                    onClick={() => {
                      triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                      setTipPercent(String(pct));
                    }}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* 3. People */}
            <div className="flex flex-col gap-2">
              <label htmlFor="num-people" className="text-xs font-semibold text-ink-2">
                People
              </label>
              <input
                id="num-people"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                className="field w-full px-5 py-3.5 transition-all font-bold text-lg text-center"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                onKeyDown={handleNumericKeyDownHaptic}
                placeholder="1"
              />
            </div>
          </div>
        </section>

        {/* Right Output Card: Display "Tip amount", "Total with tip", and "Each person pays" */}
        <section
          aria-label="Tip Calculation Breakdown"
          className="bg-surface rounded-2xl border border-line/80 shadow-sm dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between"
          aria-live="polite"
        >
          <div>
            <div className="bg-brand-soft border border-brand-line rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-semibold text-brand-ink block">
                Each person pays
              </span>
              <div className="text-3xl sm:text-4xl font-bold text-brand-ink tabular-nums tracking-tight mt-2" aria-live="polite">
                {formatCurrency(eachPersonPays)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mt-8 pt-5 border-t border-line/80">
              <div className="bg-amber-200 dark:bg-amber-950/55 rounded-xl p-4 border border-black/5 dark:border-amber-800/50 shadow-sm">
                <strong className="block text-xl font-bold text-ink">{formatCurrency(tipAmount)}</strong>
                <span className="text-xs text-ink-3 font-medium">Tip amount</span>
              </div>
              <div className="bg-brand-200 dark:bg-brand-950/55 rounded-xl p-4 border border-black/5 dark:border-brand-800/50 shadow-sm">
                <strong className="block text-xl font-bold text-ink">{formatCurrency(totalWithTip)}</strong>
                <span className="text-xs text-ink-3 font-medium">Total with tip</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Optimized Educational & SEO Content for Tip Calculator */}
      <ContentSection labelledBy="tip-guide-title">
          <h2
            id="tip-guide-title"
            className="mb-6"
          >
            Tip Calculator — Quickly Calculate a Tip and Split the Bill
          </h2>

          <div className="my-6">
            <SemanticGuideImage
              toolKey="tip"
              alt="A smartphone screen shows a tip calculator app with bill total, tip percent, and split fields."
            />
          </div>

          <p className="text-ink-2 leading-relaxed mb-4">
            Welcome to our comprehensive guide on tip calculators, an indispensable tool for dining out at restaurants and cafes and for various services. This article will illuminate what a tip calculator is, how to effectively use it, and the numerous advantages it offers in simplifying your financial transactions, including budgeting for great service.
          </p>

          <h2 className="mt-8 mb-4">
            Understanding the Tip Calculator
          </h2>

          <h3 className="mt-6 mb-3">
            What is a Tip Calculator?
          </h3>

          <p className="text-ink-2 leading-relaxed mb-4">
            A tip calculator is a convenient digital tool designed to help you multiply the bill by the chosen tip percentage, like half of 10 percent, for accurate gratuity calculations, especially in restaurants and cafes. <strong className="font-semibold text-ink">Quickly calculate a tip amount based on your bill, ensuring you know exactly how much to leave for great service.</strong> It acts as a specialized calculator that automates gratuity computations, ensuring fair compensation for hospitality workers while eliminating stressful mental math at the dining table.
          </p>

          <p className="text-ink-2 leading-relaxed mb-4">
            By taking into account key details such as the initial bill amount, the desired percentage, and the total number of diners, a tip calculator provides instantaneous clarity on the exact tip amount, the combined total with tip, and how much each person pays.
          </p>

          <h3 className="mt-6 mb-3">
            How Does a Tip Calculator Work?
          </h3>

          <p className="text-ink-2 leading-relaxed mb-4">
            At its core, a tip calculator takes the total cost of your service and converts your chosen gratuity percentage into a decimal factor. Multiplying the subtotal by this decimal produces the tip amount. Adding the tip back to the subtotal yields the final charge, which can then be evenly split across any number of contributors.
          </p>

          <h2 className="mt-8 mb-4">
            How to Use a Tip Calculator
          </h2>

          <h3 className="mt-6 mb-3">
            Step-by-Step Instructions
          </h3>

          <p className="text-ink-2 leading-relaxed mb-4">
            Using our tip calculator is simple and straightforward:
          </p>

          <ul className="list-disc pl-6 mb-4 text-ink-2 space-y-1">
            <li><strong>Enter the Total Bill:</strong> Input the check subtotal or grand total from your receipt.</li>
            <li><strong>Select or Adjust Tip Percentage:</strong> Choose standard preset options like 15%, 18%, or 20%, or enter a custom rate reflecting the quality of service.</li>
            <li><strong>Specify Number of People:</strong> If dining with a group, adjust the number of paying guests to divide the final bill.</li>
            <li><strong>Review the Instant Summary:</strong> Examine the exact gratuity, combined bill, and per-person cost.</li>
          </ul>

          <h3 className="mt-6 mb-3">
            Key Features of Modern Tip Calculators
          </h3>

          <ScrollableTableContainer className="my-6" ariaLabel="Key Features of Modern Tip Calculators">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-sunken border-b-2 border-line">
                  <th className="p-3 font-semibold text-ink sticky left-0 z-10 bg-sunken/95 min-w-[140px]">Feature</th>
                  <th className="p-3 font-semibold text-ink">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-line p-3 text-ink-2 font-medium sticky left-0 z-10 bg-surface/95 shadow-sm dark:shadow-sm">Bill Splitting</td>
                  <td className="border-b border-line p-3 text-ink-2">Evenly divides the entire bill and gratuity across multiple guests with a single click.</td>
                </tr>
                <tr>
                  <td className="border-b border-line p-3 text-ink-2 font-medium sticky left-0 z-10 bg-surface/95 shadow-sm dark:shadow-sm">Preset Percentages</td>
                  <td className="border-b border-line p-3 text-ink-2">Quick selection buttons for standard tipping levels (10%, 15%, 18%, 20%, 25%).</td>
                </tr>
                <tr>
                  <td className="border-b border-line p-3 text-ink-2 font-medium sticky left-0 z-10 bg-surface/95 shadow-sm dark:shadow-sm">Pre-Tax Calculation</td>
                  <td className="border-b border-line p-3 text-ink-2">Allows tipping on the net food and beverage total without paying gratuity on local tax.</td>
                </tr>
                <tr>
                  <td className="border-b border-line p-3 text-ink-2 font-medium sticky left-0 z-10 bg-surface/95 shadow-sm dark:shadow-sm">Custom Tip Amounts</td>
                  <td className="border-b border-line p-3 text-ink-2">Full freedom to enter arbitrary percentages or fixed dollar amounts for exceptional service.</td>
                </tr>
              </tbody>
            </table>
          </ScrollableTableContainer>

          <h2 className="mt-8 mb-4">
            Tipping Etiquette and Standard Percentages
          </h2>

          <h3 className="mt-6 mb-3">
            Standard Tipping Guidelines by Service Type
          </h3>

          <p className="text-ink-2 leading-relaxed mb-4">
            Understanding standard tipping benchmarks ensures you show appropriate appreciation while managing your dining out budget effectively:
          </p>

          <ScrollableTableContainer className="my-6" ariaLabel="Standard Tipping Guidelines by Service Type">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-sunken border-b-2 border-line">
                  <th className="p-3 font-semibold text-ink sticky left-0 z-10 bg-sunken/95 min-w-[150px]">Service Category</th>
                  <th className="p-3 font-semibold text-ink whitespace-nowrap">Recommended Tip Range</th>
                  <th className="p-3 font-semibold text-ink">Details &amp; Considerations</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-line p-3 text-ink-2 font-medium sticky left-0 z-10 bg-surface/95 shadow-sm dark:shadow-sm">Sit-Down Restaurants</td>
                  <td className="border-b border-line p-3 text-ink-2 whitespace-nowrap">15% – 20%</td>
                  <td className="border-b border-line p-3 text-ink-2">15% for acceptable service, 18%–20% for good to excellent service, 22%+ for outstanding hospitality.</td>
                </tr>
                <tr>
                  <td className="border-b border-line p-3 text-ink-2 font-medium sticky left-0 z-10 bg-surface/95 shadow-sm dark:shadow-sm">Food Delivery</td>
                  <td className="border-b border-line p-3 text-ink-2 whitespace-nowrap">10% – 15% (min. $3–$5)</td>
                  <td className="border-b border-line p-3 text-ink-2">Consider adverse weather, flight of stairs, long distances, and peak holiday traffic.</td>
                </tr>
                <tr>
                  <td className="border-b border-line p-3 text-ink-2 font-medium sticky left-0 z-10 bg-surface/95 shadow-sm dark:shadow-sm">Bars &amp; Lounges</td>
                  <td className="border-b border-line p-3 text-ink-2 whitespace-nowrap">$1 – $2 per drink or 15% – 20%</td>
                  <td className="border-b border-line p-3 text-ink-2">$1 per beer or wine, $2+ for craft cocktails, or percentage on open running tabs.</td>
                </tr>
                <tr>
                  <td className="border-b border-line p-3 text-ink-2 font-medium sticky left-0 z-10 bg-surface/95 shadow-sm dark:shadow-sm">Coffee Shops &amp; Cafes</td>
                  <td className="border-b border-line p-3 text-ink-2 whitespace-nowrap">$1 – $2 or round-up spare change</td>
                  <td className="border-b border-line p-3 text-ink-2">Optional for basic drip coffee; customary for custom handcrafted espresso drinks.</td>
                </tr>
                <tr>
                  <td className="border-b border-line p-3 text-ink-2 font-medium sticky left-0 z-10 bg-surface/95 shadow-sm dark:shadow-sm">Hair Salons &amp; Barbers</td>
                  <td className="border-b border-line p-3 text-ink-2 whitespace-nowrap">15% – 20%</td>
                  <td className="border-b border-line p-3 text-ink-2">Rewards dedicated personal attention, technical craftsmanship, and appointment time.</td>
                </tr>
                <tr>
                  <td className="border-b border-line p-3 text-ink-2 font-medium sticky left-0 z-10 bg-surface/95 shadow-sm dark:shadow-sm">Taxis &amp; Ridesharing</td>
                  <td className="border-b border-line p-3 text-ink-2 whitespace-nowrap">10% – 15%</td>
                  <td className="border-b border-line p-3 text-ink-2">Increase for heavy luggage handling, clean vehicle, or navigating dense city traffic.</td>
                </tr>
              </tbody>
            </table>
          </ScrollableTableContainer>

          <h2 className="mt-8 mb-4">
            Formulas and Manual Tip Calculation
          </h2>

          <h3 className="mt-6 mb-3">
            The Fundamental Mathematical Formulas
          </h3>

          <p className="text-ink-2 leading-relaxed mb-4">
            Understanding the math behind your check gives you confidence whether verifying digital receipts or calculating manually:
          </p>

          <ul className="list-disc pl-6 mb-4 text-ink-2 space-y-1">
            <li><strong>Tip Amount:</strong> <code className="tabular-nums text-sm bg-sunken px-2 py-0.5 rounded-lg">Tip = Bill Amount × (Tip Percentage ÷ 100)</code></li>
            <li><strong>Total with Tip:</strong> <code className="tabular-nums text-sm bg-sunken px-2 py-0.5 rounded-lg">Total = Bill Amount + Tip Amount</code></li>
            <li><strong>Each Person Pays:</strong> <code className="tabular-nums text-sm bg-sunken px-2 py-0.5 rounded-lg">Per Person = Total with Tip ÷ Number of People</code></li>
          </ul>

          <h3 className="mt-6 mb-3">
            Mental Math Shortcuts
          </h3>

          <p className="text-ink-2 leading-relaxed mb-4">
            When you don&apos;t have access to a digital calculator, these simple mental math techniques allow you to figure out gratuity in seconds:
          </p>

          <ul className="list-disc pl-6 mb-4 text-ink-2 space-y-1">
            <li><strong>The 10% Benchmark:</strong> Shift the decimal point one place to the left (e.g., a $70 bill produces a $7.00 baseline).</li>
            <li><strong>The 15% Calculation:</strong> Take 10% of the bill and add half of that amount (e.g., $7.00 + $3.50 = $10.50).</li>
            <li><strong>The 20% Calculation:</strong> Shift the decimal point one place to the left and double the value (e.g., $7.00 × 2 = $14.00).</li>
            <li><strong>Half of 10 Percent:</strong> For a 5% baseline or incremental adjustment, simply take half of 10 percent of the bill.</li>
          </ul>

          <h2 className="mt-8 mb-4">
            Bill Splitting and Special Gratuity Rules
          </h2>

          <h3 className="mt-6 mb-3">
            Pre-Tax vs. Post-Tax Calculation
          </h3>

          <p className="text-ink-2 leading-relaxed mb-4">
            A traditional etiquette guideline recommends calculating tip amounts on the pre-tax subtotal, as taxes represent government levies rather than services rendered by waiting staff. However, calculating on the post-tax total has become increasingly standard in digital point-of-sale machines and represents a generous token of appreciation.
          </p>

          <h3 className="mt-6 mb-3">
            Automatic Gratuities and Service Charges
          </h3>

          <p className="text-ink-2 leading-relaxed mb-4">
            Always inspect your restaurant receipt before adding an additional gratuity. Many establishments automatically add a mandatory 18% to 20% gratuity for large parties (typically six or more diners) or in tourist-heavy destinations.
          </p>

          <p className="text-ink-2 leading-relaxed mb-4">
            In cases where mandatory gratuity is added directly to your check, it covers the service fee on the bill. Your total bill will simply be the bill amount, with no extra tip expected from the customer, unless you choose to leave a bigger tip. For general percentage ratios, discounts, or monthly financing estimates, explore our <Link to="/percentage-calculator" className="text-brand font-semibold underline hover:text-brand-600">Percentage Calculator</Link>, <Link to="/loan-calculator" className="text-brand font-semibold underline hover:text-brand-600">Loan Calculator</Link>, and <Link to="/grade-calculator" className="text-brand font-semibold underline hover:text-brand-600">Weighted Grade Calculator</Link>.
          </p>
        </ContentSection>

      <FAQ tool="tip" />
    </>
  );
};
