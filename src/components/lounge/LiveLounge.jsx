import React from 'react';
import LivePulseBanner from './LivePulseBanner';
import TimeBenchmark from './TimeBenchmark';
import CheerBoard from './CheerBoard';

export const LiveLounge = ({
  examHistory,
  goals,
  cheerBoard,
  setCheerBoard,
  showToast,
  isRealtimeCheer = false
}) => {
  return (
    <div className="space-y-6">
      <LivePulseBanner examHistory={examHistory} goals={goals} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <TimeBenchmark examHistory={examHistory} />
        </div>
        <div className="lg:col-span-5">
          <CheerBoard
            cheers={cheerBoard}
            setCheers={setCheerBoard}
            showToast={showToast}
            isRealtime={isRealtimeCheer}
          />
        </div>
      </div>
    </div>
  );
};

export default LiveLounge;
