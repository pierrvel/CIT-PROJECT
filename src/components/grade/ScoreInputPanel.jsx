import React from 'react';
import Icon from '../common/Icon';

export const ScoreInputPanel = ({
  activeInputMode,
  setActiveInputMode,
  score,
  setScore,
  totalScore = 100,
  wrongQuestionNos = [],
  setWrongQuestionNos,
  omrAnswers = {},
  setOmrAnswers,
  questions = [],
  officialAnswers = null,
  onApplyOmrGrade
}) => {
  // 모드 1: 원점수 변경 헬퍼
  const handleScoreAdjust = (delta) => {
    setScore((prev) => Math.max(0, Math.min(totalScore, prev + delta)));
  };

  // 모드 2: 틀린 문항 토글
  const toggleWrongQuestion = (qNo) => {
    const isWrong = wrongQuestionNos.includes(qNo);
    let nextWrong;
    if (isWrong) {
      nextWrong = wrongQuestionNos.filter((n) => n !== qNo);
    } else {
      nextWrong = [...wrongQuestionNos, qNo];
    }
    setWrongQuestionNos(nextWrong);

    // 감점 계산
    const deducted = nextWrong.reduce((sum, no) => {
      const q = questions.find((item) => item.no === no);
      return sum + (q ? q.score : 2);
    }, 0);
    setScore(Math.max(0, totalScore - deducted));
  };

  const handleResetWrongQuestions = () => {
    setWrongQuestionNos([]);
    setScore(totalScore);
  };

  // 모드 3: OMR 번호 선택
  const handleOmrChoice = (qNo, choice) => {
    setOmrAnswers((prev) => ({
      ...prev,
      [qNo]: prev[qNo] === choice ? null : choice
    }));
  };

  const handleOmrTextChange = (qNo, val) => {
    const numVal = val.replace(/[^0-9]/g, '');
    setOmrAnswers((prev) => ({
      ...prev,
      [qNo]: numVal === '' ? null : parseInt(numVal, 10)
    }));
  };

  // 총 감점 점수 계산
  const currentDeduction = wrongQuestionNos.reduce((sum, no) => {
    const q = questions.find((item) => item.no === no);
    return sum + (q ? q.score : 2);
  }, 0);

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 shadow-glass dark:shadow-glass-dark space-y-5">
      {/* 3-Way 입력 모드 선택 탭 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Icon name="calculator" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white">
              채점 및 성적 입력 방식
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              수험생 편의에 맞춘 3가지 입력 모드를 지원합니다
            </p>
          </div>
        </div>

        {/* 탭 전환 버튼 */}
        <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80">
          <button
            type="button"
            onClick={() => setActiveInputMode('direct')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeInputMode === 'direct'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Icon name="zap" className="w-3.5 h-3.5" />
            <span>원점수 직접 입력</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveInputMode('wrong_picks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeInputMode === 'wrong_picks'
                ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Icon name="target" className="w-3.5 h-3.5" />
            <span>틀린 번호 콕!</span>
            {wrongQuestionNos.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400">
                {wrongQuestionNos.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveInputMode('omr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeInputMode === 'omr'
                ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Icon name="checkSquare" className="w-3.5 h-3.5" />
            <span>스마트 OMR</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. 모드 1: 원점수 직접 입력 */}
      {/* ========================================================================= */}
      {activeInputMode === 'direct' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 flex items-start gap-3">
            <Icon name="zap" className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-900 dark:text-indigo-200">
              <span className="font-bold">⚡ 이미 채점을 완료하셨나요?</span>
              <p className="mt-0.5 text-indigo-700/80 dark:text-indigo-300/80">
                원점수를 직접 입력하거나 슬라이더를 조절하면 1초 만에 과거 등급컷과 대조됩니다.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            {/* 점수 대형 표시 */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-indigo-600 dark:text-indigo-400">
                {score}
              </span>
              <span className="text-sm font-bold text-zinc-400">/ {totalScore}점 만점</span>
            </div>

            {/* 증감 스텝퍼 버튼들 */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScoreAdjust(-5)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100"
              >
                -5점
              </button>
              <button
                type="button"
                onClick={() => handleScoreAdjust(-1)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100"
              >
                -1점
              </button>
              <button
                type="button"
                onClick={() => handleScoreAdjust(1)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100"
              >
                +1점
              </button>
              <button
                type="button"
                onClick={() => handleScoreAdjust(5)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100"
              >
                +5점
              </button>
              <button
                type="button"
                onClick={() => setScore(totalScore)}
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20"
              >
                만점 ({totalScore})
              </button>
            </div>
          </div>

          {/* 슬라이더 바 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span>0점</span>
              <span>{Math.round(totalScore / 2)}점</span>
              <span>{totalScore}점</span>
            </div>
            <input
              type="range"
              min="0"
              max={totalScore}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* 퀵 점수 선택 프리셋 칩 */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-zinc-500">빠른 선택:</span>
            {[totalScore, totalScore === 100 ? 96 : 48, totalScore === 100 ? 92 : 45, totalScore === 100 ? 88 : 42, totalScore === 100 ? 84 : 40, totalScore === 100 ? 80 : 35, totalScore === 100 ? 76 : 30].map((sVal) => (
              <button
                key={sVal}
                type="button"
                onClick={() => setScore(sVal)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                  score === sVal
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
                }`}
              >
                {sVal}점
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. 모드 2: 틀린 번호만 콕! 찍기 */}
      {/* ========================================================================= */}
      {activeInputMode === 'wrong_picks' && (
        <div className="space-y-4 animate-fadeIn">
          {/* 상태 배너 & 초기화 버튼 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
                <Icon name="target" className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                    오답 콕 찍기 모드
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500 text-white font-mono">
                    {wrongQuestionNos.length}개 오답 (-{currentDeduction}점 감점)
                  </span>
                </div>
                <p className="text-xs text-rose-700/80 dark:text-rose-300/80 mt-0.5">
                  시험지에서 틀린 번호를 클릭하면 점수가 실시간 자동 감산됩니다.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl font-black font-mono text-zinc-900 dark:text-white">
                {score}점
              </span>
              <button
                type="button"
                onClick={handleResetWrongQuestions}
                disabled={wrongQuestionNos.length === 0}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 disabled:opacity-40 transition-colors"
              >
                다 맞음으로 초기화
              </button>
            </div>
          </div>

          {/* 문항 번호 그리드 */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-2 max-h-[380px] overflow-y-auto p-1 pr-2">
            {questions.map((q) => {
              const isWrong = wrongQuestionNos.includes(q.no);
              return (
                <button
                  key={q.no}
                  type="button"
                  onClick={() => toggleWrongQuestion(q.no)}
                  className={`relative flex flex-col items-center justify-between p-2 rounded-xl border transition-all duration-150 ${
                    isWrong
                      ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-95 ring-2 ring-rose-400/40'
                      : 'bg-white dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:border-rose-300 hover:bg-rose-50/30'
                  }`}
                >
                  {/* 문항 번호 */}
                  <span className={`text-sm font-black font-mono ${isWrong ? 'line-through text-rose-100' : ''}`}>
                    {q.no}
                  </span>

                  {/* 배점 및 파트 칩 */}
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                        isWrong
                          ? 'bg-rose-700 text-white'
                          : q.score >= 4
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold'
                          : q.score === 3
                          ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500'
                      }`}
                    >
                      {q.score}점
                    </span>
                  </div>

                  {/* 영역 태그 */}
                  {q.part && (
                    <span
                      className={`text-[9px] mt-0.5 truncate max-w-[50px] ${
                        isWrong ? 'text-rose-100 font-bold' : 'text-zinc-400'
                      }`}
                    >
                      {q.part}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. 모드 3: 스마트 OMR 풀채점 */}
      {/* ========================================================================= */}
      {activeInputMode === 'omr' && (
        <div className="space-y-4 animate-fadeIn">
          {/* 공식 정답표 탑재 여부 알림 */}
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Icon name="checkSquare" className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-blue-900 dark:text-blue-200">
                  {officialAnswers
                    ? '✨ 공식 확정 정답표 자동 채점 지원'
                    : '📝 사용자 OMR 마킹 모드'}
                </h4>
                <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-0.5">
                  {officialAnswers
                    ? '평가원 공식 정답표가 연동되어 있어, OMR 마킹 시 100% 정답 대조 채점이 이뤄집니다.'
                    : '1~5번 객관식 및 주관식 단답형 답안을 마킹하여 채점할 수 있습니다.'}
                </p>
              </div>
            </div>

            {onApplyOmrGrade && (
              <button
                type="button"
                onClick={onApplyOmrGrade}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0"
              >
                OMR 채점 완료 적용
              </button>
            )}
          </div>

          {/* OMR 문항 리스트 */}
          <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {questions.map((q) => {
                const userChoice = omrAnswers[q.no];
                const officialAns = officialAnswers ? officialAnswers[q.no - 1] : null;
                const isShortAnswer = q.part?.includes('단답');
                const isGraded = officialAns !== null && officialAns !== undefined && userChoice !== undefined && userChoice !== null;
                const isCorrect = isGraded && Number(userChoice) === Number(officialAns);

                return (
                  <div
                    key={q.no}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                      isGraded
                        ? isCorrect
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                        : 'bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {/* 문항 메타 */}
                    <div className="flex items-center gap-2 min-w-[70px]">
                      <span className="font-mono font-black text-sm text-zinc-900 dark:text-white">
                        {q.no}.
                      </span>
                      <span className="text-[10px] px-1 py-0.5 rounded font-bold bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                        {q.score}점
                      </span>
                      {isGraded && (
                        <span className={`text-xs font-black ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isCorrect ? 'O' : 'X'}
                        </span>
                      )}
                    </div>

                    {/* OMR 1~5 마킹 또는 단답형 인풋 */}
                    {isShortAnswer ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="정답"
                          value={userChoice || ''}
                          onChange={(e) => handleOmrTextChange(q.no, e.target.value)}
                          className="w-16 px-2 py-1 text-xs font-mono font-bold text-center rounded-lg bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {officialAns !== null && (
                          <span className="text-[10px] text-zinc-400 font-mono">
                            (정답: {officialAns})
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((opt) => {
                          const isSelected = userChoice === opt;
                          const isKey = officialAns === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleOmrChoice(q.no, opt)}
                              className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : isKey && isGraded
                                  ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-400'
                                  : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreInputPanel;
