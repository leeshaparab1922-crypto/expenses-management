import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
    const { currentUser } = useAuth();

    return (
        <header className="bg-surface sticky top-0 z-50 border-b border-outline-variant">
            <div className="flex justify-between items-center h-16 w-full px-4 md:px-margin-desktop max-w-container-max-width mx-auto">
                <div className="flex items-center gap-base">
                    <img alt="SpendWise Logo" className="h-8 w-auto" src="https://lh3.googleusercontent.com/aida/AP1WRLsOS_TqHFHlhyXjTRl2XS4gTpDt_2dZet8gWivcFidkQ_JxTe0_1koMGUD_NKfqVUrDXyiXM4E21IjSxbiO3UlFejvEAazNgEEeuoJ4ygsAIZOYKLVPjwfo3rlOmkIUsIT4I-t3OUb_IH_PjedUc26OYpVGHgirPQLpxHFX7lcwisKiy-rFBUNyRkIn3DeIY5tXUjH5Mc33_JCLJYW9vUhv1y-JlOhcLKAu4W26n-MhnKQtms15wg6dwZYI" />
                    <span className="text-headline-md font-headline-md font-bold text-primary">SpendWise</span>
                </div>
                
                <nav className="hidden md:flex items-center gap-8">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"}>Dashboard</NavLink>
                    <NavLink to="/history" className={({ isActive }) => isActive ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"}>Transactions</NavLink>
                    <NavLink to="/budget" className={({ isActive }) => isActive ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"}>Budgets</NavLink>
                    <NavLink to="/reports" className={({ isActive }) => isActive ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"}>Reports</NavLink>
                    <NavLink to="/categories" className={({ isActive }) => isActive ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"}>Categories</NavLink>
                </nav>

                <div className="flex items-center gap-gutter">
                    <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-all">notifications</button>
                    <NavLink to="/profile" className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden block">
                        <img alt="User avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE1dkDIfEiq5K4I4-iTEqhhN7ldmLMYe9-7CpHm4m_2KeRGSX67nXw4nor75JvBwFx6jPTbB-YzXZlJx3_0pxBqs5xBz1LDysQTmAxeEIrGuT1qWyhXGRFLR_4fyKdm1gxInxBCE2Vxee14qiHLftdSfetYui7VrRFYR94K5nRdj5n_dZbGqwuBcXR3G4VWpfWbLRPhS-T1py0r6p3mjbx2_JDnrgxShiOcdco4Wq6nFOFLau_Pmo2aoSU-uUMDvDABg3QlnMPQwe-" />
                    </NavLink>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
