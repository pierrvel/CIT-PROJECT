import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Users } from 'lucide-react';
import { LOUNGE_ONLINE_COUNT, SAMPLE_ACTIVITY_LOGS, TICKER_INTERVAL_MS } from '../../constants/lounge';
import { buildUserActivityLogs } from './loungeHelpers';

export const LivePulseBanner = ({ examHistory = [], goals = [] }) => {
  // 내 로컬 실적 로그를 최상단에, 그 뒤에 샘플 로그
  const logs = useMemo(
    () => [...buildUserActivityLogs(examHistory, goals), ...SAMPLE_ACTIVITY_LOGS],
    [examHistory, goals]
  );

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // 로그 구성이 바뀌면 처음(내 기록)부터 다시 표시
  useEffect(() => {
    setIndex(0);
    setVisible(true);
  }, [logs.length]);

  // 3.5초 간격 페이드 롤링
  useEffect(() => {
    if (logs.length <= 1) return undefined;
    let fadeTimer = null;
    const interval = setInterval(() => {
      setVisible(false);
      fadeTimer = setTimeout(() => {
        setIndex((prev) => (prev + 1) % logs.length);
        setVisible(true);
      }, 350);
    }, TICKER_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, [logs.length]);

  const current = logs[index % logs.length];

  return (
    <section className="rounded-2xl backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border border-white/20 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark p-4 sm:p-5">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* 접속자 인디케이터 */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="absolute inline-flex h-full w-full rounded-xl bg-emerald-400/20 animate-ping" />
            <Users className="relative w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">현재 함께 자습 중인 수험생</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black font-mono text-zinc-900 dark:text-white">{LOUNGE_ONLINE_COUNT}명</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-px self-stretch bg-zinc-200 dark:bg-zinc-800" />

        {/* 실시간 활동 티커 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[11px] font-bold tracking-wide text-indigo-600 dark:text-indigo-400 uppercase">Live Activity</span>
          </div>
          <div className="relative h-12 sm:h-10 overflow-hidden">
            {current ? (
              <div
                key={current.id}
                className={`absolute inset-0 flex items-center gap-2 transition-all duration-300 ease-out ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}
              >
                {current.isMine && (
                  <span className="shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded-md bg-indigo-600 text-white">MY</span>
                )}
                <p className="text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-100 leading-snug line-clamp-2">
                  {current.text}
                  <span className="ml-1.5 text-[11px] font-normal text-zinc-400 dark:text-zinc-500">({current.time})</span>
                </p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                <span>아직 최근 활동 내역이 없습니다. Sprint 목표를 진행하거나 모의고사를 완주하면 기록됩니다.</span>
              </div>
            )}
          </div>
        </div>

        {/* 위치 인디케이터 */}
        {logs.length > 1 && (
          <div className="flex md:flex-col items-center justify-center gap-1.5 shrink-0">
            {logs.map((log, i) => (
              <span
                key={log.id}
                className={`rounded-full transition-all duration-300 ${
                  i === index % logs.length
                    ? 'w-4 h-1.5 md:w-1.5 md:h-4 bg-indigo-500'
                    : 'w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-700'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LivePulseBanner;
