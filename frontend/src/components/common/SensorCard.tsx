import React from 'react';
import { Droplets, Thermometer, CloudFog, SunMedium, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { SensorType } from '../../types';

interface SensorCardProps {
  type: SensorType;
  value: number;
  unit: string;
  targetRange: [number, number];
  residual?: number; // x - x^0
  ambientValue?: number;
  vpd?: number;
  className?: string;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  type,
  value,
  unit,
  targetRange,
  residual,
  ambientValue,
  vpd,
  className = '',
}) => {
  const [min, max] = targetRange;
  const isOptimal = value >= min && value <= max;
  const isCriticallyLow = value < min - 5;
  const isCriticallyHigh = value > max + 5;
  const isOutOfRange = !isOptimal;

  // Percentage for progress bar (clamped 0 to 100)
  const rangeSpan = (max - min) * 2;
  const normalizedPercentage = Math.min(
    100,
    Math.max(0, ((value - (min - (max - min) * 0.5)) / rangeSpan) * 100)
  );

  const config = {
    soilMoisture: {
      name: 'Soil Moisture',
      icon: <Droplets className="w-4 h-4 text-[#323232] dark:text-white" />,
      subtext: 'Volumetric Water Content (VWC)',
      accent: 'hover:border-[#323232] dark:hover:border-[#666666]',
    },
    canopyTemperature: {
      name: 'Canopy Temperature',
      icon: <Thermometer className="w-4 h-4 text-[#323232] dark:text-white" />,
      subtext: ambientValue ? `Ambient: ${ambientValue}°C (Δ: ${(value - ambientValue).toFixed(1)}°C)` : 'Infrared Thermal Radiometer',
      accent: 'hover:border-[#323232] dark:hover:border-[#666666]',
    },
    humidity: {
      name: 'Air Humidity',
      icon: <CloudFog className="w-4 h-4 text-[#323232] dark:text-white" />,
      subtext: vpd ? `VPD: ${vpd} kPa (Transpiration Demand)` : 'Psychrometric Relative Humidity',
      accent: 'hover:border-[#323232] dark:hover:border-[#666666]',
    },
    lightIntensity: {
      name: 'Light Intensity',
      icon: <SunMedium className="w-4 h-4 text-[#323232] dark:text-white" />,
      subtext: 'Quantum Photosynthetic Flux (PAR)',
      accent: 'hover:border-[#323232] dark:hover:border-[#666666]',
    },
  }[type];

  return (
    <div
      className={`rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-5 shadow-clean transition-all duration-200 ${config.accent} ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#F8F8F8] dark:bg-[#252525] p-2.5 border border-[#EAEAEA] dark:border-[#2D2D2D] text-[#323232] dark:text-white">
            {config.icon}
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#323232] dark:text-white">{config.name}</h4>
            <p className="text-xs text-[#777777] dark:text-[#999999]">{config.subtext}</p>
          </div>
        </div>

        <div>
          {isOptimal ? (
            <span className="flex items-center gap-1 text-[11px] font-mono font-medium text-[#2F4F2F] dark:text-[#52B788] bg-[#EBF3E8] dark:bg-[#1E3320] border border-[#C8DFBF] dark:border-[#2E5A33] px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F4F2F] dark:text-[#52B788]" /> In Range
            </span>
          ) : (
            <span
              className={`flex items-center gap-1 text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border ${
                isCriticallyHigh || isCriticallyLow
                  ? 'text-[#722A2A] dark:text-[#FFAAA6] bg-[#F7E6E6] dark:bg-[#4A1D1D] border-[#E5BCBC] dark:border-[#6E2B2B]'
                  : 'text-[#6E4F1E] dark:text-[#F8D57E] bg-[#FAF4E8] dark:bg-[#3D3016] border-[#E8D9BA] dark:border-[#665023]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {value < min ? 'Below Target' : 'Above Target'}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold tracking-tight text-[#323232] dark:text-white font-mono">
            {value}
          </span>
          <span className="text-sm font-semibold text-[#777777] dark:text-[#999999]">{unit}</span>
        </div>

        {residual !== undefined && (
          <div className="text-right">
            <span className="text-[11px] font-mono text-[#888888] dark:text-[#777777] block">Baseline Residual r:</span>
            <span
              className={`text-xs font-mono font-bold ${
                Math.abs(residual) < 1.5
                  ? 'text-[#2F4F2F] dark:text-[#52B788]'
                  : 'text-[#8A3324] dark:text-[#E07A5F]'
              }`}
            >
              {residual > 0 ? `+${residual}` : residual} {unit}
            </span>
          </div>
        )}
      </div>

      {/* Target range visual bar */}
      <div className="mt-4">
        <div className="flex justify-between text-[11px] font-mono text-[#777777] dark:text-[#999999] mb-1.5">
          <span>Target Min: <strong className="text-[#323232] dark:text-white">{min}{unit}</strong></span>
          <span>Target Max: <strong className="text-[#323232] dark:text-white">{max}{unit}</strong></span>
        </div>
        <div className="relative h-2 w-full rounded-full bg-[#F0F0F0] dark:bg-[#282828] border border-[#E5E5E5] dark:border-[#333333] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOutOfRange
                ? (isCriticallyLow || isCriticallyHigh ? 'bg-[#8A3324] dark:bg-[#E07A5F]' : 'bg-[#B57E36] dark:bg-[#E5A84B]')
                : 'bg-[#323232] dark:bg-white'
            }`}
            style={{ width: `${normalizedPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
