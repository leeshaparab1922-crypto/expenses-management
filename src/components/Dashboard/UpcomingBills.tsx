import React from 'react';

const UpcomingBills: React.FC = () => {
    const bills = [
        { name: 'Rent', date: 'Oct 31', amount: 1200 },
        { name: 'Electricity', date: 'Nov 05', amount: 85 },
    ];

    return (
        <div className="bg-surface card-shadow p-6 rounded-lg">
            <h3 className="text-label-md font-label-md text-on-surface-variant mb-4">UPCOMING BILLS</h3>
            <div className="space-y-4">
                {bills.map(bill => (
                    <div key={bill.name} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                        <div className="w-10 h-10 bg-surface rounded flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">receipt</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-body-sm font-bold">{bill.name}</div>
                            <div className="text-label-md text-on-surface-variant">{bill.date}</div>
                        </div>
                        <div className="text-body-sm font-bold">₹{bill.amount}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingBills;
