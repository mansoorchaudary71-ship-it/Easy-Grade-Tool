import React, { useState, useMemo } from 'react';
import { SegmentedControl } from './ui/SegmentedControl';
import {
  Copy,
  Check,
  Info,
  HelpCircle,
  TrendingUp,
  ArrowRightLeft,
  Printer,
} from 'lucide-react';
import { parseNumber } from '../utils/formatters';
import { AnimatedCounter } from './AnimatedCounter';
import { SmartCalculatorInput } from './SmartCalculatorInput';

interface GpaToPercentageProps {
  setToast?: (msg: string) => void;
}

const PRESET_SCALES = [
  { label: '4.0 Scale (Standard US)', value: '4.0' },
  { label: '4.3 Scale (Honors / Plus-Minus)', value: '4.3' },
  { label: '5.0 Scale (Weighted AP/IB)', value: '5.0' },
  { label: '10.0 Scale (International / India / Europe)', value: '10.0' },
  { label: 'Custom Scale', value: 'custom' },
];

export const GpaToPercentage: React.FC<GpaToPercentageProps> = ({ setToast }) => {
  // Bidirectional Direction Mode: 'gpa-to-pct' vs 'pct-to-gpa'
  const [conversionDirection, setConversionDirection] = useState<'gpa-to-pct' | 'pct-to-gpa'>('gpa-to-pct');

  const [gpaInput, setGpaInput] = useState<string>('3.6');
  const [percentageInput, setPercentageInput] = useState<string>('90');
  const [selectedScalePreset, setSelectedScalePreset] = useState<string>('4.0');
  const [customScaleInput, setCustomScaleInput] = useState<string>('4.0');
  const [copied, setCopied] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  // Determine active scale value
  const activeScale = useMemo<number>(() => {
    if (selectedScalePreset === 'custom') {
      const parsed = parseNumber(customScaleInput);
      return parsed > 0 ? parsed : 4.0;
    }
    const parsed = parseNumber(selectedScalePreset);
    return parsed > 0 ? parsed : 4.0;
  }, [selectedScalePreset, customScaleInput]);

  // Bidirectional calculations
  const { calculatedPercent, calculatedGpa, errorMsg } = useMemo(() => {
    let pct = 0;
    let gpa = 0;
    let err: string | undefined = undefined;

    if (conversionDirection === 'gpa-to-pct') {
      const parsedGpa = parseNumber(gpaInput);
      if (gpaInput.trim() === '') {
        pct = 0;
      } else if (parsedGpa < 0) {
        err = 'GPA cannot be negative.';
        pct = 0;
      } else if (parsedGpa > activeScale) {
        err = `GPA cannot exceed selected scale of ${activeScale}.`;
        pct = 100;
      } else {
        pct = (parsedGpa / activeScale) * 100;
      }
      gpa = isNaN(parsedGpa) ? 0 : parsedGpa;
    } else {
      // Percentage to GPA: (Percentage / 100) * Scale
      const parsedPct = parseNumber(percentageInput);
      if (percentageInput.trim() === '') {
        gpa = 0;
      } else if (parsedPct < 0) {
        err = 'Percentage cannot be negative.';
        gpa = 0;
      } else if (parsedPct > 100) {
        err = 'Standard percentage is capped at 100%.';
        gpa = activeScale;
      } else {
        gpa = (parsedPct / 100) * activeScale;
      }
      pct = isNaN(parsedPct) ? 0 : parsedPct;
    }

    return {
      calculatedPercent: Math.round(pct * 100) / 100,
      calculatedGpa: Math.round(gpa * 100) / 100,
      errorMsg: err,
    };
  }, [conversionDirection, gpaInput, percentageInput, activeScale]);

  // Color tier: Tier A >= 90%, Tier B >= 80%, Tier C >= 70%, Tier D >= 60%, Tier F < 60%
  const tierColor = useMemo<{
    color: string;
    stroke: string;
    label: string;
    bgClass: string;
    textClass: string;
    badgeClass: string;
    remark: string;
  }>(() => {
    if (calculatedPercent >= 90) {
      return {
        color: '#10b981',
        stroke: '#10b981',
        label: 'Tier A — Honor Standing',
        bgClass: 'bg-emerald-50 border-emerald-200 rounded-2xl',
        textClass: 'text-emerald-800',
        badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
        remark: 'Excellent academic standing. Equivalent to top-tier percentile performance.',
      };
    }
    if (calculatedPercent >= 80) {
      return {
        color: '#6366f1',
        stroke: '#6366f1',
        label: 'Tier B — Above Average Range',
        bgClass: 'bg-indigo-50 border-indigo-200 rounded-2xl',
        textClass: 'text-indigo-800',
        badgeClass: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
        remark: 'Solid above-average academic performance.',
      };
    }
    if (calculatedPercent >= 70) {
      return {
        color: '#f59e0b',
        stroke: '#f59e0b',
        label: 'Tier C — Satisfactory Range',
        bgClass: 'bg-amber-50 border-amber-200 rounded-2xl',
        textClass: 'text-amber-800',
        badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200',
        remark: 'Satisfactory academic performance within standard requirements.',
      };
    }
    if (calculatedPercent >= 60) {
      return {
        color: '#f97316',
        stroke: '#f97316',
        label: 'Tier D — Marginal Range',
        bgClass: 'bg-orange-50 border-orange-200 rounded-2xl',
        textClass: 'text-orange-800',
        badgeClass: 'bg-orange-50 text-orange-800 border border-orange-200',
        remark: 'Passing but marginal. Recommended to review course concepts.',
      };
    }
    return {
      color: '#f43f5e',
      stroke: '#f43f5e',
      label: 'Tier F — Below 60% Benchmark',
      bgClass: 'bg-rose-50 border-rose-200 rounded-2xl',
      textClass: 'text-rose-800',
      badgeClass: 'bg-rose-50 text-rose-800 border border-rose-200',
      remark: 'Opportunity for growth. Consult with your academic advisor for GPA recovery programs.',
    };
  }, [calculatedPercent]);

  // Circular gauge geometry
  const radius = 88;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const clampedRatio = Math.max(0, Math.min(calculatedPercent / 100, 1));
  const strokeDashoffset = circumference - clampedRatio * circumference;

  const handleCopy = async () => {
    try {
      const textToCopy =
        conversionDirection === 'gpa-to-pct'
          ? `GPA to Percentage: ${gpaInput || 0} / ${activeScale} scale = ${calculatedPercent.toFixed(2)}% (${tierColor.label})`
          : `Percentage to GPA: ${percentageInput || 0}% on ${activeScale} scale = ${calculatedGpa.toFixed(2)} GPA (${tierColor.label})`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setToast?.('Result copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setToast?.('Copy is unavailable in this browser.');
    }
  };

  // Quick switch direction and carry over current values
  const handleToggleDirection = () => {
    if (conversionDirection === 'gpa-to-pct') {
      setPercentageInput(String(calculatedPercent));
      setConversionDirection('pct-to-gpa');
    } else {
      setGpaInput(String(calculatedGpa));
      setConversionDirection('gpa-to-pct');
    }
  };

  return (
    <div className="tool-layout w-full max-w-full">
      {/* Left Input Configuration Card */}
      <section
        aria-label="GPA Conversion Inputs"
        className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col gap-6"
      >
        <div className="tool-card-head flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/60 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase block mb-1">
              Converter
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight m-0 flex items-center gap-2">
              <span>{conversionDirection === 'gpa-to-pct' ? 'GPA to Percentage' : 'Percentage to GPA'}</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm sm:text-base mt-1 m-0">
              Calculate dynamically from either angle with zero latency and instant tuning.
            </p>
          </div>

          {/* Direction Switcher Button */}
          <button
            type="button"
            className="bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700/60 rounded-full font-semibold shadow-sm px-4 py-2 transition-all inline-flex items-center gap-2 text-xs flex-shrink-0 cursor-pointer"
            onClick={handleToggleDirection}
            title="Switch conversion direction"
            aria-label="Switch between GPA to Percentage and Percentage to GPA"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Switch: {conversionDirection === 'gpa-to-pct' ? 'Find GPA from %' : 'Find % from GPA'}</span>
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {/* Primary Input with Contextual Quick Steppers, Sliders, and Presets */}
          {conversionDirection === 'gpa-to-pct' ? (
            <SmartCalculatorInput
              id="gpa-input-field"
              label="Your Current GPA"
              sublabel={`Scale: ${activeScale}`}
              value={gpaInput}
              onChange={setGpaInput}
              min={0}
              max={activeScale}
              step={0.01}
              showSteppers={true}
              stepperSteps={[0.1, 1]}
              showSlider={true}
              sliderMin={0}
              sliderMax={activeScale}
              sliderStep={0.05}
              defaultValue="3.6"
              presets={
                activeScale === 4.0
                  ? [4.0, 3.8, 3.5, 3.2, 3.0, 2.5]
                  : activeScale === 10.0
                  ? [9.5, 8.8, 8.0, 7.5, 6.5]
                  : [activeScale, Number((activeScale * 0.9).toFixed(1)), Number((activeScale * 0.75).toFixed(1))]
              }
              error={errorMsg}
              placeholder="e.g. 3.65"
            />
          ) : (
            <SmartCalculatorInput
              id="pct-input-field"
              label="Your Grade Percentage"
              sublabel="0% to 100%"
              unit="%"
              value={percentageInput}
              onChange={setPercentageInput}
              min={0}
              max={100}
              step={0.5}
              showSteppers={true}
              stepperSteps={[1, 5]}
              showSlider={true}
              sliderMin={50}
              sliderMax={100}
              sliderStep={1}
              defaultValue="90"
              presets={[95, 90, 85, 80, 75, 70]}
              error={errorMsg}
              placeholder="e.g. 92.5"
            />
          )}

          {/* Scale Selection Dropdown */}
          <div className="flex flex-col gap-2">
            <label htmlFor="gpa-scale-select" className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
              GPA Scale System
            </label>
            <select
              id="gpa-scale-select"
              className="w-full bg-[#F4F6F9] border border-stone-200/80 text-stone-900 rounded-[20px] px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all font-bold text-center text-base sm:text-sm shadow-inner cursor-pointer"
              value={selectedScalePreset}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedScalePreset(val);
                if (val !== 'custom') {
                  setCustomScaleInput(val);
                }
              }}
            >
              {PRESET_SCALES.map((scale) => (
                <option key={scale.value} value={scale.value}>
                  {scale.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Scale Input (When selected) */}
          {selectedScalePreset === 'custom' && (
            <div className="flex flex-col gap-2 bg-[#F8F9FA] dark:bg-slate-800/60 rounded-[24px] border border-stone-100 dark:border-slate-800 p-4">
              <label htmlFor="custom-scale-val" className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Enter Custom Maximum Scale:
              </label>
              <input
                id="custom-scale-val"
                className="w-full bg-[#F4F6F9] dark:bg-slate-800/90 border border-stone-200/80 dark:border-slate-700 text-stone-900 dark:text-white rounded-[20px] px-4 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-center text-base sm:text-sm shadow-inner placeholder:text-slate-400"
                type="number"
                inputMode="decimal"
                min="0.1"
                step="any"
                value={customScaleInput}
                onChange={(e) => setCustomScaleInput(e.target.value)}
                placeholder="e.g. 7.0 or 12.0"
              />
            </div>
          )}

          {/* Quick Preset Scale Chips */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
              Quick Scale Presets:
            </span>
            <SegmentedControl
              ariaLabel="Quick scale presets"
              variant="chips"
              size="sm"
              optionClassName="preset-btn"
              value={selectedScalePreset}
              onChange={(val) => {
                setSelectedScalePreset(val);
                if (val !== 'custom') setCustomScaleInput(val);
              }}
              options={[
                ...['4.0', '4.3', '5.0', '10.0'].map((val) => ({ value: val, label: `${val} Scale` })),
                { value: 'custom', label: 'Custom' },
              ]}
            />
          </div>
        </div>

        {/* Formula Explainer Footer */}
        <div className="border-t border-slate-200/60 dark:border-slate-800 mt-5 pt-5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Formula:</span>
            <span>
              {conversionDirection === 'gpa-to-pct' ? '(GPA ÷ Scale) × 100' : '(Percent ÷ 100) × Scale'}
            </span>
          </div>
          <span className="text-slate-400 font-medium">Auto-Calculated</span>
        </div>
      </section>

      {/* Right Result Card with Animated Circular Gauge */}
      <section
        aria-label="GPA Conversion Result"
        className="result-panel bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between"
        aria-live="polite"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
              {conversionDirection === 'gpa-to-pct' ? 'Converted Percentage' : 'Equivalent GPA'}
            </span>
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
                onClick={() => setShowTooltip((prev) => !prev)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                aria-label="Information regarding university grading formulas"
              >
                <HelpCircle className="w-4 h-4 text-primary" />
                <span className="text-[11px] underline">Methodology</span>
              </button>

              {/* Informational Hover-Card Tooltip */}
              {showTooltip && (
                <div
                  className="absolute right-0 top-7 z-30 w-72 p-3.5 rounded-xl bg-card border border-border shadow-xl text-xs text-foreground leading-relaxed animate-in fade-in zoom-in-95 duration-150"
                  role="tooltip"
                >
                  <div className="flex items-start gap-2 mb-1.5">
                    <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <strong className="text-foreground font-bold">University Formula Variations:</strong>
                  </div>
                  <p className="text-muted-foreground text-[11.5px]">
                    Different universities and international credential evaluation services (e.g., WES) may use non-linear conversion formulas or curved percent tables based on specific regional grading systems.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Animated Circular Progress Gauge - Master Output */}
          <div className="bg-[#DCE1EF] dark:bg-teal-950/60 border border-[#B0BAD9] dark:border-teal-800/60 rounded-[28px] p-5 shadow-sm my-4">
            <div className="gpa-gauge-container">
              <svg
                className="gpa-gauge-svg"
                width="210"
                height="210"
                viewBox="0 0 210 210"
                role="img"
                aria-label={`Percentage gauge: ${calculatedPercent.toFixed(1)}%`}
              >
                {/* Background Track */}
                <circle
                  className="gpa-gauge-track"
                  cx="105"
                  cy="105"
                  r={radius}
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Dynamic Animated Colored Arc */}
                <circle
                  className="gpa-gauge-indicator"
                  cx="105"
                  cy="105"
                  r={radius}
                  strokeWidth={strokeWidth}
                  stroke={tierColor.stroke}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>

              {/* Gauge Center Display */}
              <div className="gpa-gauge-center">
                {conversionDirection === 'gpa-to-pct' ? (
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl sm:text-5xl font-extrabold font-mono text-teal-950 dark:text-teal-100 tracking-tight">
                      <AnimatedCounter value={calculatedPercent} decimals={1} duration={350} />
                    </span>
                    <span className="text-xl font-bold font-mono text-teal-800 dark:text-teal-300 ml-1">%</span>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl sm:text-5xl font-extrabold font-mono text-teal-950 dark:text-teal-100 tracking-tight">
                      <AnimatedCounter value={calculatedGpa} decimals={2} duration={350} />
                    </span>
                    <span className="text-lg font-bold font-mono text-teal-700/80 dark:text-teal-300/80 ml-1">/{activeScale}</span>
                  </div>
                )}

                <span className={`text-[11px] font-bold font-mono mt-1 px-3 py-1 rounded-2xl border ${tierColor.badgeClass}`}>
                  {tierColor.label}
                </span>
              </div>
            </div>
          </div>

          {/* Result Remark & Linear Progress Bar */}
          <div className="mt-4 flex flex-col gap-2">
            <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(calculatedPercent, 100)}%`,
                  backgroundColor: tierColor.color,
                }}
              />
            </div>

            <div className="p-4 rounded-[20px] border border-black/5 dark:border-slate-800 text-xs leading-relaxed bg-[#F8F9FA] dark:bg-slate-800/60 text-stone-800 dark:text-stone-200">
              <div className="flex items-center gap-1.5 font-bold mb-0.5">
                <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Conversion Assessment:</span>
              </div>
              <p className="opacity-90">{tierColor.remark}</p>
            </div>
          </div>

          {/* Quick Metrics Comparison Table */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-[#FFE8C2] dark:bg-amber-950/55 rounded-[20px] p-4 border border-black/5 dark:border-amber-800/50 shadow-xs text-center">
              <strong className="block text-xl font-bold text-slate-800 dark:text-white font-mono">{calculatedGpa.toFixed(2)}</strong>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Equivalent GPA</span>
            </div>
            <div className="bg-[#D6E1FF] dark:bg-indigo-950/55 rounded-[20px] p-4 border border-black/5 dark:border-indigo-800/50 shadow-xs text-center">
              <strong className="block text-xl font-bold text-slate-800 dark:text-white font-mono">{calculatedPercent.toFixed(1)}%</strong>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Percentage</span>
            </div>
          </div>
        </div>

        {/* Action Button: Copy Result */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            className="w-full min-h-[48px] py-3 px-6 rounded-full bg-[#4C5985] hover:bg-[#3D476B] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold shadow-md text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            onClick={handleCopy}
            title="Copy percentage and GPA conversion result"
            aria-label="Copy percentage conversion result"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Result</span>
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};
