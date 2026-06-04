/**
 * storage.js
 * Persistence layer for localStorage
 */

const STORAGE_KEYS = {
    USERS: 'et_users',
    EXPENSES: 'et_expenses',
    SESSION: 'et_session'
};

export const Storage = {
    getUsers: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [],
    
    saveUsers: (users) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),
    
    getExpenses: (userId) => {
        const allExpenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES)) || {};
        return allExpenses[userId] || [];
    },
    
    saveExpenses: (userId, expenses) => {
        const allExpenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES)) || {};
        allExpenses[userId] = expenses;
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(allExpenses));
    },
    
    getSession: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION)),
    
    saveSession: (user) => localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user)),
    
    clearSession: () => localStorage.removeItem(STORAGE_KEYS.SESSION)
};
