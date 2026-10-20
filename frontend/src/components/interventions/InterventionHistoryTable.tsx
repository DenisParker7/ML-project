import React from 'react';
import type { Intervention } from '../../types';
import { CheckCircle2, Clock, RotateCcw, AlertTriangle, Play } from 'lucide-react';

interface InterventionHistoryTableProps {
  interventions: Intervention[];
  onTriggerNew?: (zoneId: string) => void;
}

export const InterventionHistoryTable: React.FC<InterventionHistoryTableProps> = ({
  interventions,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] shadow-clean transition-colors">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-[#EAEAEA] dark:border-[#262626] bg-[#F8F8F8] dark:bg-[#202020] text-[#555555] dark:text-[#999999] uppercase tracking-wider text-[10px] font-mono">
          <tr>
            <th className="px-5 py-3.5">Timestamp / ID</th>
            <th className="px-5 py-3.5">Zone</th>
            <th className="px-5 py-3.5">Action Type</th>
            <th className="px-5 py-3.5">Parameters</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5">Pre-Metric</th>
            <th className="px-5 py-3.5">Response Verification</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0F0F0] dark:divide-[#262626]">
          {interventions.map(item => {
            const statusConfig = {
              'Pending Confirmation': {
                icon: <Clock className="w-3.5 h-3.5 text-[#6E4F1E] dark:text-[#F8D57E]" />,
                badge: 'bg-[#FAF4E8] dark:bg-[#3D3016] text-[#6E4F1E] dark:text-[#F8D57E] border-[#E8D9BA] dark:border-[#665023]',
              },
              'Executing': {
                icon: <Play className="w-3.5 h-3.5 text-white animate-pulse" />,
                badge: 'bg-[#323232] dark:bg-white text-white dark:text-[#121212] font-bold border-[#323232] dark:border-white',
              },
              'Verified Effective': {
                icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#2F4F2F] dark:text-[#52B788]" />,
                badge: 'bg-[#EBF3E8] dark:bg-[#1E3320] text-[#2F4F2F] dark:text-[#52B788] border-[#C8DFBF] dark:border-[#2E5A33]',
              },
              'Ineffective / Recalibrating': {
                icon: <RotateCcw className="w-3.5 h-3.5 text-[#722A2A] dark:text-[#FFAAA6]" />,
                badge: 'bg-[#F7E6E6] dark:bg-[#4A1D1D] text-[#722A2A] dark:text-[#FFAAA6] border-[#E5BCBC] dark:border-[#6E2B2B]',
              },
              'Dismissed': {
                icon: <AlertTriangle className="w-3.5 h-3.5 text-[#777777] dark:text-[#999999]" />,
                badge: 'bg-[#F5F5F5] dark:bg-[#252525] text-[#777777] dark:text-[#999999] border-[#E5E5E5] dark:border-[#333333]',
              },
            }[item.status];

            return (
              <tr key={item.id} className="hover:bg-[#F9F9F9] dark:hover:bg-[#222222] transition-colors">
                <td className="px-5 py-3.5 font-mono text-[#777777] dark:text-[#AAAAAA] whitespace-nowrap">
                  <div className="text-[#323232] dark:text-white font-semibold">{item.timestamp}</div>
                  <span className="text-[10px] text-[#999999] dark:text-[#777777]">{item.id}</span>
                </td>
                <td className="px-5 py-3.5 font-semibold text-[#323232] dark:text-white whitespace-nowrap">
                  {item.zoneName}
                </td>
                <td className="px-5 py-3.5 font-bold text-[#323232] dark:text-white whitespace-nowrap">
                  {item.type}
                </td>
                <td className="px-5 py-3.5 text-[#555555] dark:text-[#CCCCCC] whitespace-nowrap font-mono text-[11px]">
                  {item.parameters.durationMinutes} min
                  {item.parameters.volumeLiters ? ` • ${item.parameters.volumeLiters}L` : ''}
                  {item.parameters.intensityPercent ? ` • ${item.parameters.intensityPercent}%` : ''}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-mono font-medium ${statusConfig.badge}`}
                  >
                    {statusConfig.icon}
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[#777777] dark:text-[#AAAAAA] font-mono text-[11px]">
                  {item.preInterventionMetric}
                </td>
                <td className="px-5 py-3.5">
                  {item.responseVerificationDelta ? (
                    <span className="text-[#2F4F2F] dark:text-[#52B788] font-medium font-mono">
                      {item.responseVerificationDelta}
                    </span>
                  ) : (
                    <span className="text-[#999999] dark:text-[#777777] italic">Monitoring feedback response...</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
