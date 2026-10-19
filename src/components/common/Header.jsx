import React from 'react';
import { Globe, Calendar, Moon, Sun, Image, Maximize2, Minimize2, Cloud, Zap, Download, RotateCcw, Leaf, Command } from 'lucide-react';
import Icon from './Icon';

const TABS = [
  { key: 'sprint', label: 'Sprint 플랜', tone: 640 },
  { key: 'pacer', label: 'Exam Pacer', tone: 740 },
  { key: 'lounge', label: '라이브 라운지', tone: 840 },
  { key: 'calendar', label: '입시 캘린더', tone: 920 }
];

const TabIcon = ({ tabKey }) => {
  if (tabKey === 'sprint') return <Icon name="target" className="w-3.5 h-3.5" />;
  if (tabKey === 'pacer') return <Icon name="clock" className="w-3.5 h-3.5" />;
  if (tabKey === 'lounge') return <Globe className="w-3.5 h-3.5" />;
  return <Calendar className="w-3.5 h-3.5" />;
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
  designSystem = 'apple',
  toggleDesignSystem
}) => {
  const isAppleDesign = designSystem === 'apple';
  const btnRadius = isAppleDesign ? 'rounded-[10px]' : 'rounded-full';

  return (
    <header className="sticky top-2.5 sm:top-3.5 z-40 w-full px-4 sm:px-6 lg:px-10 mb-3">
      <div
        className={`${
          isAppleDesign ? 'max-w-[1200px] rounded-[18px]' : 'max-w-7xl rounded-2xl sm:rounded-full'
        } mx-auto px-3 sm:px-4 py-2 glass-card flex items-center justify-between gap-2 sm:gap-3 transition-all duration-200`}
      >
        {/* 1. 좌측: 브랜드 아이덴티티 (Apple Pro Studio 감성) */}
        <div className="flex items-center gap-2.5 select-none shrink-0">
          <div
            className={`relative flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 ${
              isAppleDesign
                ? 'rounded-[10px] bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] shadow-sm'
                : 'rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-md shadow-indigo-500/25'
            }`}
          >
            {isAppleDesign ? (
              <Command className="w-4 h-4 stroke-[2.2]" />
            ) : (
              <>
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </>
            )}
          </div>

          <div className="hidden xl:flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold tracking-tight text-zinc-900 dark:text-white leading-none">
                DualCore
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-[5px] font-mono font-medium leading-none ${
                  isAppleDesign
                    ? 'bg-black/[0.05] dark:bg-white/[0.1] text-[#6E6E73] dark:text-[#A1A1A6]'
                    : 'bg-indigo-500/10 dark:bg-indigo-400/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                }`}
              >
                OS 2.5
              </span>
            </div>
            <p className="text-[10px] text-[#86868B] dark:text-[#86868B] font-normal tracking-tight mt-0.5 leading-none">
              Academic Focus Studio
            </p>
          </div>
        </div>

        {/* 2. 중앙: 메인 세그먼트 컨트롤 독 (macOS Segmented Glass Well) */}
        <nav
          aria-label="메인 탭"
          className={`inline-flex p-1 ${
            isAppleDesign
              ? 'rounded-[12px] apple-glass-well'
              : 'rounded-xl sm:rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/5 backdrop-blur-md'
          }`}
        >
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
                className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 ${
                  isAppleDesign ? 'rounded-[9px]' : 'rounded-lg sm:rounded-full'
                } text-xs font-medium transition-all duration-150 select-none ${
                  isActive
                    ? isAppleDesign
                      ? 'apple-glass-pill text-[#1D1D1F] dark:text-white font-semibold'
                      : 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-sm border border-black/[0.04] dark:border-white/10 scale-[1.01] font-bold'
                    : 'text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
                }`}
              >
                <span className={isActive && isAppleDesign ? 'text-[#0071E3] dark:text-[#2997FF]' : ''}>
                  <TabIcon tabKey={tab.key} />
                </span>
                <span className={isActive ? 'inline' : 'hidden lg:inline'}>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. 우측: 스튜디오 유틸리티 툴바 */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* 원클릭 UI 디자인 즉시 롤백/전환 스위치 */}
          {toggleDesignSystem && (
            <button
              type="button"
              onClick={toggleDesignSystem}
              title={
                isAppleDesign
                  ? '이전 클래식 UI 디자인으로 즉시 되돌리기 (롤백)'
                  : 'Apple 글래스모피즘 신형 UI 적용하기'
              }
              className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 ${btnRadius} text-xs font-medium transition-all duration-150 select-none ${
                isAppleDesign
                  ? 'apple-glass-well text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-white'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">
                {isAppleDesign ? '구형 UI' : '신형 글래스 UI'}
              </span>
            </button>
          )}

          {/* PWA 앱 설치 버튼 */}
          {!isInstalled && (
            <button
              type="button"
              onClick={onOpenInstall}
              className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 ${btnRadius} text-xs font-medium text-[#0071E3] dark:text-[#2997FF] bg-[#0071E3]/10 dark:bg-[#2997FF]/15 hover:bg-[#0071E3]/15 border border-[#0071E3]/20 dark:border-[#2997FF]/25 transition-all duration-150 select-none`}
              title="앱으로 설치 (100% 오프라인 지원)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden 2xl:inline text-[11px]">설치</span>
            </button>
          )}

          {/* PIN 클라우드 동기화 */}
          <button
            type="button"
            onClick={onOpenSync}
            className={`flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 ${btnRadius} text-xs font-medium text-white bg-[#0071E3] hover:bg-[#0077ED] shadow-xs transition-all duration-150 select-none`}
            title="기기간 6자리 PIN 클라우드 동기화"
          >
            <div className="relative flex items-center justify-center">
              <Cloud className={`w-3.5 h-3.5 ${autoSyncStatus === 'syncing' ? 'animate-pulse' : ''}`} />
              {autoSyncEnabled && cleanPin?.length === 6 && (
                <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#30D158]"></span>
                </span>
              )}
            </div>
            <span className="hidden xl:inline font-mono text-[11px]">
              {cleanPin?.length === 6 ? cleanPin : 'Sync'}
            </span>
          </button>

          <div className="hidden sm:block h-4 w-px bg-black/[0.08] dark:bg-white/[0.1] mx-0.5" />

          {/* 테마 & 화면 환경 아이콘 그룹 */}
          <div className={`inline-flex items-center gap-0.5 p-0.5 ${isAppleDesign ? 'rounded-[11px] apple-glass-well' : ''}`}>
            {/* 페이퍼 테마 */}
            <button
              type="button"
              onClick={() => setIsPaperTheme(!isPaperTheme)}
              title={isPaperTheme ? '내추럴 페이퍼 테마 해제' : '내추럴 페이퍼 테마 적용'}
              className={`flex items-center gap-1 p-1.5 ${isAppleDesign ? 'rounded-[8px]' : btnRadius} text-xs font-medium transition-all duration-150 select-none ${
                isPaperTheme
                  ? 'bg-[#dfeedd] text-[#45624d] shadow-xs'
                  : 'text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
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
              aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
              title={isPaperTheme ? '다크 모드로 전환' : isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
              className={`p-1.5 ${isAppleDesign ? 'rounded-[8px]' : btnRadius} text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-white transition-all duration-150 select-none`}
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5" />
              ) : (
                <Moon className="w-3.5 h-3.5" />
              )}
            </button>

            {/* 배경화면 모달 열기 */}
            <button
              type="button"
              onClick={onOpenBg}
              aria-label="배경화면 설정"
              title="배경화면 및 글래스 블러 커스텀"
              className={`p-1.5 ${isAppleDesign ? 'rounded-[8px]' : btnRadius} text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-white transition-all duration-150 select-none`}
            >
              <Image className="w-3.5 h-3.5" />
            </button>

            {/* 전체화면 */}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? '전체화면 종료' : '전체화면 전환'}
              title={isFullscreen ? '전체화면 종료' : '전체화면'}
              className={`hidden sm:inline-flex p-1.5 ${isAppleDesign ? 'rounded-[8px]' : btnRadius} text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-white transition-all duration-150 select-none`}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
