import React from 'react';
import { Globe, Calendar, Moon, Sun, Sparkles, Image, Maximize2, Minimize2, Cloud, Zap, Download } from 'lucide-react';
import Icon from './Icon';
import { calculateDDay } from '../../constants/ddays';

const TABS = [
  { key: 'sprint', label: 'Sprint 플랜', tone: 640 },
  { key: 'pacer', label: 'Exam Pacer', tone: 740 },
  { key: 'lounge', label: '라이브 라운지', tone: 840 },
  { key: 'calendar', label: '입시 캘린더', tone: 920 }
];

const TabIcon = ({ tabKey }) => {
  if (tabKey === 'sprint') return <Icon name="target" className="w-4 h-4 shrink-0" />;
  if (tabKey === 'pacer') return <Icon name="clock" className="w-4 h-4 shrink-0" />;
  if (tabKey === 'lounge') return <Globe className="w-4 h-4 shrink-0" />;
  return <Calendar className="w-4 h-4 shrink-0" />;
};

export const Header = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  playChime,
  autoSyncStatus,
  autoSyncEnabled,
  autoSyncInterval,
  cleanPin,
  onOpenSync,
  onOpenBg,
  isDarkMode,
  setIsDarkMode,
  isPaperTheme,
  setIsPaperTheme,
  isFullscreen,
  toggleFullscreen,
  onOpenInstall,
  isInstalled,
  primaryDDay,
  onOpenDDay
}) => {
  const ddayInfo = primaryDDay ? calculateDDay(primaryDDay.date) : { text: 'D-Day', days: 0, status: 'unknown' };

  return (
    <header className="sticky top-2 sm:top-3 z-40 w-full px-2 sm:px-6 mb-3 sm:mb-4">
      <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-full px-3 sm:px-5 py-2 sm:py-2.5 glass-card bg-white/80 dark:bg-zinc-900/80 border border-white/60 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 transition-all">

        {/* ======================================================== */}
        {/* 📱 모바일 전용 뷰 (< sm): 2단 구조 (상단 바 + 가로 스와이프 리본) */}
        {/* ======================================================== */}
        <div className="flex sm:hidden items-center justify-between w-full select-none gap-2">
          {/* 모바일 브랜드 로고 */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-md shadow-indigo-500/25 shrink-0">
              <Zap className="w-4 h-4 text-white shrink-0" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono font-black text-xs text-zinc-900 dark:text-white">
              <span>DUALCORE</span>
              <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-indigo-500/10 dark:bg-indigo-400/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                COCKPIT
              </span>
            </div>
          </div>

          {/* 모바일 상단 우측: 대표 D-Day + 빠른 제어 */}
          <div className="flex items-center gap-1 shrink-0">
            {/* 대표 D-Day 알약 버튼 */}
            <button
              type="button"
              onClick={onOpenDDay}
              title={`대표 D-Day: ${primaryDDay ? primaryDDay.title : '설정 필요'} (${ddayInfo.text}) • 클릭하여 디데이 관리`}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all border shadow-xs select-none bg-rose-50/90 dark:bg-rose-950/40 text-zinc-800 dark:text-zinc-200 border-rose-200 dark:border-rose-900/50 active:scale-95 shrink-0"
            >
              <span className="text-[12px] leading-none shrink-0">🎯</span>
              <span className="max-w-[70px] truncate text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                {primaryDDay ? primaryDDay.title : 'D-Day'}
              </span>
              <span className={`px-1.5 py-0.2 rounded font-mono font-black text-[10px] tracking-tight shrink-0 ${
                ddayInfo.status === 'today'
                  ? 'bg-rose-500 text-white animate-pulse'
                  : ddayInfo.days <= 7 && ddayInfo.days > 0
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  : 'bg-rose-500/10 dark:bg-rose-400/20 text-rose-600 dark:text-rose-400'
              }`}>
                {ddayInfo.text}
              </span>
            </button>

            {/* PIN 클라우드 동기화 미니 버튼 */}
            <button
              type="button"
              onClick={onOpenSync}
              className="p-1.5 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-xs shrink-0"
              title="기기간 6자리 PIN 클라우드 동기화"
            >
              <Cloud className={`w-3.5 h-3.5 shrink-0 ${autoSyncStatus === 'syncing' ? 'animate-bounce text-emerald-300' : ''}`} />
            </button>

            {/* 다크/라이트 모드 미니 토글 */}
            <button
              type="button"
              onClick={() => {
                if (isPaperTheme) setIsDarkMode(true);
                else setIsDarkMode(!isDarkMode);
              }}
              title={isPaperTheme ? '다크 모드로 전환' : isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
              className="p-1.5 rounded-full text-zinc-600 dark:text-zinc-300 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/10 border border-black/5 dark:border-white/5 shrink-0"
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* 📱 모바일 가로 스와이프 내비게이션 바 (옆으로 넘기는 형식) */}
        <div className="flex sm:hidden items-center gap-1.5 w-full overflow-x-auto no-scrollbar scroll-smooth flex-nowrap py-0.5 px-0.5">
          {/* 4대 네비게이션 탭 */}
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  if (soundEnabled && playChime) playChime(tab.tone, 'sine', 0.05);
                }}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-sm border border-black/[0.06] dark:border-white/15 scale-[1.02]'
                    : 'bg-black/[0.03] dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-transparent'
                }`}
              >
                <TabIcon tabKey={tab.key} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* 구분선 */}
          <div className="h-4 w-px bg-zinc-300/80 dark:bg-zinc-700/80 shrink-0 mx-0.5" />

          {/* 모바일 보조 유틸리티 버튼들 */}
          <button
            type="button"
            onClick={() => setIsPaperTheme(!isPaperTheme)}
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs select-none whitespace-nowrap ${
              isPaperTheme
                ? 'bg-[#dfeedd] text-[#45624d] border-[#8fb99a]'
                : 'bg-black/[0.03] dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-300 border-black/5 dark:border-white/5'
            }`}
          >
            <span className="shrink-0">🌿</span>
            <span className="text-[11px] font-semibold">{isPaperTheme ? '페이퍼' : '클래식'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenBg}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold bg-black/[0.03] dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-300 border border-black/5 dark:border-white/5 hover:bg-black/[0.06] dark:hover:bg-white/10 transition-all select-none whitespace-nowrap"
          >
            <Image className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="text-[11px] font-semibold">배경</span>
          </button>

          {!isInstalled && (
            <button
              type="button"
              onClick={onOpenInstall}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 transition-all select-none whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-semibold">앱 설치</span>
            </button>
          )}
        </div>

        {/* ======================================================== */}
        {/* 💻 데스크톱 전용 뷰 (sm:flex): 1열 애플 비전OS 스타일 */}
        {/* ======================================================== */}
        {/* 1. 좌측: 브랜드 로고 */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3 select-none shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-md shadow-indigo-500/25 shrink-0">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="hidden xl:flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-zinc-900 dark:text-white font-mono">
                DUALCORE
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md font-mono font-bold bg-indigo-500/10 dark:bg-indigo-400/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                COCKPIT
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">
              수험생 지능형 생산성 OS
            </p>
          </div>
        </div>

        {/* 2. 중앙: 데스크톱 세그먼트 컨트롤 탭바 */}
        <nav aria-label="메인 탭" className="hidden sm:inline-flex p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/5 backdrop-blur-md shrink-0">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  if (soundEnabled && playChime) playChime(tab.tone, 'sine', 0.05);
                }}
                title={tab.label}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-sm border border-black/[0.04] dark:border-white/10 scale-[1.01]'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/40 dark:hover:bg-white/5'
                }`}
              >
                <TabIcon tabKey={tab.key} />
                <span className={isActive ? 'inline' : 'hidden lg:inline'}>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. 우측: 데스크톱 컨트롤 센터 유틸리티 캡슐 */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
          {/* 대표 D-Day 배지 알약 버튼 */}
          <button
            type="button"
            onClick={onOpenDDay}
            title={
              primaryDDay
                ? `대표 D-Day: ${primaryDDay.title} (${ddayInfo.text}) • 클릭하여 디데이 목록 및 설정`
                : 'D-Day 설정 • 클릭하여 새 디데이 등록'
            }
            className="group flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs select-none bg-rose-50/80 hover:bg-rose-100/90 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-zinc-800 dark:text-zinc-200 border-rose-200/80 dark:border-rose-900/50 active:scale-95 shrink-0"
          >
            <span className="text-[13px] leading-none group-hover:scale-110 transition-transform shrink-0">
              🎯
            </span>
            <span className="hidden md:inline max-w-[85px] lg:max-w-[120px] truncate font-medium text-zinc-700 dark:text-zinc-300">
              {primaryDDay ? primaryDDay.title : 'D-Day'}
            </span>
            <span
              className={`px-1.5 py-0.2 rounded-md font-mono font-black text-[11px] tracking-tight shrink-0 ${
                ddayInfo.status === 'today'
                  ? 'bg-rose-500 text-white animate-pulse'
                  : ddayInfo.days <= 7 && ddayInfo.days > 0
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  : 'bg-rose-500/10 dark:bg-rose-400/20 text-rose-600 dark:text-rose-400'
              }`}
            >
              {ddayInfo.text}
            </span>
          </button>

          {/* PWA 앱 설치 버튼 */}
          {!isInstalled && (
            <button
              type="button"
              onClick={onOpenInstall}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/60 active:scale-95 transition-all select-none shrink-0"
              title="앱으로 설치 (100% 오프라인 지원)"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden 2xl:inline text-[11px]">앱 설치</span>
            </button>
          )}

          {/* PIN 클라우드 동기화 알약 */}
          <button
            type="button"
            onClick={onOpenSync}
            className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm shadow-indigo-600/20 transition-all select-none shrink-0"
            title="기기간 6자리 PIN 클라우드 동기화"
          >
            <div className="relative flex items-center justify-center shrink-0">
              <Cloud className={`w-3.5 h-3.5 shrink-0 ${autoSyncStatus === 'syncing' ? 'animate-bounce text-emerald-300' : ''}`} />
              {autoSyncEnabled && cleanPin?.length === 6 && (
                <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                </span>
              )}
            </div>
            <span className="hidden xl:inline font-mono">
              {cleanPin?.length === 6 ? `PIN ${cleanPin}` : '기기 동기화'}
            </span>
          </button>

          {/* 테마 스위처: 페이퍼 테마 🌿 */}
          <button
            type="button"
            onClick={() => setIsPaperTheme(!isPaperTheme)}
            title={isPaperTheme ? '내추럴 페이퍼 테마 활성화됨 (클릭시 클래식 모드)' : 'ClassSpace 내추럴 페이퍼 테마'}
            className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs select-none shrink-0 ${
              isPaperTheme
                ? 'bg-[#dfeedd] text-[#45624d] border-[#8fb99a]'
                : 'bg-black/[0.03] dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 hover:bg-black/[0.06] dark:hover:bg-white/10 border-black/5 dark:border-white/5'
            }`}
          >
            <span className="shrink-0">🌿</span>
            <span className="hidden xl:inline text-[11px] font-semibold">{isPaperTheme ? '페이퍼' : '클래식'}</span>
          </button>

          {/* 다크/라이트 모드 토글 */}
          <button
            type="button"
            onClick={() => {
              if (isPaperTheme) {
                setIsDarkMode(true);
              } else {
                setIsDarkMode(!isDarkMode);
              }
            }}
            title={isPaperTheme ? '다크 모드로 전환' : isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            className="p-1.5 sm:p-2 rounded-full text-zinc-600 dark:text-zinc-300 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/10 border border-black/5 dark:border-white/5 transition-all select-none shrink-0"
          >
            {isDarkMode ? (
              <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            )}
          </button>

          {/* 배경화면 모달 열기 */}
          <button
            type="button"
            onClick={onOpenBg}
            title="배경화면 커스텀"
            className="p-1.5 sm:p-2 rounded-full text-zinc-600 dark:text-zinc-300 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/10 border border-black/5 dark:border-white/5 transition-all select-none shrink-0"
          >
            <Image className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          </button>

          {/* 전체화면 */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? '전체화면 종료' : '전체화면'}
            className="p-1.5 sm:p-2 rounded-full text-zinc-600 dark:text-zinc-300 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/10 border border-black/5 dark:border-white/5 transition-all select-none shrink-0"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 shrink-0" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
