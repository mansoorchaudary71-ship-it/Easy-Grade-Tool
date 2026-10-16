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
        title="Percentage Calculator — % of a Number, Increase & Decrease"
        description="Use our free online percentage calculator to find X% of a number, see what percent one number is of another, or work out percentage increase, decrease and change between two numbers."
      />

      <div className="relative max-w-4xl mx-auto font-sans">
        <AmbientAura />

        <section
          aria-label="Percentage Calculator Tools"
          className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 space-y-6"
        >
          <div className="pb-5 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase block mb-1">
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

      {/* Optimized Educational & SEO Content for Percentage Calculator */}
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
            Understanding and calculating percentages is a fundamental skill that permeates various aspects of our daily lives, from finance to statistics, and even simple grocery shopping. <strong className="font-semibold text-slate-900 dark:text-white">A reliable percentage calculator can demystify these calculations, providing quick and accurate results while helping you understand the numerator and denominator in decimal form, which can be divided by 100.</strong> This article explores the utility of free online percentage calculators, guiding you through their functionalities and demonstrating how they can simplify complex percentage computations using percentage values.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Introduction to Percentage Calculators
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            What is a Percentage Calculator?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A percentage calculator is an invaluable digital tool designed to help you calculate a percentage with ease and precision, allowing you to learn how to calculate various scenarios involving percentages. Essentially, it automates various computations, making complex manual calculations straightforward and allowing you to calculate a percentage quickly using the formula to calculate.
          </p>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            With this tool, you can effortlessly perform tasks such as converting percent to fraction or calculating a percentage.
          </p>

          <ul className="list-disc pl-6 mb-4 text-slate-600 dark:text-slate-300 space-y-1">
            <li>Determining a percentage of a number is essential for understanding how it represents a part of a whole, particularly as a factor of 100.</li>
            <li>Finding the percentage value representing a fraction of 100 can help in understanding the denominator and numerator relationships.</li>
            <li>Calculating the percentage change between two values can be simplified using a fraction to percent calculator, which helps in understanding the implications of absolute values.</li>
            <li>Converting percent to decimal is essential for understanding the formula to calculate values accurately, especially when used to express different quantities.</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Importance of Calculating Percentages
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The ability to calculate percentages, often expressed as &quot;50 out of 100,&quot; is crucial across numerous domains, from financial planning and academic studies to everyday consumer decisions. Knowing how to find a percentage helps you understand:
          </p>

          <ul className="list-disc pl-6 mb-4 text-slate-600 dark:text-slate-300 space-y-1">
            <li>Discounts</li>
            <li>Interest rates are often expressed as a given percent, which influences various financial calculations involving adding or subtracting percentages.</li>
            <li>Statistical data can be represented in decimal form to better illustrate the relationship between values.</li>
          </ul>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A percentage calculator simplifies the task of determining the percentage increase or decrease, allowing for quick analysis of financial growth, price changes, or even performance metrics by finding the percentage difference between two values.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Overview of Free Percentage Calculators
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            In today’s digital age, numerous free percentage calculator tools are readily available online, making percentage calculations accessible to everyone. These online percentage calculators are designed to handle a wide array of percentage calculations, including calculating a percentage of the total.
          </p>

          <ul className="list-disc pl-6 mb-4 text-slate-600 dark:text-slate-300 space-y-1">
            <li>Finding the percentage of a number is a way of expressing that number as a fraction of the total, which can also be converted into decimal form for clarity.</li>
            <li>Calculating the percentage increase and decrease is essential when you want to denote changes in data over time.</li>
          </ul>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Many free percentage calculator options also integrate functionalities like a fraction calculator or the ability to convert a percent to a fraction, streamlining various mathematical tasks and enhancing your ability to learn how to calculate effectively.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            How to Use a Percentage Calculator
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Steps to Calculate Percent
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">Using a percentage calculator to calculate a percentage is straightforward and efficient, especially when you need to add a percent sign to your results and ensure your answer is accurate to two decimal places.</strong> To find the percentage of a number, you typically input the base number and the given percent value you wish to calculate. For instance, if you need to determine 15 percent of 200, you would enter 200 as the total and 15 as the percentage. The calculator then performs the necessary operations, often involving multiplication, to give you the precise result, helping you to find a percentage with ease.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Understanding the Percent Sign
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">The “percent sign” (%) is a crucial symbol in mathematics that indicates a fraction of 100.</strong> When you see 25%, it means 25 out of every 100. A percentage calculator understands this notation, allowing you to input values directly with the percent sign or as a decimal to calculate a percentage easily. For example, to convert a percentage to a decimal, 25% becomes 0.25, which is a way of expressing the percentage as a fraction or decimal. Understanding the percent symbol is fundamental when determining the percentage or working with a fraction of 100.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Examples of Calculating Percentage
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Let&apos;s consider some practical examples of using a percentage calculator to calculate a percentage. <strong className="font-semibold text-slate-900 dark:text-white">To calculate the percentage increase or decrease, you would input the original value and the new value.</strong> The calculator then computes the percentage change from the initial value. If you want to find the percentage difference between two values, say the price of an item before and after a sale, the percentage calculator simplifies this task by quickly showing the percentage reduction. These percentage calculations are made effortless with an online percentage calculator.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Key Percentage Formulas
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Percentage of a Number
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">Calculating the percentage of a number is a fundamental operation in various fields, often involving percentages in practical applications.</strong> The basic percentage formula involves multiplying the number by the percentage value expressed as a decimal or a fraction. For example, to find 20 percent of 150, you would multiply 150 by 0.20 (20/100), illustrating the relationship between decimal to a percentage and how it relates to part of a whole. A percentage calculator automates this by letting you input the base number and the percentage, then providing the exact result, helping you to find a percentage effortlessly as a dimensionless value.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Percentage Change and Percentage Difference
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">Understanding percentage change and percentage difference is crucial for analyzing growth, decline, or comparisons between two values as a way of expressing their relationship.</strong> To calculate the percentage change, you subtract the original value from the new value, divide by the original value, and multiply the decimal by 100. Similarly, the percentage difference between two numbers is found by taking the absolute value of the difference, dividing by the average of the two numbers, and multiplying by 100 to denote the change in percent. A percentage calculator simplifies these calculations by allowing you to input the two values and instantly determining the percentage increase or decrease, or the difference between the two numbers as a fraction.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Converting Percentage to Decimal
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">Converting a percentage to a decimal is a simple yet vital step in many percentage calculations, particularly when working with percentages and decimals.</strong> The &quot;percent sign&quot; (%) literally means &quot;per hundred,&quot; so to convert a percentage to a decimal, you simply divide the percentage value by 100, effectively moving the decimal two digits to the left. For instance, 75% becomes 0.75. A percentage calculator often performs this conversion internally, but understanding this process is essential for manual calculations, especially when you need to multiply a number by a percentage or get a percentage. This also helps in understanding a fraction of 100 as a percentage of the total.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            How Do You Calculate a Percentage? Common Questions and Worked Examples
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Most percentage questions come down to three formulas, which are the three calculators above. Find a part of a number with <code>Percentage ÷ 100 × Number</code>, find what percent one number is of another with <code>Part ÷ Whole × 100</code>, and measure a rise or fall with <code>(New − Old) ÷ Old × 100</code>. The sections below show how to use them for the questions people ask most.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            What Is a Percentage Calculator and How Do I Use It?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A percentage calculator does the division and multiplication for you. Choose the box that matches your question, type the two numbers, and the result updates instantly. For example, 20% of 150 is 30, 30 is 20% of 150, and going from 100 to 125 is a 25% increase.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How Do I Calculate Percentage Increase and Decrease?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Subtract the old value from the new value, divide by the old value, and multiply by 100. A price that goes from 40 to 50 is up <strong>25%</strong>, and a value that falls from 200 to 150 is down <strong>25%</strong>. The percentage change box shows a plus sign for an increase and a minus sign for a decrease. The same formula covers a percentage drop, reduction, growth, gain or loss. Percent change from zero is undefined, because there is no starting value to divide by.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How Do I Add or Subtract a Percentage From a Number?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Find the percentage in the first box, then add it to or subtract it from the original number. You can also multiply by a single factor: <code>Number × (1 + Percentage ÷ 100)</code> to add, or <code>Number × (1 − Percentage ÷ 100)</code> to subtract. Adding 15% to 120 gives 120 × 1.15 = 138, and taking 15% off 120 gives 120 × 0.85 = 102. The same method works for a pay rise, a sale price, a price with sales tax, or a salary increase. For instance, a 4% raise on 50,000 is 52,000, and 8% sales tax on 50 makes it 54.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How Do I Find the Percentage Difference Between Two Numbers?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Percentage difference treats both numbers equally, so it divides by their average instead of by a starting value: <code>|A − B| ÷ ((A + B) ÷ 2) × 100</code>. For 50 and 75, the difference is 25 and the average is 62.5, so the percentage difference is <strong>40%</strong>. Percentage change from 50 to 75 is <strong>+50%</strong> because it uses 50 as the base. Use difference when neither value comes first, and change when you have a before and after.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How Do I Calculate a Reverse Percentage (Find the Original Price)?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Divide the final value by the multiplier. After a 20% discount, a price of 60 came from 60 ÷ 0.80 = <strong>75</strong>. After a 20% increase, a value of 60 came from 60 ÷ 1.20 = <strong>50</strong>. Adding 20% back to the final price gives the wrong answer, because the percentage was applied to the original number, not the new one.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How Do I Calculate a Percentage for Marks, Test Scores and Grades?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Divide your score by the total marks and multiply by 100. A score of 45 out of 50 is 90%, and 425 out of 500 is 85%. Use the second box, with your score as X and the total as Y. When every test has the same total, the average percentage is the mean of the percentages. When totals differ, add all points earned and divide by all points possible: 80% on 50 points and 90% on 100 points is (40 + 90) ÷ 150 = 86.67%. For weighted course grades, use our <Link to="/grade-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Weighted Grade Calculator</Link>, or turn a GPA or CGPA into a percentage with the <Link to="/cgpa-to-percentage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">CGPA to Percentage Calculator</Link>.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How Do I Calculate Weight Loss, Profit, Markup and Margin Percentages?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Weight loss percentage is the weight lost divided by your starting weight: going from 200 lb to 180 lb is 20 ÷ 200 = 10%. Enter 200 and 180 in the percentage change box and read the −10%. For business, markup is profit ÷ cost and margin is profit ÷ selling price. An item that costs 80 and sells for 100 has a 25% markup and a 20% margin.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How Do I Convert a Percentage to a Decimal or Fraction?
          </h3>

          <ul className="list-disc pl-6 mb-4 text-slate-600 dark:text-slate-300 space-y-1">
            <li>Percentage to decimal: divide by 100, so 15% = 0.15 and 75% = 0.75.</li>
            <li>Decimal to percentage: multiply by 100, so 0.375 = 37.5%.</li>
            <li>Fraction to percentage: divide the top by the bottom, then multiply by 100, so 3/8 = 0.375 = 37.5%.</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How Do I Calculate a Percentage Without a Calculator?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Start from 10% by moving the decimal one place left, and from 1% by moving it two places. Then build the rest: 15% of 80 is 10% (8) plus 5% (4), which is 12. For 50%, halve the number, and for 25%, halve it twice.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            What Are the Percentage Formulas in Excel and Google Sheets?
          </h3>

          <ul className="list-disc pl-6 mb-4 text-slate-600 dark:text-slate-300 space-y-1">
            <li>What percent A1 is of B1: <code>=A1/B1</code>, formatted as Percentage.</li>
            <li>Percentage change from A1 to B1: <code>=(B1-A1)/A1</code>.</li>
            <li>Increase A1 by 10%: <code>=A1*(1+10%)</code>. Decrease it by 10%: <code>=A1*(1-10%)</code>.</li>
            <li>Find 10% of A1: <code>=A1*10%</code>.</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            What Is the Difference Between Percentage Points and Percent?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Percentage points are the plain gap between two percentages, while percent change compares them proportionally. A rate that rises from 10% to 12% went up 2 percentage points, but it increased by 20% in relative terms, because 2 ÷ 10 = 0.20.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Related Calculators and Tools
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Percentage Difference Calculator
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">A percentage difference calculator is a specialized online percentage calculator designed to quickly determine the percentage difference between two values.</strong> This tool is incredibly useful for comparing two numbers, whether it&apos;s sales figures, test scores, or financial data. By inputting the two values, the calculator automatically applies the percentage formula, calculates the absolute difference between the two, divides by the average, and provides the percentage difference, making complex comparisons straightforward and accurate.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Calculators for Finding Percentage of a Whole
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            There are numerous calculators available that specifically focus on finding the percent of x, also known as calculating the percentage of a whole, using the factor of 100. These tools are often integrated into general percentage calculators but can also be standalone to help users get a percentage quickly. They streamline the process of determining a specific portion of a total, such as calculating discounts, taxes, or a certain proportion in statistics, all of which can be expressed as a given percent or converted to decimal to a percentage. Simply input the total and the desired percentage, and the calculator will instantly find the percentage value.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Other Useful Percentage Calculators
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Beyond basic percentage calculations, understanding how to convert values into decimal form can enhance your analytical skills and help you express a number in different formats, including fractions and percentages. <strong className="font-semibold text-slate-900 dark:text-white">Various specialized percentage calculators exist to address academic, dining, and financial needs.</strong> For academic scoring, explore our <Link to="/" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Easy Grade Chart</Link>, <Link to="/grade-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Weighted Grade Calculator</Link>, and <Link to="/cgpa-to-percentage-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">CGPA to Percentage Calculator</Link>; or use our <Link to="/tip-calculator" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Tip Calculator</Link> for restaurant gratuity percentages.
          </p>
        </ContentSection>

      <FAQ tool="percentage" />
    </>
  );
};
