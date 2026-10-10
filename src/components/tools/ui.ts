/** Shared Tailwind class strings (premium pass: emerald focus ring, colored button shadow, hover lift).
 *  Segmented toggles now use <SegmentedControl /> from '../ui/SegmentedControl'.
 *  Shared Tailwind class strings for the dedicated academic tools (matches the existing card/input look).
 *  Every interactive control is at least 48px tall and 14px text. */
export const CARD =
  'glow-surface bg-white dark:bg-slate-900 rounded-[28px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-5 sm:p-8';
export const LABEL =
  'text-xs font-semibold tracking-widest text-slate-700 dark:text-slate-300 uppercase block mb-1.5';
export const INPUT =
  'w-full h-12 min-h-[48px] bg-[#F0F2F5] dark:bg-slate-800 border-2 border-transparent text-stone-900 dark:text-white rounded-2xl px-4 focus:bg-white dark:focus:bg-slate-900 focus:border-transparent focus:ring-2 focus:ring-teal-500/40 transition-all font-bold text-lg text-center placeholder:text-slate-500 dark:placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
export const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 min-h-[48px] bg-[#4C5985] hover:bg-[#3D476B] dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-full font-bold shadow-md shadow-teal-600/20 hover:brightness-110 px-6 py-3 text-sm transition-all duration-300 active:scale-95 cursor-pointer';
export const PILL_ON =
  'inline-flex items-center justify-center min-h-[48px] bg-teal-700 dark:bg-teal-600 text-white rounded-full font-bold px-5 py-3 text-sm shadow-md shadow-teal-600/25 cursor-pointer';
export const PILL_OFF =
  'inline-flex items-center justify-center min-h-[48px] bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 hover:text-teal-700 hover:-translate-y-0.5 dark:hover:bg-slate-700 rounded-full font-semibold px-5 py-3 text-sm cursor-pointer transition-all duration-300';
export const RESULT_BOX =
  'glow-surface bg-[#DCE1EF] dark:bg-teal-950/60 border border-[#B0BAD9] dark:border-teal-800/60 rounded-[24px] p-5 shadow-sm';
export const SWITCH_ROW =
  'inline-flex items-center gap-3 min-h-[48px] text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer select-none';
export const ERROR_TEXT = 'text-sm text-rose-700 dark:text-rose-400 m-0';
export const WARN_TEXT = 'text-sm text-amber-800 dark:text-amber-300 m-0';
