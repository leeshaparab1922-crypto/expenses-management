import React, { useState, useMemo } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionContext';
import { useCategories } from '../contexts/CategoryContext';
import { TransactionType } from '../services/storage';

const History: React.FC = () => {
    const { currentUser } = useAuth();
    const { transactions, deleteTransaction } = useTransactions();
    const { categories, getCategoryById } = useCategories();

    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('all');
    const [type, setType] = useState<'all' | TransactionType>('all');
    const [selectedMonth, setSelectedMonth] = useState('all'); // YYYY-MM or 'all'
    const [sortConfig, setSortConfig] = useState<{ key: 'date' | 'amount'; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

    const formatCurrency = (amount: number) => {
        const currency = currentUser?.settings?.currency || 'USD $';
        const symbol = currency.split(' ')[1] || '$';
        return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const months = useMemo(() => {
        const uniqueMonths = new Set(transactions.map(t => t.date.slice(0, 7)));
        return Array.from(uniqueMonths).sort().reverse();
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        let result = transactions.filter(t => {
            const matchesSearch = t.desc.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = categoryId === 'all' || t.categoryId === categoryId;
            const matchesType = type === 'all' || t.type === type;
            const matchesMonth = selectedMonth === 'all' || t.date.startsWith(selectedMonth);
            return matchesSearch && matchesCategory && matchesType && matchesMonth;
        });

        result.sort((a, b) => {
            if (sortConfig.key === 'date') {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            } else {
                return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
            }
        });

        return result;
    }, [transactions, search, categoryId, type, selectedMonth, sortConfig]);

    const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const net = totalIncome - totalExpenses;

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredTransactions.map(t => t.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-8">
                {/* Title and Export */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">All Transactions</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Review and manage your complete financial history</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-[#0277bd] text-white px-6 py-2 rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all h-12">
                        <span className="material-symbols-outlined">download</span>
                        Export CSV
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        {/* Search */}
                        <div className="lg:col-span-1">
                            <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Search Description</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                                <input 
                                    className="w-full h-12 pl-10 pr-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-sm text-body-sm" 
                                    placeholder="e.g. Starbucks" 
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Date Range */}
                        <div className="lg:col-span-1">
                            <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Month</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">calendar_today</span>
                                <select 
                                    className="w-full h-12 pl-10 pr-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-all font-body-sm text-body-sm cursor-pointer" 
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    <option value="all">All Time</option>
                                    {months.map(m => (
                                        <option key={m} value={m}>{new Date(m + '-02').toLocaleString(undefined, { month: 'long', year: 'numeric' })}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Category */}
                        <div className="lg:col-span-1">
                            <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Category</label>
                            <select 
                                className="w-full h-12 px-4 bg-white border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-all font-body-sm text-body-sm"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* Type Toggle */}
                        <div className="lg:col-span-1">
                            <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Type</label>
                            <div className="flex h-12 p-1 bg-surface-container rounded-lg border border-outline-variant">
                                <button 
                                    className={`flex-1 rounded-md text-label-md font-label-md transition-colors ${type === 'all' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                                    onClick={() => setType('all')}
                                >All</button>
                                <button 
                                    className={`flex-1 rounded-md text-label-md font-label-md transition-colors ${type === 'income' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                                    onClick={() => setType('income')}
                                >Income</button>
                                <button 
                                    className={`flex-1 rounded-md text-label-md font-label-md transition-colors ${type === 'expense' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                                    onClick={() => setType('expense')}
                                >Expense</button>
                            </div>
                        </div>
                        {/* Clear Filters */}
                        <div className="lg:col-span-1 flex items-center lg:pb-3">
                            <button 
                                className="text-primary hover:underline font-label-md text-label-md flex items-center gap-1"
                                onClick={() => { setSearch(''); setCategoryId('all'); setType('all'); setSelectedMonth('all'); }}
                            >
                                <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Strip */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary-container rounded-full border border-outline-variant">
                        <span className="font-label-md text-label-md text-on-secondary-container">Total Income:</span>
                        <span className="font-numeric-display text-[16px] font-bold text-[#2e7d32]">{formatCurrency(totalIncome)}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-error-container rounded-full border border-outline-variant">
                        <span className="font-label-md text-label-md text-on-error-container">Total Expenses:</span>
                        <span className="font-numeric-display text-[16px] font-bold text-error">{formatCurrency(totalExpenses)}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary-container rounded-full border border-outline-variant">
                        <span className="font-label-md text-label-md text-on-primary-container">Net:</span>
                        <span className="font-numeric-display text-[16px] font-bold text-white">{formatCurrency(net)}</span>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant">
                                    <th className="p-4 w-12 text-center">
                                        <input 
                                            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" 
                                            type="checkbox"
                                            checked={selectedIds.length === filteredTransactions.length && filteredTransactions.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th 
                                        className="p-4 font-label-md text-label-md text-outline uppercase tracking-wider cursor-pointer hover:text-primary"
                                        onClick={() => setSortConfig({ key: 'date', direction: sortConfig.key === 'date' && sortConfig.direction === 'desc' ? 'asc' : 'desc' })}
                                    >
                                        Date {sortConfig.key === 'date' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                                    </th>
                                    <th className="p-4 font-label-md text-label-md text-outline uppercase tracking-wider">Category</th>
                                    <th className="p-4 font-label-md text-label-md text-outline uppercase tracking-wider">Description</th>
                                    <th className="p-4 font-label-md text-label-md text-outline uppercase tracking-wider">Method</th>
                                    <th 
                                        className="p-4 font-label-md text-label-md text-outline uppercase tracking-wider text-right cursor-pointer hover:text-primary"
                                        onClick={() => setSortConfig({ key: 'amount', direction: sortConfig.key === 'amount' && sortConfig.direction === 'desc' ? 'asc' : 'desc' })}
                                    >
                                        Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                                    </th>
                                    <th className="p-4 font-label-md text-label-md text-outline uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {filteredTransactions.length === 0 ? (
                                    <tr><td colSpan={7} className="p-8 text-center text-on-surface-variant">No transactions found</td></tr>
                                ) : (
                                    filteredTransactions.map(t => {
                                        const category = getCategoryById(t.categoryId);
                                        const isSelected = selectedIds.includes(t.id);
                                        return (
                                            <tr key={t.id} className={`hover:bg-surface-container-low transition-colors group ${isSelected ? 'bg-primary-container/5' : ''}`}>
                                                <td className="p-4 text-center">
                                                    <input 
                                                        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" 
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleSelectOne(t.id)}
                                                    />
                                                </td>
                                                <td className="p-4 font-body-sm text-body-sm text-on-surface">{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                                                            <span className="material-symbols-outlined text-[18px]">{category?.icon || 'payments'}</span>
                                                        </div>
                                                        <span className="font-body-sm text-body-sm text-on-surface">{category?.name || t.categoryId}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-body-sm text-body-sm text-on-surface">{t.desc}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-outline text-[18px]">
                                                            {t.paymentMethod === 'Card' ? 'credit_card' : t.paymentMethod === 'UPI' ? 'qr_code_2' : t.paymentMethod === 'Transfer' ? 'account_balance' : 'payments'}
                                                        </span>
                                                        <span className="font-body-sm text-body-sm text-on-surface">{t.paymentMethod}</span>
                                                    </div>
                                                </td>
                                                <td className={`p-4 text-right font-numeric-display text-[14px] font-semibold ${t.type === 'income' ? 'text-[#2e7d32]' : 'text-error'}`}>
                                                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            className="p-2 rounded-lg hover:bg-error-container/20 transition-colors text-outline hover:text-error"
                                                            onClick={() => deleteTransaction(t.id)}
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-outline-variant bg-surface-container-low text-on-surface-variant">
                        <p className="font-body-sm text-body-sm">Showing {filteredTransactions.length} transactions</p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default History;
