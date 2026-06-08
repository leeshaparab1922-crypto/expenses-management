export interface Budget {
    id: number;
    category: string;
    limit: number;
}

const STORAGE_KEY = 'et_budgets';

export const budgetService = {
    getAllBudgets: (): Budget[] => {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    },
    
    getBudgetById: (id: number): Budget | undefined => {
        return budgetService.getAllBudgets().find(b => b.id === id);
    },
    
    createBudget: (budget: Omit<Budget, 'id'>): Budget => {
        const budgets = budgetService.getAllBudgets();
        const newBudget: Budget = { ...budget, id: Date.now() };
        budgets.push(newBudget);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
        return newBudget;
    },
    
    updateBudget: (updatedBudget: Budget): void => {
        const budgets = budgetService.getAllBudgets();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets.map(b => b.id === updatedBudget.id ? updatedBudget : b)));
    },
    
    deleteBudget: (id: number): void => {
        const budgets = budgetService.getAllBudgets();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets.filter(b => b.id !== id)));
    }
};
