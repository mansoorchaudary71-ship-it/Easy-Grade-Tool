import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FAQ, WEIGHTED_COURSE_FAQS, PAGE_FAQ_HEADINGS } from './FAQ';
import { ManualGradeHowTo } from './ManualGradeHowTo';
import { QuickGradeGuide } from './QuickGradeGuide';
import { ToolKey } from '../types';
import { BASE_CANONICAL_ORIGIN, SITE_LAUNCH_DATE, SITE_LAST_MODIFIED, CONTACT_EMAIL } from '../data/seoConfig';
import { GUIDE_IMAGES } from '../data/guideImages';
import { ToolContentGuide } from './ToolContentGuide';

export interface EducationalGuideProps {
  activeTool?: ToolKey;
}

/**
 * Generates Schema.org Article structured data for the Educational Guide.
 */
export function getEducationalGuideSchema(
  canonicalOrigin: string = BASE_CANONICAL_ORIGIN,
  routePath: string = '/'
) {
  const cleanOrigin = canonicalOrigin.replace(/\/+$/, '');
  const isWeighted = routePath.replace(/\/+$/, '') === '/grade-calculator';
  const normalizedPath = isWeighted ? '/grade-calculator' : '/';
  const url = `${cleanOrigin}${normalizedPath}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#educational-guide`,
    headline: isWeighted
      ? 'Final Grade Calculator – Weighted Grade & Final Grade Calculator'
      : 'Easy Grade Calculator: Grading Percentage & Grade Calculator Guide',
    name: isWeighted
      ? 'Final Grade Calculator – Weighted Grade & Final Grade Calculator'
      : 'Easy Grade Calculator: Grading Percentage & Grade Calculator Guide',
    description: isWeighted
      ? 'Guide to weighted grade calculation, how final exam weight affects your course grade, and how to work out the score you need on the final exam.'
      : 'Complete educational guide explaining test score percentages, wrong-answer deductions, EZ grader charts, and institutional grading scales.',
    inLanguage: 'en-US',
    datePublished: SITE_LAUNCH_DATE,
    dateModified: SITE_LAST_MODIFIED,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: `${cleanOrigin}/images/easy-grade-calculator-guide.webp`,
    author: {
      '@type': 'Organization',
      name: 'Easy Grade Tool',
      url: `${cleanOrigin}/`,
      email: CONTACT_EMAIL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Easy Grade Tool',
      url: `${cleanOrigin}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${cleanOrigin}/icon.svg`,
      },
    },
  };
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
