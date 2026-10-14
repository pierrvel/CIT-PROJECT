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
  setBlurAmount,
  showToast
}) => {
  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setBgImage(preset.url);
    if (showToast) showToast(`'${preset.name}' 배경화면이 적용되었습니다.`, 'success');
  };

  const handleResetBg = () => {
    setBgImage(null);
    setDimOpacity(0.15);
    setBlurAmount(12);
    if (showToast) showToast('기본 배경화면으로 초기화되었습니다.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md glass-card bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Icon name="image" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">배경 & 글래스 커스텀</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">내 사진 업로드</label>
          <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl cursor-pointer hover:border-indigo-500 bg-zinc-50/50 dark:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Icon name="upload" className="w-4 h-4 text-zinc-400" />
              <span>클릭하여 사진 파일 선택 (.jpg, .png)</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setBgImage(ev.target.result);
                    if (showToast) showToast('내 사진이 배경화면으로 적용되었습니다.', 'success');
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">추천 프리셋</label>
            {bgImage && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span>●</span> 적용 중
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_WALLPAPERS.map((preset, idx) => {
              const isSelected = bgImage === preset.url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left border transition-all truncate flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 ring-2 ring-indigo-500/30'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 bg-zinc-100/60 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-200'
                  }`}
                >
                  <span className="truncate">{preset.name}</span>
                  {isSelected && <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0 ml-1">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 pt-1">
          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
              <span>배경 어둡기 (Dim)</span>
              <span className="font-mono">{Math.round(dimOpacity * 100)}%</span>
            </div>
            <input
              type="range" min="0" max="0.8" step="0.05" value={dimOpacity}
              onChange={(e) => setDimOpacity(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
              <span>배경 블러 (Blur)</span>
              <span className="font-mono">{blurAmount}px</span>
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
            onClick={handleResetBg}
            className="text-xs font-medium text-rose-500 hover:underline"
          >
            기본 배경 초기화
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md active:scale-95 transition-all"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default BgModal;
