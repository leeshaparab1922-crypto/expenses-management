import React from 'react';

const BILLS = [
  { name: 'Rent', date: 'Oct 31', amount: 1200, icon: 'home' },
  { name: 'Electricity', date: 'Nov 05', amount: 85, icon: 'bolt' },
];

const UpcomingBills: React.FC = () => (
  <div className="bg-surface card-shadow p-6 rounded-lg">
    <h3 className="text-label-md font-label-md text-on-surface-variant mb-4">UPCOMING BILLS</h3>
    <div className="space-y-3">
      {BILLS.map(bill => (
        <div key={bill.name} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
          <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-xl">{bill.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-body-sm font-bold text-on-surface">{bill.name}</div>
            <div className="text-label-md text-on-surface-variant">{bill.date}</div>
          </div>
          <div className="text-body-sm font-bold text-on-surface">${bill.amount.toLocaleString()}</div>
        </div>
      ))}
    </div>
  </div>
);

export default UpcomingBills;
