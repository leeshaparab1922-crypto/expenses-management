import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage, Transaction, TransactionType } from '../services/storage';
import { useAuth } from './AuthContext';

interface TransactionContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    updateTransaction: (id: number, transaction: Partial<Transaction>) => void;
    deleteTransaction: (id: number) => void;
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        if (currentUser) {
            const loaded = Storage.getTransactions(currentUser.id);
            setTransactions(loaded);
        } else {
            setTransactions([]);
        }
    }, [currentUser]);

    const addTransaction = (data: Omit<Transaction, 'id'>) => {
        if (!currentUser) return;
        
        const newTransaction: Transaction = {
            ...data,
            id: Date.now()
        };
        
        const updated = [newTransaction, ...transactions];
        setTransactions(updated);
        Storage.saveTransactions(currentUser.id, updated);
    };

    const updateTransaction = (id: number, data: Partial<Transaction>) => {
        if (!currentUser) return;
        const updated = transactions.map(t => t.id === id ? { ...t, ...data } : t);
        setTransactions(updated);
        Storage.saveTransactions(currentUser.id, updated);
    };

    const deleteTransaction = (id: number) => {
        if (!currentUser) return;
        const updated = transactions.filter(t => t.id !== id);
        setTransactions(updated);
        Storage.saveTransactions(currentUser.id, updated);
    };

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpenses;

    return (
        <TransactionContext.Provider value={{ 
            transactions, 
            addTransaction, 
            updateTransaction, 
            deleteTransaction, 
            totalBalance,
            totalIncome,
            totalExpenses
        }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};
