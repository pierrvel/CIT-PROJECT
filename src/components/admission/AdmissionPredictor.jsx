import React, { useState, useMemo } from 'react';
import Icon from '../common/Icon';
import {
  ADMISSION_TIERS,
  UNIVERSITY_CUTOFFS,
  TRACK_OPTIONS
} from '../../constants/universities';
import {
  calculateOverallAdmission,
  evaluateUniversityAdmission,
  calculateGapForTarget
} from '../../utils/admissionCalculator';
import { HISTORICAL_EXAMS } from '../../constants/cutoffs';

export const AdmissionPredictor = ({
  scoreHistory = [],
  showToast,
  onGoToSprint,
  onOpenShareCard,
  isTextMinimal = true,
  toggleTextMinimal
}) => {
  // 1. 선택 상태
  const [selectedExamId, setSelectedExamId] = useState('2025_csat');
  const [selectedTrack, setSelectedTrack] = useState('all'); // 'all' | 'natural' | 'humanities' | 'med'
  const [searchQuery, setSearchQuery] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('all'); // 'all' | 'safe' | 'appropriate' | 'aggressive'

  // 2. 전과목 원점수 및 선택과목 상태
  const [korean, setKorean] = useState({ raw: 92, option: 'speech' });
  const [math, setMath] = useState({ raw: 84, option: 'calculus' });
  const [english, setEnglish] = useState({ raw: 90 });
  const [history, setHistory] = useState({ raw: 40 });
  const [inquiry1, setInquiry1] = useState({ raw: 45, name: '탐구 1' });
  const [inquiry2, setInquiry2] = useState({ raw: 44, name: '탐구 2' });

  // 3. 목표 대학 선택 상태
  const [selectedTargetUnivId, setSelectedTargetUnivId] = useState('yonsei_biz');

  // 4. 영역별 접기/펼치기 상태 관리 (localStorage 영구 보존)
  const [isScoreInputCollapsed, setIsScoreInputCollapsed] = useState(() => {
    const saved = localStorage.getItem('dc_fold_admission_scores');
    if (saved !== null) return saved === 'true';
    return isTextMinimal; // 텍스트 다이어트 모드일 때 기본 접힌 상태로 쾌적하게 시작
  });

  const [isTargetCollapsed, setIsTargetCollapsed] = useState(() => {
    const saved = localStorage.getItem('dc_fold_admission_target');
    return saved === 'true';
  });

  const [isLadderCollapsed, setIsLadderCollapsed] = useState(() => {
    const saved = localStorage.getItem('dc_fold_admission_ladder');
    return saved === 'true';
  });

  const [ladderFocusOnly, setLadderFocusOnly] = useState(() => {
    const saved = localStorage.getItem('dc_ladder_focus_only');
    if (saved !== null) return saved === 'true';
    return true; // 기본값: 내 라인(±1)에 집중하여 무한 스크롤 방지
  });

  const toggleScoreInputCollapse = () => {
    setIsScoreInputCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('dc_fold_admission_scores', String(next));
      return next;
    });
  };

  const toggleTargetCollapse = () => {
    setIsTargetCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('dc_fold_admission_target', String(next));
      return next;
    });
  };

  const toggleLadderCollapse = () => {
    setIsLadderCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('dc_fold_admission_ladder', String(next));
      return next;
    });
  };

  const toggleLadderFocus = () => {
    setLadderFocusOnly((prev) => {
      const next = !prev;
      localStorage.setItem('dc_ladder_focus_only', String(next));
      return next;
    });
  };

  // 5. 종합 성적 및 정시 지표 계산
  const overallStats = useMemo(() => {
    return calculateOverallAdmission({
      examId: selectedExamId,
      korean,
      math,
      english,
      history,
      inquiry1,
      inquiry2
    });
  }, [selectedExamId, korean, math, english, history, inquiry1, inquiry2]);

  // 6. 목표 대학 역산 분석
  const targetUniv = useMemo(() => {
    return UNIVERSITY_CUTOFFS.find((u) => u.id === selectedTargetUnivId) || UNIVERSITY_CUTOFFS[0];
  }, [selectedTargetUnivId]);

  const targetAnalysis = useMemo(() => {
    return calculateGapForTarget(targetUniv, overallStats);
  }, [targetUniv, overallStats]);

  // 7. 사다리 타워에 표시할 티어 목록 (내 라인 집중 vs 전체 7대 라인)
  const visibleTiers = useMemo(() => {
    if (!ladderFocusOnly) return ADMISSION_TIERS;
    const currentTierIndex = ADMISSION_TIERS.findIndex((t) => t.id === overallStats.matchedTier.id);
    const safeIdx = currentTierIndex === -1 ? 2 : currentTierIndex;
    return ADMISSION_TIERS.filter((_, idx) => {
      return idx >= Math.max(0, safeIdx - 1) && idx <= Math.min(ADMISSION_TIERS.length - 1, safeIdx + 1);
    });
  }, [ladderFocusOnly, overallStats.matchedTier.id]);

  // 8. 대학 리스트 필터링 및 평가 매핑
  const evaluatedUniversities = useMemo(() => {
    return UNIVERSITY_CUTOFFS.map((univ) => {
      const evalResult = evaluateUniversityAdmission(univ, overallStats);
      return {
        ...univ,
        ...evalResult
      };
    }).filter((item) => {
      // 계열 필터
      if (selectedTrack !== 'all' && item.track !== selectedTrack) {
        return false;
      }
      // 판정 필터
      if (verdictFilter !== 'all' && item.verdict !== verdictFilter) {
        return false;
      }
      // 검색어 필터
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.univ.toLowerCase().includes(q);
        const matchesMajor = item.major.toLowerCase().includes(q);
        const matchesBadge = item.badge && item.badge.toLowerCase().includes(q);
        return matchesName || matchesMajor || matchesBadge;
      }
      return true;
    });
  }, [overallStats, selectedTrack, verdictFilter, searchQuery]);

  // 9. 내 최근 채점 기록 불러오기 핸들러
  const handleLoadFromHistory = () => {
    if (!scoreHistory || scoreHistory.length === 0) {
      if (showToast) showToast('저장된 최근 채점 기록이 없습니다. 직접 점수를 입력해보세요!', 'info');
      return;
    }

    let loadedCount = 0;
    // 과목별 가장 최근 기록 찾기
    const latestKor = scoreHistory.find((r) => r.subjectKey === 'korean');
    const latestMath = scoreHistory.find((r) => r.subjectKey === 'math');
    const latestEng = scoreHistory.find((r) => r.subjectKey === 'english');
    const latestHist = scoreHistory.find((r) => r.subjectKey === 'history');
    const inqRecords = scoreHistory.filter((r) => r.subjectKey === 'inquiry' || r.subjectKey === 'society' || r.subjectKey === 'science');

    if (latestKor) {
      setKorean({ raw: latestKor.score, option: latestKor.optionKey || 'speech' });
      loadedCount++;
    }
    if (latestMath) {
      setMath({ raw: latestMath.score, option: latestMath.optionKey || 'calculus' });
      loadedCount++;
    }
    if (latestEng) {
      setEnglish({ raw: latestEng.score });
      loadedCount++;
    }
    if (latestHist) {
      setHistory({ raw: latestHist.score });
      loadedCount++;
    }
    if (inqRecords.length > 0) {
      setInquiry1({ raw: inqRecords[0].score, name: inqRecords[0].optionName || '탐구1' });
      loadedCount++;
      if (inqRecords.length > 1) {
        setInquiry2({ raw: inqRecords[1].score, name: inqRecords[1].optionName || '탐구2' });
        loadedCount++;
      }
    }

    if (showToast) {
      showToast(`최근 채점 기록에서 ${loadedCount}개 과목 점수를 성공적으로 불러왔습니다!`, 'success');
    }
  };

  // 1등급 컷으로 채우기 핸들러
  const handleFillGrade1Cuts = () => {
    setKorean({ raw: 92, option: 'speech' });
    setMath({ raw: 84, option: 'calculus' });
    setEnglish({ raw: 90 });
    setHistory({ raw: 40 });
    setInquiry1({ raw: 46, name: '탐구1' });
    setInquiry2({ raw: 45, name: '탐구2' });
    if (showToast) showToast('모든 과목이 주요 1등급 컷 점수로 설정되었습니다.', 'info');
  };

  // 목표 대학을 Sprint 플래너로 전달
  const handleConnectToSprint = () => {
    if (!targetAnalysis || targetAnalysis.isAchieved) {
      if (showToast) showToast('이미 달성한 목표입니다! 더 높은 목표를 설정해보세요.', 'info');
      return;
    }
    if (onGoToSprint) {
      onGoToSprint({
        title: `[${targetUniv.univ} ${targetUniv.major}] 합격선 돌파 (+${targetAnalysis.estimatedNeededRaw}점 확보)`,
        unit: '문제',
        totalAmount: 100,
        dailyCap: 15
      });
    } else if (showToast) {
      showToast(`[${targetUniv.univ} ${targetUniv.major}] 역산 목표가 복사되었습니다. Sprint 탭에서 실천해보세요!`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. 상단 안내 헤더 & 툴바 */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Icon name="award" className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                  정시 모의배치 & 대학 라인 판정기
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                    ADIGA 70% CUT DB
                  </span>
                </h2>
                {!isTextMinimal ? (
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
                    대교협 대입정보포털 <b>'어디가' 최종 등록자 공식 70% 컷</b> 및 대형 입시기관 정시 확정 배치표 기반 실시간 매칭
                  </p>
                ) : (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">
                    대교협 70% 컷 & 대형 입시기관 정시 배치표 기반 실시간 매칭
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 퀵 액션 버튼들 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 텍스트 다이어트 비교 토글 버튼 */}
            {toggleTextMinimal && (
              <button
                type="button"
                onClick={toggleTextMinimal}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                  isTextMinimal
                    ? 'bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 shadow-xs'
                    : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
                title="설명문을 숨기고 화면을 콤팩트하게 접는 텍스트 다이어트 모드"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isTextMinimal ? '👀 텍스트 다이어트: ON' : '📖 텍스트 다이어트: OFF'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleLoadFromHistory}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Icon name="cloud" className="w-4 h-4" />
              <span>최근 채점 불러오기</span>
            </button>
            <button
              type="button"
              onClick={handleFillGrade1Cuts}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all"
            >
              <Icon name="zap" className="w-4 h-4 text-amber-500" />
              <span>1컷 기준 채우기</span>
            </button>
            {onOpenShareCard && (
              <button
                type="button"
                onClick={() => {
                  const currentExam = HISTORICAL_EXAMS.find((e) => e.id === selectedExamId);
                  onOpenShareCard({
                    mode: 'overall',
                    overallData: {
                      examName: currentExam ? currentExam.name : '2025학년도 대학수학능력시험 종합 성적표',
                      avgPercentile: overallStats.avgPercentile,
                      totalStdScore: overallStats.totalStdScore,
                      cumulativePercent: overallStats.cumulativePercent,
                      estimatedRank: overallStats.estimatedRank,
                      tierName: overallStats.matchedTier.name.split(' ')[0] || 'DIAMOND',
                      tierRange: overallStats.matchedTier.range,
                      subjects: [
                        { name: '국어', score: overallStats.korData.rawScore, grade: overallStats.korData.grade, option: overallStats.korData.optName || '화작', percentile: overallStats.korData.percentile },
                        { name: '수학', score: overallStats.mathData.rawScore, grade: overallStats.mathData.grade, option: overallStats.mathData.optName || '미적', percentile: overallStats.mathData.percentile },
                        { name: '영어', score: overallStats.engData.rawScore, grade: overallStats.engData.grade, option: '절대', percentile: overallStats.engData.percentile },
                        { name: '한국사', score: overallStats.histData.rawScore, grade: overallStats.histData.grade, option: '절대', percentile: overallStats.histData.percentile },
                        { name: '탐구1', score: overallStats.inq1Data.rawScore, grade: overallStats.inq1Data.grade, option: inquiry1.name || '탐구1', percentile: overallStats.inq1Data.percentile },
                        { name: '탐구2', score: overallStats.inq2Data.rawScore, grade: overallStats.inq2Data.grade, option: inquiry2.name || '탐구2', percentile: overallStats.inq2Data.percentile }
                      ]
                    }
                  });
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md shadow-purple-600/25 transition-all active:scale-95"
              >
                <Icon name="award" className="w-4 h-4" />
                <span>성적표 카드</span>
              </button>
            )}
          </div>
        </div>

        {/* 기준 회차 선택 드롭다운 & 계열 탭 */}
        <div className="mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">기준 시험 회차:</span>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {HISTORICAL_EXAMS.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          {/* 계열 필터 탭 */}
          <div className="inline-flex p-1 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-xl border border-zinc-300/40 dark:border-zinc-700/40">
            {TRACK_OPTIONS.map((track) => (
              <button
                key={track.key}
                type="button"
                onClick={() => setSelectedTrack(track.key)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedTrack === track.key
                    ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {track.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 한국교육과정평가원 수능 종합 성적 통지표 카드 (접기/펼치기 지원) */}
      <div className="glass-card p-5 sm:p-7 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white tracking-tight">
              {isTextMinimal ? '수능 종합 성적 통지표' : '실채점 종합 성적 통지표 시뮬레이터'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {!isTextMinimal && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono hidden md:inline">
                슬라이더를 조절하여 원점수 변화에 따른 대학 라인을 실시간으로 확인하세요
              </span>
            )}
            {/* 성적 슬라이더 접기 / 펼치기 토글 버튼 */}
            <button
              type="button"
              onClick={toggleScoreInputCollapse}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
            >
              <Icon name={isScoreInputCollapsed ? "chevronDown" : "chevronUp"} className="w-4 h-4" />
              <span>{isScoreInputCollapsed ? '원점수 슬라이더 펼치기' : '슬라이더 접기'}</span>
            </button>
          </div>
        </div>

        {/* ── [A] 슬라이더 접힌 상태: 슬림 가로형 성적 요약 바 ── */}
        {isScoreInputCollapsed && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-50/90 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-zinc-500 dark:text-zinc-400 mr-1">입력 점수:</span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 shadow-2xs">
                <span>국어</span>
                <b className="text-indigo-600 dark:text-indigo-400">{korean.raw}점</b>
                <span className="text-[11px] text-zinc-400">({overallStats.korData.grade}등급·{korean.option === 'speech' ? '화작' : '언매'})</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 shadow-2xs">
                <span>수학</span>
                <b className="text-blue-600 dark:text-blue-400">{math.raw}점</b>
                <span className="text-[11px] text-zinc-400">({overallStats.mathData.grade}등급·{math.option === 'calculus' ? '미적' : math.option === 'prob' ? '확통' : '기하'})</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 shadow-2xs">
                <span>영어</span>
                <b className="text-emerald-600 dark:text-emerald-400">{english.raw}점</b>
                <span className="text-[11px] text-zinc-400">({overallStats.engData.grade}등급)</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 shadow-2xs">
                <span>한국사</span>
                <b className="text-amber-600 dark:text-amber-400">{history.raw}점</b>
                <span className="text-[11px] text-zinc-400">({overallStats.histData.grade}등급)</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 shadow-2xs">
                <span>{inquiry1.name || '탐구1'}</span>
                <b className="text-purple-600 dark:text-purple-400">{inquiry1.raw}점</b>
                <span className="text-[11px] text-zinc-400">({overallStats.inq1Data.grade}등급)</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 shadow-2xs">
                <span>{inquiry2.name || '탐구2'}</span>
                <b className="text-rose-600 dark:text-rose-400">{inquiry2.raw}점</b>
                <span className="text-[11px] text-zinc-400">({overallStats.inq2Data.grade}등급)</span>
              </span>
            </div>

            <button
              type="button"
              onClick={toggleScoreInputCollapse}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/50 transition-all shrink-0 active:scale-95"
            >
              <Icon name="sliders" className="w-3.5 h-3.5" />
              <span>원점수 수정하기</span>
            </button>
          </div>
        )}

        {/* ── [B] 슬라이더 펼쳐진 상태: 과목별 원점수 조절 그리드 ── */}
        {!isScoreInputCollapsed && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {/* 국어 */}
            <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-700 dark:text-zinc-300">1교시 국어</span>
                <div className="flex items-center gap-1.5">
                  <select
                    value={korean.option}
                    onChange={(e) => setKorean((prev) => ({ ...prev, option: e.target.value }))}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="speech">화법과 작문</option>
                    <option value="lang">언어와 매체</option>
                  </select>
                  <span className="text-xs px-2 py-0.5 rounded-md font-mono font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {overallStats.korData.grade}등급
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={korean.raw}
                  onChange={(e) => setKorean((prev) => ({ ...prev, raw: Number(e.target.value) }))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={korean.raw}
                    onChange={(e) => setKorean((prev) => ({ ...prev, raw: Math.max(0, Math.min(100, Number(e.target.value) || 0)) }))}
                    className="w-14 px-2 py-1 text-center font-mono font-black text-sm rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                  <span className="text-xs text-zinc-400 font-bold">점</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-200/40 dark:border-zinc-700/40">
                <span>표준점수 <b>{overallStats.korData.standardScore}점</b></span>
                <span>백분위 <b>{overallStats.korData.percentile}%</b></span>
              </div>
            </div>

            {/* 수학 */}
            <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-700 dark:text-zinc-300">2교시 수학</span>
                <div className="flex items-center gap-1.5">
                  <select
                    value={math.option}
                    onChange={(e) => setMath((prev) => ({ ...prev, option: e.target.value }))}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="calculus">미적분</option>
                    <option value="prob">확률과 통계</option>
                    <option value="geometry">기하</option>
                  </select>
                  <span className="text-xs px-2 py-0.5 rounded-md font-mono font-black bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {overallStats.mathData.grade}등급
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={math.raw}
                  onChange={(e) => setMath((prev) => ({ ...prev, raw: Number(e.target.value) }))}
                  className="w-full accent-blue-600"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={math.raw}
                    onChange={(e) => setMath((prev) => ({ ...prev, raw: Math.max(0, Math.min(100, Number(e.target.value) || 0)) }))}
                    className="w-14 px-2 py-1 text-center font-mono font-black text-sm rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                  <span className="text-xs text-zinc-400 font-bold">점</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-200/40 dark:border-zinc-700/40">
                <span>표준점수 <b>{overallStats.mathData.standardScore}점</b></span>
                <span>백분위 <b>{overallStats.mathData.percentile}%</b></span>
              </div>
            </div>

            {/* 영어 (절대평가) */}
            <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-700 dark:text-zinc-300">3교시 영어 (절대평가)</span>
                <span className="text-xs px-2 py-0.5 rounded-md font-mono font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {overallStats.engData.grade}등급
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={english.raw}
                  onChange={(e) => setEnglish({ raw: Number(e.target.value) })}
                  className="w-full accent-emerald-600"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={english.raw}
                    onChange={(e) => setEnglish({ raw: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                    className="w-14 px-2 py-1 text-center font-mono font-black text-sm rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                  <span className="text-xs text-zinc-400 font-bold">점</span>
                </div>
              </div>
              {!isTextMinimal && (
                <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-200/40 dark:border-zinc-700/40">
                  <span>90점 이상 1등급</span>
                  <span>80점 이상 2등급</span>
                </div>
              )}
            </div>

            {/* 한국사 (절대평가) */}
            <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-700 dark:text-zinc-300">4교시 한국사 (절대평가)</span>
                <span className="text-xs px-2 py-0.5 rounded-md font-mono font-black bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {overallStats.histData.grade}등급
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={history.raw}
                  onChange={(e) => setHistory({ raw: Number(e.target.value) })}
                  className="w-full accent-amber-600"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={history.raw}
                    onChange={(e) => setHistory({ raw: Math.max(0, Math.min(50, Number(e.target.value) || 0)) })}
                    className="w-14 px-2 py-1 text-center font-mono font-black text-sm rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                  <span className="text-xs text-zinc-400 font-bold">점</span>
                </div>
              </div>
              {!isTextMinimal && (
                <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-200/40 dark:border-zinc-700/40">
                  <span>40점 이상 1등급 만점</span>
                  <span>대부분 대학 1~4등급 감점 없음</span>
                </div>
              )}
            </div>

            {/* 탐구 1 */}
            <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-700 dark:text-zinc-300">탐구 1과목 (50점)</span>
                <span className="text-xs px-2 py-0.5 rounded-md font-mono font-black bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {overallStats.inq1Data.grade}등급
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={inquiry1.raw}
                  onChange={(e) => setInquiry1((prev) => ({ ...prev, raw: Number(e.target.value) }))}
                  className="w-full accent-purple-600"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={inquiry1.raw}
                    onChange={(e) => setInquiry1((prev) => ({ ...prev, raw: Math.max(0, Math.min(50, Number(e.target.value) || 0)) }))}
                    className="w-14 px-2 py-1 text-center font-mono font-black text-sm rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                  <span className="text-xs text-zinc-400 font-bold">점</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-200/40 dark:border-zinc-700/40">
                <span>표준점수 <b>{overallStats.inq1Data.standardScore}점</b></span>
                <span>백분위 <b>{overallStats.inq1Data.percentile}%</b></span>
              </div>
            </div>

            {/* 탐구 2 */}
            <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-700 dark:text-zinc-300">탐구 2과목 (50점)</span>
                <span className="text-xs px-2 py-0.5 rounded-md font-mono font-black bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  {overallStats.inq2Data.grade}등급
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={inquiry2.raw}
                  onChange={(e) => setInquiry2((prev) => ({ ...prev, raw: Number(e.target.value) }))}
                  className="w-full accent-rose-600"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={inquiry2.raw}
                    onChange={(e) => setInquiry2((prev) => ({ ...prev, raw: Math.max(0, Math.min(50, Number(e.target.value) || 0)) }))}
                    className="w-14 px-2 py-1 text-center font-mono font-black text-sm rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                  <span className="text-xs text-zinc-400 font-bold">점</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-200/40 dark:border-zinc-700/40">
                <span>표준점수 <b>{overallStats.inq2Data.standardScore}점</b></span>
                <span>백분위 <b>{overallStats.inq2Data.percentile}%</b></span>
              </div>
            </div>
          </div>
        )}

        {/* 종합 산출 4대 지표 요약 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {/* 1. 국수탐 백분위 평균 */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/40">
            <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400">국수탐 백분위 평균</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-900 dark:text-white">
                {overallStats.avgPercentile}
              </span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">%</span>
            </div>
            {!isTextMinimal && (
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">상위권 정시 모의지원 척도</p>
            )}
          </div>

          {/* 2. 국수탐 표준점수 합 */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/40">
            <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400">국수탐 표준점수 합</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-900 dark:text-white">
                {overallStats.totalStdScore}
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">점</span>
            </div>
            {!isTextMinimal && (
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">만점 약 420점 내외 기준</p>
            )}
          </div>

          {/* 3. 전국 상위 누적 백분위 */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40">
            <span className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400">전국 상위 누적 (누백)</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-900 dark:text-white">
                {overallStats.cumulativePercent}
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">%</span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              전국 약 <b>{overallStats.estimatedRank.toLocaleString()}등</b> 내외
            </p>
          </div>

          {/* 4. 판정 티어 */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40">
            <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">현재 합격 가능 티어</span>
            <div className="mt-1">
              <span className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                {overallStats.matchedTier.shortName}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
              {overallStats.matchedTier.range}
            </p>
          </div>
        </div>
      </div>

      {/* 3. 🎯 목표 대학 역산 시뮬레이터 (접기/펼치기 지원) */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-blue-900/10 border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Icon name="target" className="w-5 h-5" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white tracking-tight">
              {isTextMinimal ? '목표 대학 역산' : '목표 대학 역산(Reverse) 가이드라인'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 shrink-0">목표 대학:</span>
            <select
              value={selectedTargetUnivId}
              onChange={(e) => setSelectedTargetUnivId(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[200px] sm:max-w-none truncate"
            >
              {UNIVERSITY_CUTOFFS.map((u) => (
                <option key={u.id} value={u.id}>
                  [{u.univ}] {u.major} ({u.track === 'natural' ? '자연' : u.track === 'humanities' ? '인문' : '의약학'}) - 70%컷 {u.cutPercentile}%
                </option>
              ))}
            </select>
            {/* 역산 가이드 접기/펼치기 토글 */}
            <button
              type="button"
              onClick={toggleTargetCollapse}
              className="p-1.5 rounded-xl bg-white/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border border-indigo-500/30 hover:bg-white dark:hover:bg-zinc-800 transition-all shrink-0"
              title={isTargetCollapsed ? "목표 대학 역산 상세 펼치기" : "목표 대학 역산 접기"}
            >
              <Icon name={isTargetCollapsed ? "chevronDown" : "chevronUp"} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── [A] 역산 가이드 접힌 상태: 슬림 1줄 요약 바 ── */}
        {isTargetCollapsed ? (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/80 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-zinc-900 dark:text-white">
                {targetUniv.univ} {targetUniv.major}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                합격선 {targetUniv.cutPercentile}%
              </span>

              {targetAnalysis && targetAnalysis.isAchieved ? (
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Icon name="check" className="w-3.5 h-3.5" />
                  <span>합격 안정권</span>
                </span>
              ) : (
                <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                  격차: <b>{targetAnalysis?.gapPercentile}%p</b> (원점수 약 <b>{targetAnalysis?.estimatedNeededRaw}점</b> 부족)
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTargetCollapse}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>상세 분석 펼치기</span>
              <Icon name="chevronDown" className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* ── [B] 역산 가이드 펼쳐진 상태: 상세 분석 및 솔루션 ── */
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/80 border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-zinc-900 dark:text-white">
                  {targetUniv.univ} {targetUniv.major}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                  합격선 백분위 {targetUniv.cutPercentile}% (상위 {targetUniv.cumPercent}%)
                </span>
              </div>

              {targetAnalysis && targetAnalysis.isAchieved ? (
                <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Icon name="check" className="w-4 h-4" />
                  <span>{targetAnalysis.message}</span>
                </p>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-black text-rose-600 dark:text-rose-400">
                    합격선까지 백분위 <b>{targetAnalysis?.gapPercentile}%p</b>, 대략 원점수 <b>약 {targetAnalysis?.estimatedNeededRaw}점</b> 부족합니다.
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                    💡 <b>솔루션:</b> {targetAnalysis?.advice}
                  </p>
                </div>
              )}
            </div>

            {targetAnalysis && !targetAnalysis.isAchieved && (
              <button
                type="button"
                onClick={handleConnectToSprint}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Icon name="target" className="w-4 h-4" />
                <span>Sprint 목표로 연계하기</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4. 인터랙티브 7대 대학 티어 타워 (내 라인 집중 vs 전체 / 접기 지원) */}
      <div className="glass-card p-5 sm:p-7 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Icon name="trendingUp" className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                전국 대학 라인 사다리 타워
                {ladderFocusOnly && !isLadderCollapsed && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    내 지원권 집중 (3개 티어)
                  </span>
                )}
              </h3>
              {!isTextMinimal && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  📍 표시가 현재 내 점수 구간입니다
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 내 라인 집중(±1) vs 전체 7대 티어 토글 */}
            {!isLadderCollapsed && (
              <button
                type="button"
                onClick={toggleLadderFocus}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  ladderFocusOnly
                    ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 shadow-xs'
                    : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
                title="내 성적에 인접한 상향/적정/안정 3개 티어만 집중해서 봅니다"
              >
                {ladderFocusOnly ? '📍 내 라인(±1)만 보는 중' : '7대 티어 전체 보는 중'}
              </button>
            )}

            {/* 사다리 타워 접기 / 펼치기 */}
            <button
              type="button"
              onClick={toggleLadderCollapse}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-all shrink-0"
            >
              <Icon name={isLadderCollapsed ? "chevronDown" : "chevronUp"} className="w-4 h-4" />
              <span>{isLadderCollapsed ? '사다리 타워 펼치기' : '타워 접기'}</span>
            </button>
          </div>
        </div>

        {/* ── [A] 타워 접힌 상태: 슬림 1줄 요약 바 ── */}
        {isLadderCollapsed ? (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <span className={`text-xs px-2.5 py-1 rounded-xl font-black font-mono border ${overallStats.matchedTier.badgeBg}`}>
                {overallStats.matchedTier.name}
              </span>
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                현재 내 합격 가능 라인: <b>{overallStats.matchedTier.shortName}</b> ({overallStats.matchedTier.range})
              </span>
            </div>
            <button
              type="button"
              onClick={toggleLadderCollapse}
              className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>사다리 타워 펼치기</span>
              <Icon name="chevronDown" className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* ── [B] 타워 펼쳐진 상태: 티어 수직 타워 (내 라인 집중 또는 전체) ── */
          <div className="space-y-3 animate-fade-in">
            {visibleTiers.map((tier) => {
              const isCurrentTier = overallStats.matchedTier.id === tier.id;
              return (
                <div
                  key={tier.id}
                  className={`relative p-4 rounded-2xl border transition-all ${
                    isCurrentTier
                      ? `bg-gradient-to-r ${tier.color} shadow-lg scale-[1.01] ring-2 ring-indigo-500/50`
                      : 'bg-zinc-50/60 dark:bg-zinc-800/30 border-zinc-200/60 dark:border-zinc-800/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-xl font-black font-mono border ${tier.badgeBg}`}>
                        {tier.name}
                      </span>
                      <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-bold">
                        {tier.range}
                      </span>
                    </div>

                    {isCurrentTier && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black shadow-md animate-pulse">
                        <span>📍 현재 나의 라인</span>
                        <span className="font-mono">({overallStats.avgPercentile}%)</span>
                      </div>
                    )}
                  </div>

                  {/* 해당 티어에 속한 대표 대학 학과 뱃지들 */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {UNIVERSITY_CUTOFFS.filter((u) => u.tier === tier.id).slice(0, 7).map((u) => (
                      <span
                        key={u.id}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-white/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 font-medium"
                      >
                        {u.univ} {u.major}
                      </span>
                    ))}
                    {UNIVERSITY_CUTOFFS.filter((u) => u.tier === tier.id).length > 7 && (
                      <span className="text-[11px] px-2 py-0.5 text-zinc-400 dark:text-zinc-500 font-bold">
                        +{UNIVERSITY_CUTOFFS.filter((u) => u.tier === tier.id).length - 7}개 더보기
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* 내 라인 집중 모드일 때 전체 7대 티어 펼치기 유도 버튼 */}
            {ladderFocusOnly && visibleTiers.length < ADMISSION_TIERS.length && (
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setLadderFocusOnly(false);
                    localStorage.setItem('dc_ladder_focus_only', 'false');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
                >
                  <Icon name="layers" className="w-3.5 h-3.5" />
                  <span>전체 7대 티어 사다리 모두 보기 (+{ADMISSION_TIERS.length - visibleTiers.length}개 티어)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. 상세 모의지원 대학 리스트 (University Admission Table) */}
      <div className="glass-card p-5 sm:p-7 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div>
            <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              학과별 상세 모의지원 판정 테이블
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                총 {evaluatedUniversities.length}개 학과
              </span>
            </h3>
            {!isTextMinimal && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                내 백분위 평균과 대학별 70% 컷을 대조하여 합격 유력도를 4단계로 분류합니다
              </p>
            )}
          </div>

          {/* 검색창 및 판정 필터 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Icon name="target" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="대학명, 학과명 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">전체 판정</option>
              <option value="safe">🟢 안정권만</option>
              <option value="appropriate">🟡 적정권만</option>
              <option value="aggressive">🟠 상향권만</option>
              <option value="challenge">🟣 도전권만</option>
            </select>
          </div>
        </div>

        {/* 테이블 목록 */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-bold font-mono">
              <tr>
                <th className="py-3 px-4">대학명</th>
                <th className="py-3 px-4">모집단위 (학과)</th>
                <th className="py-3 px-4">계열</th>
                <th className="py-3 px-4">70% 컷 백분위</th>
                <th className="py-3 px-4">표점합 컷</th>
                <th className="py-3 px-4">내 점수 격차</th>
                <th className="py-3 px-4 text-center">합격 유력도 판정</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50 font-medium">
              {evaluatedUniversities.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-zinc-400 dark:text-zinc-500">
                    조건에 해당하는 대학 및 학과가 없습니다.
                  </td>
                </tr>
              ) : (
                evaluatedUniversities.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4 font-black text-zinc-900 dark:text-white">
                      {item.univ}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{item.major}</span>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                      {item.track === 'natural' ? '자연' : item.track === 'humanities' ? '인문' : '의약학'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-zinc-800 dark:text-zinc-200">
                      {item.cutPercentile}%
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-500 dark:text-zinc-400">
                      {item.cutScore}점
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      {item.diffPercentile >= 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">+{item.diffPercentile}%p</span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400">{item.diffPercentile}%p</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-black border ${item.badgeColor}`}>
                        {item.verdictText}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPredictor;
