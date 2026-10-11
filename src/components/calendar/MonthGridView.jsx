import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Star } from 'lucide-react';
import {
  formatDateWithDay,
  getCategoryBadgeStyle,
  getDDayBadgeProps,
  getDaysUntil
} from './calendarHelpers';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const MonthGridView = ({ milestones = [], starredIds = [], onToggleStar }) => {
  // 기준 년/월 상태 (기본값: 오늘 날짜 기준)
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth()); // 0-indexed
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDateStr(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
  };

  // 캘린더 그리드 날짜 계산
  const { calendarCells, monthMilestonesMap } = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 첫째 날 요일 (0~6)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // 이달 총 일수

    const cells = [];

    // 앞쪽 빈 셀
    for (let i = 0; i < firstDay; i++) {
      cells.push({ empty: true, key: `empty_prev_${i}` });
    }

    // 날짜 셀
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        empty: false,
        day,
        dateStr,
        key: `day_${dateStr}`
      });
    }

    // 날짜별 마일스톤 매핑
    const map = {};
    milestones.forEach((m) => {
      if (!map[m.date]) map[m.date] = [];
      map[m.date].push(m);
    });

    return { calendarCells: cells, monthMilestonesMap: map };
  }, [currentYear, currentMonth, milestones]);

  // 선택된 날짜의 마일스톤 리스트
  const selectedMilestones = monthMilestonesMap[selectedDateStr] || [];

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  return (
    <div className="space-y-6">
      {/* 캘린더 메인 카드 */}
      <div className="rounded-3xl backdrop-blur-md bg-white/75 dark:bg-zinc-900/75 border border-white/20 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark p-4 sm:p-6 space-y-4">
        {/* 상단 툴바: 월 이동 & 오늘 바로가기 */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-black font-mono text-zinc-900 dark:text-white">
              {currentYear}년 {currentMonth + 1}월
            </h3>
            <button
              type="button"
              onClick={handleGoToday}
              className="text-xs px-2.5 py-1 rounded-lg font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
            >
              오늘
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="이전 달"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="다음 달"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-zinc-400 dark:text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          {WEEKDAYS.map((w, idx) => (
            <div key={w} className={idx === 0 ? 'text-rose-500' : idx === 6 ? 'text-blue-500' : ''}>
              {w}
            </div>
          ))}
        </div>

        {/* 캘린더 그리드 */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarCells.map((cell) => {
            if (cell.empty) {
              return <div key={cell.key} className="h-16 sm:h-24 rounded-xl bg-transparent" />;
            }

            const events = monthMilestonesMap[cell.dateStr] || [];
            const hasEvents = events.length > 0;
            const isToday = cell.dateStr === todayStr;
            const isSelected = cell.dateStr === selectedDateStr;

            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => setSelectedDateStr(cell.dateStr)}
                className={`group relative h-16 sm:h-24 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl flex flex-col justify-between items-start text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-2 ring-indigo-500/50'
                    : isToday
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                    : 'bg-white/40 dark:bg-zinc-800/40 hover:bg-white/80 dark:hover:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-800/60'
                }`}
              >
                {/* 일자 라벨 */}
                <span
                  className={`text-xs sm:text-sm font-black font-mono ${
                    isSelected
                      ? 'text-white'
                      : isToday
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-zinc-700 dark:text-zinc-200'
                  }`}
                >
                  {cell.day}
                </span>

                {/* 이벤트 표시 (점 or 미니 칩) */}
                {hasEvents && (
                  <div className="w-full space-y-1 overflow-hidden">
                    {/* 모바일: 작은 Dot들 */}
                    <div className="flex sm:hidden gap-1 flex-wrap">
                      {events.slice(0, 3).map((ev) => (
                        <span
                          key={ev.id}
                          className={`w-2 h-2 rounded-full ${
                            isSelected
                              ? 'bg-white'
                              : ev.group === 'mock'
                              ? 'bg-blue-500'
                              : ev.group === 'susi'
                              ? 'bg-emerald-500'
                              : ev.group === 'jungsi'
                              ? 'bg-purple-500'
                              : 'bg-amber-500'
                          }`}
                        />
                      ))}
                    </div>

                    {/* 데스크톱: 타이틀 미니 알약 */}
                    <div className="hidden sm:block space-y-1 w-full">
                      {events.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`truncate text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : ev.group === 'mock'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : ev.group === 'susi'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : ev.group === 'jungsi'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <span className={`text-[9px] font-mono font-bold ${isSelected ? 'text-white/80' : 'text-zinc-400'}`}>
                          +{events.length - 2}개 더보기
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택된 날짜 상세 패널 */}
      <div className="rounded-2xl backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border border-white/20 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-500" />
            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
              {formatDateWithDay(selectedDateStr)} 입시 일정
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
            {selectedMilestones.length}개 일정
          </span>
        </div>

        {selectedMilestones.length === 0 ? (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 py-3 text-center">
            선택된 날짜에 등록된 입시 일정이 없습니다.
          </p>
        ) : (
          <div className="space-y-2">
            {selectedMilestones.map((m) => {
              const diffDays = getDaysUntil(m.date);
              const badge = getDDayBadgeProps(diffDays);
              const categoryStyle = getCategoryBadgeStyle(m.group);
              const isStarred = starredIds.includes(m.id);

              return (
                <div
                  key={m.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white/60 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${badge.bgClass}`}>
                        {badge.label}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${categoryStyle}`}>
                        {m.categoryLabel}
                      </span>
                      <h5 className="text-sm font-bold text-zinc-900 dark:text-white">{m.title}</h5>
                    </div>
                    {m.desc && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug break-keep">
                        {m.desc}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleStar(m.id)}
                    title={isStarred ? '관심 해제' : '관심 일정 등록'}
                    className={`self-end sm:self-center p-1.5 rounded-lg transition-colors ${
                      isStarred ? 'text-amber-500 bg-amber-500/15' : 'text-zinc-400 hover:text-amber-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthGridView;
