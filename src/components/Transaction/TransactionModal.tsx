import React, { useState, useEffect } from 'react';
import { Expense } from '../../services/storage';
import { useExpenses } from '../../contexts/ExpenseContext';
import { useCategories } from '../../contexts/CategoryContext';
import { parseExpenseFromText } from '../../services/geminiService';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId?: number | null;
  defaultType?: 'expense' | 'income';
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  expenseId = null,
  defaultType = 'expense',
}) => {
  const { expenses, updateExpense, createExpense } = useExpenses();
  const { categories } = useCategories();
  
  const [formData, setFormData] = useState<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>({
    amount: 0,
    category: 'Food',
    desc: '',
    date: new Date().toISOString().split('T')[0],
    type: defaultType,
  });

  const [nlText, setNlText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiFilled, setAiFilled] = useState(false);

  const categoryNames = categories.map(c => c.name);

  useEffect(() => {
    if (isOpen) {
      if (expenseId) {
        const expense = expenses.find(e => e.id === expenseId);
        if (expense) {
          setFormData({ amount: expense.amount, category: expense.category, desc: expense.desc, date: expense.date, type: expense.type });
          return;
        }
      }
      setFormData(prev => ({ 
        ...prev, 
        type: defaultType, 
        amount: 0, 
        desc: '', 
        date: new Date().toISOString().split('T')[0],
        category: categoryNames.length > 0 ? categoryNames[0] : 'Food'
      }));
      setNlText('');
      setAiError('');
      setAiFilled(false);
    }
  }, [expenseId, isOpen, defaultType]);

  if (!isOpen) return null;

  const handleAIParse = async () => {
    if (!nlText.trim()) return;
    setAiLoading(true);
    setAiError('');
    setAiFilled(false);

    try {
        const today = new Date().toISOString().split('T')[0];
        const parsed = await parseExpenseFromText(nlText, categoryNames, today);

        setFormData({
            amount: parsed.amount,
            desc: parsed.description,
            date: parsed.date,
            type: parsed.type,
            category: parsed.category
        });
        setNlText('');
        setAiFilled(true);
    } catch (err) {
        setAiError(err instanceof Error ? err.message : 'Failed to parse. Please try again.');
    } finally {
        setAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    if (expenseId) {
      updateExpense({ ...formData, id: expenseId, createdAt: '', updatedAt: now });
    } else {
      createExpense({ ...formData, createdAt: now, updatedAt: now });
    }
    onClose();
  };

  const isExpense = formData.type === 'expense';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl w-full max-w-md shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant sticky top-0 bg-surface z-10">
          <h2 className="text-headline-md font-headline-md text-on-surface">
            {expenseId ? 'Edit Transaction' : isExpense ? 'Add Expense' : 'Add Income'}
          </h2>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">close</button>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Quick Add */}
          {!expenseId && (
            <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">✨</span>
                <span className="font-semibold text-xs text-on-surface">Quick Add with AI</span>
                <span className="ml-auto text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Gemini</span>
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 h-10 px-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-surface text-sm"
                  placeholder='e.g. "Spent 350 on lunch today"'
                  value={nlText}
                  onChange={(e) => { setNlText(e.target.value); setAiFilled(false); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAIParse()}
                  disabled={aiLoading}
                />
                <button
                  type="button"
                  onClick={handleAIParse}
                  disabled={aiLoading || !nlText.trim()}
                  className="h-10 px-3 bg-primary text-on-primary rounded-lg font-medium text-xs disabled:opacity-50 hover:opacity-90 transition-all flex items-center gap-1"
                >
                  {aiLoading ? "..." : "Parse"}
                </button>
              </div>
              {aiError && <p className="text-[10px] text-error mt-2">{aiError}</p>}
              {aiFilled && <p className="text-[10px] text-tertiary mt-2">✓ Form filled — review below</p>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type toggle */}
            {!expenseId && (
              <div className="flex rounded-lg overflow-hidden border border-outline-variant">
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, type: 'expense' }))}
                  className={`flex-1 py-2 text-label-md font-bold transition-all ${formData.type === 'expense' ? 'bg-error text-white' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                >Expense</button>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, type: 'income' }))}
                  className={`flex-1 py-2 text-label-md font-bold transition-all ${formData.type === 'income' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                >Income</button>
              </div>
            )}

            <div>
              <label className="block text-label-md text-on-surface-variant mb-1">Amount</label>
              <input
                type="number" min="0" step="0.01" required
                value={formData.amount || ''}
                onChange={e => setFormData(p => ({ ...p, amount: parseFloat(e.target.value) || 0 }))}
                className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface text-body-lg"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-label-md text-on-surface-variant mb-1">Description</label>
              <input
                type="text" required
                value={formData.desc}
                onChange={e => setFormData(p => ({ ...p, desc: e.target.value }))}
                className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface text-body-sm"
                placeholder="e.g. Grocery shopping"
              />
            </div>

            <div>
              <label className="block text-label-md text-on-surface-variant mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface text-body-sm"
              >
                {categoryNames.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-label-md text-on-surface-variant mb-1">Date</label>
              <input
                type="date" required
                value={formData.date}
                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface text-body-sm"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 h-12 border border-outline-variant text-on-surface rounded-lg text-label-md font-bold hover:bg-surface-container-low transition-all">
                Cancel
              </button>
              <button type="submit" className="flex-1 h-12 bg-primary-container text-on-primary-container rounded-lg text-label-md font-bold hover:opacity-90 transition-all">
                {expenseId ? 'Save Changes' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
