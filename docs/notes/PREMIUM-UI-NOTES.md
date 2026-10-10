# Premium UI pass across all tools (includes the earlier header/toolbar work)

Copy the files in `src/` over the same paths in the repo.

NEW
- src/components/ui/SegmentedControl.tsx  reusable sliding-pill toggle (Framer Motion layoutId, aria-pressed kept)
- src/styles/premium.css                  scoped (.premium-surface) glass/shadow/focus/hover layer

CHANGED
- App.tsx, main.tsx            `premium-surface` class on <main>; premium.css imported after index.css
- index.css                    + `@custom-variant dark` so Tailwind dark: follows the app's .dark class
- components/Navbar.tsx, PWAInstallButton.tsx   header/toolbar (previous delivery)
- tools/{AverageGrade,GradeCurve,LetterGrade,TestGrade,QuestionCountChart}Tool.tsx, tools/ui.ts
- GradeCalculator, QuickGrader, QuickGradeCalculator, GpaCalculator, GpaToPercentage  toggles/chips -> SegmentedControl
- CgpaToPercentage (scale tabs), ManualGradeHowTo (method tabs)  sliding pill added, tab semantics + keyboard nav untouched
- Inputs: blue focus ring -> emerald `focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent`

Tip, Loan, Mortgage, Percentage and Password calculators get the glass cards, emerald focus ring, button shadow
and result-panel animation through premium.css (they have no toggles to convert).
