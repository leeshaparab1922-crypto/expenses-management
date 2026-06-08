import { Storage, Expense } from './storage';

export const expenseService = {
    getAllExpenses: (userId: number): Expense[] => {
        return Storage.getExpenses(userId);
    },
    
    getExpenseById: (userId: number, expenseId: number): Expense | undefined => {
        return Storage.getExpenses(userId).find(e => e.id === expenseId);
    },
    
    createExpense: (userId: number, expense: Omit<Expense, 'id'>): Expense => {
        const expenses = Storage.getExpenses(userId);
        const newExpense: Expense = { 
            ...expense, 
            id: Date.now()
        };
        expenses.push(newExpense);
        Storage.saveExpenses(userId, expenses);
        return newExpense;
    },
    
    updateExpense: (userId: number, updatedExpense: Expense): void => {
        let expenses = Storage.getExpenses(userId);
        expenses = expenses.map(e => e.id === updatedExpense.id ? { ...updatedExpense, updatedAt: new Date().toISOString() } : e);
        Storage.saveExpenses(userId, expenses);
    },
    
    deleteExpense: (userId: number, expenseId: number): void => {
        let expenses = Storage.getExpenses(userId);
        expenses = expenses.filter(e => e.id !== expenseId);
        Storage.saveExpenses(userId, expenses);
    }
};
