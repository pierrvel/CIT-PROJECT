import React from 'react';
import Icon from '../common/Icon';
import { PRESET_WALLPAPERS } from '../../constants/wallpapers';

export const BgModal = ({
  isOpen,
  onClose,
  bgImage,
  setBgImage,
  dimOpacity,
  setDimOpacity,
  blurAmount,
  setBlurAmount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md glass-card bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Icon name="image" className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">배경 & 글래스 커스텀</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">내 사진 업로드</label>
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-indigo-500 bg-zinc-50/50 dark:bg-zinc-800/50">
            <Icon name="image" className="w-6 h-6 text-zinc-400 mb-1" />
            <span className="text-xs text-zinc-500">클릭하여 이미지 파일 선택 (.jpg, .png)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setBgImage(ev.target.result);
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">추천 프리셋</label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_WALLPAPERS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setBgImage(preset.url)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-left border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 bg-zinc-100/60 dark:bg-zinc-800/60 truncate"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              <span>배경 어둡기 (Dim)</span>
              <span>{Math.round(dimOpacity * 100)}%</span>
            </div>
            <input
              type="range" min="0" max="0.8" step="0.05" value={dimOpacity}
              onChange={(e) => setDimOpacity(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              <span>배경 블러 (Blur)</span>
              <span>{blurAmount}px</span>
            </div>
            <input
              type="range" min="0" max="24" step="2" value={blurAmount}
              onChange={(e) => setBlurAmount(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => { setBgImage(null); setDimOpacity(0.15); setBlurAmount(12); }}
            className="text-xs text-rose-500 hover:underline"
          >
            기본 배경 초기화
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default BgModal;
