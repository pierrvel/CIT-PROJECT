import React, { useState } from 'react';
import Icon from '../common/Icon';
import GoalEditModal from '../modals/GoalEditModal';
import { calculateGoalPacing, getCompletionForecast } from '../../utils/pacing';

export const SprintTab = ({
  goals,
  setGoals,
  inputDeltas,
  setInputDeltas,
  soundEnabled,
  playChime,
  setNewGoalModal,
  showToast
}) => {
  const [strategyModalGoal, setStrategyModalGoal] = useState(null);
  const [pruneInputVal, setPruneInputVal] = useState(0);
  const [editingGoal, setEditingGoal] = useState(null);

  const handleSaveEditedGoal = (updatedGoal) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === updatedGoal.id
          ? { ...g, ...updatedGoal, lastRecordDate: '목표 수정됨' }
          : g
      )
    );
    setEditingGoal(null);
    showToast(`'${updatedGoal.title}' 목표가 성공적으로 수정되었습니다.`, 'success');
  };

  const handleApplyStrategy = (goalId, mode, pruned = 0) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              strategyMode: mode,
              prunedAmount: mode === 'pruning' ? pruned : 0,
              lastRecordDate: '전략 재조정됨'
            }
          : g
      )
    );
    setStrategyModalGoal(null);
    showToast('학습 배분 전략이 성공적으로 업데이트되었습니다.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card bg-white/70 dark:bg-zinc-900/70 p-5 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              🏃 주간 Sprint 마일스톤
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              목표 {goals.length}개
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setNewGoalModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 transition-all"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>새 학습 목표 등록</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const pacing = calculateGoalPacing(goal);
          const forecast = getCompletionForecast(goal);
          const completedPct = Math.min(100, Math.round((goal.completedAmount / goal.totalAmount) * 100));
          const prunedPct = Math.min(100 - completedPct, Math.round(((goal.prunedAmount || 0) / goal.totalAmount) * 100));
          const inputVal = inputDeltas[goal.id] || '';

          return (
            <div
              key={goal.id}
              className={`glass-card rounded-2xl border p-6 shadow-glass dark:shadow-glass-dark transition-all duration-200 flex flex-col justify-between relative ${
                pacing.requiresAttention
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/80 shadow-glow-amber'
                  : 'bg-white/75 dark:bg-zinc-900/75 border-white/70 dark:border-zinc-800 hover:border-indigo-400/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300/50 dark:border-zinc-700">
                        {goal.unit}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white truncate">
                        {goal.title}
                      </h3>
                    </div>
                    {/* 🎯 목표 완주 예상일 계산 문구 */}
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                          forecast.isCompleted
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                            : forecast.isAhead
                            ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25'
                        }`}
                        title={forecast.text}
                      >
                        <Icon name={forecast.isCompleted ? 'checkCircle' : 'calendar'} className="w-3 h-3 shrink-0" />
                        <span>{forecast.text}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      D-{pacing.D}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingGoal(goal)}
                      title="학습 목표 수정"
                      className="p-1 rounded-lg text-zinc-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                    >
                      <Icon name="edit3" className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('이 학습 목표를 삭제하시겠습니까?')) {
                          setGoals((prev) => prev.filter((g) => g.id !== goal.id));
                          showToast('목표가 삭제되었습니다.', 'info');
                        }
                      }}
                      className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="학습 목표 삭제"
                    >
                      <Icon name="trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {pacing.requiresAttention ? (
                    <button
                      type="button"
                      onClick={() => { setStrategyModalGoal(goal); setPruneInputVal(goal.prunedAmount || 0); }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-500/30 hover:bg-amber-600 transition-all animate-bounce"
                    >
                      <Icon name="alertTriangle" className="w-3.5 h-3.5" />
                      <span>⚠️ 계획 재조정 필요 (전략 선택)</span>
                    </button>
                  ) : goal.strategyMode !== 'normal' ? (
                    <button
                      type="button"
                      onClick={() => { setStrategyModalGoal(goal); setPruneInputVal(goal.prunedAmount || 0); }}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-500/20"
                    >
                      <Icon name="sparkles" className="w-3.5 h-3.5" />
                      <span>{pacing.badgeText} (변경)</span>
                    </button>
                  ) : null}
                </div>

                <div className="mt-2">
                  <div className="flex items-baseline justify-between mb-1.5 font-mono">
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                      {goal.completedAmount}
                      <span className="text-sm font-normal text-zinc-400 dark:text-zinc-500 ml-1">
                        / {goal.totalAmount} {goal.unit}
                      </span>
                    </span>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      {goal.prunedAmount > 0 && (
                        <span className="text-amber-600 dark:text-amber-400">
                          제외: {goal.prunedAmount}{goal.unit} ({prunedPct}%)
                        </span>
                      )}
                      <span className="text-indigo-600 dark:text-indigo-400">
                        완료 {completedPct}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-3.5 bg-zinc-200/80 dark:bg-zinc-800 rounded-full overflow-hidden flex p-0.5 border border-zinc-200/60 dark:border-zinc-700/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${completedPct}%` }}
                    />
                    {prunedPct > 0 && (
                      <div
                        className="h-full bg-amber-400 dark:bg-amber-500 border-l border-white/40 dark:border-zinc-900/40 relative rounded-r-full"
                        style={{ width: `${prunedPct}%` }}
                        title={`가지치기 제외: ${goal.prunedAmount}${goal.unit}`}
                      />
                    )}
                  </div>
                </div>

                <div className={`mt-4 p-3.5 rounded-xl border text-xs sm:text-sm ${
                  pacing.requiresAttention
                    ? 'bg-amber-100/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-medium'
                    : 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <Icon name={pacing.requiresAttention ? 'alertTriangle' : 'sparkles'} className="w-4 h-4 mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    <div className="flex-1">
                      <p className="leading-relaxed">{pacing.guideText}</p>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                        <span>마감까지 잔여: {pacing.R} {goal.unit}</span>
                        <span>•</span>
                        <span>하루 소화 한도: {goal.dailyCap} {goal.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 당일 실적 입력 */}
              <div className="mt-6 pt-5 border-t border-zinc-200/60 dark:border-zinc-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">오늘 실적 입력</span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">최근: {goal.lastRecordDate}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex rounded-xl p-0.5 bg-zinc-200/70 dark:bg-zinc-800/70 border border-zinc-300/40 dark:border-zinc-700/40">
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playChime(700, 'sine', 0.08);
                        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, completedAmount: Math.max(0, g.completedAmount - 1), lastRecordDate: '방금 전' } : g));
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playChime(700, 'sine', 0.08);
                        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, completedAmount: Math.min(g.totalAmount, g.completedAmount + 1), lastRecordDate: '방금 전' } : g));
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-zinc-700"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playChime(700, 'sine', 0.08);
                        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, completedAmount: Math.min(g.totalAmount, g.completedAmount + 5), lastRecordDate: '방금 전' } : g));
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-zinc-700"
                    >
                      +5
                    </button>
                  </div>

                  <div className="flex-1 flex items-center gap-1.5 min-w-[130px]">
                    <input
                      type="number"
                      placeholder={`+수량`}
                      value={inputVal}
                      onChange={(e) => setInputDeltas(prev => ({ ...prev, [goal.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = Number(inputDeltas[goal.id]);
                          if (!isNaN(val) && val !== 0) {
                            setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, completedAmount: Math.max(0, Math.min(g.totalAmount, g.completedAmount + val)), lastRecordDate: '방금 전' } : g));
                            setInputDeltas(prev => ({ ...prev, [goal.id]: '' }));
                          }
                        }
                      }}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300/70 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = Number(inputDeltas[goal.id]);
                        if (!isNaN(val) && val !== 0) {
                          setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, completedAmount: Math.max(0, Math.min(g.totalAmount, g.completedAmount + val)), lastRecordDate: '방금 전' } : g));
                          setInputDeltas(prev => ({ ...prev, [goal.id]: '' }));
                        }
                      }}
                      className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
                    >
                      기록
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 전략 재조정 모달 */}
      {strategyModalGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg glass-card bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                💡 [{strategyModalGoal.title}] 적응형 재배분 전략
              </h3>
              <button
                type="button"
                onClick={() => setStrategyModalGoal(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <Icon name="x" className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              목표 완주를 위해 상황에 맞는 전략을 선택해주세요:
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleApplyStrategy(strategyModalGoal.id, 'forced_increase')}
                className="w-full p-4 rounded-2xl border text-left hover:border-indigo-500 bg-zinc-50 dark:bg-zinc-800/60 transition-all space-y-1"
              >
                <div className="font-bold text-sm text-indigo-600 dark:text-indigo-400">전략 A: 강제 상향 (초과 허용)</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300">
                  하루 소화 한도를 넘어 매일 남은 분량을 균등하게 나눕니다.
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyStrategy(strategyModalGoal.id, 'weekend_rollover')}
                className="w-full p-4 rounded-2xl border text-left hover:border-indigo-500 bg-zinc-50 dark:bg-zinc-800/60 transition-all space-y-1"
              >
                <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">전략 B: 주말 이월 (평일 한도 유지)</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300">
                  평일에는 하루 소화 한도만 풀고, 초과 분량은 주말에 몰아서 완주합니다.
                </div>
              </button>

              <div className="p-4 rounded-2xl border bg-zinc-50 dark:bg-zinc-800/60 space-y-2">
                <div className="font-bold text-sm text-amber-600 dark:text-amber-400">전략 C: 범위 가지치기 (일부 제외)</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300">
                  우선순위가 낮은 분량을 과감하게 제외하여 현실적인 매일 목표를 맞춥니다.
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    min="1"
                    max={strategyModalGoal.totalAmount - strategyModalGoal.completedAmount}
                    value={pruneInputVal}
                    onChange={(e) => setPruneInputVal(Number(e.target.value) || 0)}
                    placeholder="제외할 분량"
                    className="w-28 px-3 py-1.5 text-xs font-mono rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                  />
                  <span className="text-xs text-zinc-500">{strategyModalGoal.unit} 제외</span>
                  <button
                    type="button"
                    onClick={() => handleApplyStrategy(strategyModalGoal.id, 'pruning', pruneInputVal)}
                    className="ml-auto px-4 py-1.5 text-xs font-bold rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                  >
                    가지치기 적용
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleApplyStrategy(strategyModalGoal.id, 'normal')}
                className="w-full p-2.5 rounded-xl border text-xs text-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                기본 일반 모드로 초기화
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 목표 편집 모달 */}
      <GoalEditModal
        isOpen={!!editingGoal}
        goal={editingGoal}
        onClose={() => setEditingGoal(null)}
        onSave={handleSaveEditedGoal}
      />
    </div>
  );
};

export default SprintTab;
