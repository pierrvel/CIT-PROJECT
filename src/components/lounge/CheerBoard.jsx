import React, { useEffect, useRef, useState } from 'react';
import { Flame, Pencil } from 'lucide-react';
import CheerWriteModal from './CheerWriteModal';
import { formatDDayLabel, getCsatDDay } from './loungeHelpers';

export const CheerBoard = ({ cheers = [], setCheers, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [poppedId, setPoppedId] = useState(null);
  const popTimerRef = useRef(null);

  const ddayLabel = formatDDayLabel(getCsatDDay());

  useEffect(() => {
    return () => {
      if (popTimerRef.current) clearTimeout(popTimerRef.current);
    };
  }, []);

  const handleCheer = (id) => {
    setCheers((prev) => prev.map((c) => (c.id === id ? { ...c, cheers: (Number(c.cheers) || 0) + 1 } : c)));
    if (popTimerRef.current) clearTimeout(popTimerRef.current);
    setPoppedId(id);
    popTimerRef.current = setTimeout(() => setPoppedId(null), 220);
  };

  const handleSubmit = ({ nickname, message }) => {
    const entry = {
      id: `cheer_${Date.now()}`,
      nickname,
      message,
      cheers: 0,
      isMine: true,
      createdAt: Date.now()
    };
    setCheers((prev) => [entry, ...prev].slice(0, 60));
    setIsModalOpen(false);
    if (showToast) showToast(`'${nickname}'님의 다짐이 전광판에 등록되었습니다! 🔥`, 'success');
  };

  return (
    <section className="rounded-2xl backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border border-white/20 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">📣 D-Day 각오 전광판</h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">함께 달리는 수험생들의 한 줄 다짐</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>오늘 내 다짐 등록</span>
        </button>
      </div>

      {cheers.length === 0 ? (
        <div className="py-10 text-center text-xs text-zinc-400 dark:text-zinc-500">
          아직 등록된 다짐이 없습니다. 첫 다짐을 남겨보세요!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
          {cheers.map((c) => (
            <article
              key={c.id}
              className={`flex flex-col justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
                c.isMine
                  ? 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/30'
                  : 'bg-white/60 dark:bg-zinc-800/50 border-zinc-200/70 dark:border-zinc-700/60'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate">{c.nickname}</span>
                    {c.isMine && (
                      <span className="shrink-0 text-[9px] font-black px-1 py-0.5 rounded bg-indigo-600 text-white">MY</span>
                    )}
                  </div>
                  <span className="shrink-0 text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    {ddayLabel}
                  </span>
                </div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 leading-snug break-keep">
                  “{c.message}”
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCheer(c.id)}
                className={`self-start inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-transform duration-200 ${
                  poppedId === c.id ? 'scale-110' : 'scale-100'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>불꽃 응원</span>
                <span className="font-mono">{Number(c.cheers) || 0}</span>
              </button>
            </article>
          ))}
        </div>
      )}

      <CheerWriteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
    </section>
  );
};

export default CheerBoard;
