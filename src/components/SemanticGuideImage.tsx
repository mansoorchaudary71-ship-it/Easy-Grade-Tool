import React, { useState } from 'react';
import { GUIDE_IMAGES, GUIDE_PLACEHOLDERS } from '../data/guideImages';

interface SemanticGuideImageProps {
  toolKey: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/**
 * High-performance semantic content image component with:
 * - Instant blur-up preview using tiny 200-byte data-URI placeholder
 * - Zero Layout Shift (CLS = 0) with enforced aspect-ratio container
 * - Memory-cached image lookup for instantaneous repeats
 * - Smooth CSS fade-in transition once the high-res image resolves
 * - Native async decoding and responsive attributes
 */
export const SemanticGuideImage: React.FC<SemanticGuideImageProps> = ({
  toolKey,
  alt,
  className = '',
  priority = false,
}) => {
  const src = GUIDE_IMAGES[toolKey] || GUIDE_IMAGES.quick;
  const placeholder = GUIDE_PLACEHOLDERS[toolKey] || GUIDE_PLACEHOLDERS.quick;
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 shadow-xs aspect-[3/2] ${className}`}
      style={{
        backgroundImage: `url("${placeholder}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <img
        src={src}
        alt={alt}
        width={750}
        height={500}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
