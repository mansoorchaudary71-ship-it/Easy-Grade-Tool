import React, { useRef, useState, useEffect, useCallback } from 'react';

interface ScrollableTableContainerProps {
  children: React.ReactNode;
  className?: string;
  tableWrapperClassName?: string;
  ariaLabel?: string;
  /**
   * Optional Tailwind max-height class (e.g. "max-h-[560px]"). When set the container also scrolls vertically,
   * which is what lets a `position: sticky` <thead> stay pinned inside it.
   */
  maxHeightClassName?: string;
}

/**
 * Horizontal (and optionally vertical) scroll box for tables.
 *
 * Overflow hint: when more content sits to the left or right, a soft inner SHADOW appears on that edge
 * (and disappears at the end of the scroll), so people see that the table continues without any extra control.
 * The shadows are pure CSS gradients (no JS layout work beyond reading scroll position) and are hidden in print.
 */
export const ScrollableTableContainer: React.FC<ScrollableTableContainerProps> = ({
  children,
  className = '',
  tableWrapperClassName = '',
  ariaLabel = 'Scrollable table',
  maxHeightClassName = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(maxScroll - scrollLeft > 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    // Content width changes (rows added, fonts load, orientation change) must re-check too.
    const resizeObserver = new ResizeObserver(() => checkScroll());
    resizeObserver.observe(el);
    Array.from(el.children).forEach((child) => resizeObserver.observe(child));

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const verticalScroll = maxHeightClassName ? `overflow-y-auto overscroll-contain ${maxHeightClassName}` : 'overflow-y-hidden';

  return (
    <div className={`relative group ${className}`}>
      <div
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label={ariaLabel}
        className={`overflow-x-auto ${verticalScroll} rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:focus-visible:ring-brand ${tableWrapperClassName}`}
      >
        {children}
      </div>

      {/* Left shadow (appears once the table has been scrolled right) */}
      <div
        aria-hidden="true"
        data-scroll-shadow="left"
        className={`pointer-events-none absolute inset-y-0 left-0 w-5 rounded-l-xl transition-opacity duration-200 motion-reduce:transition-none print:hidden bg-sunken ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Right shadow (visible while more content waits on the right) */}
      <div
        aria-hidden="true"
        data-scroll-shadow="right"
        className={`pointer-events-none absolute inset-y-0 right-0 w-5 rounded-r-xl transition-opacity duration-200 motion-reduce:transition-none print:hidden bg-sunken ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
