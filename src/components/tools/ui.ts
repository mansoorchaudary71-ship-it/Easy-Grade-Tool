/** Shared Tailwind class strings — LUMEN system (light mode only).
 * One accent: Lumen blue #2457F5. Neutrals are ink / white / cool grey.
 * Cards are 24px spatial surfaces; fields are soft-filled and turn white with a blue ring on focus.
 *  Segmented toggles use <SegmentedControl /> from '../ui/SegmentedControl'.
 *  Every interactive control is at least 48px tall and 14px text. */
export const CARD =
  'bg-white rounded-[24px] border border-[#E3E8F6] shadow-[0_1px_2px_rgba(14,20,36,0.04),0_18px_40px_-22px_rgba(36,87,245,0.22)] p-5 sm:p-8';
export const LABEL =
  'text-xs font-semibold tracking-[0.12em] text-[#5A6480] uppercase block mb-1.5';
export const INPUT =
  'w-full h-12 min-h-[48px] bg-[#F5F7FF] border-[1.5px] border-[#E3E8F6] hover:border-[#C9D4F7] text-[#0E1424] rounded-2xl px-4 focus:bg-white focus:border-[#2457F5] focus:ring-4 focus:ring-[#2457F5]/15 transition-all font-bold text-lg text-center placeholder:text-slate-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
export const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 min-h-[48px] bg-[#2457F5] hover:bg-[#1A41C9] text-white rounded-full font-bold shadow-[0_10px_24px_-10px_rgba(36,87,245,0.6)] px-6 py-3 text-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-10px_rgba(36,87,245,0.7)] active:translate-y-0 active:scale-[0.97]';
export const PILL_ON =
  'inline-flex items-center justify-center min-h-[48px] bg-[#2457F5] hover:bg-[#1A41C9] text-white rounded-full font-bold px-5 py-3 text-sm cursor-pointer';
export const PILL_OFF =
  'inline-flex items-center justify-center min-h-[48px] bg-white text-[#2C3550] border border-[#E3E8F6] hover:text-[#2457F5] hover:border-[#2457F5]/50 hover:bg-[#F5F7FF] rounded-full font-semibold px-5 py-3 text-sm cursor-pointer transition-all duration-300';
export const RESULT_BOX =
  'bg-gradient-to-br from-[#EEF2FF] to-[#F7F3FF] border border-[#D5DEFF] rounded-[24px] p-5 sm:p-6';
export const SWITCH_ROW =
  'inline-flex items-center gap-3 min-h-[48px] text-sm font-medium text-[#2C3550] cursor-pointer select-none';
export const ERROR_TEXT = 'text-sm text-rose-700 m-0';
export const WARN_TEXT = 'text-sm text-amber-800 m-0';
