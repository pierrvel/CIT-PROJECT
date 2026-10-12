# 🤖 AI 에이전트 작업 지침서 (Agent Operating Guidelines)

이 문서는 **Antigravity, Claude Code, Cursor, Codex, GitHub Copilot** 등 이 프로젝트를 다루는 모든 자율형 AI 코딩 에이전트를 위한 핵심 아키텍처 및 작업 규칙입니다. 다른 PC나 다른 에이전트 환경에서 이 저장소를 열어 작업을 수행할 때 반드시 아래 원칙을 준수해야 합니다.

---

## 📌 1. 프로젝트 개요 & 아키텍처 원칙 (Core Architecture)

- **프로젝트명**: 듀얼코어 콕핏 (DualCore Cockpit) - 수험생 전용 올인원 지능형 생산성 OS
- **아키텍처**: **Modern Vite + React 18 + Tailwind CSS 모듈형 아키텍처**
  - 컴포넌트, 유틸리티, 상수가 역할별로 모듈화되어 있어 여러 AI 에이전트 및 멀티 PC 환경에서 협업하기 최적화되어 있습니다.
  - 빌드/개발 도구: Vite 5, React 18, Tailwind CSS, Lucide-React
  - 무설치 단일 파일 보존본: [`index.standalone.html`](index.standalone.html) (빌드 없이 브라우저 더블클릭만으로 즉시 구동 가능한 원본 스탠드얼론 버전도 함께 제공).
- **백엔드 싱크 서버**: [`server.py`](server.py) (Python 3 내장 ThreadingHTTPServer, 6자리 PIN 기반 기기간 클라우드 데이터 동기화, 포트 8000).

---

## 📂 2. 디렉토리 구조 (Directory Structure)

```
CIT-PROJECT/
├── index.html                  # Vite 메인 엔트리 HTML
├── index.standalone.html       # (보존본) 단일 파일 브라우저 즉시 구동용 HTML
├── vite.config.js              # Vite 설정 (React 플러그인, API 프록시)
├── tailwind.config.js          # Tailwind CSS 디자인 토큰 및 다크모드 설정
├── postcss.config.js           # PostCSS 설정
├── package.json                # 프로젝트 의존성 및 실행 스크립트
├── server.py                   # 6자리 PIN 클라우드 동기화 파이썬 서버
├── rooms_data.json             # 동기화 데이터베이스
└── src/
    ├── main.jsx                # React DOM 마운트 엔트리
    ├── App.jsx                 # 최상위 상태 관리 및 뷰 전환 컨테이너
    ├── index.css               # Tailwind CSS 지시어 및 공통 키프레임 애니메이션
    ├── constants/
    │   ├── subjects.js         # 수능 표준 교시/시간표 및 과목별 전략 프리셋
    │   └── wallpapers.js       # 추천 배경화면 및 기본 DB URL
    ├── utils/
    │   ├── audio.js            # Web Audio API 오실레이터 타종/차임 합성기
    │   ├── pacing.js           # 시간 포맷팅 및 주간 Sprint 페이싱 수학 모델
    │   └── wakeLock.js         # Screen Wake Lock API 화면 꺼짐 방지 제어기
    └── components/
        ├── common/
        │   ├── Icon.jsx        # Lucide-React 아이콘 래퍼
        │   ├── Toast.jsx       # 플로팅 토스트 메시지
        │   ├── VisualPulse.jsx # 독서실 무음 시각 플래시 테두리
        │   └── UndoPill.jsx    # 3초 단계 되돌리기 (Undo Window)
        ├── clock/
        │   └── CSATAnalogClock.jsx # 수능 시험장 규격 실시간 아날로그 시계
        ├── sprint/
        │   └── SprintTab.jsx   # 적응형 3-Way 재배분 주간 Sprint 플래너
        ├── pacer/
        │   └── ExamPacer.jsx   # 순차 타임어택 모의고사 파이프라인
        ├── analytics/
        │   └── StatsDashboard.jsx # 타임 통계 대시보드, 누적 차트, 복기 메모
        └── modals/
            ├── BgModal.jsx         # 배경화면 & 글래스 블러 커스터마이저
            ├── SyncModal.jsx       # 6자리 PIN 기기간 동기화 모달
            ├── GoalModal.jsx       # 신규 목표 등록 모달
            ├── PartEditModal.jsx   # 파트별 목표 시간 조절 모달
            ├── SavePresetModal.jsx # 커스텀 전략 프리셋 저장 모달
            └── ExamReportModal.jsx # 시험 종료 후 복기 리포트 모달
```

---

## 🚨 3. AI 에이전트 핵심 작업 원칙 (Critical Inviolable Rules)

1. **모듈성 유지 (Modularity First)**:
   - 새로운 기능이나 수정 사항은 해당 도메인의 컴포넌트(`src/components/`), 유틸리티(`src/utils/`), 상수(`src/constants/`)에 작성하십시오. 모놀리식 단일 파일로 코드를 되돌리지 마십시오.
2. **코드 생략 절대 금지 (No Code Omission)**:
   - `// ... 기존 코드 동일 ...`, `// TODO: Implement later` 등으로 코드를 축약하지 마십시오. 전체 파일을 교체할 때는 항상 100% 완전한 코드를 작성해야 합니다.
3. **기존 완성 기능 100% 보존**:
   - Sprint 플랜, Exam Pacer (3대 화면 모드: Dual/Analog/Digital, 타임어택 파이프라인, Web Audio 타종, 무음 시각 플래시, Wake Lock, Undo Window), PIN 동기화, 타임 통계 대시보드 등 모든 핵심 기능의 무결성을 유지하십시오.
4. **빌드 검증 필수**:
   - 코드 작업 후 반드시 `npm run build`를 실행하여 컴파일 및 번들링 에러가 0건인지 확인하십시오.
5. **보안 및 환경변수 원칙 (Security & Secrets First)**:
   - 데이터베이스 비밀번호, API KEY, 시크릿 토큰 등 모든 민감 정보는 소스 코드에 절대 직접 하드코딩하지 마십시오.
   - 프론트엔드는 `src/utils/env.js` 및 `import.meta.env.VITE_*`, 백엔드는 `os.environ` 및 `.env` 파일을 통해서만 주입받습니다.
   - `.env` 파일은 절대 Git에 커밋하지 않으며, 새로운 환경변수가 추가될 경우 반드시 `.env.example` 파일에 템플릿으로 명시하십시오.

---

## 💎 4. 필수 유지 핵심 기능 체크리스트 (Key Features to Preserve)

1. **Sprint 플랜 탭**:
   - 과목별 학습 목표 및 태스크 체크리스트, 진행률 게이지, 상태 보존, 적응형 3-Way 재배분 전략(강제 상향 / 주말 이월 / 범위 가지치기).
2. **Exam Pacer (수능 실전 모의고사 파이프라인 타이머)**:
   - **과목별 타임테이블**: 국어(08:40~10:00), 수학(10:30~12:10), 영어(13:10~14:20), 한국사/탐구 등.
   - **3대 화면 표시 모드**:
     * 듀얼 모드 (Dual): 수능 아날로그 시계 + 디지털 타이머 병렬.
     * 아날로그 모드 (Analog Only): 실제 수능 시험장 규격 시계판 (실시간 시침/분침 싱크).
     * 디지털 모드 (Digital Only): 대형 카운트다운 타이머.
   - **순차 파이프라인 타임어택 & 지연 경고**: 영역별 목표 분배 및 페이스 오버 시각 피드백.
   - **Web Audio 수능 타종 합성기**: 외부 오디오 파일 없이 Web Audio API 오실레이터로 타종음 직접 합성.
   - **독서실 무음 시각 플래시(Visual Pulse) 모드**: 소음 차단 환경을 위한 화면 테두리 앰버/레드 펄스 애니메이션.
   - **Screen Wake Lock API**: 시험 중 화면 꺼짐 방지, 탭 복귀 시 자동 재획득, 수동 토글.
   - **실수 방지 안전장치 2종**:
     * `beforeunload` 페이지 이탈 방지 (시험 중 실수로 탭 닫기/뒤로가기 차단).
     * 파트 넘기기 실수 되돌리기 (Undo Window: 3초 내 직전 파트로 즉시 롤백).
3. **6자리 PIN 기기간 클라우드 자동 동기화**:
   - PC ↔ 태블릿 ↔ 스마트폰 간 6자리 PIN으로 데이터 백업 및 복원 (`server.py` + `rooms_data.json`).
4. **타임 통계 대시보드 & 배경 커스텀/다크모드**:
   - 과목/파트별 실제 소요시간 vs 목표시간 비교 분석 그래프, 사용자 배경화면 및 테마 설정.

---

## 🛠️ 5. 에이전트 실행 및 테스트 절차

- **개발 서버 구동**:
  ```bash
  npm run dev
  ```
  브라우저에서 `http://localhost:5173` 접속하여 동작 확인.
- **프로덕션 빌드 검증**:
  ```bash
  npm run build
  ```
- **동기화 서버 구동**:
  ```bash
  python server.py
  ```
  포트 8000에서 정상 구동되는지 확인.

---

## 🌿 6. Git 작업 규약 (Agent Git Workflow)

1. **작업 시작 전**: 항상 최신 변경사항을 당겨옵니다.
   ```bash
   git pull origin main
   ```
2. **작업 완료 후**: 빌드 검증 후 명확한 Semantic 커밋 메시지와 함께 원격 저장소에 푸시합니다.
   ```bash
   npm run build
   git add .
   git commit -m "feat: [구현한 기능 설명]"
   git push origin main
   ```
