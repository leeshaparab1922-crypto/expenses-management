import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage, Budget } from '../services/storage';
import { useAuth } from './AuthContext';

interface BudgetContextType {
    budgets: Budget[];
    addBudget: (budget: Omit<Budget, 'id'>) => void;
    updateBudget: (id: string, limit: number) => void;
    deleteBudget: (id: string) => void;
    getBudgetForCategory: (categoryId: string, month: string) => Budget | undefined;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const [budgets, setBudgets] = useState<Budget[]>([]);

    useEffect(() => {
        if (currentUser) {
            const loaded = Storage.getBudgets(currentUser.id);
            setBudgets(loaded);
        } else {
            setBudgets([]);
        }
    }, [currentUser]);

    const addBudget = (budgetData: Omit<Budget, 'id'>) => {
        if (!currentUser) return;
        
        // Check if budget already exists for this category/month
        const existing = budgets.find(b => b.categoryId === budgetData.categoryId && b.month === budgetData.month);
        if (existing) {
            updateBudget(existing.id, budgetData.limit);
            return;
        }

        const newBudget: Budget = {
            ...budgetData,
            id: 'budget_' + Date.now()
        };
        
        const updated = [...budgets, newBudget];
        setBudgets(updated);
        Storage.saveBudgets(currentUser.id, updated);
    };

    const updateBudget = (id: string, limit: number) => {
        if (!currentUser) return;
        const updated = budgets.map(b => b.id === id ? { ...b, limit } : b);
        setBudgets(updated);
        Storage.saveBudgets(currentUser.id, updated);
    };

    const deleteBudget = (id: string) => {
        if (!currentUser) return;
        const updated = budgets.filter(b => b.id !== id);
        setBudgets(updated);
        Storage.saveBudgets(currentUser.id, updated);
    };

    const getBudgetForCategory = (categoryId: string, month: string) => {
        return budgets.find(b => b.categoryId === categoryId && b.month === month);
    };

    return (
        <BudgetContext.Provider value={{ budgets, addBudget, updateBudget, deleteBudget, getBudgetForCategory }}>
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudgets = () => {
    const context = useContext(BudgetContext);
    if (context === undefined) {
        throw new Error('useBudgets must be used within a BudgetProvider');
    }
    return context;
};
