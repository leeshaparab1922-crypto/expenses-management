/**
 * auth.js
 * Business logic for Authentication
 */
import { Storage } from './storage.js';
import { Store } from './store.js';

export const Auth = {
    init: () => {
        const session = Storage.getSession();
        if (session) {
            Auth.loginSuccess(session);
        }
    },

    signup: (email, password) => {
        const users = Storage.getUsers();
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }
        
        const newUser = { id: Date.now(), email, password };
        users.push(newUser);
        Storage.saveUsers(users);
        return Auth.login(email, password);
    },

    login: (email, password) => {
        const users = Storage.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid credentials');
        }
        
        Auth.loginSuccess(user);
        return user;
    },

    loginSuccess: (user) => {
        Storage.saveSession(user);
        const expenses = Storage.getExpenses(user.id);
        Store.setState({
            currentUser: user,
            expenses: expenses,
            view: 'dashboard'
        });
    },

    logout: () => {
        Storage.clearSession();
        Store.setState({
            currentUser: null,
            expenses: [],
            view: 'auth'
        });
    }
};
