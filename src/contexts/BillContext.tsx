import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bill } from '../services/storage';
import { BillService } from '../services/billService';
import { useAuth } from './AuthContext';

interface BillContextType {
    bills: Bill[];
    addBill: (bill: Omit<Bill, 'id'>) => void;
    updateBill: (bill: Bill) => void;
    deleteBill: (id: number) => void;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

export const BillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const [bills, setBills] = useState<Bill[]>([]);

    useEffect(() => {
        if (currentUser) {
            setBills(BillService.getAll(currentUser.id));
        } else {
            setBills([]);
        }
    }, [currentUser]);

    const addBill = (bill: Omit<Bill, 'id'>) => {
        if (!currentUser) return;
        const newBill = BillService.add(currentUser.id, bill);
        setBills(prev => [...prev, newBill]);
    };

    const updateBill = (bill: Bill) => {
        if (!currentUser) return;
        BillService.update(currentUser.id, bill);
        setBills(prev => prev.map(b => b.id === bill.id ? bill : b));
    };

    const deleteBill = (id: number) => {
        if (!currentUser) return;
        BillService.remove(currentUser.id, id);
        setBills(prev => prev.filter(b => b.id !== id));
    };

    return (
        <BillContext.Provider value={{ bills, addBill, updateBill, deleteBill }}>
            {children}
        </BillContext.Provider>
    );
};

export const useBills = () => {
    const ctx = useContext(BillContext);
    if (!ctx) throw new Error('useBills must be used within BillProvider');
    return ctx;
};
