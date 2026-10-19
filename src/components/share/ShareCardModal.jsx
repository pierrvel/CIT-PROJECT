import React, { useState, useEffect, useRef, useMemo } from 'react';
import Icon from '../common/Icon';
import { CARD_THEMES, renderScoreCardToCanvas } from '../../utils/cardCanvasRenderer';
import { convertSubjectScore } from '../../utils/admissionCalculator';

// 6개 과목 기본 템플릿
const DEFAULT_SUBJECTS = {
  korean: { key: 'korean', name: '국어 영역', option: '언어와 매체', maxRaw: 100, defaultScore: 92 },
  math: { key: 'math', name: '수학 영역', option: '미적분', maxRaw: 100, defaultScore: 88 },
  english: { key: 'english', name: '영어 영역', option: '절대평가', maxRaw: 100, defaultScore: 94 },
  history: { key: 'history', name: '한국사 영역', option: '절대평가', maxRaw: 50, defaultScore: 45 },
  inquiry1: { key: 'inquiry1', name: '탐구 1과목', option: '물리학Ⅰ', maxRaw: 50, defaultScore: 47 },
  inquiry2: { key: 'inquiry2', name: '탐구 2과목', option: '화학Ⅰ', maxRaw: 50, defaultScore: 44 }
};

export const ShareCardModal = ({
  isOpen,
  onClose,
  initialMode = 'single', // 'single' | 'overall'
  singleData = null,
  overallData = null,
  showToast
}) => {
  const canvasRef = useRef(null);

  // 1. 카드 커스터마이징 상태
  const [ratio, setRatio] = useState('story'); // 'story' (9:16) | 'square' (1:1)
  const [themeId, setThemeId] = useState('dark_neon');
  const [mode, setMode] = useState(initialMode);
  const [nickname, setNickname] = useState(() => localStorage.getItem('dc_share_nickname') || '정시파이터');
  const [quote, setQuote] = useState('흔들리지 않고 끝까지 완주한다.');
  const [isExporting, setIsExporting] = useState(false);

  // 2. 과목 선택 상태 (단일 과목 모드용)
  const [selectedSubKey, setSelectedSubKey] = useState('korean');
  const [subjectState, setSubjectState] = useState(() => {
    return {
      korean: { score: 92, option: '언어와 매체' },
      math: { score: 88, option: '미적분' },
      english: { score: 94, option: '절대평가' },
      history: { score: 45, option: '절대평가' },
      inquiry1: { score: 47, option: '물리학Ⅰ' },
      inquiry2: { score: 44, option: '화학Ⅰ' }
    };
  });

  // initialMode 또는 singleData 변경 시 초기 과목 및 점수 동기화
  useEffect(() => {
    if (initialMode) setMode(initialMode);
    if (singleData) {
      const subName = singleData.subjectName || '';
      let targetKey = 'korean';
      if (subName.includes('수학')) targetKey = 'math';
      else if (subName.includes('영어')) targetKey = 'english';
      else if (subName.includes('한국사')) targetKey = 'history';
      else if (subName.includes('탐구 2') || subName.includes('탐구2')) targetKey = 'inquiry2';
      else if (subName.includes('탐구')) targetKey = 'inquiry1';

      setSelectedSubKey(targetKey);
      setSubjectState((prev) => ({
        ...prev,
        [targetKey]: {
          score: singleData.score ?? prev[targetKey].score,
          option: singleData.optionName || prev[targetKey].option
        }
      }));
    }
  }, [initialMode, singleData]);

  // 닉네임 변경 시 localStorage 보존
  useEffect(() => {
    localStorage.setItem('dc_share_nickname', nickname);
  }, [nickname]);

  // 현재 선택된 단일 과목의 성적 데이터 계산
  const currentSingleData = useMemo(() => {
    const meta = DEFAULT_SUBJECTS[selectedSubKey] || DEFAULT_SUBJECTS.korean;
    const curState = subjectState[selectedSubKey] || { score: meta.defaultScore, option: meta.option };
    const rawScore = curState.score;

    // 평가원 변환 계산
    const examSubKey = selectedSubKey.startsWith('inquiry') ? 'inquiry' : selectedSubKey;
    const conv = convertSubjectScore('2025_csat', examSubKey, null, rawScore);
    const cut1 = conv.cuts ? conv.cuts[0] : 90;

    return {
      subjectName: meta.name,
      optionName: curState.option,
      score: rawScore,
      grade: conv.grade,
      percentile: conv.percentile,
      standardScore: conv.standardScore,
      deltaFromCut1: rawScore - cut1,
      elapsedTimeStr: singleData?.elapsedTimeStr || ''
    };
  }, [selectedSubKey, subjectState, singleData]);

  // 3. 실시간 캔버스 재렌더링
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const todayStr = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    // 수능 D-Day 계산
    const csatDate = new Date('2026-11-19T08:40:00+09:00');
    const now = new Date();
    const diffDays = Math.ceil((csatDate - now) / (1000 * 60 * 60 * 24));
    const dDayStr = diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? 'D-Day' : `D+${Math.abs(diffDays)}`;

    const renderData = {
      ratio,
      themeId,
      mode,
      nickname: nickname.trim() || '수험생',
      quote: quote.trim(),
      examName: mode === 'single'
        ? (singleData?.examName || '2025학년도 대학수학능력시험')
        : (overallData?.examName || '2025학년도 대학수학능력시험 종합 성적표'),
      examDate: todayStr,
      dDayStr,
      singleData: currentSingleData,
      overallData: overallData || {
        avgPercentile: 97.8,
        totalStdScore: 398,
        cumulativePercent: 0.75,
        estimatedRank: 3150,
        tierName: 'DIAMOND',
        tierRange: '서연고 최상위 & 치한약수',
        subjects: [
          { name: '국어', score: subjectState.korean.score, grade: 1, option: subjectState.korean.option, percentile: 97 },
          { name: '수학', score: subjectState.math.score, grade: 1, option: subjectState.math.option, percentile: 98 },
          { name: '영어', score: subjectState.english.score, grade: 1, option: '절대', percentile: 96 },
          { name: '한국사', score: subjectState.history.score, grade: 1, option: '절대', percentile: 95 },
          { name: '탐구1', score: subjectState.inquiry1.score, grade: 1, option: subjectState.inquiry1.option, percentile: 98 },
          { name: '탐구2', score: subjectState.inquiry2.score, grade: 2, option: subjectState.inquiry2.option, percentile: 93 }
        ]
      }
    };

    renderScoreCardToCanvas(canvasRef.current, renderData);
  }, [isOpen, ratio, themeId, mode, nickname, quote, currentSingleData, overallData, subjectState]);

  if (!isOpen) return null;

  // 4. 고화질 PNG 파일 다운로드
  const handleDownloadImage = () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const filename = `[듀얼코어콕핏]_${nickname}_${mode === 'single' ? currentSingleData.subjectName : '종합성적표'}_${Date.now()}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();

      if (showToast) showToast('고화질 성적표 카드가 저장되었습니다! 📸', 'success');
    } catch (e) {
      console.error(e);
      if (showToast) showToast('이미지 저장 중 오류가 발생했습니다.', 'warn');
    } finally {
      setIsExporting(false);
    }
  };

  // 5. 클립보드에 이미지 복사 (Ctrl+V로 인스타/오르비에 바로 붙여넣기)
  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      const canvas = canvasRef.current;
      canvas.toBlob(async (blob) => {
        if (!blob) {
          if (showToast) showToast('클립보드 복사 변환에 실패했습니다.', 'warn');
          setIsExporting(false);
          return;
        }

        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            if (showToast) showToast('클립보드에 이미지가 복사되었습니다! (Ctrl+V로 붙여넣기)', 'success');
          } else {
            throw new Error('Clipboard API not supported');
          }
        } catch (err) {
          console.warn(err);
          handleDownloadImage();
        } finally {
          setIsExporting(false);
        }
      }, 'image/png');
    } catch (err) {
      console.error(err);
      setIsExporting(false);
    }
  };

  // 6. 모바일 Web Share API
  const handleShareMobile = async () => {
    if (!canvasRef.current) return;
    try {
      const canvas = canvasRef.current;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `score_card_${Date.now()}.png`, { type: 'image/png' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${nickname} 님의 실전 성적표`,
            text: `[듀얼코어 콕핏] ${quote}`
          });
          if (showToast) showToast('성적표가 공유되었습니다!', 'success');
        } else {
          handleCopyClipboard();
        }
      }, 'image/png');
    } catch (err) {
      console.warn('Share canceled or error:', err);
    }
  };

  const curSubMeta = DEFAULT_SUBJECTS[selectedSubKey] || DEFAULT_SUBJECTS.korean;
  const curSubScore = (subjectState[selectedSubKey] && subjectState[selectedSubKey].score) || 90;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[94vh] glass-card bg-zinc-950/95 border border-zinc-700/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* 모달 상단 헤더 */}
        <div className="px-6 py-3.5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Icon name="award" className="w-5 h-5 text-indigo-400" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                📸 공스타 & 커뮤니티 감성 성적 카드 생성기
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                  2X RETINA HD
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                인스타그램 스토리(9:16) 및 피드·오르비(1:1) 규격으로 원클릭 저장 및 공유
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* 메인 바디 (좌측 프리뷰 vs 우측 컨트롤러) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* 1. 실시간 캔버스 프리뷰 (좌측 6~7칸) - 비율 강제 고정으로 찌그러짐 원천 방지 */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col items-center justify-center bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/80">
            <div
              className={`relative flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 ${
                ratio === 'story'
                  ? 'h-[60vh] max-h-[600px] aspect-[9/16]'
                  : 'h-[55vh] max-h-[500px] aspect-square'
              }`}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <span className="text-[11px] text-zinc-500 font-mono mt-3">
              💡 실시간 비율 보정 렌더러가 적용되어 글자가 잘리지 않고 깔끔하게 렌더링됩니다.
            </span>
          </div>

          {/* 2. 커스터마이징 패널 (우측 5~6칸) */}
          <div className="md:col-span-6 lg:col-span-5 space-y-4">
            {/* 1) 카드 모드 선택 (단일 과목 vs 전과목 종합) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">카드 종류 선택</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('single')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                    mode === 'single'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <Icon name="award" className="w-3.5 h-3.5" />
                  <span>단일 과목 모드</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('overall')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                    mode === 'overall'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <Icon name="layers" className="w-3.5 h-3.5" />
                  <span>전과목 종합 모드</span>
                </button>
              </div>
            </div>

            {/* 1-1) 단일 과목 모드일 때: 과목 선택 칩 및 점수 조절기 */}
            {mode === 'single' && (
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-indigo-400 flex items-center gap-1">
                    <Icon name="checkCircle" className="w-3.5 h-3.5" />
                    <span>과목 선택 (클릭 시 즉시 전환)</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    현재: {curSubMeta.name}
                  </span>
                </div>

                {/* 6개 과목 칩 버튼 */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { key: 'korean', label: '국어' },
                    { key: 'math', label: '수학' },
                    { key: 'english', label: '영어' },
                    { key: 'history', label: '한국사' },
                    { key: 'inquiry1', label: '탐구1' },
                    { key: 'inquiry2', label: '탐구2' }
                  ].map((sub) => {
                    const isSelected = selectedSubKey === sub.key;
                    return (
                      <button
                        key={sub.key}
                        type="button"
                        onClick={() => setSelectedSubKey(sub.key)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                            : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>

                {/* 선택된 과목 원점수 슬라이더 */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-zinc-400">{curSubMeta.name} 원점수 조절</span>
                    <span className="text-indigo-400 font-mono text-sm font-black">
                      {curSubScore}점 / {curSubMeta.maxRaw}점
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max={curSubMeta.maxRaw}
                      value={curSubScore}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSubjectState((prev) => ({
                          ...prev,
                          [selectedSubKey]: {
                            ...prev[selectedSubKey],
                            score: val
                          }
                        }));
                      }}
                      className="w-full accent-indigo-500"
                    />
                    <input
                      type="number"
                      min="0"
                      max={curSubMeta.maxRaw}
                      value={curSubScore}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(curSubMeta.maxRaw, Number(e.target.value) || 0));
                        setSubjectState((prev) => ({
                          ...prev,
                          [selectedSubKey]: {
                            ...prev[selectedSubKey],
                            score: val
                          }
                        }));
                      }}
                      className="w-14 px-2 py-1 text-center font-mono font-black text-xs rounded-lg bg-zinc-800 border border-zinc-700 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2) 이미지 규격/비율 선택 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">이미지 비율 규격</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRatio('story')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                    ratio === 'story'
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <span>📱 인스타 스토리 (9:16)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRatio('square')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                    ratio === 'square'
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <span>🖼️ 정사각 피드 (1:1)</span>
                </button>
              </div>
            </div>

            {/* 3) 테마 선택 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">디자인 테마</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(CARD_THEMES).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setThemeId(t.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 border ${
                      themeId === t.id
                        ? 'bg-zinc-800 text-white border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                      style={{ backgroundColor: t.accent }}
                    />
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4) 닉네임 입력 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">수험생 닉네임</label>
              <input
                type="text"
                maxLength={15}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="예: 서울대26학번, 정시파이터"
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-zinc-900 border border-zinc-700/80 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 5) 좌우명 / 한마디 입력 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400">복기 메모 & 다짐 한마디</label>
              <input
                type="text"
                maxLength={45}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="예: 실수를 줄이고 킬러 22번에 집중하자."
                className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-zinc-900 border border-zinc-700/80 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 하단 내보내기 액션 버튼 바 */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">
              인스타 스토리에 바로 공유해보세요!
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isExporting}
              onClick={handleCopyClipboard}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all active:scale-95 border border-zinc-700"
            >
              <Icon name="copy" className="w-4 h-4 text-indigo-400" />
              <span>클립보드 복사 (Ctrl+V)</span>
            </button>

            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                type="button"
                disabled={isExporting}
                onClick={handleShareMobile}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30 transition-all active:scale-95"
              >
                <Icon name="share2" className="w-4 h-4" />
                <span>모바일 공유</span>
              </button>
            )}

            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadImage}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Icon name="download" className="w-4 h-4" />
              <span>{isExporting ? '생성 중...' : '고화질 PNG 저장 📸'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCardModal;
