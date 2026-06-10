import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../contexts/ExpenseContext';
import { useCategories } from '../contexts/CategoryContext';
import { parseExpenseFromText } from '../services/geminiService';

const Transaction: React.FC = () => {
    const { createExpense } = useExpenses();
    const { categories } = useCategories();
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState<'expense' | 'income'>('expense');

    const [nlText, setNlText] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [aiFilled, setAiFilled] = useState(false);

    const categoryNames = categories.map(c => c.name);

    // Update default category when categories are loaded
    React.useEffect(() => {
        if (categoryNames.length > 0 && !categoryNames.includes(category)) {
            setCategory(categoryNames[0]);
        }
    }, [categories]);

    const handleAIParse = async () => {
        if (!nlText.trim()) return;
        setAiLoading(true);
        setAiError('');
        setAiFilled(false);

        try {
            const today = new Date().toISOString().split('T')[0];
            const parsed = await parseExpenseFromText(nlText, categoryNames, today);

            setAmount(String(parsed.amount));
            setDesc(parsed.description);
            setDate(parsed.date);
            setType(parsed.type || 'expense');
            setCategory(parsed.category);
            setNlText('');
            setAiFilled(true);
        } catch (err) {
            setAiError(err instanceof Error ? err.message : 'Failed to parse. Please try again.');
        } finally {
            setAiLoading(false);
        }
    };

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
            <div className="w-full max-w-[600px] mb-8 space-y-4">

                {/* AI Quick Add */}
                <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">✨</span>
                        <span className="font-semibold text-sm text-on-surface">Quick Add with AI</span>
                        <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Gemini</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 h-11 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-surface-container-lowest text-sm"
                            placeholder='e.g. "Spent ₹480 on groceries today"'
                            value={nlText}
                            onChange={(e) => { setNlText(e.target.value); setAiFilled(false); }}
                            onKeyDown={(e) => e.key === 'Enter' && handleAIParse()}
                            disabled={aiLoading}
                        />
                        <button
                            type="button"
                            onClick={handleAIParse}
                            disabled={aiLoading || !nlText.trim()}
                            className="h-11 px-4 bg-primary text-on-primary rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all flex items-center gap-1.5 whitespace-nowrap"
                        >
                            {aiLoading ? (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : <span>✦</span>}
                            <span>{aiLoading ? 'Parsing…' : 'Parse'}</span>
                        </button>
                    </div>
                    {aiError && <p className="text-xs text-error mt-2">{aiError}</p>}
                    {aiFilled && <p className="text-xs text-tertiary mt-2">✓ Form filled — review and save below</p>}
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-6">
                    {/* Toggle Section */}
                    <div className="flex bg-surface-container p-1 rounded-lg mb-8">
                        <button
                            type="button"
                            className={`flex-1 py-3 px-4 rounded-md font-label-md text-label-md transition-all ${type === 'expense' ? 'bg-error-container text-error font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                            onClick={() => setType('expense')}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
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
                                    step="0.01"
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
                                {categoryNames.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
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
            </div>
        </main>
    );
};

export default Transaction;
