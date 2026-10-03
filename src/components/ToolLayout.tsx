import React from 'react';
import { FAQ } from './FAQ';
import { ToolKey } from '../types';

export interface ToolLayoutProps {
  toolKey: ToolKey;
  children: React.ReactNode;
  educationalContent?: React.ReactNode;
  customFaq?: React.ReactNode;
}

/**
 * Universal Tool Layout
 * Enforces the strict 4-step vertical page sequence:
 *   Step 1: Header / Navbar (Rendered at top of App)
 *   Step 2: Tool Calculator Interface (Interactive Inputs & Calculations)
 *   Step 3: Educational Content & Guides
 *   Step 4: FAQ Section (Interactive Search & Accordion)
 *   Step 5: Footer (Rendered at bottom of App)
 */
export const ToolLayout: React.FC<ToolLayoutProps> = ({
  toolKey,
  children,
  educationalContent,
  customFaq,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 sm:space-y-16 py-4 sm:py-8 font-sans">
      {/* 2. Tool Calculator Interface */}
      <section aria-label="Calculator Workspace" className="w-full">
        {children}
      </section>

      {/* 3. Educational Content & Guides */}
      {educationalContent && (
        <section
          aria-label="Educational Guide"
          className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm"
        >
          {educationalContent}
        </section>
      )}

      {/* 4. FAQ Section */}
      <section aria-label="Frequently Asked Questions" className="w-full">
        {customFaq || <FAQ tool={toolKey} />}
      </section>
    </div>
  );
};

export default ToolLayout;
