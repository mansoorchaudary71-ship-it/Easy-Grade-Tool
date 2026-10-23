import React, { useState, useMemo } from 'react';
import { Link } from './SlashLink';
import { ToolHeading } from './ToolHeading';
import { SEO } from './SEO';
import { parseNumber } from '../utils/formatters';
import { AmbientAura } from './AmbientAura';
import { SEO_ROUTES } from '../data/seoConfig';
import { GUIDE_IMAGES } from '../data/guideImages';
import { SemanticGuideImage } from './SemanticGuideImage';
import { FAQ } from './FAQ';
import { ContentSection } from './GuideShell';

interface PercentageCalculatorProps {
  setToast?: (msg: string) => void;
}

export const PercentageCalculator: React.FC<PercentageCalculatorProps> = () => {
  // 1. What is [ X ] % of [ Y ]?
  const [calc1X, setCalc1X] = useState<string>('20');
  const [calc1Y, setCalc1Y] = useState<string>('150');

  // 2. [ X ] is what percent of [ Y ]?
  const [calc2X, setCalc2X] = useState<string>('30');
  const [calc2Y, setCalc2Y] = useState<string>('150');

  // 3. Percentage change from [ X ] to [ Y ]?
  const [calc3X, setCalc3X] = useState<string>('100');
  const [calc3Y, setCalc3Y] = useState<string>('125');

  // Result 1
  const result1Formatted = useMemo(() => {
    const x = parseNumber(calc1X);
    const y = parseNumber(calc1Y);
    if (isNaN(x) || isNaN(y)) return '0';
    const res = (x / 100) * y;
    return Number.isInteger(res) ? String(res) : res.toFixed(2);
  }, [calc1X, calc1Y]);

  // Result 2
  const result2Formatted = useMemo(() => {
    const x = parseNumber(calc2X);
    const y = parseNumber(calc2Y);
    if (isNaN(x) || isNaN(y)) return '0%';
    if (y === 0) return 'Undefined (division by zero)';
    const res = (x / y) * 100;
    return `${Number.isInteger(res) ? res : res.toFixed(2)}%`;
  }, [calc2X, calc2Y]);

  // Result 3
  const { result3Formatted, result3Value } = useMemo(() => {
    const x = parseNumber(calc3X);
    const y = parseNumber(calc3Y);
    if (isNaN(x) || isNaN(y) || x === 0) {
      return { result3Formatted: '0%', result3Value: 0 };
    }
    const change = ((y - x) / Math.abs(x)) * 100;
    const sign = change > 0 ? '+' : '';
    const formatted = `${sign}${Number.isInteger(change) ? change : change.toFixed(2)}%`;
    return { result3Formatted: formatted, result3Value: change };
  }, [calc3X, calc3Y]);

  return (
    <>
      <SEO
        title={SEO_ROUTES.percentage.title}
        description={SEO_ROUTES.percentage.description}
        canonicalUrl={SEO_ROUTES.percentage.canonicalUrl}
        ogImage={SEO_ROUTES.percentage.ogImagePlaceholder}
        keywords={SEO_ROUTES.percentage.keywords}
        applicationCategory={SEO_ROUTES.percentage.applicationCategory}
        featureList={SEO_ROUTES.percentage.featureList}
      />
      <ToolHeading
        badge="Percentage Calculator"
        title="Percentage Calculator — % of a Number & Percent Change"
        description="Use our free Percentage Calculator to find X% of a number, calculate what percent one number is of another, or compute percentage increase and decrease."
      />

      <div className="relative max-w-4xl mx-auto font-sans">
        <AmbientAura />

        <section
          aria-label="Percentage Calculator Tools"
          className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 space-y-6"
        >
          <div className="pb-5 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-400 uppercase block mb-1">
              Percentage Tools
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight m-0">Percentage Calculators</h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base mt-1 m-0">Fill in the blanks to calculate results instantly.</p>
          </div>

          {/* 1. What is [ X ] % of [ Y ]? */}
          <div className="bg-white dark:bg-slate-900/60 rounded-[24px] border border-stone-200/80 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <span className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase block">
              1. Percentage of a Number
            </span>
            <div className="flex flex-wrap items-center gap-2.5 text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base">
              <span>What is</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="X"
                aria-label="Percentage X"
                value={calc1X}
                onChange={(e) => setCalc1X(e.target.value)}
                className="bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-center w-28 sm:w-32 text-base"
              />
              <span>% of</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Y"
                aria-label="Base value Y"
                value={calc1Y}
                onChange={(e) => setCalc1Y(e.target.value)}
                className="bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-center w-28 sm:w-32 text-base"
              />
              <span>?</span>
            </div>
            <div className="bg-[#DBEAFE] dark:bg-teal-950/60 border border-[#BFDBFE] dark:border-teal-800/60 rounded-[20px] p-4 shadow-sm mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest text-teal-800 dark:text-teal-300 uppercase">Result</span>
              <strong className="text-3xl sm:text-4xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tracking-tight">{result1Formatted}</strong>
            </div>
          </div>

          {/* 2. [ X ] is what percent of [ Y ]? */}
          <div className="bg-white dark:bg-slate-900/60 rounded-[24px] border border-stone-200/80 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <span className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase block">
              2. What Percent
            </span>
            <div className="flex flex-wrap items-center gap-2.5 text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base">
              <input
                type="number"
                inputMode="decimal"
                placeholder="X"
                aria-label="Value X"
                value={calc2X}
                onChange={(e) => setCalc2X(e.target.value)}
                className="bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-center w-28 sm:w-32 text-base"
              />
              <span>is what percent of</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Y"
                aria-label="Total value Y"
                value={calc2Y}
                onChange={(e) => setCalc2Y(e.target.value)}
                className="bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-center w-28 sm:w-32 text-base"
              />
              <span>?</span>
            </div>
            <div className="bg-[#DBEAFE] dark:bg-teal-950/60 border border-[#BFDBFE] dark:border-teal-800/60 rounded-[20px] p-4 shadow-sm mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest text-teal-800 dark:text-teal-300 uppercase">Result</span>
              <strong className="text-3xl sm:text-4xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tracking-tight">{result2Formatted}</strong>
            </div>
          </div>

          {/* 3. Percentage change from [ X ] to [ Y ]? */}
          <div className="bg-white dark:bg-slate-900/60 rounded-[24px] border border-stone-200/80 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <span className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase block">
              3. Percentage Change
            </span>
            <div className="flex flex-wrap items-center gap-2.5 text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base">
              <span>Percentage change from</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="X"
                aria-label="Initial value X"
                value={calc3X}
                onChange={(e) => setCalc3X(e.target.value)}
                className="bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-center w-28 sm:w-32 text-base"
              />
              <span>to</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Y"
                aria-label="Final value Y"
                value={calc3Y}
                onChange={(e) => setCalc3Y(e.target.value)}
                className="bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-center w-28 sm:w-32 text-base"
              />
              <span>?</span>
            </div>
            <div className="bg-[#DBEAFE] dark:bg-teal-950/60 border border-[#BFDBFE] dark:border-teal-800/60 rounded-[20px] p-4 shadow-sm mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest text-teal-800 dark:text-teal-300 uppercase">Result</span>
              <strong
                className="text-3xl sm:text-4xl font-extrabold text-teal-950 dark:text-teal-100 font-mono tracking-tight"
              >
                {result3Formatted}
              </strong>
            </div>
          </div>
        </section>
      </div>

      {/* Educational content for the Percentage Calculator (rewritten for readability and topical depth) */}
      <ContentSection labelledBy="percentage-guide-title">
          <h2
            id="percentage-guide-title"
            className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100 tracking-tight"
          >
            Percentage Calculator – Calculate Percent Online Quickly and Free
          </h2>

          <div className="my-6">
            <SemanticGuideImage
              toolKey="percentage"
              alt="A hand taps numbers on a smartphone screen showing a percent sign and a result."
            />
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Discounts, interest rates, tax, tips, nutrition labels and test marks all come down to the same few sums. This calculator answers the three questions people ask most: what is X% of a number, what percent is one number of another, and by how much did a value rise or fall. <strong className="font-semibold text-slate-900 dark:text-white">Every formula it uses is spelled out below with a worked example, so you can check a result by hand or rebuild it in a spreadsheet.</strong>
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            How to Use the Percent Calculator
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Three questions, three ways to fill the boxes
          </h3>

          <ul className="list-disc pl-6 mb-4 text-slate-600 dark:text-slate-300 space-y-1">
            <li><strong className="font-semibold text-slate-900 dark:text-white">A share of a number.</strong> Enter the base and the rate. 15% of 200 is 200 × 0.15 = 30.</li>
            <li><strong className="font-semibold text-slate-900 dark:text-white">One number as a percent of another.</strong> Divide the part by the whole and multiply by 100. 45 out of 60 is 75%.</li>
            <li><strong className="font-semibold text-slate-900 dark:text-white">Increase or decrease.</strong> Enter the old value and the new one. A price that moves from 80 to 100 is up 25%, because 20 ÷ 80 = 0.25.</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            What the percent sign means
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The symbol % stands for “per hundred”, so 25% is 25 out of every 100, the fraction 1/4 and the decimal 0.25. Moving the decimal point two places to the left turns a percent into a decimal (75% becomes 0.75), and moving it two places to the right turns it back (0.6 becomes 60%). A fraction works the same way after you divide the top by the bottom: 1/8 is 0.125, or 12.5%.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Key Percentage Formulas
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Percentage of a number
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The part equals the whole times the rate divided by 100. Twenty percent of 150 is 150 × 0.20 = 30. Run it backwards when you know the part and the rate: if 30 is 20% of a total, the total is 30 ÷ 0.20 = 150. That reverse step is how you find an original price from a sale price.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Percentage change and percentage difference
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">Change = (new − old) ÷ old × 100.</strong> Going from 50 to 65 is a 30% increase, since 15 ÷ 50 = 0.30. The same gap read from the other direction, 65 down to 50, is a 23.1% decrease, because the starting point is now larger. That asymmetry is why change always needs a “from” value.
          </p>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            When neither value is the starting point, use the percentage difference instead: |a − b| ÷ ((a + b) ÷ 2) × 100. For 50 and 65 that is 15 ÷ 57.5 = 26.1%. Reach for change when something happened over time, and for difference when you are simply comparing two figures, such as prices from two shops.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Converting between percents, decimals and fractions
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Divide by 100 to go from a percent to a decimal, multiply by 100 to go back, and divide the numerator by the denominator to turn a fraction into a decimal first. So 3/5 is 0.6 and 60%, and 0.045 is 4.5%. Spreadsheets store percents as decimals, which is why a cell showing 18% holds 0.18.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Everyday Examples
          </h2>

          <ul className="list-disc pl-6 mb-4 text-slate-600 dark:text-slate-300 space-y-1">
            <li><strong className="font-semibold text-slate-900 dark:text-white">Sale price:</strong> 25% off 80 leaves 75% to pay, so 80 × 0.75 = 60.</li>
            <li><strong className="font-semibold text-slate-900 dark:text-white">Tip or tax:</strong> 18% on a 45 bill is 45 × 0.18 = 8.10. The <Link to="/tip-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">tip calculator</Link> also splits it between people.</li>
            <li><strong className="font-semibold text-slate-900 dark:text-white">Test mark:</strong> 42 right out of 50 is 84%. The <Link to="/test-grade-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">test grade calculator</Link> adds the letter and the score needed for the next one up.</li>
            <li><strong className="font-semibold text-slate-900 dark:text-white">Percentage points:</strong> a rate that moves from 4% to 6% has gone up 2 percentage points, which is a 50% relative increase.</li>
            <li><strong className="font-semibold text-slate-900 dark:text-white">Back-to-back changes:</strong> a 20% rise followed by a 20% fall does not return to the start. 100 becomes 120, then 96.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Common Percentage Mistakes
          </h2>

          <ul className="list-disc pl-6 mb-4 text-slate-600 dark:text-slate-300 space-y-1">
            <li>Dividing by the new value instead of the old one when measuring change.</li>
            <li>Mixing up percentage points with percent, which exaggerates or hides a shift.</li>
            <li>Averaging percentages from groups of different sizes without weighting them. The <Link to="/grade-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">weighted grade calculator</Link> handles that case.</li>
            <li>Rounding in the middle of a calculation rather than at the end.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Related Calculators and Tools
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Percentage Difference Calculator
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            To compare two figures with no obvious starting point, enter both values and read the difference formula above. It suits sales numbers from two periods, prices from two sellers or scores from two classes.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            For school, university and the dining table
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            For marks and scoring, try the <Link to="/" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Easy Grade Chart</Link>, the <Link to="/grade-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Weighted Grade Calculator</Link> or the <Link to="/cgpa-to-percentage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">CGPA to Percentage Calculator</Link>. For restaurant bills, the <Link to="/tip-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Tip Calculator</Link> turns a gratuity rate into an amount.
          </p>
        </ContentSection>

      <FAQ tool="percentage" />
    </>
  );
};
