import React, { useMemo } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionContext';
import { useCategories } from '../contexts/CategoryContext';

const Reports: React.FC = () => {
    const { currentUser } = useAuth();
    const { transactions } = useTransactions();
    const { categories } = useCategories();

    const formatCurrency = (amount: number) => {
        const currency = currentUser?.settings?.currency || 'USD $';
        const symbol = currency.split(' ')[1] || '$';
        return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}`;
    };

    // Monthly Trend (Last 6 Months)
    const monthlyData = useMemo(() => {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthKey = d.toISOString().slice(0, 7);
            const label = d.toLocaleString(undefined, { month: 'short' }).toUpperCase();
            
            const monthTransactions = transactions.filter(t => t.date.startsWith(monthKey));
            const income = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const expense = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
            
            data.push({ label, income, expense });
        }
        return data;
    }, [transactions]);

    const maxMonthlyVal = Math.max(...monthlyData.map(d => Math.max(d.income, d.expense)), 1);

    // Spending by Category (Current Month)
    const currentMonth = new Date().toISOString().slice(0, 7);
    const categorySpending = useMemo(() => {
        const spending: Record<string, number> = {};
        transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth)).forEach(t => {
            spending[t.categoryId] = (spending[t.categoryId] || 0) + t.amount;
        });
        return Object.entries(spending).sort(([, a], [, b]) => b - a);
    }, [transactions, currentMonth]);

    const totalSpent = categorySpending.reduce((s, [, a]) => s + a, 0);
    const top5Expenses = categorySpending.slice(0, 5);

    return (
        <MainLayout>
            <div className="flex-1 overflow-y-auto px-4 md:px-margin-mobile pt-6 pb-24 space-y-6 max-w-container-max-width mx-auto w-full">
                {/* Header Actions */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Reports</h2>
                        <button className="bg-primary text-on-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity active:scale-95">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                            <span className="font-label-md text-label-md">Export</span>
                        </button>
                    </div>
                    <div className="flex items-center bg-white border border-outline-variant rounded-xl px-4 py-2 justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-outline">calendar_today</span>
                            <span className="font-body-sm text-body-sm font-medium">Last 6 Months</span>
                        </div>
                        <span className="material-symbols-outlined text-outline">expand_more</span>
                    </div>
                </section>

                {/* Card 1: Monthly Spending Trend */}
                <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-headline-md text-headline-md">Monthly Trend</h3>
                        <div className="flex gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">Income</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-error"></div>
                                <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">Expenses</span>
                            </div>
                        </div>
                    </div>
                    <div className="chart-container flex items-end justify-between gap-1 h-32 relative">
                        <div className="w-full flex justify-between px-2 items-end h-full relative z-10 gap-4">
                            {monthlyData.map((d, i) => (
                                <div key={i} className="flex-1 flex items-end gap-1 h-full">
                                    <div className="flex-1 bg-primary/40 rounded-t-sm" style={{ height: `${(d.income / maxMonthlyVal) * 100}%` }}></div>
                                    <div className="flex-1 bg-error/40 rounded-t-sm" style={{ height: `${(d.expense / maxMonthlyVal) * 100}%` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 px-2">
                        {monthlyData.map((d, i) => (
                            <span key={i} className="text-[10px] text-outline font-bold">{d.label}</span>
                        ))}
                    </div>
                </div>

                {/* Card 2: Spending by Category */}
                <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm">
                    <h3 className="font-headline-md text-headline-md mb-6">Spending by Category</h3>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" fill="transparent" r="15.9155" stroke="#f0eded" strokeWidth="4"></circle>
                                {top5Expenses.reduce((acc, [catId, amount], idx) => {
                                    const percent = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                                    const offset = acc.offset;
                                    const color = idx === 0 ? '#0d631b' : idx === 1 ? '#1f6223' : idx === 2 ? '#88d982' : '#bdcabe';
                                    acc.paths.push(
                                        <circle key={catId} cx="18" cy="18" fill="transparent" r="15.9155" stroke={color} strokeWidth="4" strokeDasharray={`${percent} 100`} strokeDashoffset={-offset}></circle>
                                    );
                                    acc.offset += percent;
                                    return acc;
                                }, { paths: [] as React.ReactNode[], offset: 0 }).paths}
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="font-numeric-display text-lg font-bold text-primary">{totalSpent > 0 ? Math.round((top5Expenses[0]?.[1] / totalSpent) * 100) : 0}%</span>
                                <span className="text-[10px] text-outline font-bold uppercase truncate max-w-[60px]">{categories.find(c => c.id === top5Expenses[0]?.[0])?.name || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="flex-1 w-full space-y-3">
                            {top5Expenses.map(([catId, amount], idx) => {
                                const category = categories.find(c => c.id === catId);
                                const percent = Math.round((amount / totalSpent) * 100);
                                const colorClass = idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-tertiary' : idx === 2 ? 'bg-primary-fixed-dim' : 'bg-surface-container-highest';
                                return (
                                    <div key={catId} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>
                                            <span className="font-body-sm text-body-sm">{category?.name || catId}</span>
                                        </div>
                                        <span className="font-body-sm font-semibold">{percent}%</span>
                                    </div>
                                );
                            })}
                            {top5Expenses.length === 0 && <p className="text-body-sm text-on-surface-variant italic">No expenses recorded for this month.</p>}
                        </div>
                    </div>
                </div>

                {/* Card 3: Top 5 Expenses */}
                <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm">
                    <h3 className="font-headline-md text-headline-md mb-6">Top 5 Expenses</h3>
                    <div className="space-y-6">
                        {top5Expenses.map(([catId, amount]) => {
                            const category = categories.find(c => c.id === catId);
                            const percent = (amount / top5Expenses[0][1]) * 100;
                            return (
                                <div key={catId} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-body-sm font-medium">{category?.name || catId}</span>
                                        <span className="font-body-sm font-bold">{formatCurrency(amount)}</span>
                                    </div>
                                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-700" style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                        {top5Expenses.length === 0 && <p className="text-body-sm text-on-surface-variant italic">No data available.</p>}
                    </div>
                </div>

                {/* Financial Insights Section */}
                <section className="space-y-4">
                    <h3 className="font-headline-md text-headline-md px-1">Financial Insights</h3>
                    <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar snap-x">
                        <div className="min-w-[280px] bg-tertiary-container/10 p-4 rounded-xl border border-tertiary-container/30 snap-center shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-tertiary">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lightbulb</span>
                                <span className="font-label-md text-label-md uppercase tracking-wide">Category Insight</span>
                            </div>
                            <p className="font-body-sm text-on-surface-variant">Your {top5Expenses[0]?.[0] || 'top'} spending accounted for {totalSpent > 0 ? Math.round((top5Expenses[0]?.[1] / totalSpent) * 100) : 0}% of your expenses this month.</p>
                        </div>
                        <div className="min-w-[280px] bg-primary-container/10 p-4 rounded-xl border border-primary-container/30 snap-center shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-primary">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>trending_up</span>
                                <span className="font-label-md text-label-md uppercase tracking-wide">Savings Win</span>
                            </div>
                            <p className="font-body-sm text-on-surface-variant">You've saved {formatCurrency(transactions.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0) - transactions.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0))} so far. Keep it up!</p>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default Reports;
