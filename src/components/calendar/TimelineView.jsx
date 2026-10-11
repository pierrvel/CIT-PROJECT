import React from 'react';
import { Calendar, Trash2, Star, Tag, CheckCircle2, Clock, Pencil } from 'lucide-react';
import {
  formatDateRange,
  getCategoryBadgeStyle,
  getDDayBadgeProps,
  getDaysUntil
} from './calendarHelpers';

export const TimelineView = ({
  milestones = [],
  starredIds = [],
  onToggleStar,
  onDeleteMilestone,
  onDeleteCustomMilestone,
  onEditCustomMilestone
}) => {
  const handleDelete = (id, title) => {
    const fn = onDeleteMilestone || onDeleteCustomMilestone;
    if (fn) fn(id, title);
  };

  if (milestones.length === 0) {
    return (
      <div className="py-16 text-center rounded-3xl backdrop-blur-md bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-zinc-800 space-y-2">
        <span className="text-3xl">🗓️</span>
        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">해당 조건의 입시 일정이 없습니다.</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">다른 필터를 선택하거나 상단의 [➕ 내 맞춤 일정 추가]로 등록해보세요.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      {/* 중앙 타임라인 버티컬 라인 (데스크톱) */}
      <div className="hidden sm:block absolute left-8 top-6 bottom-6 w-0.5 bg-zinc-200 dark:bg-zinc-800 pointer-events-none -z-0" />

      {milestones.map((m, index) => {
        const diffDays = getDaysUntil(m.date);
        const badge = getDDayBadgeProps(diffDays);
        const categoryStyle = getCategoryBadgeStyle(m.group);
        const isStarred = starredIds.includes(m.id);

        return (
          <article
            key={m.id}
            className={`relative rounded-2xl backdrop-blur-md bg-white/75 dark:bg-zinc-900/75 border p-4 sm:p-5 transition-all duration-300 hover:shadow-lg ${
              badge.cardBorder
            } ${badge.isPast ? 'opacity-75 hover:opacity-100' : ''}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
              {/* 좌측 콘텐츠 */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {/* D-Day 뱃지 */}
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black ${badge.bgClass}`}>
                    {badge.label}
                  </span>

                  {/* 카테고리 뱃지 */}
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${categoryStyle}`}>
                    {m.categoryLabel || '일정'}
                  </span>

                  {m.isCustom && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      MY 맞춤
                    </span>
                  )}

                  {m.importance === 'high' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      KEY 핵심
                    </span>
                  )}

                  {/* 지난 일정인 경우 눈에 띄는 삭제 버튼 */}
                  {badge.isPast && (
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id, m.title)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition-colors"
                      title="캘린더에서 이 지난 일정 삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>지난 일정 삭제</span>
                    </button>
                  )}
                </div>

                {/* 제목 */}
                <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white leading-snug">
                  {m.title}
                </h3>

                {/* 날짜 */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>{formatDateRange(m.date, m.endDate)}</span>
                </div>

                {/* 설명 */}
                {m.desc && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed break-keep pt-0.5">
                    {m.desc}
                  </p>
                )}

                {/* 태그 */}
                {Array.isArray(m.tags) && m.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 우측 툴 액션 (관심 일정 고정 / 맞춤 일정 수정 / 삭제 버튼) */}
              <div className="flex sm:flex-col items-center justify-end gap-1.5 shrink-0 self-end sm:self-start">
                <button
                  type="button"
                  onClick={() => onToggleStar(m.id)}
                  title={isStarred ? '관심 일정 해제' : '관심 일정으로 고정'}
                  className={`p-2 rounded-xl transition-all ${
                    isStarred
                      ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30 scale-105'
                      : 'text-zinc-400 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-500' : ''}`} />
                </button>

                {m.isCustom && (
                  <button
                    type="button"
                    onClick={() => onEditCustomMilestone && onEditCustomMilestone(m)}
                    title="일정 수정"
                    className="p-2 rounded-xl text-zinc-400 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}

                {(badge.isPast || m.isCustom) && (
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id, m.title)}
                    title={badge.isPast ? '지난 일정 삭제' : '맞춤 일정 삭제'}
                    className={`p-2 rounded-xl transition-all ${
                      badge.isPast
                        ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-500/15 bg-rose-500/5'
                        : 'text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default TimelineView;
