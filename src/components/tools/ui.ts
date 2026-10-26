/** Shared Tailwind class strings — NOVA system (2026-10-26 full overhaul).
 *  One accent only: brand blue #0056D2 (light) / #2E7CF6 + #6EA8FF (dark).
 *  Neutrals are ink/white/grey; fields sit on white with a blue focus ring.
 *  Segmented toggles use <SegmentedControl /> from '../ui/SegmentedControl'.
 *  Every interactive control is at least 48px tall and 14px text. */
export const CARD =
  'bg-white dark:bg-[#131C2E] rounded-[20px] border border-[#E7E9EE] dark:border-white/10 shadow-sm p-6 sm:p-9';
export const LABEL =
  'text-xs font-semibold tracking-widest text-[#5B6472] dark:text-slate-300 uppercase block mb-1.5';
export const INPUT =
  'w-full h-12 min-h-[48px] bg-white dark:bg-[#1A2438] border-[1.5px] border-[#E2E6EC] dark:border-white/10 text-[#0B1220] dark:text-white rounded-xl px-4 focus:bg-white dark:focus:bg-[#101828] focus:border-[#0056D2] dark:focus:border-[#6EA8FF] focus:ring-4 focus:ring-[#0056D2]/15 dark:focus:ring-[#6EA8FF]/25 transition-all font-bold text-lg text-center placeholder:text-slate-500 dark:placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
export const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 min-h-[48px] bg-[#0056D2] hover:bg-[#00419E] dark:bg-[#2E7CF6] dark:hover:bg-[#6EA8FF] dark:hover:text-[#0B1220] text-white rounded-full font-bold shadow-md shadow-[#0056D2]/25 px-6 py-3 text-sm cursor-pointer transition-all hover:-translate-y-px hover:shadow-lg active:translate-y-0 active:scale-[0.97]';
export const PILL_ON =
  'inline-flex items-center justify-center min-h-[48px] bg-[#0056D2] hover:bg-[#00419E] dark:bg-[#2E7CF6] dark:text-white text-white rounded-full font-bold px-5 py-3 text-sm cursor-pointer';
export const PILL_OFF =
  'inline-flex items-center justify-center min-h-[48px] bg-white dark:bg-[#1A2438] text-[#3D4657] dark:text-slate-300 border border-[#E2E6EC] dark:border-white/10 hover:text-[#0056D2] hover:border-[#0056D2]/60 dark:hover:bg-white/5 rounded-full font-semibold px-5 py-3 text-sm cursor-pointer transition-all duration-300';
export const RESULT_BOX =
  'bg-[#EEF4FF] dark:bg-[#12294D] border border-[#C9DCF7] dark:border-[#25457A] rounded-[20px] p-5 shadow-sm';
export const SWITCH_ROW =
  'inline-flex items-center gap-3 min-h-[48px] text-sm font-medium text-[#3D4657] dark:text-slate-200 cursor-pointer select-none';
export const ERROR_TEXT = 'text-sm text-rose-700 dark:text-rose-400 m-0';
export const WARN_TEXT = 'text-sm text-amber-800 dark:text-amber-300 m-0';
