# Hero update (uniform across all tools)

Extract into the repo root; files overwrite at the same paths:

- src/components/ToolHeading.tsx              new premium hero (used by every tool/info page)
- src/styles/premium.css                      adds the .hero-* styles (above .ft-news-title)
- src/components/ToolPage.tsx                 passes badge={entry.navLabel} (Test Grade, Grade Curve, Letter Grade, Average Grade, Weighted GPA, Miss, Grading Scale pages)
- src/components/ProgrammaticCalculatorView.tsx  adds badge "Final Grade Calculator"
- src/components/QuickGradeCalculator.tsx     legacy hero swapped to <ToolHeading /> (file is not currently routed)

Pages already passing a badge (Grade, GPA, CGPA, Tip, Percentage, Loan, Mortgage, Password, About, Privacy, Terms) need no change.
