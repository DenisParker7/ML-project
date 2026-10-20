import React from 'react';
import {
  LayoutDashboard,
  Grid,
  BrainCircuit,
  Activity,
  BarChart3,
  Settings2,
  AlertTriangle,
  Play,
  Pause,
} from 'lucide-react';
import { useGreenhouse } from '../../context/GreenhouseContext';

export type NavPage =
  | 'overview'
  | 'zones'
  | 'stress'
  | 'sensors'
  | 'analytics'
  | 'config';

interface SidebarProps {
  currentPage: NavPage;
  onPageChange: (page: NavPage) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  isOpen,
  onClose,
}) => {
  const { zones, alerts, isSimulating, setIsSimulating } = useGreenhouse();
  const stressedCount = zones.filter(z => z.status !== 'Normal').length;

  const navItems = [
    {
      id: 'overview' as NavPage,
      label: 'Executive Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'zones' as NavPage,
      label: 'Cultivation Zones',
      icon: <Grid className="w-4 h-4" />,
      badge: zones.length ? `${zones.length}` : undefined,
    },
    {
      id: 'stress' as NavPage,
      label: 'Stress Intelligence',
      icon: <BrainCircuit className="w-4 h-4" />,
      badge: stressedCount > 0 ? `${stressedCount}` : undefined,
      badgeColor: 'bg-[#323232] text-white',
    },
    {
      id: 'sensors' as NavPage,
      label: 'Sensor Health',
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: 'analytics' as NavPage,
      label: 'Evaluation & Reports',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'config' as NavPage,
      label: 'FastAPI Integration',
      icon: <Settings2 className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#111111]/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 flex flex-col border-r border-[#EAEAEA] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#161616] transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="border-b border-[#EAEAEA] dark:border-[#262626] px-6 py-6 bg-white dark:bg-[#161616] transition-colors">
          <h1 className="font-serif text-2xl tracking-[0.25em] font-semibold text-[#323232] dark:text-[#F0F0F0] uppercase">
            C3SI
          </h1>
          <p className="text-[11px] font-mono tracking-wider text-[#777777] dark:text-[#999999] uppercase mt-1">
            Precision Ag Intelligence
          </p>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-mono font-semibold uppercase tracking-widest text-[#999999] dark:text-[#777777]">
            Navigation
          </div>
          {navItems.map(item => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between rounded-full px-4 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#323232] dark:bg-white text-white dark:text-[#121212] shadow-pill font-semibold'
                    : 'text-[#555555] dark:text-[#CCCCCC] hover:bg-[#F0F0F0] dark:hover:bg-[#252525] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span className="tracking-tight">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-[#555555] dark:bg-[#CCCCCC] text-white dark:text-[#121212]'
                        : 'bg-[#EAEAEA] dark:bg-[#2B2B2B] text-[#323232] dark:text-[#EAEAEA]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Active Alerts Callout */}
          {alerts.length > 0 && (
            <div className="mt-8 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2D2D2D] p-4 shadow-clean">
              <div className="flex items-center gap-2 text-xs font-bold text-[#323232] dark:text-white">
                <AlertTriangle className="w-4 h-4 text-[#8A3324] dark:text-[#E07A5F]" />
                Active Alerts ({alerts.length})
              </div>
              <p className="mt-1 text-[11px] text-[#666666] dark:text-[#AAAAAA] leading-relaxed">
                Zone 2 detected water stress residual deviation.
              </p>
            </div>
          )}
        </div>

        {/* Footer Stream Switch */}
        <div className="border-t border-[#EAEAEA] dark:border-[#262626] p-5 space-y-3 bg-white dark:bg-[#161616]">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-[#555555] dark:text-[#AAAAAA]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSimulating ? 'bg-[#2F4F2F] dark:bg-[#4E9A4E]' : 'bg-[#999999]'
                }`}
              />
              Telemetry Stream
            </span>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className="flex items-center gap-1.5 rounded-full bg-[#323232] dark:bg-white px-3 py-1 text-[11px] font-mono text-white dark:text-[#121212] hover:bg-[#1a1a1a] dark:hover:bg-[#EAEAEA] transition-colors"
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3 h-3 text-white dark:text-[#121212]" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-white dark:text-[#121212]" /> Run
                </>
              )}
            </button>
          </div>

          <div className="rounded-xl bg-[#F8F8F8] dark:bg-[#202020] p-2.5 border border-[#EAEAEA] dark:border-[#2A2A2A] text-[11px] text-[#666666] dark:text-[#999999] font-mono">
            <div className="flex justify-between">
              <span>Frontend:</span>
              <strong className="text-[#323232] dark:text-[#EEEEEE]">Member 2</strong>
            </div>
            <div className="flex justify-between mt-0.5">
              <span>Backend:</span>
              <span className="text-[#323232] dark:text-[#EEEEEE]">FastAPI (M3)</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
