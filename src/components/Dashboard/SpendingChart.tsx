import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Expense } from '../../services/storage';

interface SpendingChartProps {
    expenses: Expense[];
}

const SpendingChart: React.FC<SpendingChartProps> = ({ expenses }) => {
    // Basic aggregation: Last 6 months (simplified)
    const data = [
        { name: 'MAY', expense: 2000, income: 4000 },
        { name: 'JUN', expense: 2500, income: 4500 },
        { name: 'JUL', expense: 1800, income: 3800 },
        { name: 'AUG', expense: 3000, income: 5000 },
        { name: 'SEP', expense: 2200, income: 4200 },
        { name: 'OCT', expense: 3150, income: 5200 },
    ];

    return (
        <div className="bg-surface card-shadow p-6 rounded-lg">
            <h2 className="text-headline-md font-headline-md mb-6">Spending Over Time</h2>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="expense" stroke="#ba1a1a" fill="#ffdad6" />
                        <Area type="monotone" dataKey="income" stroke="#0d631b" fill="#a3f69c" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SpendingChart;
