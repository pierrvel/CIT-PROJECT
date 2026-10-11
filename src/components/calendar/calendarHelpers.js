// ==========================================================
// 📅 입시 캘린더 날짜 계산 및 시각화 헬퍼 함수
// ==========================================================

const KOR_DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

// 오늘 자정 기준 날짜 구하기
export const getTodayMidnight = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// YYYY-MM-DD 기준 D-Day 일수 계산 (미래: 양수, 오늘: 0, 과거: 음수)
export const getDaysUntil = (dateStr) => {
  if (!dateStr) return 0;
  const today = getTodayMidnight();
  const [year, month, day] = dateStr.split('-').map(Number);
  const target = new Date(year, month - 1, day, 0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

// "2026-10-14" → "2026.10.14 (수)"
export const formatDateWithDay = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const dayName = KOR_DAY_NAMES[d.getDay()];
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}.${mm}.${dd} (${dayName})`;
};

// 날짜 범위 포맷팅
export const formatDateRange = (startStr, endStr) => {
  if (!startStr) return '';
  if (!endStr) return formatDateWithDay(startStr);
  const [sYear, sMonth, sDay] = startStr.split('-').map(Number);
  const [eYear, eMonth, eDay] = endStr.split('-').map(Number);
  const sDate = new Date(sYear, sMonth - 1, sDay);
  const eDate = new Date(eYear, eMonth - 1, eDay);

  const sDayName = KOR_DAY_NAMES[sDate.getDay()];
  const eDayName = KOR_DAY_NAMES[eDate.getDay()];

  if (sYear === eYear) {
    return `${sYear}.${String(sMonth).padStart(2, '0')}.${String(sDay).padStart(2, '0')} (${sDayName}) ~ ${String(eMonth).padStart(2, '0')}.${String(eDay).padStart(2, '0')} (${eDayName})`;
  }
  return `${formatDateWithDay(startStr)} ~ ${formatDateWithDay(endStr)}`;
};

// 시작일자 ~ 종료일자 사이의 모든 YYYY-MM-DD 날짜 배열 산출 (최대 90일 보호)
export const getDatesInRange = (startDateStr, endDateStr) => {
  const dates = [];
  if (!startDateStr) return dates;
  if (!endDateStr || endDateStr <= startDateStr) {
    dates.push(startDateStr);
    return dates;
  }

  const [sY, sM, sD] = startDateStr.split('-').map(Number);
  const [eY, eM, eD] = endDateStr.split('-').map(Number);
  const cur = new Date(sY, sM - 1, sD);
  const end = new Date(eY, eM - 1, eD);

  let count = 0;
  while (cur <= end && count < 90) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    cur.setDate(cur.getDate() + 1);
    count++;
  }
  return dates;
};

// D-Day 뱃지 텍스트 및 스타일 토큰
export const getDDayBadgeProps = (diffDays) => {
  if (diffDays === 0) {
    return {
      label: 'D-DAY',
      subLabel: '오늘 시행',
      bgClass: 'bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse',
      cardBorder: 'border-rose-500/50 dark:border-rose-500/50 ring-2 ring-rose-500/20',
      isToday: true,
      isPast: false
    };
  }
  if (diffDays > 0) {
    if (diffDays <= 7) {
      return {
        label: `D-${diffDays}`,
        subLabel: '이번 주',
        bgClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-black',
        cardBorder: 'border-rose-500/30 dark:border-rose-500/30',
        isToday: false,
        isPast: false
      };
    }
    if (diffDays <= 30) {
      return {
        label: `D-${diffDays}`,
        subLabel: '한 달 이내',
        bgClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold',
        cardBorder: 'border-amber-500/25 dark:border-amber-500/25',
        isToday: false,
        isPast: false
      };
    }
    return {
      label: `D-${diffDays}`,
      subLabel: '예정',
      bgClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-bold',
      cardBorder: 'border-zinc-200/80 dark:border-zinc-800',
      isToday: false,
      isPast: false
    };
  }
  // 과거 일정
  return {
    label: `D+${Math.abs(diffDays)}`,
    subLabel: '종료',
    bgClass: 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-300/40 dark:border-zinc-700/50',
    cardBorder: 'border-zinc-200/50 dark:border-zinc-800/60 opacity-60 dark:opacity-50',
    isToday: false,
    isPast: true
  };
};

// 카테고리별 테마 스타일 반환
export const getCategoryBadgeStyle = (group) => {
  switch (group) {
    case 'mock':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    case 'susi':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'jungsi':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    case 'custom':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    default:
      return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
  }
};

// 현재 시점에서 가장 임박한 핵심 다음 마일스톤 찾기
export const findNextKeyUpcomingMilestone = (allMilestones) => {
  if (!Array.isArray(allMilestones) || allMilestones.length === 0) return null;

  // 오늘 이후 일정만 필터링
  const upcoming = allMilestones
    .map((m) => ({ ...m, diffDays: getDaysUntil(m.date) }))
    .filter((m) => m.diffDays >= 0)
    .sort((a, b) => a.diffDays - b.diffDays);

  if (upcoming.length === 0) return null;

  // 가장 가까운 중요 시험(high)이 15일 이내에 있으면 그것을, 아니면 가장 첫 번째 upcoming 일정
  return upcoming[0];
};

// 2027 수능 연간 진척도 (2026-01-01 ~ 2026-11-19)
export const getCsatYearProgress = (csatDateStr = '2026-11-19') => {
  const start = new Date(2026, 0, 1).getTime();
  const [y, m, d] = csatDateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d).getTime();
  const now = Date.now();

  const total = target - start;
  const elapsed = Math.max(0, now - start);
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
  return Math.round(pct);
};
