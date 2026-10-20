import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useGreenhouse } from '../../context/GreenhouseContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useGreenhouse();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
      {toasts.map(toast => {
        const icon = {
          success: <CheckCircle2 className="w-5 h-5 text-[#2F4F2F] shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-[#B57E36] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#722A2A] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#323232] shrink-0" />,
        }[toast.type];

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-[#E5E5E5] bg-white p-4 shadow-luxury backdrop-blur-md transition-all duration-300 text-[#323232]"
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-bold text-[#323232] tracking-tight">{toast.title}</h5>
              <p className="mt-0.5 text-xs text-[#666666] leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#999999] hover:text-[#323232] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
