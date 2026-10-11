import React from 'react';
import Icon from '../common/Icon';

export const GoalModal = ({
  isOpen,
  onClose,
  newGoalForm,
  setNewGoalForm,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md glass-card bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-4">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white">새 학습 목표 등록</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">교재명 또는 목표</label>
            <input
              type="text"
              required
              placeholder="예: 마더텅 지구과학I 기출"
              value={newGoalForm.title}
              onChange={(e) => setNewGoalForm({ ...newGoalForm, title: e.target.value })}
              className="mt-1 w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">단위</label>
              <select
                value={newGoalForm.unit}
                onChange={(e) => setNewGoalForm({ ...newGoalForm, unit: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              >
                <option value="문제">문제</option>
                <option value="강">강 (인강)</option>
                <option value="쪽">쪽 (페이지)</option>
                <option value="단계">단계</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">마감 목표일</label>
              <input
                type="date"
                required
                value={newGoalForm.deadline}
                onChange={(e) => setNewGoalForm({ ...newGoalForm, deadline: e.target.value })}
                className="mt-1 w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">전체 분량</label>
              <input
                type="number"
                min="1"
                required
                value={newGoalForm.totalAmount}
                onChange={(e) => setNewGoalForm({ ...newGoalForm, totalAmount: e.target.value })}
                className="mt-1 w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">현재 완료량</label>
              <input
                type="number"
                min="0"
                value={newGoalForm.completedAmount}
                onChange={(e) => setNewGoalForm({ ...newGoalForm, completedAmount: e.target.value })}
                className="mt-1 w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">하루 최대 소화 한도 (Daily Cap)</label>
            <input
              type="number"
              min="1"
              value={newGoalForm.dailyCap}
              onChange={(e) => setNewGoalForm({ ...newGoalForm, dailyCap: e.target.value })}
              className="mt-1 w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
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
              목표 추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
