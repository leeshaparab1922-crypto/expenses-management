/**
 * store.js
 * Central Application State
 */

let state = {
    currentUser: null,
    expenses: [],
    view: 'auth' // 'auth' or 'dashboard'
};

const listeners = [];

export const Store = {
    getState: () => ({ ...state }),
    
    setState: (newState) => {
        state = { ...state, ...newState };
        listeners.forEach(listener => listener(state));
    },
    
    subscribe: (listener) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
        };
    }
};
