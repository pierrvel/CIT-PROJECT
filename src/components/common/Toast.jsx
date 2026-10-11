import React from 'react';

export const Toast = ({ toasts }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md text-xs font-semibold flex items-center gap-2.5 animate-slide-up border ${
            toast.type === 'error'
              ? 'bg-rose-500/90 text-white border-rose-400'
              : toast.type === 'warn'
              ? 'bg-amber-500/90 text-white border-amber-400'
              : toast.type === 'success'
              ? 'bg-emerald-600/90 text-white border-emerald-500'
              : 'bg-zinc-900/90 dark:bg-zinc-800/90 text-white border-zinc-700'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
