# نظام تقييم الأداء السنوي

A fully Arabic RTL employee annual evaluation web app with real-time scoring, dark mode, and PDF export.

## Run & Operate

- `pnpm --filter @workspace/hr-evaluation run dev` — run the evaluation app (port 23056)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS
- Fonts: Cairo / Tajawal (Google Fonts, Arabic)
- Icons: Lucide React
- Storage: localStorage (draft auto-save)
- No backend needed — purely client-side

## Where things live

- `artifacts/hr-evaluation/src/App.tsx` — main app with all state management
- `artifacts/hr-evaluation/src/data/evaluationData.ts` — evaluation categories, criteria, score labels
- `artifacts/hr-evaluation/src/components/` — all UI components
- `artifacts/hr-evaluation/src/index.css` — theme (green/gold palette), RTL, dark mode, print styles

## Architecture decisions

- Fully client-side: no backend or database required; all data stored in localStorage as draft
- RTL enforced at the `body` level via `direction: rtl`
- CSS custom properties power both light/dark themes with a single class toggle on `<html>`
- Score computation is pure: weighted average across 6 categories → normalized to 0–100%
- Print/PDF: `@media print` hides nav/sidebar, shows a clean print header

## Product

6 evaluation categories with weighted criteria (25% + 20% + 20% + 15% + 10% + 10%):
- الأداء والنتائج — Performance & Results
- الكفاءة المهنية — Professional Competence  
- الجودة والسلامة — Quality & Safety
- الالتزام والانضباط — Commitment & Discipline
- التواصل والعمل الجماعي — Communication & Teamwork
- الابتكار والتحسين — Innovation & Improvement

Features: real-time score, score color coding, dark mode, progress bar, comments, signatures, print PDF.

## User preferences

- Arabic RTL interface
- Green (#142, 60%, 28%) and Gold (#45, 85%, 50%) corporate color scheme
- Cairo/Tajawal Arabic fonts

## Gotchas

- Google Fonts `@import` must be the FIRST line in index.css (before Tailwind imports)
- Dark mode class is toggled on `document.documentElement`, stored in localStorage
