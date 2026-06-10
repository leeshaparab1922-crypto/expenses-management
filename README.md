# Personal Expense Tracker

A modern, full-stack personal finance management application built with React, TypeScript, and Supabase. This application features AI-powered expense parsing using Google Gemini, enabling users to log their spending through natural language.

## Overview

The Personal Expense Tracker is designed to simplify financial management. It provides a comprehensive dashboard for monitoring spending habits, managing transactions, tracking budgets, and analyzing financial trends through intuitive charts and reports.

### Key Problem Solved
Manual entry of expenses can be tedious. This app leverages AI to allow users to simply type or say what they spent (e.g., "Spent $45 on groceries today"), and the system automatically extracts the amount, category, and date.

## Features

- **AI-Powered Entry:** Natural language processing via Google Gemini to automatically parse and categorize expenses.
- **Dynamic Dashboard:** Real-time KPI cards and interactive spending charts using Recharts.
- **Transaction Management:** Full CRUD operations for expenses and income with detailed history.
- **Budget Tracking:** Set and monitor monthly budgets with visual progress indicators.
- **Category Management:** Custom categories to organize your finances.
- **Secure Authentication:** Integrated Supabase Auth for secure user sign-up and login.
- **Responsive Design:** A polished, mobile-friendly UI built with Tailwind CSS v4.
- **Data Persistence:** Real-time data synchronization and storage with Supabase.
- **Analytics & Reports:** Detailed breakdown of spending by category and over time.

## Tech Stack

| Area | Technology |
|---|---|
| Language | TypeScript |
| Frontend Framework | React (Vite) |
| Styling | Tailwind CSS v4 |
| Database & Auth | Supabase |
| AI Integration | Google Gemini SDK (`@google/generative-ai`) |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router DOM |
| Testing | Playwright |

## Project Structure

```text
expenses-tracker/
├── src/
│   ├── assets/             # Images and static assets
│   ├── components/         # Modular UI components
│   │   ├── Dashboard/      # Dashboard-specific widgets (Charts, Forms)
│   │   ├── Layout/         # Shared layout (Navbar, Sidebars)
│   │   └── Transaction/    # Transaction-related components
│   ├── contexts/           # React Contexts for global state management
│   ├── pages/              # Main application pages (Dashboard, History, etc.)
│   ├── services/           # API and external service integrations (Supabase, Gemini)
│   ├── utils/              # Helper functions (Analytics, CSV Export)
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── supabase/               # Supabase migrations and configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- A Supabase account and project
- A Google AI (Gemini) API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd expenses-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles TypeScript and builds the application for production.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run preview`: Previews the production build locally.

## License

Not specified.
