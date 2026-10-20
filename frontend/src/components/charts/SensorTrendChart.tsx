import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import type { CounterfactualReading, TimeRange } from '../../types';
import { Droplets, Thermometer, CloudFog } from 'lucide-react';
import { useGreenhouse } from '../../context/GreenhouseContext';

interface SensorTrendChartProps {
  data: CounterfactualReading[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  zoneName: string;
}

export const SensorTrendChart: React.FC<SensorTrendChartProps> = ({
  data,
  timeRange,
  onTimeRangeChange,
  zoneName,
}) => {
  const [activeMetric, setActiveMetric] = useState<'moisture' | 'temperature' | 'humidity'>('moisture');
  const [showCounterfactual, setShowCounterfactual] = useState<boolean>(true);

  const { theme } = useGreenhouse();
  const isDark = theme === 'dark';

  const metricConfig = {
    moisture: {
      label: 'Soil Moisture (%)',
      actualKey: 'actualMoisture',
      baselineKey: 'healthyBaselineMoisture',
      residualKey: 'residualMoisture',
      actualColor: isDark ? '#FFFFFF' : '#323232',
      baselineColor: isDark ? '#888888' : '#777777',
      unit: '%',
      yDomain: [15, 55],
      icon: <Droplets className="w-4 h-4" />,
    },
    temperature: {
      label: 'Canopy Temp (°C)',
      actualKey: 'actualTemperature',
      baselineKey: 'healthyBaselineTemperature',
      residualKey: 'residualTemperature',
      actualColor: isDark ? '#FFFFFF' : '#323232',
      baselineColor: isDark ? '#888888' : '#777777',
      unit: '°C',
      yDomain: [18, 38],
      icon: <Thermometer className="w-4 h-4" />,
    },
    humidity: {
      label: 'Air Humidity (%)',
      actualKey: 'actualHumidity',
      baselineKey: 'healthyBaselineHumidity',
      residualKey: 'residualHumidity',
      actualColor: isDark ? '#FFFFFF' : '#323232',
      baselineColor: isDark ? '#888888' : '#777777',
      unit: '%',
      yDomain: [40, 90],
      icon: <CloudFog className="w-4 h-4" />,
    },
  }[activeMetric];

  return (
    <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-6 shadow-clean transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F0F0] dark:border-[#262626] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#323232] dark:text-white tracking-tight">
              Sensor Dynamics vs Counterfactual Baseline
            </h3>
            <span className="rounded-full bg-[#F5F5F5] dark:bg-[#262626] px-3 py-0.5 text-xs font-mono font-medium text-[#323232] dark:text-white border border-[#E5E5E5] dark:border-[#333333]">
              {zoneName}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#777777] dark:text-[#AAAAAA]">
            Comparing observed trajectory <span className="text-[#323232] dark:text-white font-mono font-bold">x(t)</span> against the estimated healthy model <span className="text-[#888888] dark:text-[#888888] font-mono font-bold">x̂⁰(t)</span>.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center rounded-full bg-[#F5F5F5] dark:bg-[#222222] p-1 border border-[#E5E5E5] dark:border-[#2D2D2D]">
            {(['moisture', 'temperature', 'humidity'] as const).map(metric => (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  activeMetric === metric
                    ? 'bg-[#323232] dark:bg-white text-white dark:text-[#121212] shadow-sm'
                    : 'text-[#777777] dark:text-[#AAAAAA] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {metric === 'moisture' && <Droplets className="w-3.5 h-3.5" />}
                {metric === 'temperature' && <Thermometer className="w-3.5 h-3.5" />}
                {metric === 'humidity' && <CloudFog className="w-3.5 h-3.5" />}
                <span className="capitalize">{metric}</span>
              </button>
            ))}
          </div>

          {/* Time range buttons */}
          <div className="flex items-center rounded-full bg-[#F5F5F5] dark:bg-[#222222] p-1 border border-[#E5E5E5] dark:border-[#2D2D2D]">
            {(['1h', '24h', '7d', '30d'] as const).map(range => (
              <button
                key={range}
                onClick={() => onTimeRangeChange(range)}
                className={`rounded-full px-2.5 py-1 text-xs font-mono font-bold uppercase transition-all ${
                  timeRange === range
                    ? 'bg-[#323232] dark:bg-white text-white dark:text-[#121212] shadow-sm'
                    : 'text-[#777777] dark:text-[#AAAAAA] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Toggle Counterfactual Baseline */}
          <button
            onClick={() => setShowCounterfactual(!showCounterfactual)}
            className={`rounded-full border px-3 py-1.5 text-xs font-mono font-bold transition-all ${
              showCounterfactual
                ? 'border-[#323232] dark:border-white bg-[#323232] dark:bg-white text-white dark:text-[#121212]'
                : 'border-[#E5E5E5] dark:border-[#333333] bg-white dark:bg-[#222222] text-[#777777] dark:text-[#AAAAAA]'
            }`}
          >
            Baseline {showCounterfactual ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-4 h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#262626' : '#F0F0F0'} vertical={false} />
            <XAxis
              dataKey="timestamp"
              stroke={isDark ? '#777777' : '#999999'}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#333333' : '#E5E5E5' }}
            />
            <YAxis
              stroke={isDark ? '#777777' : '#999999'}
              fontSize={11}
              domain={metricConfig.yDomain}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#333333' : '#E5E5E5' }}
              unit={metricConfig.unit}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const actual = payload.find(p => p.dataKey === metricConfig.actualKey)?.value as number;
                  const baseline = payload.find(p => p.dataKey === metricConfig.baselineKey)?.value as number;
                  const residual = actual !== undefined && baseline !== undefined ? Number((actual - baseline).toFixed(2)) : null;

                  return (
                    <div className="rounded-2xl border border-[#E5E5E5] dark:border-[#333333] bg-white dark:bg-[#222222] p-3.5 shadow-luxury text-[#323232] dark:text-white">
                      <p className="text-xs font-mono font-bold text-[#777777] dark:text-[#AAAAAA]">{label}</p>
                      <div className="mt-2 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-5">
                          <span className="flex items-center gap-1.5 text-[#555555] dark:text-[#CCCCCC]">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: metricConfig.actualColor }} />
                            Observed Sensor x(t):
                          </span>
                          <span className="font-mono font-extrabold text-[#323232] dark:text-white">{actual} {metricConfig.unit}</span>
                        </div>
                        {showCounterfactual && baseline !== undefined && (
                          <div className="flex items-center justify-between gap-5">
                            <span className="flex items-center gap-1.5 text-[#555555] dark:text-[#CCCCCC]">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: metricConfig.baselineColor }} />
                              Healthy Baseline x̂⁰(t):
                            </span>
                            <span className="font-mono font-bold text-[#888888] dark:text-[#999999]">{baseline} {metricConfig.unit}</span>
                          </div>
                        )}
                        {showCounterfactual && residual !== null && (
                          <div className="mt-1.5 pt-1.5 border-t border-[#F0F0F0] dark:border-[#333333] flex items-center justify-between gap-5">
                            <span className="text-[#777777] dark:text-[#AAAAAA] font-mono">Residual r_i,t:</span>
                            <span className={`font-mono font-extrabold ${Math.abs(residual) > 2 ? 'text-[#8A3324] dark:text-[#E07A5F]' : 'text-[#2F4F2F] dark:text-[#52B788]'}`}>
                              {residual > 0 ? `+${residual}` : residual} {metricConfig.unit}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 12, fontSize: 12, color: isDark ? '#EAEAEA' : '#323232' }}
            />
            <Line
              type="monotone"
              name="Observed Reading x(t)"
              dataKey={metricConfig.actualKey}
              stroke={metricConfig.actualColor}
              strokeWidth={2.5}
              dot={{ r: 2.5, fill: metricConfig.actualColor }}
              activeDot={{ r: 6, stroke: isDark ? '#1A1A1A' : '#FFFFFF', strokeWidth: 2 }}
            />
            {showCounterfactual && (
              <Line
                type="monotone"
                name="Healthy Baseline x̂⁰(t)"
                dataKey={metricConfig.baselineKey}
                stroke={metricConfig.baselineColor}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
