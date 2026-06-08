import React from 'react';

const BudgetOverview: React.FC = () => {
    const budgets = [
        { category: 'Food', used: 80, limit: 5000, current: 4000 },
        { category: 'Transport', used: 45, limit: 2000, current: 900 },
        { category: 'Entertainment', used: 90, limit: 3000, current: 2700 },
    ];

    return (
        <div className="bg-surface card-shadow p-6 rounded-lg">
            <h3 className="text-label-md font-label-md text-on-surface-variant mb-6">BUDGET OVERVIEW</h3>
            <div className="space-y-6">
                {budgets.map(b => (
                    <div key={b.category}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-body-sm font-medium">{b.category}</span>
                            <span className={`text-label-md ${b.used > 85 ? 'text-error' : 'text-tertiary'}`}>{b.used}%</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                            <div className={`${b.used > 85 ? 'bg-error' : 'bg-tertiary'} h-full`} style={{ width: `${b.used}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-2 border border-primary text-primary text-label-md font-bold rounded hover:bg-primary-container/5 transition-all">
                Adjust Budgets
            </button>
        </div>
    );
};

export default BudgetOverview;
