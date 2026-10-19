import React from 'react';
import Icon from '../common/Icon';
import { SUBJECT_META } from '../../constants/subjects';
import { formatTime } from '../../utils/pacing';

export const StatsDashboard = ({
  examHistory,
  analyticsSubjectFilter,
  setAnalyticsSubjectFilter,
  expandedHistoryId,
  setExpandedHistoryId,
  editingMemoId,
  setEditingMemoId,
  editingMemoText,
  setEditingMemoText,
  handleUpdateMemo,
  handleDeleteExamHistory,
  handleClearAllHistory,
  handleDeleteSubjectHistory,
  setPacerSubView
}) => {
  // 필터링된 히스토리
  const filteredHistory = analyticsSubjectFilter === 'all'
    ? examHistory
    : examHistory.filter(h => h.subject === analyticsSubjectFilter);

  // 1. 총 응시 횟수
  const totalSessions = filteredHistory.length;

  // 2. 평균 페이스 오차
  const totalDeltaSum = filteredHistory.reduce((acc, h) => {
    const d = h.totalDeltaSec !== undefined ? h.totalDeltaSec : ((h.totalElapsed || 0) - (h.totalTargetSec || 0));
    return acc + d;
  }, 0);
  const avgDeltaSec = totalSessions > 0 ? Math.round(totalDeltaSum / totalSessions) : 0;

  // 3. 취약 지연 파트 통계
  const partDelayStats = {};
  filteredHistory.forEach(h => {
    const pList = h.parts || h.partsResult || [];
    pList.forEach(p => {
      if (!partDelayStats[p.name]) {
        partDelayStats[p.name] = { totalDelay: 0, totalActual: 0, count: 0, targetSec: 0 };
      }
      const actual = p.actualSec || p.actualSeconds || 0;
      const tSec = p.targetSec || (p.targetMinutes ? p.targetMinutes * 60 : 0);
      const delta = p.deltaSec !== undefined ? p.deltaSec : (p.delta !== undefined ? p.delta : actual - tSec);

      partDelayStats[p.name].totalDelay += Math.max(0, delta);
      partDelayStats[p.name].totalActual += actual;
      partDelayStats[p.name].count += 1;
      if (!partDelayStats[p.name].targetSec && tSec) {
        partDelayStats[p.name].targetSec = tSec;
      }
    });
  });

  let topTimeEaterName = '없음 (정시 완주)';
  let topTimeEaterAvg = 0;
  Object.entries(partDelayStats).forEach(([name, data]) => {
    const avg = data.totalDelay / (data.count || 1);
    if (avg > topTimeEaterAvg) {
      topTimeEaterAvg = avg;
      topTimeEaterName = name;
    }
  });

  // 4. 정시 완주율 (%)
  const onTimeCount = filteredHistory.filter(h => {
    const d = h.totalDeltaSec !== undefined ? h.totalDeltaSec : ((h.totalElapsed || 0) - (h.totalTargetSec || 0));
    return d <= 0;
  }).length;
  const onTimeRate = totalSessions > 0 ? Math.round((onTimeCount / totalSessions) * 100) : 0;

  // 과목별 응시 횟수 맵 (필터 뱃지용)
  const subjectCounts = {
    all: examHistory.length,
    korean: examHistory.filter(h => h.subject === 'korean').length,
    math: examHistory.filter(h => h.subject === 'math').length,
    english: examHistory.filter(h => h.subject === 'english').length,
    history: examHistory.filter(h => h.subject === 'history').length,
    inquiry: examHistory.filter(h => h.subject === 'inquiry').length,
    secondLang: examHistory.filter(h => h.subject === 'secondLang').length
  };

  // 차트 1 데이터: 최근 최대 8회차 (과거 -> 최신 순 정렬)
  const chartSessions = [...filteredHistory].slice(0, 8).reverse();
  const maxAbsDelta = Math.max(120, ...chartSessions.map(s => Math.abs(s.totalDeltaSec !== undefined ? s.totalDeltaSec : ((s.totalElapsed || 0) - (s.totalTargetSec || 0)))));

  const subjectBadgeStyles = {
    korean: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    math: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    english: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    inquiry: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. 상단 과목 필터 바 & 액션 버튼 */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 p-4 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mr-1 hidden sm:inline">과목 필터:</span>
          {[
            { key: 'all', label: '전체' },
            { key: 'korean', label: '국어' },
            { key: 'math', label: '수학' },
            { key: 'english', label: '영어' },
            { key: 'history', label: '한국사' },
            { key: 'inquiry', label: '탐구' },
            { key: 'secondLang', label: '제2외국어' }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setAnalyticsSubjectFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                analyticsSubjectFilter === tab.key
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                analyticsSubjectFilter === tab.key
                  ? 'bg-white/20 dark:bg-zinc-900/20 text-white dark:text-zinc-900'
                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
              }`}>
                {subjectCounts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {filteredHistory.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (handleDeleteSubjectHistory) {
                  handleDeleteSubjectHistory(analyticsSubjectFilter);
                } else if (handleClearAllHistory) {
                  handleClearAllHistory();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/50 transition-all shadow-xs active:scale-95"
              title={
                analyticsSubjectFilter === 'all'
                  ? '모든 과목 모의고사 기록 전체 삭제'
                  : `${SUBJECT_META[analyticsSubjectFilter]?.name || '과목'} 기록 전체 삭제`
              }
            >
              <Icon name="trash2" className="w-3.5 h-3.5" />
              <span>
                {analyticsSubjectFilter === 'all'
                  ? '전체 초기화'
                  : `${SUBJECT_META[analyticsSubjectFilter]?.name.replace(' 영역', '') || '과목'} 전체 삭제 (${filteredHistory.length}건)`}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setPacerSubView('timer')}
            className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Icon name="play" className="w-3.5 h-3.5 fill-current" />
            <span>새 실전 시작</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Key Metric (KPI) 요약 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: 총 응시 횟수 */}
        <div className="glass-card bg-white/80 dark:bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">총 응시 횟수</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Icon name="fileText" className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-zinc-900 dark:text-white">
            {totalSessions}<span className="text-sm font-sans font-bold ml-1 text-zinc-500">회</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
            {analyticsSubjectFilter === 'all' ? `국어 ${subjectCounts.korean} · 수학 ${subjectCounts.math} · 영어 ${subjectCounts.english}` : `${SUBJECT_META[analyticsSubjectFilter]?.name || ''} 누적 검증`}
          </p>
        </div>

        {/* KPI 2: 평균 페이스 오차 */}
        <div className="glass-card bg-white/80 dark:bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">평균 페이스 오차</span>
            <div className={`p-2 rounded-xl ${avgDeltaSec <= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
              <Icon name={avgDeltaSec <= 0 ? 'trendingDown' : 'trendingUp'} className="w-4 h-4" />
            </div>
          </div>
          <div className={`mt-2 text-2xl sm:text-3xl font-black font-mono ${avgDeltaSec <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {totalSessions === 0 ? '00:00' : avgDeltaSec <= 0 ? `-${formatTime(Math.abs(avgDeltaSec))}` : `+${formatTime(avgDeltaSec)}`}
          </div>
          <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
            {totalSessions === 0 ? '데이터 없음' : avgDeltaSec <= 0 ? '✨ 평균 목표 대비 여유 시간 확보' : '⚠️ 평균 목표 대비 지연 발생'}
          </p>
        </div>

        {/* KPI 3: 취약 지연 파트 */}
        <div className="glass-card bg-white/80 dark:bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">취약 지연 파트</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Icon name="alertTriangle" className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white truncate" title={topTimeEaterName}>
            {topTimeEaterName}
          </div>
          <p className="mt-1 text-[11px] text-rose-500 dark:text-rose-400 font-semibold truncate">
            {topTimeEaterAvg > 0 ? `평균 +${formatTime(Math.round(topTimeEaterAvg))} 초과 지체` : '지연 없이 양호한 완주'}
          </p>
        </div>

        {/* KPI 4: 정시 완주율 */}
        <div className="glass-card bg-white/80 dark:bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">정시 완주율</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Icon name="checkCircle" className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
            {onTimeRate}<span className="text-sm font-sans font-bold ml-1 text-zinc-500">%</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
            {totalSessions === 0 ? '기록 없음' : `${onTimeCount} / ${totalSessions}회 총 시간 내 완료`}
          </p>
        </div>
      </div>

      {/* 3. 시각화 분석 차트 2종 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 차트 1: 회차별 페이스 추이 바 차트 */}
        <div className="glass-card bg-white/80 dark:bg-zinc-900/80 p-5 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Icon name="barChart" className="w-4 h-4 text-indigo-500" />
                <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">회차별 페이스 추이 (최근 {chartSessions.length}회)</h4>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-semibold">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 여유(-초)
                </span>
                <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> 지연(+초)
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mb-4">목표 시간 대비 총 절약(-) 및 초과(+) 시간 흐름</p>
          </div>

          {chartSessions.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-zinc-400 text-xs gap-2">
              <Icon name="clock" className="w-8 h-8 opacity-40" />
              <span>누적된 시험 기록이 없습니다.</span>
            </div>
          ) : (
            <div className="h-56 relative flex items-center justify-between gap-2 px-3 pt-4 pb-8 border-b border-zinc-200/50 dark:border-zinc-800/50">
              {/* 기준선 (0초 = 정시) */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-dashed border-zinc-300 dark:border-zinc-700 pointer-events-none z-0">
                <span className="absolute right-1 -top-4 text-[9px] font-mono text-zinc-400">00:00 (목표 기준선)</span>
              </div>

              {chartSessions.map((s, idx) => {
                const delta = s.totalDeltaSec !== undefined ? s.totalDeltaSec : ((s.totalElapsed || 0) - (s.totalTargetSec || 0));
                const isUnder = delta <= 0;
                const heightPct = Math.min(42, Math.max(10, (Math.abs(delta) / maxAbsDelta) * 42));

                return (
                  <div key={s.id || idx} className="flex-1 flex flex-col items-center h-full relative z-10 group cursor-pointer">
                    {/* 상단 공간 */}
                    <div className="w-full flex-1 flex flex-col justify-end items-center pb-0.5">
                      {isUnder && (
                        <div className="w-full max-w-[28px] flex flex-col items-center group-hover:scale-105 transition-all">
                          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-0.5 opacity-90 group-hover:opacity-100">
                            -{formatTime(Math.abs(delta))}
                          </span>
                          <div
                            style={{ height: `${heightPct * 2.2}px` }}
                            className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-sm shadow-emerald-500/30"
                          />
                        </div>
                      )}
                    </div>

                    {/* 중앙 점 */}
                    <div className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600 my-0.5 shrink-0" />

                    {/* 하단 공간 */}
                    <div className="w-full flex-1 flex flex-col justify-start items-center pt-0.5">
                      {!isUnder && (
                        <div className="w-full max-w-[28px] flex flex-col items-center group-hover:scale-105 transition-all">
                          <div
                            style={{ height: `${heightPct * 2.2}px` }}
                            className="w-full rounded-b-lg bg-gradient-to-b from-rose-500 to-rose-400 shadow-sm shadow-rose-500/30"
                          />
                          <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5 opacity-90 group-hover:opacity-100">
                            +{formatTime(delta)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 하단 X축 레이블 */}
                    <div className="absolute -bottom-6 flex flex-col items-center whitespace-nowrap">
                      <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                        {s.subject === 'korean' ? '국어' : s.subject === 'math' ? '수학' : s.subject === 'english' ? '영어' : '탐구'}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
                        {s.date ? s.date.split(' ')[0].slice(5) : `#${idx + 1}`}
                      </span>
                    </div>

                    {/* 호버 툴팁 */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                      <div className="bg-zinc-900 dark:bg-zinc-800 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-xl border border-zinc-700 whitespace-nowrap">
                        <div className="font-bold">{s.presetName || s.subjectName}</div>
                        <div className="font-mono text-[10px] text-zinc-300">
                          {s.date} • {isUnder ? `-${formatTime(Math.abs(delta))} 여유` : `+${formatTime(delta)} 지연`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4 pt-2 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>← 과거 응시</span>
            <span>최신 응시 →</span>
          </div>
        </div>

        {/* 차트 2: 파트별 목표 vs 실제 평균 소요 시간 비교 */}
        <div className="glass-card bg-white/80 dark:bg-zinc-900/80 p-5 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Icon name="clock" className="w-4 h-4 text-emerald-500" />
                <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">파트별 목표 vs 실제 평균 소요 시간</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {analyticsSubjectFilter === 'all' ? '전체 과목 종합' : SUBJECT_META[analyticsSubjectFilter]?.name}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-4">각 파트별 목표 배분 시간과 실제 평균 소요 시간 비교</p>
          </div>

          {Object.keys(partDelayStats).length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-zinc-400 text-xs gap-2">
              <Icon name="barChart" className="w-8 h-8 opacity-40" />
              <span>파트별 누적 데이터가 없습니다.</span>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
              {Object.entries(partDelayStats).map(([partName, data]) => {
                const avgActualSec = Math.round(data.totalActual / (data.count || 1));
                const targetSec = data.targetSec || avgActualSec || 1;
                const deltaSec = avgActualSec - targetSec;
                const isOver = deltaSec > 0;
                const percent = Math.min(160, Math.round((avgActualSec / targetSec) * 100));

                return (
                  <div key={partName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[200px]" title={partName}>
                        {partName}
                      </span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-zinc-400 dark:text-zinc-500">목표 {formatTime(targetSec)}</span>
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">➔ 실평균 {formatTime(avgActualSec)}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold ${
                          isOver
                            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                            : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {isOver ? `+${formatTime(deltaSec)}` : `-${formatTime(Math.abs(deltaSec))}`}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2.5 bg-zinc-200/80 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                            : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                        }`}
                        style={{ width: `${Math.min(100, (percent / 140) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 pt-2 text-[11px] text-zinc-400 flex items-center justify-between">
            <span className="text-emerald-500">🟢 목표 내 완료 파트: 시간 세이브 구간</span>
            <span className="text-rose-500">🔴 초과 파트: 집중 보완 권장</span>
          </div>
        </div>
      </div>

      {/* 4. 회차별 상세 기록 리스트 */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 p-5 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            <Icon name="fileText" className="w-5 h-5 text-indigo-500" />
            <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white">
              회차별 실전 복기 피드 ({filteredHistory.length}회차)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {filteredHistory.length > 0 && (
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 text-[11px] font-bold select-none">
                <button
                  type="button"
                  onClick={() => setExpandedHistoryId('__all__')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    expandedHistoryId === '__all__'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                  title="모든 회차 상세 분석 펼치기"
                >
                  모두 펼치기
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedHistoryId('__none__')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    expandedHistoryId === '__none__'
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                  title="모든 회차 상세 분석 접기"
                >
                  모두 접기
                </button>
              </div>
            )}
            <span className="text-xs text-zinc-400 hidden sm:inline">클릭하여 파트별 상세 및 복기 메모 확인</span>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-4 rounded-3xl bg-zinc-100 dark:bg-zinc-800/60 text-zinc-400">
              <Icon name="clock" className="w-10 h-10" />
            </div>
            <div>
              <h4 className="font-bold text-base text-zinc-700 dark:text-zinc-300">저장된 모의고사 기록이 없습니다</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                Exam Pacer에서 모의고사를 완주하면 파트별 소요 시간과 페이스 통계가 이곳에 자동 기록됩니다.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((session, sIdx) => {
              const isExpanded = expandedHistoryId === '__all__'
                ? true
                : expandedHistoryId === '__none__'
                ? false
                : expandedHistoryId === session.id || (expandedHistoryId === null && sIdx === 0);
              const delta = session.totalDeltaSec !== undefined ? session.totalDeltaSec : ((session.totalElapsed || 0) - (session.totalTargetSec || 0));
              const isOvertime = delta > 0;
              const pList = session.parts || session.partsResult || [];

              return (
                <div
                  key={session.id || sIdx}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-850/60 overflow-hidden shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                  {/* 회차 헤더 바 */}
                  <div
                    onClick={() => setExpandedHistoryId(isExpanded ? '__none__' : session.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-xl border ${subjectBadgeStyles[session.subject] || subjectBadgeStyles.korean}`}>
                        {session.subjectName || SUBJECT_META[session.subject]?.name || '시험'}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white">
                            {session.presetName || '실전 모의고사'}
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                          {session.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right font-mono">
                        <div className="text-xs font-bold text-zinc-900 dark:text-white">
                          소요: {formatTime(session.totalActualSec || session.totalElapsed || 0)}
                          <span className="text-[11px] font-normal text-zinc-400 ml-1">
                            / {formatTime(session.totalTargetSec || (session.totalMinutes ? session.totalMinutes * 60 : 0))}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-xl font-mono font-bold text-xs border ${
                        isOvertime
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      }`}>
                        {isOvertime ? `+${formatTime(delta)} 지연` : `-${formatTime(Math.abs(delta))} 여유`}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteExamHistory(session.id);
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="이 회차 기록 삭제"
                      >
                        <Icon name="trash" className="w-4 h-4" />
                      </button>

                      <div className="text-zinc-400 pl-1">
                        <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* 아코디언 본문 */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 border-t border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-4 animate-fadeIn">
                      <div>
                        <h5 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-2">파트별 실전 소요 시간</h5>
                        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 font-bold border-b border-zinc-200 dark:border-zinc-800">
                              <tr>
                                <th className="p-2.5">파트명</th>
                                <th className="p-2.5 text-center font-mono">목표 시간</th>
                                <th className="p-2.5 text-center font-mono">실제 소요</th>
                                <th className="p-2.5 text-center font-mono">오차(Δt)</th>
                                <th className="p-2.5 text-center">판정</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white/50 dark:bg-zinc-900/50 font-mono">
                              {pList.map((part, pIdx) => {
                                const target = part.targetSec || (part.targetMinutes ? part.targetMinutes * 60 : 0);
                                const actual = part.actualSec || part.actualSeconds || 0;
                                const pDelta = part.deltaSec !== undefined ? part.deltaSec : (part.delta !== undefined ? part.delta : actual - target);
                                const pOver = pDelta > 0;

                                return (
                                  <tr key={pIdx} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/50">
                                    <td className="p-2.5 font-sans font-semibold text-zinc-900 dark:text-white">
                                      {part.name}
                                    </td>
                                    <td className="p-2.5 text-center text-zinc-500 dark:text-zinc-400">
                                      {formatTime(target)}
                                    </td>
                                    <td className="p-2.5 text-center font-bold text-zinc-800 dark:text-zinc-200">
                                      {formatTime(actual)}
                                    </td>
                                    <td className="p-2.5 text-center">
                                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                        pOver
                                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                                          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                      }`}>
                                        {pOver ? `+${formatTime(pDelta)}` : `-${formatTime(Math.abs(pDelta))}`}
                                      </span>
                                    </td>
                                    <td className="p-2.5 text-center font-sans">
                                      {pOver ? (
                                        <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1">
                                          ⚠️ 지연
                                        </span>
                                      ) : (
                                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                                          ✓ 세이브
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* 실전 복기 한 줄 메모장 */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/60">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                            <Icon name="edit3" className="w-3.5 h-3.5 text-indigo-500" />
                            <span>실전 복기 메모</span>
                          </div>
                          {editingMemoId !== session.id && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMemoId(session.id);
                                setEditingMemoText(session.memo || '');
                              }}
                              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <span>수정하기</span>
                            </button>
                          )}
                        </div>

                        {editingMemoId === session.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows="2"
                              value={editingMemoText}
                              onChange={(e) => setEditingMemoText(e.target.value)}
                              placeholder="이 시험에서 느낀 점, 지연 원인, 다음 회차 개선 전략을 기록하세요..."
                              className="w-full p-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingMemoId(null)}
                                className="px-3 py-1 text-xs font-semibold rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                              >
                                취소
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateMemo(session.id, editingMemoText)}
                                className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                              >
                                저장
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 italic">
                            {session.memo ? `"${session.memo}"` : <span className="text-zinc-400 not-italic">작성된 복기 메모가 없습니다. [수정하기]를 눌러 메모를 남겨보세요.</span>}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsDashboard;
