import React from 'react';
import type { StressSeverity, StressType } from '../../types';

interface BadgeProps {
  label: string;
  variant?: 'stress' | 'severity' | 'status' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'status',
  size = 'md',
  className = '',
}) => {
  let colorStyles = 'bg-[#F2F2F2] text-[#323232] border-[#E0E0E0]';

  if (variant === 'stress') {
    switch (label as StressType) {
      case 'Healthy':
        colorStyles = 'bg-[#EBF3E8] text-[#2F4F2F] border-[#C8DFBF]';
        break;
      case 'Water Stress':
        colorStyles = 'bg-[#E8EFF5] text-[#2C485E] border-[#C2D5E5]';
        break;
      case 'Heat Stress':
        colorStyles = 'bg-[#FAEEE4] text-[#7A3F1F] border-[#E8CABA]';
        break;
      case 'Nutrient Deficiency':
        colorStyles = 'bg-[#F1EAF2] text-[#553457] border-[#DAC8DC]';
        break;
      case 'Early Disease Onset':
        colorStyles = 'bg-[#F7E6E6] text-[#722A2A] border-[#E5BCBC]';
        break;
    }
  } else if (variant === 'severity') {
    switch (label as StressSeverity) {
      case 'Normal':
        colorStyles = 'bg-[#EBF3E8] text-[#2F4F2F] border-[#C8DFBF]';
        break;
      case 'Mild':
        colorStyles = 'bg-[#FAF4E8] text-[#6E4F1E] border-[#E8D9BA]';
        break;
      case 'Moderate':
        colorStyles = 'bg-[#FAEEE4] text-[#7A3F1F] border-[#E8CABA]';
        break;
      case 'Critical':
        colorStyles = 'bg-[#323232] text-white border-[#323232] font-semibold';
        break;
    }
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1 font-medium',
    lg: 'text-sm px-3.5 py-1.5 font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-mono ${sizeStyles} ${colorStyles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
};
