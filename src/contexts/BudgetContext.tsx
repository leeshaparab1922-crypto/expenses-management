import React, { createContext, useContext, useState, useEffect } from 'react';
import { Budget } from '../services/budgetService';
import { budgetService } from '../services/budgetService';

interface BudgetContextType {
    budgets: Budget[];
    createBudget: (budget: Omit<Budget, 'id'>) => void;
    updateBudget: (budget: Budget) => void;
    deleteBudget: (id: number) => void;
    refreshBudgets: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [budgets, setBudgets] = useState<Budget[]>([]);

    const refreshBudgets = () => {
        setBudgets(budgetService.getAllBudgets());
    };

    useEffect(() => {
        refreshBudgets();
    }, []);

    const createBudget = (budgetData: Omit<Budget, 'id'>) => {
        budgetService.createBudget(budgetData);
        refreshBudgets();
    };

    const updateBudget = (budget: Budget) => {
        budgetService.updateBudget(budget);
        refreshBudgets();
    };

    const deleteBudget = (id: number) => {
        budgetService.deleteBudget(id);
        refreshBudgets();
    };

    return (
        <BudgetContext.Provider value={{ budgets, createBudget, updateBudget, deleteBudget, refreshBudgets }}>
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudgets = () => {
    const context = useContext(BudgetContext);
    if (context === undefined) {
        throw new Error('useBudgets must be used within an BudgetProvider');
    }
    return context;
};
