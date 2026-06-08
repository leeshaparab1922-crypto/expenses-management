import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Expense } from '../../services/storage';

interface CategoryBreakdownProps {
    expenses: Expense[];
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ expenses }) => {
    const data = useMemo(() => {
        const aggregation = expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(aggregation).map(([name, value]) => ({ name, value }));
    }, [expenses]);

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const COLORS = ['#0d631b', '#1f6223', '#556158', '#e5e2e1', '#ba1a1a', '#2e7d32'];

    if (data.length === 0) {
        return <div className="bg-surface card-shadow p-6 rounded-lg text-center text-on-surface-variant">No data available</div>;
    }

    return (
        <div className="bg-surface card-shadow p-6 rounded-lg">
            <h3 className="text-label-md font-label-md text-on-surface-variant mb-4">SPENDING BY CATEGORY</h3>
            <div className="h-40 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <ul className="space-y-2">
                {data.map((item, index) => (
                    <li key={item.name} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="text-body-sm">{item.name}</span>
                        </div>
                        <span className="text-label-md font-bold">{((item.value / total) * 100).toFixed(0)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryBreakdown;
