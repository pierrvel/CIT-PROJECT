// ==============================================================================
// 📊 EBSi 공식 확정 등급컷, 문항별 배점 및 공식 정답표 DB (평가원 공식 확인)
// ==============================================================================

// 1. 지원하는 기출 및 모의고사 회차 목록
export const HISTORICAL_EXAMS = [
  {
    id: '2025_csat',
    name: '2025학년도 수능 (2024.11.14 시행)',
    tag: '본수능',
    difficulty: '적정 변별력 (국어 평이 · 수학 미적 적정)',
    badgeColor: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
  },
  {
    id: '2025_mock09',
    name: '2025학년도 9월 모의평가 (평가원)',
    tag: '9월 모평',
    difficulty: '평이한 물수능 기조 (국어 화작 1컷 100점)',
    badgeColor: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
  },
  {
    id: '2025_mock06',
    name: '2025학년도 6월 모의평가 (평가원)',
    tag: '6월 모평',
    difficulty: '초고난도 불수능 기조 (수학 미적 1컷 84점)',
    badgeColor: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
  },
  {
    id: '2024_csat',
    name: '2024학년도 수능 (킬러배제 역대급 불수능)',
    tag: '2024 수능',
    difficulty: '불국어(1컷 88점) · 불수학(1컷 84점)',
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

// 2. EBSi 확정 원점수 1~4등급컷 DB
// (통합형 수능 선택과목별 1~4등급 원점수 커트라인 [1컷, 2컷, 3컷, 4컷])
export const EXAM_CUTOFFS = {
  // 2025학년도 본수능 확정 등급컷 (EBSi 최종 집계 기준)
  '2025_csat': {
    korean: {
      totalScore: 100,
      options: {
        speech: { name: '화법과 작문', cuts: [95, 87, 78, 67] },
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
      cuts: [90, 80, 70, 60] // 1등급: 90점 이상, 2등급: 80점 이상 (절대평가)
    },
    history: {
      totalScore: 50,
      isAbsolute: true,
      cuts: [40, 35, 30, 25] // 1등급: 40점 이상 (절대평가)
    },
    inquiry: {
      totalScore: 50,
      cuts: [47, 42, 36, 28] // 주요 탐구 1등급 평균 원점수
    }
  },

  // 2025학년도 9월 모의평가 확정 등급컷 (EBSi 최종 집계 기준)
  '2025_mock09': {
    korean: {
      totalScore: 100,
      options: {
        speech: { name: '화법과 작문', cuts: [100, 96, 89, 79] },
        media:  { name: '언어와 매체', cuts: [97, 93, 86, 77] }
      }
    },
    math: {
      totalScore: 100,
      options: {
        calculus:  { name: '미적분', cuts: [92, 88, 77, 61] },
        prob_stat: { name: '확률과 통계', cuts: [94, 90, 79, 63] },
        geometry:  { name: '기하', cuts: [91, 87, 76, 60] }
      }
    },
    english: { totalScore: 100, isAbsolute: true, cuts: [90, 80, 70, 60] },
    history: { totalScore: 50, isAbsolute: true, cuts: [40, 35, 30, 25] },
    inquiry: { totalScore: 50, cuts: [48, 44, 38, 29] }
  },

  // 2025학년도 6월 모의평가 확정 등급컷 (EBSi 최종 집계 기준)
  '2025_mock06': {
    korean: {
      totalScore: 100,
      options: {
        speech: { name: '화법과 작문', cuts: [96, 90, 82, 73] },
        media:  { name: '언어와 매체', cuts: [93, 87, 79, 69] }
      }
    },
    math: {
      totalScore: 100,
      options: {
        calculus:  { name: '미적분', cuts: [84, 75, 65, 53] },
        prob_stat: { name: '확률과 통계', cuts: [92, 83, 73, 61] },
        geometry:  { name: '기하', cuts: [89, 80, 70, 57] }
      }
    },
    english: { totalScore: 100, isAbsolute: true, cuts: [90, 80, 70, 60] },
    history: { totalScore: 50, isAbsolute: true, cuts: [40, 35, 30, 25] },
    inquiry: { totalScore: 50, cuts: [45, 40, 33, 25] }
  },

  // 2024학년도 수능 확정 등급컷 (EBSi 최종 집계 기준)
  '2024_csat': {
    korean: {
      totalScore: 100,
      options: {
        speech: { name: '화법과 작문', cuts: [88, 81, 72, 62] },
        media:  { name: '언어와 매체', cuts: [84, 77, 69, 59] }
      }
    },
    math: {
      totalScore: 100,
      options: {
        calculus:  { name: '미적분', cuts: [84, 74, 65, 51] },
        prob_stat: { name: '확률과 통계', cuts: [94, 84, 74, 59] },
        geometry:  { name: '기하', cuts: [88, 79, 69, 55] }
      }
    },
    english: { totalScore: 100, isAbsolute: true, cuts: [90, 80, 70, 60] },
    history: { totalScore: 50, isAbsolute: true, cuts: [40, 35, 30, 25] },
    inquiry: { totalScore: 50, cuts: [46, 41, 34, 26] }
  },

  // 사설 실전 모의고사 (표준 프리셋)
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

// 3. 과목별 공식 문항 배점 테이블 (평가원 공식 수능 정답표 기준)
export const DEFAULT_QUESTION_SCORES = {
  // 국어: 1~45번 (총 100점 - 2점 35문항, 3점 10문항)
  // 공통 3점: 3, 8, 13, 16, 21, 25, 31, 34 (8문항)
  // 화작 3점: 40, 45 (2문항) / 언매 3점: 36, 45 (2문항)
  korean: [
    { no: 1, score: 2, part: '독서' }, { no: 2, score: 2, part: '독서' }, { no: 3, score: 3, part: '독서' },
    { no: 4, score: 2, part: '독서' }, { no: 5, score: 2, part: '독서' }, { no: 6, score: 2, part: '독서' },
    { no: 7, score: 2, part: '독서' }, { no: 8, score: 3, part: '독서' }, { no: 9, score: 2, part: '독서' },
    { no: 10, score: 2, part: '독서' }, { no: 11, score: 2, part: '독서' }, { no: 12, score: 2, part: '독서' },
    { no: 13, score: 3, part: '독서' }, { no: 14, score: 2, part: '독서' }, { no: 15, score: 2, part: '독서' },
    { no: 16, score: 3, part: '독서' }, { no: 17, score: 2, part: '독서' },
    { no: 18, score: 2, part: '문학' }, { no: 19, score: 2, part: '문학' }, { no: 20, score: 2, part: '문학' },
    { no: 21, score: 3, part: '문학' }, { no: 22, score: 2, part: '문학' }, { no: 23, score: 2, part: '문학' },
    { no: 24, score: 2, part: '문학' }, { no: 25, score: 3, part: '문학' }, { no: 26, score: 2, part: '문학' },
    { no: 27, score: 2, part: '문학' }, { no: 28, score: 2, part: '문학' }, { no: 29, score: 2, part: '문학' },
    { no: 30, score: 2, part: '문학' }, { no: 31, score: 3, part: '문학' }, { no: 32, score: 2, part: '문학' },
    { no: 33, score: 2, part: '문학' }, { no: 34, score: 3, part: '문학' },
    { no: 35, score: 2, part: '선택' }, { no: 36, score: 2, part: '선택' }, { no: 37, score: 2, part: '선택' },
    { no: 38, score: 2, part: '선택' }, { no: 39, score: 2, part: '선택' }, { no: 40, score: 3, part: '선택' },
    { no: 41, score: 2, part: '선택' }, { no: 42, score: 2, part: '선택' }, { no: 43, score: 2, part: '선택' },
    { no: 44, score: 2, part: '선택' }, { no: 45, score: 3, part: '선택' }
  ],

  // 수학: 1~30번 (총 100점 - 2점 3개, 3점 14개, 4점 13개)
  // 2점 문항: 1, 2, 23 (3개)
  // 3점 문항: 3, 4, 5, 6, 7, 8 (공통 6개), 16, 17, 18, 19 (공통 단답 4개), 24, 25, 26, 27 (선택 4개)
  // 4점 문항: 9, 10, 11, 12, 13, 14, 15 (공통 7개), 20, 21, 22 (공통 단답 3개), 28, 29, 30 (선택 3개)
  math: [
    { no: 1, score: 2, part: '공통' }, { no: 2, score: 2, part: '공통' }, { no: 3, score: 3, part: '공통' },
    { no: 4, score: 3, part: '공통' }, { no: 5, score: 3, part: '공통' }, { no: 6, score: 3, part: '공통' },
    { no: 7, score: 3, part: '공통' }, { no: 8, score: 3, part: '공통' }, { no: 9, score: 4, part: '공통' },
    { no: 10, score: 4, part: '공통' }, { no: 11, score: 4, part: '공통' }, { no: 12, score: 4, part: '공통' },
    { no: 13, score: 4, part: '공통' }, { no: 14, score: 4, part: '공통' }, { no: 15, score: 4, part: '공통 킬러' },
    { no: 16, score: 3, part: '공통 단답' }, { no: 17, score: 3, part: '공통 단답' }, { no: 18, score: 3, part: '공통 단답' },
    { no: 19, score: 3, part: '공통 단답' }, { no: 20, score: 4, part: '공통 단답' }, { no: 21, score: 4, part: '공통 준킬러' },
    { no: 22, score: 4, part: '공통 최고난도' },
    { no: 23, score: 2, part: '선택' }, { no: 24, score: 3, part: '선택' }, { no: 25, score: 3, part: '선택' },
    { no: 26, score: 3, part: '선택' }, { no: 27, score: 3, part: '선택' }, { no: 28, score: 4, part: '선택 준킬러' },
    { no: 29, score: 4, part: '선택 단답' }, { no: 30, score: 4, part: '선택 킬러' }
  ],

  // 영어: 1~45번 (총 100점 - 2점 35문항, 3점 10문항)
  // 3점 문항: 11, 14, 15 (듣기 3개), 21, 30, 33, 34, 37, 38, 42 (독해 7개)
  english: Array.from({ length: 45 }, (_, i) => {
    const no = i + 1;
    const isThree = [11, 14, 15, 21, 30, 33, 34, 37, 38, 42].includes(no);
    return {
      no,
      score: isThree ? 3 : 2,
      part: no <= 17 ? '듣기' : '독해'
    };
  }),

  // 한국사: 1~20번 (총 50점 - 2점 10문항, 3점 10문항)
  // 3점 문항: 2, 3, 6, 8, 9, 11, 13, 14, 17, 19 (10개)
  history: Array.from({ length: 20 }, (_, i) => {
    const no = i + 1;
    const isThree = [2, 3, 6, 8, 9, 11, 13, 14, 17, 19].includes(no);
    return {
      no,
      score: isThree ? 3 : 2,
      part: '한국사'
    };
  }),

  // 탐구: 1~20번 (총 50점 - 2점 10문항, 3점 10문항)
  inquiry: Array.from({ length: 20 }, (_, i) => {
    const no = i + 1;
    const isThree = [2, 3, 6, 8, 9, 11, 13, 14, 17, 19].includes(no);
    return {
      no,
      score: isThree ? 3 : 2,
      part: '탐구'
    };
  })
};

// 4. 과목 및 선택과목별 문항 배점 동적 산출 유틸
export const getQuestionScores = (subjectKey, optionKey) => {
  if (subjectKey === 'korean') {
    const isMedia = optionKey === 'media';
    return DEFAULT_QUESTION_SCORES.korean.map((q) => {
      if (q.no <= 34) return q;
      if (isMedia) {
        return {
          ...q,
          part: '언매',
          score: [36, 45].includes(q.no) ? 3 : 2
        };
      }
      return {
        ...q,
        part: '화작',
        score: [40, 45].includes(q.no) ? 3 : 2
      };
    });
  }

  if (subjectKey === 'math') {
    const optLabel = optionKey === 'calculus' ? '미적' : optionKey === 'prob_stat' ? '확통' : '기하';
    return DEFAULT_QUESTION_SCORES.math.map((q) => {
      if (q.no <= 22) return q;
      return {
        ...q,
        part: `${optLabel}${q.no >= 29 ? ' 단답' : ''}`
      };
    });
  }

  return DEFAULT_QUESTION_SCORES[subjectKey] || DEFAULT_QUESTION_SCORES['korean'];
};

// 5. 평가원/EBSi 공식 확정 정답표 DB (2025학년도 수능 홀수형 기준)
export const OFFICIAL_ANSWER_KEYS = {
  '2025_csat': {
    korean: {
      speech: [
        // 공통(1~34)
        3, 4, 5, 4, 5, 3, 2, 1, 2, 3, 1, 5, 3, 1, 2, 2, 3, 2, 4, 1, 4, 4, 5, 2, 2, 1, 1, 4, 3, 5, 4, 3, 5, 2,
        // 화작(35~45)
        2, 4, 3, 4, 5, 4, 3, 1, 1, 5, 2
      ],
      media: [
        // 공통(1~34)
        3, 4, 5, 4, 5, 3, 2, 1, 2, 3, 1, 5, 3, 1, 2, 2, 3, 2, 4, 1, 4, 4, 5, 2, 2, 1, 1, 4, 3, 5, 4, 3, 5, 2,
        // 언매(35~45)
        5, 4, 3, 1, 2, 4, 3, 5, 2, 1, 3
      ]
    },
    math: {
      calculus: [
        // 공통(1~22)
        5, 4, 5, 2, 4, 5, 3, 1, 4, 3, 2, 1, 5, 4, 2, 7, 33, 96, 41, 36, 16, 64,
        // 미적분(23~30)
        3, 4, 2, 1, 1, 2, 25, 17
      ],
      prob_stat: [
        // 공통(1~22)
        5, 4, 5, 2, 4, 5, 3, 1, 4, 3, 2, 1, 5, 4, 2, 7, 33, 96, 41, 36, 16, 64,
        // 확통(23~30)
        5, 3, 1, 3, 3, 2, 25, 19
      ],
      geometry: [
        // 공통(1~22)
        5, 4, 5, 2, 4, 5, 3, 1, 4, 3, 2, 1, 5, 4, 2, 7, 33, 96, 41, 36, 16, 64,
        // 기하(23~30)
        3, 4, 3, 1, 1, 4, 107, 316
      ]
    },
    english: [
      2, 5, 1, 3, 1, 4, 3, 4, 5, 2, 2, 1, 5, 1, 2, 3, 4, 1, 2, 1, 3, 2, 1, 5, 4, 4, 3, 3, 2, 4, 5, 3, 2, 5, 4, 5, 3, 4, 4, 1, 2, 5, 2, 3, 4
    ],
    history: [
      5, 1, 3, 3, 1, 4, 5, 2, 5, 3, 5, 4, 1, 3, 2, 2, 4, 3, 2, 1
    ]
  }
};

// 6. 시험 회차 및 선택과목에 맞는 공식 정답표 추출 유틸
export const getOfficialAnswers = (examId, subjectKey, optionKey) => {
  const exam = OFFICIAL_ANSWER_KEYS[examId];
  if (!exam) return null;
  const sub = exam[subjectKey];
  if (!sub) return null;
  if (Array.isArray(sub)) return sub;
  return sub[optionKey] || Object.values(sub)[0] || null;
};

// 7. 점수 기준 등급 판정 유틸 함수
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

// 8. 목표 대학 라인 메타
export const TARGET_COLLEGES = [
  { id: 'med', name: '의치한약수 (메디컬)', targetPercentile: 99, color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { id: 'sky', name: '서연고 (SKY)', targetPercentile: 96, color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'sh',  name: '서성한 (상위 8%)', targetPercentile: 92, color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { id: 'jkm', name: '중경외시 (상위 13%)', targetPercentile: 87, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
];
