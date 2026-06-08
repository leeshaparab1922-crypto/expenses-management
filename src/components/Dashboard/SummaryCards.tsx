import React from 'react';
import { useExpenses } from '../../contexts/ExpenseContext';

const SummaryCards: React.FC = () => {
    const { expenses } = useExpenses();
    const totalBalance = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Balance</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    ₹{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </dd>
            </div>
        </div>
    );
};

export default SummaryCards;
