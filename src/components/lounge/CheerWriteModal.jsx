import React, { useEffect, useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { CHEER_MAX_LENGTH, NICKNAME_SUGGESTIONS } from '../../constants/lounge';

const pickRandomNickname = () =>
  NICKNAME_SUGGESTIONS[Math.floor(Math.random() * NICKNAME_SUGGESTIONS.length)];

export const CheerWriteModal = ({ isOpen, onClose, onSubmit }) => {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');

  // 열릴 때마다 추천 닉네임으로 초기화
  useEffect(() => {
    if (isOpen) {
      setNickname(pickRandomNickname());
      setMessage('');
    }
  }, [isOpen]);

  // ESC 닫기
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmedNick = nickname.trim();
  const trimmedMsg = message.trim();
  const canSubmit = trimmedNick.length > 0 && trimmedMsg.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ nickname: trimmedNick, message: trimmedMsg.slice(0, CHEER_MAX_LENGTH) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl backdrop-blur-md bg-white/95 dark:bg-zinc-900/95 border border-white/20 dark:border-zinc-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-4">
          <div className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">✍️ 오늘 내 다짐 등록</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">익명 닉네임</label>
            <input
              type="text"
              maxLength={12}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {NICKNAME_SUGGESTIONS.map((nick) => (
                <button
                  key={nick}
                  type="button"
                  onClick={() => setNickname(nick)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${
                    nickname === nick
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
                  }`}
                >
                  {nick}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">오늘의 한 줄 다짐</label>
              <span
                className={`text-[11px] font-mono font-bold ${
                  message.length >= CHEER_MAX_LENGTH ? 'text-rose-500' : 'text-zinc-400 dark:text-zinc-500'
                }`}
              >
                {message.length}/{CHEER_MAX_LENGTH}
              </span>
            </div>
            <input
              type="text"
              maxLength={CHEER_MAX_LENGTH}
              placeholder="예: 오늘 수학 킬러 2문제 무조건 해결!"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, CHEER_MAX_LENGTH))}
              autoFocus
              className="mt-1 w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
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
              type="submit"
              disabled={!canSubmit}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-600/20"
            >
              다짐 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheerWriteModal;
