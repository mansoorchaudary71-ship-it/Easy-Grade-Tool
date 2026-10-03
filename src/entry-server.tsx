import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { GradeCalculator } from './components/GradeCalculator';
import { GpaCalculator } from './components/GpaCalculator';
import { CgpaToPercentage } from './components/CgpaToPercentage';
import { TipCalculator } from './components/TipCalculator';
import { PercentageCalculator } from './components/PercentageCalculator';
import { LoanCalculator } from './components/LoanCalculator';
import { MortgageCalculator } from './components/MortgageCalculator';
import { PasswordGenerator } from './components/PasswordGenerator';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { AboutMethodology } from './components/AboutMethodology';
import { ProgrammaticCalculatorView } from './components/ProgrammaticCalculatorView';

/**
 * Server-side / static site generation (SSG) render function.
 * Accepts the target route URL and returns the fully populated pre-rendered HTML string.
 */
export function render(url: string = '/'): string {
  return renderToString(
    <React.StrictMode>
      <App
        initialUrl={url}
        syncComponents={{
          GradeCalculator,
          GpaCalculator,
          CgpaToPercentage,
          TipCalculator,
          PercentageCalculator,
          LoanCalculator,
          MortgageCalculator,
          PasswordGenerator,
          PrivacyPolicy,
          TermsOfService,
          AboutMethodology,
          ProgrammaticCalculatorView,
        }}
      />
    </React.StrictMode>
  );
}

export default render;
