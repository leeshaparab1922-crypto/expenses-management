import React from 'react';
import { useExpenses } from '../contexts/ExpenseContext';
import { useBudgets } from '../contexts/BudgetContext';
import { analytics } from '../utils/analytics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { exportReportToCSV } from '../utils/csvExport';

const Reports: React.FC = () => {
  const { expenses } = useExpenses();
  const { budgets } = useBudgets();

  const categoryBreakdown = Object.entries(analytics.getCategoryBreakdown(expenses)).map(([name, value]) => ({ name, value }));
  const monthlySpending = Object.entries(analytics.getMonthlySpending(expenses)).map(([name, value]) => ({ name, value }));
  const budgetUtilization = analytics.getBudgetUtilization(expenses, budgets);
  const incomeVsExpense = analytics.getIncomeVsExpense(expenses);
  const summary = {
      expense: incomeVsExpense.expense,
      income: incomeVsExpense.income,
      monthlyAverage: incomeVsExpense.expense / 6
  };

  const COLORS = ['#0d631b', '#1f6223', '#556158', '#e5e2e1', '#ba1a1a', '#2e7d32'];

  const handleExport = () => {
      exportReportToCSV(summary, categoryBreakdown.map(c => ({ name: c.name, value: c.value })), budgetUtilization, monthlySpending);
      alert('Report exported!');
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-headline-lg font-bold">Financial Insights</h2>
            <button onClick={handleExport} className="bg-primary text-white px-4 py-2 rounded-lg">Export Report</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-md mb-4">Spending by Category</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={categoryBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                {categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-md mb-4">Monthly Spending</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlySpending}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#0d631b" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </main>
  );
};

export default Reports;
