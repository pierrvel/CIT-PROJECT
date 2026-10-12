import React, { useState, useMemo } from 'react';
import Icon from '../common/Icon';
import ScoreInputPanel from './ScoreInputPanel';
import ScoreTrendChart from './ScoreTrendChart';
import {
  HISTORICAL_EXAMS,
  EXAM_CUTOFFS,
  getQuestionScores,
  getQuestionMetas,
  getOfficialAnswers,
  calculateGradeByScore,
  TARGET_COLLEGES
} from '../../constants/cutoffs';

export const ScoreTracker = ({
  scoreHistory = [],
  setScoreHistory,
  initialSubjectKey = 'korean',
  showToast
}) => {
  // 1. 선택 상태
  const [selectedExamId, setSelectedExamId] = useState('2025_csat');
  const [selectedSubjectKey, setSelectedSubjectKey] = useState(initialSubjectKey);
  const [selectedOptionKey, setSelectedOptionKey] = useState(() => {
    return initialSubjectKey === 'korean' ? 'speech' : 'calculus';
  });
  const [activeInputMode, setActiveInputMode] = useState('wrong_picks'); // 'direct' | 'wrong_picks' | 'omr'
  const [examMemo, setExamMemo] = useState('');

  // 현재 시험 & 과목 메타
  const currentExam = HISTORICAL_EXAMS.find((e) => e.id === selectedExamId) || HISTORICAL_EXAMS[0];
  const examCutoffData = EXAM_CUTOFFS[selectedExamId] || EXAM_CUTOFFS['2025_csat'];
  const subjectCutoffData = examCutoffData[selectedSubjectKey] || examCutoffData['korean'];
  const totalScore = subjectCutoffData.totalScore || 100;

  // 문항 배점 테이블 및 공식 정답표 (회차/선택과목 동적 반영)
  const questions = useMemo(() => {
    return getQuestionScores(selectedExamId, selectedSubjectKey, selectedOptionKey);
  }, [selectedExamId, selectedSubjectKey, selectedOptionKey]);

  const questionMetas = useMemo(() => {
    return getQuestionMetas(selectedExamId, selectedSubjectKey, selectedOptionKey);
  }, [selectedExamId, selectedSubjectKey, selectedOptionKey]);

  const officialAnswers = useMemo(() => {
    return getOfficialAnswers(selectedExamId, selectedSubjectKey, selectedOptionKey);
  }, [selectedExamId, selectedSubjectKey, selectedOptionKey]);

  // 2. 점수 및 채점 상태
  const [score, setScore] = useState(totalScore);
  const [wrongQuestionNos, setWrongQuestionNos] = useState([]);
  const [omrAnswers, setOmrAnswers] = useState({});

  // 과목이나 시험 변경 시 상태 리셋/조정
  const handleSelectSubject = (key) => {
    setSelectedSubjectKey(key);
    const newTotal = (EXAM_CUTOFFS[selectedExamId]?.[key]?.totalScore) || 100;
    setScore(newTotal);
    setWrongQuestionNos([]);
    setOmrAnswers({});
    if (key === 'korean') setSelectedOptionKey('speech');
    else if (key === 'math') setSelectedOptionKey('calculus');
  };

  const handleSelectExam = (examId) => {
    setSelectedExamId(examId);
    const newTotal = (EXAM_CUTOFFS[examId]?.[selectedSubjectKey]?.totalScore) || 100;
    setScore(newTotal);
    setWrongQuestionNos([]);
    setOmrAnswers({});
  };

  // 3. 등급 및 컷 대조 평가 산출
  const evaluation = useMemo(() => {
    return calculateGradeByScore(selectedExamId, selectedSubjectKey, selectedOptionKey, score);
  }, [selectedExamId, selectedSubjectKey, selectedOptionKey, score]);

  // 4. 스마트 OMR 채점 완료 적용 핸들러
  const handleApplyOmrGrade = () => {
    if (!officialAnswers) {
      if (showToast) showToast('해당 시험은 등록된 공식 정답표가 없습니다. [틀린 번호 콕!] 모드를 이용하세요.', 'warn');
      return;
    }

    let calculatedWrong = [];
    let calculatedDeduction = 0;

    questions.forEach((q) => {
      const userChoice = omrAnswers[q.no];
      const officialAns = officialAnswers[q.no - 1];
      if (officialAns !== undefined && officialAns !== null) {
        if (Number(userChoice) !== Number(officialAns)) {
          calculatedWrong.push(q.no);
          calculatedDeduction += q.score;
        }
      }
    });

    const newScore = Math.max(0, totalScore - calculatedDeduction);
    setWrongQuestionNos(calculatedWrong);
    setScore(newScore);
    setActiveInputMode('wrong_picks');

    if (showToast) {
      showToast(
        `OMR 자동 채점 완료! 총 ${calculatedWrong.length}문항 오답 (-${calculatedDeduction}점) ➔ 원점수 ${newScore}점`,
        'success'
      );
    }
  };

  // 5. 성적 히스토리 영구 저장
  const handleSaveScoreRecord = () => {
    const pad = (n) => String(n).padStart(2, '0');
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const subjectNames = {
      korean: '국어',
      math: '수학',
      english: '영어',
      history: '한국사',
      inquiry: '탐구'
    };

    const newRecord = {
      id: `score_${Date.now()}`,
      date: dateStr,
      examId: selectedExamId,
      examName: currentExam.name,
      subjectKey: selectedSubjectKey,
      subjectName: subjectNames[selectedSubjectKey] || '과목',
      optionKey: selectedOptionKey,
      optionName: evaluation.optionName || '',
      score,
      totalScore,
      grade: evaluation.grade,
      cut1: evaluation.cut1,
      deltaFromCut1: evaluation.deltaFromCut1,
      percentile: evaluation.percentile,
      wrongCount: wrongQuestionNos.length,
      wrongQuestionNos: [...wrongQuestionNos],
      memo: examMemo.trim()
    };

    const updated = [newRecord, ...scoreHistory].slice(0, 50);
    setScoreHistory(updated);
    setExamMemo('');

    if (showToast) {
      showToast(
        `[${newRecord.examName} ${newRecord.subjectName}] ${score}점 (${evaluation.grade}등급) 기록이 저장되었습니다!`,
        'success'
      );
    }
  };

  const handleDeleteRecord = (id) => {
    if (confirm('해당 성적 기록을 삭제하시겠습니까?')) {
      const updated = scoreHistory.filter((r) => r.id !== id);
      setScoreHistory(updated);
      if (showToast) showToast('성적 기록이 삭제되었습니다.', 'info');
    }
  };

  const handleLoadSampleHistory = () => {
    const samples = [
      {
        id: 'sample_score_1',
        date: '2026-10-02 16:30',
        examId: '2025_mock06',
        examName: '2025학년도 6월 모의평가 (평가원)',
        subjectKey: 'math',
        subjectName: '수학',
        optionKey: 'calculus',
        optionName: '미적분',
        score: 84,
        totalScore: 100,
        grade: 1,
        cut1: 78,
        deltaFromCut1: 6,
        percentile: 98,
        wrongCount: 4,
        wrongQuestionNos: [15, 21, 22, 30],
        memo: '불수학 시험이었으나 준킬러 방어로 1등급 컷(+6점) 안정권 확보.'
      },
      {
        id: 'sample_score_2',
        date: '2026-10-06 14:10',
        examId: '2025_mock09',
        examName: '2025학년도 9월 모의평가 (평가원)',
        subjectKey: 'math',
        subjectName: '수학',
        optionKey: 'calculus',
        optionName: '미적분',
        score: 92,
        totalScore: 100,
        grade: 1,
        cut1: 92,
        deltaFromCut1: 0,
        percentile: 96,
        wrongCount: 2,
        wrongQuestionNos: [22, 29],
        memo: '물수학 기조라 92점이 1컷 턱걸이. 실수를 절대 줄여야 함.'
      },
      {
        id: 'sample_score_3',
        date: '2026-10-10 11:20',
        examId: '2025_csat',
        examName: '2025학년도 수능 (2024.11 시행)',
        subjectKey: 'korean',
        subjectName: '국어',
        optionKey: 'media',
        optionName: '언어와 매체',
        score: 94,
        totalScore: 100,
        grade: 1,
        cut1: 92,
        deltaFromCut1: 2,
        percentile: 97,
        wrongCount: 3,
        wrongQuestionNos: [12, 28, 42],
        memo: '문학 연계 체감 높았음. 독서 1지문에서 3점 감점.'
      }
    ];

    setScoreHistory(samples);
    if (showToast) showToast('샘플 성적 데이터 3건이 로드되었습니다.', 'info');
  };

  // 등급별 컬러 스타일
  const getGradeBadgeStyle = (g) => {
    switch (g) {
      case 1:
        return 'bg-emerald-500 text-white shadow-emerald-500/20';
      case 2:
        return 'bg-blue-500 text-white shadow-blue-500/20';
      case 3:
        return 'bg-amber-500 text-white shadow-amber-500/20';
      case 4:
        return 'bg-orange-500 text-white shadow-orange-500/20';
      default:
        return 'bg-rose-500 text-white shadow-rose-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. 상단 컨트롤 바: 시험 회차 선택 + 과목 탭 + 선택과목 칩 */}
      {/* ========================================================================= */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 shadow-glass dark:shadow-glass-dark space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* 시험 회차 선택 셀렉터 */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-500">기출/모의고사 회차:</span>
              <select
                value={selectedExamId}
                onChange={(e) => handleSelectExam(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm font-extrabold rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {HISTORICAL_EXAMS.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 난이도 뱃지 */}
            <span
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${currentExam.badgeColor}`}
            >
              {currentExam.difficulty}
            </span>

            {/* 실제 시험 시행일 뱃지 (학년도와 구분 명확화) */}
            {currentExam.examDate && (
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold border border-zinc-200/80 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5 shadow-xs">
                <Icon name="calendar" className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>시행일: <strong className="text-zinc-900 dark:text-white font-mono">{currentExam.examDate}</strong></span>
              </span>
            )}
          </div>

          {/* 과목 탭 */}
          <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 self-start lg:self-auto">
            {[
              { key: 'korean', name: '국어' },
              { key: 'math', name: '수학' },
              { key: 'english', name: '영어' },
              { key: 'history', name: '한국사' },
              { key: 'inquiry', name: '탐구' }
            ].map((sub) => (
              <button
                key={sub.key}
                type="button"
                onClick={() => handleSelectSubject(sub.key)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedSubjectKey === sub.key
                    ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        {/* 선택과목 세부 칩 (통합형 수능 국어/수학) */}
        {selectedSubjectKey === 'korean' && (
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-500">선택과목:</span>
            {[
              { key: 'speech', name: '화법과 작문' },
              { key: 'media', name: '언어와 매체' }
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setSelectedOptionKey(opt.key);
                  setWrongQuestionNos([]);
                  setOmrAnswers({});
                  setScore(totalScore);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                  selectedOptionKey === opt.key
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        )}

        {selectedSubjectKey === 'math' && (
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-500">선택과목:</span>
            {[
              { key: 'calculus', name: '미적분' },
              { key: 'prob_stat', name: '확률과 통계' },
              { key: 'geometry', name: '기하' }
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setSelectedOptionKey(opt.key);
                  setWrongQuestionNos([]);
                  setOmrAnswers({});
                  setScore(totalScore);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                  selectedOptionKey === opt.key
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. 메인 채점 입력 & 실시간 등급 판정 결과 (2컬럼 레이아웃) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 좌측 (7컬럼): 3-Way 채점 입력 패널 */}
        <div className="lg:col-span-7">
          <ScoreInputPanel
            activeInputMode={activeInputMode}
            setActiveInputMode={setActiveInputMode}
            score={score}
            setScore={setScore}
            totalScore={totalScore}
            wrongQuestionNos={wrongQuestionNos}
            setWrongQuestionNos={setWrongQuestionNos}
            omrAnswers={omrAnswers}
            setOmrAnswers={setOmrAnswers}
            questions={questions}
            questionMetas={questionMetas}
            officialAnswers={officialAnswers}
            onApplyOmrGrade={handleApplyOmrGrade}
          />
        </div>

        {/* 우측 (5컬럼): 실시간 공식 등급 대조 & 목표 대학 갭 카드 */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-card bg-white/80 dark:bg-zinc-900/80 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 shadow-glass dark:shadow-glass-dark space-y-5">
            {/* 상단: 점수 및 등급 판정 하이라이트 */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-500">
                  {currentExam.name} • {evaluation.optionName || '공통'}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-zinc-900 dark:text-white">
                    {score}점
                  </span>
                  <span className="text-xs text-zinc-400 font-bold">/ {totalScore}점</span>
                </div>
              </div>

              {/* 등급 배지 */}
              <div
                className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg ${getGradeBadgeStyle(
                  evaluation.grade
                )}`}
              >
                <span className="text-2xl font-black font-mono leading-none">
                  {evaluation.grade}
                </span>
                <span className="text-[10px] font-extrabold mt-0.5">등급</span>
              </div>
            </div>

            {/* 1컷 대비 여유/격차 알림 배너 */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                evaluation.deltaFromCut1 >= 0
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  name={evaluation.deltaFromCut1 >= 0 ? 'checkCircle' : 'alertTriangle'}
                  className="w-4 h-4 shrink-0"
                />
                <span className="text-xs font-bold">
                  1등급 컷({evaluation.cut1}점) 기준
                </span>
              </div>
              <span className="text-xs font-black font-mono">
                {evaluation.deltaFromCut1 >= 0
                  ? `+${evaluation.deltaFromCut1}점 여유 🟢`
                  : `${evaluation.deltaFromCut1}점 부족 🟡`}
              </span>
            </div>

            {/* 예상 백분위 게이지 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
                <span>예상 전국 백분위</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-extrabold">
                  상위 {100 - evaluation.percentile}% (백분위 {evaluation.percentile}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                  style={{ width: `${evaluation.percentile}%` }}
                />
              </div>
            </div>

            {/* 등급컷 가이드 테이블 */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden text-xs">
              <div className="bg-zinc-100 dark:bg-zinc-800 px-3 py-2 font-bold text-zinc-600 dark:text-zinc-300 flex justify-between">
                <span>공식 확정 원점수 등급컷</span>
                <span className="font-mono text-[10px] text-zinc-400">1~4등급 기준</span>
              </div>
              <div className="grid grid-cols-4 divide-x divide-zinc-200 dark:divide-zinc-800 p-2 text-center bg-white dark:bg-zinc-900 font-mono">
                <div>
                  <div className="text-[10px] text-zinc-400">1등급</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    {evaluation.cuts[0]}점
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">2등급</div>
                  <div className="font-bold text-blue-600 dark:text-blue-400">
                    {evaluation.cuts[1]}점
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">3등급</div>
                  <div className="font-bold text-amber-600 dark:text-amber-400">
                    {evaluation.cuts[2]}점
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">4등급</div>
                  <div className="font-bold text-zinc-500">
                    {evaluation.cuts[3]}점
                  </div>
                </div>
              </div>
            </div>

            {/* 목표 대학 라인 적합도 피드백 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                🎯 주요 대학 라인 백분위 갭
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TARGET_COLLEGES.map((col) => {
                  const gap = evaluation.percentile - col.targetPercentile;
                  const isSafe = gap >= 0;
                  return (
                    <div
                      key={col.id}
                      className={`p-2 rounded-xl border text-xs flex flex-col justify-between ${
                        isSafe
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                          : 'bg-zinc-100/60 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <span className="font-bold truncate">{col.name}</span>
                      <span className="font-mono text-[11px] font-extrabold mt-1">
                        {isSafe ? `안정 (+${gap}%)` : `도전 (${gap}%)`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 복기 한 줄 메모 입력 & 영구 저장 버튼 */}
            <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <input
                type="text"
                placeholder="오늘의 채점 복기 메모 (예: 킬러 22번 계산 실수, 문학 선방)"
                value={examMemo}
                onChange={(e) => setExamMemo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleSaveScoreRecord}
                className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <Icon name="save" className="w-4 h-4" />
                <span>이 성적 영구 기록하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. 과목별 성적 변화 궤적 차트 */}
      {/* ========================================================================= */}
      <ScoreTrendChart
        history={scoreHistory}
        subjectKey={selectedSubjectKey}
        subjectName={
          {
            korean: '국어 영역',
            math: '수학 영역',
            english: '영어 영역',
            history: '한국사 영역',
            inquiry: '탐구 영역'
          }[selectedSubjectKey] || '과목'
        }
        totalScore={totalScore}
      />

      {/* ========================================================================= */}
      {/* 4. 누적 모의고사 성적표 리스트 (히스토리) */}
      {/* ========================================================================= */}
      <div className="glass-card bg-white/80 dark:bg-zinc-900/80 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 shadow-glass dark:shadow-glass-dark space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Icon name="fileText" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white">
                누적 모의고사 성적 기록장
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                기록된 총 {scoreHistory.length}건의 모의고사 성적과 복기 메모
              </p>
            </div>
          </div>

          {scoreHistory.length === 0 && (
            <button
              type="button"
              onClick={handleLoadSampleHistory}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            >
              샘플 성적 3건 로드
            </button>
          )}
        </div>

        {scoreHistory.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <p className="text-xs text-zinc-400">아직 저장된 성적 기록이 없습니다.</p>
            <p className="text-xs text-zinc-500">
              위의 입력창에서 점수를 입력하고 <strong>[이 성적 영구 기록하기]</strong>를 눌러보세요.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {scoreHistory.map((rec) => (
              <div
                key={rec.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 rounded-xl px-2 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-white">
                      {rec.examName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {rec.subjectName} {rec.optionName ? `(${rec.optionName})` : ''}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">{rec.date}</span>
                  </div>

                  {rec.memo && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
                      "{rec.memo}"
                    </p>
                  )}

                  {rec.wrongQuestionNos && rec.wrongQuestionNos.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px] text-rose-600 dark:text-rose-400 font-mono">
                      <span>틀린 문항 ({rec.wrongQuestionNos.length}개):</span>
                      <span>{rec.wrongQuestionNos.join(', ')}번</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base sm:text-lg font-black font-mono text-zinc-900 dark:text-white">
                        {rec.score}점
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${getGradeBadgeStyle(
                          rec.grade
                        )}`}
                      >
                        {rec.grade}등급
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      1컷({rec.cut1}점) {rec.score >= rec.cut1 ? `+${rec.score - rec.cut1}점` : `${rec.score - rec.cut1}점`}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteRecord(rec.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="기록 삭제"
                  >
                    <Icon name="trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreTracker;
