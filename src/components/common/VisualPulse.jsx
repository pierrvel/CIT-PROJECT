import React from 'react';

export const VisualPulse = ({ visualFlash }) => {
  if (!visualFlash) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-50 flex items-start justify-center pt-8 ${
        visualFlash.type === 'start'
          ? 'animate-flash-start border-4 border-emerald-500/80'
          : visualFlash.type === 'warning10m'
          ? 'animate-flash-warning border-4 border-amber-500/80'
          : 'animate-flash-end border-4 border-rose-500/80'
      }`}
    >
      <div
        className={`px-6 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md text-sm font-black flex items-center gap-2 animate-bounce border ${
          visualFlash.type === 'start'
            ? 'bg-emerald-600/95 text-white border-emerald-400'
            : visualFlash.type === 'warning10m'
            ? 'bg-amber-600/95 text-white border-amber-400'
            : 'bg-rose-600/95 text-white border-rose-400'
        }`}
      >
        <span>
          {visualFlash.type === 'start' ? '🔔' : visualFlash.type === 'warning10m' ? '⏰' : '🏁'}
        </span>
        <span>{visualFlash.message}</span>
      </div>
    </div>
  );
};

export default VisualPulse;
