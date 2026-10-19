import React from 'react';
import { Globe, Calendar, Moon, Sun, Sparkles, Image, Maximize2, Minimize2, Cloud, Zap, Download } from 'lucide-react';
import Icon from './Icon';

const TABS = [
  { key: 'sprint', label: 'Sprint 플랜', tone: 640 },
  { key: 'pacer', label: 'Exam Pacer', tone: 740 },
  { key: 'lounge', label: '라이브 라운지', tone: 840 },
  { key: 'calendar', label: '입시 캘린더', tone: 920 }
];

const TabIcon = ({ tabKey }) => {
  if (tabKey === 'sprint') return <Icon name="target" className="w-4 h-4" />;
  if (tabKey === 'pacer') return <Icon name="clock" className="w-4 h-4" />;
  if (tabKey === 'lounge') return <Globe className="w-4 h-4" />;
  return <Calendar className="w-4 h-4" />;
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
  isInstalled
}) => {
  return (
    <header className="sticky top-2 sm:top-3 z-40 w-full px-3 sm:px-6 mb-4">
      <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-full px-3 sm:px-5 py-2.5 glass-card bg-white/75 dark:bg-zinc-900/75 border border-white/60 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20 flex items-center justify-between gap-2 sm:gap-4 transition-all">
        {/* 1. 좌측: 애플 스타일 브랜드 미니 아일랜드 */}
        <div className="flex items-center gap-2 sm:gap-3 select-none shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-md shadow-indigo-500/25">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
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

        {/* 2. 중앙: 애플 비전OS 세그먼트 컨트롤 탭바 */}
        <nav aria-label="메인 탭" className="inline-flex p-1 rounded-xl sm:rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/5 backdrop-blur-md">
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
                className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 rounded-lg sm:rounded-full text-xs font-bold transition-all duration-200 select-none ${
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

        {/* 3. 우측: 애플 컨트롤 센터 스타일 유틸리티 캡슐 */}
        <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
          {/* PWA 앱 설치 버튼 (아직 미설치된 브라우저 탭 상태일 때) */}
          {!isInstalled && (
            <button
              type="button"
              onClick={onOpenInstall}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/60 active:scale-95 transition-all select-none"
              title="앱으로 설치 (100% 오프라인 지원)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden 2xl:inline text-[11px]">앱 설치</span>
            </button>
          )}

          {/* PIN 클라우드 동기화 알약 */}
          <button
            type="button"
            onClick={onOpenSync}
            className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm shadow-indigo-600/20 transition-all select-none"
            title="기기간 6자리 PIN 클라우드 동기화"
          >
            <div className="relative flex items-center justify-center">
              <Cloud className={`w-3.5 h-3.5 ${autoSyncStatus === 'syncing' ? 'animate-bounce text-emerald-300' : ''}`} />
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
            className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs select-none ${
              isPaperTheme
                ? 'bg-[#dfeedd] text-[#45624d] border-[#8fb99a]'
                : 'bg-black/[0.03] dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 hover:bg-black/[0.06] dark:hover:bg-white/10 border-black/5 dark:border-white/5'
            }`}
          >
            <span>🌿</span>
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
            className="p-1.5 sm:p-2 rounded-full text-zinc-600 dark:text-zinc-300 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/10 border border-black/5 dark:border-white/5 transition-all select-none"
          >
            {isDarkMode ? (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
            )}
          </button>

          {/* 배경화면 모달 열기 */}
          <button
            type="button"
            onClick={onOpenBg}
            title="배경화면 커스텀"
            className="p-1.5 sm:p-2 rounded-full text-zinc-600 dark:text-zinc-300 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/10 border border-black/5 dark:border-white/5 transition-all select-none"
          >
            <Image className="w-3.5 h-3.5 text-sky-500" />
          </button>

          {/* 전체화면 */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? '전체화면 종료' : '전체화면'}
            className="hidden sm:inline-flex p-1.5 sm:p-2 rounded-full text-zinc-600 dark:text-zinc-300 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/10 border border-black/5 dark:border-white/5 transition-all select-none"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
