import React from 'react';
import {
  Clock,
  FileText,
  BarChart3,
  Award,
  Target,
  Settings,
  Bookmark,
  Trash2,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Bell,
  Lightbulb,
  Play,
  Pause,
  FastForward,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import Icon from '../common/Icon';
import CSATAnalogClock from '../clock/CSATAnalogClock';
import StatsDashboard from '../analytics/StatsDashboard';
import SubjectReportList from './SubjectReportList';
import ScoreTracker from '../grade/ScoreTracker';
import AdmissionPredictor from '../admission/AdmissionPredictor';
import { formatTime } from '../../utils/pacing';

export const ExamPacer = ({
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

  // 성적 & 등급컷 트래커 props
  scoreHistory = [],
  setScoreHistory,
  showToast
}) => {
  return (
    <div className="space-y-6">
      {/* ── 1. 애플 스타일 서브 네비게이션 세그먼트 바 ── */}
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

        {/* 우측 퀵 버튼 그룹 (최근 리포트) */}
        <div className="flex items-center gap-2 shrink-0">
          {pacerSubView === 'timer' && examHistory.length > 0 && (
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>최근 리포트 ({examHistory.length}회)</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 2. 타임어택 메인 뷰 (pacerSubView === 'timer') ── */}
      {pacerSubView === 'timer' && (
        <div className="space-y-6">
          {/* 애플 컨트롤 센터 스타일 상단 2분할 위젯 카드 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* 위젯 A: 과목 & 파이프라인 전략 (7 cols) */}
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
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-300 border border-black/5 dark:border-white/5">
                  {currentPreset?.isSystem ? '공식 표준' : '사용자 커스텀'}
                </span>
              </div>

              {/* 드롭다운 셀렉터 그룹 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 과목 선택 */}
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

                {/* 전략 선택 */}
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

              {/* 하단 전략 관리 도구 바 */}
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

            {/* 위젯 B: 오디오 & 집중 환경 컨트롤 센터 (5 cols) */}
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
                  </div>
                </div>

                {/* 화면 꺼짐 방지 토글 */}
                {isWakeLockSupported ? (
                  <button
                    type="button"
                    onClick={toggleWakeLock}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                      isWakeLockActive
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-black/[0.03] dark:bg-white/[0.05] text-zinc-500 dark:text-zinc-400 border-black/5 dark:border-white/5'
                    }`}
                    title="화면 꺼짐 방지 (Wake Lock) 토글"
                  >
                    <Lightbulb className={`w-3 h-3 ${isWakeLockActive ? 'text-emerald-500 fill-emerald-500' : 'text-zinc-400'}`} />
                    <span>{isWakeLockActive ? '화면 유지 ON' : '화면 유지 OFF'}</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-zinc-400">화면 유지 미지원</span>
                )}
              </div>

              {/* 볼륨 슬라이더 및 모드 전환 (애플 컨트롤 슬라이더 스타일) */}
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
                    title={`타종 볼륨: ${isMuteMode ? 0 : pacerVolume}%`}
                  />
                </div>
              </div>

              {/* 타종음 테스트 프리뷰 버튼 */}
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

          {/* ── 3. 메인 히어로 스테이지 (CSAT 시계 & 대형 타이머 & 액션 바) ── */}
          <div className="glass-card bg-white/75 dark:bg-zinc-900/75 p-6 sm:p-10 rounded-[32px] border border-white/80 dark:border-white/10 shadow-xl dark:shadow-2xl text-center relative overflow-hidden">
            {/* 시험 가동 시 앰비언트 글로우 */}
            <div
              className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[32rem] h-64 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ${
                isExamRunning ? 'bg-indigo-500/20 dark:bg-indigo-500/25' : 'bg-transparent'
              }`}
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* 상단 메타 바: 교시 배지 + 종합 페이스 + 시계 모드 스위처 */}
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-black/5 dark:border-white/5">
                {/* 좌측: 교시 배지 & 실시간 페이스 델타 */}
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

                {/* 우측: 시계 표시 모드 세그먼트 스위처 */}
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

              {/* ── 타이머 메인 뷰 (듀얼 / 아날로그 / 디지털) ── */}
              {timerDisplayMode === 'dual' && (
                <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-6 lg:gap-8 my-2">
                  {/* 좌측: 수능 시험장 규격 아날로그 시계 */}
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
                      currentPartName={pipelineParts[currentPartIndex]?.name}
                    />
                  </div>

                  {/* 우측: 애플 카운트다운 타이머 & 현재 파트 다이내믹 아일랜드 */}
                  <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-black/[0.02] dark:bg-white/[0.03] rounded-[28px] border border-black/5 dark:border-white/5 shadow-inner text-center">
                    <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold mb-1">
                      전체 시험 잔여 시간
                    </div>
                    <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-mono tracking-tighter text-zinc-900 dark:text-white digital-timer drop-shadow-sm my-1">
                      {formatTime(remainingSeconds)}
                    </div>

                    {/* 현재 파트 다이내믹 캡슐 */}
                    <div className="mt-4 w-full max-w-xs px-5 py-3 rounded-2xl bg-indigo-500/10 dark:bg-white/[0.05] border border-indigo-500/20 dark:border-white/10 text-center shadow-xs">
                      <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                        현재 파트 ({currentPartIndex + 1}/{pipelineParts.length})
                      </div>
                      <div className="text-base sm:text-lg font-black text-zinc-900 dark:text-white truncate mt-0.5">
                        {pipelineParts[currentPartIndex]?.name || '시험 준비'}
                      </div>
                      <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-0.5">
                        목표 {pipelineParts[currentPartIndex]?.targetMinutes}분 · 소요 {formatTime(partElapsed[pipelineParts[currentPartIndex]?.id] || 0)}
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
                    currentPartName={pipelineParts[currentPartIndex]?.name}
                  />
                  <div className="mt-5 flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 shadow-sm">
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-bold">잔여 시간:</span>
                    <span className="text-3xl font-black font-mono text-zinc-900 dark:text-white">
                      {formatTime(remainingSeconds)}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold truncate max-w-[150px]">
                      {pipelineParts[currentPartIndex]?.name}
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
                      Step {currentPartIndex + 1}: {pipelineParts[currentPartIndex]?.name}
                    </span>
                    <span className="opacity-40">·</span>
                    <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
                      목표 {pipelineParts[currentPartIndex]?.targetMinutes}분
                    </span>
                  </div>
                </div>
              )}

              {/* 전체 시험 잔여율 프로그레스 바 */}
              <div className="w-full max-w-xl mx-auto mt-4 mb-4">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 px-1">
                  <span>경과 {formatTime(totalExamSeconds - remainingSeconds)}</span>
                  <span>잔여 {formatTime(remainingSeconds)} / {currentSubject.totalMinutes}분</span>
                </div>
                <div className="w-full h-2.5 bg-black/[0.06] dark:bg-white/[0.08] rounded-full overflow-hidden p-0.5 border border-black/5 dark:border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500 transition-all duration-300"
                    style={{ width: `${(remainingSeconds / totalExamSeconds) * 100}%` }}
                  />
                </div>
              </div>

              {/* ── 하단 컨트롤 독 (Apple Floating Dock) ── */}
              <div className="w-full max-w-xl mx-auto pt-3">
                <div className="flex items-center justify-center gap-2.5">
                  {!examStarted ? (
                    <button
                      type="button"
                      onClick={handleStartExam}
                      className="flex-1 min-h-[58px] py-4 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-base sm:text-lg shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-3 transition-all select-none"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>시험 시작</span>
                    </button>
                  ) : (
                    <>
                      {/* 일시정지 / 재개 버튼 */}
                      <button
                        type="button"
                        onClick={() => setIsExamRunning(!isExamRunning)}
                        className={`px-4 sm:px-5 py-4 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm select-none ${
                          isExamRunning
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                        title="단축키: P"
                      >
                        {isExamRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                        <span className="hidden sm:inline">
                          {isExamRunning ? '일시정지' : '재개'}
                        </span>
                      </button>

                      {/* 다음 파트 넘어가기 버튼 (메인) */}
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
                            ? '시험 종료 및 리포트'
                            : `${pipelineParts[currentPartIndex]?.name} 완료 ➔ 다음 파트`}
                        </span>
                      </button>

                      {/* 리셋 버튼 */}
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

                <p className="text-[10px] text-zinc-400/80 dark:text-zinc-500/80 mt-2 font-mono select-none">
                  단축키: Space (다음) · P (일시정지)
                </p>
              </div>
            </div>
          </div>

          {/* ── 4. 순차 파이프라인 카드 그리드 (Sequential Flow) ── */}
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
                    {/* 상단 액티브 림 */}
                    {isActive && (
                      <div className={`absolute top-0 left-0 right-0 h-1.5 ${isOvertime ? 'bg-rose-500' : 'bg-indigo-500'} animate-pulse`} />
                    )}

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
                            ? isOvertime ? '초과' : '풀이 중'
                            : isCompleted ? '완료' : `Step ${idx + 1}`}
                        </span>

                        {!examStarted && (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => movePartSequence(idx, -1)}
                              title="앞 순서로 이동"
                              className="p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-300 disabled:opacity-20 hover:bg-black/[0.08] dark:hover:bg-white/15 transition-all"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === pipelineParts.length - 1}
                              onClick={() => movePartSequence(idx, 1)}
                              title="뒤 순서로 이동"
                              className="p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-300 disabled:opacity-20 hover:bg-black/[0.08] dark:hover:bg-white/15 transition-all"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <h4 className="font-black text-base text-zinc-900 dark:text-white leading-snug tracking-tight">
                        {part.name}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 space-y-1 font-mono text-xs">
                      <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                        <span>목표</span>
                        <strong>{part.targetMinutes}분</strong>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500 dark:text-zinc-400">소요</span>
                        <strong className={`text-sm ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-zinc-800 dark:text-zinc-200'}`}>
                          {formatTime(actualSec)}
                        </strong>
                      </div>

                      {(isActive || isCompleted) && (
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[11px] text-zinc-400">편차</span>
                          <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                            isOvertime
                              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                              : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {isOvertime ? `+${formatTime(deltaSec)}` : `-${formatTime(Math.abs(deltaSec))}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 5. 최근 응시 모의고사 요약 위젯 카드 ── */}
          {!examStarted && examHistory.some((h) => h.subject === selectedSubjectKey) && (
            <div className="glass-card bg-white/75 dark:bg-zinc-900/75 p-5 rounded-[26px] border border-white/60 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <h4 className="font-black text-sm text-zinc-900 dark:text-white tracking-tight">
                    {currentSubject.name} 최근 모의고사 기록
                  </h4>
                  <span className="text-xs text-zinc-400 font-mono">
                    ({examHistory.filter((h) => h.subject === selectedSubjectKey).length}회 완료)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPacerSubView('reports')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>과목별 전체 리포트 보기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {(() => {
                const latestSession = examHistory.find((h) => h.subject === selectedSubjectKey);
                if (!latestSession) return null;
                const delta = latestSession.totalDeltaSec !== undefined
                  ? latestSession.totalDeltaSec
                  : (latestSession.totalElapsed || 0) - (latestSession.totalTargetSec || 0);
                const isOver = delta > 0;

                return (
                  <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px]">
                          최신 응시
                        </span>
                        <span>{latestSession.presetName || '표준 전략'}</span>
                        <span className="text-zinc-400 font-normal">{latestSession.date}</span>
                      </div>
                      {latestSession.memo && (
                        <p className="text-zinc-500 dark:text-zinc-400 italic line-clamp-1">
                          "{latestSession.memo}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">
                        {formatTime(latestSession.totalElapsed || 0)} 소요
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        isOver
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {isOver ? `+${formatTime(delta)} 지연` : `-${formatTime(Math.abs(delta))} 세이브`}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
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
