import React from 'react';
import { Globe, Calendar } from 'lucide-react';
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
  toggleFullscreen
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 glass-card bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200/50 dark:border-zinc-800/60 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* 브랜드 로고 */}
        <div className="flex items-center gap-2.5 select-none">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/20">
            <Icon name="zap" className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-wider text-zinc-900 dark:text-white uppercase font-mono">
                DUALCORE
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono font-semibold bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                COCKPIT
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-tight -mt-0.5">
              수험생 고효율 듀얼 포커스 OS
            </p>
          </div>
        </div>

        {/* 알약 스타일 탭 전환 버튼 */}
        <div className="inline-flex p-1 rounded-full bg-zinc-200/70 dark:bg-zinc-800/80 backdrop-blur-md border border-zinc-300/40 dark:border-zinc-700/50 shadow-inner">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              title={tab.label}
              onClick={() => { setActiveTab(tab.key); if (soundEnabled) playChime(tab.tone, 'sine', 0.05); }}
              className={`flex items-center gap-2 px-3 sm:px-4 lg:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200/60 dark:border-zinc-700/60 scale-[1.02]'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <TabIcon tabKey={tab.key} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 우측 상단 툴바 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenSync}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/25 transition-all"
          >
            <div className="relative flex items-center justify-center">
              <Icon name="cloud" className={`w-4 h-4 ${autoSyncStatus === 'syncing' ? 'animate-bounce text-emerald-300' : ''}`} />
              {autoSyncEnabled && cleanPin.length === 6 && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-mono">
              {cleanPin.length === 6 ? `PIN: ${cleanPin}` : '기기 동기화'}
            </span>
            {autoSyncEnabled && cleanPin.length === 6 && (
              <span className="hidden lg:inline text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded-full font-mono font-bold">
                {autoSyncInterval}s 자동
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenBg}
            title="배경화면 커스텀"
            className="p-2 sm:p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700/60 shadow-sm transition-all"
          >
            <Icon name="image" className="w-4 h-4 text-indigo-500" />
          </button>

          <button
            type="button"
            onClick={() => setIsPaperTheme(!isPaperTheme)}
            title={isPaperTheme ? "내추럴 페이퍼 테마 켜짐 (클릭시 클래식 모드)" : "ClassSpace 내추럴 페이퍼 테마 켜기"}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              isPaperTheme
                ? 'bg-[#dfeedd] text-[#45624d] border-[#8fb99a] shadow-sm'
                : 'bg-white/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 border-zinc-200/70 dark:border-zinc-700/60'
            }`}
          >
            <span>🌿</span>
            <span className="hidden md:inline">{isPaperTheme ? '페이퍼 테마' : '클래식 테마'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="다크모드 토글"
            className="p-2 sm:p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700/60 shadow-sm transition-all"
          >
            <Icon name={isDarkMode ? 'sun' : 'moon'} className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            title="전체화면"
            className="hidden sm:inline-flex p-2 sm:p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700/60 shadow-sm transition-all"
          >
            <Icon name={isFullscreen ? 'minimize' : 'maximize'} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
