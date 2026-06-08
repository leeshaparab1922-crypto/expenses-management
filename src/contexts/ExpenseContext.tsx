import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense } from '../services/storage';
import { expenseService } from '../services/expenseService';
import { useAuth } from './AuthContext';

interface ExpenseContextType {
    expenses: Expense[];
    createExpense: (expense: Omit<Expense, 'id'>) => void;
    updateExpense: (expense: Expense) => void;
    deleteExpense: (id: number) => void;
    refreshExpenses: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const refreshExpenses = () => {
        if (currentUser) {
            setExpenses(expenseService.getAllExpenses(currentUser.id));
        } else {
            setExpenses([]);
        }
    };

    useEffect(() => {
        refreshExpenses();
    }, [currentUser]);

    const createExpense = (expenseData: Omit<Expense, 'id'>) => {
        if (!currentUser) return;
        expenseService.createExpense(currentUser.id, expenseData);
        refreshExpenses();
    };

    const updateExpense = (expense: Expense) => {
        if (!currentUser) return;
        expenseService.updateExpense(currentUser.id, expense);
        refreshExpenses();
    };

    const deleteExpense = (id: number) => {
        if (!currentUser) return;
        expenseService.deleteExpense(currentUser.id, id);
        refreshExpenses();
    };

    return (
        <ExpenseContext.Provider value={{ expenses, createExpense, updateExpense, deleteExpense, refreshExpenses }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenses = () => {
    const context = useContext(ExpenseContext);
    if (context === undefined) {
        throw new Error('useExpenses must be used within an ExpenseProvider');
    }
    return context;
};
