import React from 'react';
import { useGreenhouse } from '../context/GreenhouseContext';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Radio,
  Sliders,
  ShieldCheck,
} from 'lucide-react';

export const SensorHealthPage: React.FC = () => {
  const { sensorHealth, recalibrateSensor, zones } = useGreenhouse();

  const optimalCount = sensorHealth.filter(s => s.status === 'Optimal').length;
  const issuesCount = sensorHealth.length - optimalCount;
  const avgReliability = Math.round(
    sensorHealth.reduce((acc, s) => acc + s.reliabilityIndex, 0) / (sensorHealth.length || 1)
  );

  return (
    <div className="space-y-8 pb-14 bg-white dark:bg-[#121212] transition-colors">
      {/* Header */}
      <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-6 shadow-clean">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#F5F5F5] dark:bg-[#282828] px-3 py-0.5 text-xs font-mono font-bold text-[#323232] dark:text-white border border-[#E5E5E5] dark:border-[#333333]">
                Module A & Data Quality ($q_{'{i,t}'}$)
              </span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-serif font-bold text-[#323232] dark:text-white tracking-tight">
              Sensor Reliability & Health Telemetry
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#555555] dark:text-[#AAAAAA]">
              Detects faulty readings, sensor drift, missing data packets, and performs dynamic context normalization.
            </p>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1E1E1E] px-5 py-3 shadow-clean">
              <span className="text-[10px] text-[#777777] dark:text-[#999999] block uppercase font-mono font-bold">Reliability Score</span>
              <span className="text-2xl font-black text-[#323232] dark:text-white font-mono">{avgReliability}%</span>
            </div>
            <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1E1E1E] px-5 py-3 shadow-clean">
              <span className="text-[10px] text-[#777777] dark:text-[#999999] block uppercase font-mono font-bold">Drift / Anomalies</span>
              <span className="text-2xl font-black text-[#8A3324] dark:text-[#E07A5F] font-mono">{issuesCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] shadow-clean">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#EAEAEA] dark:border-[#262626] bg-[#F8F8F8] dark:bg-[#202020] text-[#555555] dark:text-[#999999] uppercase tracking-wider text-[10px] font-mono">
            <tr>
              <th className="px-5 py-3.5">Sensor Identifier</th>
              <th className="px-5 py-3.5">Zone</th>
              <th className="px-5 py-3.5">Channel Type</th>
              <th className="px-5 py-3.5">Health Status</th>
              <th className="px-5 py-3.5">Reliability Index ($q_{'{i,t}'}$)</th>
              <th className="px-5 py-3.5">Packet Loss</th>
              <th className="px-5 py-3.5">Imputation</th>
              <th className="px-5 py-3.5">Calibration</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F0] dark:divide-[#262626]">
            {sensorHealth.map(sensor => {
              const zoneObj = zones.find(z => z.id === sensor.zoneId);
              const isOptimal = sensor.status === 'Optimal';

              return (
                <tr key={sensor.id} className="hover:bg-[#F9F9F9] dark:hover:bg-[#222222] transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-[#323232] dark:text-white whitespace-nowrap">
                    <div>{sensor.sensorLabel}</div>
                    <span className="text-[10px] font-mono text-[#777777] dark:text-[#888888]">{sensor.id}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[#555555] dark:text-[#CCCCCC] whitespace-nowrap">
                    {zoneObj?.name.split(' - ')[0] || sensor.zoneId}
                  </td>
                  <td className="px-5 py-3.5 text-[#555555] dark:text-[#CCCCCC] capitalize whitespace-nowrap font-mono">
                    {sensor.sensorType.replace(/([A-Z])/g, ' $1')}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[11px] font-mono font-semibold border ${
                        isOptimal
                          ? 'bg-[#EBF3E8] dark:bg-[#1E3320] text-[#2F4F2F] dark:text-[#52B788] border-[#C8DFBF] dark:border-[#2E5A33]'
                          : 'bg-[#FAF4E8] dark:bg-[#3D3016] text-[#6E4F1E] dark:text-[#F8D57E] border-[#E8D9BA] dark:border-[#665023]'
                      }`}
                    >
                      {isOptimal ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2F4F2F] dark:text-[#52B788]" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      {sensor.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[#323232] dark:text-white whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-[#F0F0F0] dark:bg-[#2D2D2D] border border-[#E5E5E5] dark:border-[#333333] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sensor.reliabilityIndex > 90 ? 'bg-[#323232] dark:bg-white' : 'bg-[#B57E36] dark:bg-[#E5A84B]'
                          }`}
                          style={{ width: `${sensor.reliabilityIndex}%` }}
                        />
                      </div>
                      <span className="font-bold">{sensor.reliabilityIndex}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[#777777] dark:text-[#AAAAAA] whitespace-nowrap">
                    {sensor.packetLossRate}%
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {sensor.imputationActive ? (
                      <span className="text-[10px] font-mono font-bold text-[#323232] dark:text-white bg-[#F5F5F5] dark:bg-[#2D2D2D] border border-[#E5E5E5] dark:border-[#3D3D3D] px-2.5 py-0.5 rounded-full">
                        Kalman Filter
                      </span>
                    ) : (
                      <span className="text-[#888888] dark:text-[#777777] font-mono text-[11px]">Direct Stream</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[#777777] dark:text-[#AAAAAA] font-mono text-[11px] whitespace-nowrap">
                    {sensor.lastCalibrated}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => recalibrateSensor(sensor.id)}
                      className="rounded-full bg-[#323232] dark:bg-white px-3.5 py-1 text-[11px] font-mono font-bold text-white dark:text-[#121212] hover:bg-[#111111] dark:hover:bg-[#EAEAEA] transition-colors inline-flex items-center gap-1 shadow-clean"
                    >
                      <RotateCcw className="w-3 h-3" /> Recalibrate
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sensor Imputation & Outlier Rejection Architecture Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-5 shadow-clean">
          <div className="flex items-center gap-2 text-xs font-bold text-[#323232] dark:text-white">
            <Radio className="w-4 h-4 text-[#323232] dark:text-white" />
            Missing Data Imputation
          </div>
          <p className="mt-2 text-xs text-[#555555] dark:text-[#CCCCCC] leading-relaxed">
            Short-duration sensor dropouts are reconstructed using dynamic spatial cross-zone graph interpolation and historical autoregression.
          </p>
        </div>

        <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-5 shadow-clean">
          <div className="flex items-center gap-2 text-xs font-bold text-[#323232] dark:text-white">
            <Sliders className="w-4 h-4 text-[#323232] dark:text-white" />
            Sensor Drift Calibration
          </div>
          <p className="mt-2 text-xs text-[#555555] dark:text-[#CCCCCC] leading-relaxed">
            Zero-point offset drift is detected by comparing overnight equilibrium readings across adjacent physical zones ($a_{'{ij}'}$).
          </p>
        </div>

        <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-5 shadow-clean">
          <div className="flex items-center gap-2 text-xs font-bold text-[#323232] dark:text-white">
            <ShieldCheck className="w-4 h-4 text-[#323232] dark:text-white" />
            Outlier & Spike Filtering
          </div>
          <p className="mt-2 text-xs text-[#555555] dark:text-[#CCCCCC] leading-relaxed">
            Electrical noise spikes and transient errors are filtered prior to passing residuals $r_{'{i,t}'}$ into the stress classifier.
          </p>
        </div>
      </div>
    </div>
  );
};
