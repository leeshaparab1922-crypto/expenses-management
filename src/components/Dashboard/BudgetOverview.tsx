import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudgets } from '../../contexts/BudgetContext';
import { useExpenses } from '../../contexts/ExpenseContext';

const BudgetOverview: React.FC = () => {
  const { budgets } = useBudgets();
  const { expenses } = useExpenses();
  const navigate = useNavigate();

  const now = new Date();
  const budgetsWithUsage = useMemo(() => {
    const thisMonthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return e.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    return budgets.map(b => {
      const spent = thisMonthExpenses
        .filter(e => e.category.toLowerCase() === b.category.toLowerCase())
        .reduce((sum, e) => sum + e.amount, 0);
      const pct = b.limit > 0 ? Math.min(Math.round((spent / b.limit) * 100), 100) : 0;
      return { ...b, spent, pct };
    });
  }, [budgets, expenses]);

  const displayBudgets = budgetsWithUsage.slice(0, 4);

  return (
    <div className="bg-surface card-shadow p-6 rounded-lg">
      <h3 className="text-label-md font-label-md text-on-surface-variant mb-6">BUDGET OVERVIEW</h3>
      {displayBudgets.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant text-center py-4">No budgets set yet.</p>
      ) : (
        <div className="space-y-5">
          {displayBudgets.map(b => {
            const over = b.pct >= 85;
            return (
              <div key={b.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-body-sm font-medium">{b.category}</span>
                  <span className={`text-label-md font-bold ${over ? 'text-error' : 'text-tertiary'}`}>{b.pct}%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className={`${over ? 'bg-error' : 'bg-tertiary'} h-full rounded-full transition-all`}
                    style={{ width: `${b.pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <button
        onClick={() => navigate('/budget')}
        className="w-full mt-6 py-2 border border-primary text-primary text-label-md font-bold rounded-lg hover:bg-primary-container/10 transition-all"
      >
        Adjust Budgets
      </button>
    </div>
  );
};

export default BudgetOverview;
