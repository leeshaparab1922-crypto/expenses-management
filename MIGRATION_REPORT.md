# Migration Analysis Report (Phase 1)

This report outlines the mapping between design-export HTML pages and existing React pages, identifies reusable components, and defines the migration checklist for Phase 2.

## Mapping Analysis

| Design Export File | Existing React Page | Status |
| :--- | :--- | :--- |
| `design-exports/login.html` | `src/pages/Login.tsx` | Needs full UI rewrite. |
| `design-exports/dashboard.html` | `src/pages/Dashboard.tsx` | Needs full UI rewrite. |
| `design-exports/history.html` | `src/pages/History.tsx` | Needs full UI rewrite. |
| `design-exports/transaction.html` | `src/pages/Transaction.tsx` | Needs full UI rewrite. |
| `design-exports/budget.html` | `src/pages/Budget.tsx` | Needs full UI rewrite. |
| `design-exports/categories.html` | `src/pages/Categories.tsx` | Needs full UI rewrite. |
| `design-exports/reports-and-analytics.html` | `src/pages/Reports.tsx` | Needs full UI rewrite. |
| `design-exports/profile.html` | `src/pages/Profile.tsx` | Needs full UI rewrite. |

## Reusable Components Identification
The following elements should be extracted into reusable components for consistency:

*   `components/Layout/Navbar.tsx`: Needs updating to match new design.
*   `components/Layout/BottomNav.tsx`: Needs to be created based on navigation design in HTML files.
*   `components/UI/Card.tsx`: Standardized card container.
*   `components/UI/Button.tsx`: Standardized buttons (primary/secondary/icon).
*   `components/UI/Input.tsx`: Standardized input fields.
*   `components/UI/Modal.tsx`: Reusable modal wrapper.

## Migration Checklist (Phase 2)
I will perform the migration in this order:

1.  **Login**: JSX conversion, state management (auth), validation.
2.  **Dashboard**: JSX conversion, KPI integration, chart integration, layout.
3.  **Transaction**: JSX conversion, state management, form handlers (expense/income toggle), persistence.
4.  **History**: JSX conversion, filtering, search, sorting.
5.  **Budget**: JSX conversion, CRUD, progress indicators, storage integration.
6.  **Categories**: JSX conversion, CRUD, storage integration.
7.  **Reports**: JSX conversion, data calculation, chart data connection.
8.  **Profile**: JSX conversion, settings state, persistence.

Each step will involve verification (`npm run build`, linting, TypeScript check).
