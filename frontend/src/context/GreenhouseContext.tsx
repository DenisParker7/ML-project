import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Zone,
  StressPrediction,
  Intervention,
  SensorHealthRecord,
  AlertNotification,
  TimeRange,
  StressType,
} from '../types';
import { ApiService } from '../services/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface GreenhouseContextType {
  zones: Zone[];
  selectedZoneId: string;
  selectedZone: Zone | undefined;
  setSelectedZoneId: (id: string) => void;
  predictions: StressPrediction[];
  interventions: Intervention[];
  alerts: AlertNotification[];
  sensorHealth: SensorHealthRecord[];
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  graphAlpha: number; // weight between physical and behavioral graph
  setGraphAlpha: (alpha: number) => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  isLoading: boolean;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  dismissToast: (id: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  executeIntervention: (zoneId: string, type: Intervention['type'], durationMin: number, volume?: number) => Promise<void>;
  resolveAlert: (alertId: string) => void;
  recalibrateSensor: (sensorId: string) => void;
  refreshData: () => Promise<void>;
}

const GreenhouseContext = createContext<GreenhouseContextType | undefined>(undefined);

export const GreenhouseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('c3si_theme') as 'light' | 'dark' | null;
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('c3si_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-2');
  const [predictions, setPredictions] = useState<StressPrediction[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [sensorHealth, setSensorHealth] = useState<SensorHealthRecord[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [graphAlpha, setGraphAlpha] = useState<number>(0.5); // alpha in w_ij = alpha * a_ij + (1 - alpha) * s_ij
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [z, p, i, a, s] = await Promise.all([
        ApiService.getZones(),
        ApiService.getStressPredictions(),
        ApiService.getInterventions(),
        ApiService.getAlerts(),
        ApiService.getSensorHealth(),
      ]);
      setZones(z);
      setPredictions(p);
      setInterventions(i);
      setAlerts(a);
      setSensorHealth(s);
    } catch (e) {
      console.error(e);
      addToast('error', 'Sync Failed', 'Failed to update greenhouse telemetry');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Live simulation tick: minor sensor fluctuations and gradual intervention effect
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setZones(prev =>
        prev.map(zone => {
          // slight jitter
          const tempDelta = (Math.random() - 0.5) * 0.15;
          const moistDelta = (Math.random() - 0.5) * 0.1;
          const newTemp = Math.max(16, Math.min(42, zone.currentReadings.canopyTemperature + tempDelta));
          const newMoist = Math.max(15, Math.min(65, zone.currentReadings.soilMoisture + moistDelta));

          return {
            ...zone,
            currentReadings: {
              ...zone.currentReadings,
              canopyTemperature: Number(newTemp.toFixed(1)),
              soilMoisture: Number(newMoist.toFixed(1)),
            },
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const executeIntervention = async (
    zoneId: string,
    type: Intervention['type'],
    durationMin: number,
    volume?: number
  ) => {
    const targetZone = zones.find(z => z.id === zoneId);
    if (!targetZone) return;

    addToast('info', 'Actuation Sent', `Executing ${type} for ${targetZone.name}`);

    const newIntervention: Intervention = {
      id: `int-${Date.now().toString().slice(-4)}`,
      zoneId,
      zoneName: targetZone.name,
      timestamp: 'Just now',
      type,
      status: 'Executing',
      parameters: {
        durationMinutes: durationMin,
        volumeLiters: volume || 150,
      },
      reason: `Constrained selector triggered: ${targetZone.currentStress} relief protocol.`,
      preInterventionMetric: `Moisture: ${targetZone.currentReadings.soilMoisture}%, Canopy: ${targetZone.currentReadings.canopyTemperature}°C`,
    };

    setInterventions(prev => [newIntervention, ...prev]);

    // Simulate actuator state change
    setZones(prev =>
      prev.map(z => {
        if (z.id !== zoneId) return z;
        return {
          ...z,
          actuatorStatus: {
            ...z.actuatorStatus,
            irrigationValves: type === 'Irrigation Pulse' ? 'Pulsing' : z.actuatorStatus.irrigationValves,
            shadeCurtain: type === 'Shade Deployment' ? 'Deployed (60%)' : z.actuatorStatus.shadeCurtain,
            ventilationFans: type === 'Ventilation Boost' ? 'High' : z.actuatorStatus.ventilationFans,
            mistingFoggers: type === 'Misting Fog' ? 'Active' : z.actuatorStatus.mistingFoggers,
          },
        };
      })
    );

    // Simulate closed-loop response verification after 4 seconds
    setTimeout(() => {
      setZones(prev =>
        prev.map(z => {
          if (z.id !== zoneId) return z;
          const improvedMoisture = type === 'Irrigation Pulse' ? Math.min(42, z.currentReadings.soilMoisture + 11.5) : z.currentReadings.soilMoisture;
          const improvedTemp = type === 'Shade Deployment' || type === 'Ventilation Boost' ? Math.max(24, z.currentReadings.canopyTemperature - 3.2) : z.currentReadings.canopyTemperature;
          const isResolved = type === 'Irrigation Pulse' && z.currentStress === 'Water Stress';

          return {
            ...z,
            status: isResolved ? 'Normal' : z.status,
            currentStress: isResolved ? 'Healthy' : z.currentStress,
            stressProbability: isResolved ? 0.12 : z.stressProbability * 0.6,
            currentReadings: {
              ...z.currentReadings,
              soilMoisture: Number(improvedMoisture.toFixed(1)),
              canopyTemperature: Number(improvedTemp.toFixed(1)),
            },
            actuatorStatus: {
              ...z.actuatorStatus,
              irrigationValves: 'Closed',
              mistingFoggers: 'Idle',
              ventilationFans: 'Medium',
            },
          };
        })
      );

      setInterventions(prev =>
        prev.map(int => {
          if (int.id !== newIntervention.id) return int;
          return {
            ...int,
            status: 'Verified Effective',
            postInterventionMetric: 'Moisture: 34.3%, Canopy: 25.1°C',
            responseVerificationDelta: 'Residual deviation recovered +11.5% towards healthy baseline',
            verifiedAt: 'Just now',
          };
        })
      );

      addToast('success', 'Intervention Verified', `${type} verified: ${targetZone.name} sensor trajectory restored.`);
    }, 4500);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    addToast('success', 'Alert Resolved', 'Alert acknowledged and removed from active list.');
  };

  const recalibrateSensor = (sensorId: string) => {
    setSensorHealth(prev =>
      prev.map(sh => {
        if (sh.id !== sensorId) return sh;
        return {
          ...sh,
          status: 'Optimal',
          reliabilityIndex: 99.8,
          packetLossRate: 0.0,
          imputationActive: false,
          lastCalibrated: new Date().toISOString().slice(0, 10),
        };
      })
    );
    addToast('success', 'Recalibration Complete', 'Sensor zero-point offset reset and noise filter recalibrated.');
  };

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  return (
    <GreenhouseContext.Provider
      value={{
        zones,
        selectedZoneId,
        selectedZone,
        setSelectedZoneId,
        predictions,
        interventions,
        alerts,
        sensorHealth,
        timeRange,
        setTimeRange,
        graphAlpha,
        setGraphAlpha,
        isSimulating,
        setIsSimulating,
        isLoading,
        toasts,
        addToast,
        dismissToast,
        theme,
        toggleTheme,
        executeIntervention,
        resolveAlert,
        recalibrateSensor,
        refreshData,
      }}
    >
      {children}
    </GreenhouseContext.Provider>
  );
};

export const useGreenhouse = () => {
  const context = useContext(GreenhouseContext);
  if (!context) {
    throw new Error('useGreenhouse must be used within a GreenhouseProvider');
  }
  return context;
};
