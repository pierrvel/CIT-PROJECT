import React, { useState, useMemo } from 'react';
import Icon from '../common/Icon';
import { SUBJECT_META } from '../../constants/subjects';
import { formatTime } from '../../utils/pacing';

export const SubjectReportList = ({
  examHistory = [],
  selectedSubjectKey = 'all',
  onSelectSubject,
  setPacerSubView,
  handleUpdateMemo,
  handleDeleteExamHistory,
  handleStartExamWithSubject
}) => {
  // 1. 과목 필터 상태 (props로 넘어온 selectedSubjectKey가 있으면 초기값으로 반영)
  const [activeSubject, setActiveSubject] = useState(
    selectedSubjectKey && selectedSubjectKey !== 'all' ? selectedSubjectKey : 'all'
  );
  // 정렬 기준 ('latest' | 'oldest' | 'fastest' | 'slowest')
  const [sortOrder, setSortOrder] = useState('latest');
  // 페이스 필터 ('all' | 'ontime' | 'overtime')
  const [paceFilter, setPaceFilter] = useState('all');

  // 개별 카드 아코디언 토글 상태 (Set of IDs)
  const [expandedIds, setExpandedIds] = useState(() => {
    // 기본적으로 가장 최근 1개는 펼쳐둠
    if (examHistory.length > 0) {
      return new Set([examHistory[0].id]);
    }
    return new Set();
  });

  // 메모 인라인 편집 상태
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [memoDraft, setMemoDraft] = useState('');

  // 2. 과목별 건수 카운트 맵
  const countsBySubject = useMemo(() => {
    const map = {
      all: examHistory.length,
      korean: 0,
      math: 0,
      english: 0,
      history: 0,
      inquiry: 0,
      secondLang: 0
    };
    examHistory.forEach((item) => {
      if (item.subject && map[item.subject] !== undefined) {
        map[item.subject] += 1;
      }
    });
    return map;
  }, [examHistory]);

  // 3. 필터링 및 정렬된 리포트 리스트
  const filteredAndSortedReports = useMemo(() => {
    let result = [...examHistory];

    // 과목 필터
    if (activeSubject !== 'all') {
      result = result.filter((item) => item.subject === activeSubject);
    }

    // 페이스 필터 (여유 vs 지연)
    if (paceFilter === 'ontime') {
      result = result.filter((item) => {
        const delta = item.totalDeltaSec !== undefined
          ? item.totalDeltaSec
          : (item.totalElapsed || 0) - (item.totalTargetSec || 0);
        return delta <= 0;
      });
    } else if (paceFilter === 'overtime') {
      result = result.filter((item) => {
        const delta = item.totalDeltaSec !== undefined
          ? item.totalDeltaSec
          : (item.totalElapsed || 0) - (item.totalTargetSec || 0);
        return delta > 0;
      });
    }

    // 정렬
    result.sort((a, b) => {
      const deltaA = a.totalDeltaSec !== undefined ? a.totalDeltaSec : (a.totalElapsed || 0) - (a.totalTargetSec || 0);
      const deltaB = b.totalDeltaSec !== undefined ? b.totalDeltaSec : (b.totalElapsed || 0) - (b.totalTargetSec || 0);

      if (sortOrder === 'oldest') {
        return (a.id || 0) - (b.id || 0);
      }
      if (sortOrder === 'fastest') {
        return deltaA - deltaB; // 가장 시간 많이 세이브한 순
      }
      if (sortOrder === 'slowest') {
        return deltaB - deltaA; // 가장 많이 지연된 순
      }
      // 기본: 최신순
      return (b.id || 0) - (a.id || 0);
    });

    return result;
  }, [examHistory, activeSubject, paceFilter, sortOrder]);

  // 4. 선택된 과목 요약 통계 계산
  const summaryStats = useMemo(() => {
    const list = activeSubject === 'all'
      ? examHistory
      : examHistory.filter((item) => item.subject === activeSubject);

    if (list.length === 0) return null;

    const totalSessions = list.length;
    const totalElapsedSec = list.reduce((sum, item) => sum + (item.totalElapsed || 0), 0);
    const avgElapsedSec = Math.round(totalElapsedSec / totalSessions);

    const totalDeltaSec = list.reduce((sum, item) => {
      const d = item.totalDeltaSec !== undefined
        ? item.totalDeltaSec
        : (item.totalElapsed || 0) - (item.totalTargetSec || 0);
      return sum + d;
    }, 0);
    const avgDeltaSec = Math.round(totalDeltaSec / totalSessions);

    const onTimeCount = list.filter((item) => {
      const d = item.totalDeltaSec !== undefined
        ? item.totalDeltaSec
        : (item.totalElapsed || 0) - (item.totalTargetSec || 0);
      return d <= 0;
    }).length;
    const onTimeRate = Math.round((onTimeCount / totalSessions) * 100);

    return {
      totalSessions,
      avgElapsedSec,
      avgDeltaSec,
      onTimeRate,
      latestDate: list[0]?.date || '-'
    };
  }, [examHistory, activeSubject]);

  // 아코디언 토글 핸들러
  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 모든 카드 펼치기 / 접기
  const handleToggleAll = (expandAll) => {
    if (expandAll) {
      setExpandedIds(new Set(filteredAndSortedReports.map((r) => r.id)));
    } else {
      setExpandedIds(new Set());
    }
  };

  // 메모 편집 시작
  const startEditingMemo = (session) => {
    setEditingMemoId(session.id);
    setMemoDraft(session.memo || '');
  };

  // 메모 저장
  const saveMemo = (id) => {
    if (handleUpdateMemo) {
      handleUpdateMemo(id, memoDraft);
    }
    setEditingMemoId(null);
  };

  // 과목 태그 스타일 매핑
  const subjectStyles = {
    korean: {
      label: '국어',
      badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      pill: 'hover:bg-blue-500/10 data-[active=true]:bg-blue-600 data-[active=true]:text-white'
    },
    math: {
      label: '수학',
      badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      pill: 'hover:bg-purple-500/10 data-[active=true]:bg-purple-600 data-[active=true]:text-white'
    },
    english: {
      label: '영어',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      pill: 'hover:bg-emerald-500/10 data-[active=true]:bg-emerald-600 data-[active=true]:text-white'
    },
    history: {
      label: '한국사',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      pill: 'hover:bg-amber-500/10 data-[active=true]:bg-amber-600 data-[active=true]:text-white'
    },
    inquiry: {
      label: '탐구',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      pill: 'hover:bg-rose-500/10 data-[active=true]:bg-rose-600 data-[active=true]:text-white'
    },
    secondLang: {
      label: '제2외국어',
      badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      pill: 'hover:bg-cyan-500/10 data-[active=true]:bg-cyan-600 data-[active=true]:text-white'
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. 상단 과목 탭 셀렉터 */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 p-4 sm:p-5 rounded-3xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Icon name="fileText" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white">
                과목별 실전 모의고사 리포트 보관함
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                응시했던 모든 모의고사 회차의 구간별 페이스와 복기 메모를 과목별로 정밀 분석합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handleToggleAll(true)}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 transition-colors"
            >
              모두 펼치기
            </button>
            <button
              type="button"
              onClick={() => handleToggleAll(false)}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 transition-colors"
            >
              모두 접기
            </button>
            {setPacerSubView && (
              <button
                type="button"
                onClick={() => setPacerSubView('timer')}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
              >
                <Icon name="clock" className="w-3.5 h-3.5" />
                <span>새 시험 시작</span>
              </button>
            )}
          </div>
        </div>

        {/* 과목 필터 칩 목록 */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 scrollbar-none">
          {/* [전체] */}
          <button
            type="button"
            onClick={() => setActiveSubject('all')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
              activeSubject === 'all'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <span>전체 과목</span>
            <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
              activeSubject === 'all'
                ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
            }`}>
              {countsBySubject.all}
            </span>
          </button>

          {/* 각 과목별 탭 */}
          {Object.entries(SUBJECT_META).map(([key, meta]) => {
            const count = countsBySubject[key] || 0;
            const isSelected = activeSubject === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveSubject(key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-white/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-700/80 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{meta.period} {meta.name.replace(' 영역', '')}</span>
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : count > 0
                      ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 과목 요약 통계 카드 (기록이 있을 때만 노출) */}
      {summaryStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-card bg-white/75 dark:bg-zinc-900/75 p-4 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs mb-1">
              <span>누적 응시 회차</span>
              <Icon name="checkCircle2" className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
              {summaryStats.totalSessions}
              <span className="text-xs font-normal text-zinc-400 ml-1">회 완료</span>
            </div>
          </div>

          <div className="glass-card bg-white/75 dark:bg-zinc-900/75 p-4 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs mb-1">
              <span>정시 완주율</span>
              <Icon name="shieldCheck" className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {summaryStats.onTimeRate}
              <span className="text-xs font-normal text-zinc-400 ml-1">%</span>
            </div>
          </div>

          <div className="glass-card bg-white/75 dark:bg-zinc-900/75 p-4 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs mb-1">
              <span>평균 실전 소요</span>
              <Icon name="clock" className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white font-mono">
              {formatTime(summaryStats.avgElapsedSec)}
            </div>
          </div>

          <div className="glass-card bg-white/75 dark:bg-zinc-900/75 p-4 rounded-2xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs mb-1">
              <span>평균 목표 대비 오차</span>
              <Icon name="trendingUp" className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className={`text-xl sm:text-2xl font-black font-mono ${
              summaryStats.avgDeltaSec > 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {summaryStats.avgDeltaSec > 0
                ? `+${formatTime(summaryStats.avgDeltaSec)}`
                : `-${formatTime(Math.abs(summaryStats.avgDeltaSec))}`}
            </div>
          </div>
        </div>
      )}

      {/* 3. 리포트 리스트 상단 컨트롤러 (정렬 & 오차 필터) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-1.5 bg-white/60 dark:bg-zinc-800/60 p-1 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 text-xs">
          <button
            type="button"
            onClick={() => setPaceFilter('all')}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              paceFilter === 'all'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            전체 ({filteredAndSortedReports.length})
          </button>
          <button
            type="button"
            onClick={() => setPaceFilter('ontime')}
            className={`px-3 py-1 rounded-xl font-bold transition-all flex items-center gap-1 ${
              paceFilter === 'ontime'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            <span>정시/세이브</span>
          </button>
          <button
            type="button"
            onClick={() => setPaceFilter('overtime')}
            className={`px-3 py-1 rounded-xl font-bold transition-all flex items-center gap-1 ${
              paceFilter === 'overtime'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400'
            }`}
          >
            <span>시간 초과</span>
          </button>
        </div>

        {/* 정렬 셀렉트 */}
        <div className="flex items-center gap-2 text-xs">
          <label className="text-zinc-500 dark:text-zinc-400 font-bold">정렬:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          >
            <option value="latest">최신 응시순</option>
            <option value="oldest">과거 회차순</option>
            <option value="fastest">시간 절약순 (세이브 순)</option>
            <option value="slowest">시간 초과순 (지연 큰 순)</option>
          </select>
        </div>
      </div>

      {/* 4. 리포트 카드 리스트 렌더링 */}
      {filteredAndSortedReports.length === 0 ? (
        <div className="glass-card bg-white/70 dark:bg-zinc-900/70 p-12 rounded-3xl border border-white/60 dark:border-zinc-800 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
            <Icon name="clock" className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-zinc-800 dark:text-zinc-200">
              {activeSubject === 'all'
                ? '아직 저장된 모의고사 리포트가 없습니다'
                : `${SUBJECT_META[activeSubject]?.name || activeSubject} 영역의 응시 기록이 없습니다`}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
              Exam Pacer에서 수능 타이머를 작동시켜 모의고사를 완주하면 각 파트별 초 단위 소요 시간과 오차, 실전 복기 메모가 이곳에 자동으로 기록됩니다.
            </p>
          </div>
          {setPacerSubView && (
            <button
              type="button"
              onClick={() => {
                if (onSelectSubject && activeSubject !== 'all') {
                  onSelectSubject(activeSubject);
                }
                setPacerSubView('timer');
              }}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-indigo-600/30 transition-all"
            >
              <Icon name="play" className="w-4 h-4 fill-white" />
              <span>
                {activeSubject !== 'all'
                  ? `${SUBJECT_META[activeSubject]?.name || activeSubject} 모의고사 시작하기`
                  : '실전 모의고사 시작하기'}
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedReports.map((session, index) => {
            const isExpanded = expandedIds.has(session.id);
            const delta = session.totalDeltaSec !== undefined
              ? session.totalDeltaSec
              : (session.totalElapsed || 0) - (session.totalTargetSec || 0);
            const isOvertime = delta > 0;
            const partsList = session.parts || session.partsResult || [];
            const subStyle = subjectStyles[session.subject] || {
              label: session.subjectName || session.subject || '과목',
              badge: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20'
            };

            return (
              <div
                key={session.id || index}
                className="glass-card bg-white/80 dark:bg-zinc-900/80 rounded-3xl border border-white/60 dark:border-zinc-800 shadow-glass dark:shadow-glass-dark overflow-hidden transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                {/* 카드 메인 헤더 & 요약 행 */}
                <div
                  onClick={() => toggleExpand(session.id)}
                  className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono font-black text-sm shrink-0">
                      #{session.round || filteredAndSortedReports.length - index}회
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-lg border ${subStyle.badge}`}>
                          {subStyle.label}
                        </span>
                        <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white">
                          {session.presetName || '표준 전략'}
                        </h4>
                        <span className="text-[11px] text-zinc-400 font-mono">
                          {session.date || '응시 완료'}
                        </span>
                      </div>

                      {/* 간단 복기 메모 미리보기 (있는 경우) */}
                      {session.memo && (
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-1 italic">
                          "{session.memo}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 우측 수치 & 오차 뱃지 & 토글 버튼 */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                    <div className="text-right">
                      <div className="font-mono text-sm sm:text-base font-black text-zinc-900 dark:text-white">
                        {formatTime(session.totalElapsed || 0)}
                        <span className="text-xs font-normal text-zinc-400 ml-1">
                          / {formatTime(session.totalTargetSec || (session.totalMinutes ? session.totalMinutes * 60 : 0))}
                        </span>
                      </div>
                      <div className="mt-0.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-black border ${
                          isOvertime
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        }`}>
                          {isOvertime ? (
                            <>
                              <Icon name="alertCircle" className="w-3 h-3" />
                              <span>+{formatTime(delta)} 지연</span>
                            </>
                          ) : (
                            <>
                              <Icon name="checkCircle2" className="w-3 h-3" />
                              <span>-{formatTime(Math.abs(delta))} 세이브</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="p-1 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                      <Icon
                        name={isExpanded ? 'chevronUp' : 'chevronDown'}
                        className="w-5 h-5 transition-transform duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* 아코디언 상세 뷰 (확장 시 렌더링) */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-5 bg-zinc-50/40 dark:bg-zinc-850/40 animate-fadeIn">
                    {/* 1. 파트별 소요시간 프로그레스 바 및 표 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-extrabold text-zinc-700 dark:text-zinc-300">
                        <span>구간 파이프라인별 소요시간 분석</span>
                        <span className="text-[11px] text-zinc-400 font-normal">
                          목표 시간 대비 실제 진행 비율
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {partsList.map((part, pIdx) => {
                          const actual = part.actualSec || part.actualSeconds || 0;
                          const target = part.targetSec || (part.targetMinutes ? part.targetMinutes * 60 : 0);
                          const partDelta = part.deltaSec !== undefined
                            ? part.deltaSec
                            : (part.delta !== undefined ? part.delta : actual - target);
                          const isPartOver = partDelta > 0;
                          const ratio = target > 0 ? Math.round((actual / target) * 100) : 100;

                          return (
                            <div
                              key={pIdx}
                              className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-xs text-zinc-900 dark:text-white truncate">
                                  {pIdx + 1}. {part.name}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                  isPartOver
                                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                }`}>
                                  {isPartOver
                                    ? `+${formatTime(partDelta)} 초과`
                                    : `-${formatTime(Math.abs(partDelta))} 여유`}
                                </span>
                              </div>

                              {/* 프로그레스 바 */}
                              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    isPartOver
                                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                                      : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                  }`}
                                  style={{ width: `${Math.min(100, (actual / (target || actual || 1)) * 100)}%` }}
                                />
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                                <span>실제: <strong className="text-zinc-800 dark:text-zinc-200">{formatTime(actual)}</strong></span>
                                <span>목표: {formatTime(target)} ({ratio}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. 복기 메모 (인라인 편집) */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-zinc-700 dark:text-zinc-300">
                          <Icon name="messageSquare" className="w-3.5 h-3.5 text-indigo-500" />
                          <span>실전 복기 메모 & 오답 행동 요령</span>
                        </div>

                        {editingMemoId !== session.id && (
                          <button
                            type="button"
                            onClick={() => startEditingMemo(session)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                          >
                            <Icon name="edit3" className="w-3 h-3" />
                            <span>{session.memo ? '메모 수정' : '메모 작성'}</span>
                          </button>
                        )}
                      </div>

                      {editingMemoId === session.id ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={3}
                            value={memoDraft}
                            onChange={(e) => setMemoDraft(e.target.value)}
                            placeholder="예: 독서 과학 지문에서 5분 지연됨. 다음엔 문학을 18분 안에 먼저 끝내고 넘어갈 것."
                            className="w-full p-3 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingMemoId(null)}
                              className="px-3 py-1.5 text-xs font-bold rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              onClick={() => saveMemo(session.id)}
                              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                            >
                              저장하기
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl min-h-[44px] flex items-center">
                          {session.memo ? (
                            <p className="whitespace-pre-wrap">{session.memo}</p>
                          ) : (
                            <span className="text-zinc-400 italic">
                              아직 작성된 복기 메모가 없습니다. [메모 작성] 버튼을 눌러 피드백을 기록하세요.
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 3. 카드 하단 액션 버튼 */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('이 회차 모의고사 기록을 삭제하시겠습니까?')) {
                            if (handleDeleteExamHistory) {
                              handleDeleteExamHistory(session.id);
                            }
                          }
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <Icon name="trash2" className="w-3.5 h-3.5" />
                        <span>회차 기록 삭제</span>
                      </button>

                      {setPacerSubView && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectSubject && session.subject) {
                              onSelectSubject(session.subject);
                            }
                            setPacerSubView('timer');
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition-colors"
                        >
                          <Icon name="rotateCcw" className="w-3.5 h-3.5" />
                          <span>이 전략으로 다시 응시하기</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubjectReportList;
