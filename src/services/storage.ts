/**
 * storage.ts
 * Persistence layer for localStorage
 */

const STORAGE_KEYS = {
    USERS: 'et_users',
    TRANSACTIONS: 'et_expenses', // Kept key for compatibility but renamed internal interface
    BUDGETS: 'et_budgets',
    CATEGORIES: 'et_categories',
    BILLS: 'et_bills',
    SESSION: 'et_session'
};

export interface UserSettings {
    currency: string;
    dateFormat: string;
    defaultPaymentMethod: string;
    theme: 'light' | 'dark';
    notifications: {
        email: boolean;
        budgetAlerts: boolean;
        budgetThreshold: number;
        weeklySummary: boolean;
    };
    fullName: string;
    phone: string;
}

export interface User {
    id: number;
    email: string;
    password?: string;
    settings: UserSettings;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: number;
    desc: string;
    amount: number;
    categoryId: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    type: 'expense' | 'income';
}

export interface Expense {
    id: number;
    desc: string;
    amount: number;
    category: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    type: 'expense' | 'income';
}

export interface Budget {
    id: string;
    categoryId: string;
    limit: number;
    month: string; // YYYY-MM
}

export interface Category {
    id: string | number;
    name: string;
    icon: string;
    type?: TransactionType;
    isDefault?: boolean;
    color?: string;
}

export interface Bill {
    id: number;
    name: string;
    amount: number;
    dueDay: number; // 1–31, day of month (monthly recurring)
    icon: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
    { id: 'food', name: 'Food', icon: 'restaurant', type: 'expense', isDefault: true, color: '#FF9800' },
    { id: 'transport', name: 'Transport', icon: 'commute', type: 'expense', isDefault: true, color: '#2196F3' },
    { id: 'rent', name: 'Rent', icon: 'home', type: 'expense', isDefault: true, color: '#795548' },
    { id: 'health', name: 'Health', icon: 'medical_services', type: 'expense', isDefault: true, color: '#F44336' },
    { id: 'entertainment', name: 'Entertainment', icon: 'movie', type: 'expense', isDefault: true, color: '#9C27B0' },
    { id: 'education', name: 'Education', icon: 'school', type: 'expense', isDefault: true, color: '#3F51B5' },
    { id: 'shopping', name: 'Shopping', icon: 'shopping_bag', type: 'expense', isDefault: true, color: '#E91E63' },
    { id: 'utilities', name: 'Utilities', icon: 'bolt', type: 'expense', isDefault: true, color: '#FFEB3B' },
    { id: 'travel', name: 'Travel', icon: 'flight', type: 'expense', isDefault: true, color: '#00BCD4' },
    { id: 'salary', name: 'Salary', icon: 'work', type: 'income', isDefault: true, color: '#4CAF50' },
    { id: 'others', name: 'Others', icon: 'box', type: 'expense', isDefault: true, color: '#607D8B' },
];

export const DEFAULT_SETTINGS: UserSettings = {
    currency: 'USD $',
    dateFormat: 'DD/MM',
    defaultPaymentMethod: 'Cash',
    theme: 'light',
    notifications: {
        email: true,
        budgetAlerts: true,
        budgetThreshold: 80,
        weeklySummary: false
    },
    fullName: '',
    phone: ''
};

export const Storage = {
    getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
    
    saveUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
    
    getTransactions: (userId: number): Transaction[] => {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '{}');
        return all[userId] || [];
    },
    
    saveTransactions: (userId: number, transactions: Transaction[]) => {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '{}');
        all[userId] = transactions;
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
    },

    getExpenses: (userId: number): Expense[] => {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '{}');
        return all[userId] || [];
    },

    saveExpenses: (userId: number, expenses: Expense[]) => {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '{}');
        all[userId] = expenses;
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
    },

    getBudgets: (userId: number): Budget[] => {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS) || '{}');
        return all[userId] || [];
    },
    
    saveBudgets: (userId: number, budgets: Budget[]) => {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS) || '{}');
        all[userId] = budgets;
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(all));
    },

    getCategories: (userId: number): Category[] => {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '{}');
        
        // Handle backward compatibility where et_categories might be a flat array (from previous broken implementation)
        const storedValue = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        if (storedValue && storedValue.startsWith('[')) {
            const flatArray = JSON.parse(storedValue) as Category[];
            // Convert to new format
            const migrated = { [userId]: flatArray };
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(migrated));
            return [...DEFAULT_CATEGORIES, ...flatArray];
        }

        const custom = all[userId] || [];
        // Ensure no duplicates by name
        const combined = [...DEFAULT_CATEGORIES];
        custom.forEach((c: Category) => {
            if (!combined.some(existing => existing.name.toLowerCase() === c.name.toLowerCase())) {
                combined.push(c);
            }
        });
        return combined;
    },

    saveCustomCategories: (userId: number, customCategories: Category[]) => {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '{}');
        all[userId] = customCategories;
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(all));
    },
    
    getBills: (userId: number): Bill[] => {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.BILLS) || '{}');
        return all[userId] || [];
    },

    saveBills: (userId: number, bills: Bill[]) => {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.BILLS) || '{}');
        all[userId] = bills;
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(all));
    },

    getSession: (): User | null => JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null'),
    
    saveSession: (user: User) => localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user)),
    
    clearSession: () => localStorage.removeItem(STORAGE_KEYS.SESSION)
};
