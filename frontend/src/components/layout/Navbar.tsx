import React, { useState } from 'react';
import {
  Menu,
  Bell,
  RefreshCw,
  Download,
  ChevronDown,
  Check,
  Sun,
  Moon,
} from 'lucide-react';
import { useGreenhouse } from '../../context/GreenhouseContext';
import { ApiService } from '../../services/api';
import type { TimeRange } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    zones,
    selectedZoneId,
    setSelectedZoneId,
    alerts,
    resolveAlert,
    timeRange,
    setTimeRange,
    refreshData,
    isLoading,
    addToast,
    theme,
    toggleTheme,
  } = useGreenhouse();

  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  const handleExportCSV = () => {
    const rows = zones.map(z => ({
      ZoneID: z.id,
      ZoneName: z.name,
      CropType: z.cropType,
      CropStage: z.cropStage,
      StressStatus: z.currentStress,
      Severity: z.status,
      StressProbability: z.stressProbability,
      SoilMoisturePercent: z.currentReadings.soilMoisture,
      CanopyTempC: z.currentReadings.canopyTemperature,
      AmbientTempC: z.currentReadings.ambientTemperature,
      HumidityPercent: z.currentReadings.humidity,
      LightLux: z.currentReadings.lightIntensity,
      VPD_kPa: z.currentReadings.vaporPressureDeficit,
      DataReliabilityScore: z.reliabilityScore,
      LastUpdated: z.lastUpdated,
    }));

    ApiService.exportToCSV('C3SI_Greenhouse_Telemetry', rows);
    addToast('success', 'CSV Exported', 'Telemetry dataset exported successfully.');
  };

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-[#EAEAEA] dark:border-[#262626] bg-white/95 dark:bg-[#161616]/95 px-4 backdrop-blur-md lg:px-8 transition-colors duration-200">
      {/* Left side: Hamburger + Active Zone Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-full p-2 text-[#323232] dark:text-[#E0E0E0] hover:bg-[#F2F2F2] dark:hover:bg-[#252525] transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Zone Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowZoneDropdown(!showZoneDropdown)}
            className="flex items-center gap-2.5 rounded-full border border-[#E5E5E5] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] px-4 py-2 text-xs font-semibold text-[#323232] dark:text-[#EAEAEA] hover:border-[#999999] dark:hover:border-[#555555] transition-colors shadow-clean"
          >
            <span className="w-2 h-2 rounded-full bg-[#323232] dark:bg-white" />
            <span className="max-w-[150px] sm:max-w-[220px] truncate">
              {selectedZone ? selectedZone.name : 'Select Zone'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#707070] dark:text-[#A0A0A0]" />
          </button>

          {showZoneDropdown && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-[#E5E5E5] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] shadow-luxury p-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase font-bold text-[#888888] dark:text-[#777777] tracking-wider">
                Select Cultivation Bay
              </div>
              {zones.map(zone => (
                <button
                  key={zone.id}
                  onClick={() => {
                    setSelectedZoneId(zone.id);
                    setShowZoneDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                    zone.id === selectedZoneId
                      ? 'bg-[#323232] dark:bg-white text-white dark:text-[#121212] font-bold'
                      : 'text-[#444444] dark:text-[#CCCCCC] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] hover:text-[#111111] dark:hover:text-white'
                  }`}
                >
                  <span className="truncate">{zone.name}</span>
                  {zone.status === 'Critical' && (
                    <span className="ml-2 w-2 h-2 rounded-full bg-[#8A3324]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Global Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Time Range Filter */}
        <div className="hidden md:flex items-center rounded-full bg-[#F5F5F5] dark:bg-[#222222] border border-[#E5E5E5] dark:border-[#2D2D2D] p-1 text-xs">
          {(['1h', '24h', '7d', '30d'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-full px-3 py-1 font-mono font-bold uppercase transition-all ${
                timeRange === range
                  ? 'bg-[#323232] dark:bg-white text-white dark:text-[#121212] shadow-sm'
                  : 'text-[#707070] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCSV}
          title="Download Telemetry & Stress Reports (.csv)"
          className="flex items-center gap-1.5 rounded-full border border-[#E5E5E5] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] px-4 py-2 text-xs font-semibold text-[#323232] dark:text-[#EAEAEA] hover:bg-[#323232] hover:text-white dark:hover:bg-white dark:hover:text-[#121212] transition-all shadow-clean"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          className="flex items-center gap-2 rounded-full border border-[#E5E5E5] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] px-3.5 py-2 text-xs font-semibold text-[#323232] dark:text-[#EAEAEA] hover:bg-[#F5F5F5] dark:hover:bg-[#282828] transition-all shadow-clean"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-[#F5B041] animate-in spin-in-180 duration-300" />
              <span className="hidden sm:inline font-mono text-[11px]">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#323232] animate-in spin-in-180 duration-300" />
              <span className="hidden sm:inline font-mono text-[11px]">Dark</span>
            </>
          )}
        </button>

        {/* Refresh Button */}
        <button
          onClick={() => refreshData()}
          disabled={isLoading}
          title="Refresh Sensor Telemetry"
          className="rounded-full border border-[#E5E5E5] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] p-2.5 text-[#323232] dark:text-[#EAEAEA] hover:bg-[#323232] hover:text-white dark:hover:bg-white dark:hover:text-[#121212] transition-colors disabled:opacity-50 shadow-clean"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        {/* Alerts Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className="relative rounded-full border border-[#E5E5E5] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] p-2.5 text-[#323232] dark:text-[#EAEAEA] hover:bg-[#F5F5F5] dark:hover:bg-[#282828] transition-colors shadow-clean"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#323232] text-[10px] font-mono font-bold text-white shadow">
                {alerts.length}
              </span>
            )}
          </button>

          {showAlertsDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#E5E5E5] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] shadow-luxury p-3.5 z-50 text-[#323232] dark:text-[#EAEAEA]">
              <div className="flex items-center justify-between border-b border-[#EAEAEA] dark:border-[#2D2D2D] pb-2 mb-2">
                <span className="text-xs font-bold text-[#323232] dark:text-[#EAEAEA] flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#323232] dark:text-white" />
                  Active Stress Alerts ({alerts.length})
                </span>
                <span className="text-[10px] font-mono text-[#888888] dark:text-[#777777]">C3SI Notifications</span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {alerts.length === 0 ? (
                  <p className="py-4 text-center text-xs text-[#707070] dark:text-[#999999]">
                    All zones operating within healthy counterfactual bounds.
                  </p>
                ) : (
                  alerts.map(alert => (
                    <div
                      key={alert.id}
                      className="rounded-xl border border-[#EAEAEA] dark:border-[#2D2D2D] bg-[#F9F9F9] dark:bg-[#252525] p-3 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-[#323232] dark:text-white">{alert.zoneName}</span>
                        <span className="text-[10px] font-mono text-[#888888] dark:text-[#888888]">{alert.timestamp}</span>
                      </div>
                      <p className="mt-1 text-[#555555] dark:text-[#CCCCCC] text-[11px] leading-relaxed">
                        {alert.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-mono font-bold text-[#8A3324] dark:text-[#E07A5F] text-[10px]">
                          {alert.stressType}
                        </span>
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="flex items-center gap-1 text-[11px] font-bold text-[#323232] dark:text-white hover:underline"
                        >
                          <Check className="w-3 h-3" /> Dismiss
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
