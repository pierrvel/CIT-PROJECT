import React, { useEffect, useRef, useState } from 'react';
import { Flame, Pencil, Clock, Radio, Trash2 } from 'lucide-react';
import CheerWriteModal from './CheerWriteModal';
import { formatDDayLabel, getCsatDDay, formatRelativeTime, formatRemainingTtl } from './loungeHelpers';
import { clapCheer, postCheer, deleteCheer } from '../../services/cheerService';
import { isFirebaseConfigured } from '../../utils/firebase';

export const CheerBoard = ({ cheers = [], setCheers, showToast, isRealtime = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [poppedId, setPoppedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const popTimerRef = useRef(null);

  const ddayLabel = formatDDayLabel(getCsatDDay());

  useEffect(() => {
    return () => {
      if (popTimerRef.current) clearTimeout(popTimerRef.current);
    };
  }, []);

  const handleCheer = async (id) => {
    // 1. 빠른 반응성을 위한 낙관적 UI 업데이트
    setCheers((prev) => prev.map((c) => (c.id === id ? { ...c, cheers: (Number(c.cheers) || 0) + 1 } : c)));

    if (popTimerRef.current) clearTimeout(popTimerRef.current);
    setPoppedId(id);
    popTimerRef.current = setTimeout(() => setPoppedId(null), 220);

    // 2. Firebase Firestore 카운트 원자적 증가 (+1)
    try {
      await clapCheer(id);
    } catch (err) {
      console.warn('Cheer clap error', err);
    }
  };

  const handleDelete = async (id, nickname = '') => {
    const targetLabel = nickname ? `'${nickname}'님의 다짐` : '이 다짐';
    if (!window.confirm(`${targetLabel}을 전광판에서 완전히 삭제하시겠습니까?`)) return;

    try {
      setCheers((prev) => prev.filter((c) => c.id !== id));
      await deleteCheer(id);
      if (showToast) showToast('다짐이 전광판에서 삭제되었습니다.', 'info');
    } catch (err) {
      console.error('Delete cheer error:', err);
      if (showToast) showToast('삭제에 실패했습니다. 다시 시도해주세요.', 'error');
    }
  };

  const handleSubmit = async ({ nickname, message }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const created = await postCheer({ nickname, message });
      if (created) {
        setCheers((prev) => [created, ...prev.filter((c) => c.id !== created.id)].slice(0, 60));
      }
      setIsModalOpen(false);
      if (showToast) {
        showToast(
          isFirebaseConfigured
            ? `'${nickname}'님의 다짐이 전체 공유 전광판에 등록되었습니다! (24시간 유지) 🔥`
            : `'${nickname}'님의 다짐이 전광판에 등록되었습니다! (24시간 유지) 🔥`,
          'success'
        );
      }
    } catch (err) {
      console.error('Failed to post cheer:', err);
      if (showToast) showToast('다짐 등록에 실패했습니다. 다시 시도해주세요.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border border-white/20 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">📣 D-Day 각오 전광판</h3>
            {isFirebaseConfigured ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                실시간 전광판
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border border-zinc-500/20" title="Firebase 연동 시 전국 실시간 공유로 자동 전환됩니다">
                <Radio className="w-2.5 h-2.5" />
                로컬 전광판
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            함께 달리는 수험생들의 24시간 한 줄 다짐 (등록 후 24시간 뒤 자동 삭제)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all self-start sm:self-auto"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>오늘 내 다짐 등록</span>
        </button>
      </div>

      {cheers.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-zinc-400 dark:text-zinc-500">
          <span className="text-2xl">✍️</span>
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">아직 등록된 다짐이 없습니다.</p>
          <p className="text-xs">상단의 [오늘 내 다짐 등록] 버튼을 눌러 첫 번째 각오를 남겨보세요! (24시간 동안 전광판에 유지됩니다)</p>
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
                      <span className="shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-600 text-white">MY</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 flex items-center gap-0.5"
                      title={c.createdAt ? new Date(c.createdAt).toLocaleString('ko-KR') : ''}
                    >
                      <Clock className="w-2.5 h-2.5 text-zinc-400" />
                      {formatRemainingTtl(c.createdAt)}
                    </span>
                    <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                      {ddayLabel}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 leading-snug break-keep">
                  “{c.message}”
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-black/[0.04] dark:border-white/[0.04]">
                <button
                  type="button"
                  onClick={() => handleCheer(c.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-transform duration-200 ${
                    poppedId === c.id ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>불꽃 응원</span>
                  <span className="font-mono">{Number(c.cheers) || 0}</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                    {formatRelativeTime(c.createdAt)}
                  </span>
                  {/* 빨간색 [ 🗑️ 삭제 ] 버튼: 직관적으로 바로 클릭 가능 */}
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id, c.nickname)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white border border-rose-500/25 transition-all active:scale-95"
                    title="전광판에서 이 다짐 삭제"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>삭제</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <CheerWriteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
    </section>
  );
};

export default CheerBoard;
