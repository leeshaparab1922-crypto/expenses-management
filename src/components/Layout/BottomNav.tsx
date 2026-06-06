import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav: React.FC = () => {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 pb-safe bg-surface-container dark:bg-surface-container-low border-t border-outline-variant dark:border-outline z-40">
            <NavLink to="/dashboard" className={({ isActive }) => 
                `flex flex-col items-center justify-center px-4 py-1 transition-all active:scale-90 duration-100 ${isActive ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-xl' : 'text-on-surface-variant dark:text-outline-variant hover:text-primary'}`
            }>
                <span className="material-symbols-outlined">dashboard</span>
                <span className="font-label-md text-label-md mt-0.5">Overview</span>
            </NavLink>
            <NavLink to="/budget" className={({ isActive }) => 
                `flex flex-col items-center justify-center px-4 py-1 transition-all active:scale-90 duration-100 ${isActive ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-xl' : 'text-on-surface-variant dark:text-outline-variant hover:text-primary'}`
            }>
                <span className="material-symbols-outlined">account_balance_wallet</span>
                <span className="font-label-md text-label-md mt-0.5">Budgets</span>
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => 
                `flex flex-col items-center justify-center px-4 py-1 transition-all active:scale-90 duration-100 ${isActive ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-xl' : 'text-on-surface-variant dark:text-outline-variant hover:text-primary'}`
            }>
                <span className="material-symbols-outlined">receipt_long</span>
                <span className="font-label-md text-label-md mt-0.5">Transactions</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => 
                `flex flex-col items-center justify-center px-4 py-1 transition-all active:scale-90 duration-100 ${isActive ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-xl' : 'text-on-surface-variant dark:text-outline-variant hover:text-primary'}`
            }>
                <span className="material-symbols-outlined">person</span>
                <span className="font-label-md text-label-md mt-0.5">Profile</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
