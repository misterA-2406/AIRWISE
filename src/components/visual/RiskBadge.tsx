import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  level, 
  label, 
  size = 'md',
  showDot = true 
}) => {
  const config = {
    low: {
      bg: 'bg-[#3DD68C]/12',
      border: 'border-[#3DD68C]/30',
      text: 'text-[#3DD68C]',
      dot: 'bg-[#3DD68C]',
      defaultLabel: 'Low Risk'
    },
    moderate: {
      bg: 'bg-[#F5C842]/12',
      border: 'border-[#F5C842]/30',
      text: 'text-[#F5C842]',
      dot: 'bg-[#F5C842]',
      defaultLabel: 'Moderate'
    },
    high: {
      bg: 'bg-[#F28B36]/12',
      border: 'border-[#F28B36]/30',
      text: 'text-[#F28B36]',
      dot: 'bg-[#F28B36]',
      defaultLabel: 'High Risk'
    },
    severe: {
      bg: 'bg-[#E64848]/12',
      border: 'border-[#E64848]/35',
      text: 'text-[#E64848]',
      dot: 'bg-[#E64848]',
      defaultLabel: 'Severe Pollution'
    }
  }[level] || {
    bg: 'bg-stone-800',
    border: 'border-stone-700',
    text: 'text-stone-300',
    dot: 'bg-stone-400',
    defaultLabel: 'Unknown'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3.5 py-1.5 gap-2'
  }[size];

  return (
    <span 
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.border} ${config.text} ${sizeClasses} tracking-wide transition-colors`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      )}
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};
