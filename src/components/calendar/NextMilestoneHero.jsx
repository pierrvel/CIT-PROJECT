import React from 'react';
import { Target, Sparkles, Calendar, Clock, ArrowRight } from 'lucide-react';
import {
  findNextKeyUpcomingMilestone,
  formatDateWithDay,
  getCsatYearProgress,
  getDaysUntil
} from './calendarHelpers';

export const NextMilestoneHero = ({ milestones = [] }) => {
  const nextEvent = findNextKeyUpcomingMilestone(milestones);
  const csatDays = getDaysUntil('2026-11-19');
  const progressPct = getCsatYearProgress('2026-11-19');

  if (!nextEvent) {
    return (
      <section className="rounded-3xl backdrop-blur-md bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-zinc-900/40 border border-white/20 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">모든 공식 입시 일정을 완주했습니다! 수고하셨습니다.</h2>
        </div>
      </section>
    );
  }

  const isCsat = nextEvent.category === 'csat';

  return (
    <section className="relative overflow-hidden rounded-3xl backdrop-blur-md bg-white/75 dark:bg-zinc-900/75 border border-white/30 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark p-5 sm:p-7">
      {/* 배경 은은한 그라디언트 블러 */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* 좌측: 마일스톤 정보 */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
              <Target className="w-3.5 h-3.5" />
              <span>NEXT 격전지</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {nextEvent.categoryLabel || '공식 일정'}
            </span>
            {!isCsat && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                수능까지 <strong className="text-zinc-800 dark:text-zinc-200">D-{csatDays}</strong>
              </span>
            )}
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-snug">
              {nextEvent.title}
            </h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-300 mt-1">
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{formatDateWithDay(nextEvent.date)}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl break-keep">
            💡 {nextEvent.desc}
          </p>

          {/* 수능 연간 진척도 바 */}
          <div className="pt-2 max-w-md">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              <span>2027학년도 수능 레이스 진척도</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{progressPct}% 완주</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-200/80 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 우측: 대형 D-Day 카운트 카드 */}
        <div className="shrink-0 flex sm:flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 shadow-inner">
          <div className="text-center">
            <span className="text-[11px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase block mb-1">
              남은 기간
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-zinc-900 dark:text-white">
                {nextEvent.diffDays === 0 ? 'D-DAY' : `D-${nextEvent.diffDays}`}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
              {nextEvent.diffDays === 0 ? '오늘 결전!' : `${nextEvent.diffDays}일 남음`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextMilestoneHero;
