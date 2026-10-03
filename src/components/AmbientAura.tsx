import React, { memo } from 'react';

export const AmbientAura: React.FC = memo(() => {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none contain-strict"
      aria-hidden="true"
    >
      {/* Soft Neutral Aura */}
      <div
        className="absolute -top-12 -left-12 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-slate-200/25 dark:bg-slate-500/10 blur-3xl opacity-30 -z-10"
      />
      {/* Soft Cool Grey Aura */}
      <div
        className="absolute top-1/4 -right-16 w-80 sm:w-[26rem] h-80 sm:h-[26rem] rounded-full bg-gray-200/20 dark:bg-gray-500/10 blur-3xl opacity-25 -z-10"
      />
      {/* Gentle Neutral Tint */}
      <div
        className="absolute -bottom-12 left-1/3 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-slate-200/25 dark:bg-slate-700/10 blur-3xl opacity-20 -z-10"
      />
    </div>
  );
});

AmbientAura.displayName = 'AmbientAura';

