import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';

interface ScrollableTableContainerProps {
  children: React.ReactNode;
  className?: string;
  tableWrapperClassName?: string;
  ariaLabel?: string;
}

export const ScrollableTableContainer: React.FC<ScrollableTableContainerProps> = ({
  children,
  className = '',
  tableWrapperClassName = '',
  ariaLabel = 'Scrollable table',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // Buffer of 2px to avoid float rounding edge-cases
    const maxScroll = scrollWidth - clientWidth;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(maxScroll - scrollLeft > 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    // ResizeObserver catches dynamic container width shifts (e.g. orientation change, resize, font loads)
    const resizeObserver = new ResizeObserver(() => {
      checkScroll();
    });
    resizeObserver.observe(el);

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  return (
    <div className={`relative group ${className}`}>
      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label={ariaLabel}
        className={`overflow-x-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl ${tableWrapperClassName}`}
      >
        {children}
      </div>

      {/* Left Fade Gradient (appears when scrolled right) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-10 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent transition-opacity duration-300 rounded-l-xl ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Right Fade Gradient (disappears once scrolled to the end) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent transition-opacity duration-300 flex items-center justify-end pr-1 sm:pr-2 rounded-r-xl ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="p-1 rounded-full bg-slate-900/10 dark:bg-white/10 text-slate-500 dark:text-slate-400 backdrop-blur-xs animate-pulse sm:hidden">
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
