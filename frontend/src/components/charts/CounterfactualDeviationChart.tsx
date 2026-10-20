import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';
import type { CounterfactualReading } from '../../types';

interface CounterfactualDeviationChartProps {
  data: CounterfactualReading[];
  metric: 'moisture' | 'temperature' | 'humidity';
}

export const CounterfactualDeviationChart: React.FC<CounterfactualDeviationChartProps> = ({
  data,
  metric,
}) => {
  const config = {
    moisture: {
      key: 'residualMoisture',
      label: 'Soil Moisture Residual (r_moist)',
      unit: '%',
      negColor: '#8A3324',
      posColor: '#2F4F2F',
      threshold: 3,
    },
    temperature: {
      key: 'residualTemperature',
      label: 'Canopy Temperature Residual (r_temp)',
      unit: '°C',
      negColor: '#2F4F2F',
      posColor: '#8A3324',
      threshold: 2,
    },
    humidity: {
      key: 'residualHumidity',
      label: 'Humidity Residual (r_hum)',
      unit: '%',
      negColor: '#8A3324',
      posColor: '#323232',
      threshold: 5,
    },
  }[metric];

  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-clean">
      <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-3">
        <div>
          <h4 className="text-sm font-bold text-[#323232]">{config.label}</h4>
          <p className="text-xs text-[#777777] font-mono mt-0.5">
            r = x(t) - x̂⁰(t) (Deviation from counterfactual healthy trajectory)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-[#555555]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CCCCCC]" /> Normal
          </span>
          <span className="flex items-center gap-1.5 text-[#555555]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#323232]" /> Anomaly Residual
          </span>
        </div>
      </div>

      <div className="mt-4 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis dataKey="timestamp" stroke="#999999" fontSize={10} tickLine={false} />
            <YAxis stroke="#999999" fontSize={10} tickLine={false} unit={config.unit} />
            <ReferenceLine y={0} stroke="#323232" strokeWidth={1.5} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  return (
                    <div className="rounded-xl border border-[#E5E5E5] bg-white p-3 shadow-luxury text-[#323232]">
                      <p className="text-[11px] font-mono text-[#777777]">{label}</p>
                      <p className="mt-1 text-xs font-mono font-bold text-[#323232]">
                        Residual Deviation: <span className={Math.abs(val) > config.threshold ? 'text-[#8A3324] font-extrabold' : 'text-[#323232]'}>
                          {val > 0 ? `+${val}` : val} {config.unit}
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey={config.key} radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => {
                const val = (entry as any)[config.key] as number;
                const isHighDev = Math.abs(val) > config.threshold;
                const fill = isHighDev
                  ? val > 0 ? config.posColor : config.negColor
                  : '#CCCCCC';
                return <Cell key={`cell-${index}`} fill={fill} opacity={0.9} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
