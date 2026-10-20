import React, { useState } from 'react';
import { ApiService } from '../services/api';
import { useGreenhouse } from '../context/GreenhouseContext';
import {
  Server,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Code2,
} from 'lucide-react';

export const BackendConfigPage: React.FC = () => {
  const { addToast, refreshData } = useGreenhouse();
  const [backendUrl, setBackendUrl] = useState<string>(ApiService.getBackendUrl());
  const [useBackend, setUseBackend] = useState<boolean>(ApiService.isBackendEnabled());
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ connected: boolean; message: string } | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    ApiService.setUseBackend(useBackend, backendUrl);
    const res = await ApiService.testBackendConnection();
    setTestResult(res);
    setTesting(false);
    if (res.connected) {
      addToast('success', 'Backend Connected', res.message);
    } else {
      addToast('warning', 'Backend Offline', 'Ensure FastAPI server is running on ' + backendUrl);
    }
  };

  const handleToggleBackend = (enabled: boolean) => {
    setUseBackend(enabled);
    ApiService.setUseBackend(enabled, backendUrl);
    refreshData();
    addToast(
      'info',
      enabled ? 'Live Backend Enabled' : 'Mock Simulation Enabled',
      enabled
        ? `Connecting to FastAPI at ${backendUrl}`
        : 'Running on high-fidelity client simulation engine.'
    );
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/zones',
      desc: 'Returns array of monitored greenhouse zones with current telemetry and actuator states.',
      sampleResponse: `[
  {
    "id": "zone-1",
    "name": "Zone 1 - North Canopy (A1)",
    "currentStress": "Healthy",
    "currentReadings": {
      "soilMoisture": 38.4,
      "canopyTemperature": 23.2,
      "humidity": 68.5,
      "lightIntensity": 620
    }
  }
]`,
    },
    {
      method: 'GET',
      path: '/api/predictions',
      desc: 'Returns C3SI stress inference with confidence, Brier score, and residual vectors.',
      sampleResponse: `[
  {
    "zoneId": "zone-2",
    "predictedStress": "Water Stress",
    "confidence": 91,
    "probabilities": { "waterStress": 0.91, "healthy": 0.03 },
    "residualVector": { "moistureResidual": -15.4, "temperatureResidual": 4.8 }
  }
]`,
    },
    {
      method: 'POST',
      path: '/api/interventions',
      desc: 'Triggers physical actuation protocol with closed-loop feedback verification.',
      sampleResponse: `{
  "interventionId": "int-102",
  "status": "Executing",
  "scheduledVerification": "in 10 minutes"
}`,
    },
    {
      method: 'GET',
      path: '/api/sensors/health',
      desc: 'Returns data quality score q_i,t, packet loss rate, and sensor drift flags.',
      sampleResponse: `[
  {
    "id": "sh-1",
    "zoneId": "zone-1",
    "status": "Optimal",
    "reliabilityIndex": 99.4
  }
]`,
    },
  ];

  return (
    <div className="space-y-8 pb-14 bg-white dark:bg-[#121212] transition-colors">
      {/* Header */}
      <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-6 shadow-clean">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#F5F5F5] dark:bg-[#282828] px-3 py-0.5 text-xs font-mono font-bold text-[#323232] dark:text-white border border-[#E5E5E5] dark:border-[#333333]">
                Member 2 ↔ Member 3 Integration
              </span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-serif font-bold text-[#323232] dark:text-white tracking-tight">
              Backend API & System Configuration
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#555555] dark:text-[#AAAAAA]">
              Seamlessly switch between standalone simulation mode and Member 3's live FastAPI backend.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-mono font-bold bg-[#F5F5F5] dark:bg-[#252525] text-[#323232] dark:text-white border border-[#E5E5E5] dark:border-[#333333]"
            >
              <span className="w-2 h-2 rounded-full bg-[#2F4F2F] dark:bg-[#52B788] animate-pulse" />
              {useBackend ? 'Live FastAPI Mode' : 'Standalone Simulator Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Connection Settings Box */}
      <div className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-6 shadow-clean space-y-4">
        <h3 className="text-base font-serif font-bold text-[#323232] dark:text-white flex items-center gap-2 tracking-tight">
          <Server className="w-5 h-5 text-[#323232] dark:text-white" />
          FastAPI Backend Endpoint URL
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={backendUrl}
            onChange={e => setBackendUrl(e.target.value)}
            placeholder="http://localhost:8000/api"
            className="flex-1 rounded-full border border-[#E5E5E5] dark:border-[#333333] bg-[#F9F9F9] dark:bg-[#222222] px-5 py-2.5 text-xs font-mono text-[#323232] dark:text-white focus:border-[#323232] dark:focus:border-white focus:outline-none"
          />
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="rounded-full border border-[#E5E5E5] dark:border-[#333333] bg-white dark:bg-[#222222] px-5 py-2.5 text-xs font-mono font-bold text-[#323232] dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#303030] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            Test Connection
          </button>
          <button
            onClick={() => handleToggleBackend(!useBackend)}
            className="rounded-full bg-[#323232] dark:bg-white px-6 py-2.5 text-xs font-bold text-white dark:text-[#121212] shadow-pill hover:bg-[#1a1a1a] dark:hover:bg-[#EAEAEA] transition-all"
          >
            {useBackend ? 'Revert to Simulator Mode' : 'Connect Live Backend'}
          </button>
        </div>

        {testResult && (
          <div
            className={`rounded-2xl border p-4 text-xs flex items-center gap-2.5 ${
              testResult.connected
                ? 'bg-[#EBF3E8] dark:bg-[#1E3320] text-[#2F4F2F] dark:text-[#52B788] border-[#C8DFBF] dark:border-[#2E5A33]'
                : 'bg-[#FAF4E8] dark:bg-[#3D3016] text-[#6E4F1E] dark:text-[#F8D57E] border-[#E8D9BA] dark:border-[#665023]'
            }`}
          >
            {testResult.connected ? (
              <CheckCircle2 className="w-4 h-4 text-[#2F4F2F] dark:text-[#52B788] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#6E4F1E] dark:text-[#F8D57E] shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>

      {/* Backend API Endpoints Specification for Member 3 */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-serif font-bold text-[#323232] dark:text-white flex items-center gap-2 tracking-tight">
            <Code2 className="w-5 h-5 text-[#323232] dark:text-white" />
            FastAPI Contract Specification (For Member 3 Integration)
          </h3>
          <p className="text-xs text-[#707070] dark:text-[#999999]">
            The frontend is 100% wired and ready to consume these RESTful endpoints from FastAPI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {endpoints.map(ep => (
            <div
              key={ep.path}
              className="rounded-2xl border border-[#EAEAEA] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] p-5 space-y-3 shadow-clean"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#323232] dark:bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold text-white dark:text-[#121212]">
                  {ep.method}
                </span>
                <span className="font-mono text-xs font-bold text-[#323232] dark:text-white">{ep.path}</span>
              </div>
              <p className="text-xs text-[#555555] dark:text-[#CCCCCC] leading-relaxed">{ep.desc}</p>
              <div className="rounded-xl bg-[#F8F8F8] dark:bg-[#222222] p-3 border border-[#EAEAEA] dark:border-[#333333]">
                <span className="text-[10px] text-[#888888] dark:text-[#AAAAAA] uppercase font-mono font-semibold block mb-1">
                  Expected Response Schema
                </span>
                <pre className="font-mono text-[11px] text-[#323232] dark:text-[#E0E0E0] overflow-x-auto">
                  {ep.sampleResponse}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
