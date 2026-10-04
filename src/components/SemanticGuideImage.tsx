import React, { useState, useEffect, useRef } from 'react';
import { getGuideImageUrl, GUIDE_PLACEHOLDERS, RAW_GUIDE_IMAGES } from '../data/guideImages';

interface SemanticGuideImageProps {
  toolKey: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/**
 * High-performance semantic content image component with:
 * - Instant blur-up preview using tiny 200-byte data-URI placeholder
 * - Immediate switch to HD when image is in memory cache
 * - Automatic base URL resolution for root and GitHub Pages subpaths
 * - Native eager/async decoding for fast rendering even on slow connections
 * - Zero Layout Shift (CLS = 0) with enforced aspect-ratio container
 */
export const SemanticGuideImage: React.FC<SemanticGuideImageProps> = ({
  toolKey,
  alt,
  className = '',
  priority = false,
}) => {
  const src = getGuideImageUrl(toolKey);
  const placeholder = GUIDE_PLACEHOLDERS[toolKey] || GUIDE_PLACEHOLDERS.quick;
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If already cached in memory, immediately display HD image without blur transition
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 shadow-xs aspect-[3/2] ${className}`}
      style={{
        backgroundImage: isLoaded ? 'none' : `url("${placeholder}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={1200}
        height={800}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          // Fallback to relative path if absolute resolution encountered network edge issue
          const target = e.currentTarget;
          const fallback = RAW_GUIDE_IMAGES[toolKey] || 'images/easy-grade-calculator-guide.webp';
          if (target.src !== fallback && !target.src.endsWith(fallback)) {
            target.src = fallback;
          }
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
