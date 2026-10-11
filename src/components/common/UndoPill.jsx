import React from 'react';
import Icon from './Icon';

export const UndoPill = ({ undoState, onUndo, onClose }) => {
  if (!undoState || !undoState.snapshot) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="relative overflow-hidden flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-zinc-900/95 dark:bg-zinc-800/95 text-white border border-indigo-500/60 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Icon name="undo" className="w-4 h-4" />
          </span>
          <div className="text-xs">
            <span className="text-zinc-400 font-medium">직전 단계 복귀: </span>
            <span className="font-bold text-white">'{undoState.snapshot.prevPartName}'</span>
            <span className="hidden sm:inline-block text-[11px] text-indigo-300 font-mono ml-1.5">(전체 타이머 유지)</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onUndo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
        >
          <Icon name="rotateCcw" className="w-3.5 h-3.5" />
          <span>되돌리기 ({undoState.secondsLeft}초)</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
          title="닫기"
        >
          <Icon name="x" className="w-3.5 h-3.5" />
        </button>

        {/* 하단 카운트다운 게이지 바 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700/50 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-100 ease-linear"
            style={{ width: `${undoState.progress ?? 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default UndoPill;
