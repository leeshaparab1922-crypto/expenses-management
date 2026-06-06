import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage, User, UserSettings, DEFAULT_SETTINGS } from '../services/storage';

interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string) => void;
    signup: (email: string, password: string) => void;
    logout: () => void;
    updateSettings: (settings: Partial<UserSettings>) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const session = Storage.getSession();
        if (session) {
            setCurrentUser(session);
        }
    }, []);

    const login = (email: string, password: string) => {
        const users = Storage.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid credentials');
        }
        
        Storage.saveSession(user);
        setCurrentUser(user);
        setError(null);
    };

    const signup = (email: string, password: string) => {
        const users = Storage.getUsers();
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }
        
        const newUser: User = { 
            id: Date.now(), 
            email, 
            password,
            settings: { ...DEFAULT_SETTINGS }
        };
        users.push(newUser);
        Storage.saveUsers(users);
        login(email, password);
    };

    const logout = () => {
        Storage.clearSession();
        setCurrentUser(null);
        setError(null);
    };

    const updateSettings = (newSettings: Partial<UserSettings>) => {
        if (!currentUser) return;

        const updatedUser: User = {
            ...currentUser,
            settings: { ...currentUser.settings, ...newSettings }
        };

        // Update in session
        Storage.saveSession(updatedUser);
        setCurrentUser(updatedUser);

        // Update in users list
        const users = Storage.getUsers();
        const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        Storage.saveUsers(updatedUsers);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, signup, logout, updateSettings, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
