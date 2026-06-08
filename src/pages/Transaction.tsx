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
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
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
                            <option value="Food">🍔 Food</option>
                            <option value="Transport">🚌 Transport</option>
                            <option value="Entertainment">🎮 Entertainment</option>
                            <option value="Housing">🏠 Housing</option>
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
