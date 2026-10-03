import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  decimals = 1,
  duration = 350,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const prevValRef = useRef<number>(value);
  const animIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Check reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(value);
      prevValRef.current = value;
      return;
    }

    const startVal = prevValRef.current;
    const endVal = value;
    prevValRef.current = value;

    if (Math.abs(startVal - endVal) < 0.0001) {
      setDisplayValue(endVal);
      return;
    }

    setIsUpdating(true);
    const startTime = performance.now();
    // Smooth cubic ease-out curve (cubic-bezier(0.16, 1, 0.3, 1))
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = startVal + (endVal - startVal) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        animIdRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayValue(endVal);
        setIsUpdating(false);
      }
    };

    animIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animIdRef.current !== null) {
        cancelAnimationFrame(animIdRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span
      className={`animated-counter-root ${isUpdating ? 'animated-counter-updating' : ''} ${className}`}
    >
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};
