import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Expense } from '../../services/storage';

const COLORS = ['#0d631b', '#1f6223', '#556158', '#bfcaba', '#ba1a1a', '#2e7d32', '#acf4a4'];

interface CategoryBreakdownProps {
  expenses: Expense[];
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ expenses }) => {
  const { data, total } = useMemo(() => {
    const agg = expenses
      .filter(e => e.type === 'expense')
      .reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {} as Record<string, number>);
    const entries = Object.entries(agg).map(([name, value]) => ({ name, value }));
    return { data: entries, total: entries.reduce((s, i) => s + i.value, 0) };
  }, [expenses]);

  return (
    <div className="bg-surface card-shadow p-6 rounded-lg">
      <h3 className="text-label-md font-label-md text-on-surface-variant mb-4">SPENDING BY CATEGORY</h3>
      {data.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant text-center py-8">No expense data yet.</p>
      ) : (
        <>
          <div className="relative w-40 h-40 mx-auto mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} innerRadius={48} outerRadius={64} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-body-sm text-on-surface-variant">Total</span>
              <span className="text-headline-md font-bold text-on-surface">${total.toLocaleString()}</span>
            </div>
          </div>
          <ul className="space-y-2">
            {data.map((item, i) => (
              <li key={item.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-body-sm">{item.name}</span>
                </div>
                <span className="text-label-md font-bold">{total > 0 ? Math.round((item.value / total) * 100) : 0}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default CategoryBreakdown;
