import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../contexts/ExpenseContext';
import { Expense } from '../services/storage';
import { analytics } from '../utils/analytics';
import KPICard from '../components/Dashboard/KPICard';
import SpendingChart from '../components/Dashboard/SpendingChart';
import CategoryBreakdown from '../components/Dashboard/CategoryBreakdown';
import BudgetOverview from '../components/Dashboard/BudgetOverview';
import UpcomingBills from '../components/Dashboard/UpcomingBills';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { expenses } = useExpenses();

  const incomeVsExpense = analytics.getIncomeVsExpense(expenses);

  return (
    <div className="bg-background text-on-background font-body-lg antialiased min-h-screen">
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <section className="mb-6 bg-primary-container rounded-lg p-8 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-3xl font-bold text-on-primary-container mb-2">Welcome back, {currentUser?.email?.split('@')[0]}</h1>
            <p className="text-lg text-on-primary-container opacity-90">Your financial health is looking strong this month.</p>
          </div>
        </section>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <KPICard title="Total Expenses" value={`₹${incomeVsExpense.expense.toFixed(2)}`} icon="shopping_cart" colorClass="text-error" />
            <KPICard title="Monthly Income" value={`₹${incomeVsExpense.income.toFixed(2)}`} icon="payments" colorClass="text-on-surface" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
                <CategoryBreakdown expenses={expenses} />
            </div>

            {/* Center Column */}
            <div className="space-y-6 lg:col-span-1">
                <div className="bg-white p-6 rounded-lg border border-outline-variant shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-sm text-outline border-b">
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Description</th>
                                <th className="pb-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.slice(0, 5).map((exp: Expense) => (
                                <tr key={exp.id} className="border-b last:border-0">
                                    <td className="py-4">{new Date(exp.date).toLocaleDateString()}</td>
                                    <td className="py-4">{exp.desc}</td>
                                    <td className={`py-4 text-right font-medium ${exp.type === 'expense' ? 'text-error' : 'text-primary'}`}>
                                        {exp.type === 'expense' ? '-' : '+'}₹{exp.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <SpendingChart expenses={expenses} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                <BudgetOverview />
                <UpcomingBills />
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
