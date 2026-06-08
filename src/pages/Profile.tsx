<<<<<<< HEAD
import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionContext';
import { UserSettings } from '../services/storage';

const Profile: React.FC = () => {
    const { currentUser, updateSettings, logout } = useAuth();
    const { transactions } = useTransactions();
    
    const [fullName, setFullName] = useState(currentUser?.settings?.fullName || '');
    const [phone, setPhone] = useState(currentUser?.settings?.phone || '');
    const [email, setEmail] = useState(currentUser?.email || '');

    const [currency, setCurrency] = useState(currentUser?.settings?.currency || 'USD $');
    const [dateFormat, setDateFormat] = useState(currentUser?.settings?.dateFormat || 'DD/MM');
    const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(currentUser?.settings?.defaultPaymentMethod || 'Cash');
    
    const [notifications, setNotifications] = useState(currentUser?.settings?.notifications || {
        email: true,
        budgetAlerts: true,
        budgetThreshold: 80,
        weeklySummary: false
    });

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings({ fullName, phone });
        alert('Profile updated!');
    };

    const handleSavePreferences = () => {
        updateSettings({ 
            currency, 
            dateFormat, 
            defaultPaymentMethod,
            notifications
        });
        alert('Preferences updated!');
    };

    const handleToggleNotification = (key: keyof UserSettings['notifications']) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <MainLayout>
            <div className="max-w-md mx-auto px-4 md:px-margin-mobile pt-8 pb-32 space-y-gutter">
                {/* Page Title */}
                <div className="flex flex-col gap-1">
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile">Profile & Settings</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Manage your account and preferences</p>
                </div>

                {/* 1. Profile Section */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-6">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative w-24 h-24">
                            <img alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-primary-container p-1 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE1dkDIfEiq5K4I4-iTEqhhN7ldmLMYe9-7CpHm4m_2KeRGSX67nXw4nor75JvBwFx6jPTbB-YzXZlJx3_0pxBqs5xBz1LDysQTmAxeEIrGuT1qWyhXGRFLR_4fyKdm1gxInxBCE2Vxee14qiHLftdSfetYui7VrRFYR94K5nRdj5n_dZbGqwuBcXR3G4VWpfWbLRPhS-T1py0r6p3mjbx2_JDnrgxShiOcdco4Wq6nFOFLau_Pmo2aoSU-uUMDvDABg3QlnMPQwe-" />
                            <button className="absolute bottom-0 right-0 bg-primary-container text-on-primary-container p-2 rounded-full shadow-lg border border-surface-container-lowest transition-transform active:scale-95">
                                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                            </button>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center gap-1 bg-secondary-container px-3 py-0.5 rounded-full mb-1">
                                <span className="material-symbols-outlined text-[14px] text-on-secondary-container filled-icon">verified</span>
                                <span className="font-label-md text-label-md text-on-secondary-container">Premium</span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">Member since: Oct 2023</p>
                        </div>
                    </div>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="space-y-2">
                            <label className="font-label-md text-label-md text-on-surface-variant ml-1">Full Name</label>
                            <input 
                                className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface focus:ring-0 font-body-lg text-body-lg outline-none" 
                                type="text" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-label-md text-label-md text-on-surface-variant ml-1">Email Address</label>
                            <input 
                                className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface focus:ring-0 font-body-lg text-body-lg outline-none opacity-50" 
                                type="email" 
                                value={email}
                                readOnly
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-label-md text-label-md text-on-surface-variant ml-1">Phone Number</label>
                            <input 
                                className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface focus:ring-0 font-body-lg text-body-lg outline-none" 
                                type="tel" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        <button type="submit" className="w-full h-12 bg-primary-container text-on-primary-container font-medium rounded-lg transition-all active:scale-[0.98] hover:shadow-md">
                            Save Changes
                        </button>
                    </form>
                </section>

                {/* 2. Preferences Section */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-6">
                    <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">tune</span>
                        Preferences
                    </h3>
                    <div className="space-y-6">
                        {/* Currency */}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="font-body-lg text-body-lg">Default Currency</span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant">Used for all calculations</span>
                            </div>
                            <select 
                                className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-label-md text-label-md min-w-[100px] outline-none"
                                value={currency}
                                onChange={(e) => { setCurrency(e.target.value); handleSavePreferences(); }}
                            >
                                <option value="USD $">USD $</option>
                                <option value="INR ₹">INR ₹</option>
                                <option value="EUR €">EUR €</option>
                                <option value="GBP £">GBP £</option>
                            </select>
                        </div>
                        {/* Date Format */}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="font-body-lg text-body-lg">Date Format</span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant">Display style for lists</span>
                            </div>
                            <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant">
                                <button 
                                    className={`px-3 py-1 rounded-md text-label-md transition-all ${dateFormat === 'DD/MM' ? 'bg-surface-container-lowest shadow-sm' : 'text-on-surface-variant'}`}
                                    onClick={() => { setDateFormat('DD/MM'); handleSavePreferences(); }}
                                >DD/MM</button>
                                <button 
                                    className={`px-3 py-1 rounded-md text-label-md transition-all ${dateFormat === 'MM/DD' ? 'bg-surface-container-lowest shadow-sm' : 'text-on-surface-variant'}`}
                                    onClick={() => { setDateFormat('MM/DD'); handleSavePreferences(); }}
                                >MM/DD</button>
                            </div>
                        </div>
                        {/* Default Payment */}
                        <div className="flex flex-col gap-2">
                            <span className="font-body-lg text-body-lg">Default Payment Method</span>
                            <div className="grid grid-cols-3 gap-2">
                                {['Cash', 'Card', 'UPI'].map(method => (
                                    <button 
                                        key={method}
                                        onClick={() => { setDefaultPaymentMethod(method); handleSavePreferences(); }}
                                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${defaultPaymentMethod === method ? 'border-primary-container bg-primary-container/10 text-primary' : 'border-outline-variant bg-surface hover:bg-surface-container-high'}`}
                                    >
                                        <span className="material-symbols-outlined">{method === 'Cash' ? 'account_balance_wallet' : method === 'Card' ? 'credit_card' : 'payments'}</span>
                                        <span className="text-label-md font-label-md">{method}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Notifications Section */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-6">
                    <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">notifications</span>
                        Notifications
                    </h3>
                    <div className="space-y-6">
                        {/* Toggle Items */}
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="font-body-lg text-body-lg">Email Notifications</span>
                            <div className="relative inline-block w-12 h-6" onClick={() => { handleToggleNotification('email'); handleSavePreferences(); }}>
                                <div className={`block w-12 h-6 rounded-full transition-colors border border-outline-variant ${notifications.email ? 'bg-primary' : 'bg-surface-container-high'}`}>
                                    <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications.email ? 'left-7' : 'left-1'}`}></div>
                                </div>
                            </div>
                        </label>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="font-body-lg text-body-lg">Budget Alerts</span>
                                <div className="relative inline-block w-12 h-6" onClick={() => { handleToggleNotification('budgetAlerts'); handleSavePreferences(); }}>
                                    <div className={`block w-12 h-6 rounded-full transition-colors border border-outline-variant ${notifications.budgetAlerts ? 'bg-primary' : 'bg-surface-container-high'}`}>
                                        <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications.budgetAlerts ? 'left-7' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            </label>
                            {notifications.budgetAlerts && (
                                <div className="flex items-center gap-3 bg-surface p-3 rounded-lg border border-outline-variant">
                                    <span className="font-body-sm text-body-sm text-on-surface-variant">Notify me when I reach</span>
                                    <div className="flex items-center gap-1">
                                        <input 
                                            className="w-12 h-8 text-center p-0 border border-outline-variant rounded font-label-md outline-none focus:border-primary" 
                                            type="number" 
                                            value={notifications.budgetThreshold}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setNotifications(prev => ({ ...prev, budgetThreshold: val }));
                                                updateSettings({ notifications: { ...notifications, budgetThreshold: val } });
                                            }}
                                        />
                                        <span className="font-label-md">%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 4. Data & Export Section */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-6">
                    <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">database</span>
                        Data & Export
                    </h3>
                    <div className="flex flex-col gap-3">
                        <button className="flex items-center justify-center gap-2 w-full h-12 border border-primary text-primary font-medium rounded-lg hover:bg-primary-container/10 transition-colors">
                            <span className="material-symbols-outlined">csv</span>
                            Export All Transactions (CSV)
                        </button>
                    </div>
                    <div className="pt-6 border-t border-outline-variant">
                        <button 
                            onClick={logout}
                            className="flex items-center justify-center gap-2 w-full h-12 border border-error text-error font-medium rounded-lg hover:bg-error-container/20 transition-colors"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Logout Session
                        </button>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
=======
import React from 'react';

const Profile: React.FC = () => {
  return <div>Profile Page Placeholder</div>;
>>>>>>> feature/stack-upgrade
};

export default Profile;
