import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage, User, UserSettings, DEFAULT_SETTINGS } from '../services/storage';
import { supabase } from '../supabaseClient';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthContextType {
    currentUser: User | null;
    authLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<{ requiresVerification: boolean }>;
    logout: () => void;
    updateSettings: (settings: Partial<UserSettings>) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Maps a confirmed Supabase user to a local User record (preserves numeric ID for data layer compatibility)
const getOrCreateLocalUser = (email: string): User => {
    const users = Storage.getUsers();
    let localUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!localUser) {
        localUser = {
            id: Date.now(),
            email,
            settings: { ...DEFAULT_SETTINGS }
        };
        users.push(localUser);
        Storage.saveUsers(users);
    }
    return localUser;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Restore session on mount
        supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
            if (session?.user?.email) {
                const localUser = getOrCreateLocalUser(session.user.email);
                Storage.saveSession(localUser);
                setCurrentUser(localUser);
            }
            setAuthLoading(false);
        });

        // Handle email verification redirect and session changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            if (event === 'SIGNED_IN' && session?.user?.email) {
                const localUser = getOrCreateLocalUser(session.user.email);
                Storage.saveSession(localUser);
                setCurrentUser(localUser);
            } else if (event === 'SIGNED_OUT') {
                Storage.clearSession();
                setCurrentUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

        if (authError) {
            if (authError.message.toLowerCase().includes('email not confirmed')) {
                throw new Error('Please verify your email address before logging in. Check your inbox for the verification link.');
            }
            throw new Error('Invalid credentials');
        }

        if (data.user?.email) {
            const localUser = getOrCreateLocalUser(data.user.email);
            Storage.saveSession(localUser);
            setCurrentUser(localUser);
        }
        setError(null);
    };

    const signup = async (email: string, password: string): Promise<{ requiresVerification: boolean }> => {
        const { data, error: authError } = await supabase.auth.signUp({ email, password });

        if (authError) {
            const msg = authError.message.toLowerCase();
            if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user already registered')) {
                throw new Error('User already exists');
            }
            throw new Error(authError.message);
        }

        // data.session is null when Supabase email confirmation is enabled
        if (!data.session) {
            return { requiresVerification: true };
        }

        // Email confirmation disabled in Supabase — session returned immediately
        if (data.user?.email) {
            const localUser = getOrCreateLocalUser(data.user.email);
            Storage.saveSession(localUser);
            setCurrentUser(localUser);
        }
        return { requiresVerification: false };
    };

    const logout = () => {
        supabase.auth.signOut(); // fire-and-forget; local state clears immediately
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

        Storage.saveSession(updatedUser);
        setCurrentUser(updatedUser);

        const users = Storage.getUsers();
        const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        Storage.saveUsers(updatedUsers);
    };

    return (
        <AuthContext.Provider value={{ currentUser, authLoading, login, signup, logout, updateSettings, error, setError }}>
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
