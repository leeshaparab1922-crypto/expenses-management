# Migration Plan: Stitch UI to React

This document defines the mapping between Stitch design exports and the React component architecture, and outlines the migration steps.

## Mapping Analysis

| Design Export File | React Page | Key Components |
| :--- | :--- | :--- |
| `dashboard.html` | `src/pages/Dashboard.tsx` | KPI Cards, Recent Transactions, Spending Chart |
| `history.html` | `src/pages/History.tsx` | Filter Bar, Transaction Table, Pagination |
| `transaction.html` | `src/pages/Transaction.tsx` | Expense/Income Form |
| `budget.html` | `src/pages/Budget.tsx` | Budget Cards, Progress Indicators, Add Modal |
| `categories.html` | `src/pages/Categories.tsx` | Category List/Grid, CRUD Form |
| `reports-and-analytics.html` | `src/pages/Reports.tsx` | Analytics Charts, Filters |
| `profile.html` | `src/pages/Profile.tsx` | Profile Settings Form |

## Component Architecture

To maximize reuse, the following component structure will be implemented:

- `src/components/UI/`: Reusable primitives (`Card.tsx`, `Button.tsx`, `Input.tsx`, `Select.tsx`, `Modal.tsx`)
- `src/components/Layout/`: Shared layout components (`Navbar.tsx`, `BottomNav.tsx`, `MainLayout.tsx`)
- `src/components/Dashboard/`: Dashboard specific (`KPICard.tsx`, `SpendingChart.tsx`)
- `src/components/Transaction/`: Transaction specific (`TransactionTable.tsx`, `TransactionForm.tsx`)
- `src/components/Budget/`: Budget specific (`BudgetCard.tsx`)

## Migration Checklist (Phase 2)

1.  **Dashboard**: Migrate layout, connect KPI cards, implement basic chart with Recharts, populate table with recent transactions.
2.  **Transaction**: Migrate form, connect to expenseService, handle validation/types.
3.  **History**: Migrate filter bar, table, search/filter/sort logic, connect to expenseService.
4.  **Budget**: Migrate budget cards/indicators, CRUD functionality, connect to budgetService.
5.  **Categories**: Migrate categories grid, CRUD functionality, connect to categoryService.
6.  **Reports**: Migrate chart views, connect to calculated data.
7.  **Profile**: Migrate settings, connect to storage/local persistence.

Each step will involve:
1.  JSX/Tailwind conversion.
2.  State/Service connection.
3.  Build verification.
