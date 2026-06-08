<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionContext';
import { useCategories } from '../contexts/CategoryContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TransactionType } from '../services/storage';

const TransactionPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { addTransaction } = useTransactions();
    const { categories } = useCategories();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [type, setType] = useState<TransactionType>((searchParams.get('type') as TransactionType) || 'expense');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [categoryId, setCategoryId] = useState('');
    const [desc, setDesc] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    useEffect(() => {
        const filteredCategories = categories.filter(c => c.type === type);
        if (filteredCategories.length > 0) {
            setCategoryId(filteredCategories[0].id);
        }
    }, [type, categories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !categoryId) return;

        addTransaction({
            type,
            amount: parseFloat(amount),
            date,
            categoryId,
            desc,
            paymentMethod
        });
        navigate('/dashboard');
    };

    const currencySymbol = currentUser?.settings?.currency.split(' ')[1] || '$';

    return (
        <MainLayout>
            <div className="pt-8 px-4 md:px-margin-mobile flex justify-center">
                <div className="w-full max-w-[600px] bg-white rounded-xl shadow-sm border border-outline-variant p-6 mb-8">
                    {/* Toggle Section */}
                    <div className="flex bg-surface-container p-1 rounded-lg mb-8">
                        <button 
                            className={`flex-1 py-3 px-4 rounded-md font-label-md text-label-md transition-all duration-200 ${type === 'expense' ? 'bg-error-container text-error font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                            onClick={() => setType('expense')}
                        >
                            Expense
                        </button>
                        <button 
                            className={`flex-1 py-3 px-4 rounded-md font-label-md text-label-md transition-all duration-200 ${type === 'income' ? 'bg-tertiary-fixed text-tertiary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                            onClick={() => setType('income')}
                        >
                            Income
                        </button>
                    </div>

                    {/* Large Amount Input */}
                    <div className="text-center mb-10">
                        <p className="font-label-md text-label-md text-on-surface-variant mb-2">Total Amount</p>
                        <div className="relative flex items-center justify-center">
                            <span className="text-4xl font-numeric-display text-primary mr-2">{currencySymbol}</span>
                            <input 
                                className="numeric-input-large w-full max-w-[240px] text-center border-none focus:ring-0 text-5xl font-bold font-numeric-display text-on-surface placeholder-outline-variant bg-transparent outline-none" 
                                placeholder="0.00" 
                                type="number"
                                step="0.01"
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../contexts/ExpenseContext';

const Transaction: React.FC = () => {
    const { createExpense } = useExpenses();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState<'expense' | 'income'>('expense');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        createExpense({
            amount: parseFloat(amount),
            category,
            desc,
            date,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            type
        });
        
        navigate('/dashboard');
    };

    return (
        <main className="pt-20 px-4 flex justify-center">
            <div className="w-full max-w-[600px] bg-white rounded-xl shadow-sm border border-outline-variant p-6 mb-8">
                {/* Toggle Section */}
                <div className="flex bg-surface-container p-1 rounded-lg mb-8">
                    <button
                        className={`flex-1 py-3 px-4 rounded-md font-label-md text-label-md transition-all ${type === 'expense' ? 'bg-error-container text-error font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                        onClick={() => setType('expense')}
                    >
                        Expense
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 rounded-md font-label-md text-label-md transition-all ${type === 'income' ? 'bg-tertiary-fixed text-tertiary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                        onClick={() => setType('income')}
                    >
                        Income
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center mb-10">
                        <p className="font-label-md text-label-md text-on-surface-variant mb-2">Total Amount</p>
                        <div className="relative flex items-center justify-center">
                            <span className="text-4xl font-numeric-display text-primary mr-2">₹</span>
                            <input
                                className="w-full max-w-[240px] text-center border-none focus:ring-0 text-5xl font-bold font-numeric-display text-on-surface placeholder-outline-variant bg-transparent"
                                placeholder="0.00"
                                type="number"
>>>>>>> feature/stack-upgrade
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
<<<<<<< HEAD
                        <div className="w-32 h-1 bg-primary-container/20 mx-auto mt-2 rounded-full"></div>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Date Picker */}
                        <div>
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-1">Date</label>
                            <div className="relative">
                                <input 
                                    className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-surface-container-lowest" 
                                    type="date" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Category Dropdown */}
                        <div>
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-1">Category</label>
                            <div className="relative">
                                <select 
                                    className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-surface-container-lowest appearance-none cursor-pointer"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    required
                                >
                                    {categories.filter(c => c.type === type).map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-1">Description (Optional)</label>
                            <input 
                                className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-surface-container-lowest" 
                                placeholder="What was this for?" 
                                type="text"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-3 ml-1">Payment Method</label>
                            <div className="flex flex-wrap gap-3">
                                {['Cash', 'UPI', 'Card', 'Transfer'].map(method => (
                                    <label key={method} className="flex-1 min-w-[80px] cursor-pointer group">
                                        <input 
                                            className="sr-only peer" 
                                            name="payment" 
                                            type="radio" 
                                            value={method}
                                            checked={paymentMethod === method}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <div className="h-11 flex items-center justify-center rounded-lg border border-outline-variant peer-checked:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container group-hover:bg-surface-container-high transition-all text-body-sm font-label-md">
                                            {method}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <button 
                            type="submit"
                            className="w-full h-14 bg-primary-container text-on-primary-container rounded-lg font-label-md text-headline-md font-bold shadow-md hover:bg-primary transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                        >
                            Save Transaction
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
};

export default TransactionPage;
=======
                    </div>
                    
                    <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-1">Date</label>
                        <input
                            className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-surface-container-lowest"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-1">Category</label>
                        <select
                            className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-surface-container-lowest"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="food">🍔 Food</option>
                            <option value="transport">🚌 Transport</option>
                            <option value="entertainment">🎮 Entertainment</option>
                            <option value="rent">🏠 Rent</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2 ml-1">Description</label>
                        <input
                            className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-surface-container-lowest"
                            placeholder="What was this for?"
                            type="text"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </div>
                    
                    <button className="w-full h-14 bg-primary-container text-on-primary-container rounded-lg font-label-md text-headline-md font-bold shadow-md hover:bg-primary transition-all active:scale-[0.98] mt-4">
                        Save Transaction
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Transaction;
>>>>>>> feature/stack-upgrade
