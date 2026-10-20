import React, { useState } from 'react';
import { useGreenhouse } from '../context/GreenhouseContext';
import { CrossZoneGraphView } from '../components/charts/CrossZoneGraphView';
import { Badge } from '../components/common/Badge';
import { InterventionModal } from '../components/interventions/InterventionModal';
import {
  BrainCircuit,
  Info,
  ArrowRight,
} from 'lucide-react';
import type { Zone, StressPrediction } from '../types';

export const StressIntelligencePage: React.FC = () => {
  const { zones, predictions } = useGreenhouse();
  const [selectedPrediction, setSelectedPrediction] = useState<StressPrediction | null>(
    predictions[0] || null
  );
  const [interventionZone, setInterventionZone] = useState<Zone | null>(null);

  return (
    <div className="space-y-8 pb-14 bg-white dark:bg-[#121212] transition-colors">
      {/* Algorithm Header */}
      <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-6 shadow-clean">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#323232] dark:bg-white px-3 py-1 text-xs font-mono font-bold text-white dark:text-[#121212]">
                ML Architecture
              </span>
              <span className="text-xs text-[#777777] dark:text-[#AAAAAA] font-mono">Temporal GNN + Counterfactual Residual</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-serif font-bold text-[#323232] dark:text-white tracking-tight">
              C3SI Stress Intelligence Module
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#555555] dark:text-[#AAAAAA] max-w-2xl leading-relaxed">
              Counterfactual Cross-Zone Stress Intelligence with dynamic graph adjacency $w_{'{ij,t}'} = \alpha a_{'{ij}'} + (1-\alpha) s_{'{ij,t}'}$ and context-conditioned healthy trajectory modeling.
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#2D2D2D] bg-[#F8F8F8] dark:bg-[#252525] p-4 text-xs space-y-1 font-mono">
            <div className="text-[#777777] dark:text-[#999999] font-semibold">Inference Formulation:</div>
            <div className="text-[#323232] dark:text-white font-bold text-[11px]">
              p_{'{i,t}'} = Softmax(g_φ[ h_{'{i,t}'}, r_{'{i,t}'}, q_{'{i,t}'} ])
            </div>
            <div className="text-[10px] text-[#888888] dark:text-[#777777]">
              h: graph state • r: deviation residual • q: data quality
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Graph Visualizer */}
      <CrossZoneGraphView />

      {/* Stress Classification Output & Probability Distribution */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-serif font-bold text-[#323232] dark:text-white flex items-center gap-2 tracking-tight">
            <BrainCircuit className="w-5 h-5 text-[#323232] dark:text-white" />
            Active Stress Predictions & Softmax Probabilities
          </h3>
          <p className="text-xs text-[#777777] dark:text-[#999999]">
            Evaluated across 5 stress classes: Healthy, Water Stress, Heat Stress, Nutrient Deficiency, Early Disease Onset.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions.map(pred => {
            const isSelected = selectedPrediction?.zoneId === pred.zoneId;
            const targetZone = zones.find(z => z.id === pred.zoneId);

            return (
              <div
                key={pred.zoneId}
                onClick={() => setSelectedPrediction(pred)}
                className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
                  isSelected
                    ? 'border-[#323232] dark:border-white bg-white dark:bg-[#1A1A1A] shadow-luxury ring-1 ring-[#323232] dark:ring-white'
                    : 'border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] hover:border-[#CCCCCC] dark:hover:border-[#444444]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#323232] dark:text-white">{pred.zoneName}</h4>
                    <span className="text-[11px] text-[#777777] dark:text-[#AAAAAA] font-mono">Evaluated at {pred.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge label={pred.predictedStress} variant="stress" size="sm" />
                    <Badge label={pred.severity} variant="severity" size="sm" />
                  </div>
                </div>

                {/* Softmax Probability Bars */}
                <div className="mt-4 space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-[#323232] dark:text-white font-bold">Water Stress</span>
                      <span className="text-[#323232] dark:text-white font-bold">{(pred.probabilities.waterStress * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#F0F0F0] dark:bg-[#282828] border border-[#E5E5E5] dark:border-[#333333] overflow-hidden">
                      <div
                        className="h-full bg-[#323232] dark:bg-white rounded-full"
                        style={{ width: `${pred.probabilities.waterStress * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-[#555555] dark:text-[#CCCCCC] font-bold">Heat Stress</span>
                      <span className="text-[#323232] dark:text-white font-bold">{(pred.probabilities.heatStress * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#F0F0F0] dark:bg-[#282828] border border-[#E5E5E5] dark:border-[#333333] overflow-hidden">
                      <div
                        className="h-full bg-[#555555] dark:bg-[#999999] rounded-full"
                        style={{ width: `${pred.probabilities.heatStress * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-[#777777] dark:text-[#AAAAAA] font-bold">Nutrient Deficiency</span>
                      <span className="text-[#323232] dark:text-white font-bold">{(pred.probabilities.nutrientDeficiency * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#F0F0F0] dark:bg-[#282828] border border-[#E5E5E5] dark:border-[#333333] overflow-hidden">
                      <div
                        className="h-full bg-[#888888] dark:bg-[#666666] rounded-full"
                        style={{ width: `${pred.probabilities.nutrientDeficiency * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-[#8A3324] dark:text-[#FFAAA6] font-bold">Early Disease Onset</span>
                      <span className="text-[#323232] dark:text-white font-bold">{(pred.probabilities.earlyDiseaseOnset * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#F0F0F0] dark:bg-[#282828] border border-[#E5E5E5] dark:border-[#333333] overflow-hidden">
                      <div
                        className="h-full bg-[#8A3324] dark:bg-[#E07A5F] rounded-full"
                        style={{ width: `${pred.probabilities.earlyDiseaseOnset * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Residual Vector & Suggested Action */}
                <div className="mt-4 rounded-xl bg-[#F8F8F8] dark:bg-[#222222] border border-[#EAEAEA] dark:border-[#2D2D2D] p-3.5 text-xs space-y-2 font-mono">
                  <div className="flex items-center justify-between text-[11px] text-[#777777] dark:text-[#AAAAAA]">
                    <span>Residual Vector ($r$):</span>
                    <span className="text-[#323232] dark:text-white font-bold">
                      ΔM: {pred.residualVector.moistureResidual}% • ΔT: {pred.residualVector.temperatureResidual}°C
                    </span>
                  </div>
                  <p className="text-[11px] text-[#323232] dark:text-white font-sans font-medium">
                    Suggested Action: {pred.suggestedAction}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#F0F0F0] dark:border-[#262626] text-xs">
                  <div className="text-[#777777] dark:text-[#AAAAAA] font-mono text-[11px]">
                    Uncertainty: <strong className="text-[#323232] dark:text-white">{pred.uncertainty}</strong> • Brier: <strong className="text-[#323232] dark:text-white">{pred.brierScore}</strong>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (targetZone) setInterventionZone(targetZone);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#323232] dark:text-white hover:underline transition-colors"
                  >
                    Actuate Interventions <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Research Contribution Card */}
      <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-6 text-xs text-[#555555] dark:text-[#AAAAAA] space-y-2 shadow-clean">
        <h4 className="font-bold text-[#323232] dark:text-white text-sm flex items-center gap-2 tracking-tight">
          <Info className="w-4 h-4 text-[#323232] dark:text-white" />
          C3SI Research Novelty: Why Context-Conditioned Healthy Baselines Outperform Direct Classification
        </h4>
        <p className="leading-relaxed text-[#555555] dark:text-[#CCCCCC]">
          A common greenhouse monitoring approach feeds raw sensor values directly into a classifier. In contrast, C3SI estimates the expected readings for zone <span className="font-mono text-[#323232] dark:text-white font-bold">i</span> at time <span className="font-mono text-[#323232] dark:text-white font-bold">t</span> under a learned healthy reference model ($x̂⁰_{'{i,t}'}$). For example, a canopy temperature of 32°C may be normal during peak solar irradiation, but highly abnormal under low sunlight. Evaluating deviations ($r_{'{i,t}'} = x_{'{i,t}'} - x̂⁰_{'{i,t}'}$) provides earlier warnings and substantially fewer false alarms.
        </p>
      </div>

      {/* Intervention Modal */}
      {interventionZone && (
        <InterventionModal
          isOpen={!!interventionZone}
          onClose={() => setInterventionZone(null)}
          zone={interventionZone}
        />
      )}
    </div>
  );
};
