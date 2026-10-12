# 🚀 듀얼코어 콕핏 (DualCore Cockpit)

<p align="center">
  <img src="https://img.shields.io/badge/Release-v2.5.0-6366f1?style=for-the-badge&logo=rocket" alt="Version" />
  <img src="https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.4-646cff?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Platform-Web_/_Tablet_/_Mobile-10b981?style=for-the-badge" alt="Platform" />
</p>

> **수험생 전용 올인원 지능형 생산성 OS & 실전 모의고사 타임어택 페이서**  
> 주간 학습 분량 제어(Sprint)부터 수능 시험장 규격 실전 타임어택(Pacer), 전국 1등급 벤치마크 라운지(Lounge), 2026/2027 공식 대입 캘린더(Calendar), 그리고 6자리 PIN 기기간 무설치 클라우드 동기화까지 한 화면에서 완벽하게 제어합니다.
> https://citproject.vercel.app/

---

## 🌟 핵심 4대 도메인 탭 시스템

### 1. 📋 Sprint 플랜 (적응형 주간 분량 페이서)
- **교재별 잔여 분량 수학적 페이싱**:
  - 교재명, 총 분량, 현재 완료량, 마감일을 기반으로 일일 필요 학습량을 실시간 연산 (`pacing.js`).
  - **일일 권장 제한 (Daily Cap)**: 하루 소화 한도를 초과하면 `주의/초과` 상태 배지 표시.
- **적응형 3-Way 재배분 전략 (Dynamic Rescheduling)**:
  - **전략 A (강제 상향)**: 밀린 분량을 마감일까지 매일 균등하게 추가 배분.
  - **전략 B (주말 이월)**: 평일 부담을 유지하고 주말(토/일)로 밀린 공부를 집중 이월.
  - **전략 C (범위 가지치기)**: 과감하게 우선순위가 낮은 분량을 제외하여 현실적인 목표치 재설정.
- **목표 사후 수정 & 상태 관리**:
  - 교재명, 분량 단위(문제/강/쪽), 마감일, 완료량 등을 언제든 수정할 수 있는 전용 편집 모달 (`GoalEditModal`).
  - 브라우저 로컬 저장소 및 6자리 PIN 클라우드에 자동 보존.

---

### 2. ⏱️ Exam Pacer (수능 실전 모의고사 파이프라인 타이머)
- **수능 표준 교시 시간표 & 커스텀 전략 프리셋**:
  - **1교시 국어** (08:40 ~ 10:00, 80분) — 독서/문학/화작·언매
  - **2교시 수학** (10:30 ~ 12:10, 100분) — 공통 비킬러/준킬러·킬러/선택과목/검토
  - **3교시 영어** (13:10 ~ 14:20, 70분) — 듣기/비연계 빈순삽/대의파악/장문
  - **4교시 한국사 & 탐구 1/2** (14:50 ~ 16:37)
  - **5교시 제2외국어 / 한문** (17:35 ~ 18:05, 30분)
- **3대 시계 화면 디스플레이 모드**:
  - **듀얼 모드 (Dual)**: 수능 규격 아날로그 시계판 + 대형 디지털 타이머 병렬 표시.
  - **아날로그 전용 모드 (Analog Only)**: 실제 시험장 분위기를 100% 재현하는 수능 표준 규격 시계판 (실시간 시침/분침 싱크).
  - **디지털 전용 모드 (Digital Only)**: 큰 폰트의 직관적인 분/초 카운트다운 타이머.
- **순차 파이프라인 타임어택 & 실시간 페이스 오차 계산**:
  - 파트별 목표 시간 대비 실제 소요 시간을 초 단위로 실시간 대조 (`-02:15 세이브` 🟢 / `+03:40 지연` 🔴).
  - 파트 순서 자유 드래그/이동 및 목표 시간 커스텀 프리셋 저장.
- **과목별 실전 모의고사 리포트 보관함 (`SubjectReportList`)**:
  - 과목별 전용 필터 칩 (`[전체]`, `[1교시 국어]`, `[2교시 수학]`, `[3교시 영어]`, `[4교시 한국사]`, `[4교시 탐구]`, `[5교시 제2외국어]`).
  - 과목별 누적 회차, 정시 완주율(%), 평균 실전 소요 시간, 평균 페이스 오차 KPI 요약.
  - **회차별 아코디언 카드**: 파트별 진행 프로그레스 바 및 오차 분석 테이블.
  - **실전 복기 메모 인라인 편집**: 오답 행동 요령 및 피드백을 모달 없이 그 자리에서 즉시 수정/저장.
  - **이 전략으로 다시 응시하기**: 해당 프리셋과 과목을 세팅하여 즉시 타이머로 바로가기.
- **Web Audio API 수능 타종 합성기**:
  - 외부 오디오 파일 없이 Web Audio 오실레이터로 본령/예비령/10분 전 타종음 직접 합성.
  - 독서실/스터디카페를 위한 **무음 시각 플래시(Visual Pulse) 모드** (화면 테두리 앰버/레드 펄스 애니메이션).
- **Screen Wake Lock API & 2중 안전장치**:
  - 모바일, 태블릿, PC에서 시험 도중 화면 꺼짐 방지 (탭 복귀 시 자동 재획득).
  - **페이지 이탈 방지 (`beforeunload`)**: 실수로 탭 닫기/뒤로가기 시 팝업 차단.
  - **실수 되돌리기 (Undo Window)**: 파트 넘기기 실수 시 3초 이내 직전 파트로 즉시 롤백.

---

### 3. 🌐 라이브 라운지 (Live Lounge)
- **실시간 접속자 인디케이터**: 부드러운 그린 레이더 점멸 펄스 표시.
- **실시간 활동 티커 (Activity Stream)**: 수험생들의 익명 달성 로그가 부드럽게 전환되는 롤링 티커.
- **전국 1등급 시간 벤치마크 (`TimeBenchmark`)**:
  - 국어(80분), 수학(100분) 등 영역별 1등급 목표 페이스 vs 전국 평균 페이스 시각화.
  - 내 최근 Exam Pacer 실전 기록을 3번째 바로 함께 대조하여 격차 뱃지 표기.
- **D-Day 한 줄 각오 전광판 (`CheerBoard`)**:
  - 수험생들의 목표 대학 및 D-Day 다짐 카드 그리드 렌더링.
  - 오늘 내 다짐 등록(30자 제한) 및 [ 🔥 불꽃 응원 ] 카운트 인터랙션.

---

### 4. 📅 2026/2027 대입 공식 입시 캘린더 (Calendar Tab)
- **공식 확정안 기준 20대 공식 마일스톤 탑재**:
  - **학평·모평·수능 (7건)**: 3/24(서울), 5/7(경기), 6/4(평가원), 7/8(인천), 9/2(평가원), 10/20(서울), **11/19(2027 본수능)**.
  - **2027 수시모집 (5건)**: 원서(9/7~9/11), 전형(9/12~12/17), 합격발표(12/18까지), 등록(12/21~12/23), 충원마감(12/29~12/30).
  - **2027 정시모집 (7건)**: 원서(2027.1/4~1/7), 가/나/다군 전형(1/11~1/31), 합격발표(2/5까지), 등록(2/10~2/12), 충원마감(2/17~2/18).
  - **추가모집 (1건)**: 2027.2/19 ~ 2/26 (등록마감 2/26 22시).
- **타임라인 뷰 & 월간 그리드 뷰 (Month Grid)**:
  - D-Day 뱃지, 기간 일정 자동 날짜 범위 매핑, 중요도 태그 필터.
- **지난 일정 개별 삭제 & 툴바 일괄 정리**:
  - 이미 지난 일정에 대해 개별 `[ 🗑️ 지난 일정 삭제 ]` 버튼 제공.
  - 상단 툴바에서 `[ 🗑️ 지난 일정 정리 (N) ]` 버튼으로 만료된 일정 원클릭 일괄 삭제.
  - 삭제된 기본 일정 원클릭 복원(`[ ↺ 기본 일정 복원 ]`) 지원.
- **내 맞춤 일정 등록 & ⭐ 관심 일정 고정**:
  - 모의고사, 학원 특강, 수시 서류 마감일 등 개인 일정 등록/수정/삭제.

---

### 5. 🔄 6자리 PIN 기기간 무설치 클라우드 동기화 (`server.py`)
- 로그인이나 회원가입 없이 **6자리 고유 PIN 코드**만으로 PC ↔ 태블릿 ↔ 스마트폰 간 완벽 연동.
- Sprint 플랜, 시험 히스토리, 커스텀 프리셋, 응원 전광판, 캘린더 맞춤/삭제 일정, 테마 설정까지 실시간 백업 및 복원.
- Python 3 내장 표준 라이브러리(`ThreadingHTTPServer`) 기반 경량 REST 서버 (`rooms_data.json`).

---

## 📂 프로젝트 구조

```text
CIT-PROJECT/
├── index.html                  # 메인 엔트리 HTML
├── index.standalone.html       # (보존본) 브라우저 더블클릭 단일 파일 구동용 HTML
├── vite.config.js              # Vite 빌드 & 개발 서버 설정
├── tailwind.config.js          # Tailwind CSS 디자인 토큰 & 다크모드 설정
├── package.json                # 프로젝트 의존성 & 스크립트
├── server.py                   # 6자리 PIN 클라우드 동기화 파이썬 서버
├── rooms_data.json             # PIN 동기화 데이터베이스
└── src/
    ├── main.jsx                # React 마운트 엔트리
    ├── App.jsx                 # 최상위 상태 관리, 전역 레이아웃 & 뷰 컨테이너
    ├── index.css               # Tailwind 지시어 & 키프레임 애니메이션
    ├── constants/
    │   ├── subjects.js         # 수능 표준 시간표, 영역별 파트 & 전략 프리셋
    │   ├── calendar.js         # 2026/2027 공식 대입 마일스톤 20개 & 카테고리
    │   └── wallpapers.js       # 추천 글래스모피즘 배경화면 프리셋
    ├── utils/
    │   ├── audio.js            # Web Audio API 오실레이터 수능 타종 합성기
    │   ├── pacing.js           # 주간 Sprint 분량 산출 & 시간 포맷팅 모델
    │   └── wakeLock.js         # Screen Wake Lock 화면 꺼짐 방지 제어기
    └── components/
        ├── common/             # Icon, Toast, VisualPulse, UndoPill, Header
        ├── clock/              # CSATAnalogClock (수능 표준 규격 아날로그 시계)
        ├── sprint/             # SprintTab (적응형 주간 플래너 대시보드)
        ├── pacer/              # ExamPacer (실전 타이머), SubjectReportList (과목별 리포트 보관함)
        ├── lounge/             # LiveLounge, LivePulseBanner, TimeBenchmark, CheerBoard
        ├── calendar/           # CalendarTab, TimelineView, MonthGridView, NextMilestoneHero
        ├── analytics/          # StatsDashboard (누적 통계 차트 & 취약 파트 분석)
        └── modals/             # BgModal, SyncModal, GoalModal, GoalEditModal, ExamReportModal 등
```

---

## 🔐 환경변수 설정 (.env)

중요한 데이터베이스 비밀번호, API KEY, 백엔드 포트 등 민감한 정보는 소스 코드에 직접 하드코딩되지 않으며 환경변수를 통해 안전하게 관리됩니다.

```bash
# 1. 템플릿을 복사하여 로컬 환경변수 파일 생성
cp .env.example .env
```

| 환경변수 키 | 설명 | 기본값 |
|---|---|---|
| `VITE_API_BASE_URL` | 프론트엔드 통신용 동기화 서버 엔드포인트 | `http://localhost:8000` |
| `VITE_FIREBASE_DB_URL` | Firebase 실시간 DB 엔드포인트 (선택) | `""` |
| `VITE_FIREBASE_API_KEY` | Firebase 웹 API 키 (선택) | `""` |
| `PORT` | Python 동기화 서버 구동 포트 | `8000` |
| `SYNC_DATA_FILE` | 동기화 DB 저장 파일명 | `rooms_data.json` |
| `ALLOWED_ORIGIN` | 백엔드 CORS 허용 출처 | `*` |
| `DB_PASSWORD` / `API_SECRET_KEY` | 데이터베이스 비밀번호 및 서버 시크릿 키 | `.env`에서 안전하게 분리 보관 |

> **보안 규칙**: `.env` 파일은 `.gitignore`에 등록되어 Git 원격 저장소에 절대 커밋되지 않습니다. Vercel 배포 시에는 프로젝트 대시보드의 **Settings > Environment Variables**에서 주입하십시오.

---

## 💻 실행 방법

### 1. 개발 서버 실행
```bash
npm install
npm run dev
```
- 브라우저에서 `http://localhost:5173` 접속.

### 2. 프로덕션 빌드 & 검증
```bash
npm run build
```
- 빌드 결과물은 `dist/` 폴더에 번들링됩니다.

### 3. 기기간 6자리 PIN 동기화 서버 구동
```bash
python server.py
```
- 기본 포트 `8000`에서 실행되며, 동일 네트워크(Wi-Fi) 내 기기 간에 6자리 PIN으로 데이터를 실시간 동기화합니다.

---

## 🛠️ 기술 스택

- **Frontend Core**: React 18, Vite 5, Tailwind CSS, Lucide React
- **Web Native APIs**: Web Audio API (합성 타종음), Screen Wake Lock API (화면 꺼짐 방지), `beforeunload` Lifecycle
- **Sync Backend**: Python 3 내장 `ThreadingHTTPServer` (Zero-dependency REST API)
- **Deployment**: Vercel CI/CD 자동 배포
- **Design System**: Glassmorphism (Backdrop-filter blur, 다크/라이트 모드, 딤 조절)

---

## 📄 라이선스
This project is licensed under the [MIT License](LICENSE).
