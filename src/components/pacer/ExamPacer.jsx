import React from 'react';
import Icon from '../common/Icon';
import CSATAnalogClock from '../clock/CSATAnalogClock';
import StatsDashboard from '../analytics/StatsDashboard';
import { formatTime } from '../../utils/pacing';

export const ExamPacer = ({
  // 서브 뷰 상태
  pacerSubView,
  setPacerSubView,
  examHistory,

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
  handleLoadSampleHistory
}) => {
  return (
    <div className="space-y-6">
      {/* [Pacer 서브 헤더 탭바]: 실전 타임어택 vs 타임 통계 대시보드 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="inline-flex p-1 bg-zinc-200/70 dark:bg-zinc-800/70 backdrop-blur-md rounded-2xl border border-zinc-300/40 dark:border-zinc-700/40 shadow-inner">
          <button
            type="button"
            onClick={() => setPacerSubView('timer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
              pacerSubView === 'timer'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Icon name="clock" className="w-4 h-4" />
            <span>실전 타임어택</span>
          </button>
          <button
            type="button"
            onClick={() => setPacerSubView('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
              pacerSubView === 'analytics'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Icon name="barChart" className="w-4 h-4 text-emerald-500" />
            <span>타임 통계 대시보드</span>
            {examHistory.length > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold">
                {examHistory.length}회차
              </span>
            )}
          </button>
        </div>

        {/* 우측 퀵 액션 */}
        {pacerSubView === 'timer' && examHistory.length > 0 && (
          <button
            type="button"
            onClick={() => setPacerSubView('analytics')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 transition-colors"
          >
            <Icon name="trendingUp" className="w-3.5 h-3.5" />
            <span>누적 통계 분석 ({examHistory.length}회)</span>
          </button>
        )}
      </div>

      {/* 1. 타임어택 타이머 뷰 (pacerSubView === 'timer') */}
      {pacerSubView === 'timer' && (
        <div className="space-y-6">
          {/* 상단 컨트롤 및 모드 셀렉터 */}
          <div className="glass-card bg-white/75 dark:bg-zinc-900/75 p-5 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* 과목 & 프리셋 선택 컨트롤 */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* 과목 선택 */}
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400">과목:</label>
                  <select
                    disabled={examStarted}
                    value={selectedSubjectKey}
                    onChange={(e) => handleSelectSubject(e.target.value)}
                    className="px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 shadow-sm"
                  >
                    <option value="korean">1교시 국어 (08:40 ~ 10:00, 80분)</option>
                    <option value="math">2교시 수학 (10:30 ~ 12:10, 100분)</option>
                    <option value="english">3교시 영어 (13:10 ~ 14:20, 70분)</option>
                    <option value="history">4교시 한국사 (14:50 ~ 15:20, 30분)</option>
                    <option value="inquiry">4교시 탐구 (15:35 ~ 16:15, 30~40분)</option>
                    <option value="secondLang">5교시 제2외국어/한문 (17:35 ~ 18:05, 30분)</option>
                  </select>
                </div>

                {/* 프리셋 선택 */}
                <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 px-2 py-1 rounded-xl border border-zinc-300 dark:border-zinc-700 shadow-sm">
                  <Icon name="bookmark" className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 hidden sm:inline">전략:</label>
                  <select
                    disabled={examStarted}
                    value={selectedPresetId}
                    onChange={(e) => handleSelectPreset(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-bold text-zinc-900 dark:text-white focus:outline-none pr-1 py-0.5 disabled:opacity-60 cursor-pointer max-w-[170px] sm:max-w-[220px] truncate"
                  >
                    {currentSubjectPresets.map((p) => (
                      <option key={p.id} value={p.id} className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800">
                        {p.name} {p.isSystem ? '(표준)' : '(커스텀)'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 프리셋 저장 */}
                <button
                  type="button"
                  disabled={examStarted}
                  onClick={() => {
                    setNewPresetName(`${currentSubject.name} 커스텀 전략`);
                    setIsSavePresetModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80 disabled:opacity-50 transition-colors shadow-xs"
                  title="현재 파트 순서 및 시간 배분을 새 프리셋으로 영구 저장"
                >
                  <Icon name="bookmark" className="w-3.5 h-3.5" />
                  <span>프리셋 저장</span>
                </button>

                {!currentPreset?.isSystem && (
                  <button
                    type="button"
                    disabled={examStarted}
                    onClick={handleDeleteCurrentPreset}
                    className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors"
                    title="현재 커스텀 프리셋 삭제"
                  >
                    <Icon name="trash" className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  disabled={examStarted}
                  onClick={handleResetSubjectPresets}
                  className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
                  title="과목 표준 프리셋으로 초기화"
                >
                  <Icon name="rotateCcw" className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  disabled={examStarted}
                  onClick={openTimeEditModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 disabled:opacity-50 transition-colors"
                >
                  <Icon name="settings" className="w-3.5 h-3.5 text-zinc-500" />
                  <span>시간 조절</span>
                </button>

                {/* 무음/소리 모드 & 볼륨 */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs">
                  <button
                    type="button"
                    onClick={toggleMuteMode}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                      isMuteMode
                        ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/20'
                        : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                    }`}
                  >
                    <Icon name={isMuteMode ? 'volumeX' : 'volume2'} className="w-3.5 h-3.5" />
                    <span>{isMuteMode ? '🔇 무음 플래시' : '🔊 소리 모드'}</span>
                  </button>

                  <div className="flex items-center gap-1.5 pl-1.5 border-l border-zinc-300 dark:border-zinc-700">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuteMode ? 0 : pacerVolume}
                      disabled={isMuteMode}
                      onChange={(e) => setPacerVolume(Number(e.target.value))}
                      className="w-14 sm:w-20 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title={`타종 볼륨: ${isMuteMode ? 0 : pacerVolume}%`}
                    />
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 w-7 text-right font-bold">
                      {isMuteMode ? '0%' : `${pacerVolume}%`}
                    </span>
                  </div>
                </div>

                {/* 타종 테스트 */}
                <div className="inline-flex rounded-xl p-0.5 bg-zinc-200/70 dark:bg-zinc-800 border border-zinc-300/40 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => triggerExamChime('start')}
                    className="px-2.5 py-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg flex items-center gap-1"
                  >
                    <Icon name={isMuteMode ? 'sparkles' : 'bell'} className="w-3 h-3 text-indigo-500" />
                    <span>본령</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerExamChime('warning10m')}
                    className="px-2.5 py-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg"
                  >
                    10분전
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerExamChime('end')}
                    className="px-2.5 py-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg"
                  >
                    종료령
                  </button>
                </div>

                {/* Wake Lock */}
                {isWakeLockSupported ? (
                  <button
                    type="button"
                    onClick={toggleWakeLock}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all shadow-xs ${
                      !wakeLockEnabled
                        ? 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                        : isWakeLockActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 ring-2 ring-emerald-500/20'
                        : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    <Icon name="lightbulb" className={`w-3.5 h-3.5 ${isWakeLockActive ? 'text-emerald-500 fill-emerald-500/20' : 'text-zinc-400'}`} />
                    <span>화면 꺼짐 방지</span>
                    <span className="flex items-center gap-1 font-mono text-[10px] ml-0.5">
                      {isWakeLockActive ? (
                        <span className="flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">ON</span>
                        </span>
                      ) : !wakeLockEnabled ? (
                        <span className="text-zinc-400">OFF</span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                          <span className="text-zinc-400">대기</span>
                        </span>
                      )}
                    </span>
                  </button>
                ) : (
                  <div
                    title="이 브라우저는 Screen Wake Lock API를 지원하지 않습니다."
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-100/50 dark:bg-zinc-800/40 text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50 opacity-60 cursor-not-allowed"
                  >
                    <Icon name="lightbulb" className="w-3.5 h-3.5 text-zinc-400" />
                    <span>화면 꺼짐 방지 미지원</span>
                  </div>
                )}
              </div>

              {/* 제어 버튼 그룹 */}
              <div className="flex items-center gap-2">
                {examStarted && (
                  <button
                    type="button"
                    onClick={() => setIsExamRunning(!isExamRunning)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                      isExamRunning
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Icon name={isExamRunning ? 'pause' : 'play'} className="w-4 h-4 fill-current" />
                    <span>{isExamRunning ? '일시정지 (P)' : '재개 (P)'}</span>
                  </button>
                )}

                {examStarted && (
                  <button
                    type="button"
                    onClick={handleResetExam}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                  >
                    <Icon name="rotateCcw" className="w-3.5 h-3.5" />
                    <span>초기화</span>
                  </button>
                )}

                {examHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20"
                  >
                    <Icon name="barChart" className="w-3.5 h-3.5" />
                    <span>최근 리포트 ({examHistory.length})</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 중앙 메인 타이머 & 실전 페이스 게이지 */}
          <div className="glass-card bg-white/70 dark:bg-zinc-900/70 p-6 sm:p-10 rounded-3xl border border-white/80 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark text-center relative overflow-hidden">
            <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
              isExamRunning ? 'bg-indigo-500/20 dark:bg-indigo-500/30' : 'bg-transparent'
            }`} />

            <div className="relative z-10 flex flex-col items-center">
              {/* 상단 1: 공식 수능 시간표 뱃지 & 종합 페이스 & 화면 꺼짐 방지 배지 */}
              <div className="mb-2 flex flex-wrap items-center justify-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
                  <span>🏛️ {currentSubject.period} {currentSubject.name}</span>
                  <span className="text-zinc-400 dark:text-zinc-600">|</span>
                  <span className="font-mono">{currentSubject.startTimeStr} ~ {currentSubject.endTimeStr} ({currentSubject.totalMinutes}분)</span>
                </div>

                {examStarted ? (
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                    overallPacing.delta > 0
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse'
                      : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  }`}>
                    <span>
                      {overallPacing.delta > 0
                        ? `⚠️ 종합 페이스: +${formatTime(overallPacing.delta)} 지연 중 (마킹 주의)`
                        : `✨ 종합 페이스: -${formatTime(Math.abs(overallPacing.delta))} 여유 확보 (안정적)`}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold hidden sm:inline">
                    • {currentSubject.presetName}
                  </span>
                )}

                {examStarted && isWakeLockSupported && (
                  <div
                    onClick={toggleWakeLock}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border cursor-pointer select-none transition-all ${
                      isWakeLockActive
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 animate-pulse'
                        : 'bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700'
                    }`}
                    title="클릭하여 화면 꺼짐 방지 토글"
                  >
                    <Icon name="lightbulb" className={`w-3 h-3 ${isWakeLockActive ? 'text-emerald-500 fill-emerald-500' : 'text-zinc-400'}`} />
                    <span>{isWakeLockActive ? '화면 켜짐 유지 🟢' : '화면 유지 OFF ⚪'}</span>
                  </div>
                )}
              </div>

              {/* 상단 2: 타이머 표시 모드 세그먼트 스위처 */}
              <div className="mb-4 inline-flex p-1 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-2xl border border-zinc-300/40 dark:border-zinc-700/50 shadow-inner">
                <button
                  type="button"
                  onClick={() => setTimerDisplayMode('dual')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    timerDisplayMode === 'dual'
                      ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <Icon name="clock" className="w-3.5 h-3.5" />
                  <span>듀얼 뷰</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimerDisplayMode('analog')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    timerDisplayMode === 'analog'
                      ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <span>🕰️ 수능 시계만</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimerDisplayMode('digital')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    timerDisplayMode === 'digital'
                      ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <span>⏱️ 디지털만</span>
                </button>
              </div>

              {/* 메인 타이머 디스플레이 영역 */}
              {timerDisplayMode === 'dual' && (
                <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-8 my-2">
                  <div className="flex flex-col items-center justify-center p-4 bg-zinc-50/70 dark:bg-zinc-800/40 rounded-3xl border border-zinc-200/60 dark:border-zinc-700/50 shadow-inner">
                    <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
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

                  <div className="flex flex-col items-center justify-center p-2">
                    <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold mb-1">
                      전체 시험 잔여 시간
                    </div>
                    <div className="text-6xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tight text-zinc-900 dark:text-white digital-timer drop-shadow-sm my-1">
                      {formatTime(remainingSeconds)}
                    </div>
                    <div className="mt-3 w-full max-w-xs px-4 py-2.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-center shadow-xs">
                      <div className="text-[11px] font-bold text-indigo-500 dark:text-indigo-400">
                        현재 파트 ({currentPartIndex + 1}/{pipelineParts.length})
                      </div>
                      <div className="text-base font-black text-indigo-950 dark:text-indigo-200 truncate mt-0.5">
                        {pipelineParts[currentPartIndex]?.name || '시험 준비'}
                      </div>
                      <div className="text-xs font-mono text-indigo-600/80 dark:text-indigo-300/80 mt-0.5">
                        목표: {pipelineParts[currentPartIndex]?.targetMinutes}분 | 소요: {formatTime(partElapsed[pipelineParts[currentPartIndex]?.id] || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {timerDisplayMode === 'analog' && (
                <div className="flex flex-col items-center justify-center my-3">
                  <CSATAnalogClock
                    subjectMeta={currentSubject}
                    totalExamSeconds={totalExamSeconds}
                    remainingSeconds={remainingSeconds}
                    isExamRunning={isExamRunning}
                    isDark={isDarkMode}
                    sizeClass="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-88 lg:h-88"
                    currentPartName={pipelineParts[currentPartIndex]?.name}
                  />
                  <div className="mt-4 flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-100/90 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">잔여 시간:</span>
                    <span className="text-2xl font-black font-mono text-zinc-900 dark:text-white">
                      {formatTime(remainingSeconds)}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold truncate max-w-[140px]">
                      {pipelineParts[currentPartIndex]?.name}
                    </span>
                  </div>
                </div>
              )}

              {timerDisplayMode === 'digital' && (
                <div className="my-2">
                  <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-mono tracking-tight text-zinc-900 dark:text-white digital-timer drop-shadow-sm my-1">
                    {formatTime(remainingSeconds)}
                  </div>
                </div>
              )}

              {/* 전체 시험 잔여율 바 */}
              <div className="w-full max-w-xl mx-auto mt-3 mb-4">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 mb-1 px-1">
                  <span>경과: {formatTime(totalExamSeconds - remainingSeconds)}</span>
                  <span>잔여: {formatTime(remainingSeconds)} / {currentSubject.totalMinutes}분</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-200/70 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-200/40 dark:border-zinc-700/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500 transition-all duration-300"
                    style={{ width: `${(remainingSeconds / totalExamSeconds) * 100}%` }}
                  />
                </div>
              </div>

              {/* 실전 트리거 버튼 */}
              <div className="w-full max-w-lg mx-auto pt-2">
                {!examStarted ? (
                  <button
                    type="button"
                    onClick={handleStartExam}
                    className="w-full min-h-[60px] py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-lg sm:text-xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all"
                  >
                    <Icon name="play" className="w-6 h-6 fill-current" />
                    <span>시험 시작 (1번 파트부터 가동) [Space]</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextPart}
                    className={`w-full min-h-[64px] py-4 px-6 rounded-2xl active:scale-95 text-white font-black text-lg sm:text-xl shadow-xl flex items-center justify-center gap-3 transition-all ${
                      currentPartIndex >= pipelineParts.length - 1
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-rose-600/30'
                        : 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 shadow-emerald-600/30 animate-pulse-glow'
                    }`}
                  >
                    <Icon name="fastForward" className="w-6 h-6" />
                    <span>
                      {currentPartIndex >= pipelineParts.length - 1
                        ? '🏁 시험 종료 및 리포트 (Space Bar)'
                        : `⏩ [${pipelineParts[currentPartIndex]?.name}] 풀이 완료 ➔ 다음 파트 (Space Bar)`}
                    </span>
                  </button>
                )}

                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 font-mono">
                  단축키: <strong>Space Bar</strong> = 다음 파트로 넘어가기 | <strong>P</strong> = 일시정지/재개
                </p>
              </div>
            </div>
          </div>

          {/* 순서 배열 기반 순차 파이프라인 카드 그리드 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>🎯 순차 풀이 파이프라인 (Sequential Flow)</span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {!examStarted
                    ? '시험 전 ◀ ▶ 버튼으로 학생 맞춤형 풀이 순서로 자유롭게 재배치하세요.'
                    : '현재 파트 목표 시간을 초과해도 타이머는 멈추지 않고 실시간 초과량을 정밀 기록합니다.'}
                </p>
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
                    className={`rounded-2xl p-5 border transition-all duration-200 relative overflow-hidden flex flex-col justify-between select-none ${
                      isActive
                        ? isOvertime
                          ? 'glass-card bg-rose-50/90 dark:bg-rose-950/40 border-rose-500 shadow-glow-rose ring-2 ring-rose-500/50 scale-[1.03] animate-pulse'
                          : 'glass-card bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-500 shadow-glow-indigo ring-2 ring-indigo-500/50 scale-[1.03]'
                        : isCompleted
                        ? 'glass-card bg-zinc-100/60 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/60 opacity-80'
                        : 'glass-card bg-white/70 dark:bg-zinc-900/70 border-white/60 dark:border-zinc-800 opacity-60'
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute top-0 left-0 right-0 h-1.5 ${isOvertime ? 'bg-rose-600' : 'bg-indigo-600'} animate-pulse`} />
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
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
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
                              title="앞 순서로 이동"
                              className="p-1 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-30 hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                            >
                              <Icon name="arrowLeft" className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === pipelineParts.length - 1}
                              onClick={() => movePartSequence(idx, 1)}
                              title="뒤 순서로 이동"
                              className="p-1 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-30 hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                            >
                              <Icon name="arrowRight" className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <h4 className="font-extrabold text-base text-zinc-900 dark:text-white leading-snug">
                        {part.name}
                      </h4>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                        {part.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/80 space-y-1.5 font-mono text-xs">
                      <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                        <span>목표 시간:</span>
                        <strong>{part.targetMinutes}분 (00:00)</strong>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500 dark:text-zinc-400">실제 소요:</span>
                        <strong className={`text-sm ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-zinc-800 dark:text-zinc-200'}`}>
                          {formatTime(actualSec)}
                        </strong>
                      </div>

                      {(isActive || isCompleted) && (
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[11px] text-zinc-400">목표 대비:</span>
                          <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                            isOvertime
                              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse'
                              : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {isOvertime ? `+${formatTime(deltaSec)} 지연!` : `-${formatTime(Math.abs(deltaSec))} 여유`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. 타임 통계 대시보드 뷰 (pacerSubView === 'analytics') */}
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
    </div>
  );
};

export default ExamPacer;
