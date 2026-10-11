import React, { useState, useEffect } from 'react';
import { Plus, X, Calendar as CalendarIcon, Tag } from 'lucide-react';

export const CustomEventModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [group, setGroup] = useState('mock');
  const [categoryLabel, setCategoryLabel] = useState('사설 모의고사');
  const [desc, setDesc] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  // 카테고리 그룹 변경 시 기본 라벨 자동 세팅
  const handleGroupChange = (newGroup) => {
    setGroup(newGroup);
    if (newGroup === 'mock') setCategoryLabel('사설 모의고사');
    else if (newGroup === 'susi') setCategoryLabel('수시 전형/논술');
    else if (newGroup === 'jungsi') setCategoryLabel('정시 전형');
    else setCategoryLabel('학교 시험/개인');
  };

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setGroup('mock');
      setCategoryLabel('사설 모의고사');
      setDesc('');
      setTagsStr('');
    }
  }, [isOpen]);

  // ESC 키 닫기
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newMilestone = {
      id: `custom_m_${Date.now()}`,
      title: title.trim(),
      date,
      endDate: endDate || null,
      group,
      category: 'custom',
      categoryLabel: categoryLabel.trim() || '맞춤 일정',
      importance: 'normal',
      desc: desc.trim(),
      tags,
      isCustom: true
    };

    onSubmit(newMilestone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl backdrop-blur-md bg-white/95 dark:bg-zinc-900/95 border border-white/20 dark:border-zinc-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">➕ 내 맞춤 입시 일정 등록</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">일정명 *</label>
            <input
              type="text"
              required
              placeholder="예: 시대인재 서바이벌 모의고사 1회, 중앙대 수리논술 고사"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">시작일자 *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">종료일자 (선택)</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">카테고리 분류</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
              {[
                { key: 'mock', label: '사설 모의고사' },
                { key: 'susi', label: '수시/논술/면접' },
                { key: 'jungsi', label: '정시 전형' },
                { key: 'custom', label: '학교시험/기타' }
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => handleGroupChange(c.key)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    group === c.key
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-indigo-400'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">목표 / 메모</label>
            <textarea
              rows={2}
              placeholder="예: 목표 1등급 사수! 킬러 문항 시간 배분 점검하기"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="mt-1 w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">태그 (쉼표로 구분)</label>
            <input
              type="text"
              placeholder="예: 수학실전, 킬러대비, 목표96점"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
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
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
            >
              등록 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomEventModal;
