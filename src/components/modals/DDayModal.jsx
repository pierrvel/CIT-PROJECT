import React, { useState } from 'react';
import { Target, Star, Trash2, X, Plus, Calendar, Check, Sparkles, Clock } from 'lucide-react';
import { formatDDayDate, calculateDDay, DDAY_PRESET_TEMPLATES } from '../../constants/ddays';

export const DDayModal = ({
  isOpen,
  onClose,
  ddaysList,
  setDdaysList,
  primaryDDayId,
  setPrimaryDDayId,
  showToast
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  if (!isOpen) return null;

  // 대표 D-Day 객체
  const primaryDDay = ddaysList.find((d) => d.id === primaryDDayId) || ddaysList[0] || null;
  const primaryInfo = primaryDDay ? calculateDDay(primaryDDay.date) : null;

  // 새 D-Day 등록 핸들러
  const handleAddDDay = (e) => {
    if (e) e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      if (showToast) showToast('D-Day 제목을 입력해주세요.', 'warn');
      return;
    }
    if (!date) {
      if (showToast) showToast('목표 날짜를 선택해주세요.', 'warn');
      return;
    }

    const newDDay = {
      id: `dday_${Date.now()}`,
      title: trimmed,
      date,
      isPreset: false
    };

    setDdaysList((prev) => [newDDay, ...prev]);
    setTitle('');
    setDate('');

    // 목록이 비어있었다면 자동으로 대표 D-Day로 설정
    if (!primaryDDayId || ddaysList.length === 0) {
      setPrimaryDDayId(newDDay.id);
    }

    if (showToast) showToast(`🎯 '${trimmed}' D-Day가 등록되었습니다!`, 'success');
  };

  // 프리셋 빠른 추가 핸들러
  const handleApplyPreset = (preset) => {
    // 이미 동일한 제목과 날짜가 있는지 확인
    const existing = ddaysList.find((d) => d.title === preset.title && d.date === preset.date);
    if (existing) {
      setPrimaryDDayId(existing.id);
      if (showToast) showToast(`⭐ '${existing.title}'(으)로 대표 D-Day가 변경되었습니다.`, 'info');
      return;
    }

    const newDDay = {
      id: `preset_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: preset.title,
      date: preset.date,
      category: preset.category,
      isPreset: true
    };

    setDdaysList((prev) => [newDDay, ...prev]);
    setPrimaryDDayId(newDDay.id);
    if (showToast) showToast(`🎯 '${preset.title}' 추가 및 대표 D-Day로 설정되었습니다!`, 'success');
  };

  // 대표 D-Day 설정
  const handleSetPrimary = (id, ddayTitle) => {
    setPrimaryDDayId(id);
    if (showToast) showToast(`⭐ '${ddayTitle}'(이)가 상단 대표 D-Day로 지정되었습니다.`, 'success');
  };

  // D-Day 삭제
  const handleDeleteDDay = (id, ddayTitle) => {
    const updated = ddaysList.filter((d) => d.id !== id);
    setDdaysList(updated);

    if (primaryDDayId === id) {
      const nextPrimary = updated[0]?.id || null;
      setPrimaryDDayId(nextPrimary);
    }

    if (showToast) showToast(`'${ddayTitle}' 일정이 삭제되었습니다.`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-lg glass-card bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-200/80 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white shadow-md shadow-rose-500/20">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                D-Day 관리
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  상단 바 상시 표시
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                원하는 시험 일정을 등록하고 대표 디데이를 설정하세요.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 스크롤 가능한 본문 영역 */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-0.5">
          {/* 1. 현재 대표 D-Day 스포트라이트 카드 */}
          {primaryDDay && primaryInfo ? (
            <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-rose-500/10 dark:from-indigo-950/40 dark:via-zinc-900 dark:to-rose-950/30 border border-indigo-500/25 dark:border-indigo-500/30 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  상단 바 대표 디데이
                </span>
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDDayDate(primaryDDay.date)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white truncate">
                    {primaryDDay.title}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    {primaryInfo.status === 'today'
                      ? '🔥 오늘이 바로 대망의 D-DAY입니다! 후회 없이 쏟아부으세요.'
                      : primaryInfo.days > 0
                      ? `${primaryInfo.days}일 남았습니다. 목표를 향해 끝까지 집중!`
                      : `D+${Math.abs(primaryInfo.days)}일 지난 일정입니다.`}
                  </p>
                </div>

                <div className={`shrink-0 px-3 py-1.5 rounded-xl font-mono font-black text-xl tracking-tight shadow-sm ${
                  primaryInfo.status === 'today'
                    ? 'bg-rose-500 text-white animate-pulse'
                    : primaryInfo.days <= 7 && primaryInfo.days > 0
                    ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    : 'bg-indigo-600 text-white'
                }`}>
                  {primaryInfo.text}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 text-center text-xs text-zinc-500">
              설정된 대표 D-Day가 없습니다. 아래에서 디데이를 등록하거나 선택해주세요.
            </div>
          )}

          {/* 2. 빠른 공식 시험 프리셋 칩 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                추천 시험 프리셋 원클릭 추가
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DDAY_PRESET_TEMPLATES.map((preset) => {
                const info = calculateDDay(preset.date);
                const isSelected = primaryDDay?.title === preset.title;
                return (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700'
                    }`}
                  >
                    <span>{preset.title}</span>
                    <span className={`text-[10px] font-mono px-1 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-zinc-500 dark:text-zinc-400'
                    }`}>
                      {info.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. 새 D-Day 직접 등록 폼 */}
          <form onSubmit={handleAddDDay} className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-indigo-500" />
              직접 D-Day 등록
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <input
                type="text"
                placeholder="일정 이름 (예: 10월 대성 모평)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="sm:col-span-3 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="sm:col-span-2 px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.99] transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              D-Day 목록에 추가
            </button>
          </form>

          {/* 4. 등록된 D-Day 목록 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                등록된 D-Day ({ddaysList.length})
              </span>
              <span className="text-[11px] text-zinc-400">
                별표(★)를 눌러 대표 디데이를 변경하세요
              </span>
            </div>

            <div className="space-y-1.5">
              {ddaysList.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-400">
                  등록된 D-Day가 없습니다.
                </div>
              ) : (
                ddaysList.map((item) => {
                  const isPrimary = item.id === primaryDDayId;
                  const itemInfo = calculateDDay(item.date);

                  return (
                    <div
                      key={item.id}
                      className={`group flex items-center justify-between gap-2 p-2.5 rounded-xl border transition-all ${
                        isPrimary
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-400/50 dark:border-indigo-600/50 shadow-xs'
                          : 'bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-zinc-200/80 dark:border-zinc-700/80'
                      }`}
                    >
                      {/* 좌측: 대표 디데이 지정 버튼 & 정보 */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(item.id, item.title)}
                          title={isPrimary ? '현재 대표 D-Day' : '대표 D-Day로 설정'}
                          className={`p-1 rounded-lg transition-colors shrink-0 ${
                            isPrimary
                              ? 'text-amber-500 hover:text-amber-600'
                              : 'text-zinc-300 hover:text-amber-400 dark:text-zinc-600 dark:hover:text-amber-400'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isPrimary ? 'fill-amber-500' : ''}`} />
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold truncate ${
                              isPrimary ? 'text-indigo-950 dark:text-indigo-100' : 'text-zinc-900 dark:text-zinc-100'
                            }`}>
                              {item.title}
                            </span>
                            {isPrimary && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                                대표
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                            {formatDDayDate(item.date)}
                          </span>
                        </div>
                      </div>

                      {/* 우측: D-Day 배지 & 삭제 버튼 */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-md font-mono font-black text-xs tracking-tight ${
                          itemInfo.status === 'today'
                            ? 'bg-rose-500 text-white animate-pulse'
                            : itemInfo.days <= 7 && itemInfo.days > 0
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : isPrimary
                            ? 'bg-indigo-600 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                        }`}>
                          {itemInfo.text}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDeleteDDay(item.id, item.title)}
                          title="D-Day 삭제"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DDayModal;
