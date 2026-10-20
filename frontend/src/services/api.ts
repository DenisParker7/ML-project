import {
  Zone,
  SensorReading,
  CounterfactualReading,
  StressPrediction,
  Intervention,
  SensorHealthRecord,
  AlertNotification,
  GraphEdge,
  TimeRange,
} from '../types';

const INITIAL_ZONES: Zone[] = [
  {
    id: 'zone-1',
    name: 'Zone 1 - North Canopy (A1)',
    cropType: 'Cherry Tomato (Campari)',
    cropStage: 'Fruit Set',
    areaM2: 240,
    status: 'Normal',
    currentStress: 'Healthy',
    stressProbability: 0.08,
    uncertaintyScore: 0.09,
    reliabilityScore: 0.98,
    lastUpdated: 'Just now',
    currentReadings: {
      timestamp: new Date().toISOString(),
      soilMoisture: 38.4,
      canopyTemperature: 23.2,
      ambientTemperature: 24.1,
      humidity: 68.5,
      lightIntensity: 620,
      vaporPressureDeficit: 0.95,
    },
    targetRanges: {
      soilMoisture: [35, 45],
      canopyTemperature: [21, 26],
      humidity: [60, 75],
      lightIntensity: [450, 800],
    },
    connectedZones: ['zone-2', 'zone-3'],
    actuatorStatus: {
      irrigationValves: 'Closed',
      mistingFoggers: 'Idle',
      shadeCurtain: 'Retracted',
      ventilationFans: 'Medium',
    },
  },
  {
    id: 'zone-2',
    name: 'Zone 2 - North-East Bench (A2)',
    cropType: 'Cherry Tomato (Campari)',
    cropStage: 'Fruit Set',
    areaM2: 240,
    status: 'Critical',
    currentStress: 'Water Stress',
    stressProbability: 0.91,
    uncertaintyScore: 0.12,
    reliabilityScore: 0.96,
    lastUpdated: '1 min ago',
    currentReadings: {
      timestamp: new Date().toISOString(),
      soilMoisture: 22.8,
      canopyTemperature: 29.4,
      ambientTemperature: 25.0,
      humidity: 51.2,
      lightIntensity: 710,
      vaporPressureDeficit: 1.82,
    },
    targetRanges: {
      soilMoisture: [35, 45],
      canopyTemperature: [21, 26],
      humidity: [60, 75],
      lightIntensity: [450, 800],
    },
    connectedZones: ['zone-1', 'zone-4'],
    actuatorStatus: {
      irrigationValves: 'Closed',
      mistingFoggers: 'Idle',
      shadeCurtain: 'Retracted',
      ventilationFans: 'High',
    },
  },
  {
    id: 'zone-3',
    name: 'Zone 3 - Central Corridor (B1)',
    cropType: 'Beefsteak Tomato',
    cropStage: 'Flowering',
    areaM2: 280,
    status: 'Normal',
    currentStress: 'Healthy',
    stressProbability: 0.05,
    uncertaintyScore: 0.06,
    reliabilityScore: 0.99,
    lastUpdated: '2 mins ago',
    currentReadings: {
      timestamp: new Date().toISOString(),
      soilMoisture: 41.2,
      canopyTemperature: 22.8,
      ambientTemperature: 23.5,
      humidity: 71.0,
      lightIntensity: 580,
      vaporPressureDeficit: 0.88,
    },
    targetRanges: {
      soilMoisture: [36, 48],
      canopyTemperature: [20, 25],
      humidity: [65, 80],
      lightIntensity: [400, 750],
    },
    connectedZones: ['zone-1', 'zone-4', 'zone-5'],
    actuatorStatus: {
      irrigationValves: 'Closed',
      mistingFoggers: 'Idle',
      shadeCurtain: 'Retracted',
      ventilationFans: 'Low',
    },
  },
  {
    id: 'zone-4',
    name: 'Zone 4 - Central East Bench (B2)',
    cropType: 'Beefsteak Tomato',
    cropStage: 'Flowering',
    areaM2: 280,
    status: 'Mild',
    currentStress: 'Nutrient Deficiency',
    stressProbability: 0.64,
    uncertaintyScore: 0.28,
    reliabilityScore: 0.92,
    lastUpdated: 'Just now',
    currentReadings: {
      timestamp: new Date().toISOString(),
      soilMoisture: 36.5,
      canopyTemperature: 24.1,
      ambientTemperature: 24.3,
      humidity: 64.2,
      lightIntensity: 640,
      vaporPressureDeficit: 1.15,
    },
    targetRanges: {
      soilMoisture: [36, 48],
      canopyTemperature: [20, 25],
      humidity: [65, 80],
      lightIntensity: [400, 750],
    },
    connectedZones: ['zone-2', 'zone-3', 'zone-6'],
    actuatorStatus: {
      irrigationValves: 'Closed',
      mistingFoggers: 'Idle',
      shadeCurtain: 'Retracted',
      ventilationFans: 'Low',
    },
  },
  {
    id: 'zone-5',
    name: 'Zone 5 - South Perimeter (C1)',
    cropType: 'Bell Pepper (California Wonder)',
    cropStage: 'Vegetative',
    areaM2: 220,
    status: 'Moderate',
    currentStress: 'Heat Stress',
    stressProbability: 0.79,
    uncertaintyScore: 0.18,
    reliabilityScore: 0.95,
    lastUpdated: '3 mins ago',
    currentReadings: {
      timestamp: new Date().toISOString(),
      soilMoisture: 34.0,
      canopyTemperature: 31.8,
      ambientTemperature: 30.2,
      humidity: 48.0,
      lightIntensity: 890,
      vaporPressureDeficit: 2.10,
    },
    targetRanges: {
      soilMoisture: [30, 42],
      canopyTemperature: [22, 27],
      humidity: [55, 75],
      lightIntensity: [400, 700],
    },
    connectedZones: ['zone-3', 'zone-6'],
    actuatorStatus: {
      irrigationValves: 'Closed',
      mistingFoggers: 'Active',
      shadeCurtain: 'Deployed (60%)',
      ventilationFans: 'High',
    },
  },
  {
    id: 'zone-6',
    name: 'Zone 6 - South-East Perimeter (C2)',
    cropType: 'Bell Pepper (California Wonder)',
    cropStage: 'Vegetative',
    areaM2: 220,
    status: 'Mild',
    currentStress: 'Early Disease Onset',
    stressProbability: 0.58,
    uncertaintyScore: 0.35,
    reliabilityScore: 0.88,
    lastUpdated: '4 mins ago',
    currentReadings: {
      timestamp: new Date().toISOString(),
      soilMoisture: 42.1,
      canopyTemperature: 25.6,
      ambientTemperature: 24.5,
      humidity: 86.4,
      lightIntensity: 510,
      vaporPressureDeficit: 0.55,
    },
    targetRanges: {
      soilMoisture: [30, 42],
      canopyTemperature: [22, 27],
      humidity: [55, 75],
      lightIntensity: [400, 700],
    },
    connectedZones: ['zone-4', 'zone-5'],
    actuatorStatus: {
      irrigationValves: 'Closed',
      mistingFoggers: 'Idle',
      shadeCurtain: 'Retracted',
      ventilationFans: 'Medium',
    },
  },
];

const INITIAL_INTERVENTIONS: Intervention[] = [
  {
    id: 'int-101',
    zoneId: 'zone-2',
    zoneName: 'Zone 2 - North-East Bench (A2)',
    timestamp: '15 mins ago',
    type: 'Irrigation Pulse',
    status: 'Pending Confirmation',
    parameters: { durationMinutes: 12, volumeLiters: 180 },
    reason: 'Negative soil moisture residual r_i,t = -15.4% and elevated canopy temp delta (+4.4Â°C) exceeding dynamic water-stress threshold.',
    preInterventionMetric: 'Moisture: 22.8%, Canopy: 29.4Â°C',
  },
  {
    id: 'int-100',
    zoneId: 'zone-5',
    zoneName: 'Zone 5 - South Perimeter (C1)',
    timestamp: '42 mins ago',
    type: 'Shade Deployment',
    status: 'Verified Effective',
    parameters: { durationMinutes: 60, intensityPercent: 60 },
    reason: 'Canopy temperature exceeded counterfactual healthy baseline by +5.2Â°C under direct solar radiation (890 lux).',
    preInterventionMetric: 'Canopy: 33.5Â°C, VPD: 2.3 kPa',
    postInterventionMetric: 'Canopy: 31.8Â°C, VPD: 2.1 kPa',
    responseVerificationDelta: '-1.7Â°C Canopy recovery toward expected trajectory',
    verifiedAt: '12 mins ago',
  },
  {
    id: 'int-099',
    zoneId: 'zone-1',
    zoneName: 'Zone 1 - North Canopy (A1)',
    timestamp: '3 hours ago',
    type: 'Ventilation Boost',
    status: 'Verified Effective',
    parameters: { durationMinutes: 30, intensityPercent: 75 },
    reason: 'Morning relative humidity spike above 82% causing condensation risk.',
    preInterventionMetric: 'Humidity: 84.1%',
    postInterventionMetric: 'Humidity: 68.5%',
    responseVerificationDelta: '-15.6% RH balanced to target',
    verifiedAt: '2.5 hours ago',
  },
];

const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'alt-1',
    zoneId: 'zone-2',
    zoneName: 'Zone 2 - North-East Bench (A2)',
    timestamp: '12 mins ago',
    severity: 'Critical',
    message: 'Severe Water Stress detected (Confidence: 91%, Residual r_i,t = -15.4%). Counterfactual baseline predicts rapid wilt.',
    stressType: 'Water Stress',
    resolved: false,
  },
  {
    id: 'alt-2',
    zoneId: 'zone-5',
    zoneName: 'Zone 5 - South Perimeter (C1)',
    timestamp: '38 mins ago',
    severity: 'Warning',
    message: 'Moderate Heat Stress detected (Confidence: 79%). Shading actuated; canopy recovery verification ongoing.',
    stressType: 'Heat Stress',
    resolved: false,
  },
  {
    id: 'alt-3',
    zoneId: 'zone-6',
    zoneName: 'Zone 6 - South-East Perimeter (C2)',
    timestamp: '1 hour ago',
    severity: 'Warning',
    message: 'Microclimate anomaly: High humidity (86.4%) and leaf dampness detected. Early fungal disease warning.',
    stressType: 'Early Disease Onset',
    resolved: false,
  },
];

const INITIAL_HEALTH_RECORDS: SensorHealthRecord[] = [
  {
    id: 'sh-1',
    zoneId: 'zone-1',
    sensorType: 'soilMoisture',
    sensorLabel: 'Capacitive Moisture Matrix (Z1-SM01)',
    status: 'Optimal',
    reliabilityIndex: 99.4,
    packetLossRate: 0.1,
    lastCalibrated: '2026-10-01',
    imputationActive: false,
  },
  {
    id: 'sh-2',
    zoneId: 'zone-1',
    sensorType: 'canopyTemperature',
    sensorLabel: 'Infrared Radiometer (Z1-IRT01)',
    status: 'Optimal',
    reliabilityIndex: 98.7,
    packetLossRate: 0.3,
    lastCalibrated: '2026-09-15',
    imputationActive: false,
  },
  {
    id: 'sh-3',
    zoneId: 'zone-2',
    sensorType: 'soilMoisture',
    sensorLabel: 'Capacitive Moisture Matrix (Z2-SM01)',
    status: 'Optimal',
    reliabilityIndex: 97.2,
    packetLossRate: 0.4,
    lastCalibrated: '2026-10-02',
    imputationActive: false,
  },
  {
    id: 'sh-4',
    zoneId: 'zone-4',
    sensorType: 'soilMoisture',
    sensorLabel: 'Capacitive Moisture Matrix (Z4-SM01)',
    status: 'Drift Detected',
    reliabilityIndex: 82.5,
    packetLossRate: 2.1,
    lastCalibrated: '2026-08-10',
    imputationActive: true,
  },
  {
    id: 'sh-5',
    zoneId: 'zone-6',
    sensorType: 'humidity',
    sensorLabel: 'Psychrometric Hygrometer (Z6-RH01)',
    status: 'Spike Anomaly',
    reliabilityIndex: 78.0,
    packetLossRate: 3.8,
    lastCalibrated: '2026-07-20',
    imputationActive: true,
  },
  {
    id: 'sh-6',
    zoneId: 'zone-3',
    sensorType: 'lightIntensity',
    sensorLabel: 'Quantum PAR Sensor (Z3-PAR01)',
    status: 'Optimal',
    reliabilityIndex: 99.1,
    packetLossRate: 0.0,
    lastCalibrated: '2026-10-05',
    imputationActive: false,
  },
];

export class ApiService {
  private static backendUrl = 'http://localhost:8000/api';
  private static useBackend = false;

  public static setUseBackend(enable: boolean, customUrl?: string) {
    this.useBackend = enable;
    if (customUrl) this.backendUrl = customUrl;
  }

  public static isBackendEnabled() {
    return this.useBackend;
  }

  public static getBackendUrl() {
    return this.backendUrl;
  }

  // Check health of Member 3's backend
  public static async testBackendConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const res = await fetch(`${this.backendUrl}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        return { connected: true, message: 'FastAPI Backend reachable and healthy.' };
      }
      return { connected: false, message: `Server returned status ${res.status}` };
    } catch (err: unknown) {
      return { connected: false, message: (err instanceof Error) ? err.message : 'Connection refused / offline' };
    }
  }

  public static async getZones(): Promise<Zone[]> {
    if (this.useBackend) {
      try {
        const res = await fetch(`${this.backendUrl}/zones`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend fetch failed, falling back to mock state', e);
      }
    }
    return Promise.resolve([...INITIAL_ZONES]);
  }

  public static async getZoneById(id: string): Promise<Zone | undefined> {
    const zones = await this.getZones();
    return zones.find(z => z.id === id);
  }

  public static generateTimeSeries(zoneId: string, range: TimeRange): CounterfactualReading[] {
    const pointsCount = range === '1h' ? 12 : range === '24h' ? 24 : range === '7d' ? 28 : 30;
    const data: CounterfactualReading[] = [];
    const now = new Date();

    const isStressedZone = zoneId === 'zone-2'; // water stress
    const isHeatZone = zoneId === 'zone-5'; // heat stress

    for (let i = pointsCount; i >= 0; i--) {
      const d = new Date(now.getTime() - i * (range === '1h' ? 5 * 60000 : range === '24h' ? 3600000 : 86400000 / 4));
      const timeStr = range === '1h'
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : range === '24h'
        ? d.toLocaleTimeString([], { hour: '2-digit' })
        : `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:00`;

      // Healthy baseline modeled smoothly
      const healthyMoisture = 39 + Math.sin(i / 3) * 2;
      const healthyTemp = 23.5 + Math.cos(i / 2) * 1.5;
      const healthyHum = 67 + Math.sin(i / 4) * 4;

      let actualMoisture = healthyMoisture + (Math.random() * 1.5 - 0.75);
      let actualTemp = healthyTemp + (Math.random() * 0.8 - 0.4);
      let actualHum = healthyHum + (Math.random() * 2 - 1);

      if (isStressedZone) {
        // progressively dropping moisture and rising temp in recent periods
        const severity = (pointsCount - i) / pointsCount;
        actualMoisture = Math.max(18, healthyMoisture - severity * 17);
        actualTemp = healthyTemp + severity * 6.5;
        actualHum = healthyHum - severity * 16;
      } else if (isHeatZone) {
        const severity = (pointsCount - i) / pointsCount;
        actualTemp = healthyTemp + severity * 8.0;
        actualHum = healthyHum - severity * 18;
      }

      data.push({
        timestamp: timeStr,
        actualMoisture: Number(actualMoisture.toFixed(1)),
        healthyBaselineMoisture: Number(healthyMoisture.toFixed(1)),
        residualMoisture: Number((actualMoisture - healthyMoisture).toFixed(2)),
        actualTemperature: Number(actualTemp.toFixed(1)),
        healthyBaselineTemperature: Number(healthyTemp.toFixed(1)),
        residualTemperature: Number((actualTemp - healthyTemp).toFixed(2)),
        actualHumidity: Number(actualHum.toFixed(1)),
        healthyBaselineHumidity: Number(healthyHum.toFixed(1)),
        residualHumidity: Number((actualHum - healthyHum).toFixed(2)),
      });
    }

    return data;
  }

  public static getDynamicGraph(): { nodes: { id: string; name: string; stress: string }[]; edges: GraphEdge[] } {
    const nodes = INITIAL_ZONES.map(z => ({
      id: z.id,
      name: z.name,
      stress: z.currentStress,
    }));

    // Learned edge weights w_ij = alpha * a_ij + (1 - alpha) * s_ij (alpha = 0.5)
    const edges: GraphEdge[] = [
      { source: 'zone-1', target: 'zone-2', physicalAdjacency: 1.0, behavioralSimilarity: 0.84, combinedWeight: 0.92 },
      { source: 'zone-1', target: 'zone-3', physicalAdjacency: 0.8, behavioralSimilarity: 0.91, combinedWeight: 0.85 },
      { source: 'zone-2', target: 'zone-4', physicalAdjacency: 0.8, behavioralSimilarity: 0.65, combinedWeight: 0.72 },
      { source: 'zone-3', target: 'zone-4', physicalAdjacency: 1.0, behavioralSimilarity: 0.89, combinedWeight: 0.94 },
      { source: 'zone-3', target: 'zone-5', physicalAdjacency: 0.7, behavioralSimilarity: 0.77, combinedWeight: 0.73 },
      { source: 'zone-4', target: 'zone-6', physicalAdjacency: 0.7, behavioralSimilarity: 0.70, combinedWeight: 0.70 },
      { source: 'zone-5', target: 'zone-6', physicalAdjacency: 1.0, behavioralSimilarity: 0.88, combinedWeight: 0.94 },
      { source: 'zone-2', target: 'zone-5', physicalAdjacency: 0.3, behavioralSimilarity: 0.42, combinedWeight: 0.36 },
    ];

    return { nodes, edges };
  }

  public static async getStressPredictions(): Promise<StressPrediction[]> {
    return [
      {
        zoneId: 'zone-2',
        zoneName: 'Zone 2 - North-East Bench (A2)',
        timestamp: new Date().toLocaleTimeString(),
        predictedStress: 'Water Stress',
        confidence: 91,
        severity: 'Critical',
        uncertainty: 0.12,
        brierScore: 0.082,
        probabilities: {
          healthy: 0.03,
          waterStress: 0.91,
          heatStress: 0.04,
          nutrientDeficiency: 0.01,
          earlyDiseaseOnset: 0.01,
        },
        residualVector: {
          moistureResidual: -15.4,
          temperatureResidual: 4.8,
          humidityResidual: -14.2,
          lightResidual: 35.0,
        },
        suggestedAction: 'Execute 12-min pulsed drip irrigation (180 L) + target humidity stabilization.',
        actionConfidence: 94,
      },
      {
        zoneId: 'zone-5',
        zoneName: 'Zone 5 - South Perimeter (C1)',
        timestamp: new Date().toLocaleTimeString(),
        predictedStress: 'Heat Stress',
        confidence: 79,
        severity: 'Moderate',
        uncertainty: 0.18,
        brierScore: 0.115,
        probabilities: {
          healthy: 0.08,
          waterStress: 0.07,
          heatStress: 0.79,
          nutrientDeficiency: 0.04,
          earlyDiseaseOnset: 0.02,
        },
        residualVector: {
          moistureResidual: -3.8,
          temperatureResidual: 6.2,
          humidityResidual: -19.5,
          lightResidual: 180.0,
        },
        suggestedAction: 'Extend thermal screen / shade cloth by 60% and cycle misting foggers for 8 mins.',
        actionConfidence: 86,
      },
      {
        zoneId: 'zone-4',
        zoneName: 'Zone 4 - Central East Bench (B2)',
        timestamp: new Date().toLocaleTimeString(),
        predictedStress: 'Nutrient Deficiency',
        confidence: 64,
        severity: 'Mild',
        uncertainty: 0.28,
        brierScore: 0.198,
        probabilities: {
          healthy: 0.20,
          waterStress: 0.06,
          heatStress: 0.03,
          nutrientDeficiency: 0.64,
          earlyDiseaseOnset: 0.07,
        },
        residualVector: {
          moistureResidual: -1.2,
          temperatureResidual: 0.8,
          humidityResidual: -2.1,
          lightResidual: 10.0,
        },
        suggestedAction: 'Sample electrical conductivity (EC) & schedule fertilizer injection dosage.',
        actionConfidence: 72,
      },
      {
        zoneId: 'zone-6',
        zoneName: 'Zone 6 - South-East Perimeter (C2)',
        timestamp: new Date().toLocaleTimeString(),
        predictedStress: 'Early Disease Onset',
        confidence: 58,
        severity: 'Mild',
        uncertainty: 0.35,
        brierScore: 0.220,
        probabilities: {
          healthy: 0.25,
          waterStress: 0.02,
          heatStress: 0.05,
          nutrientDeficiency: 0.10,
          earlyDiseaseOnset: 0.58,
        },
        residualVector: {
          moistureResidual: 3.5,
          temperatureResidual: 1.2,
          humidityResidual: 18.4,
          lightResidual: -45.0,
        },
        suggestedAction: 'Engage high-velocity air de-stratification fan to lower microclimate moisture condensation.',
        actionConfidence: 68,
      },
    ];
  }

  public static async getInterventions(): Promise<Intervention[]> {
    return Promise.resolve([...INITIAL_INTERVENTIONS]);
  }

  public static async getAlerts(): Promise<AlertNotification[]> {
    return Promise.resolve([...INITIAL_ALERTS]);
  }

  public static async getSensorHealth(): Promise<SensorHealthRecord[]> {
    return Promise.resolve([...INITIAL_HEALTH_RECORDS]);
  }

  public static exportToCSV(filename: string, rows: Record<string, unknown>[]) {
    if (!rows || !rows.length) return;
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        headers
          .map(header => {
            const val = row[header] ?? '';
            const escaped = (typeof val === 'object' ? JSON.stringify(val) : String(val)).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
