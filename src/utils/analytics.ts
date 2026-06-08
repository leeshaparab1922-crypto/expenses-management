import { Expense } from '../services/storage';

export const analytics = {
  getMonthlySpending: (expenses: Expense[]) => {
    // Aggregation logic for monthly expenses
    const monthlyData = expenses.reduce((acc, exp) => {
        const month = new Date(exp.date).toLocaleString('default', { month: 'short' }).toUpperCase();
        if (exp.type === 'expense') {
            acc[month] = (acc[month] || 0) + exp.amount;
        }
        return acc;
    }, {} as Record<string, number>);
    return monthlyData;
  },

  getCategoryBreakdown: (expenses: Expense[]) => {
    return expenses.reduce((acc, exp) => {
      if (exp.type === 'expense') {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      }
      return acc;
    }, {} as Record<string, number>);
  },

  getBudgetUtilization: (expenses: Expense[], budgets: any[]) => {
    const categorySpending = analytics.getCategoryBreakdown(expenses);
    return budgets.map(b => ({
        category: b.category,
        spent: categorySpending[b.category] || 0,
        limit: b.limit,
        percentage: ((categorySpending[b.category] || 0) / b.limit) * 100
    }));
  },

  getTopCategories: (expenses: Expense[], top = 5) => {
    const breakdown = analytics.getCategoryBreakdown(expenses);
    return Object.entries(breakdown)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, top);
  },

  getSpendingTrend: (expenses: Expense[]) => {
      // Simplified trend over time
      return expenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  getIncomeVsExpense: (expenses: Expense[]) => {
      return expenses.reduce((acc, exp) => {
          if (exp.type === 'income') acc.income += exp.amount;
          else acc.expense += exp.amount;
          return acc;
      }, { income: 0, expense: 0 });
  },

  getSavingsTrend: (expenses: Expense[]) => {
      // Logic for savings over time
      return []; 
  },

  getAverageDailySpend: (expenses: Expense[]) => {
      const expensesOnly = expenses.filter(e => e.type === 'expense');
      if (expensesOnly.length === 0) return 0;
      const total = expensesOnly.reduce((sum, e) => sum + e.amount, 0);
      // Simplified average
      return total / 30;
  },

  getLargestTransactions: (expenses: Expense[], count = 5) => {
      return [...expenses].sort((a, b) => b.amount - a.amount).slice(0, count);
  }
};
