// ==========================================================
// 📅 2026~2027학년도 대입 입시 & 수능 타임라인 마일스톤 데이터
// (공식 2026 모의고사/수능 일정표 및 2027 대입전형 기본일정 기준)
// ==========================================================

export const CALENDAR_CATEGORIES = [
  { key: 'all', label: '전체 일정', icon: 'layers' },
  { key: 'mock', label: '🎯 모의고사/수능', icon: 'target' },
  { key: 'susi', label: '📝 수시 전형', icon: 'fileText' },
  { key: 'jungsi', label: '🏛️ 정시 전형', icon: 'sparkles' },
  { key: 'custom', label: '⭐ 내 맞춤 일정', icon: 'bookmark' }
];

export const OFFICIAL_MILESTONES = [
  // 1. 3월 학평
  {
    id: 'm_2026_03_edu',
    title: '3월 전국연합학력평가 (서울시교육청)',
    date: '2026-03-24',
    endDate: null,
    group: 'mock',
    category: 'edu',
    categoryLabel: '교육청 학평',
    importance: 'normal',
    desc: '고3 첫 전국 모의고사. 겨울방학 학습 성과 점검 및 탐구 선택과목 1차 확인 (1·2학년 동시 시행).',
    tags: ['고3첫시험', '탐구선택', '서울시교육청'],
    ddayPriority: false
  },
  // 2. 5월 학평
  {
    id: 'm_2026_05_edu',
    title: '5월 전국연합학력평가 (경기도교육청)',
    date: '2026-05-07',
    endDate: null,
    group: 'mock',
    category: 'edu',
    categoryLabel: '교육청 학평',
    importance: 'normal',
    desc: '중간고사 직후 흐트러지기 쉬운 실전 감각 및 페이스 유지 점검 (3학년 대상).',
    tags: ['실전감각', '내신연계', '경기도교육청'],
    ddayPriority: false
  },
  // 3. 6월 모의평가 (평가원)
  {
    id: 'm_2026_06_eval',
    title: '6월 모의평가 (한국교육과정평가원)',
    date: '2026-06-04',
    endDate: null,
    group: 'mock',
    category: 'eval',
    categoryLabel: '평가원 모평',
    importance: 'high',
    desc: '대수능 모의평가. 재수·N수생 공식 첫 합류. 당해 연도 수능 출제 기조 및 EBS 연계 1차 가늠자.',
    tags: ['N수생합류', '출제경향', '1차승부처', '평가원'],
    ddayPriority: true
  },
  // 4. 7월 학평
  {
    id: 'm_2026_07_edu',
    title: '7월 전국연합학력평가 (인천광역시교육청)',
    date: '2026-07-08',
    endDate: null,
    group: 'mock',
    category: 'edu',
    categoryLabel: '교육청 학평',
    importance: 'normal',
    desc: '기말고사 직후 여름방학 고강도 취약점 집중 보완의 방향성을 설정하는 지표 (3학년 대상).',
    tags: ['여름방학계획', '단원별보완', '인천시교육청'],
    ddayPriority: false
  },
  // 5. 9월 모의평가 (평가원)
  {
    id: 'm_2026_09_eval',
    title: '9월 모의평가 (한국교육과정평가원)',
    date: '2026-09-02',
    endDate: null,
    group: 'mock',
    category: 'eval',
    categoryLabel: '평가원 모평',
    importance: 'high',
    desc: '대수능 모의평가. 수시 원서접수 직전 최종 실력 점검 및 반수생 최종 합류. 수능과 가장 유사한 전국 표본.',
    tags: ['수시판단기준', '전국표본', '최종점검', '평가원'],
    ddayPriority: true
  },
  // 6. 수시 원서접수
  {
    id: 'm_2026_09_susi',
    title: '2027학년도 대입 수시모집 원서접수',
    date: '2026-09-07',
    endDate: '2026-09-11',
    group: 'susi',
    category: 'susi_apply',
    categoryLabel: '수시 접수',
    importance: 'high',
    desc: '전국 4년제 대학 수시 6회 지원 (기간 중 3일 이상). 9모 가채점 기준으로 수능 최저 충족 대학 최종 확정.',
    tags: ['수시6장', '최저학력기준', '원서마감'],
    ddayPriority: true
  },
  // 7. 수시 전형기간
  {
    id: 'm_2026_09_susi_period',
    title: '2027 수시모집 전형기간 (대학별 고사/논술/면접)',
    date: '2026-09-12',
    endDate: '2026-12-17',
    group: 'susi',
    category: 'susi_exam',
    categoryLabel: '수시 전형',
    importance: 'normal',
    desc: '97일간 대학별 논술/구술면접/실기 및 서류 전형 집중 시행 기간.',
    tags: ['수리논술', '인문논술', '심층면접', '97일간'],
    ddayPriority: false
  },
  // 8. 10월 학평
  {
    id: 'm_2026_10_edu',
    title: '10월 전국연합학력평가 (서울시교육청)',
    date: '2026-10-20',
    endDate: null,
    group: 'mock',
    category: 'edu',
    categoryLabel: '교육청 학평',
    importance: 'high',
    desc: '수능 전 마지막 공식 실전 시험 (3학년 서울시교육청 주관). 시험장 운영 루틴과 멘탈 최종 시뮬레이션.',
    tags: ['수능직전마지막', '시간배분루틴', '멘탈점검', '서울시교육청'],
    ddayPriority: true
  },
  // 9. 대학수학능력시험 본수능
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
    tags: ['결전의날', '실전페이스', 'D-Day', '평가원'],
    ddayPriority: true
  },
  // 10. 수시 합격자 발표
  {
    id: 'm_2026_12_susi_pass',
    title: '2027 수시모집 합격자 발표 마감',
    date: '2026-12-18',
    endDate: null,
    group: 'susi',
    category: 'pass',
    categoryLabel: '수시 발표',
    importance: 'high',
    desc: '2026년 12월 18일(금)까지 수시모집 최초 합격자 일괄 발표.',
    tags: ['수시최초합', '합격자발표'],
    ddayPriority: false
  },
  // 11. 수시 합격자 등록
  {
    id: 'm_2026_12_susi_reg',
    title: '2027 수시모집 합격자 등록',
    date: '2026-12-21',
    endDate: '2026-12-23',
    group: 'susi',
    category: 'pass',
    categoryLabel: '수시 등록',
    importance: 'normal',
    desc: '수시 합격자 온라인 문서등록 및 등록금 예치 (3일간).',
    tags: ['문서등록', '수시예치금'],
    ddayPriority: false
  },
  // 12. 수시 미등록 충원(추합) 통보 마감
  {
    id: 'm_2026_12_susi_reserve',
    title: '수시 미등록 충원(추합) 합격통보 마감',
    date: '2026-12-29',
    endDate: '2026-12-30',
    group: 'susi',
    category: 'pass',
    categoryLabel: '수시 추합',
    importance: 'normal',
    desc: '12월 29일(화) 18시까지 충원 합격통보 마감 (홈페이지 14시까지, 14~18시 개별통보). 12월 30일(수) 22시 등록 마감.',
    tags: ['수시추합', '전화찬스', '충원마감'],
    ddayPriority: false
  },
  // 13. 정시 원서접수
  {
    id: 'm_2027_01_jungsi',
    title: '2027학년도 대입 정시모집 원서접수',
    date: '2027-01-04',
    endDate: '2027-01-07',
    group: 'jungsi',
    category: 'jungsi_apply',
    categoryLabel: '정시 접수',
    importance: 'high',
    desc: '정시모집 원서접수 (기간 중 3일 이상). 가/나/다군 3장의 카드 최종 전략 접수 및 실시간 경쟁률 분석.',
    tags: ['가나다군', '환산점수', '정시원서마감'],
    ddayPriority: true
  },
  // 14. 정시 가군 전형기간
  {
    id: 'm_2027_01_ga_period',
    title: '2027 정시 가군 전형기간',
    date: '2027-01-11',
    endDate: '2027-01-17',
    group: 'jungsi',
    category: 'jungsi_apply',
    categoryLabel: '가군 전형',
    importance: 'normal',
    desc: '정시 가군 대학별 전형 및 실기/면접 고사 (7일간).',
    tags: ['가군', '정시전형'],
    ddayPriority: false
  },
  // 15. 정시 나군 전형기간
  {
    id: 'm_2027_01_na_period',
    title: '2027 정시 나군 전형기간',
    date: '2027-01-18',
    endDate: '2027-01-24',
    group: 'jungsi',
    category: 'jungsi_apply',
    categoryLabel: '나군 전형',
    importance: 'normal',
    desc: '정시 나군 대학별 전형 및 실기/면접 고사 (7일간).',
    tags: ['나군', '정시전형'],
    ddayPriority: false
  },
  // 16. 정시 다군 전형기간
  {
    id: 'm_2027_01_da_period',
    title: '2027 정시 다군 전형기간',
    date: '2027-01-25',
    endDate: '2027-01-31',
    group: 'jungsi',
    category: 'jungsi_apply',
    categoryLabel: '다군 전형',
    importance: 'normal',
    desc: '정시 다군 대학별 전형 및 실기/면접 고사 (7일간).',
    tags: ['다군', '정시전형'],
    ddayPriority: false
  },
  // 17. 정시 합격자 발표
  {
    id: 'm_2027_02_jungsi_pass',
    title: '2027 정시모집 최초 합격자 발표',
    date: '2027-02-05',
    endDate: null,
    group: 'jungsi',
    category: 'pass',
    categoryLabel: '정시 발표',
    importance: 'high',
    desc: '2027년 2월 5일(금)까지 가/나/다군 정시모집 최초 합격자 일괄 발표.',
    tags: ['정시최초합', '합격발표'],
    ddayPriority: false
  },
  // 18. 정시 합격자 등록
  {
    id: 'm_2027_02_jungsi_reg',
    title: '2027 정시모집 합격자 등록',
    date: '2027-02-10',
    endDate: '2027-02-12',
    group: 'jungsi',
    category: 'pass',
    categoryLabel: '정시 등록',
    importance: 'normal',
    desc: '정시 합격자 등록 기간 (3일간).',
    tags: ['정시등록', '등록금납부'],
    ddayPriority: false
  },
  // 19. 정시 미등록 충원(추합) 통보 마감
  {
    id: 'm_2027_02_jungsi_reserve',
    title: '정시 미등록 충원(추합) 합격통보 마감',
    date: '2027-02-17',
    endDate: '2027-02-18',
    group: 'jungsi',
    category: 'pass',
    categoryLabel: '정시 추합',
    importance: 'normal',
    desc: '2월 17일(수) 18시까지 충원 합격통보 마감 (홈페이지 14시까지, 14~18시 개별통보). 2월 18일(목) 22시 등록 마감.',
    tags: ['정시추합', '전화찬스', '미등록충원'],
    ddayPriority: false
  },
  // 20. 추가모집
  {
    id: 'm_2027_02_extra',
    title: '2027학년도 대입 추가모집 (접수·전형·등록)',
    date: '2027-02-19',
    endDate: '2027-02-26',
    group: 'jungsi',
    category: 'pass',
    categoryLabel: '추가 모집',
    importance: 'normal',
    desc: '정시 이후 최종 결원 보충 추가모집 (8일간). 2월 26일(금) 18시 합격통보 마감, 22시 등록 마감으로 2027 대입 최종 종료.',
    tags: ['추가모집', '최종기회', '대입종료'],
    ddayPriority: false
  }
];
