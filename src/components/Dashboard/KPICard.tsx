import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  icon: string;
  trend?: string;
  colorClass: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, trend, colorClass }) => {
  return (
    <div className="bg-surface card-shadow p-6 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center`}>
          <span className="material-symbols-outlined text-primary filled-icon">{icon}</span>
        </div>
      </div>
      <div className={`text-numeric-display font-numeric-display font-bold ${colorClass} mt-2`}>{value}</div>
      {trend && (
        <div className="text-label-md font-label-md text-primary mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">trending_up</span> {trend}
        </div>
      )}
    </div>
  );
};

export default KPICard;
