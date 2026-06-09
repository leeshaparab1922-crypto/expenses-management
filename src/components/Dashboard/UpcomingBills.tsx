import React, { useState } from 'react';
import { useBills } from '../../contexts/BillContext';
import { Bill } from '../../services/storage';
import BillModal from './BillModal';

const getNextDueDate = (dueDay: number): Date => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const candidate = new Date(year, month, dueDay);
    // If due day has already passed this month, move to next month
    if (candidate <= now) {
        return new Date(year, month + 1, dueDay);
    }
    return candidate;
};

const formatDueDate = (dueDay: number): string => {
    const d = getNextDueDate(dueDay);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDaysUntil = (dueDay: number): number => {
    const now = new Date();
    const due = getNextDueDate(dueDay);
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const UpcomingBills: React.FC = () => {
    const { bills, deleteBill } = useBills();
    const [modalOpen, setModalOpen] = useState(false);
    const [editBill, setEditBill] = useState<Bill | null>(null);

    const sorted = [...bills].sort((a, b) => getDaysUntil(a.dueDay) - getDaysUntil(b.dueDay));

    const openAdd = () => { setEditBill(null); setModalOpen(true); };
    const openEdit = (bill: Bill) => { setEditBill(bill); setModalOpen(true); };

    return (
        <>
            <div className="bg-surface card-shadow p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-label-md font-label-md text-on-surface-variant">UPCOMING BILLS</h3>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-1 text-primary text-label-md font-bold hover:opacity-80 transition-opacity cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">add</span>
                        Add
                    </button>
                </div>

                {sorted.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-40">receipt_long</span>
                        <p className="text-body-sm text-on-surface-variant">No bills yet.</p>
                        <button
                            onClick={openAdd}
                            className="text-primary text-label-md font-bold hover:underline cursor-pointer"
                        >
                            Add your first bill
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sorted.map(bill => {
                            const daysUntil = getDaysUntil(bill.dueDay);
                            const urgent = daysUntil <= 3;
                            return (
                                <div key={bill.id} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg group">
                                    <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                                        <span className="material-symbols-outlined text-xl">{bill.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-body-sm font-bold text-on-surface">{bill.name}</div>
                                        <div className={`text-label-md ${urgent ? 'text-error font-semibold' : 'text-on-surface-variant'}`}>
                                            {formatDueDate(bill.dueDay)}
                                            {daysUntil === 0 ? ' · Due today' : daysUntil === 1 ? ' · Tomorrow' : ` · ${daysUntil}d`}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-body-sm font-bold text-on-surface">${bill.amount.toLocaleString()}</span>
                                        <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                                            <button
                                                onClick={() => openEdit(bill)}
                                                className="p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                                                title="Edit"
                                            >
                                                <span className="material-symbols-outlined text-base">edit</span>
                                            </button>
                                            <button
                                                onClick={() => deleteBill(bill.id)}
                                                className="p-1 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                                                title="Delete"
                                            >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <BillModal isOpen={modalOpen} onClose={() => setModalOpen(false)} editBill={editBill} />
        </>
    );
};

export default UpcomingBills;
