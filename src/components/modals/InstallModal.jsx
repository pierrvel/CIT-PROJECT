import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon';
import { Download, Smartphone, Laptop, CheckCircle2, Share, PlusSquare, Zap } from 'lucide-react';

export const InstallModal = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallSuccess
}) => {
  if (!isOpen) return null;

  const [isIOS, setIsIOS] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isAppleMobile);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setIsInstalling(true);
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        if (onInstallSuccess) onInstallSuccess();
        onClose();
      }
    } catch (err) {
      console.warn('[InstallModal] Prompt error:', err);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md glass-card bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 shadow-2xl space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-md shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-1.5">
                <span>앱으로 설치하기</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  PWA
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                독서실·태블릿 어디서나 1초만에 실행되는 전용 OS
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* 핵심 혜택 3종 */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50">
            <span className="text-xl">⚡</span>
            <div className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 mt-1">100% 오프라인</div>
            <div className="text-[9px] text-zinc-500 dark:text-zinc-400">와이파이 없이 즉시 구동</div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50">
            <span className="text-xl">🖥️</span>
            <div className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 mt-1">주소창 제거</div>
            <div className="text-[9px] text-zinc-500 dark:text-zinc-400">몰입형 독립 창 지원</div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50">
            <span className="text-xl">🚀</span>
            <div className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 mt-1">원클릭 실행</div>
            <div className="text-[9px] text-zinc-500 dark:text-zinc-400">홈 화면 / 작업표시줄</div>
          </div>
        </div>

        {/* 플랫폼별 설치 가이드 & 버튼 */}
        {deferredPrompt ? (
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 active:scale-98 shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isInstalling ? '설치 중...' : '지금 바로 원클릭 앱 설치'}</span>
            </button>
            <p className="text-[11px] text-center text-zinc-500 dark:text-zinc-400">
              클릭 시 브라우저 설치 확인 팝업이 표시됩니다.
            </p>
          </div>
        ) : isIOS ? (
          <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50">
            <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>iOS (iPhone / iPad) 사파리 설치 방법</span>
            </div>
            <ol className="text-xs text-zinc-700 dark:text-zinc-300 space-y-2 pt-1 list-decimal list-inside">
              <li>
                사파리 화면 하단(또는 상단)의 <strong>공유 버튼 <Share className="w-3.5 h-3.5 inline mx-1 text-indigo-500" /></strong>을 탭합니다.
              </li>
              <li>
                공유 메뉴를 올려 <strong>'홈 화면에 추가' <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-indigo-500" /></strong>를 선택합니다.
              </li>
              <li>
                우측 상단 <strong>'추가'</strong>를 누르면 홈 화면에 앱 아이콘이 생성됩니다!
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-3 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 text-xs text-zinc-600 dark:text-zinc-300">
            <div className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-100">
              <Laptop className="w-4 h-4 text-indigo-500" />
              <span>PC / 크롬 브라우저 직접 설치 안내</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              브라우저 상단 주소창 맨 우측에 있는 <strong>[ ⬇ 설치 ]</strong> 아이콘을 클릭하거나, 메뉴(⋮)에서 <strong>[앱 설치]</strong>를 선택하시면 작업표시줄과 바탕화면에 바로 등록됩니다.
            </p>
          </div>
        )}

        {/* 닫기 버튼 */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallModal;
