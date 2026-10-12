/**
 * 전과목 표준점수 / 백분위 / 누적백분위 산출 및 정시 대학 모의지원 엔진
 */

import { EXAM_CUTOFFS } from '../constants/cutoffs';
import { ADMISSION_TIERS } from '../constants/universities';

// 1. 단일 과목 원점수 -> 표준점수 & 백분위 변환
export const convertSubjectScore = (examId, subjectKey, optionKey, rawScore) => {
  const exam = EXAM_CUTOFFS[examId] || EXAM_CUTOFFS['2025_csat'];
  const subData = exam[subjectKey] || exam['korean'];
  const maxRaw = subData.totalScore || (subjectKey === 'inquiry' ? 50 : 100);
  const clampedRaw = Math.max(0, Math.min(maxRaw, Number(rawScore) || 0));

  let cuts = [90, 80, 70, 60];
  let optName = '';

  if (subData.isAbsolute) {
    cuts = subData.cuts || [90, 80, 70, 60];
  } else if (subData.options) {
    const opt = subData.options[optionKey] || Object.values(subData.options)[0];
    cuts = opt.cuts;
    optName = opt.name;
  } else if (subData.cuts) {
    cuts = subData.cuts;
  }

  // 등급 계산 (1~9등급)
  let grade = 9;
  if (clampedRaw >= cuts[0]) grade = 1;
  else if (clampedRaw >= cuts[1]) grade = 2;
  else if (clampedRaw >= cuts[2]) grade = 3;
  else if (clampedRaw >= cuts[3]) grade = 4;
  else if (clampedRaw >= cuts[3] - 10) grade = 5;
  else if (clampedRaw >= cuts[3] - 20) grade = 6;
  else if (clampedRaw >= cuts[3] - 30) grade = 7;
  else if (clampedRaw >= cuts[3] - 40) grade = 8;
  else grade = 9;

  // 백분위 계산 (100 ~ 10 정밀 매핑)
  let percentile = 50;
  if (grade === 1) {
    const denom = Math.max(1, maxRaw - cuts[0]);
    percentile = Math.min(100, Math.round(96 + ((clampedRaw - cuts[0]) / denom) * 4));
  } else if (grade === 2) {
    const denom = Math.max(1, cuts[0] - cuts[1]);
    percentile = Math.min(95, Math.round(89 + ((clampedRaw - cuts[1]) / denom) * 6));
  } else if (grade === 3) {
    const denom = Math.max(1, cuts[1] - cuts[2]);
    percentile = Math.min(88, Math.round(77 + ((clampedRaw - cuts[2]) / denom) * 11));
  } else if (grade === 4) {
    const denom = Math.max(1, cuts[2] - cuts[3]);
    percentile = Math.min(76, Math.round(60 + ((clampedRaw - cuts[3]) / denom) * 16));
  } else {
    percentile = Math.max(5, Math.round((clampedRaw / Math.max(1, cuts[3])) * 55));
  }

  // 표준점수 계산 (수능 실채점 기준치 역추산)
  let standardScore = 100;
  if (subjectKey === 'korean') {
    // 국어 만점 표점 138~150, 1컷 표점 130 내외
    const baseCut1Std = 131;
    const maxStd = 142;
    if (clampedRaw >= cuts[0]) {
      standardScore = Math.round(baseCut1Std + ((clampedRaw - cuts[0]) / Math.max(1, maxRaw - cuts[0])) * (maxStd - baseCut1Std));
    } else {
      standardScore = Math.max(40, Math.round(baseCut1Std - ((cuts[0] - clampedRaw) / Math.max(1, cuts[0])) * 55));
    }
  } else if (subjectKey === 'math') {
    // 수학 만점 표점 145~148, 1컷 표점 133 내외
    const baseCut1Std = 133;
    const maxStd = 146;
    if (clampedRaw >= cuts[0]) {
      standardScore = Math.round(baseCut1Std + ((clampedRaw - cuts[0]) / Math.max(1, maxRaw - cuts[0])) * (maxStd - baseCut1Std));
    } else {
      standardScore = Math.max(35, Math.round(baseCut1Std - ((cuts[0] - clampedRaw) / Math.max(1, cuts[0])) * 60));
    }
  } else if (subjectKey === 'inquiry') {
    // 탐구 50점 만점 표점 약 68~72, 1컷 표점 약 65
    const baseCut1Std = 65;
    const maxStd = 70;
    if (clampedRaw >= cuts[0]) {
      standardScore = Math.round(baseCut1Std + ((clampedRaw - cuts[0]) / Math.max(1, maxRaw - cuts[0])) * (maxStd - baseCut1Std));
    } else {
      standardScore = Math.max(20, Math.round(baseCut1Std - ((cuts[0] - clampedRaw) / Math.max(1, cuts[0])) * 35));
    }
  } else {
    // 영어/한국사: 절대평가 (표준점수 미표기, 등급 활용)
    standardScore = clampedRaw;
  }

  return {
    rawScore: clampedRaw,
    maxRaw,
    grade,
    percentile,
    standardScore,
    optName,
    cuts
  };
};

// 2. 국수탐 백분위 평균 -> 전국 누적 백분위(누백 %) 추정 모델
// 수능 응시자(약 42만 명) 실채점 누적 도수분포 회귀 분석 함수
export const estimateCumulativePercent = (avgPercentile) => {
  const p = Math.max(0, Math.min(100, Number(avgPercentile) || 0));

  if (p >= 99.5) {
    // 99.5 ~ 100 -> 상위 0.05% ~ 0.15%
    return Number((0.05 + (100 - p) * 0.2).toFixed(2));
  } else if (p >= 98.0) {
    // 98.0 ~ 99.5 -> 상위 0.15% ~ 0.50%
    return Number((0.15 + ((99.5 - p) / 1.5) * 0.35).toFixed(2));
  } else if (p >= 96.0) {
    // 96.0 ~ 98.0 -> 상위 0.50% ~ 1.20%
    return Number((0.50 + ((98.0 - p) / 2.0) * 0.70).toFixed(2));
  } else if (p >= 93.5) {
    // 93.5 ~ 96.0 -> 상위 1.20% ~ 2.80%
    return Number((1.20 + ((96.0 - p) / 2.5) * 1.60).toFixed(2));
  } else if (p >= 89.5) {
    // 89.5 ~ 93.5 -> 상위 2.80% ~ 6.00%
    return Number((2.80 + ((93.5 - p) / 4.0) * 3.20).toFixed(2));
  } else if (p >= 84.5) {
    // 84.5 ~ 89.5 -> 상위 6.00% ~ 11.00%
    return Number((6.00 + ((89.5 - p) / 5.0) * 5.00).toFixed(2));
  } else if (p >= 77.0) {
    // 77.0 ~ 84.5 -> 상위 11.00% ~ 20.00%
    return Number((11.00 + ((84.5 - p) / 7.5) * 9.00).toFixed(2));
  } else if (p >= 65.0) {
    // 65.0 ~ 77.0 -> 상위 20.00% ~ 35.00%
    return Number((20.00 + ((77.0 - p) / 12.0) * 15.00).toFixed(2));
  } else {
    // 65.0 미만
    return Number(Math.min(99.9, 35.00 + (65.0 - p) * 1.2).toFixed(2));
  }
};

// 3. 전과목 종합 성적 및 정시 지표 계산
export const calculateOverallAdmission = ({
  examId = '2025_csat',
  korean = { raw: 92, option: 'speech' },
  math = { raw: 84, option: 'calculus' },
  english = { raw: 90 },
  history = { raw: 40 },
  inquiry1 = { raw: 45, name: '탐구1' },
  inquiry2 = { raw: 44, name: '탐구2' }
}) => {
  const korData = convertSubjectScore(examId, 'korean', korean.option, korean.raw);
  const mathData = convertSubjectScore(examId, 'math', math.option, math.raw);
  const engData = convertSubjectScore(examId, 'english', null, english.raw);
  const histData = convertSubjectScore(examId, 'history', null, history.raw);
  const inq1Data = convertSubjectScore(examId, 'inquiry', null, inquiry1.raw);
  const inq2Data = convertSubjectScore(examId, 'inquiry', null, inquiry2.raw);

  // 탐구 평균 백분위
  const inqAvgPercentile = Number(((inq1Data.percentile + inq2Data.percentile) / 2).toFixed(1));

  // 국수탐 단순 백분위 평균 (국어 백분위 + 수학 백분위 + 탐구평균 백분위) / 3
  const avgPercentile = Number(((korData.percentile + mathData.percentile + inqAvgPercentile) / 3).toFixed(2));

  // 국수탐 표점합 (국어 표점 + 수학 표점 + 탐1 표점 + 탐2 표점)
  const totalStdScore = korData.standardScore + mathData.standardScore + inq1Data.standardScore + inq2Data.standardScore;

  // 전국 누적 백분위 (상위 %)
  const cumulativePercent = estimateCumulativePercent(avgPercentile);

  // 전국 예상 석차 (모수 42만 명 기준)
  const estimatedRank = Math.max(1, Math.round(420000 * (cumulativePercent / 100)));

  // 매칭되는 티어 찾기
  const matchedTier = ADMISSION_TIERS.find(
    (t) => cumulativePercent >= t.minCum && cumulativePercent < t.maxCum
  ) || ADMISSION_TIERS[ADMISSION_TIERS.length - 1];

  return {
    examId,
    korData,
    mathData,
    engData,
    histData,
    inq1Data,
    inq2Data,
    inqAvgPercentile,
    avgPercentile,
    totalStdScore,
    cumulativePercent,
    estimatedRank,
    matchedTier
  };
};

// 4. 단일 대학/학과 합격 가능성 판정
export const evaluateUniversityAdmission = (univ, userStats) => {
  const diffPercentile = Number((userStats.avgPercentile - univ.cutPercentile).toFixed(2));
  const diffScore = userStats.totalStdScore - univ.cutScore;

  let verdict = 'danger'; // safe | appropriate | aggressive | challenge | danger
  let verdictText = '위험/스나이핑';
  let badgeColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';

  if (diffPercentile >= 1.5) {
    verdict = 'safe';
    verdictText = '🟢 안정 (합격 유력)';
    badgeColor = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  } else if (diffPercentile >= -0.8) {
    verdict = 'appropriate';
    verdictText = '🟡 적정 (소신 지원)';
    badgeColor = 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
  } else if (diffPercentile >= -2.5) {
    verdict = 'aggressive';
    verdictText = '🟠 상향 (추합 노림수)';
    badgeColor = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
  } else if (diffPercentile >= -4.5) {
    verdict = 'challenge';
    verdictText = '🟣 도전 (역전 필요)';
    badgeColor = 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
  } else {
    verdict = 'danger';
    verdictText = '🔒 집중 공략존';
    badgeColor = 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/30';
  }

  return {
    diffPercentile,
    diffScore,
    verdict,
    verdictText,
    badgeColor
  };
};

// 5. 목표 대학 역산 가이드라인 계산
export const calculateGapForTarget = (targetUniv, userStats) => {
  if (!targetUniv || !userStats) return null;

  const gapPercentile = Number((targetUniv.cutPercentile - userStats.avgPercentile).toFixed(2));
  const gapScore = Math.max(0, targetUniv.cutScore - userStats.totalStdScore);

  if (gapPercentile <= 0) {
    return {
      isAchieved: true,
      gapPercentile: 0,
      gapScore: 0,
      message: `이미 [${targetUniv.univ} ${targetUniv.major}] 합격선보다 +${Math.abs(gapPercentile)}%p 높은 안정권입니다! 🎉`
    };
  }

  // 백분위 1%p를 올리기 위해 대략 원점수 약 2~3점 필요
  const estimatedNeededRaw = Math.max(1, Math.round(gapPercentile * 2.2));

  let advice = '';
  if (estimatedNeededRaw <= 4) {
    advice = `수학 4점짜리 킬러/준킬러 문항 1개 또는 과탐 2점 2문항 정복 시 안정권 진입!`;
  } else if (estimatedNeededRaw <= 8) {
    advice = `수학 1문항(4점) + 국어 독서 1문항(3점) 추가 득점 시 충분히 노려볼 수 있습니다.`;
  } else {
    advice = `취약 과목의 주간 Sprint 목표를 상향하고 2~3개 문항 추가 공략이 필요합니다.`;
  }

  return {
    isAchieved: false,
    gapPercentile,
    gapScore,
    estimatedNeededRaw,
    advice
  };
};
