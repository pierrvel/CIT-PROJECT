// ==========================================================
// 📅 2026~2027학년도 대입 입시 & 수능 타임라인 마일스톤 데이터
// ==========================================================

export const CALENDAR_CATEGORIES = [
  { key: 'all', label: '전체 일정', icon: 'layers' },
  { key: 'mock', label: '🎯 모의고사/수능', icon: 'target' },
  { key: 'susi', label: '📝 수시 전형', icon: 'fileText' },
  { key: 'jungsi', label: '🏛️ 정시 전형', icon: 'sparkles' },
  { key: 'custom', label: '⭐ 내 맞춤 일정', icon: 'bookmark' }
];

export const OFFICIAL_MILESTONES = [
  {
    id: 'm_2026_03_edu',
    title: '3월 전국연합학력평가 (서울시교육청)',
    date: '2026-03-26',
    endDate: null,
    group: 'mock',
    category: 'edu',
    categoryLabel: '교육청 학평',
    importance: 'normal',
    desc: '고3 첫 실전 시험. 겨울방학 학습 성과 점검 및 탐구 선택과목 1차 확인.',
    tags: ['고3첫시험', '탐구선택', '약점진단'],
    ddayPriority: false
  },
  {
    id: 'm_2026_05_edu',
    title: '5월 전국연합학력평가 (경기도교육청)',
    date: '2026-05-08',
    endDate: null,
    group: 'mock',
    category: 'edu',
    categoryLabel: '교육청 학평',
    importance: 'normal',
    desc: '중간고사 직후 흐트러지기 쉬운 실전 감각 및 페이스 유지 점검.',
    tags: ['실전감각', '내신연계'],
    ddayPriority: false
  },
  {
    id: 'm_2026_06_eval',
    title: '6월 모의평가 (한국교육과정평가원)',
    date: '2026-06-04',
    endDate: null,
    group: 'mock',
    category: 'eval',
    categoryLabel: '평가원 모평',
    importance: 'high',
    desc: '재수·N수생 공식 첫 합류. 당해 연도 수능 출제 기조 및 EBS 연계 체감도 1차 가늠자.',
    tags: ['N수생합류', '출제경향', '1차승부처'],
    ddayPriority: true
  },
  {
    id: 'm_2026_07_edu',
    title: '7월 전국연합학력평가 (인천시교육청)',
    date: '2026-07-09',
    endDate: null,
    group: 'mock',
    category: 'edu',
    categoryLabel: '교육청 학평',
    importance: 'normal',
    desc: '기말고사 직후 여름방학 고강도 취약점 집중 보완의 방향성을 설정하는 지표.',
    tags: ['여름방학계획', '단원별보완'],
    ddayPriority: false
  },
  {
    id: 'm_2026_09_eval',
    title: '9월 모의평가 (한국교육과정평가원)',
    date: '2026-09-02',
    endDate: null,
    group: 'mock',
    category: 'eval',
    categoryLabel: '평가원 모평',
    importance: 'high',
    desc: '수시 원서접수 직전 최종 실력 점검 및 반수생 최종 합류. 수능과 가장 유사한 전국 표본.',
    tags: ['수시판단기준', '전국표본', '최종점검'],
    ddayPriority: true
  },
  {
    id: 'm_2026_09_susi',
    title: '2027학년도 대입 수시모집 원서접수',
    date: '2026-09-07',
    endDate: '2026-09-11',
    group: 'susi',
    category: 'susi_apply',
    categoryLabel: '수시 접수',
    importance: 'high',
    desc: '전국 4년제 대학 수시 6회 지원 기간. 9모 가채점 기준으로 수능 최저 충족 가능 대학 확정.',
    tags: ['수시6장', '최저학력기준', '원서마감'],
    ddayPriority: true
  },
  {
    id: 'm_2026_10_edu',
    title: '10월 전국연합학력평가 (서울시교육청)',
    date: '2026-10-14',
    endDate: null,
    group: 'mock',
    category: 'edu',
    categoryLabel: '교육청 학평',
    importance: 'high',
    desc: '수능 전 마지막 공식 실전 시험. 점수보다 시험장 운영 루틴과 멘탈 최종 시뮬레이션.',
    tags: ['수능직전마지막', '시간배분루틴', '멘탈점검'],
    ddayPriority: true
  },
  {
    id: 'm_2026_11_csat',
    title: '2027학년도 대학수학능력시험 (본수능)',
    date: '2026-11-19',
    endDate: null,
    group: 'mock',
    category: 'csat',
    categoryLabel: '본수능',
    importance: 'high',
    desc: '결전의 날. 듀얼코어 콕핏으로 단련한 과목별 타임어택 파이프라인과 페이스를 쏟아붓는 날.',
    tags: ['결전의날', '실전페이스', 'D-Day'],
    ddayPriority: true
  },
  {
    id: 'm_2026_11_essay',
    title: '2027 주요 대학 수시 논술 / 구술면접 고사 주간',
    date: '2026-11-21',
    endDate: '2026-12-06',
    group: 'susi',
    category: 'susi_exam',
    categoryLabel: '대학별 고사',
    importance: 'normal',
    desc: '수능 직후 주말 연세대, 성균관대, 서강대, 한양대 등 주요 대학 논술/면접 집중 시행.',
    tags: ['수리논술', '인문논술', '심층면접'],
    ddayPriority: false
  },
  {
    id: 'm_2026_12_score',
    title: '2027 수능 성적 통지표 교부',
    date: '2026-12-04',
    endDate: null,
    group: 'jungsi',
    category: 'score',
    categoryLabel: '성적 통지',
    importance: 'high',
    desc: '원점수 마감 및 표준점수·백분위·등급 공식 성적표 발표. 정시 전략 실질 시작일.',
    tags: ['성적표배부', '표준점수', '백분위확정'],
    ddayPriority: true
  },
  {
    id: 'm_2026_12_susi_pass',
    title: '2027 수시모집 최초 합격자 발표 마감',
    date: '2026-12-11',
    endDate: null,
    group: 'susi',
    category: 'pass',
    categoryLabel: '수시 발표',
    importance: 'normal',
    desc: '수능 최저학력기준 충족자 포함 수시 6장 최초 합격자 일괄 발표.',
    tags: ['최초합', '수시등록'],
    ddayPriority: false
  },
  {
    id: 'm_2026_12_jungsi',
    title: '2027학년도 대입 정시모집 원서접수',
    date: '2026-12-28',
    endDate: '2027-01-02',
    group: 'jungsi',
    category: 'jungsi_apply',
    categoryLabel: '정시 접수',
    importance: 'high',
    desc: '가/나/다군 3장의 카드 최종 지원 접수. 대학별 탐구 변환표준점수 및 경쟁률 실시간 분석.',
    tags: ['가나다군', '환산점수', '최종접수'],
    ddayPriority: true
  },
  {
    id: 'm_2027_02_jungsi_pass',
    title: '2027 정시 합격자 발표 및 추가합격(추합) 통보',
    date: '2027-02-05',
    endDate: '2027-02-15',
    group: 'jungsi',
    category: 'pass',
    categoryLabel: '정시 합격',
    importance: 'normal',
    desc: '정시 최초 합격자 등록 및 미등록 충원(추합 전화 찬스) 최종 레이스.',
    tags: ['정시최초합', '추합통보', '입시종료'],
    ddayPriority: false
  }
];
