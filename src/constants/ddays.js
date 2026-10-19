// ==========================================================
// 🎯 듀얼코어 콕핏 D-Day 기본 프리셋 및 헬퍼 상수
// ==========================================================

export const DEFAULT_DDAYS = [
  {
    id: 'csat_2027',
    title: '2027 수능',
    date: '2026-11-19',
    category: 'csat',
    isPreset: true
  },
  {
    id: 'eval_2026_10',
    title: '10월 학평',
    date: '2026-10-20',
    category: 'mock',
    isPreset: true
  },
  {
    id: 'eval_2026_06',
    title: '6월 모의평가',
    date: '2026-06-04',
    category: 'mock',
    isPreset: true
  },
  {
    id: 'eval_2026_09',
    title: '9월 모의평가',
    date: '2026-09-02',
    category: 'mock',
    isPreset: true
  },
  {
    id: 'susi_2026_09',
    title: '수시 원서접수',
    date: '2026-09-07',
    category: 'susi',
    isPreset: true
  }
];

export const DDAY_PRESET_TEMPLATES = [
  { title: '2027 본수능', date: '2026-11-19', category: 'csat' },
  { title: '10월 학평', date: '2026-10-20', category: 'mock' },
  { title: '6월 모의평가', date: '2026-06-04', category: 'mock' },
  { title: '9월 모의평가', date: '2026-09-02', category: 'mock' },
  { title: '수시 원서접수', date: '2026-09-07', category: 'susi' },
  { title: '정시 원서접수', date: '2026-12-28', category: 'jungsi' }
];

const KOR_DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

// YYYY-MM-DD -> 2026.11.19 (목)
export const formatDDayDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const dayName = KOR_DAY_NAMES[d.getDay()] || '';
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}.${mm}.${dd} (${dayName})`;
};

// D-Day 일수 계산 (미래: D-XX, 오늘: D-DAY, 과거: D+XX)
export const calculateDDay = (targetDateStr) => {
  if (!targetDateStr) return { text: 'D-?', days: 0, status: 'unknown' };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = targetDateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d, 0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { text: 'D-DAY', days: 0, status: 'today' };
  } else if (diffDays > 0) {
    return { text: `D-${diffDays}`, days: diffDays, status: 'future' };
  } else {
    return { text: `D+${Math.abs(diffDays)}`, days: diffDays, status: 'past' };
  }
};
