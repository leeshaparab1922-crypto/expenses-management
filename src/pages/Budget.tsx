import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionContext';
import { useCategories } from '../contexts/CategoryContext';
import { useBudgets } from '../contexts/BudgetContext';

const BudgetPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { transactions } = useTransactions();
    const { categories } = useCategories();
    const { budgets, addBudget, deleteBudget } = useBudgets();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [limit, setLimit] = useState('');

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const currentMonthName = new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' });

    const monthlyExpenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth));
    
    const budgetData = budgets.filter(b => b.month === currentMonth).map(budget => {
        const category = categories.find(c => c.id === budget.categoryId);
        const spent = monthlyExpenses.filter(t => t.categoryId === budget.categoryId).reduce((s, t) => s + t.amount, 0);
        return { ...budget, category, spent };
    });

    const overallBudget = budgetData.reduce((s, b) => s + b.limit, 0);
    const overallSpent = budgetData.reduce((s, b) => s + b.spent, 0);
    const overallRemaining = overallBudget - overallSpent;

    const formatCurrency = (amount: number) => {
        const currency = currentUser?.settings?.currency || 'USD $';
        const symbol = currency.split(' ')[1] || '$';
        return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const handleSaveBudget = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryId || !limit) return;
        addBudget({
            categoryId: selectedCategoryId,
            limit: parseFloat(limit),
            month: currentMonth
        });
        setIsModalOpen(false);
        setLimit('');
    };

    return (
        <MainLayout>
            <div className="max-w-container-max-width mx-auto px-4 md:px-margin-desktop pt-6 safe-bottom">
                {/* Header */}
                <header className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <h1 className="font-headline-md text-headline-md text-primary tracking-tight">My Budgets</h1>
                        <span className="font-label-md text-label-md text-on-surface-variant">{currentMonthName}</span>
                    </div>
                    <button 
                        className="bg-primary-container text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md active:scale-95 transition-transform flex items-center gap-2"
                        onClick={() => {
                            const availableCategories = categories.filter(c => c.type === 'expense' && !budgets.some(b => b.categoryId === c.id && b.month === currentMonth));
                            if (availableCategories.length > 0) setSelectedCategoryId(availableCategories[0].id);
                            setIsModalOpen(true);
                        }}
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Set New Budget
                    </button>
                </header>

                {/* Summary Strip */}
                <section className="flex flex-wrap gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex items-center gap-2 bg-secondary-container px-4 py-2 rounded-full border border-outline-variant whitespace-nowrap">
                        <span className="font-label-md text-label-md text-on-secondary-fixed-variant">Overall:</span>
                        <span className="font-headline-md text-headline-md text-primary">{formatCurrency(overallBudget)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant whitespace-nowrap">
                        <span className="font-label-md text-label-md text-on-surface-variant">Spent:</span>
                        <span className="font-headline-md text-headline-md text-error">{formatCurrency(overallSpent)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-tertiary-container/10 px-4 py-2 rounded-full border border-tertiary/20 whitespace-nowrap">
                        <span className="font-label-md text-label-md text-on-surface-variant">Remaining:</span>
                        <span className="font-headline-md text-headline-md text-tertiary">{formatCurrency(overallRemaining)}</span>
                    </div>
                </section>

                {/* Budget Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgetData.map(budget => {
                        const percent = Math.min(Math.round((budget.spent / budget.limit) * 100), 100);
                        const isOver = budget.spent > budget.limit;
                        const remaining = budget.limit - budget.spent;

                        return (
                            <div key={budget.id} className={`bg-surface-container-lowest border rounded-xl p-5 hover:shadow-md transition-shadow relative overflow-hidden ${isOver ? 'border-error/30 bg-[radial-gradient(circle_at_top_right,rgba(186,26,26,0.03),transparent)]' : 'border-outline-variant'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isOver ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                                            <span className="material-symbols-outlined">{budget.category?.icon || 'payments'}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-headline-md text-headline-md text-on-surface">{budget.category?.name || 'Unknown'}</h3>
                                            <p className="font-label-md text-label-md text-on-surface-variant">{formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button 
                                            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                                            onClick={() => {
                                                setSelectedCategoryId(budget.categoryId);
                                                setLimit(budget.limit.toString());
                                                setIsModalOpen(true);
                                            }}
                                        ><span className="material-symbols-outlined text-[20px]">edit</span></button>
                                        <button 
                                            className="p-2 text-on-surface-variant hover:text-error transition-colors"
                                            onClick={() => deleteBudget(budget.id)}
                                        ><span className="material-symbols-outlined text-[20px]">delete</span></button>
                                    </div>
                                </div>

                                {isOver && (
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="bg-error text-white font-label-md text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px] filled-icon">warning</span>
                                            Exceeded by {formatCurrency(Math.abs(remaining))}
                                        </span>
                                    </div>
                                )}

                                <div className={`w-full h-2.5 rounded-full mb-3 ${isOver ? 'bg-error-container' : 'bg-surface-container-high'}`}>
                                    <div className={`h-2.5 rounded-full transition-all duration-500 ${isOver ? 'bg-error' : percent > 90 ? 'bg-yellow-500' : 'bg-primary'}`} style={{ width: `${percent}%` }}></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`font-label-md text-label-md ${isOver ? 'text-error font-bold' : 'text-on-surface-variant'}`}>{percent}% used</span>
                                    <span className={`font-label-md text-label-md ${isOver ? 'text-error' : remaining > 0 ? 'text-tertiary' : 'text-primary font-bold'}`}>
                                        {isOver ? `-${formatCurrency(Math.abs(remaining))}` : remaining === 0 ? 'On Track' : `Remaining: ${formatCurrency(remaining)}`}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    <div 
                        className="bg-surface-container rounded-xl p-5 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant min-h-[160px] cursor-pointer hover:bg-surface-container-high transition-all"
                        onClick={() => {
                            const availableCategories = categories.filter(c => c.type === 'expense' && !budgets.some(b => b.categoryId === c.id && b.month === currentMonth));
                            if (availableCategories.length > 0) setSelectedCategoryId(availableCategories[0].id);
                            else setSelectedCategoryId('');
                            setIsModalOpen(true);
                        }}
                    >
                        <span className="material-symbols-outlined text-outline text-[40px] mb-2">add_circle</span>
                        <p className="font-label-md text-label-md text-on-surface-variant">Add more categories</p>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                        <div className="bg-surface relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                                <h2 className="font-headline-md text-headline-md text-on-surface">Set Budget</h2>
                                <button className="p-1 hover:bg-surface-container rounded-full transition-colors" onClick={() => setIsModalOpen(false)}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <form className="p-6 space-y-6" onSubmit={handleSaveBudget}>
                                <div className="space-y-2">
                                    <label className="font-label-md text-label-md text-on-surface-variant block">Category</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full h-12 bg-surface-container-lowest border border-outline rounded-lg px-4 appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface"
                                            value={selectedCategoryId}
                                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                                            required
                                        >
                                            {categories.filter(c => c.type === 'expense').map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name} {cat.icon}</option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="font-label-md text-label-md text-on-surface-variant block">Monthly Limit</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-on-surface-variant">{currentUser?.settings?.currency.split(' ')[1] || '$'}</span>
                                        <input 
                                            className="w-full h-12 bg-surface-container-lowest border border-outline rounded-lg pl-8 pr-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface font-numeric-display" 
                                            type="number" 
                                            value={limit}
                                            onChange={(e) => setLimit(e.target.value)}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button className="flex-1 h-12 border border-outline text-primary font-label-md text-label-md rounded-lg active:scale-95 transition-transform" onClick={() => setIsModalOpen(false)} type="button">Cancel</button>
                                    <button className="flex-1 h-12 bg-primary text-white font-label-md text-label-md rounded-lg active:scale-95 transition-transform" type="submit">Save Budget</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default BudgetPage;
