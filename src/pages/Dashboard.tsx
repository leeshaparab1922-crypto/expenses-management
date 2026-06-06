import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionContext';
import { useCategories } from '../contexts/CategoryContext';
import { useBudgets } from '../contexts/BudgetContext';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { currentUser } = useAuth();
    const { transactions, totalBalance, totalIncome, totalExpenses } = useTransactions();
    const { categories, getCategoryById } = useCategories();
    const { budgets } = useBudgets();
    const navigate = useNavigate();

    const formatCurrency = (amount: number) => {
        const currency = currentUser?.settings?.currency || 'USD $';
        const symbol = currency.split(' ')[1] || '$';
        return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

    // Get recent transactions
    const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    // Spending by category (for expenses this month)
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth));
    const expenseByCategory = monthlyExpenses.reduce((acc, t) => {
        acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
        return acc;
    }, {} as Record<string, number>);

    const totalMonthlyExpense = Object.values(expenseByCategory).reduce((a, b) => a + b, 0);
    const sortedCategories = Object.entries(expenseByCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4);

    return (
        <MainLayout>
            <div className="max-w-container-max-width mx-auto px-4 md:px-margin-desktop py-gutter">
                {/* Welcome Banner Section */}
                <section className="mb-gutter bg-primary-container rounded-lg p-6 md:p-margin-desktop flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10 max-w-lg">
                        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-primary-container mb-2">
                            Welcome back, {currentUser?.settings?.fullName || currentUser?.email.split('@')[0]}
                        </h1>
                        <p className="text-body-lg text-on-primary-container opacity-90">
                            Your financial health is looking strong this month. You've reached {savingsRate}% of your savings rate.
                        </p>
                    </div>
                    <div className="hidden lg:block absolute right-12 bottom-0 w-48 h-48 opacity-20 transform translate-y-8">
                        <img alt="Financial Growth Illustration" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida/AP1WRLs0ck70mRsOIyeq20QWESYNaUWUFezjvvOunzen18WoY7RzNqYWcpDOpfEvOpMgqrto3cr2cGVOxNLbHTn1r-KJ35Z5wEtrUgG6SJYx2t-GVr24ZLHX8ZUojyYAgc-8uKySt1r4_ozaSPW7c7fZEAKHHKAX6whu6ERKlPcLkRVnKtPye-OG76njz8Vf1SrHsxWUqkPxQc8VOiIYfiR4aIs4b9zqNSHuV-ArAUgYzG6EZw0CySpO3L-pLUo" />
                    </div>
                </section>

                {/* KPI Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">
                    {/* Total Balance */}
                    <div className="bg-surface card-shadow p-6 rounded-lg transition-transform hover:-translate-y-0.5">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-label-md font-label-md text-on-surface-variant uppercase">TOTAL BALANCE</span>
                            <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary filled-icon">account_balance_wallet</span>
                            </div>
                        </div>
                        <div className="text-numeric-display font-numeric-display text-primary font-bold">{formatCurrency(totalBalance)}</div>
                        <div className="text-label-md font-label-md text-primary mt-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">trending_up</span> Overall balance
                        </div>
                    </div>
                    {/* Monthly Income */}
                    <div className="bg-surface card-shadow p-6 rounded-lg transition-transform hover:-translate-y-0.5">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-label-md font-label-md text-on-surface-variant uppercase">MONTHLY INCOME</span>
                            <div className="w-10 h-10 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-tertiary filled-icon">payments</span>
                            </div>
                        </div>
                        <div className="text-numeric-display font-numeric-display text-on-surface font-bold">
                            {formatCurrency(transactions.filter(t => t.type === 'income' && t.date.startsWith(currentMonth)).reduce((sum, t) => sum + t.amount, 0))}
                        </div>
                        <div className="text-label-md font-label-md text-tertiary mt-2">Current month</div>
                    </div>
                    {/* Monthly Expenses */}
                    <div className="bg-surface card-shadow p-6 rounded-lg transition-transform hover:-translate-y-0.5">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-label-md font-label-md text-on-surface-variant uppercase">MONTHLY EXPENSES</span>
                            <div className="w-10 h-10 rounded-lg bg-error-container/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-error filled-icon">shopping_cart</span>
                            </div>
                        </div>
                        <div className="text-numeric-display font-numeric-display text-on-surface font-bold">{formatCurrency(totalMonthlyExpense)}</div>
                        <div className="text-label-md font-label-md text-error mt-2">
                            {totalIncome > 0 ? `${Math.round((totalMonthlyExpense / totalIncome) * 100)}% of total income` : 'No income recorded'}
                        </div>
                    </div>
                    {/* Savings Rate */}
                    <div className="bg-surface card-shadow p-6 rounded-lg transition-transform hover:-translate-y-0.5">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-label-md font-label-md text-on-surface-variant uppercase">SAVINGS RATE</span>
                            <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center">
                                <span className="material-symbols-outlined text-secondary filled-icon">savings</span>
                            </div>
                        </div>
                        <div className="text-numeric-display font-numeric-display text-on-surface font-bold">{savingsRate}%</div>
                        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${savingsRate}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Bento Layout */}
                <div className="bento-grid">
                    {/* Left Sidebar */}
                    <aside className="flex flex-col gap-gutter">
                        <div className="bg-surface card-shadow p-6 rounded-lg">
                            <h3 className="text-label-md font-label-md text-on-surface-variant mb-gutter uppercase">QUICK ACTIONS</h3>
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => navigate('/transaction')}
                                    className="bg-primary-container text-on-primary-container h-12 rounded-lg font-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                >
                                    <span className="material-symbols-outlined">add_circle</span> Add Expense
                                </button>
                                <button 
                                    onClick={() => navigate('/transaction?type=income')}
                                    className="bg-primary-container text-on-primary-container h-12 rounded-lg font-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                >
                                    <span className="material-symbols-outlined">account_balance</span> Add Income
                                </button>
                                <button 
                                    onClick={() => navigate('/reports')}
                                    className="bg-primary-container text-on-primary-container h-12 rounded-lg font-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                >
                                    <span className="material-symbols-outlined">analytics</span> View Reports
                                </button>
                            </div>
                        </div>
                        <div className="bg-surface card-shadow p-6 rounded-lg">
                            <h3 className="text-label-md font-label-md text-on-surface-variant mb-4 uppercase">SPENDING BY CATEGORY</h3>
                            <div className="relative w-40 h-40 mx-auto mb-6">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3"></path>
                                    {/* Simplified Donut logic for top categories */}
                                    {sortedCategories.reduce((acc, [catId, amount], idx) => {
                                        const percent = totalMonthlyExpense > 0 ? (amount / totalMonthlyExpense) * 100 : 0;
                                        const offset = acc.offset;
                                        const colorClass = idx === 0 ? 'text-primary' : idx === 1 ? 'text-tertiary' : idx === 2 ? 'text-secondary' : 'text-primary-fixed-dim';
                                        acc.paths.push(
                                            <path key={catId} className={colorClass} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${percent}, 100`} strokeDashoffset={-offset} strokeWidth="3"></path>
                                        );
                                        acc.offset += percent;
                                        return acc;
                                    }, { paths: [] as React.ReactNode[], offset: 0 }).paths}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-body-sm text-on-surface-variant">Total</span>
                                    <span className="text-headline-md font-bold text-on-surface">{formatCurrency(totalMonthlyExpense)}</span>
                                </div>
                            </div>
                            <ul className="space-y-2">
                                {sortedCategories.length === 0 ? (
                                    <li className="text-body-sm text-center text-on-surface-variant">No expenses this month</li>
                                ) : (
                                    sortedCategories.map(([catId, amount], idx) => {
                                        const category = getCategoryById(catId);
                                        const percent = Math.round((amount / totalMonthlyExpense) * 100);
                                        const bgClass = idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-tertiary' : idx === 2 ? 'bg-secondary' : 'bg-primary-fixed-dim';
                                        return (
                                            <li key={catId} className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${bgClass}`}></div>
                                                    <span className="text-body-sm">{category?.name || catId}</span>
                                                </div>
                                                <span className="text-label-md font-bold">{percent}%</span>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </div>
                    </aside>

                    {/* Center Content */}
                    <section className="flex flex-col gap-gutter">
                        {/* Recent Transactions */}
                        <div className="bg-surface card-shadow p-6 rounded-lg flex-1">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-headline-md font-headline-md">Recent Transactions</h2>
                                <Link to="/history" className="text-primary text-label-md font-bold hover:underline">View All</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-label-md text-on-surface-variant border-b border-outline-variant">
                                            <th className="pb-3 font-medium">DATE</th>
                                            <th className="pb-3 font-medium">CATEGORY</th>
                                            <th className="pb-3 font-medium">DESCRIPTION</th>
                                            <th className="pb-3 font-medium text-right">AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-body-lg">
                                        {recentTransactions.length === 0 ? (
                                            <tr><td colSpan={4} className="py-8 text-center text-on-surface-variant">No transactions yet</td></tr>
                                        ) : (
                                            recentTransactions.map(t => {
                                                const category = getCategoryById(t.categoryId);
                                                return (
                                                    <tr key={t.id} className="border-b border-surface-container">
                                                        <td className="py-4 text-on-surface-variant">{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</td>
                                                        <td className="py-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-tertiary text-lg">{category?.icon || 'payments'}</span>
                                                                <span>{category?.name || 'Other'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4">{t.desc}</td>
                                                        <td className={`py-4 text-right font-medium ${t.type === 'income' ? 'text-primary' : 'text-error'}`}>
                                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Spending Over Time Area Chart */}
                        <div className="bg-surface card-shadow p-6 rounded-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-headline-md font-headline-md">Spending Over Time</h2>
                                <div className="flex items-center gap-4 text-label-md">
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary"></div> Income</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-error"></div> Expenses</div>
                                </div>
                            </div>
                            {/* Simple CSS-based bar visualization of last 6 months */}
                            <div className="h-48 w-full relative overflow-hidden bg-surface-container-low rounded flex items-end px-4 gap-4">
                                {[...Array(6)].map((_, i) => {
                                    const d = new Date();
                                    d.setMonth(d.getMonth() - (5 - i));
                                    const monthLabel = d.toLocaleString(undefined, { month: 'short' }).toUpperCase();
                                    const monthKey = d.toISOString().slice(0, 7);
                                    const monthTransactions = transactions.filter(t => t.date.startsWith(monthKey));
                                    const mIncome = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
                                    const mExpense = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
                                    
                                    const maxVal = Math.max(...[...Array(6)].map((_, j) => {
                                        const dj = new Date();
                                        dj.setMonth(dj.getMonth() - (5 - j));
                                        const mk = dj.toISOString().slice(0, 7);
                                        const mt = transactions.filter(t => t.date.startsWith(mk));
                                        return Math.max(mt.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), mt.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
                                    }), 1);

                                    const incHeight = (mIncome / maxVal) * 100;
                                    const expHeight = (mExpense / maxVal) * 100;

                                    return (
                                        <div key={monthKey} className="flex-1 bg-primary/20 rounded-t h-full relative group flex flex-col justify-end">
                                            <div className="w-full bg-primary/40 rounded-t" style={{ height: `${incHeight}%` }}></div>
                                            <div className="absolute bottom-0 w-full bg-error/40 rounded-t" style={{ height: `${expHeight}%` }}></div>
                                            <div className="absolute bottom-[-24px] w-full text-center text-[10px] font-bold text-on-surface-variant">{monthLabel}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="h-8"></div>
                        </div>
                    </section>

                    {/* Right Panel */}
                    <aside className="flex flex-col gap-gutter">
                        <div className="bg-surface card-shadow p-6 rounded-lg">
                            <h3 className="text-label-md font-label-md text-on-surface-variant mb-6 uppercase">BUDGET OVERVIEW</h3>
                            <div className="space-y-6">
                                {budgets.filter(b => b.month === currentMonth).slice(0, 3).map(budget => {
                                    const category = getCategoryById(budget.categoryId);
                                    const spent = monthlyExpenses.filter(t => t.categoryId === budget.categoryId).reduce((s, t) => s + t.amount, 0);
                                    const percent = Math.min(Math.round((spent / budget.limit) * 100), 100);
                                    const isOver = spent > budget.limit;
                                    return (
                                        <div key={budget.id}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-body-sm font-medium">{category?.name || 'Unknown'}</span>
                                                <span className={`text-label-md ${isOver ? 'text-error' : 'text-tertiary'}`}>{percent}%</span>
                                            </div>
                                            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                                                <div className={`h-full ${isOver ? 'bg-error' : 'bg-tertiary'}`} style={{ width: `${percent}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {budgets.filter(b => b.month === currentMonth).length === 0 && (
                                    <p className="text-body-sm text-on-surface-variant text-center py-4">No budgets set for this month</p>
                                )}
                            </div>
                            <button 
                                onClick={() => navigate('/budget')}
                                className="w-full mt-gutter py-2 border border-primary text-primary text-label-md font-bold rounded hover:bg-primary-container/5 transition-all"
                            >
                                Adjust Budgets
                            </button>
                        </div>

                        <div className="bg-surface card-shadow p-6 rounded-lg">
                            <h3 className="text-label-md font-label-md text-on-surface-variant mb-4 uppercase">FINANCIAL TIP</h3>
                            <div className="bg-tertiary-fixed/30 p-4 rounded-lg border border-tertiary-fixed">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 flex-shrink-0">
                                        <span className="material-symbols-outlined text-tertiary text-2xl">lightbulb</span>
                                    </div>
                                    <div>
                                        <p className="text-body-sm text-on-tertiary-fixed font-medium">Automate your savings transfer right after payday to reach your goals faster.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            
            <footer className="bg-surface-container-low border-t border-outline-variant mt-gutter">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 px-margin-desktop w-full max-w-container-max-width mx-auto">
                    <div className="text-label-md font-label-md font-bold text-on-surface mb-2 md:mb-0">SpendWise</div>
                    <div className="flex gap-6 mb-4 md:mb-0">
                        <a className="text-label-md text-on-surface-variant hover:underline hover:text-primary transition-all" href="#">Privacy</a>
                        <a className="text-label-md text-on-surface-variant hover:underline hover:text-primary transition-all" href="#">Terms</a>
                        <a className="text-label-md text-on-surface-variant hover:underline hover:text-primary transition-all" href="#">Help</a>
                    </div>
                    <div className="text-body-sm text-on-surface-variant">© 2024 SpendWise Financial.</div>
                </div>
            </footer>
        </MainLayout>
    );
};

export default Dashboard;
