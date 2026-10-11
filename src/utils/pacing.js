// 시간 포맷팅 헬퍼
export const formatTime = (totalSec) => {
  const isNeg = totalSec < 0;
  const abs = Math.abs(totalSec);
  const m = Math.floor(abs / 60);
  const s = abs % 60;
  return `${isNeg ? '-' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// 마감일 및 평일/주말 계산
export const getDaysUntil = (deadlineStr) => {
  if (!deadlineStr) return 1;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(deadlineStr); target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

export const getDayBreakdown = (deadlineStr) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(deadlineStr); target.setHours(0, 0, 0, 0);
  let weekdays = 0, weekends = 0, cur = new Date(today);
  cur.setDate(cur.getDate() + 1);
  while (cur <= target) {
    const day = cur.getDay();
    if (day === 0 || day === 6) weekends++;
    else weekdays++;
    cur.setDate(cur.getDate() + 1);
  }
  if (weekdays === 0 && weekends === 0) weekdays = 1;
  return { weekdays, weekends, totalDays: weekdays + weekends };
};

// Sprint 적응형 3-Way 재계산 엔진
export const calculateGoalPacing = (goal) => {
  const D = getDaysUntil(goal.deadline);
  const { weekdays, weekends } = getDayBreakdown(goal.deadline);
  const pruned = goal.prunedAmount || 0;
  const R = Math.max(0, goal.totalAmount - goal.completedAmount - pruned);
  const Q = Math.ceil(R / D);
  const isOverCap = Q > goal.dailyCap && R > 0;
  const mode = goal.strategyMode || 'normal';

  let result = {
    D, R, Q, isOverCap, weekdays, weekends, mode,
    dailyTarget: Q, badgeText: '', guideText: '',
    requiresAttention: isOverCap && mode === 'normal'
  };

  if (R === 0) {
    result.dailyTarget = 0;
    result.guideText = '🎉 목표 분량을 100% 완수했습니다!';
    return result;
  }

  if (mode === 'forced_increase') {
    result.dailyTarget = Q;
    result.badgeText = '전략 A: 강제 상향';
    result.guideText = `마감일까지 매일 ${Q} ${goal.unit} 씩 소화해야 완주합니다. (한도 ${goal.dailyCap} 초과 허용)`;
  } else if (mode === 'weekend_rollover') {
    const weekdayCap = goal.dailyCap;
    const weekdayCapacity = weekdays * weekdayCap;
    const excess = Math.max(0, R - weekdayCapacity);
    const weekendTarget = weekends > 0 ? Math.ceil(excess / weekends) : Q;
    result.dailyTarget = weekdayCap;
    result.badgeText = '전략 B: 주말 이월';
    result.guideText = `평일은 매일 ${weekdayCap} ${goal.unit}, 주말에는 ${weekendTarget} ${goal.unit} 씩 집중 소화합니다.`;
  } else if (mode === 'pruning') {
    result.dailyTarget = Q;
    result.badgeText = '전략 C: 범위 가지치기';
    result.guideText = `${pruned} ${goal.unit} 을(를) 제외하고, 매일 ${Q} ${goal.unit} 씩 소화합니다.`;
  } else {
    result.dailyTarget = Q;
    if (isOverCap) {
      result.badgeText = '계획 재조정 필요';
      result.guideText = `⚠️ 일일 소화 한도(${goal.dailyCap} ${goal.unit})를 초과했습니다. 현실적인 3가지 전략 중 하나를 선택하세요.`;
    } else {
      result.guideText = `내일 권장 분량: 하루 ${Q} ${goal.unit} (마감일까지 균등 분배)`;
    }
  }
  return result;
};
