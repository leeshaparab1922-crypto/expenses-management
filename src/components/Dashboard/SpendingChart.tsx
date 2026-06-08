import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Expense } from '../../services/storage';

interface SpendingChartProps {
  expenses: Expense[];
}

const SpendingChart: React.FC<SpendingChartProps> = ({ expenses }) => {
  const data = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      let income = 0, expense = 0;
      expenses.forEach(e => {
        const ed = new Date(e.date);
        if (ed.getMonth() === m && ed.getFullYear() === y) {
          if (e.type === 'income') income += e.amount;
          else expense += e.amount;
        }
      });
      return { name: d.toLocaleString('default', { month: 'short' }).toUpperCase(), income, expense };
    });
  }, [expenses]);

  return (
    <div className="bg-surface card-shadow p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-headline-md font-headline-md">Spending Over Time</h2>
        <div className="flex items-center gap-4 text-label-md">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary"></div> Income</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-error"></div> Expenses</div>
        </div>
      </div>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e2e1" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#40493d' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#40493d' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <Tooltip formatter={(v: any) => `$${Number(v).toLocaleString()}`} cursor={{ fill: '#f0eded' }} />
            <Bar dataKey="income" stackId="a" fill="#a3f69c" radius={[0, 0, 0, 0]} />
            <Bar dataKey="expense" stackId="b" fill="#ffdad6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;
