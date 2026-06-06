import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage, Expense } from '../services/storage';
import { useAuth } from './AuthContext';

interface ExpenseContextType {
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id'>) => void;
    deleteExpense: (id: number) => void;
    totalBalance: number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        if (currentUser) {
            const loadedExpenses = Storage.getExpenses(currentUser.id);
            setExpenses(loadedExpenses);
        } else {
            setExpenses([]);
        }
    }, [currentUser]);

    const addExpense = (expenseData: Omit<Expense, 'id'>) => {
        if (!currentUser) return;
        
        const newExpense: Expense = {
            ...expenseData,
            id: Date.now()
        };
        
        const updatedExpenses = [newExpense, ...expenses];
        setExpenses(updatedExpenses);
        Storage.saveExpenses(currentUser.id, updatedExpenses);
    };

    const deleteExpense = (id: number) => {
        if (!currentUser) return;
        
        const updatedExpenses = expenses.filter(e => e.id !== id);
        setExpenses(updatedExpenses);
        Storage.saveExpenses(currentUser.id, updatedExpenses);
    };

    const totalBalance = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, totalBalance }}>
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
