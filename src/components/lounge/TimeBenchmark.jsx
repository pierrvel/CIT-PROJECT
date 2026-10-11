import React, { useMemo, useState } from 'react';
import { BarChart3, Info } from 'lucide-react';
import { BENCHMARK_SUBJECTS } from '../../constants/lounge';
import { aggregateRecordBySegment, formatMMSS, formatSignedDelta, loadExamHistoryFallback } from './loungeHelpers';

const BarRow = ({ label, seconds, max, colorClass, labelClass = 'text-zinc-500 dark:text-zinc-400' }) => {
  const hasValue = typeof seconds === 'number';
  const pct = hasValue && max > 0 ? Math.min(100, (seconds / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className={`w-14 shrink-0 text-[11px] font-semibold ${labelClass}`}>{label}</span>
      <div className="flex-1 h-2 rounded-full bg-zinc-200/70 dark:bg-zinc-800 overflow-hidden">
        <div className={`h-full rounded-full ${colorClass} transition-all duration-500 ease-out`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-12 shrink-0 text-right text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-200">
        {hasValue ? formatMMSS(seconds) : '—'}
      </span>
    </div>
  );
};

const DeltaBadge = ({ delta }) => {
  const isAhead = delta <= 0;
  return (
    <span
      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
        isAhead
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
      }`}
    >
      {isAhead ? `${formatSignedDelta(delta)} 여유 🟢` : `${formatSignedDelta(delta)} 지연 🔴`}
    </span>
  );
};

export const TimeBenchmark = ({ examHistory }) => {
  const [subjectKey, setSubjectKey] = useState('korean');

  const history = useMemo(
    () => (Array.isArray(examHistory) ? examHistory : loadExamHistoryFallback()),
    [examHistory]
  );

  const subjectCfg = BENCHMARK_SUBJECTS.find((s) => s.key === subjectKey) || BENCHMARK_SUBJECTS[0];

  // 해당 과목의 가장 최근 기록 (examHistory는 최신순으로 저장됨)
  const latestRecord = useMemo(
    () => history.find((h) => h && h.subject === subjectKey) || null,
    [history, subjectKey]
  );

  const mine = useMemo(() => aggregateRecordBySegment(subjectCfg, latestRecord), [subjectCfg, latestRecord]);
  const hasRecord = !!latestRecord && Object.values(mine).some((v) => v !== null);

  const topTotal = subjectCfg.segments.reduce((acc, seg) => acc + seg.top, 0);
  const myTotal = subjectCfg.segments.reduce((acc, seg) => acc + (mine[seg.key] || 0), 0);
  const comparableTopTotal = subjectCfg.segments.reduce(
    (acc, seg) => acc + (mine[seg.key] !== null ? seg.top : 0),
    0
  );

  return (
    <section className="rounded-2xl backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border border-white/20 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark p-5 space-y-5">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">⏱️ 전국 타임 벤치마크</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">1등급 페이스 · 전국 평균 · 내 최근 Pacer 기록 비교</p>
          </div>
        </div>

        {/* 과목 필터 칩 */}
        <div className="inline-flex p-1 rounded-full bg-zinc-200/70 dark:bg-zinc-800/80 border border-zinc-300/40 dark:border-zinc-700/50">
          {BENCHMARK_SUBJECTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSubjectKey(s.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                subjectKey === s.key
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 범례 & 기록 정보 */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" />1등급</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500" />전국 평균</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />내 기록</span>
        </div>
        <div className="flex items-center gap-2">
          {subjectCfg.isEstimate && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold">
              추정 샘플 데이터
            </span>
          )}
          <span className="font-mono text-zinc-400 dark:text-zinc-500">
            {subjectCfg.label} {subjectCfg.totalMinutes}분
          </span>
        </div>
      </div>

      {hasRecord && (
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 px-3 py-2 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60">
          내 최근 기록: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{latestRecord.date}</span>
          {latestRecord.presetName && <span> · {latestRecord.presetName}</span>}
        </div>
      )}

      {/* 구간별 비교 */}
      <div className="space-y-4">
        {subjectCfg.segments.map((seg) => {
          const myValue = mine[seg.key];
          const hasMine = hasRecord && myValue !== null;
          const delta = hasMine ? myValue - seg.top : 0;
          const max = Math.max(seg.top, seg.avg, hasMine ? myValue : 0, 1);
          return (
            <div key={seg.key} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{seg.name}</span>
                {hasMine && <DeltaBadge delta={delta} />}
                {hasRecord && !hasMine && (
                  <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">측정 없음</span>
                )}
              </div>
              <BarRow label="1등급" seconds={seg.top} max={max} colorClass="bg-indigo-500" />
              <BarRow label="전국 평균" seconds={seg.avg} max={max} colorClass="bg-zinc-400 dark:bg-zinc-500" />
              {hasRecord && (
                <BarRow
                  label="내 기록"
                  seconds={hasMine ? myValue : null}
                  max={max}
                  colorClass={delta <= 0 ? 'bg-emerald-500' : 'bg-rose-500'}
                  labelClass="text-emerald-600 dark:text-emerald-400"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 요약 / 가이드 */}
      {hasRecord ? (
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-xs text-zinc-600 dark:text-zinc-300">
            측정 구간 합계 <span className="font-mono font-bold">{formatMMSS(myTotal)}</span>
            <span className="text-zinc-400 dark:text-zinc-500"> / 1등급 {formatMMSS(comparableTopTotal)}</span>
          </div>
          <DeltaBadge delta={myTotal - comparableTopTotal} />
        </div>
      ) : (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Exam Pacer에서 모의고사를 1회 응시하면 내 기록과 자동 대조됩니다.
            <span className="block text-[11px] text-indigo-500/80 dark:text-indigo-400/70 mt-0.5">
              1등급 기준 총 {formatMMSS(topTotal)} 페이스
            </span>
          </span>
        </div>
      )}
    </section>
  );
};

export default TimeBenchmark;
