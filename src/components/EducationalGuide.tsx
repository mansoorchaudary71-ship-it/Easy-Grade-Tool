import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FAQ, WEIGHTED_COURSE_FAQS, PAGE_FAQ_HEADINGS } from './FAQ';
import { ManualGradeHowTo } from './ManualGradeHowTo';
import { QuickGradeGuide } from './QuickGradeGuide';
import { ToolKey } from '../types';
import { BASE_CANONICAL_ORIGIN } from '../data/seoConfig';
import { getEducationalGuideSchema } from '../utils/guideArticleSchema';

/** Re-exported so existing imports keep working; the definition lives in utils/guideArticleSchema. */
export { getEducationalGuideSchema };
import { GUIDE_IMAGES } from '../data/guideImages';
import { ToolContentGuide } from './ToolContentGuide';

export interface EducationalGuideProps {
  activeTool?: ToolKey;
}

export const EducationalGuide: React.FC<EducationalGuideProps> = ({ activeTool = 'quick' }) => {
  const location = useLocation();
  const isWeightedRoute = location.pathname.replace(/\/+$/, '') === '/grade-calculator';
  const guideSchema = getEducationalGuideSchema(BASE_CANONICAL_ORIGIN, location.pathname);

  // Direct DOM synchronization guarantees document.head contains updated Article JSON-LD without duplication
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (activeTool !== 'quick') {
      document.querySelector('script#schema-org-guide-article')?.remove();
      return;
    }
    let scriptTag = document.querySelector('script#schema-org-guide-article') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('id', 'schema-org-guide-article');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(guideSchema, null, 2);
    return () => {
      document.querySelector('script#schema-org-guide-article')?.remove();
    };
  }, [guideSchema, activeTool]);

  if (activeTool === 'quick' && isWeightedRoute) {
    return (
      <>
        <ToolContentGuide guide="weighted" />
        <FAQ tool="quick" items={WEIGHTED_COURSE_FAQS} heading={PAGE_FAQ_HEADINGS['weighted-grade-calculator']} />
      </>
    );
  }

  // Homepage: lean, teacher-first guide (long student-oriented copy lives on /grade-calculator/)
  if (activeTool === 'quick') {
    return <QuickGradeGuide />;
  }

  // For other tool pages, render the tool-specific FAQ accordion in an accessible SEO container
  return (
    <FAQ tool={activeTool} />
  );
};
