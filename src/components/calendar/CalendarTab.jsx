import React, { useState, useMemo } from 'react';
import { Plus, List, Calendar as CalendarIcon, Filter, Layers, Target, FileText, Sparkles, Star } from 'lucide-react';
import { OFFICIAL_MILESTONES, CALENDAR_CATEGORIES } from '../../constants/calendar';
import NextMilestoneHero from './NextMilestoneHero';
import TimelineView from './TimelineView';
import MonthGridView from './MonthGridView';
import CustomEventModal from './CustomEventModal';

export const CalendarTab = ({
  customMilestones = [],
  setCustomMilestones,
  starredIds = [],
  setStarredIds,
  showToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'mock' | 'susi' | 'jungsi' | 'custom'
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'month'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingMilestone, setEditingMilestone] = useState(null);

  // 공식 일정 + 사용자 맞춤 일정 통합 및 날짜순 정렬
  const allMilestones = useMemo(() => {
    const combined = [...OFFICIAL_MILESTONES, ...customMilestones];
    return combined.sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [customMilestones]);

  // 카테고리 필터링된 마일스톤
  const filteredMilestones = useMemo(() => {
    if (selectedCategory === 'all') return allMilestones;
    if (selectedCategory === 'custom') {
      return allMilestones.filter((m) => m.isCustom || starredIds.includes(m.id));
    }
    return allMilestones.filter((m) => m.group === selectedCategory);
  }, [allMilestones, selectedCategory, starredIds]);

  // 관심 일정 토글 핸들러
  const handleToggleStar = (id) => {
    setStarredIds((prev) => {
      const isStarred = prev.includes(id);
      const next = isStarred ? prev.filter((item) => item !== id) : [...prev, id];
      if (showToast) {
        showToast(isStarred ? '관심 일정에서 제외되었습니다.' : '⭐ 관심 일정으로 고정되었습니다!', 'info');
      }
      return next;
    });
  };

  // 맞춤 일정 등록 모달 열기
  const handleOpenCreateModal = () => {
    setEditingMilestone(null);
    setIsModalOpen(true);
  };

  // 맞춤 일정 수정 모달 열기
  const handleOpenEditModal = (milestone) => {
    setEditingMilestone(milestone);
    setIsModalOpen(true);
  };

  // 맞춤 일정 등록/수정 저장 핸들러
  const handleSaveCustomMilestone = (savedMilestone) => {
    setCustomMilestones((prev) => {
      const exists = prev.some((m) => m.id === savedMilestone.id);
      if (exists) {
        return prev.map((m) => (m.id === savedMilestone.id ? savedMilestone : m));
      }
      return [savedMilestone, ...prev];
    });

    const wasEditing = !!editingMilestone;
    setIsModalOpen(false);
    setEditingMilestone(null);

    if (showToast) {
      showToast(
        wasEditing
          ? `'${savedMilestone.title}' 일정이 수정되었습니다.`
          : `'${savedMilestone.title}' 일정이 등록되었습니다.`,
        'success'
      );
    }
  };

  // 맞춤 일정 삭제 핸들러
  const handleDeleteCustomMilestone = (id) => {
    if (confirm('이 맞춤 일정을 삭제하시겠습니까?')) {
      setCustomMilestones((prev) => prev.filter((m) => m.id !== id));
      setStarredIds((prev) => prev.filter((item) => item !== id));
      if (showToast) {
        showToast('일정이 삭제되었습니다.', 'info');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. 상단 D-Day 하이라이트 배너 */}
      <NextMilestoneHero milestones={allMilestones} />

      {/* 2. 툴바 (카테고리 필터 칩 + 뷰 모드 전환 + 맞춤 추가 버튼) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* 카테고리 필터 칩 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CALENDAR_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                    : 'bg-white/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 뷰 모드 스위처 & 맞춤 일정 추가 버튼 */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <div className="inline-flex p-1 rounded-full bg-zinc-200/70 dark:bg-zinc-800/80 backdrop-blur-md border border-zinc-300/40 dark:border-zinc-700/50">
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>타임라인</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>월간 달력</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">내 맞춤 일정 추가</span>
          </button>
        </div>
      </div>

      {/* 3. 메인 콘텐츠 뷰 */}
      {viewMode === 'timeline' ? (
        <TimelineView
          milestones={filteredMilestones}
          starredIds={starredIds}
          onToggleStar={handleToggleStar}
          onDeleteCustomMilestone={handleDeleteCustomMilestone}
          onEditCustomMilestone={handleOpenEditModal}
        />
      ) : (
        <MonthGridView
          milestones={filteredMilestones}
          starredIds={starredIds}
          onToggleStar={handleToggleStar}
          onEditCustomMilestone={handleOpenEditModal}
        />
      )}

      {/* 4. 맞춤 일정 등록 / 수정 모달 */}
      <CustomEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMilestone(null);
        }}
        onSubmit={handleSaveCustomMilestone}
        initialData={editingMilestone}
      />
    </div>
  );
};

export default CalendarTab;
