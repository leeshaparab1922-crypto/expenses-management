import { Storage, Bill } from './storage';

export const BillService = {
    getAll: (userId: number): Bill[] => Storage.getBills(userId),

    add: (userId: number, bill: Omit<Bill, 'id'>): Bill => {
        const bills = Storage.getBills(userId);
        const newBill: Bill = { ...bill, id: Date.now() };
        bills.push(newBill);
        Storage.saveBills(userId, bills);
        return newBill;
    },

    update: (userId: number, bill: Bill): void => {
        const bills = Storage.getBills(userId).map(b => b.id === bill.id ? bill : b);
        Storage.saveBills(userId, bills);
    },

    remove: (userId: number, billId: number): void => {
        const bills = Storage.getBills(userId).filter(b => b.id !== billId);
        Storage.saveBills(userId, bills);
    },
};
