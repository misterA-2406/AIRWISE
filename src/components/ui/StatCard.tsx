import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  badge?: string;
  badgeColor?: 'green' | 'yellow' | 'orange' | 'red' | 'lime';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  subtext,
  badge,
  badgeColor = 'lime',
  icon
}) => {
  const badgeClasses = {
    green: 'bg-[#3DD68C]/12 text-[#3DD68C] border-[#3DD68C]/30',
    yellow: 'bg-[#F5C842]/12 text-[#F5C842] border-[#F5C842]/30',
    orange: 'bg-[#F28B36]/12 text-[#F28B36] border-[#F28B36]/30',
    red: 'bg-[#E64848]/12 text-[#E64848] border-[#E64848]/30',
    lime: 'bg-[#C7F36B]/15 text-[#C7F36B] border-[#C7F36B]/30'
  }[badgeColor];

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-b from-[#11231B] to-[#0B1914] border border-[#91B49A]/15 hover:border-[#91B49A]/30 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between text-xs text-[#A3B1A6] mb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider">{label}</span>
        {icon && <div className="text-[#C7F36B]">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-1 my-1">
        <span className="font-editorial text-3xl font-bold text-[#F0F3EA] tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-[#A3B1A6]">{unit}</span>}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#91B49A]/10 text-xs">
        {subtext && <span className="text-[#A3B1A6] text-[11px] truncate">{subtext}</span>}
        {badge && (
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono shrink-0 ${badgeClasses}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
