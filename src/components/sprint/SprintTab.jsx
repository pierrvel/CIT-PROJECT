import React, { useState } from 'react';
import Icon from '../common/Icon';
import GoalEditModal from '../modals/GoalEditModal';
import { calculateGoalPacing } from '../../utils/pacing';

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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-5 rounded-[20px]">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              주간 Sprint 마일스톤
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full apple-glass-well text-[#0071E3] dark:text-[#2997FF]">
              {goals.length} Active
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-[#6E6E73] dark:text-[#A1A1A6] mt-1">
            지연 발생 시 강제 상향 · 주말 이월 · 범위 가지치기의 3가지 적응형 재배분 전략을 지원합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNewGoalModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all shrink-0"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>새 학습 목표 등록</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {goals.map((goal) => {
          const pacing = calculateGoalPacing(goal);
          const completedPct = Math.min(100, Math.round((goal.completedAmount / goal.totalAmount) * 100));
          const prunedPct = Math.min(100 - completedPct, Math.round(((goal.prunedAmount || 0) / goal.totalAmount) * 100));
          const inputVal = inputDeltas[goal.id] || '';

          return (
            <div
              key={goal.id}
              className={`glass-card rounded-[20px] p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between relative ${
                pacing.requiresAttention
                  ? 'ring-1 ring-[#9A6700]/40 dark:ring-[#FFD60A]/40'
                  : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-[6px] apple-glass-well text-[#6E6E73] dark:text-[#A1A1A6]">
                      {goal.unit}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
                      {goal.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#D70015]/10 text-[#D70015] dark:text-[#FF453A]">
                      D-{pacing.D}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingGoal(goal)}
                      title="학습 목표 수정"
                      className="p-1.5 rounded-[8px] text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
                    >
                      <Icon name="edit3" className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('이 학습 목표를 삭제하시겠습니까?')) {
                          setGoals((prev) => prev.filter((g) => g.id !== goal.id));
                          showToast('목표가 삭제되었습니다.', 'info');
                        }
                      }}
                      className="p-1.5 rounded-[8px] text-[#6E6E73] hover:text-[#D70015] hover:bg-[#D70015]/10 transition-colors"
                      title="학습 목표 삭제"
                    >
                      <Icon name="trash2" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {pacing.requiresAttention ? (
                    <button
                      type="button"
                      onClick={() => { setStrategyModalGoal(goal); setPruneInputVal(goal.prunedAmount || 0); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-[#9A6700]/15 dark:bg-[#FFD60A]/15 text-[#9A6700] dark:text-[#FFD60A] border border-[#9A6700]/30 text-xs font-semibold hover:opacity-90 transition-all"
                    >
                      <Icon name="alertTriangle" className="w-3.5 h-3.5" />
                      <span>계획 재조정 필요 · 전략 선택</span>
                    </button>
                  ) : goal.strategyMode !== 'normal' ? (
                    <button
                      type="button"
                      onClick={() => { setStrategyModalGoal(goal); setPruneInputVal(goal.prunedAmount || 0); }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-[#0071E3]/10 text-[#0071E3] dark:text-[#2997FF] text-xs font-semibold hover:bg-[#0071E3]/15 transition-all"
                    >
                      <Icon name="sparkles" className="w-3.5 h-3.5" />
                      <span>{pacing.badgeText} · 변경</span>
                    </button>
                  ) : null}
                </div>

                <div className="mt-2">
                  <div className="flex items-baseline justify-between mb-1.5 font-mono">
                    <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                      {goal.completedAmount}
                      <span className="text-xs font-normal text-[#86868B] ml-1.5">
                        / {goal.totalAmount} {goal.unit}
                      </span>
                    </span>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      {goal.prunedAmount > 0 && (
                        <span className="text-[#9A6700] dark:text-[#FFD60A]">
                          제외 {goal.prunedAmount}{goal.unit} ({prunedPct}%)
                        </span>
                      )}
                      <span className="text-[#0071E3] dark:text-[#2997FF]">
                        {completedPct}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 apple-glass-well rounded-full overflow-hidden flex p-0.5">
                    <div
                      className="h-full rounded-full bg-[#0071E3] dark:bg-[#2997FF] transition-all duration-500"
                      style={{ width: `${completedPct}%` }}
                    />
                    {prunedPct > 0 && (
                      <div
                        className="h-full bg-[#9A6700] dark:bg-[#FFD60A] border-l border-white/40 dark:border-zinc-900/40 relative rounded-r-full"
                        style={{ width: `${prunedPct}%` }}
                        title={`가지치기 제외: ${goal.prunedAmount}${goal.unit}`}
                      />
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-[14px] apple-glass-well text-xs">
                  <div className="flex items-start gap-2.5">
                    <Icon
                      name={pacing.requiresAttention ? 'alertTriangle' : 'sparkles'}
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        pacing.requiresAttention
                          ? 'text-[#9A6700] dark:text-[#FFD60A]'
                          : 'text-[#0071E3] dark:text-[#2997FF]'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="leading-relaxed text-[#1D1D1F] dark:text-[#F5F5F7] font-medium">
                        {pacing.guideText}
                      </p>
                      <div className="mt-1.5 flex items-center gap-3 text-[11px] text-[#6E6E73] dark:text-[#A1A1A6] font-mono">
                        <span>잔여 {pacing.R}{goal.unit}</span>
                        <span>·</span>
                        <span>일일 한도 {goal.dailyCap}{goal.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 당일 실적 입력 */}
              <div className="mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.07]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#6E6E73] dark:text-[#A1A1A6]">오늘 실적 기록</span>
                  <span className="text-[11px] text-[#86868B] font-mono">최근: {goal.lastRecordDate}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex rounded-[10px] p-0.5 apple-glass-well">
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playChime(700, 'sine', 0.08);
                        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, completedAmount: Math.max(0, g.completedAmount - 1), lastRecordDate: '방금 전' } : g));
                      }}
                      className="px-2.5 py-1.5 rounded-[8px] text-xs font-mono font-semibold text-[#1D1D1F] dark:text-white hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playChime(700, 'sine', 0.08);
                        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, completedAmount: Math.min(g.totalAmount, g.completedAmount + 1), lastRecordDate: '방금 전' } : g));
                      }}
                      className="px-2.5 py-1.5 rounded-[8px] text-xs font-mono font-semibold text-[#0071E3] dark:text-[#2997FF] hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playChime(700, 'sine', 0.08);
                        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, completedAmount: Math.min(g.totalAmount, g.completedAmount + 5), lastRecordDate: '방금 전' } : g));
                      }}
                      className="px-3 py-1.5 rounded-[8px] text-xs font-mono font-semibold text-[#0071E3] dark:text-[#2997FF] hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                    >
                      +5
                    </button>
                  </div>

                  <div className="flex-1 flex items-center gap-1.5 min-w-[130px]">
                    <input
                      type="number"
                      placeholder="+수량"
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
                      className="w-full px-3 py-1.5 text-xs sm:text-sm font-mono rounded-[10px] apple-glass-well text-[#1D1D1F] dark:text-white focus:outline-none"
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
                      className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-[10px] bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] hover:opacity-90 active:scale-[0.99] transition-all whitespace-nowrap"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg glass-card rounded-[22px] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <h3 className="font-semibold text-base sm:text-lg text-zinc-900 dark:text-white">
                {strategyModalGoal.title} · 적응형 재배분 전략
              </h3>
              <button
                type="button"
                onClick={() => setStrategyModalGoal(null)}
                className="p-1.5 rounded-[8px] text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-white"
              >
                <Icon name="x" className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#6E6E73] dark:text-[#A1A1A6]">
              목표 완주를 위해 상황에 맞는 배분 방식을 선택하세요.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleApplyStrategy(strategyModalGoal.id, 'forced_increase')}
                className="w-full p-4 rounded-[14px] apple-glass-well text-left hover:ring-1 hover:ring-[#0071E3] transition-all space-y-1"
              >
                <div className="font-semibold text-sm text-[#0071E3] dark:text-[#2997FF]">전략 A · 강제 상향 (초과 허용)</div>
                <div className="text-xs text-[#6E6E73] dark:text-[#A1A1A6]">
                  일일 소화 한도를 넘어 남은 분량을 마감일까지 균등하게 배분합니다.
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyStrategy(strategyModalGoal.id, 'weekend_rollover')}
                className="w-full p-4 rounded-[14px] apple-glass-well text-left hover:ring-1 hover:ring-[#248A3D] transition-all space-y-1"
              >
                <div className="font-semibold text-sm text-[#248A3D] dark:text-[#30D158]">전략 B · 주말 이월 (평일 한도 유지)</div>
                <div className="text-xs text-[#6E6E73] dark:text-[#A1A1A6]">
                  평일에는 일일 한도만 소화하고, 초과 분량은 주말에 집중 배분합니다.
                </div>
              </button>

              <div className="p-4 rounded-[14px] apple-glass-well space-y-2.5">
                <div className="font-semibold text-sm text-[#9A6700] dark:text-[#FFD60A]">전략 C · 범위 가지치기 (일부 제외)</div>
                <div className="text-xs text-[#6E6E73] dark:text-[#A1A1A6]">
                  우선순위가 낮은 분량을 제외하여 현실적인 일일 목표량을 맞춥니다.
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    min="1"
                    max={strategyModalGoal.totalAmount - strategyModalGoal.completedAmount}
                    value={pruneInputVal}
                    onChange={(e) => setPruneInputVal(Number(e.target.value) || 0)}
                    placeholder="제외 분량"
                    className="w-28 px-3 py-1.5 text-xs font-mono rounded-[10px] bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10"
                  />
                  <span className="text-xs text-[#6E6E73]">{strategyModalGoal.unit} 제외</span>
                  <button
                    type="button"
                    onClick={() => handleApplyStrategy(strategyModalGoal.id, 'pruning', pruneInputVal)}
                    className="ml-auto px-3.5 py-1.5 text-xs font-semibold rounded-[10px] bg-[#0071E3] text-white hover:bg-[#0077ED]"
                  >
                    적용
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleApplyStrategy(strategyModalGoal.id, 'normal')}
                className="w-full p-2.5 rounded-[12px] apple-glass-well text-xs font-medium text-center text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-white"
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
