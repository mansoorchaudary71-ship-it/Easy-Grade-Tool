import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Settings2, X } from 'lucide-react';
import { parseNumber } from '../utils/formatters';
import { GradingScaleType } from '../types';

export interface GradeScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scaleType: GradingScaleType;
  thresholds: { A: number; B: number; C: number; D: number };
  onSave: (scaleType: GradingScaleType, thresholds: { A: number; B: number; C: number; D: number }) => void;
  setToast?: (msg: string) => void;
}

export const GradeScaleModal: React.FC<GradeScaleModalProps> = React.memo(({
  isOpen,
  onClose,
  scaleType,
  thresholds,
  onSave,
  setToast,
}) => {
  // 1. Conditional Rendering Check: If inactive / closed, return null immediately.
  // This prevents DOM bloating and ensures zero unnecessary re-renders when inactive.
  if (!isOpen) {
    return null;
  }

  return (
    <GradeScaleModalDialog
      onClose={onClose}
      scaleType={scaleType}
      thresholds={thresholds}
      onSave={onSave}
      setToast={setToast}
    />
  );
});

// Separate inner dialog component instantiated only when modal is active
const GradeScaleModalDialog: React.FC<{
  onClose: () => void;
  scaleType: GradingScaleType;
  thresholds: { A: number; B: number; C: number; D: number };
  onSave: (scaleType: GradingScaleType, thresholds: { A: number; B: number; C: number; D: number }) => void;
  setToast?: (msg: string) => void;
}> = ({ onClose, scaleType, thresholds, onSave, setToast }) => {
  const [draftScaleType, setDraftScaleType] = useState<GradingScaleType>(scaleType);
  const [draftThresholds, setDraftThresholds] = useState<{ A: number; B: number; C: number; D: number }>({
    ...thresholds,
  });
  const [isMounted, setIsMounted] = useState(false);

  // Trigger subtle fade-in on appearance
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Lock body scroll while modal is active; restores on unmount
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Threshold validation logic ensuring strict descending order: 100 >= A > B > C > D > F (0%)
  const thresholdValidationError = useMemo<string | null>(() => {
    if (draftScaleType !== 'standard') return null;
    const { A, B, C, D } = draftThresholds;
    if (isNaN(A) || isNaN(B) || isNaN(C) || isNaN(D)) {
      return 'All grade thresholds must be valid numbers.';
    }
    if (A > 100) {
      return 'Grade A threshold cannot exceed 100%.';
    }
    if (D <= 0) {
      return 'Grade D threshold must be greater than 0% (Grade F).';
    }
    if (A <= B) {
      return 'Thresholds must not overlap: Grade A must be strictly greater than Grade B (A > B).';
    }
    if (B <= C) {
      return 'Thresholds must not overlap: Grade B must be strictly greater than Grade C (B > C).';
    }
    if (C <= D) {
      return 'Thresholds must not overlap: Grade C must be strictly greater than Grade D (C > D).';
    }
    return null;
  }, [draftScaleType, draftThresholds]);

  const handleSave = () => {
    if (thresholdValidationError) {
      setToast?.(thresholdValidationError);
      return;
    }
    onSave(draftScaleType, draftThresholds);
    onClose();
  };

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      id="grade-scale-modal"
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0E1424]/35 backdrop-blur-sm transition-opacity duration-200 ease-out ${
        isMounted ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scale-modal-title"
    >
      <div
        className={`w-full max-w-md bg-white rounded-[32px] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-7 space-y-5 transition-all duration-200 ease-out font-sans max-h-[90vh] overflow-y-auto ${
          isMounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 ">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-stone-800 " />
            <h3 id="scale-modal-title" className="text-lg font-bold text-slate-800 ">
              Grade Scale Settings
            </h3>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close grade scale settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scale Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Scale System
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-stone-100/80 border border-stone-200 ">
            <button
              type="button"
              className={`rounded-full text-xs cursor-pointer ${
                draftScaleType === 'standard'
                  ? 'bg-[#2457F5] text-white rounded-full font-bold px-4 py-2 shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 rounded-full font-semibold shadow-sm px-4 py-2 transition-all'
              }`}
              onClick={() => setDraftScaleType('standard')}
            >
              Standard (A–F)
            </button>
            <button
              type="button"
              className={`rounded-full text-xs cursor-pointer ${
                draftScaleType === 'plus'
                  ? 'bg-[#2457F5] text-white rounded-full font-bold px-4 py-2 shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 rounded-full font-semibold shadow-sm px-4 py-2 transition-all'
              }`}
              onClick={() => setDraftScaleType('plus')}
            >
              Plus / Minus (+/−)
            </button>
          </div>
        </div>

        {/* Custom Threshold Adjusters */}
        {draftScaleType === 'standard' && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 block">
                Minimum Percentage Thresholds:
              </span>
              <span className="text-xs font-mono font-medium text-slate-500 ">
                A &gt; B &gt; C &gt; D &gt; F
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['A', 'B', 'C', 'D'] as const).map((grade) => (
                <div key={grade} className="flex flex-col gap-1.5">
                  <label htmlFor={`thresh-${grade}`} className="text-xs font-semibold font-mono text-slate-500 ">
                    Grade {grade} (Min %)
                  </label>
                  <input
                    id={`thresh-${grade}`}
                    type="number"
                    min="0"
                    max="100"
                    className={`w-full min-h-[44px] bg-[#F4F6F9] border border-stone-200/80 text-stone-900 rounded-[20px] px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-[#2457F5] focus:border-[#2457F5] shadow-inner font-mono font-bold text-center transition-all duration-200 text-base sm:text-sm ${
                      thresholdValidationError
                        ? 'border-rose-400 ring-2 ring-rose-400'
                        : ''
                    }`}
                    value={draftThresholds[grade]}
                    onChange={(e) => {
                      const val = parseNumber(e.target.value);
                      setDraftThresholds((prev) => ({
                        ...prev,
                        [grade]: isNaN(val) ? 0 : val,
                      }));
                    }}
                  />
                </div>
              ))}
            </div>

            {thresholdValidationError && (
              <div className="text-xs font-semibold text-rose-600 bg-rose-50/90 border border-rose-200/80 rounded-2xl p-2.5 flex items-start gap-2 animate-in fade-in duration-150">
                <span className="shrink-0 text-sm">⚠️</span>
                <span className="leading-snug">{thresholdValidationError}</span>
              </div>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
          <button
            type="button"
            className="text-xs font-semibold px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-sm transition-all cursor-pointer"
            onClick={() => {
              setDraftThresholds({ A: 90, B: 80, C: 70, D: 60 });
              setDraftScaleType('standard');
            }}
          >
            Reset Defaults
          </button>

          <button
            type="button"
            disabled={!!thresholdValidationError}
            className={`text-xs font-bold py-2.5 px-6 rounded-full shadow-md transition-all ${
              thresholdValidationError
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                : 'bg-[#2457F5] hover:bg-[#1A41C9] text-white cursor-pointer active:scale-95'
            }`}
            onClick={handleSave}
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
