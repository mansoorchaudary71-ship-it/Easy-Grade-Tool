import React, { useCallback } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { parseNumber } from '../utils/formatters';
import { triggerHapticFeedback, handleNumericKeyDownHaptic, DEFAULT_HAPTIC_DURATION } from '../utils/haptics';

export interface QuickPresetOption {
  label: string;
  value: number | string;
}

export interface SmartCalculatorInputProps {
  id?: string;
  label?: string;
  sublabel?: string;
  unit?: string;
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  ariaLabel?: string;
  // Contextual stepper buttons configuration
  showSteppers?: boolean;
  stepperSteps?: number[]; // e.g. [1] or [0.1, 1] or [0.5, 1]
  // Optional slider for visual rapid tuning
  showSlider?: boolean;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  // Optional one-tap preset chips
  presets?: (number | string | QuickPresetOption)[];
  // Reset button support
  defaultValue?: string | number;
  className?: string;
  containerClassName?: string;
  inputMode?: 'decimal' | 'numeric' | 'text';
}

export const SmartCalculatorInput: React.FC<SmartCalculatorInputProps> = ({
  id,
  label,
  sublabel,
  unit,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder = '0',
  disabled = false,
  error,
  ariaLabel,
  showSteppers = true,
  stepperSteps = [1],
  showSlider = false,
  sliderMin = 0,
  sliderMax = 100,
  sliderStep,
  presets,
  defaultValue,
  className = '',
  containerClassName = '',
  inputMode = 'decimal',
}) => {
  const numVal = parseNumber(String(value));
  const isValidNum = !isNaN(numVal);

  const clampValue = useCallback(
    (val: number): number => {
      let clamped = val;
      if (typeof min === 'number') clamped = Math.max(min, clamped);
      if (typeof max === 'number') clamped = Math.min(max, clamped);
      return clamped;
    },
    [min, max]
  );

  const handleAdjust = useCallback(
    (delta: number) => {
      triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
      const current = isValidNum ? numVal : 0;
      // Round to 4 decimal places to prevent floating point inaccuracies like 0.30000000000000004
      const nextRaw = current + delta;
      const precision = Math.max(
        (String(delta).split('.')[1] || '').length,
        (String(current).split('.')[1] || '').length
      );
      const rounded = Number(nextRaw.toFixed(Math.min(precision, 4)));
      const finalVal = clampValue(rounded);
      onChange(String(finalVal));
    },
    [isValidNum, numVal, clampValue, onChange]
  );

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleReset = () => {
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
    if (defaultValue !== undefined) {
      onChange(String(defaultValue));
    }
  };

  // Filter stepper steps into negative and positive
  const sortedSteps = [...stepperSteps].sort((a, b) => b - a);

  return (
    <div className={`smart-calc-field flex flex-col gap-1.5 w-full min-w-0 ${containerClassName}`}>
      {/* Header Label Row */}
      {(label || sublabel || defaultValue !== undefined) && (
        <div className="smart-calc-label-row flex items-center justify-between gap-2">
          {label && (
            <label
              htmlFor={id}
              className="text-xs font-semibold tracking-wider text-slate-800 dark:text-slate-200 uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <span>{label}</span>
              {unit && <span className="text-slate-600 dark:text-slate-400 font-mono font-normal">({unit})</span>}
            </label>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {sublabel && (
              <span className="text-xs font-medium tracking-wider text-slate-600 dark:text-slate-400 uppercase">
                {sublabel}
              </span>
            )}
            {defaultValue !== undefined && String(value) !== String(defaultValue) && (
              <button
                type="button"
                className="text-[11px] font-semibold text-stone-700 hover:bg-stone-50 inline-flex items-center gap-1 transition-colors px-3 py-1 rounded-full border border-stone-200 bg-white shadow-xs cursor-pointer"
                onClick={handleReset}
                title={`Reset to default (${defaultValue})`}
                aria-label={`Reset to default ${defaultValue}`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Input Control Bar with Integrated Steppers */}
      <div
        className={`smart-calc-control-group flex items-center gap-2 transition-all duration-200 ${
          error ? 'border-destructive ring-2 ring-destructive/30 rounded-2xl' : ''
        }`}
      >
        {/* Decrement Stepper Buttons (Secondary Action: bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 rounded-full font-semibold shadow-sm) */}
        {showSteppers &&
          sortedSteps.map((stepVal) => {
            const isMin = typeof min === 'number' && isValidNum && numVal <= min;
            return (
              <button
                key={`minus-${stepVal}`}
                type="button"
                className="smart-stepper-btn stepper-btn-minus px-4 py-2.5 min-w-[44px] min-h-[44px] bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 rounded-full font-semibold shadow-sm flex items-center justify-center font-mono text-xs transition-colors duration-150 disabled:opacity-30 disabled:pointer-events-none select-none touch-manipulation flex-shrink-0 cursor-pointer active:scale-95"
                onClick={() => handleAdjust(-stepVal)}
                disabled={disabled || isMin}
                title={`Decrease by ${stepVal}`}
                aria-label={`Decrease by ${stepVal}`}
              >
                {stepVal === 1 ? (
                  <Minus className="w-3.5 h-3.5" />
                ) : (
                  <span>-{stepVal}</span>
                )}
              </button>
            );
          })}

        {/* Primary Number Input Field */}
        <div className="relative flex-1 min-w-0 flex items-center">
          <input
            id={id}
            className={`smart-calc-input w-full bg-[#F0F2F5] border-2 border-transparent text-stone-900 rounded-full px-5 py-3.5 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 text-center font-mono font-bold text-base sm:text-lg outline-none tabular-nums placeholder:text-slate-400 transition-all duration-200 ${className}`}
            type="number"
            inputMode={inputMode}
            step={step}
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleNumericKeyDownHaptic}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={ariaLabel || label}
            aria-invalid={Boolean(error)}
          />
          {unit && (
            <span className="smart-calc-unit-badge absolute right-3.5 text-xs font-mono font-semibold text-slate-700 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-full pointer-events-none select-none shadow-2xs">
              {unit}
            </span>
          )}
        </div>

        {/* Increment Stepper Buttons (Primary Action: bg-[#1A1C1E] hover:bg-black text-white rounded-full font-bold shadow-md) */}
        {showSteppers &&
          [...sortedSteps].reverse().map((stepVal) => {
            const isMax = typeof max === 'number' && isValidNum && numVal >= max;
            return (
              <button
                key={`plus-${stepVal}`}
                type="button"
                className="smart-stepper-btn stepper-btn-plus px-4 py-2.5 min-w-[44px] min-h-[44px] bg-[#1A1C1E] hover:bg-black text-white rounded-full font-bold shadow-md flex items-center justify-center font-mono text-xs transition-colors duration-150 disabled:opacity-30 disabled:pointer-events-none select-none touch-manipulation flex-shrink-0 cursor-pointer active:scale-95"
                onClick={() => handleAdjust(stepVal)}
                disabled={disabled || isMax}
                title={`Increase by ${stepVal}`}
                aria-label={`Increase by ${stepVal}`}
              >
                {stepVal === 1 ? (
                  <Plus className="w-3.5 h-3.5" />
                ) : (
                  <span>+{stepVal}</span>
                )}
              </button>
            );
          })}
      </div>

      {/* Optional Range Slider for Tactile Touch Tuning */}
      {showSlider && (
        <div className="smart-calc-slider-wrap flex items-center gap-2 pt-1 px-1">
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={sliderStep || step || 1}
            value={isValidNum ? Math.max(sliderMin, Math.min(sliderMax, numVal)) : sliderMin}
            onChange={handleSliderChange}
            disabled={disabled}
            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            aria-label={`${label || 'Value'} range slider`}
          />
        </div>
      )}

      {/* Optional One-Tap Preset Chips */}
      {presets && presets.length > 0 && (
        <div
          className="smart-calc-presets flex flex-wrap gap-1.5 pt-1 overflow-x-auto max-w-full"
          style={{ scrollbarWidth: 'none' }}
        >
          {presets.map((preset) => {
            const presetLabel = typeof preset === 'object' ? preset.label : String(preset);
            const presetVal = typeof preset === 'object' ? preset.value : preset;
            const isActive = String(value) === String(presetVal);

            return (
              <button
                key={String(presetVal)}
                type="button"
                className={`preset-btn text-xs px-4 py-1.5 font-mono transition-all touch-manipulation cursor-pointer ${
                  isActive
                    ? 'bg-[#1A1C1E] text-white rounded-full font-bold shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 rounded-full font-semibold shadow-sm'
                }`}
                onClick={() => {
                  triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                  onChange(String(presetVal));
                }}
                disabled={disabled}
              >
                {presetLabel}
              </button>
            );
          })}
        </div>
      )}

      {/* Inline Validation Error Message */}
      {error && (
        <p className="smart-calc-error text-xs font-semibold text-destructive mt-0.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
