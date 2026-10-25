import { CSAT_DATE } from '../../constants/lounge';

// 초 → "mm:ss" (절댓값)
export const formatMMSS = (seconds) => {
  const safe = Math.abs(Math.round(Number(seconds) || 0));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// 초 → "+mm:ss" / "-mm:ss" / "±00:00"
export const formatSignedDelta = (seconds) => {
  const value = Math.round(Number(seconds) || 0);
  if (value === 0) return '±00:00';
  return `${value < 0 ? '-' : '+'}${formatMMSS(value)}`;
};

// "YYYY-MM-DD HH:MM" 또는 epoch ms → "방금 전" / "n분 전" / "n시간 전" / "n일 전"
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return '최근';
  let timestamp = null;
  if (typeof dateInput === 'number') {
    timestamp = dateInput;
  } else {
    const parsed = new Date(String(dateInput).replace(' ', 'T'));
    if (!Number.isNaN(parsed.getTime())) {
      timestamp = parsed.getTime();
    }
  }
  if (!timestamp) return String(dateInput);

  const diffMin = Math.floor((Date.now() - timestamp) / 60000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}시간 전`;
  return `${Math.floor(diffMin / 1440)}일 전`;
};

// 24시간 TTL 남은 시간 포맷팅 ("23시간 남음", "45분 남음")
export const formatRemainingTtl = (createdAt) => {
  if (!createdAt) return '24시간';
  const ageMs = Date.now() - Number(createdAt);
  const remainingMs = Math.max(0, (24 * 60 * 60 * 1000) - ageMs);
  const hours = Math.floor(remainingMs / (60 * 60 * 1000));
  const mins = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours}시간 ${mins}분 후 자동 삭제`;
  }
  if (mins > 0) {
    return `${mins}분 후 자동 삭제`;
  }
  return '곧 자동 삭제';
};

// 수능까지 남은 일수 (오늘 자정 기준)
export const getCsatDDay = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${CSAT_DATE}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
};

// D-Day 숫자 → 배지 라벨
export const formatDDayLabel = (dday) => {
  if (dday === 0) return 'D-DAY';
  if (dday > 0) return `D-${dday}`;
  return `D+${Math.abs(dday)}`;
};

// 내 로컬 실적(모의고사 완주 / Sprint 진행)을 티커 로그로 변환
export const buildUserActivityLogs = (examHistory, goals) => {
  const logs = [];

  if (Array.isArray(examHistory) && examHistory.length > 0) {
    const latest = examHistory[0];
    if (latest) {
      const minutes = Math.round((Number(latest.totalTargetSec) || 0) / 60);
      const hasDelta = typeof latest.totalDeltaSec === 'number';
      const deltaText = hasDelta ? ` (${formatSignedDelta(latest.totalDeltaSec)})` : '';
      const examLabel = minutes > 0
        ? `${latest.subjectName || '모의고사'} ${minutes}분 모의고사`
        : `${latest.subjectName || '모의고사'}`;
      logs.push({
        id: `my_exam_${latest.id || 'latest'}`,
        isMine: true,
        text: `🏆 [나]님이 '${examLabel}'를 완주했습니다${deltaText}`,
        time: formatRelativeTime(latest.date)
      });
    }
  }

  if (Array.isArray(goals)) {
    const progressed = goals.filter((g) => g && Number(g.completedAmount) > 0);
    if (progressed.length > 0) {
      const goal = progressed[progressed.length - 1];
      logs.push({
        id: `my_goal_${goal.id}`,
        isMine: true,
        text: `📚 [나]님이 '${goal.title}' ${goal.completedAmount}/${goal.totalAmount}${goal.unit || ''}까지 달성했습니다!`,
        time: goal.lastRecordDate || '최근'
      });
    }
  }

  return logs;
};

// examHistory prop이 없을 때 localStorage에서 직접 로드
export const loadExamHistoryFallback = () => {
  const keys = ['dc_exam_history_v2', 'dc_exam_history', 'dualcore_exam_history'];
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      // 손상된 값은 무시하고 다음 키 확인
    }
  }
  return [];
};

export const readExamHistoryFromStorage = loadExamHistoryFallback;

// 시험 파트 1개 → 벤치마크 구간 매칭 (id 우선, 이름 키워드 차선)
const findSegmentForPart = (subjectCfg, part) => {
  const id = String(part?.id || '');
  const name = String(part?.name || '');

  if (id) {
    const byId = subjectCfg.segments.find((seg) => seg.idPatterns.includes(id));
    if (byId) return byId;
  }

  for (const key of subjectCfg.matchOrder) {
    const seg = subjectCfg.segments.find((s) => s.key === key);
    if (seg && seg.keywords.some((kw) => name.includes(kw))) return seg;
  }
  return null;
};

// 시험 기록 → { [segmentKey]: 실제 소요초 | null }
export const aggregateRecordBySegment = (subjectCfg, record) => {
  const result = {};
  subjectCfg.segments.forEach((seg) => { result[seg.key] = null; });
  if (!record || !Array.isArray(record.parts)) return result;

  record.parts.forEach((part) => {
    const seg = findSegmentForPart(subjectCfg, part);
    if (!seg) return;
    const actual = Number(part.actualSec ?? part.actualSeconds ?? 0) || 0;
    result[seg.key] = (result[seg.key] || 0) + actual;
  });

  // 0초는 '측정 없음'으로 간주
  Object.keys(result).forEach((key) => {
    if (result[key] === 0) result[key] = null;
  });
  return result;
};
