import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  Delete,
  Sparkles,
  Vibrate,
  X,
  Check,
} from 'lucide-react';
import { triggerHapticFeedback, DEFAULT_HAPTIC_DURATION } from '../utils/haptics';

interface NumericKeypadProps {
  className?: string;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeInput, setActiveInput] = useState<HTMLInputElement | null>(null);
  const [activeLabel, setActiveLabel] = useState<string>('Calculator Input');
  const [currentVal, setCurrentVal] = useState<string>('');
  const keypadRef = useRef<HTMLDivElement>(null);

  // Helper to safely set native value and dispatch synthetic React input events
  const setNativeInputValue = useCallback((input: HTMLInputElement, value: string) => {
    const valueSetter = Object.getOwnPropertyDescriptor(input, 'value')?.set;
    const prototype = Object.getPrototypeOf(input);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

    if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(input, value);
    } else if (valueSetter) {
      valueSetter.call(input, value);
    } else {
      input.value = value;
    }

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    setCurrentVal(value);
  }, []);

  // Track the most recently focused numeric input on the page
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.tagName !== 'INPUT') return;
      const input = target as HTMLInputElement;

      // Check if it's a numeric/calculator input
      const isNumeric =
        input.type === 'number' ||
        input.inputMode === 'numeric' ||
        input.inputMode === 'decimal' ||
        input.classList.contains('smart-calc-input');

      if (isNumeric) {
        setActiveInput(input);
        setCurrentVal(input.value);

        // Derive descriptive label
        const parentLabel =
          input.getAttribute('aria-label') ||
          input.getAttribute('placeholder') ||
          input.closest('.flex-col')?.querySelector('label')?.textContent ||
          'Calculator Field';
        setActiveLabel(parentLabel.replace(/[\n\r]+/g, ' ').trim());
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target === activeInput) {
        setCurrentVal((target as HTMLInputElement).value);
      }
    };

    document.addEventListener('focusin', handleFocusIn, { passive: true });
    document.addEventListener('input', handleInput, { passive: true });

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('input', handleInput);
    };
  }, [activeInput]);

  // Find a fallback input if none is currently focused
  const getTargetInput = useCallback((): HTMLInputElement | null => {
    if (activeInput && document.body.contains(activeInput)) {
      return activeInput;
    }
    // Find first visible number or numeric input on the page
    const visibleInput = document.querySelector<HTMLInputElement>(
      'main input[type="number"], main input[inputmode="numeric"], main input[inputmode="decimal"], main input.smart-calc-input'
    );
    if (visibleInput) {
      setActiveInput(visibleInput);
      setCurrentVal(visibleInput.value);
      return visibleInput;
    }
    return null;
  }, [activeInput]);

  // Handle keypad button taps with haptic feedback
  const handleKeyPress = (key: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent blur of the input field
    triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);

    const input = getTargetInput();
    if (!input) return;

    const val = input.value || '';

    if (key === 'backspace') {
      const next = val.slice(0, -1);
      setNativeInputValue(input, next);
    } else if (key === 'clear') {
      setNativeInputValue(input, '');
    } else if (key === 'plus-minus') {
      if (val.startsWith('-')) {
        setNativeInputValue(input, val.substring(1));
      } else if (val) {
        setNativeInputValue(input, `-${val}`);
      }
    } else if (key === '.') {
      if (!val.includes('.')) {
        setNativeInputValue(input, val ? `${val}.` : '0.');
      }
    } else if (key === '00') {
      if (val && val !== '0') {
        setNativeInputValue(input, `${val}00`);
      }
    } else if (key === 'done') {
      setIsOpen(false);
      input.blur();
    } else {
      // Numbers 0-9
      if (val === '0' && key !== '.') {
        setNativeInputValue(input, key);
      } else {
        setNativeInputValue(input, `${val}${key}`);
      }
    }
  };

  const keypadButtons = [
    { label: '7', key: '7' },
    { label: '8', key: '8' },
    { label: '9', key: '9' },
    { label: '⌫', key: 'backspace', icon: Delete, special: true },

    { label: '4', key: '4' },
    { label: '5', key: '5' },
    { label: '6', key: '6' },
    { label: 'C', key: 'clear', special: true },

    { label: '1', key: '1' },
    { label: '2', key: '2' },
    { label: '3', key: '3' },
    { label: '±', key: 'plus-minus', special: true },

    { label: '0', key: '0' },
    { label: '.', key: '.' },
    { label: '00', key: '00' },
    { label: '✓', key: 'done', icon: Check, action: true },
  ];

  return (
    <div
      ref={keypadRef}
      className={`fixed bottom-4 right-4 z-40 font-sans print:hidden select-none ${className}`}
    >
      {/* Floating Toggle Button when closed */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
            getTargetInput();
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-teal-800/95 hover:bg-teal-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-xl shadow-teal-900/25 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide transition-all transform hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
          title="Open tactile numeric keypad with haptic vibration"
          aria-label="Open tactile numeric keypad"
        >
          <Calculator className="w-4 h-4 text-indigo-300 dark:text-white" />
          <span>Numeric Keypad</span>
          <span className="flex items-center gap-0.5 text-[10px] text-indigo-200 dark:text-indigo-100 bg-white/10 px-1.5 py-0.5 rounded-md font-mono">
            <Vibrate className="w-2.5 h-2.5" />
            20ms
          </span>
        </button>
      )}

      {/* Expanded Keypad Drawer / Card */}
      {isOpen && (
        <div className="w-[300px] sm:w-[320px] rounded-3xl overflow-hidden p-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Tactile Keypad
              </span>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold"
                title="Haptic feedback: 20ms vibration on keypress"
              >
                <Vibrate className="w-2.5 h-2.5 animate-pulse" />
                20ms haptic
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHapticFeedback(DEFAULT_HAPTIC_DURATION);
                setIsOpen(false);
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close keypad"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Target Display Preview */}
          <div className="mb-3 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-white dark:border-slate-700/60 shadow-xs flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
              {activeLabel}
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-base truncate">
              {currentVal !== '' ? currentVal : '0'}
            </span>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-4 gap-2">
            {keypadButtons.map((btn) => {
              const Icon = btn.icon;

              let btnStyle =
                'bg-white/95 dark:bg-slate-800/90 text-slate-800 dark:text-white border-white dark:border-slate-700/60 shadow-sm hover:bg-indigo-50 dark:hover:bg-slate-700';
              if (btn.special) {
                btnStyle =
                  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/50 shadow-xs hover:bg-slate-200 dark:hover:bg-slate-700';
              }
              if (btn.action) {
                btnStyle =
                  'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-700 shadow-md shadow-indigo-600/30';
              }

              return (
                <button
                  key={btn.key}
                  type="button"
                  onPointerDown={() => triggerHapticFeedback(DEFAULT_HAPTIC_DURATION)}
                  onClick={(e) => handleKeyPress(btn.key, e)}
                  className={`h-11 sm:h-12 rounded-xl font-mono text-base font-bold flex items-center justify-center border transition-all duration-75 active:scale-90 touch-manipulation cursor-pointer select-none ${btnStyle}`}
                  aria-label={btn.label}
                >
                  {Icon ? <Icon className="w-4 h-4" /> : btn.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
