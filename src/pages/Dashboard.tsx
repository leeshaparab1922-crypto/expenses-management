import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../contexts/ExpenseContext';
import { analytics } from '../utils/analytics';
import SpendingChart from '../components/Dashboard/SpendingChart';
import CategoryBreakdown from '../components/Dashboard/CategoryBreakdown';
import BudgetOverview from '../components/Dashboard/BudgetOverview';
import UpcomingBills from '../components/Dashboard/UpcomingBills';
import TransactionModal from '../components/Transaction/TransactionModal';
import heroIllustration from '../assets/hero-illustration.png';

const CATEGORY_ICONS: Record<string, string> = {
  Food: 'restaurant', Transport: 'directions_car', Housing: 'home',
  Entertainment: 'movie', Healthcare: 'medical_services', Shopping: 'shopping_bag',
  Salary: 'work', Other: 'category',
};

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { expenses } = useExpenses();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'expense' | 'income'>('expense');

  const openModal = (type: 'expense' | 'income') => { setModalType(type); setModalOpen(true); };

  const now = new Date();
  const cm = now.getMonth();
  const cy = now.getFullYear();

  const { totalBalance, monthlyIncome, monthlyExpenses, savingsRate, recentTx } = useMemo(() => {
    const thisMonth = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === cm && d.getFullYear() === cy;
    });
    const monthlyIncome = thisMonth.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const monthlyExpenses = thisMonth.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
    const totalBalance = expenses.reduce((s, e) => e.type === 'income' ? s + e.amount : s - e.amount, 0);
    const savingsRate = monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100) : 0;
    const recentTx = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
    return { totalBalance, monthlyIncome, monthlyExpenses, savingsRate, recentTx };
  }, [expenses, cm, cy]);

  const expensePct = monthlyIncome > 0 ? Math.round((monthlyExpenses / monthlyIncome) * 100) : 0;
  const userName = currentUser?.email?.split('@')[0] ?? 'User';

  const fmt = (n: number) => `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <main className="max-w-[1200px] mx-auto px-12 py-6">
      {/* Welcome Banner */}
      <section className="mb-6 bg-primary-container rounded-lg p-10 flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h1 className="text-headline-lg font-headline-lg text-on-primary-container mb-2">
            Welcome back, {userName.charAt(0).toUpperCase() + userName.slice(1)}
          </h1>
          <p className="text-body-lg text-on-primary-container opacity-90">
            Your financial health is looking strong this month.{' '}
            {savingsRate > 0 ? `You've reached ${savingsRate}% of your savings goal.` : 'Start adding transactions to track your progress.'}
          </p>
        </div>
        <div className="hidden lg:block absolute right-10 bottom-0 w-44 h-44 opacity-30">
          <img alt="Financial Growth" className="w-full h-full object-contain" src={heroIllustration} />
        </div>
      </section>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-surface card-shadow p-6 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-label-md text-on-surface-variant">TOTAL BALANCE</span>
            <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary filled-icon">account_balance_wallet</span>
            </div>
          </div>
          <div className={`text-numeric-display font-bold mt-2 ${totalBalance >= 0 ? 'text-primary' : 'text-error'}`}>{fmt(totalBalance)}</div>
          <div className="text-label-md text-primary mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span> All time
          </div>
        </div>

        <div className="bg-surface card-shadow p-6 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-label-md text-on-surface-variant">MONTHLY INCOME</span>
            <div className="w-10 h-10 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary filled-icon">payments</span>
            </div>
          </div>
          <div className="text-numeric-display font-bold text-on-surface mt-2">{fmt(monthlyIncome)}</div>
          <div className="text-label-md text-tertiary mt-2">This month</div>
        </div>

        <div className="bg-surface card-shadow p-6 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-label-md text-on-surface-variant">MONTHLY EXPENSES</span>
            <div className="w-10 h-10 rounded-lg bg-error-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-error filled-icon">shopping_cart</span>
            </div>
          </div>
          <div className="text-numeric-display font-bold text-on-surface mt-2">{fmt(monthlyExpenses)}</div>
          <div className="text-label-md text-error mt-2">{expensePct}% of income</div>
        </div>

        <div className="bg-surface card-shadow p-6 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-label-md text-on-surface-variant">SAVINGS RATE</span>
            <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary filled-icon">savings</span>
            </div>
          </div>
          <div className="text-numeric-display font-bold text-on-surface mt-2">{Math.max(0, savingsRate)}%</div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4">
            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-6">
        {/* Left Sidebar */}
        <aside className="flex flex-col gap-6">
          <div className="bg-surface card-shadow p-6 rounded-lg">
            <h3 className="text-label-md text-on-surface-variant mb-6">QUICK ACTIONS</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => openModal('expense')}
                className="bg-primary-container text-on-primary-container h-12 rounded-lg text-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-all font-bold"
              >
                <span className="material-symbols-outlined text-xl">add_circle</span> Add Expense
              </button>
              <button
                onClick={() => openModal('income')}
                className="bg-primary-container text-on-primary-container h-12 rounded-lg text-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-all font-bold"
              >
                <span className="material-symbols-outlined text-xl">account_balance</span> Add Income
              </button>
              <button
                onClick={() => navigate('/reports')}
                className="bg-primary-container text-on-primary-container h-12 rounded-lg text-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-all font-bold"
              >
                <span className="material-symbols-outlined text-xl">analytics</span> View Reports
              </button>
            </div>
          </div>

          <CategoryBreakdown expenses={expenses} />
        </aside>

        {/* Center */}
        <section className="flex flex-col gap-6">
          <div className="bg-surface card-shadow p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-md font-headline-md">Recent Transactions</h2>
              <button
                onClick={() => navigate('/history')}
                className="text-primary text-label-md font-bold hover:underline"
              >
                View All
              </button>
            </div>
            {recentTx.length === 0 ? (
              <p className="text-body-sm text-on-surface-variant text-center py-8">No transactions yet. Add your first one!</p>
            ) : (
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
                  <tbody>
                    {recentTx.map(tx => {
                      const d = new Date(tx.date);
                      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      return (
                        <tr key={tx.id} className="border-b border-surface-container last:border-0">
                          <td className="py-4 text-body-sm text-on-surface-variant">{dateStr}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-2 text-body-sm">
                              <span className="material-symbols-outlined text-tertiary" style={{ fontSize: '18px' }}>
                                {CATEGORY_ICONS[tx.category] ?? 'category'}
                              </span>
                              {tx.category}
                            </div>
                          </td>
                          <td className="py-4 text-body-sm text-on-surface">{tx.desc}</td>
                          <td className={`py-4 text-right font-medium text-body-sm ${tx.type === 'expense' ? 'text-error' : 'text-primary'}`}>
                            {tx.type === 'expense' ? '-' : '+'}{fmt(tx.amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <SpendingChart expenses={expenses} />
        </section>

        {/* Right Panel */}
        <aside className="flex flex-col gap-6">
          <BudgetOverview />
          <UpcomingBills />
          <div className="bg-tertiary-fixed/30 p-5 rounded-lg border border-tertiary-fixed">
            <div className="flex gap-3 items-start">
              <span className="material-symbols-outlined text-tertiary text-2xl flex-shrink-0">lightbulb</span>
              <p className="text-body-sm text-on-surface font-medium">
                Tip of the day: Automate your savings transfer right after payday to reach your savings goal faster.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType={modalType}
      />
    </main>
  );
};

export default Dashboard;
