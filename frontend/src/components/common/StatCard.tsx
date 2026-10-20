import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  badge?: ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  badge,
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-5 shadow-clean transition-all duration-200 hover:border-[#CCCCCC] dark:hover:border-[#3D3D3D] hover:shadow-luxury ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#777777] dark:text-[#999999]">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#323232] dark:text-white font-sans">
              {value}
            </span>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && <p className="mt-1 text-xs text-[#666666] dark:text-[#AAAAAA]">{subtitle}</p>}
        </div>
        <div className="rounded-xl border border-[#EAEAEA] dark:border-[#2D2D2D] bg-[#F8F8F8] dark:bg-[#252525] p-3 text-[#323232] dark:text-white shadow-sm">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3.5 flex items-center gap-1.5 border-t border-[#F0F0F0] dark:border-[#262626] pt-2.5 text-xs font-mono">
          <span
            className={`font-semibold ${
              trend.isNeutral
                ? 'text-[#777777] dark:text-[#888888]'
                : trend.isPositive
                ? 'text-[#2F4F2F] dark:text-[#52B788]'
                : 'text-[#8A3324] dark:text-[#E07A5F]'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-[#888888] dark:text-[#777777] font-sans">vs counterfactual baseline</span>
        </div>
      )}
    </div>
  );
};
