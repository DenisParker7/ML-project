import React, { useState } from 'react';
import { useGreenhouse } from '../context/GreenhouseContext';
import { ApiService } from '../services/api';
import { SensorCard } from '../components/common/SensorCard';
import { Badge } from '../components/common/Badge';
import { SensorTrendChart } from '../components/charts/SensorTrendChart';
import { CounterfactualDeviationChart } from '../components/charts/CounterfactualDeviationChart';
import { InterventionModal } from '../components/interventions/InterventionModal';
import {
  Zap,
  Droplets,
  Wind,
  Sun,
  CloudFog,
  Sliders,
  History,
} from 'lucide-react';

export const ZoneDetailsPage: React.FC = () => {
  const {
    zones,
    selectedZoneId,
    setSelectedZoneId,
    selectedZone,
    timeRange,
    setTimeRange,
    interventions,
  } = useGreenhouse();

  const [isInterventionOpen, setIsInterventionOpen] = useState(false);
  const [residualMetric, setResidualMetric] = useState<'moisture' | 'temperature' | 'humidity'>('moisture');

  const zone = selectedZone || zones[0];
  const timeSeriesData = ApiService.generateTimeSeries(zone.id, timeRange);
  const zoneInterventions = interventions.filter(i => i.zoneId === zone.id);

  return (
    <div className="space-y-8 pb-14 bg-white dark:bg-[#121212] transition-colors">
      {/* Zone Header with selector */}
      <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-6 shadow-clean">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#F5F5F5] dark:bg-[#282828] px-3 py-1 text-xs font-mono font-bold text-[#323232] dark:text-white border border-[#E5E5E5] dark:border-[#333333]">
                {zone.id.toUpperCase()}
              </span>
              <Badge label={zone.currentStress} variant="stress" size="md" />
              <Badge label={zone.status} variant="severity" size="md" />
            </div>

            <h2 className="mt-2 text-2xl sm:text-4xl font-serif font-bold text-[#323232] dark:text-white tracking-tight">
              {zone.name}
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-[#555555] dark:text-[#AAAAAA]">
              Crop: <strong className="text-[#323232] dark:text-white">{zone.cropType}</strong> • Stage: <span className="text-[#323232] dark:text-white font-semibold">{zone.cropStage}</span> • Canopy Area: <span className="text-[#323232] dark:text-white">{zone.areaM2} m²</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsInterventionOpen(true)}
              className="rounded-full bg-[#323232] dark:bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-white dark:text-[#121212] shadow-pill hover:bg-[#111111] dark:hover:bg-[#EAEAEA] transition-all active:scale-95 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Trigger Intervention
            </button>
          </div>
        </div>

        {/* Quick Zone Switcher Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[#F0F0F0] dark:border-[#262626] pt-4">
          <span className="text-xs font-mono font-semibold text-[#777777] dark:text-[#AAAAAA] mr-1">Switch Zone:</span>
          {zones.map(z => (
            <button
              key={z.id}
              onClick={() => setSelectedZoneId(z.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                z.id === zone.id
                  ? 'bg-[#323232] dark:bg-white text-white dark:text-[#121212] font-bold shadow-sm'
                  : 'bg-[#F5F5F5] dark:bg-[#252525] text-[#555555] dark:text-[#CCCCCC] hover:bg-[#EAEAEA] dark:hover:bg-[#303030] border border-[#E5E5E5] dark:border-[#333333]'
              }`}
            >
              {z.name.split(' - ')[0]}
              {z.status === 'Critical' && (
                <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#8A3324]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sensor Cards for this zone */}
      <div>
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#777777] dark:text-[#999999] mb-3">
          Multi-Zone Microclimate Sensing Channels
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard
            type="soilMoisture"
            value={zone.currentReadings.soilMoisture}
            unit="%"
            targetRange={zone.targetRanges.soilMoisture}
            residual={zone.id === 'zone-2' ? -15.4 : 0.8}
          />
          <SensorCard
            type="canopyTemperature"
            value={zone.currentReadings.canopyTemperature}
            unit="°C"
            targetRange={zone.targetRanges.canopyTemperature}
            ambientValue={zone.currentReadings.ambientTemperature}
            residual={zone.id === 'zone-2' ? 4.8 : zone.id === 'zone-5' ? 6.2 : -0.4}
          />
          <SensorCard
            type="humidity"
            value={zone.currentReadings.humidity}
            unit="%"
            targetRange={zone.targetRanges.humidity}
            vpd={zone.currentReadings.vaporPressureDeficit}
            residual={zone.id === 'zone-2' ? -14.2 : 1.5}
          />
          <SensorCard
            type="lightIntensity"
            value={zone.currentReadings.lightIntensity}
            unit="lux"
            targetRange={zone.targetRanges.lightIntensity}
            residual={zone.id === 'zone-5' ? 180 : 20}
          />
        </div>
      </div>

      {/* Actuator State Panel */}
      <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-6 shadow-clean">
        <h3 className="text-base font-serif font-bold text-[#323232] dark:text-white flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4 text-[#323232] dark:text-white" />
          Physical Actuator Status & Automation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#2D2D2D] bg-[#F8F8F8] dark:bg-[#252525] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#323232] dark:text-white flex items-center gap-1.5 font-semibold">
                <Droplets className="w-4 h-4 text-[#323232] dark:text-white" />
                Drip Irrigation Valves
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold ${
                  zone.actuatorStatus.irrigationValves === 'Closed'
                    ? 'bg-[#EAEAEA] dark:bg-[#333333] text-[#666666] dark:text-[#AAAAAA]'
                    : 'bg-[#323232] dark:bg-white text-white dark:text-[#121212]'
                }`}
              >
                {zone.actuatorStatus.irrigationValves}
              </span>
            </div>
            <p className="mt-3 text-xs text-[#777777] dark:text-[#999999] leading-relaxed">
              Zone solenoid valve manifold. Pulsed dosing calibrated.
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#2D2D2D] bg-[#F8F8F8] dark:bg-[#252525] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#323232] dark:text-white flex items-center gap-1.5 font-semibold">
                <CloudFog className="w-4 h-4 text-[#323232] dark:text-white" />
                Misting Foggers
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold ${
                  zone.actuatorStatus.mistingFoggers === 'Idle'
                    ? 'bg-[#EAEAEA] dark:bg-[#333333] text-[#666666] dark:text-[#AAAAAA]'
                    : 'bg-[#323232] dark:bg-white text-white dark:text-[#121212] animate-pulse'
                }`}
              >
                {zone.actuatorStatus.mistingFoggers}
              </span>
            </div>
            <p className="mt-3 text-xs text-[#777777] dark:text-[#999999] leading-relaxed">
              High-pressure 70-bar evaporative humidity nozzles.
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#2D2D2D] bg-[#F8F8F8] dark:bg-[#252525] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#323232] dark:text-white flex items-center gap-1.5 font-semibold">
                <Sun className="w-4 h-4 text-[#323232] dark:text-white" />
                Thermal Screen / Shade
              </span>
              <span className="rounded-full bg-[#EAEAEA] dark:bg-[#333333] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#323232] dark:text-white">
                {zone.actuatorStatus.shadeCurtain}
              </span>
            </div>
            <p className="mt-3 text-xs text-[#777777] dark:text-[#999999] leading-relaxed">
              Overhead motorized radiation retention screen.
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#2D2D2D] bg-[#F8F8F8] dark:bg-[#252525] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#323232] dark:text-white flex items-center gap-1.5 font-semibold">
                <Wind className="w-4 h-4 text-[#323232] dark:text-white" />
                Circulation Fans
              </span>
              <span className="rounded-full bg-[#EAEAEA] dark:bg-[#333333] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#323232] dark:text-white">
                {zone.actuatorStatus.ventilationFans} Speed
              </span>
            </div>
            <p className="mt-3 text-xs text-[#777777] dark:text-[#999999] leading-relaxed">
              Ridge vents & horizontal air flow (HAF) dampers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Counterfactual Sensor Dynamics Chart */}
      <SensorTrendChart
        data={timeSeriesData}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        zoneName={zone.name}
      />

      {/* Residual Deviation Analysis */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#777777] dark:text-[#999999]">
            Learned Counterfactual Residual Deviation ($r = x(t) - x̂⁰(t)$)
          </h3>
          <div className="flex gap-2">
            {(['moisture', 'temperature', 'humidity'] as const).map(m => (
              <button
                key={m}
                onClick={() => setResidualMetric(m)}
                className={`rounded-full px-4 py-1 text-xs font-semibold capitalize transition-colors ${
                  residualMetric === m
                    ? 'bg-[#323232] dark:bg-white text-white dark:text-[#121212] font-bold'
                    : 'bg-white dark:bg-[#202020] text-[#777777] dark:text-[#AAAAAA] hover:text-[#111111] dark:hover:text-white border border-[#E5E5E5] dark:border-[#333333]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <CounterfactualDeviationChart data={timeSeriesData} metric={residualMetric} />
      </div>

      {/* Past Interventions for this zone */}
      {zoneInterventions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#323232] dark:text-white" />
            <h3 className="text-lg font-serif font-bold text-[#323232] dark:text-white tracking-tight">Zone Intervention History & Recovery Logs</h3>
          </div>
          <div className="space-y-2">
            {zoneInterventions.map(int => (
              <div
                key={int.id}
                className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-5 text-xs space-y-1.5 shadow-clean"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#323232] dark:text-white text-sm">{int.type}</span>
                  <span className="text-[#777777] dark:text-[#AAAAAA] font-mono">{int.timestamp}</span>
                </div>
                <p className="text-[#555555] dark:text-[#CCCCCC] leading-relaxed">{int.reason}</p>
                <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-[#777777] dark:text-[#AAAAAA] font-mono">
                  <span>Pre: <strong className="text-[#323232] dark:text-white">{int.preInterventionMetric}</strong></span>
                  {int.postInterventionMetric && (
                    <span>Post: <strong className="text-[#2F4F2F] dark:text-[#52B788]">{int.postInterventionMetric}</strong></span>
                  )}
                  {int.responseVerificationDelta && (
                    <span className="text-[#2F4F2F] dark:text-[#52B788] font-bold">{int.responseVerificationDelta}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intervention Modal */}
      <InterventionModal
        isOpen={isInterventionOpen}
        onClose={() => setIsInterventionOpen(false)}
        zone={zone}
      />
    </div>
  );
};
