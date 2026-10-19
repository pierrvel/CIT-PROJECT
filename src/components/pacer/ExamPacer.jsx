import React from 'react';
import {
  Clock,
  FileText,
  BarChart3,
  Award,
  Target,
  Settings,
  Sliders,
  Bookmark,
  Trash2,
  RotateCcw,
  Volume2,
  VolumeX,
  Bell,
  Lightbulb,
  Play,
  Pause,
  FastForward,
  Check,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Columns,
  Hash,
  Plus
} from 'lucide-react';
import CSATAnalogClock from '../clock/CSATAnalogClock';
import StatsDashboard from '../analytics/StatsDashboard';
import SubjectReportList from './SubjectReportList';
import ScoreTracker from '../grade/ScoreTracker';
import AdmissionPredictor from '../admission/AdmissionPredictor';
import { formatTime } from '../../utils/pacing';

export const ExamPacer = ({
  // 디자인 시스템 ('apple' | 'legacy')
  designSystem = 'apple',

  // 서브 뷰 상태
  pacerSubView,
  setPacerSubView,
  examHistory,
  onGoToSprint,
  onOpenShareCard,

  // 과목 및 프리셋
  selectedSubjectKey,
  handleSelectSubject,
  selectedPresetId,
  handleSelectPreset,
  currentSubject,
  currentPreset,
  currentSubjectPresets,
  setNewPresetName,
  setIsSavePresetModalOpen,
  handleDeleteCurrentPreset,
  handleResetSubjectPresets,
  openTimeEditModal,

  // 오디오 및 볼륨
  isMuteMode,
  toggleMuteMode,
  pacerVolume,
  setPacerVolume,
  triggerExamChime,

  // Wake Lock
  isWakeLockSupported,
  wakeLockEnabled,
  isWakeLockActive,
  toggleWakeLock,

  // 타이머 실행 상태
  examStarted,
  isExamRunning,
  setIsExamRunning,
  handleStartExam,
  handleNextPart,
  handleResetExam,
  setIsReportModalOpen,
  totalExamSeconds,
  remainingSeconds,
  currentPartIndex,
  pipelineParts,
  partElapsed,
  partStatus,
  movePartSequence,
  overallPacing,

  // 시계 표시 모드
  timerDisplayMode,
  setTimerDisplayMode,
  isDarkMode,

  // 통계 대시보드 props
  analyticsSubjectFilter,
  setAnalyticsSubjectFilter,
  expandedHistoryId,
  setExpandedHistoryId,
  editingMemoId,
  setEditingMemoId,
  editingMemoText,
  setEditingMemoText,
  handleUpdateMemo,
  handleDeleteExamHistory,
  handleClearAllHistory,
  handleLoadSampleHistory,

  // 성적 & 등급컷 트래커 props
  scoreHistory = [],
  setScoreHistory,
  showToast
}) => {
  const isApple = designSystem === 'apple';
  const activePart = pipelineParts[currentPartIndex];
  const activePartElapsedSec = activePart ? (partElapsed[activePart.id] || 0) : 0;
  const activePartTargetSec = activePart ? (activePart.targetMinutes * 60) : 1;
  const activePartPct = Math.min(100, Math.round((activePartElapsedSec / activePartTargetSec) * 100));
  const examElapsedSeconds = Math.max(0, totalExamSeconds - remainingSeconds);
  const examProgressPct = totalExamSeconds > 0 ? Math.min(100, (examElapsedSeconds / totalExamSeconds) * 100) : 0;

  return (
    <div className={isApple ? 'space-y-5' : 'space-y-6'}>
      {/* ── 1. 서브 네비게이션 세그먼트 바 ── */}
      {isApple ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="overflow-x-auto no-scrollbar max-w-full">
            <div className="inline-flex items-center p-1 rounded-[13px] apple-glass-well min-w-max">
              {[
                { key: 'timer', label: '실전 타이머', icon: Clock },
                { key: 'reports', label: '과목별 리포트', icon: FileText, count: examHistory.length },
                { key: 'analytics', label: '통계 분석', icon: BarChart3 },
                { key: 'grader', label: '성적 · 등급컷', icon: Award, count: scoreHistory.length },
                { key: 'admission', label: '정시 대학 예측', icon: Target }
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = pacerSubView === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setPacerSubView(item.key)}
                    className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-[9px] text-xs font-medium transition-all duration-150 select-none ${
                      isActive
                        ? 'apple-glass-pill text-[#1D1D1F] dark:text-white font-semibold'
                        : 'text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-white'
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-[#0071E3] dark:text-[#2997FF]' : ''}`} />
                    <span>{item.label}</span>
                    {item.count > 0 && (
                      <span
                        className={`px-1.5 py-0.2 text-[10px] font-mono rounded-full ${
                          isActive
                            ? 'bg-[#0071E3]/12 dark:bg-[#2997FF]/20 text-[#0071E3] dark:text-[#2997FF] font-semibold'
                            : 'bg-black/[0.05] dark:bg-white/[0.08] text-[#6E6E73] dark:text-[#A1A1A6]'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {pacerSubView === 'timer' && examHistory.length > 0 && (
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-medium apple-glass-well text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all self-start sm:self-auto shrink-0"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#2997FF]" />
              <span>최근 리포트 ({examHistory.length})</span>
            </button>
          )}
        </div>
      ) : (
        /* 구형(Legacy) 서브 네비게이션 바 */
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-2 border-b border-black/5 dark:border-white/10">
          <div className="overflow-x-auto no-scrollbar max-w-full py-0.5">
            <div className="inline-flex items-center p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/5 backdrop-blur-xl min-w-max">
              <button
                type="button"
                onClick={() => setPacerSubView('timer')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 select-none ${
                  pacerSubView === 'timer'
                    ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-sm border border-black/[0.04] dark:border-white/10'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>실전 타임어택</span>
              </button>

              <button
                type="button"
                onClick={() => setPacerSubView('reports')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 select-none ${
                  pacerSubView === 'reports'
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm border border-black/[0.04] dark:border-white/10'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>과목별 리포트</span>
                {examHistory.length > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-extrabold">
                    {examHistory.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPacerSubView('analytics')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 select-none ${
                  pacerSubView === 'analytics'
                    ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-black/[0.04] dark:border-white/10'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>통계 대시보드</span>
              </button>

              <button
                type="button"
                onClick={() => setPacerSubView('grader')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 select-none ${
                  pacerSubView === 'grader'
                    ? 'bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 shadow-sm border border-black/[0.04] dark:border-white/10'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>성적 & 등급컷</span>
                {scoreHistory.length > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-extrabold">
                    {scoreHistory.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPacerSubView('admission')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 select-none ${
                  pacerSubView === 'admission'
                    ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-black/[0.04] dark:border-white/10'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>정시 대학 라인</span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-extrabold">
                  NEW
                </span>
              </button>
            </div>
          </div>

          {pacerSubView === 'timer' && examHistory.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transition-all"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>최근 리포트 ({examHistory.length}회)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── 2. 타임어택 메인 뷰 (pacerSubView === 'timer') ── */}
      {pacerSubView === 'timer' && isApple && (
        <div className="space-y-4">
          {/* =================================================================
              [신형 APPLE GLASS UI] 1. 통합 스튜디오 인스펙터 바 (Unified Studio Command Bar)
              기존의 비대한 2개 설명형 카드를 하나의 정밀한 글래스 인스펙터 바로 압축·재배치
             ================================================================= */}
          <div className="glass-card rounded-[20px] p-3.5 sm:p-4">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3.5">
              {/* 좌측 클러스터: 과목 선택 + 전략 프리셋 + 배분/저장 도구 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-w-0">
                  {/* 과목 셀렉터 */}
                  <div className="relative flex items-center apple-glass-well rounded-[12px] px-3 py-2">
                    <span className="text-[11px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mr-2 shrink-0 select-none">
                      과목
                    </span>
                    <select
                      disabled={examStarted}
                      value={selectedSubjectKey}
                      onChange={(e) => handleSelectSubject(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-[13px] font-semibold text-[#1D1D1F] dark:text-white focus:outline-none disabled:opacity-50 cursor-pointer truncate"
                    >
                      <option value="korean" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">1교시 국어 (08:40–10:00 · 80분)</option>
                      <option value="math" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">2교시 수학 (10:30–12:10 · 100분)</option>
                      <option value="english" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">3교시 영어 (13:10–14:20 · 70분)</option>
                      <option value="history" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">4교시 한국사 (14:50–15:20 · 30분)</option>
                      <option value="inquiry" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">4교시 탐구 (15:35–16:15 · 30~40분)</option>
                      <option value="secondLang" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">5교시 제2외국어 (17:35–18:05 · 30분)</option>
                    </select>
                  </div>

                  {/* 전략 프리셋 셀렉터 */}
                  <div className="relative flex items-center apple-glass-well rounded-[12px] px-3 py-2">
                    <span className="text-[11px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mr-2 shrink-0 select-none">
                      전략
                    </span>
                    <select
                      disabled={examStarted}
                      value={selectedPresetId}
                      onChange={(e) => handleSelectPreset(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-[13px] font-semibold text-[#1D1D1F] dark:text-white focus:outline-none disabled:opacity-50 cursor-pointer truncate"
                    >
                      {currentSubjectPresets.map((p) => (
                        <option key={p.id} value={p.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                          {p.name} {p.isSystem ? '· 표준' : '· 커스텀'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 전략 편집 & 저장 퀵 액션 그룹 */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={examStarted}
                    onClick={openTimeEditModal}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[11px] text-xs font-medium apple-glass-well text-[#1D1D1F] dark:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.08] disabled:opacity-40 transition-all select-none"
                    title="파트별 목표 시간 조절"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#2997FF]" />
                    <span>시간 배분</span>
                  </button>

                  <button
                    type="button"
                    disabled={examStarted}
                    onClick={() => {
                      setNewPresetName(`${currentSubject.name} 커스텀 전략`);
                      setIsSavePresetModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-2 rounded-[11px] text-xs font-medium apple-glass-well text-[#1D1D1F] dark:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.08] disabled:opacity-40 transition-all select-none"
                    title="현재 파이프라인을 새 전략 프리셋으로 저장"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#6E6E73] dark:text-[#A1A1A6]" />
                    <span>전략 저장</span>
                  </button>

                  {!currentPreset?.isSystem && (
                    <button
                      type="button"
                      disabled={examStarted}
                      onClick={handleDeleteCurrentPreset}
                      className="p-2 rounded-[10px] apple-glass-well text-[#D70015] dark:text-[#FF453A] hover:bg-[#D70015]/10 disabled:opacity-40 transition-colors"
                      title="현재 커스텀 프리셋 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={examStarted}
                    onClick={handleResetSubjectPresets}
                    className="p-2 rounded-[10px] apple-glass-well text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-white disabled:opacity-40 transition-colors"
                    title="과목 기본 프리셋으로 복원"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 구분선 (Desktop) */}
              <div className="hidden xl:block h-7 w-px bg-black/[0.07] dark:bg-white/[0.08]" />

              {/* 우측 클러스터: 오디오 볼륨 + 타종 프리뷰 + 화면 꺼짐 방지 */}
              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 shrink-0">
                {/* 사운드/무음 토글 & 볼륨 슬라이더 캡슐 */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-[12px] apple-glass-well">
                  <button
                    type="button"
                    onClick={toggleMuteMode}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors select-none ${
                      isMuteMode
                        ? 'text-[#D70015] dark:text-[#FF453A]'
                        : 'text-[#1D1D1F] dark:text-white'
                    }`}
                    title={isMuteMode ? '무음 시각 플래시 모드 켜짐 (클릭하여 소리 켜기)' : '타종 소리 모드 켜짐 (클릭하여 무음 전환)'}
                  >
                    {isMuteMode ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#2997FF]" />}
                    <span className="text-[11px]">{isMuteMode ? '무음 플래시' : '타종음'}</span>
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuteMode ? 0 : pacerVolume}
                    disabled={isMuteMode}
                    onChange={(e) => setPacerVolume(Number(e.target.value))}
                    className="w-20 sm:w-24 apple-slider disabled:opacity-30 cursor-pointer"
                    title={`타종 볼륨: ${isMuteMode ? 0 : pacerVolume}%`}
                  />

                  <span className="text-[11px] font-mono text-[#6E6E73] dark:text-[#A1A1A6] w-7 text-right">
                    {isMuteMode ? 'Mute' : `${pacerVolume}%`}
                  </span>
                </div>

                {/* 타종 시연 세그먼트 */}
                <div className="inline-flex items-center p-0.5 rounded-[11px] apple-glass-well">
                  <span className="text-[10px] font-medium text-[#86868B] px-2 select-none hidden sm:inline">
                    타종
                  </span>
                  {[
                    { key: 'start', label: '본령' },
                    { key: 'warning10m', label: '10분전' },
                    { key: 'end', label: '종료령' }
                  ].map((b) => (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => triggerExamChime(b.key)}
                      className="px-2 py-1 text-[11px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-white/80 dark:hover:bg-white/10 rounded-[8px] transition-all select-none"
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                {/* 화면 유지 (Wake Lock) */}
                {isWakeLockSupported && (
                  <button
                    type="button"
                    onClick={toggleWakeLock}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[11px] text-[11px] font-medium transition-all select-none ${
                      isWakeLockActive
                        ? 'bg-[#248A3D]/12 dark:bg-[#30D158]/15 text-[#248A3D] dark:text-[#30D158] border border-[#248A3D]/25'
                        : 'apple-glass-well text-[#6E6E73] dark:text-[#A1A1A6]'
                    }`}
                    title="시험 중 화면 꺼짐 방지 (Screen Wake Lock)"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isWakeLockActive ? 'bg-[#248A3D] dark:bg-[#30D158]' : 'bg-[#86868B]'}`} />
                    <span>화면 유지</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* =================================================================
              [신형 APPLE GLASS UI] 2. 히어로 콕핏 스테이지 (Hero Cockpit Stage)
              시계 + 디지털 타이머 + 액티브 파트 HUD + 택타일 컨트롤 독 일체형 설계
             ================================================================= */}
          <div className="glass-card rounded-[24px] p-5 sm:p-7 lg:p-8 relative overflow-hidden">
            {/* 상단 스테이지 헤더: 교시 메타 정보 + 실시간 페이스 델타 + 뷰 스위처 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-black/[0.06] dark:border-white/[0.07]">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* 라이브 상태 배지 */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full apple-glass-well text-xs font-semibold text-[#1D1D1F] dark:text-white">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isExamRunning
                        ? 'bg-[#30D158] animate-pulse'
                        : examStarted
                        ? 'bg-[#FF9F0A]'
                        : 'bg-[#0071E3] dark:bg-[#2997FF]'
                    }`}
                  />
                  <span>{currentSubject.period} · {currentSubject.name}</span>
                  <span className="text-[#86868B] font-normal">|</span>
                  <span className="font-mono text-[11px] text-[#6E6E73] dark:text-[#A1A1A6]">
                    {currentSubject.startTimeStr} – {currentSubject.endTimeStr} ({currentSubject.totalMinutes}m)
                  </span>
                </div>

                {/* 종합 페이스 델타 (이모지 없이 정밀 도트 + 수치) */}
                {examStarted && (
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                      overallPacing.delta > 0
                        ? 'bg-[#D70015]/10 dark:bg-[#FF453A]/15 text-[#D70015] dark:text-[#FF453A] border-[#D70015]/20'
                        : 'bg-[#248A3D]/10 dark:bg-[#30D158]/15 text-[#248A3D] dark:text-[#30D158] border-[#248A3D]/20'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        overallPacing.delta > 0 ? 'bg-[#D70015] dark:bg-[#FF453A]' : 'bg-[#248A3D] dark:bg-[#30D158]'
                      }`}
                    />
                    <span>
                      {overallPacing.delta > 0
                        ? `종합 +${formatTime(overallPacing.delta)} 지연`
                        : `종합 -${formatTime(Math.abs(overallPacing.delta))} 여유`}
                    </span>
                  </div>
                )}
              </div>

              {/* 우측: 3대 시계 표시 모드 세그먼트 스위처 (순수 벡터 아이콘) */}
              <div className="inline-flex p-1 rounded-[11px] apple-glass-well self-start sm:self-auto">
                {[
                  { key: 'dual', label: '듀얼', icon: Columns },
                  { key: 'analog', label: '시계', icon: Clock },
                  { key: 'digital', label: '디지털', icon: Hash }
                ].map((mode) => {
                  const ModeIcon = mode.icon;
                  const active = timerDisplayMode === mode.key;
                  return (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => setTimerDisplayMode(mode.key)}
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-[8px] text-xs font-medium transition-all select-none ${
                        active
                          ? 'apple-glass-pill text-[#1D1D1F] dark:text-white font-semibold'
                          : 'text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-white'
                      }`}
                    >
                      <ModeIcon className={`w-3.5 h-3.5 ${active ? 'text-[#0071E3] dark:text-[#2997FF]' : ''}`} />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 메인 타이머 디스플레이 영역 ── */}
            {timerDisplayMode === 'dual' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-5 lg:gap-7">
                {/* 좌측 (5 cols): 수능 시험장 표준 아날로그 시계 독 */}
                <div className="lg:col-span-5 flex flex-col items-center justify-between p-5 sm:p-6 rounded-[20px] apple-glass-well">
                  <div className="w-full flex items-center justify-between text-[11px] font-medium text-[#6E6E73] dark:text-[#A1A1A6] mb-2">
                    <span>CSAT ANALOG REFERENCE</span>
                    <span className="font-mono">{currentSubject.startTimeStr}–{currentSubject.endTimeStr}</span>
                  </div>

                  <div className="my-2 flex items-center justify-center">
                    <CSATAnalogClock
                      subjectMeta={currentSubject}
                      totalExamSeconds={totalExamSeconds}
                      remainingSeconds={remainingSeconds}
                      isExamRunning={isExamRunning}
                      isDark={isDarkMode}
                      sizeClass="w-56 h-56 sm:w-64 sm:h-64"
                      currentPartName={activePart?.name}
                    />
                  </div>

                  <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#86868B] pt-2 border-t border-black/[0.05] dark:border-white/[0.06]">
                    <span>경과 {formatTime(examElapsedSeconds)}</span>
                    <span>총 {currentSubject.totalMinutes}분</span>
                  </div>
                </div>

                {/* 우측 (7 cols): 대형 디지털 리드아웃 + 현재 파트 HUD + 컨트롤 독 */}
                <div className="lg:col-span-7 flex flex-col justify-between p-5 sm:p-7 rounded-[20px] apple-glass-well">
                  {/* 상단: 전체 잔여 시간 대형 타이포그래피 */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b border-black/[0.05] dark:border-white/[0.06]">
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#6E6E73] dark:text-[#A1A1A6] font-semibold">
                        Remaining Time
                      </div>
                      <div className="text-6xl sm:text-7xl xl:text-[5.25rem] font-semibold font-mono tracking-tight text-[#1D1D1F] dark:text-white digital-timer leading-none mt-1">
                        {formatTime(remainingSeconds)}
                      </div>
                    </div>

                    {/* 전체 진행률 미니 게이지 */}
                    <div className="sm:text-right min-w-[140px]">
                      <div className="flex items-center sm:justify-end justify-between gap-2 text-[11px] font-mono text-[#6E6E73] dark:text-[#A1A1A6] mb-1.5">
                        <span>전체 진행률</span>
                        <span className="font-semibold text-[#1D1D1F] dark:text-white">{Math.round(examProgressPct)}%</span>
                      </div>
                      <div className="w-full sm:w-36 h-1.5 bg-black/[0.08] dark:bg-white/[0.1] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0071E3] dark:bg-[#2997FF] transition-all duration-300"
                          style={{ width: `${examProgressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 중단: 현재 활성 파트 HUD 카드 */}
                  <div className="my-5 p-4 rounded-[16px] apple-glass-pill">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-mono font-semibold bg-[#0071E3]/12 dark:bg-[#2997FF]/20 text-[#0071E3] dark:text-[#2997FF]">
                          STEP {String(currentPartIndex + 1).padStart(2, '0')} / {String(pipelineParts.length).padStart(2, '0')}
                        </span>
                        <span className="text-xs font-medium text-[#6E6E73] dark:text-[#A1A1A6]">
                          현재 파트
                        </span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#1D1D1F] dark:text-white">
                        {formatTime(activePartElapsedSec)} <span className="text-[#86868B] font-normal">/ {activePart?.targetMinutes || 0}:00</span>
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="text-lg sm:text-xl font-semibold text-[#1D1D1F] dark:text-white tracking-tight truncate">
                        {activePart?.name || '시험 준비'}
                      </h4>
                      <span className="text-xs text-[#6E6E73] dark:text-[#A1A1A6] truncate hidden sm:inline">
                        {activePart?.desc}
                      </span>
                    </div>

                    {/* 현재 파트 프로그레스 바 */}
                    <div className="w-full h-1.5 bg-black/[0.06] dark:bg-white/[0.08] rounded-full overflow-hidden mt-3">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          activePartElapsedSec > activePartTargetSec
                            ? 'bg-[#D70015] dark:bg-[#FF453A]'
                            : 'bg-[#0071E3] dark:bg-[#2997FF]'
                        }`}
                        style={{ width: `${activePartPct}%` }}
                      />
                    </div>
                  </div>

                  {/* 하단: 애플 택타일 컨트롤 독 (Tactile Control Dock) */}
                  <div className="pt-1">
                    {!examStarted ? (
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={handleStartExam}
                          className="flex-1 min-h-[52px] px-6 py-3.5 rounded-[14px] bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.99] text-white font-semibold text-sm sm:text-base shadow-sm flex items-center justify-between gap-3 transition-all select-none"
                        >
                          <div className="flex items-center gap-2.5">
                            <Play className="w-4 h-4 fill-current" />
                            <span>시험 시작</span>
                            <span className="text-xs font-normal text-white/75 hidden sm:inline">
                              · {pipelineParts[0]?.name}부터 가동
                            </span>
                          </div>
                          <kbd className="apple-kbd-on-primary">Space</kbd>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {/* 일시정지 / 재개 */}
                        <button
                          type="button"
                          onClick={() => setIsExamRunning(!isExamRunning)}
                          className="min-h-[52px] px-4 rounded-[14px] apple-glass-pill text-[#1D1D1F] dark:text-white font-semibold text-xs sm:text-sm flex items-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all select-none"
                          title="단축키: P"
                        >
                          {isExamRunning ? (
                            <Pause className="w-4 h-4 text-[#9A6700] dark:text-[#FFD60A]" />
                          ) : (
                            <Play className="w-4 h-4 fill-current text-[#248A3D] dark:text-[#30D158]" />
                          )}
                          <span>{isExamRunning ? '일시정지' : '재개'}</span>
                          <kbd className="apple-kbd hidden sm:inline-flex">P</kbd>
                        </button>

                        {/* 다음 파트 전환 (Primary Action) */}
                        <button
                          type="button"
                          onClick={handleNextPart}
                          className={`flex-1 min-h-[52px] px-5 py-3.5 rounded-[14px] active:scale-[0.99] text-white font-semibold text-sm sm:text-base flex items-center justify-between gap-2 transition-all select-none ${
                            currentPartIndex >= pipelineParts.length - 1
                              ? 'bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F]'
                              : 'bg-[#0071E3] hover:bg-[#0077ED]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FastForward className="w-4 h-4 shrink-0" />
                            <span className="truncate">
                              {currentPartIndex >= pipelineParts.length - 1
                                ? '시험 종료 및 리포트 생성'
                                : '다음 파트로 전환'}
                            </span>
                          </div>
                          <kbd className="apple-kbd-on-primary shrink-0">Space</kbd>
                        </button>

                        {/* 초기화 */}
                        <button
                          type="button"
                          onClick={handleResetExam}
                          className="min-h-[52px] px-3.5 rounded-[14px] apple-glass-pill text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#D70015] dark:hover:text-[#FF453A] transition-colors flex items-center justify-center"
                          title="시험 초기화"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 아날로그 단독 뷰 또는 디지털 단독 뷰 (Apple Glass Mode) */}
            {(timerDisplayMode === 'analog' || timerDisplayMode === 'digital') && (
              <div className="max-w-2xl mx-auto flex flex-col items-center text-center py-2">
                {timerDisplayMode === 'analog' ? (
                  <div className="flex flex-col items-center">
                    <div className="p-6 rounded-[24px] apple-glass-well">
                      <CSATAnalogClock
                        subjectMeta={currentSubject}
                        totalExamSeconds={totalExamSeconds}
                        remainingSeconds={remainingSeconds}
                        isExamRunning={isExamRunning}
                        isDark={isDarkMode}
                        sizeClass="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80"
                        currentPartName={activePart?.name}
                      />
                    </div>
                    <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-full apple-glass-well">
                      <span className="text-xs text-[#6E6E73] dark:text-[#A1A1A6]">잔여 시간</span>
                      <span className="text-2xl font-semibold font-mono text-[#1D1D1F] dark:text-white digital-timer">
                        {formatTime(remainingSeconds)}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0071E3]/12 text-[#0071E3] dark:text-[#2997FF] font-semibold">
                        {activePart?.name}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="my-4">
                    <div className="text-xs font-mono uppercase tracking-widest text-[#6E6E73] dark:text-[#A1A1A6] font-semibold mb-2">
                      Remaining Exam Time
                    </div>
                    <div className="text-7xl sm:text-8xl md:text-9xl font-semibold font-mono tracking-tight text-[#1D1D1F] dark:text-white digital-timer leading-none">
                      {formatTime(remainingSeconds)}
                    </div>
                    <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-full apple-glass-well">
                      <span className="text-xs font-mono font-semibold text-[#0071E3] dark:text-[#2997FF]">
                        STEP {String(currentPartIndex + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-semibold text-[#1D1D1F] dark:text-white">
                        {activePart?.name}
                      </span>
                      <span className="text-xs font-mono text-[#6E6E73] dark:text-[#A1A1A6]">
                        ({formatTime(activePartElapsedSec)} / {activePart?.targetMinutes}m)
                      </span>
                    </div>
                  </div>
                )}

                {/* 전체 진행률 바 */}
                <div className="w-full max-w-lg mt-6 mb-5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#6E6E73] dark:text-[#A1A1A6] mb-1.5">
                    <span>경과 {formatTime(examElapsedSeconds)}</span>
                    <span>잔여 {formatTime(remainingSeconds)} / {currentSubject.totalMinutes}분</span>
                  </div>
                  <div className="w-full h-2 rounded-full apple-glass-well overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-[#0071E3] dark:bg-[#2997FF] transition-all duration-300"
                      style={{ width: `${(remainingSeconds / totalExamSeconds) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 하단 택타일 컨트롤 독 */}
                <div className="w-full max-w-lg">
                  {!examStarted ? (
                    <button
                      type="button"
                      onClick={handleStartExam}
                      className="w-full min-h-[52px] px-6 py-3.5 rounded-[14px] bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm sm:text-base flex items-center justify-between gap-3 transition-all select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <Play className="w-4 h-4 fill-current" />
                        <span>시험 시작 ({pipelineParts[0]?.name}부터 가동)</span>
                      </div>
                      <kbd className="apple-kbd-on-primary">Space</kbd>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsExamRunning(!isExamRunning)}
                        className="min-h-[52px] px-4 rounded-[14px] apple-glass-pill text-[#1D1D1F] dark:text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all select-none"
                      >
                        {isExamRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                        <span>{isExamRunning ? '일시정지' : '재개'}</span>
                        <kbd className="apple-kbd hidden sm:inline-flex">P</kbd>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextPart}
                        className="flex-1 min-h-[52px] px-5 py-3.5 rounded-[14px] bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm sm:text-base flex items-center justify-between gap-2 transition-all select-none"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FastForward className="w-4 h-4 shrink-0" />
                          <span className="truncate">
                            {currentPartIndex >= pipelineParts.length - 1
                              ? '시험 종료 및 리포트'
                              : `${activePart?.name} 완료 · 다음 파트`}
                          </span>
                        </div>
                        <kbd className="apple-kbd-on-primary shrink-0">Space</kbd>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetExam}
                        className="min-h-[52px] px-3.5 rounded-[14px] apple-glass-pill text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#D70015] transition-colors flex items-center justify-center"
                        title="시험 초기화"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* =================================================================
              [신형 APPLE GLASS UI] 3. 순차 파이프라인 트랙 (Sequential Pipeline Track)
              이모지 완전 제거 + 정밀 넘버링(01~04) + 미니 진행률 바 + 깔끔한 상태 뱃지
             ================================================================= */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm sm:text-base font-semibold text-[#1D1D1F] dark:text-white tracking-tight">
                  순차 풀이 파이프라인
                </h3>
                <span className="text-xs text-[#6E6E73] dark:text-[#A1A1A6]">
                  {!examStarted
                    ? '시험 시작 전 화살표로 파트 순서를 자유롭게 변경할 수 있습니다.'
                    : '목표 시간을 초과해도 타이머는 멈추지 않고 초과 시간을 정밀 계측합니다.'}
                </span>
              </div>

              {!examStarted && (
                <button
                  type="button"
                  onClick={openTimeEditModal}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#0071E3] dark:text-[#2997FF] hover:underline self-start sm:self-auto"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>파트별 시간 편집</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {pipelineParts.map((part, idx) => {
                const isActive = examStarted && currentPartIndex === idx;
                const isCompleted = partStatus[part.id] === 'completed';

                const targetSec = part.targetMinutes * 60;
                const actualSec = partElapsed[part.id] || 0;
                const deltaSec = actualSec - targetSec;
                const isOvertime = deltaSec > 0;
                const partPct = Math.min(100, Math.round((actualSec / Math.max(1, targetSec)) * 100));

                return (
                  <div
                    key={part.id}
                    className={`glass-card rounded-[18px] p-4.5 sm:p-5 transition-all duration-200 relative overflow-hidden flex flex-col justify-between select-none ${
                      isActive
                        ? isOvertime
                          ? 'ring-2 ring-[#D70015] dark:ring-[#FF453A]'
                          : 'ring-2 ring-[#0071E3] dark:ring-[#2997FF]'
                        : isCompleted
                        ? 'opacity-85'
                        : 'opacity-90'
                    }`}
                  >
                    <div>
                      {/* 상단: 스텝 번호 + 상태 캡슐 + 순서 이동 버튼 */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-[6px] ${
                              isActive
                                ? isOvertime
                                  ? 'bg-[#D70015] text-white'
                                  : 'bg-[#0071E3] dark:bg-[#2997FF] text-white'
                                : isCompleted
                                ? 'bg-[#248A3D]/15 text-[#248A3D] dark:text-[#30D158]'
                                : 'apple-glass-well text-[#6E6E73] dark:text-[#A1A1A6]'
                            }`}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                              isActive
                                ? isOvertime
                                  ? 'text-[#D70015] dark:text-[#FF453A] font-semibold'
                                  : 'text-[#0071E3] dark:text-[#2997FF] font-semibold'
                                : isCompleted
                                ? 'text-[#248A3D] dark:text-[#30D158]'
                                : 'text-[#86868B]'
                            }`}
                          >
                            {isActive ? (
                              <>
                                <span
                                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                    isOvertime ? 'bg-[#D70015]' : 'bg-[#0071E3] dark:bg-[#2997FF]'
                                  }`}
                                />
                                <span>{isOvertime ? '초과 진행' : '진행 중'}</span>
                              </>
                            ) : isCompleted ? (
                              <>
                                <Check className="w-3 h-3 stroke-[2.5]" />
                                <span>완료</span>
                              </>
                            ) : (
                              <span>대기</span>
                            )}
                          </span>
                        </div>

                        {!examStarted && (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => movePartSequence(idx, -1)}
                              title="앞 순서로 이동"
                              className="p-1 rounded-[7px] apple-glass-well text-[#6E6E73] dark:text-[#A1A1A6] disabled:opacity-25 hover:text-[#1D1D1F] dark:hover:text-white transition-all"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === pipelineParts.length - 1}
                              onClick={() => movePartSequence(idx, 1)}
                              title="뒤 순서로 이동"
                              className="p-1 rounded-[7px] apple-glass-well text-[#6E6E73] dark:text-[#A1A1A6] disabled:opacity-25 hover:text-[#1D1D1F] dark:hover:text-white transition-all"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 파트 타이틀 & 설명 */}
                      <h4 className="font-semibold text-[15px] text-[#1D1D1F] dark:text-white leading-snug tracking-tight">
                        {part.name}
                      </h4>

                      <p className="text-xs text-[#6E6E73] dark:text-[#A1A1A6] mt-1 line-clamp-2 leading-relaxed">
                        {part.desc}
                      </p>
                    </div>

                    {/* 하단: 파트별 미니 프로그레스 & 시간 메트릭 */}
                    <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] space-y-2">
                      <div className="w-full h-1 bg-black/[0.06] dark:bg-white/[0.08] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOvertime
                              ? 'bg-[#D70015] dark:bg-[#FF453A]'
                              : isCompleted
                              ? 'bg-[#248A3D] dark:bg-[#30D158]'
                              : 'bg-[#0071E3] dark:bg-[#2997FF]'
                          }`}
                          style={{ width: `${partPct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-[#6E6E73] dark:text-[#A1A1A6]">
                          목표 {part.targetMinutes}분
                        </span>
                        <span
                          className={`font-semibold ${
                            isActive
                              ? 'text-[#0071E3] dark:text-[#2997FF]'
                              : 'text-[#1D1D1F] dark:text-white'
                          }`}
                        >
                          {formatTime(actualSec)}
                        </span>
                      </div>

                      {(isActive || isCompleted) && (
                        <div className="flex items-center justify-between text-[11px] font-mono pt-0.5">
                          <span className="text-[#86868B]">편차</span>
                          <span
                            className={`px-2 py-0.2 rounded-full font-semibold ${
                              isOvertime
                                ? 'bg-[#D70015]/10 text-[#D70015] dark:text-[#FF453A]'
                                : 'bg-[#248A3D]/10 text-[#248A3D] dark:text-[#30D158]'
                            }`}
                          >
                            {isOvertime ? `+${formatTime(deltaSec)} 초과` : `-${formatTime(Math.abs(deltaSec))} 단축`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. 최근 응시 모의고사 요약 바 */}
          {!examStarted && examHistory.some((h) => h.subject === selectedSubjectKey) && (
            <div className="glass-card p-4 sm:p-5 rounded-[18px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {(() => {
                const latestSession = examHistory.find((h) => h.subject === selectedSubjectKey);
                if (!latestSession) return null;
                const delta =
                  latestSession.totalDeltaSec !== undefined
                    ? latestSession.totalDeltaSec
                    : (latestSession.totalElapsed || 0) - (latestSession.totalTargetSec || 0);
                const isOver = delta > 0;

                return (
                  <>
                    <div className="flex flex-wrap items-center gap-2.5 text-xs">
                      <span className="px-2.5 py-1 rounded-[8px] apple-glass-well font-semibold text-[#1D1D1F] dark:text-white">
                        최근 {currentSubject.name} 기록
                      </span>
                      <span className="font-medium text-[#1D1D1F] dark:text-white">
                        {latestSession.presetName || '표준 전략'}
                      </span>
                      <span className="text-[#86868B] font-mono">{latestSession.date}</span>
                      {latestSession.memo && (
                        <span className="text-[#6E6E73] dark:text-[#A1A1A6] truncate max-w-md">
                          · “{latestSession.memo}”
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <span className="font-mono font-semibold text-[#1D1D1F] dark:text-white">
                        {formatTime(latestSession.totalElapsed || 0)} 소요
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono font-semibold text-[11px] ${
                          isOver
                            ? 'bg-[#D70015]/10 text-[#D70015] dark:text-[#FF453A]'
                            : 'bg-[#248A3D]/10 text-[#248A3D] dark:text-[#30D158]'
                        }`}
                      >
                        {isOver ? `+${formatTime(delta)}` : `-${formatTime(Math.abs(delta))}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPacerSubView('reports')}
                        className="inline-flex items-center gap-0.5 font-medium text-[#0071E3] dark:text-[#2997FF] hover:underline"
                      >
                        <span>전체 리포트</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          [구형 LEGACY UI 보존] (designSystem === 'legacy' 전환 시 100% 동일 렌더링)
         ===================================================================== */}
      {pacerSubView === 'timer' && !isApple && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 glass-card bg-white/75 dark:bg-zinc-900/75 p-5 rounded-[26px] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white tracking-tight">
                      과목 및 풀이 전략
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                      수능 표준 시험 시간표 및 과목별 파이프라인 순서
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-300 border border-black/5 dark:border-white/5">
                  {currentPreset?.isSystem ? '공식 표준' : '사용자 커스텀'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 pl-1">과목 선택</label>
                  <select
                    disabled={examStarted}
                    value={selectedSubjectKey}
                    onChange={(e) => handleSelectSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 cursor-pointer transition-all"
                  >
                    <option value="korean" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">1교시 국어 (08:40 ~ 10:00, 80분)</option>
                    <option value="math" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">2교시 수학 (10:30 ~ 12:10, 100분)</option>
                    <option value="english" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">3교시 영어 (13:10 ~ 14:20, 70분)</option>
                    <option value="history" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">4교시 한국사 (14:50 ~ 15:20, 30분)</option>
                    <option value="inquiry" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">4교시 탐구 (15:35 ~ 16:15, 30~40분)</option>
                    <option value="secondLang" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">5교시 제2외국어 (17:35 ~ 18:05, 30분)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 pl-1">순서 전략</label>
                  <div className="relative">
                    <select
                      disabled={examStarted}
                      value={selectedPresetId}
                      onChange={(e) => handleSelectPreset(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 cursor-pointer truncate transition-all"
                    >
                      {currentSubjectPresets.map((p) => (
                        <option key={p.id} value={p.id} className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">
                          {p.name} {p.isSystem ? '(표준)' : '(커스텀)'}
                        </option>
                      ))}
                    </select>
                    <Bookmark className="w-3.5 h-3.5 text-indigo-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-black/5 dark:border-white/5">
                <button
                  type="button"
                  disabled={examStarted}
                  onClick={openTimeEditModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/[0.03] hover:bg-black/[0.06] dark:bg-white/[0.05] dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200 border border-black/5 dark:border-white/5 disabled:opacity-50 transition-all"
                >
                  <Settings className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>시간 조절</span>
                </button>

                <button
                  type="button"
                  disabled={examStarted}
                  onClick={() => {
                    setNewPresetName(`${currentSubject.name} 커스텀 전략`);
                    setIsSavePresetModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 disabled:opacity-50 transition-all"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>새 전략 저장</span>
                </button>

                {!currentPreset?.isSystem && (
                  <button
                    type="button"
                    disabled={examStarted}
                    onClick={handleDeleteCurrentPreset}
                    className="p-1.5 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors"
                    title="현재 커스텀 프리셋 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  disabled={examStarted}
                  onClick={handleResetSubjectPresets}
                  className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-black/[0.05] dark:hover:bg-white/10 border border-black/5 dark:border-white/5 transition-colors ml-auto"
                  title="과목 표준 프리셋으로 초기화"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 glass-card bg-white/75 dark:bg-zinc-900/75 p-5 rounded-[26px] border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white tracking-tight">
                      집중 환경 및 오디오
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                      Web Audio 타종 및 화면 꺼짐 방지 제어
                    </p>
                  </div>
                </div>

                {isWakeLockSupported ? (
                  <button
                    type="button"
                    onClick={toggleWakeLock}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                      isWakeLockActive
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-black/[0.03] dark:bg-white/[0.05] text-zinc-500 dark:text-zinc-400 border-black/5 dark:border-white/5'
                    }`}
                  >
                    <Lightbulb className={`w-3 h-3 ${isWakeLockActive ? 'text-emerald-500 fill-emerald-500' : 'text-zinc-400'}`} />
                    <span>{isWakeLockActive ? '화면 유지 ON' : '화면 유지 OFF'}</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-zinc-400">화면 유지 미지원</span>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={toggleMuteMode}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                      isMuteMode
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {isMuteMode ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isMuteMode ? '무음 시각 플래시' : '타종 소리 모드'}</span>
                  </button>

                  <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-300">
                    {isMuteMode ? '0%' : `${pacerVolume}%`}
                  </span>
                </div>

                <div className="pt-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuteMode ? 0 : pacerVolume}
                    disabled={isMuteMode}
                    onChange={(e) => setPacerVolume(Number(e.target.value))}
                    className="w-full apple-slider disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-black/5 dark:border-white/5">
                <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">타종 테스트:</span>
                <div className="inline-flex rounded-full p-0.5 bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => triggerExamChime('start')}
                    className="px-2.5 py-1 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 rounded-full flex items-center gap-1 transition-all"
                  >
                    <Bell className="w-3 h-3 text-indigo-500" />
                    <span>본령</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerExamChime('warning10m')}
                    className="px-2.5 py-1 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-all"
                  >
                    10분전
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerExamChime('end')}
                    className="px-2.5 py-1 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-all"
                  >
                    종료령
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 구형 메인 히어로 스테이지 */}
          <div className="glass-card bg-white/75 dark:bg-zinc-900/75 p-6 sm:p-10 rounded-[32px] border border-white/80 dark:border-white/10 shadow-xl dark:shadow-2xl text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-black/5 dark:border-white/5">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <span>🏛️ {currentSubject.period} {currentSubject.name}</span>
                    <span className="opacity-40">|</span>
                    <span className="font-mono">{currentSubject.startTimeStr} ~ {currentSubject.endTimeStr} ({currentSubject.totalMinutes}분)</span>
                  </div>

                  {examStarted && (
                    <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                      overallPacing.delta > 0
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse'
                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    }`}>
                      <span>
                        {overallPacing.delta > 0
                          ? `⚠️ 종합 페이스: +${formatTime(overallPacing.delta)} 지연 중`
                          : `✨ 종합 페이스: -${formatTime(Math.abs(overallPacing.delta))} 여유 확보`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="inline-flex p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/5 backdrop-blur-md self-center sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setTimerDisplayMode('dual')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      timerDisplayMode === 'dual'
                        ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>듀얼 뷰</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimerDisplayMode('analog')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      timerDisplayMode === 'analog'
                        ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <span>🕰️ 시계만</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimerDisplayMode('digital')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      timerDisplayMode === 'digital'
                        ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-xs'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <span>⏱️ 디지털만</span>
                  </button>
                </div>
              </div>

              {timerDisplayMode === 'dual' && (
                <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-6 lg:gap-8 my-2">
                  <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-black/[0.02] dark:bg-white/[0.03] rounded-[28px] border border-black/5 dark:border-white/5 shadow-inner">
                    <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5 text-center">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                      <span>수능 시험장 표준 시계 ({currentSubject.startTimeStr} ~ {currentSubject.endTimeStr})</span>
                    </div>
                    <CSATAnalogClock
                      subjectMeta={currentSubject}
                      totalExamSeconds={totalExamSeconds}
                      remainingSeconds={remainingSeconds}
                      isExamRunning={isExamRunning}
                      isDark={isDarkMode}
                      sizeClass="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72"
                      currentPartName={activePart?.name}
                    />
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-black/[0.02] dark:bg-white/[0.03] rounded-[28px] border border-black/5 dark:border-white/5 shadow-inner text-center">
                    <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold mb-1">
                      전체 시험 잔여 시간
                    </div>
                    <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-mono tracking-tighter text-zinc-900 dark:text-white digital-timer drop-shadow-sm my-1">
                      {formatTime(remainingSeconds)}
                    </div>

                    <div className="mt-4 w-full max-w-xs px-5 py-3 rounded-2xl bg-indigo-500/10 dark:bg-white/[0.05] border border-indigo-500/20 dark:border-white/10 text-center shadow-xs">
                      <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                        현재 파트 ({currentPartIndex + 1}/{pipelineParts.length})
                      </div>
                      <div className="text-base sm:text-lg font-black text-zinc-900 dark:text-white truncate mt-0.5">
                        {activePart?.name || '시험 준비'}
                      </div>
                      <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-0.5">
                        목표 {activePart?.targetMinutes}분 · 소요 {formatTime(activePartElapsedSec)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {timerDisplayMode === 'analog' && (
                <div className="flex flex-col items-center justify-center my-4">
                  <CSATAnalogClock
                    subjectMeta={currentSubject}
                    totalExamSeconds={totalExamSeconds}
                    remainingSeconds={remainingSeconds}
                    isExamRunning={isExamRunning}
                    isDark={isDarkMode}
                    sizeClass="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96"
                    currentPartName={activePart?.name}
                  />
                  <div className="mt-5 flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 shadow-sm">
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-bold">잔여 시간:</span>
                    <span className="text-3xl font-black font-mono text-zinc-900 dark:text-white">
                      {formatTime(remainingSeconds)}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold truncate max-w-[150px]">
                      {activePart?.name}
                    </span>
                  </div>
                </div>
              )}

              {timerDisplayMode === 'digital' && (
                <div className="my-6">
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold mb-2">
                    전체 시험 잔여 시간
                  </div>
                  <div className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black font-mono tracking-tighter text-zinc-900 dark:text-white digital-timer drop-shadow-sm my-2">
                    {formatTime(remainingSeconds)}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 dark:bg-white/[0.06] border border-indigo-500/20 dark:border-white/10">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      Step {currentPartIndex + 1}: {activePart?.name}
                    </span>
                    <span className="opacity-40">·</span>
                    <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
                      목표 {activePart?.targetMinutes}분
                    </span>
                  </div>
                </div>
              )}

              <div className="w-full max-w-xl mx-auto mt-4 mb-4">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 px-1">
                  <span>경과 {formatTime(examElapsedSeconds)}</span>
                  <span>잔여 {formatTime(remainingSeconds)} / {currentSubject.totalMinutes}분</span>
                </div>
                <div className="w-full h-2.5 bg-black/[0.06] dark:bg-white/[0.08] rounded-full overflow-hidden p-0.5 border border-black/5 dark:border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500 transition-all duration-300"
                    style={{ width: `${(remainingSeconds / totalExamSeconds) * 100}%` }}
                  />
                </div>
              </div>

              <div className="w-full max-w-xl mx-auto pt-3">
                <div className="flex items-center justify-center gap-2.5">
                  {!examStarted ? (
                    <button
                      type="button"
                      onClick={handleStartExam}
                      className="flex-1 min-h-[58px] py-4 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-base sm:text-lg shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-3 transition-all select-none"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>시험 시작 (1번 파트부터 가동) [Space]</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsExamRunning(!isExamRunning)}
                        className={`px-4 sm:px-5 py-4 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm select-none ${
                          isExamRunning
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isExamRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                        <span className="hidden sm:inline">{isExamRunning ? '일시정지 (P)' : '재개 (P)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextPart}
                        className={`flex-1 min-h-[58px] py-4 px-6 rounded-full active:scale-95 text-white font-black text-base sm:text-lg shadow-xl flex items-center justify-center gap-3 transition-all select-none ${
                          currentPartIndex >= pipelineParts.length - 1
                            ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-rose-600/30'
                            : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 shadow-emerald-600/25 animate-pulse-glow'
                        }`}
                      >
                        <FastForward className="w-5 h-5" />
                        <span className="truncate">
                          {currentPartIndex >= pipelineParts.length - 1
                            ? '🏁 시험 종료 및 리포트 (Space)'
                            : `⏩ [${activePart?.name}] 완료 ➔ 다음 파트 (Space)`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetExam}
                        className="p-4 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/15 text-zinc-600 dark:text-zinc-300 transition-all active:scale-95"
                        title="시험 초기화"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 구형 순차 파이프라인 카드 그리드 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2 tracking-tight">
                  <Target className="w-4 h-4 text-indigo-500" />
                  <span>순차 풀이 파이프라인 (Sequential Flow)</span>
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pipelineParts.map((part, idx) => {
                const isActive = examStarted && currentPartIndex === idx;
                const isCompleted = partStatus[part.id] === 'completed';

                const targetSec = part.targetMinutes * 60;
                const actualSec = partElapsed[part.id] || 0;
                const deltaSec = actualSec - targetSec;
                const isOvertime = deltaSec > 0;

                return (
                  <div
                    key={part.id}
                    className={`rounded-[24px] p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between select-none ${
                      isActive
                        ? isOvertime
                          ? 'glass-card bg-rose-50/90 dark:bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-500/20 ring-2 ring-rose-500/40 scale-[1.02]'
                          : 'glass-card bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/40 scale-[1.02]'
                        : isCompleted
                        ? 'glass-card bg-black/[0.02] dark:bg-white/[0.03] border-emerald-500/30 dark:border-emerald-500/20 opacity-90'
                        : 'glass-card bg-white/70 dark:bg-zinc-900/70 border-black/5 dark:border-white/10 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2.5">
                        <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                          isActive
                            ? isOvertime
                              ? 'bg-rose-600 text-white'
                              : 'bg-indigo-600 text-white'
                            : isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-black/[0.05] dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-400'
                        }`}>
                          {isActive
                            ? isOvertime ? '🔥 초과 풀이 중' : '⚡ 현재 풀이 중'
                            : isCompleted ? '✓ 완료' : `Step ${idx + 1}`}
                        </span>

                        {!examStarted && (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => movePartSequence(idx, -1)}
                              className="p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-300 disabled:opacity-20"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === pipelineParts.length - 1}
                              onClick={() => movePartSequence(idx, 1)}
                              className="p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-300 disabled:opacity-20"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <h4 className="font-black text-base text-zinc-900 dark:text-white leading-snug tracking-tight">
                        {part.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                        {part.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 space-y-1 font-mono text-xs">
                      <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                        <span>목표:</span>
                        <strong>{part.targetMinutes}분 (00:00)</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500 dark:text-zinc-400">실제 소요:</span>
                        <strong className="text-sm text-zinc-800 dark:text-zinc-200">
                          {formatTime(actualSec)}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. 과목별 실전 모의고사 리포트 리스트 뷰 ── */}
      {pacerSubView === 'reports' && (
        <SubjectReportList
          examHistory={examHistory}
          selectedSubjectKey={selectedSubjectKey}
          onSelectSubject={handleSelectSubject}
          setPacerSubView={setPacerSubView}
          handleUpdateMemo={handleUpdateMemo}
          handleDeleteExamHistory={handleDeleteExamHistory}
        />
      )}

      {/* ── 4. 타임 통계 대시보드 뷰 ── */}
      {pacerSubView === 'analytics' && (
        <StatsDashboard
          examHistory={examHistory}
          analyticsSubjectFilter={analyticsSubjectFilter}
          setAnalyticsSubjectFilter={setAnalyticsSubjectFilter}
          expandedHistoryId={expandedHistoryId}
          setExpandedHistoryId={setExpandedHistoryId}
          editingMemoId={editingMemoId}
          setEditingMemoId={setEditingMemoId}
          editingMemoText={editingMemoText}
          setEditingMemoText={setEditingMemoText}
          handleUpdateMemo={handleUpdateMemo}
          handleDeleteExamHistory={handleDeleteExamHistory}
          handleClearAllHistory={handleClearAllHistory}
          handleLoadSampleHistory={handleLoadSampleHistory}
          setPacerSubView={setPacerSubView}
        />
      )}

      {/* ── 5. 기출 공식 등급컷 & 성적 트래커 뷰 ── */}
      {pacerSubView === 'grader' && (
        <ScoreTracker
          scoreHistory={scoreHistory}
          setScoreHistory={setScoreHistory}
          initialSubjectKey={selectedSubjectKey}
          showToast={showToast}
          onGoToAdmission={() => setPacerSubView('admission')}
          onOpenShareCard={onOpenShareCard}
        />
      )}

      {/* ── 6. 정시 모의배치 & 대학 라인 판정기 뷰 ── */}
      {pacerSubView === 'admission' && (
        <AdmissionPredictor
          scoreHistory={scoreHistory}
          showToast={showToast}
          onGoToSprint={onGoToSprint}
          onOpenShareCard={onOpenShareCard}
        />
      )}
    </div>
  );
};

export default ExamPacer;
