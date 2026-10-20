import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { Zone, Intervention } from '../../types';
import { useGreenhouse } from '../../context/GreenhouseContext';
import { ShieldCheck, Droplets, Sun, Wind, Beaker, CloudFog } from 'lucide-react';

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone: Zone;
}

export const InterventionModal: React.FC<InterventionModalProps> = ({
  isOpen,
  onClose,
  zone,
}) => {
  const { executeIntervention } = useGreenhouse();
  const [selectedType, setSelectedType] = useState<Intervention['type']>(
    zone.currentStress === 'Water Stress'
      ? 'Irrigation Pulse'
      : zone.currentStress === 'Heat Stress'
      ? 'Shade Deployment'
      : zone.currentStress === 'Early Disease Onset'
      ? 'Ventilation Boost'
      : 'Irrigation Pulse'
  );
  const [duration, setDuration] = useState<number>(15);
  const [volume, setVolume] = useState<number>(180);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleExecute = async () => {
    setIsSubmitting(true);
    await executeIntervention(zone.id, selectedType, duration, volume);
    setIsSubmitting(false);
    onClose();
  };

  const actionOptions: { type: Intervention['type']; icon: React.ReactNode; label: string }[] = [
    {
      type: 'Irrigation Pulse',
      icon: <Droplets className="w-4 h-4" />,
      label: 'Drip Pulse',
    },
    {
      type: 'Shade Deployment',
      icon: <Sun className="w-4 h-4" />,
      label: 'Thermal Shade',
    },
    {
      type: 'Ventilation Boost',
      icon: <Wind className="w-4 h-4" />,
      label: 'Vent Boost',
    },
    {
      type: 'Misting Fog',
      icon: <CloudFog className="w-4 h-4" />,
      label: 'Misting Fog',
    },
    {
      type: 'Nutrient Dosing',
      icon: <Beaker className="w-4 h-4" />,
      label: 'Fertigation',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Trigger Precision Intervention"
      subtitle={`Configure and dispatch action for ${zone.name}`}
      maxWidth="lg"
    >
      <div className="space-y-4 text-[#323232] dark:text-[#EAEAEA]">
        {/* Compact Single-Row Zone Status Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#F8F8F8] dark:bg-[#222222] border border-[#E5E5E5] dark:border-[#333333] px-3.5 py-2.5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#323232] dark:text-white font-sans">{zone.name.split(' - ')[0]}</span>
            <span className="rounded-full bg-[#E5E5E5] dark:bg-[#333333] px-2 py-0.5 text-[11px] font-bold text-[#323232] dark:text-white">
              {zone.currentStress}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#555555] dark:text-[#AAAAAA]">
            <span>Moisture: <strong className="text-[#323232] dark:text-white">{zone.currentReadings.soilMoisture}%</strong></span>
            <span>Canopy: <strong className="text-[#323232] dark:text-white">{zone.currentReadings.canopyTemperature}°C</strong></span>
            <span>Conf: <strong className="text-[#323232] dark:text-white">{Math.round(zone.stressProbability * 100)}%</strong></span>
          </div>
        </div>

        {/* Action Protocol Selection (Compact 5-chip grid) */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#707070] dark:text-[#999999] mb-2">
            Action Protocol:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {actionOptions.map(option => {
              const isSelected = selectedType === option.type;
              return (
                <button
                  type="button"
                  key={option.type}
                  onClick={() => setSelectedType(option.type)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center ${
                    isSelected
                      ? 'bg-[#323232] dark:bg-white text-white dark:text-[#121212] border-[#323232] dark:border-white shadow-sm font-semibold'
                      : 'bg-white dark:bg-[#222222] text-[#555555] dark:text-[#CCCCCC] border-[#E5E5E5] dark:border-[#333333] hover:border-[#999999] dark:hover:border-[#666666]'
                  }`}
                >
                  <span className={isSelected ? 'text-white dark:text-[#121212]' : 'text-[#323232] dark:text-[#E0E0E0]'}>
                    {option.icon}
                  </span>
                  <span className="text-[11px] mt-1 tracking-tight truncate w-full">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Sliders & Constraints in 2 columns */}
        <div className="rounded-xl border border-[#E5E5E5] dark:border-[#333333] bg-[#F8F8F8] dark:bg-[#222222] p-3.5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs text-[#555555] dark:text-[#AAAAAA] font-mono mb-1">
                <span>Duration:</span>
                <span className="font-bold text-[#323232] dark:text-white">{duration} mins</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value))}
                className="w-full accent-[#323232] dark:accent-white cursor-pointer h-1.5 bg-[#E0E0E0] dark:bg-[#3D3D3D] rounded-lg"
              />
            </div>
            {selectedType === 'Irrigation Pulse' ? (
              <div>
                <div className="flex justify-between text-xs text-[#555555] dark:text-[#AAAAAA] font-mono mb-1">
                  <span>Water Volume:</span>
                  <span className="font-bold text-[#323232] dark:text-white">{volume} Liters</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="25"
                  value={volume}
                  onChange={e => setVolume(parseInt(e.target.value))}
                  className="w-full accent-[#323232] dark:accent-white cursor-pointer h-1.5 bg-[#E0E0E0] dark:bg-[#3D3D3D] rounded-lg"
                />
              </div>
            ) : (
              <div className="text-xs text-[#707070] dark:text-[#AAAAAA] flex flex-col justify-center">
                <span className="font-semibold text-[#323232] dark:text-white">Actuator Rate:</span>
                <span className="text-[11px] mt-0.5">Automated closed-loop cycle</span>
              </div>
            )}
          </div>
        </div>

        {/* 1-Line Compact Feedback notice */}
        <div className="flex items-center gap-2 rounded-xl bg-[#F4F4F4] dark:bg-[#252525] border border-[#E5E5E5] dark:border-[#333333] px-3 py-2 text-[11px] text-[#555555] dark:text-[#AAAAAA]">
          <ShieldCheck className="w-4 h-4 text-[#323232] dark:text-white shrink-0" />
          <span>
            <strong className="text-[#323232] dark:text-white">Closed-Loop Verification:</strong> Measures sensor recovery against baseline trajectory following actuation.
          </span>
        </div>

        {/* Footer actions - always visible without scrolling */}
        <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-[#EAEAEA] dark:border-[#2D2D2D]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#E0E0E0] dark:border-[#3A3A3A] bg-white dark:bg-[#252525] px-5 py-2 text-xs font-semibold text-[#555555] dark:text-[#CCCCCC] hover:bg-[#F2F2F2] dark:hover:bg-[#333333] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleExecute}
            className="rounded-full bg-[#323232] dark:bg-white px-6 py-2.5 text-xs font-bold text-white dark:text-[#121212] shadow-pill hover:bg-[#1a1a1a] dark:hover:bg-[#EAEAEA] disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSubmitting ? 'Transmitting...' : 'Confirm & Execute'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
