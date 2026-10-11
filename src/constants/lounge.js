// ==========================================================
// 🌐 라이브 라운지 (Live Lounge) 도메인 상수
// ==========================================================

// 2027학년도 수능 시행일 (D-Day 계산 기준)
export const CSAT_DATE = '2026-11-19';

// 현재 함께 자습 중인 수험생 수 (라운지 표시용 시뮬레이션 값)
export const LOUNGE_ONLINE_COUNT = 28;

// 활동 티커 전환 간격 (ms)
export const TICKER_INTERVAL_MS = 3500;

// 실시간 활동 스트림 기본 샘플 로그
export const SAMPLE_ACTIVITY_LOGS = [
  {
    id: 'sample_1',
    isMine: false,
    text: "🔥 [익명]님이 '수능특강 미적분' 10문제를 완주했습니다!",
    time: '방금 전'
  },
  {
    id: 'sample_2',
    isMine: false,
    text: "🎯 [의대목표]님이 '국어 80분 모의고사'를 정시 완주했습니다 (-02:40)",
    time: '2분 전'
  },
  {
    id: 'sample_3',
    isMine: false,
    text: "⚡ [새벽러]님이 '수특 수2' 5문제를 완주했습니다!",
    time: '5분 전'
  },
  {
    id: 'sample_4',
    isMine: false,
    text: "🌙 [독서실고3]님이 '문학 선풀이 전략'으로 +03:15를 세이브했습니다",
    time: '8분 전'
  }
];

// ----------------------------------------------------------
// 전국 타임 벤치마크 데이터 (단위: 초)
// - idPatterns: Exam Pacer 프리셋 파트 id와 정확히 일치하면 우선 매칭
// - keywords: id가 없는 기록(샘플 등)은 파트 이름 키워드로 매칭
// - matchOrder: 키워드 매칭 우선순위 (예: '비문학'이 '문학'보다 먼저 검사되어야 함)
// - isEstimate: 공식 제공값이 아닌 추정 샘플 데이터 여부
// ----------------------------------------------------------
export const BENCHMARK_SUBJECTS = [
  {
    key: 'korean',
    label: '국어',
    totalMinutes: 80,
    isEstimate: false,
    matchOrder: ['reading', 'optional', 'marking', 'literature'],
    segments: [
      { key: 'literature', name: '문학', top: 1170, avg: 1510, idPatterns: ['p_kor_lit'], keywords: ['문학'] },
      { key: 'reading', name: '독서', top: 1980, avg: 2180, idPatterns: ['p_kor_read'], keywords: ['독서', '비문학'] },
      { key: 'optional', name: '선택', top: 760, avg: 910, idPatterns: ['p_kor_opt'], keywords: ['선택', '화작', '언매'] },
      { key: 'marking', name: '마킹/검토', top: 890, avg: 200, idPatterns: ['p_kor_mark'], keywords: ['마킹', '검토'] }
    ]
  },
  {
    key: 'math',
    label: '수학',
    totalMinutes: 100,
    isEstimate: false,
    matchOrder: ['common', 'optional', 'review', 'killer'],
    segments: [
      { key: 'common', name: '공통 비킬러', top: 1800, avg: 2280, idPatterns: ['p_math_comm'], keywords: ['비킬러', '공통'] },
      { key: 'killer', name: '준킬러·킬러', top: 2280, avg: 2520, idPatterns: ['p_math_killer'], keywords: ['킬러', '고난도'] },
      { key: 'optional', name: '선택과목', top: 1080, avg: 1260, idPatterns: ['p_math_opt'], keywords: ['선택', '미적', '기하', '확통'] },
      { key: 'review', name: '검토', top: 840, avg: 0, idPatterns: ['p_math_check'], keywords: ['검토', '검사', '마킹'] }
    ]
  },
  {
    key: 'english',
    label: '영어',
    totalMinutes: 70,
    isEstimate: true,
    matchOrder: ['listening', 'killer', 'marking', 'reading'],
    segments: [
      { key: 'listening', name: '듣기 + 병행 독해', top: 1320, avg: 1470, idPatterns: ['p_eng_listen'], keywords: ['듣기'] },
      { key: 'reading', name: '독해 전반', top: 1260, avg: 1440, idPatterns: ['p_eng_read'], keywords: ['독해', '대의', '도표'] },
      { key: 'killer', name: '빈칸·순서·삽입', top: 1080, avg: 1170, idPatterns: ['p_eng_killer'], keywords: ['빈칸', '순서', '삽입', '킬러'] },
      { key: 'marking', name: '마킹/검토', top: 540, avg: 120, idPatterns: ['p_eng_mark'], keywords: ['마킹', '검토'] }
    ]
  },
  {
    key: 'inquiry',
    label: '탐구',
    totalMinutes: 30,
    isEstimate: true,
    matchOrder: ['marking', 'basic', 'killer'],
    segments: [
      { key: 'basic', name: '기본 문항', top: 600, avg: 810, idPatterns: ['p_inq_basic', 'p_inq40_basic'], keywords: ['기본', '개념', '1~15'] },
      { key: 'killer', name: '고난도 자료해석', top: 840, avg: 930, idPatterns: ['p_inq_killer', 'p_inq40_killer'], keywords: ['킬러', '자료', '고난도'] },
      { key: 'marking', name: '마킹/검토', top: 360, avg: 60, idPatterns: ['p_inq_mark', 'p_inq40_mark'], keywords: ['마킹', '검토', 'OMR'] }
    ]
  }
];

// 응원 전광판 추천 닉네임
export const NICKNAME_SUGGESTIONS = [
  '샤대정문뿌셔',
  '새벽의미적러',
  '연고대가즈아',
  '독서실지박령',
  '수능만점각',
  'N수탈출러',
  '국어킬러헌터',
  '의대가는길'
];

// 다짐 최대 글자 수
export const CHEER_MAX_LENGTH = 30;

// 응원 전광판 기본 카드
export const DEFAULT_CHEERS = [
  { id: 'cheer_default_1', nickname: '샤대정문뿌셔', message: '국어 1등급 무조건 찍고 간다!', cheers: 42, isMine: false },
  { id: 'cheer_default_2', nickname: '새벽의미적러', message: '미적분 30번 오늘도 정복 완료', cheers: 31, isMine: false },
  { id: 'cheer_default_3', nickname: '독서실지박령', message: '하루 순공 10시간 지키는 중', cheers: 27, isMine: false },
  { id: 'cheer_default_4', nickname: 'N수탈출러', message: '올해가 마지막, 후회 없이 간다', cheers: 58, isMine: false },
  { id: 'cheer_default_5', nickname: '국어킬러헌터', message: '독서 지문 8분 컷 루틴 완성!', cheers: 19, isMine: false },
  { id: 'cheer_default_6', nickname: '의대가는길', message: '수학 실수 0개, 끝까지 검토하기', cheers: 23, isMine: false }
];
