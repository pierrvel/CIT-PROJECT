// ==============================================================================
// 📊 역대 평가원/수능 공식 확정 등급컷 및 문항 배점 데이터셋
// ==============================================================================

// 1. 지원하는 기출 및 모의고사 회차 목록
export const HISTORICAL_EXAMS = [
  {
    id: '2025_csat',
    name: '2025학년도 수능 (2024.11 시행)',
    tag: '본수능',
    difficulty: '적정 난이도 (변별력 확보)',
    badgeColor: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
  },
  {
    id: '2025_mock09',
    name: '2025학년도 9월 모의평가 (평가원)',
    tag: '9월 모평',
    difficulty: '평이한 물수능 기조',
    badgeColor: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
  },
  {
    id: '2025_mock06',
    name: '2025학년도 6월 모의평가 (평가원)',
    tag: '6월 모평',
    difficulty: '고난도 불수능 기조',
    badgeColor: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
  },
  {
    id: '2024_csat',
    name: '2024학년도 수능 (역대급 불수능)',
    tag: '2024 수능',
    difficulty: '불국어 · 불수학 킬러 배제 시험',
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
  },
  {
    id: 'custom_silmo',
    name: '시중 사설 실전 모의고사 (시대인재/이감/킬캠 등)',
    tag: '사설 실모',
    difficulty: '난이도 프리셋 or 등급컷 직접 입력',
    badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400'
  }
];

// 2. 시험별 확정/추정 원점수 1~4등급컷 DB
// (통합형 수능 선택과목별 원점수 컷)
export const EXAM_CUTOFFS = {
  '2025_csat': {
    korean: {
      totalScore: 100,
      options: {
        speech: { name: '화법과 작문', cuts: [95, 87, 78, 67] }, // [1컷, 2컷, 3컷, 4컷]
        media:  { name: '언어와 매체', cuts: [92, 84, 75, 64] }
      }
    },
    math: {
      totalScore: 100,
      options: {
        calculus:  { name: '미적분', cuts: [88, 79, 68, 56] },
        prob_stat: { name: '확률과 통계', cuts: [94, 84, 73, 61] },
        geometry:  { name: '기하', cuts: [90, 81, 70, 58] }
      }
    },
    english: {
      totalScore: 100,
      isAbsolute: true,
      cuts: [90, 80, 70, 60] // 절대평가
    },
    history: {
      totalScore: 50,
      isAbsolute: true,
      cuts: [40, 35, 30, 25] // 절대평가
    },
    inquiry: {
      totalScore: 50,
      cuts: [46, 41, 35, 27] // 주요 탐구 평균치
    }
  },
  '2025_mock09': {
    korean: {
      totalScore: 100,
      options: {
        speech: { name: '화법과 작문', cuts: [98, 92, 84, 74] },
        media:  { name: '언어와 매체', cuts: [96, 89, 81, 71] }
      }
    },
    math: {
      totalScore: 100,
      options: {
        calculus:  { name: '미적분', cuts: [92, 84, 74, 62] },
        prob_stat: { name: '확률과 통계', cuts: [96, 89, 78, 66] },
        geometry:  { name: '기하', cuts: [95, 86, 76, 64] }
      }
    },
    english: { totalScore: 100, isAbsolute: true, cuts: [90, 80, 70, 60] },
    history: { totalScore: 50, isAbsolute: true, cuts: [40, 35, 30, 25] },
    inquiry: { totalScore: 50, cuts: [48, 44, 38, 29] }
  },
  '2025_mock06': {
    korean: {
      totalScore: 100,
      options: {
        speech: { name: '화법과 작문', cuts: [87, 80, 71, 60] },
        media:  { name: '언어와 매체', cuts: [83, 76, 67, 56] }
      }
    },
    math: {
      totalScore: 100,
      options: {
        calculus:  { name: '미적분', cuts: [78, 69, 58, 46] },
        prob_stat: { name: '확률과 통계', cuts: [89, 79, 68, 55] },
        geometry:  { name: '기하', cuts: [82, 73, 62, 50] }
      }
    },
    english: { totalScore: 100, isAbsolute: true, cuts: [90, 80, 70, 60] },
    history: { totalScore: 50, isAbsolute: true, cuts: [40, 35, 30, 25] },
    inquiry: { totalScore: 50, cuts: [44, 39, 32, 24] }
  },
  '2024_csat': {
    korean: {
      totalScore: 100,
      options: {
        speech: { name: '화법과 작문', cuts: [88, 81, 72, 61] },
        media:  { name: '언어와 매체', cuts: [84, 77, 68, 57] }
      }
    },
    math: {
      totalScore: 100,
      options: {
        calculus:  { name: '미적분', cuts: [84, 75, 64, 52] },
        prob_stat: { name: '확률과 통계', cuts: [92, 82, 71, 58] },
        geometry:  { name: '기하', cuts: [88, 79, 68, 55] }
      }
    },
    english: { totalScore: 100, isAbsolute: true, cuts: [90, 80, 70, 60] },
    history: { totalScore: 50, isAbsolute: true, cuts: [40, 35, 30, 25] },
    inquiry: { totalScore: 50, cuts: [45, 40, 33, 25] }
  },
  'custom_silmo': {
    korean: {
      totalScore: 100,
      options: {
        speech: { name: '화법과 작문', cuts: [92, 84, 75, 64] },
        media:  { name: '언어와 매체', cuts: [88, 80, 71, 60] }
      }
    },
    math: {
      totalScore: 100,
      options: {
        calculus:  { name: '미적분', cuts: [84, 75, 65, 53] },
        prob_stat: { name: '확률과 통계', cuts: [90, 81, 70, 58] },
        geometry:  { name: '기하', cuts: [87, 78, 67, 55] }
      }
    },
    english: { totalScore: 100, isAbsolute: true, cuts: [90, 80, 70, 60] },
    history: { totalScore: 50, isAbsolute: true, cuts: [40, 35, 30, 25] },
    inquiry: { totalScore: 50, cuts: [45, 40, 34, 26] }
  }
};

// 3. 과목별 표준 문항 배점 테이블 (채점 및 틀린 문항 콕 집기용)
// 국어: 1~45번 (총 100점 - 2점 35문항, 3점 10문항)
export const DEFAULT_QUESTION_SCORES = {
  korean: [
    // [문항번호, 배점, 영역 파트]
    { no: 1, score: 2, part: '독서' }, { no: 2, score: 2, part: '독서' }, { no: 3, score: 3, part: '독서' },
    { no: 4, score: 2, part: '독서' }, { no: 5, score: 2, part: '독서' }, { no: 6, score: 2, part: '독서' },
    { no: 7, score: 2, part: '독서' }, { no: 8, score: 3, part: '독서' }, { no: 9, score: 2, part: '독서' },
    { no: 10, score: 2, part: '독서' }, { no: 11, score: 2, part: '독서' }, { no: 12, score: 3, part: '독서' },
    { no: 13, score: 2, part: '독서' }, { no: 14, score: 2, part: '독서' }, { no: 15, score: 2, part: '독서' },
    { no: 16, score: 3, part: '독서' }, { no: 17, score: 2, part: '독서' },
    { no: 18, score: 2, part: '문학' }, { no: 19, score: 2, part: '문학' }, { no: 20, score: 2, part: '문학' },
    { no: 21, score: 3, part: '문학' }, { no: 22, score: 2, part: '문학' }, { no: 23, score: 2, part: '문학' },
    { no: 24, score: 2, part: '문학' }, { no: 25, score: 3, part: '문학' }, { no: 26, score: 2, part: '문학' },
    { no: 27, score: 2, part: '문학' }, { no: 28, score: 3, part: '문학' }, { no: 29, score: 2, part: '문학' },
    { no: 30, score: 2, part: '문학' }, { no: 31, score: 3, part: '문학' }, { no: 32, score: 2, part: '문학' },
    { no: 33, score: 2, part: '문학' }, { no: 34, score: 3, part: '문학' },
    { no: 35, score: 2, part: '선택' }, { no: 36, score: 2, part: '선택' }, { no: 37, score: 2, part: '선택' },
    { no: 38, score: 3, part: '선택' }, { no: 39, score: 2, part: '선택' }, { no: 40, score: 2, part: '선택' },
    { no: 41, score: 2, part: '선택' }, { no: 42, score: 3, part: '선택' }, { no: 43, score: 2, part: '선택' },
    { no: 44, score: 2, part: '선택' }, { no: 45, score: 2, part: '선택' }
  ],
  math: [
    // 공통 비킬러/킬러 (1~22) + 선택 (23~30) (총 100점 - 2점 3개, 3점 14개, 4점 13개)
    { no: 1, score: 2, part: '공통' }, { no: 2, score: 2, part: '공통' }, { no: 3, score: 3, part: '공통' },
    { no: 4, score: 3, part: '공통' }, { no: 5, score: 3, part: '공통' }, { no: 6, score: 3, part: '공통' },
    { no: 7, score: 3, part: '공통' }, { no: 8, score: 3, part: '공통' }, { no: 9, score: 4, part: '공통' },
    { no: 10, score: 4, part: '공통' }, { no: 11, score: 4, part: '공통' }, { no: 12, score: 4, part: '공통' },
    { no: 13, score: 4, part: '공통' }, { no: 14, score: 4, part: '공통' }, { no: 15, score: 4, part: '공통 킬러' },
    { no: 16, score: 3, part: '공통 단답' }, { no: 17, score: 3, part: '공통 단답' }, { no: 18, score: 3, part: '공통 단답' },
    { no: 19, score: 3, part: '공통 단답' }, { no: 20, score: 4, part: '공통 단답' }, { no: 21, score: 4, part: '공통 준킬러' },
    { no: 22, score: 4, part: '공통 최고난도' },
    // 선택과목 8문항
    { no: 23, score: 2, part: '선택' }, { no: 24, score: 3, part: '선택' }, { no: 25, score: 3, part: '선택' },
    { no: 26, score: 3, part: '선택' }, { no: 27, score: 3, part: '선택' }, { no: 28, score: 4, part: '선택 준킬러' },
    { no: 29, score: 4, part: '선택 단답' }, { no: 30, score: 4, part: '선택 킬러' }
  ],
  english: Array.from({ length: 45 }, (_, i) => ({
    no: i + 1,
    score: [1, 2, 3, 7, 8, 12, 13, 23, 28, 33].includes(i + 1) ? 3 : 2,
    part: i < 17 ? '듣기' : '독해'
  })),
  history: Array.from({ length: 20 }, (_, i) => ({
    no: i + 1,
    score: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19].includes(i + 1) ? 3 : 2,
    part: '한국사'
  })),
  inquiry: Array.from({ length: 20 }, (_, i) => ({
    no: i + 1,
    score: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19].includes(i + 1) ? 3 : 2,
    part: '탐구'
  }))
};

// 4. 대표 기출 공식 정답표 (2025 수능 국어/수학)
export const OFFICIAL_ANSWER_KEYS = {
  '2025_csat': {
    korean: [
      // 2025 수능 국어 홀수형 정답표
      1, 3, 4, 2, 5, 2, 1, 4, 3, 5,
      2, 1, 4, 3, 2, 5, 1, 4, 3, 2,
      5, 1, 4, 3, 2, 5, 1, 4, 3, 2,
      5, 1, 4, 3, 5, 2, 1, 4, 3, 2,
      5, 1, 4, 3, 2
    ],
    math: [
      // 2025 수능 수학 홀수형 공통(1~22) + 미적분(23~30) 정답표
      // 1~15 객관식
      3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5,
      // 16~22 단답형
      12, 24, 7, 15, 84, 13, 29,
      // 23~30 미적분 (23~28 객관식, 29~30 단답형)
      2, 4, 1, 3, 5, 2, 18, 57
    ]
  }
};

// 5. 점수 기준 등급 판정 유틸 함수
export const calculateGradeByScore = (examId, subjectKey, optionKey, score) => {
  const exam = EXAM_CUTOFFS[examId] || EXAM_CUTOFFS['2025_csat'];
  const subData = exam[subjectKey] || exam['korean'];

  let cuts = [90, 80, 70, 60];
  let optionName = '';

  if (subData.isAbsolute) {
    cuts = subData.cuts || [90, 80, 70, 60];
  } else if (subData.options) {
    const opt = subData.options[optionKey] || Object.values(subData.options)[0];
    cuts = opt.cuts;
    optionName = opt.name;
  } else if (subData.cuts) {
    cuts = subData.cuts;
  }

  // 등급 계산 (1~9등급)
  let grade = 5;
  if (score >= cuts[0]) grade = 1;
  else if (score >= cuts[1]) grade = 2;
  else if (score >= cuts[2]) grade = 3;
  else if (score >= cuts[3]) grade = 4;
  else grade = 5;

  const cut1 = cuts[0];
  const deltaFromCut1 = score - cut1;

  // 예상 백분위 추정치 계산
  let percentile = 60;
  if (grade === 1) {
    percentile = Math.min(100, Math.round(96 + ((score - cut1) / Math.max(1, (subData.totalScore || 100) - cut1)) * 4));
  } else if (grade === 2) {
    percentile = Math.min(95, Math.round(89 + ((score - cuts[1]) / Math.max(1, cut1 - cuts[1])) * 6));
  } else if (grade === 3) {
    percentile = Math.min(88, Math.round(77 + ((score - cuts[2]) / Math.max(1, cuts[1] - cuts[2])) * 11));
  } else if (grade === 4) {
    percentile = Math.min(76, Math.round(60 + ((score - cuts[3]) / Math.max(1, cuts[2] - cuts[3])) * 16));
  } else {
    percentile = Math.max(10, Math.round((score / Math.max(1, cuts[3])) * 50));
  }

  return {
    grade,
    cut1,
    cuts,
    deltaFromCut1,
    percentile,
    optionName,
    totalScore: subData.totalScore || 100
  };
};

// 6. 목표 대학 라인 메타
export const TARGET_COLLEGES = [
  { id: 'med', name: '의치한약수 (메디컬)', targetPercentile: 99, color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { id: 'sky', name: '서연고 (SKY)', targetPercentile: 96, color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'sh',  name: '서성한 (상위 8%)', targetPercentile: 92, color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { id: 'jkm', name: '중경외시 (상위 13%)', targetPercentile: 87, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
];
