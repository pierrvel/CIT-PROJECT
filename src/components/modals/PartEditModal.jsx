import React from 'react';
import Icon from '../common/Icon';
import { DEFAULT_SUBJECT_PRESETS } from '../../constants/subjects';

export const PartEditModal = ({
  isOpen,
  onClose,
  currentSubject,
  selectedSubjectKey,
  editPartsTemp,
  setEditPartsTemp,
  handlePartMinuteChange,
  saveCustomTimePreset,
  showToast
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg glass-card bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Icon name="settings" className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">파트별 목표 시간 조절</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                총 시험 시간(<strong>{currentSubject.totalMinutes}분</strong>)은 불변으로 고정 연동됩니다.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {editPartsTemp.map((p, idx) => {
            const isLast = idx === editPartsTemp.length - 1;
            return (
              <div key={p.id} className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => {
                      const updated = [...editPartsTemp];
                      updated[idx].name = e.target.value;
                      setEditPartsTemp(updated);
                    }}
                    className="font-bold text-sm bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-indigo-500 focus:outline-none text-zinc-900 dark:text-white w-full"
                  />
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    {isLast ? '⚠️ 앞선 파트들의 합에 따라 자동 계산됨' : '원하는 목표 시간 입력'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  <input
                    type="number"
                    min="1"
                    max={currentSubject.totalMinutes}
                    disabled={isLast}
                    value={p.targetMinutes}
                    onChange={(e) => handlePartMinuteChange(idx, e.target.value)}
                    className="w-16 px-2.5 py-1.5 text-center text-sm font-bold rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-75 disabled:bg-zinc-200/50 dark:disabled:bg-zinc-800"
                  />
                  <span className="text-xs text-zinc-500">분</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setEditPartsTemp(DEFAULT_SUBJECT_PRESETS[selectedSubjectKey][0].parts.map(p => ({ ...p, targetMinutes: p.targetMin || p.targetMinutes })));
              showToast('기본 권장 시간으로 초기화되었습니다.', 'info');
            }}
            className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline"
          >
            기본값으로 복원
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              취소
            </button>
            <button
              type="button"
              onClick={saveCustomTimePreset}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
            >
              적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartEditModal;
