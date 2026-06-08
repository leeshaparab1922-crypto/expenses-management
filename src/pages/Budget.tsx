import React, { useState } from 'react';
import { useBudgets } from '../contexts/BudgetContext';
import { useExpenses } from '../contexts/ExpenseContext';
import { analytics } from '../utils/analytics';

const Budget: React.FC = () => {
    const { budgets, createBudget, deleteBudget } = useBudgets();
    const { expenses } = useExpenses();
    const [category, setCategory] = useState('Food');
    const [limit, setLimit] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createBudget({ category, limit: parseFloat(limit) });
        setLimit('');
    };

    const budgetUtilization = analytics.getBudgetUtilization(expenses, budgets);

    return (
        <main className="max-w-[1200px] mx-auto px-6 py-8">
            <h1 className="text-headline-lg font-bold mb-8">My Budgets</h1>
            <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white rounded-lg shadow border border-outline-variant flex gap-4">
                <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="p-2 border rounded" required />
                <input type="number" placeholder="Limit" value={limit} onChange={e => setLimit(e.target.value)} className="p-2 border rounded" required />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Set Budget</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgetUtilization.map(b => (
                    <div key={b.category} className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
                        <h3 className="font-headline-md text-headline-md">{b.category}</h3>
                        <p className="text-label-md text-on-surface-variant">₹{b.spent.toFixed(2)} of ₹{b.limit.toFixed(2)}</p>
                        <div className="w-full bg-surface-container-high h-2.5 rounded-full my-3">
                            <div className={`${b.percentage > 100 ? 'bg-error' : 'bg-primary'} h-2.5 rounded-full`} style={{ width: `${Math.min(b.percentage, 100)}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className={`text-label-md ${b.percentage > 100 ? 'text-error' : 'text-on-surface-variant'}`}>{b.percentage.toFixed(0)}% used</span>
                            <button onClick={() => {
                                const budgetToDelete = budgets.find(bud => bud.category === b.category);
                                if (budgetToDelete) deleteBudget(budgetToDelete.id);
                            }} className="text-error text-sm">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Budget;
