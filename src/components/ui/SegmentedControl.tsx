import React, { useId } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: React.ReactNode;
  /** Optional accessible name when the visible label is terse (e.g. "A–F"). */
  ariaLabel?: string;
  /** Extra side effect when this option is chosen (haptics, toasts, ...). Runs before onChange. */
  onSelect?: () => void;
  /** Mark an option as not selected even if its value matches (e.g. an invalid preset). */
  disabledSelection?: boolean;
}

interface SegmentedControlProps<T extends string | number> {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T | null | undefined;
  onChange: (value: T) => void;
  /** Accessible name of the group. */
  ariaLabel: string;
  /**
   * track: options sit in a soft slate track and a white "floating" pill slides under the active one.
   * chips: separate bordered chips that wrap onto rows; a filled emerald pill slides to the active chip.
   */
  variant?: 'track' | 'chips';
  /** Stretch options to share the full width equally (track variant). */
  fill?: boolean;
  /** md = 48px touch target, sm = 44px. */
  size?: 'md' | 'sm';
  /** Optional text shown at the start of the track (e.g. "A+ grade value:"). */
  prefix?: React.ReactNode;
  className?: string;
  /** Class added to every option button (e.g. "preset-btn"). */
  optionClassName?: string;
}

const focusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900';

/**
 * Accessible segmented control with a fluid, sliding background (Framer Motion layout animation).
 * Keeps the existing semantics used across the tools: role="group" + aria-pressed buttons.
 */
export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  variant = 'track',
  fill = false,
  size = 'md',
  prefix,
  className = '',
  optionClassName = '',
}: SegmentedControlProps<T>) {
  const groupId = useId();
  const reduced = useReducedMotion();
  const transition = reduced
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.9 };

  const isTrack = variant === 'track';
  const wrapClass = isTrack
    ? `${fill ? 'grid' : 'inline-flex'} items-center gap-1 rounded-full border border-gray-200/70 bg-slate-100/80 p-1 dark:border-white/10 dark:bg-slate-800/80 ${className}`
    : `flex flex-wrap items-center gap-2 ${className}`;

  const pillClass = isTrack
    ? 'absolute inset-0 -z-10 rounded-full border border-gray-200/70 bg-white shadow-sm shadow-gray-400/20 dark:border-white/10 dark:bg-teal-600 dark:shadow-black/30'
    : 'absolute inset-0 -z-10 rounded-full bg-teal-700 shadow-md shadow-teal-600/25 dark:bg-teal-600';

  return (
    <LayoutGroup id={groupId}>
      <div
        role="group"
        aria-label={ariaLabel}
        className={wrapClass}
        style={fill ? { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` } : undefined}
      >
        {prefix && (
          <span className="pl-3 pr-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{prefix}</span>
        )}
        {options.map((opt) => {
          const active = value === opt.value && !opt.disabledSelection;
          const activeText = isTrack
            ? 'font-bold text-teal-900 dark:text-white'
            : 'font-bold text-white';
          const inactiveText = isTrack
            ? 'font-semibold text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-400'
            : 'font-semibold text-slate-700 hover:text-teal-700 dark:text-slate-200 dark:hover:text-teal-400 border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800';
          return (
            <button
              key={String(opt.value)}
              type="button"
              aria-pressed={active}
              aria-label={opt.ariaLabel}
              onClick={() => {
                opt.onSelect?.();
                onChange(opt.value);
              }}
              className={`relative isolate inline-flex cursor-pointer select-none touch-manipulation items-center justify-center whitespace-nowrap rounded-full px-4 text-sm [-webkit-tap-highlight-color:transparent] ${
                size === 'md' ? 'min-h-[48px] py-2' : 'min-h-[44px] py-1.5'
              } ${focusRing} ${active ? activeText : `${inactiveText} transition-all duration-300 hover:-translate-y-0.5`} ${optionClassName}`}
            >
              {active && (
                <motion.span
                  layoutId="segmented-active-pill"
                  className={pillClass}
                  transition={transition}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-2">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

export default SegmentedControl;
