/** Shared Tailwind class strings — unified single-violet system (2026-10-25 rebrand).
 *  One accent only: brand violet #6D28D9 (light) / #A78BFA (dark, via the teal
 *  token alias in coursera.css). Neutrals are slate/stone greys; fields sit on
 *  the warm canvas in white with a violet focus ring.
 *  Segmented toggles now use <SegmentedControl /> from '../ui/SegmentedControl'.
 *  Every interactive control is at least 48px tall and 14px text. */
export const CARD =
  'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-9';
export const LABEL =
  'text-xs font-semibold tracking-widest text-slate-700 dark:text-slate-300 uppercase block mb-1.5';
export const INPUT =
  'w-full h-12 min-h-[48px] bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-stone-900 dark:text-white rounded-2xl px-4 focus:bg-white dark:focus:bg-slate-900 focus:border-transparent focus:ring-2 focus:ring-[#6D28D9]/40 dark:focus:ring-[#A78BFA]/50 transition-all font-bold text-lg text-center placeholder:text-slate-500 dark:placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
export const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 min-h-[48px] bg-[#6D28D9] hover:bg-[#5B21B6] dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-full font-bold shadow-md shadow-[#6D28D9]/25 px-6 py-3 text-sm cursor-pointer';
export const PILL_ON =
  'inline-flex items-center justify-center min-h-[48px] bg-[#6D28D9] hover:bg-[#5B21B6] dark:bg-[#A78BFA] dark:text-slate-950 text-white rounded-full font-bold px-5 py-3 text-sm cursor-pointer';
export const PILL_OFF =
  'inline-flex items-center justify-center min-h-[48px] bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:text-[#6D28D9] hover:border-[#6D28D9]/60 dark:hover:bg-slate-700 rounded-full font-semibold px-5 py-3 text-sm cursor-pointer transition-all duration-300';
export const RESULT_BOX =
  'bg-[#F5F3FF] dark:bg-teal-950/60 border border-[#DDD6FE] dark:border-teal-800/60 rounded-2xl p-5 shadow-sm';
export const SWITCH_ROW =
  'inline-flex items-center gap-3 min-h-[48px] text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer select-none';
export const ERROR_TEXT = 'text-sm text-rose-700 dark:text-rose-400 m-0';
export const WARN_TEXT = 'text-sm text-amber-800 dark:text-amber-300 m-0';
