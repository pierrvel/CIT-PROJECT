import React from 'react';
import Icon from './Icon';

export const Toast = ({ toasts }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isWarn = toast.type === 'warn';
        const isSuccess = toast.type === 'success';

        let badgeBg = 'bg-[#1f2c24] dark:bg-zinc-800 text-white border-[#344b3b] dark:border-zinc-700 shadow-xl shadow-black/25';
        let iconName = 'sparkles';
        let iconColor = 'text-emerald-400';

        if (isError) {
          badgeBg = 'bg-rose-600 text-white border-rose-500 shadow-xl shadow-rose-950/30';
          iconName = 'alertTriangle';
          iconColor = 'text-white';
        } else if (isWarn) {
          badgeBg = 'bg-amber-600 text-white border-amber-500 shadow-xl shadow-amber-950/30';
          iconName = 'alertCircle';
          iconColor = 'text-white';
        } else if (isSuccess) {
          badgeBg = 'bg-emerald-600 text-white border-emerald-500 shadow-xl shadow-emerald-950/30';
          iconName = 'checkCircle';
          iconColor = 'text-white';
        }

        return (
          <div
            key={toast.id}
            role="alert"
            className={`toast-item pointer-events-auto px-4 py-3 rounded-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-3 animate-slide-up border ${badgeBg}`}
          >
            <div className="shrink-0 p-1.5 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon name={iconName} className={`w-4 h-4 ${iconColor}`} />
            </div>
            <span className="toast-text text-white !text-white leading-snug flex-1 font-semibold select-none">
              {toast.message}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
