/**
 * storage.ts
 * Persistence layer for localStorage
 */

const STORAGE_KEYS = {
    USERS: 'et_users',
    EXPENSES: 'et_expenses',
    SESSION: 'et_session'
};

export interface User {
    id: number;
    email: string;
    password?: string;
}

export interface Expense {
    id: number;
    desc: string;
    amount: number;
    category: string;
    date: string;
}

export const Storage = {
    getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
    
    saveUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
    
    getExpenses: (userId: number): Expense[] => {
        const allExpenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '{}');
        return allExpenses[userId] || [];
    },
    
    saveExpenses: (userId: number, expenses: Expense[]) => {
        const allExpenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '{}');
        allExpenses[userId] = expenses;
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(allExpenses));
    },
    
    getSession: (): User | null => JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null'),
    
    saveSession: (user: User) => localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user)),
    
    clearSession: () => localStorage.removeItem(STORAGE_KEYS.SESSION)
};
