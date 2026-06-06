import React from 'react';
import { useExpenses } from '../../contexts/ExpenseContext';
import { Trash2 } from 'lucide-react';

const ExpenseList: React.FC = () => {
    const { expenses, deleteExpense } = useExpenses();

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
            </div>
            <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {expenses.length === 0 ? (
                    <li className="px-4 py-8 text-center text-gray-500">No transactions yet.</li>
                ) : (
                    expenses.map((expense) => (
                        <li key={expense.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full">
                                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 8V7m0 1v1m0 0H11m1 0h1m-1 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-indigo-600">{expense.desc}</p>
                                    <p className="text-xs text-gray-500">{expense.category} • {expense.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-bold text-gray-900">
                                    ${expense.amount.toFixed(2)}
                                </span>
                                <button 
                                    onClick={() => deleteExpense(expense.id)}
                                    className="text-red-400 hover:text-red-600 transition"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ExpenseList;
