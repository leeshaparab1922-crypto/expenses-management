import React, { useState, useMemo } from 'react';
import { useExpenses } from '../contexts/ExpenseContext';
import { Expense } from '../services/storage';
import TransactionModal from '../components/Transaction/TransactionModal';
import { exportTransactionsToCSV } from '../utils/csvExport';

const History: React.FC = () => {
  const { expenses, deleteExpense } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState<'All' | 'income' | 'expense'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchesSearch = exp.desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
      const matchesType = filterType === 'All' || exp.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, searchTerm, filterCategory, filterType]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(expenses.map(e => e.category)))], [expenses]);

  const handleEdit = (id: number) => {
    setEditingExpenseId(id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
        deleteExpense(id);
    }
  };

  const handleExport = () => {
      exportTransactionsToCSV(filteredExpenses);
      alert('Export successful!');
  };

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24 md:pb-0">
      <main className="max-w-[1200px] mx-auto px-4 md:px-12 py-8">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-headline-lg font-bold">All Transactions</h2>
            <button onClick={handleExport} className="bg-primary text-white px-4 py-2 rounded-lg">Export CSV</button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-outline-variant rounded-xl p-4 mb-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="Search description..." 
            className="h-12 px-4 rounded-lg border border-outline-variant"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="h-12 px-4 rounded-lg border border-outline-variant" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select className="h-12 px-4 rounded-lg border border-outline-variant" value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredExpenses.map(exp => (
                <tr key={exp.id}>
                  <td className="p-4">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="p-4">{exp.category}</td>
                  <td className="p-4">{exp.desc}</td>
                  <td className={`p-4 text-right font-medium ${exp.type === 'expense' ? 'text-error' : 'text-primary'}`}>
                    {exp.type === 'expense' ? '-' : '+'}₹{exp.amount.toFixed(2)}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleEdit(exp.id)} className="text-primary hover:underline">Edit</button>
                    <button onClick={() => handleDelete(exp.id)} className="text-error hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => {setIsModalOpen(false); setEditingExpenseId(null);}} 
        expenseId={editingExpenseId} 
      />
    </div>
  );
};

export default History;
