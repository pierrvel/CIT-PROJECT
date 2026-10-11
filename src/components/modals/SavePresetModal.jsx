import React from 'react';
import Icon from '../common/Icon';

export const SavePresetModal = ({
  isOpen,
  onClose,
  currentSubject,
  newPresetName,
  setNewPresetName,
  pipelineParts,
  handleSaveNewPreset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md glass-card bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Icon name="bookmark" className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">풀이 순서 & 시간 배분 프리셋 저장</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {currentSubject.name} • 총 {currentSubject.totalMinutes}분
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-1.5">
              프리셋 이름
            </label>
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="예: 실전 9모 대비 문학 선풀이형"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-semibold"
            />
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-2.5">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Icon name="checkCircle" className="w-3.5 h-3.5 text-indigo-500" />
              <span>저장될 순서 및 시간 배분 프리뷰:</span>
            </span>
            <div className="space-y-1.5 text-xs font-mono">
              {pipelineParts.map((p, idx) => (
                <div key={p.id || idx} className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>{idx + 1}. {p.name}</span>
                  <strong className="text-zinc-800 dark:text-zinc-200">{p.targetMinutes || p.targetMin}분</strong>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>총 시험 시간 (불변)</span>
              <span>{currentSubject.totalMinutes}분 (합계 일치)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSaveNewPreset}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
          >
            <Icon name="bookmark" className="w-3.5 h-3.5" />
            <span>프리셋 영구 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePresetModal;
