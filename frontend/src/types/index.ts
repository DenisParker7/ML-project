export type StressType = 'Healthy' | 'Water Stress' | 'Heat Stress' | 'Nutrient Deficiency' | 'Early Disease Onset';

export type StressSeverity = 'Normal' | 'Mild' | 'Moderate' | 'Critical';

export type SensorType = 'soilMoisture' | 'canopyTemperature' | 'humidity' | 'lightIntensity';

export interface SensorReading {
  timestamp: string;
  soilMoisture: number; // percentage 0-100%
  canopyTemperature: number; // Celsius 15-45°C
  ambientTemperature: number; // Celsius
  humidity: number; // percentage 20-95%
  lightIntensity: number; // lux 0-90000 or PAR µmol/m²/s
  vaporPressureDeficit: number; // kPa
}

export interface CounterfactualReading {
  timestamp: string;
  actualMoisture: number;
  healthyBaselineMoisture: number;
  residualMoisture: number; // x - x^0
  actualTemperature: number;
  healthyBaselineTemperature: number;
  residualTemperature: number;
  actualHumidity: number;
  healthyBaselineHumidity: number;
  residualHumidity: number;
}

export interface Zone {
  id: string; // e.g. "zone-1"
  name: string; // "Zone 1 - North Canopy"
  cropType: string; // "Tomato (Solanum lycopersicum)"
  cropStage: 'Vegetative' | 'Flowering' | 'Fruit Set' | 'Ripening';
  areaM2: number;
  status: StressSeverity;
  currentStress: StressType;
  stressProbability: number; // 0.0 - 1.0
  uncertaintyScore: number; // 0.0 - 1.0 (entropy / variance)
  reliabilityScore: number; // 0.0 - 1.0 (q_i,t data quality)
  lastUpdated: string;
  currentReadings: SensorReading;
  targetRanges: {
    soilMoisture: [number, number]; // [min, max]
    canopyTemperature: [number, number];
    humidity: [number, number];
    lightIntensity: [number, number];
  };
  connectedZones: string[]; // neighbor zone ids
  actuatorStatus: {
    irrigationValves: 'Open' | 'Closed' | 'Pulsing';
    mistingFoggers: 'Active' | 'Idle';
    shadeCurtain: 'Deployed (60%)' | 'Retracted';
    ventilationFans: 'High' | 'Medium' | 'Low' | 'Off';
  };
}

export interface GraphEdge {
  source: string;
  target: string;
  physicalAdjacency: number; // a_ij (0.0 to 1.0)
  behavioralSimilarity: number; // s_ij,t (0.0 to 1.0)
  combinedWeight: number; // w_ij = alpha * a_ij + (1 - alpha) * s_ij
}

export interface StressPrediction {
  zoneId: string;
  zoneName: string;
  timestamp: string;
  predictedStress: StressType;
  confidence: number; // 0-100%
  severity: StressSeverity;
  uncertainty: number; // 0-1
  brierScore: number;
  probabilities: {
    healthy: number;
    waterStress: number;
    heatStress: number;
    nutrientDeficiency: number;
    earlyDiseaseOnset: number;
  };
  residualVector: {
    moistureResidual: number;
    temperatureResidual: number;
    humidityResidual: number;
    lightResidual: number;
  };
  suggestedAction: string;
  actionConfidence: number;
}

export interface Intervention {
  id: string;
  zoneId: string;
  zoneName: string;
  timestamp: string;
  type: 'Irrigation Pulse' | 'Shade Deployment' | 'Ventilation Boost' | 'Nutrient Dosing' | 'Misting Fog';
  status: 'Pending Confirmation' | 'Executing' | 'Verified Effective' | 'Ineffective / Recalibrating' | 'Dismissed';
  parameters: {
    durationMinutes: number;
    volumeLiters?: number;
    intensityPercent?: number;
  };
  reason: string;
  preInterventionMetric: string;
  postInterventionMetric?: string;
  responseVerificationDelta?: string;
  verifiedAt?: string;
}

export interface SensorHealthRecord {
  id: string;
  zoneId: string;
  sensorType: SensorType;
  sensorLabel: string;
  status: 'Optimal' | 'Drift Detected' | 'Missing Data' | 'Spike Anomaly' | 'Calibration Due';
  reliabilityIndex: number; // 0-100%
  packetLossRate: number; // %
  lastCalibrated: string;
  imputationActive: boolean;
}

export interface AlertNotification {
  id: string;
  zoneId: string;
  zoneName: string;
  timestamp: string;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  stressType: StressType;
  resolved: boolean;
}

export type TimeRange = '1h' | '24h' | '7d' | '30d';
