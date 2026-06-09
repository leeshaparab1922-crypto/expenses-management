import React, { useState, useEffect } from 'react';
import { Bill } from '../../services/storage';
import { useBills } from '../../contexts/BillContext';

interface BillModalProps {
    isOpen: boolean;
    onClose: () => void;
    editBill?: Bill | null;
}

const BILL_ICONS = [
    { icon: 'home', label: 'Rent' },
    { icon: 'bolt', label: 'Electricity' },
    { icon: 'water_drop', label: 'Water' },
    { icon: 'local_fire_department', label: 'Gas' },
    { icon: 'wifi', label: 'Internet' },
    { icon: 'phone', label: 'Phone' },
    { icon: 'subscriptions', label: 'Subscription' },
    { icon: 'directions_car', label: 'Car' },
    { icon: 'medical_services', label: 'Health' },
    { icon: 'school', label: 'Education' },
    { icon: 'credit_card', label: 'Credit Card' },
    { icon: 'category', label: 'Other' },
];

const EMPTY: Omit<Bill, 'id'> = { name: '', amount: 0, dueDay: 1, icon: 'home' };

const BillModal: React.FC<BillModalProps> = ({ isOpen, onClose, editBill }) => {
    const { addBill, updateBill } = useBills();
    const [form, setForm] = useState<Omit<Bill, 'id'>>(EMPTY);
    const [amountStr, setAmountStr] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (editBill) {
                setForm({ name: editBill.name, amount: editBill.amount, dueDay: editBill.dueDay, icon: editBill.icon });
                setAmountStr(String(editBill.amount));
            } else {
                setForm(EMPTY);
                setAmountStr('');
            }
        }
    }, [isOpen, editBill]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(amountStr);
        if (!form.name.trim() || isNaN(amount) || amount <= 0 || form.dueDay < 1 || form.dueDay > 31) return;
        if (editBill) {
            updateBill({ ...form, amount, id: editBill.id });
        } else {
            addBill({ ...form, amount });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-xl w-full max-w-md shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-outline-variant">
                    <h2 className="text-headline-sm font-headline-md text-on-surface font-bold">
                        {editBill ? 'Edit Bill' : 'Add Upcoming Bill'}
                    </h2>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-label-md text-on-surface-variant mb-2">Bill Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Rent, Netflix..."
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface text-body-sm"
                        />
                    </div>

                    {/* Amount + Due Day */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-label-md text-on-surface-variant mb-2">Amount ($)</label>
                            <input
                                type="number"
                                required
                                min="0.01"
                                step="0.01"
                                placeholder="0.00"
                                value={amountStr}
                                onChange={e => setAmountStr(e.target.value)}
                                className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface text-body-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-label-md text-on-surface-variant mb-2">Due Day (1–31)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="31"
                                value={form.dueDay}
                                onChange={e => setForm(f => ({ ...f, dueDay: parseInt(e.target.value) || 1 }))}
                                className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface text-body-sm"
                            />
                        </div>
                    </div>

                    {/* Icon Picker */}
                    <div>
                        <label className="block text-label-md text-on-surface-variant mb-2">Icon</label>
                        <div className="grid grid-cols-6 gap-2">
                            {BILL_ICONS.map(({ icon, label }) => (
                                <button
                                    key={icon}
                                    type="button"
                                    title={label}
                                    onClick={() => setForm(f => ({ ...f, icon }))}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                                        form.icon === icon
                                            ? 'border-primary bg-primary-container/30 text-primary'
                                            : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-xl">{icon}</span>
                                    <span className="text-[9px] mt-0.5 leading-tight text-center">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 border border-outline-variant rounded-lg text-label-md text-on-surface hover:bg-surface-container-low transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-12 bg-primary-container text-on-primary-container hover:bg-primary hover:text-white rounded-lg text-label-md font-bold transition-all cursor-pointer"
                        >
                            {editBill ? 'Save Changes' : 'Add Bill'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BillModal;
