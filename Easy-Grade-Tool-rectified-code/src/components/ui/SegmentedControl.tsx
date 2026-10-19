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
   * track: options sit in a soft slate track and a surface-coloured pill slides under the active one.
   * chips: separate bordered chips that wrap onto rows; a filled brand pill slides to the active chip.
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
    : { duration: 0.45, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] };

  const isTrack = variant === 'track';
  const wrapClass = isTrack
    ? `${fill ? 'grid' : 'inline-flex'} items-center gap-1 rounded-full border border-line bg-sunken p-1 ${className}`
    : `flex flex-wrap items-center gap-2 ${className}`;

  const pillClass = isTrack
    ? 'absolute inset-0 -z-10 rounded-full border border-line bg-surface shadow-sm'
    : 'absolute inset-0 -z-10 rounded-full bg-brand';

  return (
    <LayoutGroup id={groupId}>
      <div
        role="group"
        aria-label={ariaLabel}
        className={wrapClass}
        style={fill ? { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` } : undefined}
      >
        {prefix && (
          <span className="pl-3 pr-1 text-xs font-semibold text-ink-2">{prefix}</span>
        )}
        {options.map((opt) => {
          const active = value === opt.value && !opt.disabledSelection;
          const activeText = isTrack
            ? 'font-semibold text-brand-ink'
            : 'font-semibold text-on-brand';
          const inactiveText = isTrack
            ? 'font-semibold text-ink-2 hover:text-ink'
            : 'font-semibold text-ink-2 hover:bg-sunken border border-line-strong bg-surface';
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
              className={`relative isolate inline-flex cursor-pointer select-none touch-manipulation items-center justify-center whitespace-nowrap rounded-full px-4 text-sm min-w-[44px] ${
                size === 'md' ? 'min-h-[48px] py-2' : 'min-h-[44px] py-1.5'
              } ${active ? activeText : `${inactiveText} transition-colors`} ${optionClassName}`}
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
