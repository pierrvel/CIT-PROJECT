// 수능 표준 과목 메타정보 (공식 시험 시간표 연동)
export const SUBJECT_META = {
  korean: {
    id: 'korean',
    name: '국어 영역',
    period: '1교시',
    totalMinutes: 80,
    badge: '80분',
    startHour: 8,
    startMin: 40,
    startTimeStr: '08:40',
    endTimeStr: '10:00',
    desc: '45문항 (08:40 ~ 10:00)'
  },
  math: {
    id: 'math',
    name: '수학 영역',
    period: '2교시',
    totalMinutes: 100,
    badge: '100분',
    startHour: 10,
    startMin: 30,
    startTimeStr: '10:30',
    endTimeStr: '12:10',
    desc: '30문항 (10:30 ~ 12:10)'
  },
  english: {
    id: 'english',
    name: '영어 영역',
    period: '3교시',
    totalMinutes: 70,
    badge: '70분',
    startHour: 13,
    startMin: 10,
    startTimeStr: '13:10',
    endTimeStr: '14:20',
    desc: '45문항 (13:10 ~ 14:20)'
  },
  history: {
    id: 'history',
    name: '한국사 영역',
    period: '4교시',
    totalMinutes: 30,
    badge: '30분',
    startHour: 14,
    startMin: 50,
    startTimeStr: '14:50',
    endTimeStr: '15:20',
    desc: '20문항 (14:50 ~ 15:20)'
  },
  inquiry: {
    id: 'inquiry',
    name: '탐구 영역',
    period: '4교시',
    totalMinutes: 30,
    badge: '30분',
    startHour: 15,
    startMin: 35,
    startTimeStr: '15:35',
    endTimeStr: '16:05',
    desc: '사회/과학/직업 탐구 (15:35 ~ 16:15)'
  },
  secondLang: {
    id: 'secondLang',
    name: '제2외국어/한문',
    period: '5교시',
    totalMinutes: 30,
    badge: '30분',
    startHour: 17,
    startMin: 35,
    startTimeStr: '17:35',
    endTimeStr: '18:05',
    desc: '20문항 (17:35 ~ 18:05)'
  }
};

// 과목별 다중 풀이 순서 & 시간 배분 기본 프리셋 (Data Model)
export const DEFAULT_SUBJECT_PRESETS = {
  korean: [
    {
      id: "kor_default",
      name: "표준 순서 (독서 우선)",
      totalMinutes: 80,
      isSystem: true,
      parts: [
        { id: "p_kor_read", name: "1. 독서 (비문학)", targetMin: 32, targetMinutes: 32, desc: "지문당 평균 8분 (킬러 지문 전략적 시간 배분)" },
        { id: "p_kor_lit", name: "2. 문학", targetMin: 24, targetMinutes: 24, desc: "연계 체감 지문 신속 해결 및 시간 세이브" },
        { id: "p_kor_opt", name: "3. 선택과목 (화작/언매)", targetMin: 14, targetMinutes: 14, desc: "정확도 우선, 15분 내 컷 목표" },
        { id: "p_kor_mark", name: "4. 마킹 및 최종 검토", targetMin: 10, targetMinutes: 10, desc: "OMR 마킹 체크 및 애매한 문항 재확인" }
      ]
    },
    {
      id: "kor_lit_first",
      name: "실전 전략 A (문학 선풀이형)",
      totalMinutes: 80,
      isSystem: true,
      parts: [
        { id: "p_kor_lit", name: "1. 문학", targetMin: 22, targetMinutes: 22, desc: "연계 체감 지문 신속 해결로 심리적 안정 확보" },
        { id: "p_kor_opt", name: "2. 선택과목 (화작/언매)", targetMin: 13, targetMinutes: 13, desc: "자신감 있는 선택과목 신속 마무리" },
        { id: "p_kor_read", name: "3. 독서 (비문학)", targetMin: 35, targetMinutes: 35, desc: "확보한 잔여 시간으로 고난도 비문학 독해" },
        { id: "p_kor_mark", name: "4. 마킹 및 최종 검토", targetMin: 10, targetMinutes: 10, desc: "OMR 마킹 체크 및 애매한 문항 재확인" }
      ]
    },
    {
      id: "kor_opt_first",
      name: "실전 전략 B (선택과목 12분 컷)",
      totalMinutes: 80,
      isSystem: true,
      parts: [
        { id: "p_kor_opt", name: "1. 선택과목 (화작/언매)", targetMin: 12, targetMinutes: 12, desc: "초반 집중력으로 선택과목 12분 컷" },
        { id: "p_kor_lit", name: "2. 문학", targetMin: 23, targetMinutes: 23, desc: "안정적인 EBS 연계 문학 풀이" },
        { id: "p_kor_read", name: "3. 독서 (비문학)", targetMin: 35, targetMinutes: 35, desc: "고난도 비문학 지문에 충분한 시간 집중" },
        { id: "p_kor_mark", name: "4. 마킹 및 최종 검토", targetMin: 10, targetMinutes: 10, desc: "OMR 마킹 체크 및 애매한 문항 재확인" }
      ]
    }
  ],
  math: [
    {
      id: "math_default",
      name: "표준 순서 (공통 비킬러 우선)",
      totalMinutes: 100,
      isSystem: true,
      parts: [
        { id: "p_math_comm", name: "1. 공통 비킬러 (2·3점 & 쉬운 4점)", targetMin: 35, targetMinutes: 35, desc: "1~14번, 16~20번 안정적 확보" },
        { id: "p_math_killer", name: "2. 준킬러·킬러 (15·22번 등)", targetMin: 35, targetMinutes: 35, desc: "조건 엄밀 해석 및 최고난도 풀이" },
        { id: "p_math_opt", name: "3. 선택과목 (미적/기하/확통)", targetMin: 20, targetMinutes: 20, desc: "23~28번 신속 풀이 & 29~30번 공략" },
        { id: "p_math_check", name: "4. 검토 및 주관식 검산", targetMin: 10, targetMinutes: 10, desc: "주관식 단답형 계산 검산 및 OMR" }
      ]
    },
    {
      id: "math_opt_first",
      name: "실전 전략 A (선택과목 선풀이형)",
      totalMinutes: 100,
      isSystem: true,
      parts: [
        { id: "p_math_opt", name: "1. 선택과목 (미적/기하/확통)", targetMin: 18, targetMinutes: 18, desc: "선택과목 23~28번 번개 풀이" },
        { id: "p_math_comm", name: "2. 공통 비킬러 (2·3점 & 쉬운 4점)", targetMin: 35, targetMinutes: 35, desc: "공통문항 점수 안정적 득점" },
        { id: "p_math_killer", name: "3. 준킬러·킬러 (15·22·30번)", targetMin: 37, targetMinutes: 37, desc: "최고 변별력 문항 깊은 수식 전개" },
        { id: "p_math_check", name: "4. 검토 및 주관식 검산", targetMin: 10, targetMinutes: 10, desc: "주관식 단답형 계산 검산 및 OMR" }
      ]
    },
    {
      id: "math_speed_run",
      name: "실전 전략 B (비킬러 스피드런 & 12분 검토)",
      totalMinutes: 100,
      isSystem: true,
      parts: [
        { id: "p_math_comm", name: "1. 공통 비킬러 (스피드런)", targetMin: 30, targetMinutes: 30, desc: "신속하고 정확한 초반 기본기 공략" },
        { id: "p_math_opt", name: "2. 선택과목 (미적/기하/확통)", targetMin: 18, targetMinutes: 18, desc: "선택과목 23~28번 안정적 컷" },
        { id: "p_math_killer", name: "3. 준킬러·킬러 집중 공략", targetMin: 40, targetMinutes: 40, desc: "킬러 4문항에 과감한 시간 투자" },
        { id: "p_math_check", name: "4. 철저한 단답형 재검토", targetMin: 12, targetMinutes: 12, desc: "실수 방지를 위한 주관식 재검산" }
      ]
    }
  ],
  english: [
    {
      id: "eng_default",
      name: "표준 순서 (듣기 ➔ 독해 전반 ➔ 킬러)",
      totalMinutes: 70,
      isSystem: true,
      parts: [
        { id: "p_eng_listen", name: "1. 듣기 평가 (1~17번)", targetMin: 23, targetMinutes: 23, desc: "독해 병행 풀이 (18~20, 25~28번)" },
        { id: "p_eng_read", name: "2. 독해 전반 (대의파악·장문)", targetMin: 22, targetMinutes: 22, desc: "주제, 제목, 요약문 신속 파악" },
        { id: "p_eng_killer", name: "3. 빈칸·순서·삽입 킬러", targetMin: 17, targetMinutes: 17, desc: "킬러 유형 논리 전개 추론" },
        { id: "p_eng_mark", name: "4. 마킹 및 어법/어휘 검토", targetMin: 8, targetMinutes: 8, desc: "마킹 완료 및 불확실 문항 검토" }
      ]
    },
    {
      id: "eng_reading_heavy",
      name: "실전 전략 A (듣기 시간 독해 병행형)",
      totalMinutes: 70,
      isSystem: true,
      parts: [
        { id: "p_eng_listen", name: "1. 듣기 + 하위 독해 병행", targetMin: 20, targetMinutes: 20, desc: "듣기 도중 일치/불일치 6문항 컷" },
        { id: "p_eng_read", name: "2. 독해 전반 (대의파악·도표)", targetMin: 23, targetMinutes: 23, desc: "독해 문제 안정적 해결" },
        { id: "p_eng_killer", name: "3. 빈칸/순서/삽입 킬러 집중", targetMin: 19, targetMinutes: 19, desc: "충분한 시간을 두고 정답 근거 도출" },
        { id: "p_eng_mark", name: "4. 마킹 및 최종 검토", targetMin: 8, targetMinutes: 8, desc: "OMR 마킹 확인" }
      ]
    }
  ],
  inquiry: [
    {
      id: "inq_default",
      name: "표준 순서 (개념 ➔ 고난도 ➔ 마킹)",
      totalMinutes: 30,
      isSystem: true,
      parts: [
        { id: "p_inq_basic", name: "1. 개념형 문항 (1~15번)", targetMin: 12, targetMinutes: 12, desc: "실수 없는 번개 스피드 풀이" },
        { id: "p_inq_killer", name: "2. 고난도·자료해석 (16~20번)", targetMin: 14, targetMinutes: 14, desc: "도표/그래프 타임어택 논리 추론" },
        { id: "p_inq_mark", name: "3. 마킹 및 최종 가채점표", targetMin: 4, targetMinutes: 4, desc: "종료 직전 가채점표 및 마킹" }
      ]
    },
    {
      id: "inq_speed",
      name: "실전 전략 (개념 10분 컷)",
      totalMinutes: 30,
      isSystem: true,
      parts: [
        { id: "p_inq_basic", name: "1. 개념형 문항 (1~15번)", targetMin: 10, targetMinutes: 10, desc: "10분 컷 스피드 풀이" },
        { id: "p_inq_killer", name: "2. 고난도 킬러 5문항 몰입", targetMin: 16, targetMinutes: 16, desc: "복잡한 유전/역학 등 계산과 추론" },
        { id: "p_inq_mark", name: "3. 마킹 및 가채점표", targetMin: 4, targetMinutes: 4, desc: "종료 직전 OMR 마킹" }
      ]
    },
    {
      id: "inq_40min",
      name: "통합탐구 40분 실전형 (15:35 ~ 16:15)",
      totalMinutes: 40,
      isSystem: true,
      parts: [
        { id: "p_inq40_basic", name: "1. 기본·자료해석 (1~17번)", targetMin: 18, targetMinutes: 18, desc: "정확한 개념 및 그래프 판별" },
        { id: "p_inq40_killer", name: "2. 고난도 킬러 문항 (18~25번)", targetMin: 17, targetMinutes: 17, desc: "심층 융합형 추론 문제 집중 공략" },
        { id: "p_inq40_mark", name: "3. OMR 마킹 및 최종 검토", targetMin: 5, targetMinutes: 5, desc: "마킹 정밀 체크" }
      ]
    }
  ],
  history: [
    {
      id: "hist_default",
      name: "표준 순서 (전 문항 ➔ 검토 ➔ 마킹)",
      totalMinutes: 30,
      isSystem: true,
      parts: [
        { id: "p_hist_solve", name: "1. 전 문항 풀이 (1~20번)", targetMin: 21, targetMinutes: 21, desc: "시대순 핵심 개념 및 사료 해석" },
        { id: "p_hist_check", name: "2. 헷갈린 문항 재검토", targetMin: 5, targetMinutes: 5, desc: "애매한 선택지 및 함정 확인" },
        { id: "p_hist_mark", name: "3. OMR 마킹 및 가채점표", targetMin: 4, targetMinutes: 4, desc: "마킹 및 가채점표 작성" }
      ]
    }
  ],
  secondLang: [
    {
      id: "lang_default",
      name: "표준 순서 (기초 ➔ 독해 ➔ 마킹)",
      totalMinutes: 30,
      isSystem: true,
      parts: [
        { id: "p_lang_basic", name: "1. 발음·어휘·기초 문법 (1~10번)", targetMin: 10, targetMinutes: 10, desc: "기본 점수 신속 확보" },
        { id: "p_lang_read", name: "2. 독해 및 문화 문항 (11~20번)", targetMin: 16, targetMinutes: 16, desc: "대화문 및 실용문 독해" },
        { id: "p_lang_mark", name: "3. OMR 마킹 및 최종 검토", targetMin: 4, targetMinutes: 4, desc: "마킹 확인" }
      ]
    }
  ]
};
