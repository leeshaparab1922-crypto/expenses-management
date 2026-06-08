# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint (zero warnings allowed — --max-warnings 0)
npm run preview    # Serve the production build locally
```

No test suite is configured. Build verification (`npm run build`) is the primary correctness check.

## Architecture

React 18 + TypeScript SPA, bundled with Vite. Tailwind CSS v4 is loaded via the `@tailwindcss/vite` plugin (no `tailwind.config.js` — configuration is in CSS). Recharts for charts, Lucide React for icons, React Router v6 for routing.

### Data layer (localStorage)

All persistence is via `localStorage` through a two-layer pattern:

1. **Service layer** (`src/services/`) — raw CRUD against `localStorage`. Each service owns its own storage key (`et_expenses`, `et_budgets`, `et_categories`). `storage.ts` handles users and sessions (`et_users`, `et_session`).
2. **Context layer** (`src/contexts/`) — React Contexts that wrap the service layer and expose state + mutators to the component tree. There are four providers: `AuthContext`, `ExpenseContext`, `BudgetContext`, `CategoryContext`. All are mounted at the root in `App.tsx`.

IDs are assigned via `Date.now()` — no UUID library.

### Auth

`AuthContext` uses the localStorage-based `Storage` service (plain email/password stored in `et_users`). `supabaseClient.js` exists and is wired to `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` env vars, but Supabase is not yet integrated into auth or data services — migration to Supabase is planned.

### Routing & layout

`App.tsx` defines all routes. Protected routes render inside `<MainLayout>` (sidebar nav via `Navbar.tsx`). Unauthenticated requests redirect to `/login`. Root `/` redirects to `/dashboard`.

### Analytics utilities

`src/utils/analytics.ts` contains pure functions that derive aggregations (monthly spending, category breakdown, budget utilization, etc.) from the `Expense[]` array. These are consumed directly by page components — they do not have their own context.

## Key files

| Path | Purpose |
|---|---|
| `src/App.tsx` | Router + provider tree |
| `src/services/storage.ts` | Core localStorage primitives, `User` and `Expense` types |
| `src/services/expenseService.ts` | Expense CRUD |
| `src/services/budgetService.ts` | Budget CRUD, owns `Budget` type |
| `src/services/categoryService.ts` | Category CRUD, owns `Category` type |
| `src/utils/analytics.ts` | Pure analytics/aggregation helpers |
| `src/supabaseClient.js` | Supabase client singleton |
| `design-exports/` | Static HTML mockups — the migration source of truth for UI design |

## Active migration

The project is mid-migration from static HTML designs in `design-exports/` to React. `MIGRATION_PLAN.md` and `MIGRATION_REPORT.md` describe the intended component structure and page-by-page checklist. When implementing a page, use the corresponding `design-exports/*.html` file as the UI reference.

## You must ignore below files 

Whatever is there in @.gitignore file you should ignore it.
