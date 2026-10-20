import React, { useState } from 'react';
import { useGreenhouse } from '../context/GreenhouseContext';
import { ApiService } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { SensorCard } from '../components/common/SensorCard';
import { Badge } from '../components/common/Badge';
import { SensorTrendChart } from '../components/charts/SensorTrendChart';
import { InterventionModal } from '../components/interventions/InterventionModal';
import { InterventionHistoryTable } from '../components/interventions/InterventionHistoryTable';
import {
  Grid,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Layers,
} from 'lucide-react';
import type { Zone } from '../types';

export const DashboardOverview: React.FC<{ onNavigateToZone: (zoneId: string) => void }> = ({
  onNavigateToZone,
}) => {
  const {
    zones,
    selectedZone,
    selectedZoneId,
    setSelectedZoneId,
    timeRange,
    setTimeRange,
    interventions,
  } = useGreenhouse();

  const [interventionTargetZone, setInterventionTargetZone] = useState<Zone | null>(null);

  const timeSeriesData = ApiService.generateTimeSeries(selectedZoneId, timeRange);

  const totalZones = zones.length;
  const stressedZones = zones.filter(z => z.status !== 'Normal');
  const avgConfidence = Math.round(
    (zones.reduce((acc, z) => acc + (z.status !== 'Normal' ? z.stressProbability : 1 - z.stressProbability), 0) /
      (zones.length || 1)) *
      100
  );

  return (
    <div className="space-y-8 pb-14 bg-white dark:bg-[#121212] transition-colors">
      {/* Hero Editorial Banner */}
      <div className="pt-2 pb-4">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#777777] dark:text-[#999999] mb-3">
          Microclimate Precision Management
        </p>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#323232] dark:text-white leading-[1.12]">
              Protecting crops with intelligent, closed-loop interventions.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#666666] dark:text-[#AAAAAA] max-w-2xl leading-relaxed">
              Counterfactual cross-zone stress intelligence with dynamic graph adjacency and feedback-verified microclimate actuation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Pill Action Button */}
            <button
              onClick={() => setInterventionTargetZone(selectedZone || zones[0])}
              className="rounded-full bg-[#323232] dark:bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white dark:text-[#121212] shadow-pill hover:bg-[#111111] dark:hover:bg-[#EAEAEA] transition-all active:scale-95 flex items-center gap-2.5"
            >
              <Zap className="w-4 h-4" />
              Trigger Intervention
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Zones"
          value={`${totalZones} Active`}
          subtitle="Bays A, B, & C Cultivation"
          icon={<Grid className="w-5 h-5 text-[#323232] dark:text-white" />}
          trend={{ value: '100% telemetry online', isPositive: true }}
        />
        <StatCard
          title="Stressed Zones"
          value={`${stressedZones.length} / ${totalZones}`}
          subtitle={`${zones.filter(z => z.status === 'Critical').length} Critical, ${zones.filter(z => z.status === 'Moderate').length} Moderate`}
          icon={<AlertCircle className="w-5 h-5 text-[#323232] dark:text-white" />}
          trend={{ value: 'Zone 2 Water Stress detected', isPositive: false }}
        />
        <StatCard
          title="Inference Confidence"
          value={`${avgConfidence}%`}
          subtitle="Residual-aware GNN classifier"
          icon={<TrendingUp className="w-5 h-5 text-[#323232] dark:text-white" />}
          trend={{ value: 'Brier score 0.082', isPositive: true }}
        />
        <StatCard
          title="Response Verification"
          value="Closed-Loop"
          subtitle="Continuous post-actuation check"
          icon={<ShieldCheck className="w-5 h-5 text-[#323232] dark:text-white" />}
          trend={{ value: '3/3 Interventions Verified', isPositive: true }}
        />
      </div>

      {/* Greenhouse Zone Spatial Status Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#323232] dark:text-white" />
            <h3 className="text-lg font-serif font-bold text-[#323232] dark:text-white tracking-tight">Cultivation Bay Status Matrix</h3>
          </div>
          <span className="text-xs text-[#777777] dark:text-[#999999] font-mono">Select a bay to view deep telemetry & controls</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map(zone => {
            const isSelected = zone.id === selectedZoneId;
            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                className={`relative cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
                  isSelected
                    ? 'border-[#323232] dark:border-white bg-white dark:bg-[#1A1A1A] shadow-luxury ring-1 ring-[#323232] dark:ring-white'
                    : 'border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] hover:border-[#CCCCCC] dark:hover:border-[#444444] hover:shadow-clean'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#323232] dark:text-white">{zone.name}</h4>
                    <p className="text-xs text-[#777777] dark:text-[#999999]">{zone.cropType} • {zone.cropStage}</p>
                  </div>
                  <Badge label={zone.currentStress} variant="stress" size="sm" />
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="rounded-xl bg-[#F8F8F8] dark:bg-[#252525] p-2 border border-[#EAEAEA] dark:border-[#333333]">
                    <span className="text-[10px] text-[#777777] dark:text-[#AAAAAA] block">Moisture</span>
                    <span className="font-bold text-[#323232] dark:text-white">{zone.currentReadings.soilMoisture}%</span>
                  </div>
                  <div className="rounded-xl bg-[#F8F8F8] dark:bg-[#252525] p-2 border border-[#EAEAEA] dark:border-[#333333]">
                    <span className="text-[10px] text-[#777777] dark:text-[#AAAAAA] block">Canopy</span>
                    <span className="font-bold text-[#323232] dark:text-white">{zone.currentReadings.canopyTemperature}°C</span>
                  </div>
                  <div className="rounded-xl bg-[#F8F8F8] dark:bg-[#252525] p-2 border border-[#EAEAEA] dark:border-[#333333]">
                    <span className="text-[10px] text-[#777777] dark:text-[#AAAAAA] block">Humidity</span>
                    <span className="font-bold text-[#323232] dark:text-white">{zone.currentReadings.humidity}%</span>
                  </div>
                  <div className="rounded-xl bg-[#F8F8F8] dark:bg-[#252525] p-2 border border-[#EAEAEA] dark:border-[#333333]">
                    <span className="text-[10px] text-[#777777] dark:text-[#AAAAAA] block">Light</span>
                    <span className="font-bold text-[#323232] dark:text-white">{zone.currentReadings.lightIntensity}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#F0F0F0] dark:border-[#262626] pt-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#777777] dark:text-[#AAAAAA] font-mono">
                    <span>Stress Prob:</span>
                    <span className="font-bold text-[#323232] dark:text-white">
                      {Math.round(zone.stressProbability * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInterventionTargetZone(zone);
                      }}
                      className="rounded-full bg-[#323232] dark:bg-white px-3.5 py-1 text-[11px] font-semibold text-white dark:text-[#121212] hover:bg-[#111111] dark:hover:bg-[#EAEAEA] transition-colors"
                    >
                      Actuate
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToZone(zone.id);
                      }}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#555555] dark:text-[#CCCCCC] hover:text-[#111111] dark:hover:text-white"
                    >
                      Details <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Zone Deep-Dive Sensor Cards */}
      {selectedZone && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#323232] dark:text-white flex items-center gap-2">
                Live Sensor Monitoring: <span className="underline decoration-[#CCCCCC] dark:decoration-[#555555]">{selectedZone.name}</span>
              </h3>
              <p className="text-xs text-[#777777] dark:text-[#999999]">
                Four physical telemetry channels compared with context-normalized target baselines.
              </p>
            </div>
            <button
              onClick={() => onNavigateToZone(selectedZone.id)}
              className="text-xs font-semibold text-[#323232] dark:text-white hover:underline flex items-center gap-1 font-mono"
            >
              Full Zone Analytics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SensorCard
              type="soilMoisture"
              value={selectedZone.currentReadings.soilMoisture}
              unit="%"
              targetRange={selectedZone.targetRanges.soilMoisture}
              residual={
                selectedZone.id === 'zone-2' ? -15.4 : selectedZone.id === 'zone-4' ? -1.2 : 0.4
              }
            />
            <SensorCard
              type="canopyTemperature"
              value={selectedZone.currentReadings.canopyTemperature}
              unit="°C"
              targetRange={selectedZone.targetRanges.canopyTemperature}
              ambientValue={selectedZone.currentReadings.ambientTemperature}
              residual={
                selectedZone.id === 'zone-2' ? 4.8 : selectedZone.id === 'zone-5' ? 6.2 : -0.3
              }
            />
            <SensorCard
              type="humidity"
              value={selectedZone.currentReadings.humidity}
              unit="%"
              targetRange={selectedZone.targetRanges.humidity}
              vpd={selectedZone.currentReadings.vaporPressureDeficit}
              residual={
                selectedZone.id === 'zone-2' ? -14.2 : selectedZone.id === 'zone-6' ? 18.4 : 1.2
              }
            />
            <SensorCard
              type="lightIntensity"
              value={selectedZone.currentReadings.lightIntensity}
              unit="lux"
              targetRange={selectedZone.targetRanges.lightIntensity}
              residual={
                selectedZone.id === 'zone-5' ? 180 : selectedZone.id === 'zone-6' ? -45 : 15
              }
            />
          </div>
        </div>
      )}

      {/* Main Sensor Dynamics vs Counterfactual Chart */}
      <SensorTrendChart
        data={timeSeriesData}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        zoneName={selectedZone?.name || 'Zone 1'}
      />

      {/* Recent Feedback-Verified Interventions Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#323232] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#323232] dark:text-white" />
              Recent Closed-Loop Interventions & Verification
            </h3>
            <p className="text-xs text-[#777777] dark:text-[#999999]">
              Measures whether physical actuations moved zone trajectories toward the expected healthy baseline.
            </p>
          </div>
        </div>

        <InterventionHistoryTable interventions={interventions} />
      </div>

      {/* Intervention Dialog */}
      {interventionTargetZone && (
        <InterventionModal
          isOpen={!!interventionTargetZone}
          onClose={() => setInterventionTargetZone(null)}
          zone={interventionTargetZone}
        />
      )}
    </div>
  );
};
