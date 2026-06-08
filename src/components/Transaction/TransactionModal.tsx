import React, { useState, useEffect } from 'react';
import { Expense } from '../../services/storage';
import { useExpenses } from '../../contexts/ExpenseContext';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: number | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, expenseId }) => {
  const { expenses, updateExpense, createExpense } = useExpenses();
  const [formData, setFormData] = useState<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>({
    amount: 0,
    category: 'Food',
    desc: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  useEffect(() => {
    if (expenseId && isOpen) {
      const expense = expenses.find(e => e.id === expenseId);
      if (expense) {
        setFormData({
          amount: expense.amount,
          category: expense.category,
          desc: expense.desc,
          date: expense.date,
          type: expense.type
        });
      }
    }
  }, [expenseId, isOpen, expenses]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseId) {
      updateExpense({ ...formData, id: expenseId, createdAt: '', updatedAt: '' });
    } else {
      createExpense({ 
          ...formData, 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{expenseId ? 'Edit' : 'Add'} Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} className="w-full p-2 border rounded" required />
          <input type="text" placeholder="Description" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-2 border rounded" required />
          <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 border rounded" required />
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded">
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Housing">Housing</option>
            <option value="Other">Other</option>
          </select>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
