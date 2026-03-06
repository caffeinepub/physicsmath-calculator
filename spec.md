# Land Survey Converter

## Current State
The app currently combines two tools in one codebase:
1. A PhysicsMath Calculator (Home, Calculators, History pages) with 50+ calculators
2. A Land Survey Converter (LandSurveyPage) with 22 land units

The Header has navigation for all four pages (Home, Calculators, Land Survey, History). App.tsx routes between all four pages.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- `App.tsx` -- Remove all PhysicsMath routing logic, history, and calculator modal. Render only `LandSurveyPage` with a simplified wrapper.
- `Header.tsx` -- Replace the PhysicsMath brand/nav with a Land Survey Converter brand header. Remove all nav items except theme toggle.
- `Footer.tsx` -- No changes needed (already has "Powered by RISHU ROY")

### Remove
- `src/pages/HomePage.tsx` -- No longer needed
- `src/pages/CalculatorsPage.tsx` -- No longer needed
- `src/pages/HistoryPage.tsx` -- No longer needed
- `src/components/CalculatorCard.tsx` -- No longer needed
- `src/components/CalculatorModal.tsx` -- No longer needed
- `src/components/ParticleField.tsx` -- No longer needed
- `src/data/` directory contents -- Calculator definitions not needed
- `src/hooks/useQueries.ts` -- Calculator history hooks not needed

## Implementation Plan
1. Simplify `App.tsx` to only import and render `LandSurveyPage` (with Header, Footer, Toaster)
2. Rewrite `Header.tsx` to show Land Survey Converter branding with map/survey icon, title, and just the theme toggle
3. Delete unused page files, components, and data files
4. Validate build passes
