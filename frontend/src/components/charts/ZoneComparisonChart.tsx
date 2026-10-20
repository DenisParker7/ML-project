import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import type { Zone } from '../../types';
import { Layers, Droplets, Thermometer, CloudFog, Activity } from 'lucide-react';

interface ZoneComparisonChartProps {
  zones: Zone[];
  selectedZoneId: string;
  onSelectZone: (id: string) => void;
}

export const ZoneComparisonChart: React.FC<ZoneComparisonChartProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
}) => {
  const [metric, setMetric] = useState<'moisture' | 'temperature' | 'humidity' | 'stress'>('moisture');

  const chartData = zones.map(z => ({
    id: z.id,
    name: z.name.split(' - ')[0],
    fullName: z.name,
    crop: z.cropType,
    stress: z.currentStress,
    status: z.status,
    moisture: z.currentReadings.soilMoisture,
    temperature: z.currentReadings.canopyTemperature,
    humidity: z.currentReadings.humidity,
    stressProb: Math.round(z.stressProbability * 100),
  }));

  const metricConfig = {
    moisture: {
      key: 'moisture',
      label: 'Soil Moisture (%)',
      unit: '%',
      baseColor: '#323232',
      domain: [0, 60],
      icon: <Droplets className="w-4 h-4 text-[#323232]" />,
    },
    temperature: {
      key: 'temperature',
      label: 'Canopy Temp (°C)',
      unit: '°C',
      baseColor: '#454545',
      domain: [15, 40],
      icon: <Thermometer className="w-4 h-4 text-[#323232]" />,
    },
    humidity: {
      key: 'humidity',
      label: 'Air Humidity (%)',
      unit: '%',
      baseColor: '#5A5A5A',
      domain: [0, 100],
      icon: <CloudFog className="w-4 h-4 text-[#323232]" />,
    },
    stress: {
      key: 'stressProb',
      label: 'Stress Probability (%)',
      unit: '%',
      baseColor: '#323232',
      domain: [0, 100],
      icon: <Activity className="w-4 h-4 text-[#323232]" />,
    },
  }[metric];

  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-clean">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0F0F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#323232]" />
            <h3 className="text-base font-bold text-[#323232] tracking-tight">
              Cross-Zone Spatial Comparison Matrix
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-[#777777]">
            Compare microclimate gradients, spatial heterogeneity, and localized stresses across bays.
          </p>
        </div>

        <div className="flex items-center rounded-full bg-[#F5F5F5] p-1 border border-[#E5E5E5]">
          {(['moisture', 'temperature', 'humidity', 'stress'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                metric === m
                  ? 'bg-[#323232] text-white shadow-sm font-bold'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              {m === 'moisture' && 'Moisture'}
              {m === 'temperature' && 'Temp'}
              {m === 'humidity' && 'Humidity'}
              {m === 'stress' && 'Stress %'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis dataKey="name" stroke="#999999" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#999999"
              fontSize={11}
              domain={metricConfig.domain}
              tickLine={false}
              unit={metricConfig.unit}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="rounded-2xl border border-[#E5E5E5] bg-white p-3.5 shadow-luxury text-[#323232]">
                      <p className="text-xs font-bold text-[#323232]">{dataPoint.fullName}</p>
                      <p className="text-[11px] text-[#777777]">{dataPoint.crop}</p>
                      <div className="mt-2 text-xs space-y-1">
                        <p className="text-[#555555]">
                          State: <strong className="text-[#323232]">{dataPoint.stress}</strong> ({dataPoint.status})
                        </p>
                        <p className="text-[#555555]">
                          {metricConfig.label}: <strong className="text-[#323232] font-mono">{dataPoint[metricConfig.key]} {metricConfig.unit}</strong>
                        </p>
                      </div>
                      <p className="mt-2 text-[10px] text-[#888888] font-mono italic">Click bar to select zone</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey={metricConfig.key}
              radius={[6, 6, 0, 0]}
              onClick={(entry: any) => {
                if (entry && entry.id) onSelectZone(entry.id);
              }}
              className="cursor-pointer"
            >
              {chartData.map((entry) => {
                const isSelected = entry.id === selectedZoneId;
                let barColor = metricConfig.baseColor;
                if (entry.status === 'Critical') barColor = '#8A3324';
                else if (entry.status === 'Moderate') barColor = '#B57E36';
                else if (entry.status === 'Mild') barColor = '#666666';
                else barColor = '#323232';

                return (
                  <Cell
                    key={`bar-${entry.id}`}
                    fill={barColor}
                    stroke={isSelected ? '#111111' : 'transparent'}
                    strokeWidth={isSelected ? 2 : 0}
                    opacity={isSelected ? 1 : 0.85}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
