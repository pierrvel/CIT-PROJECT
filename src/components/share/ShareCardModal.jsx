import React, { useState, useEffect, useRef } from 'react';
import Icon from '../common/Icon';
import { CARD_THEMES, renderScoreCardToCanvas } from '../../utils/cardCanvasRenderer';

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

  // initialMode 변경 시 동기화
  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  // 닉네임 변경 시 localStorage 보존
  useEffect(() => {
    localStorage.setItem('dc_share_nickname', nickname);
  }, [nickname]);

  // 2. 실시간 캔버스 재렌더링
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
      singleData: singleData || {
        subjectName: '수학 영역',
        optionName: '미적분',
        score: 96,
        grade: 1,
        percentile: 99,
        standardScore: 142,
        deltaFromCut1: 12,
        elapsedTimeStr: '92분 15초'
      },
      overallData: overallData || {
        avgPercentile: 97.8,
        totalStdScore: 398,
        cumulativePercent: 0.75,
        estimatedRank: 3150,
        tierName: 'DIAMOND',
        tierRange: '서연고 최상위 & 치한약수',
        subjects: [
          { name: '국어', score: 92, grade: 1, option: '언매', percentile: 97 },
          { name: '수학', score: 88, grade: 1, option: '미적', percentile: 98 },
          { name: '영어', score: 94, grade: 1, option: '절대', percentile: 96 },
          { name: '한국사', score: 45, grade: 1, option: '절대', percentile: 95 },
          { name: '탐구1', score: 47, grade: 1, option: '물리1', percentile: 98 },
          { name: '탐구2', score: 44, grade: 2, option: '화학1', percentile: 93 }
        ]
      }
    };

    renderScoreCardToCanvas(canvasRef.current, renderData);
  }, [isOpen, ratio, themeId, mode, nickname, quote, singleData, overallData]);

  if (!isOpen) return null;

  // 3. 고화질 PNG 파일 다운로드
  const handleDownloadImage = () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const filename = `[듀얼코어콕핏]_${nickname}_${mode === 'single' ? '성적카드' : '종합성적표'}_${Date.now()}.png`;
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

  // 4. 클립보드에 이미지 복사 (Ctrl+V로 인스타/오르비에 바로 붙여넣기)
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
          // 지원하지 않는 브라우저 fallback
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

  // 5. 모바일 Web Share API
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
          // 공유 미지원 시 클립보드 복사 유도
          handleCopyClipboard();
        }
      }, 'image/png');
    } catch (err) {
      console.warn('Share canceled or error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] glass-card bg-zinc-950/90 dark:bg-zinc-900/95 border border-zinc-700/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* 모달 상단 헤더 */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
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
          {/* 1. 실시간 캔버스 프리뷰 (좌측 6~7칸) */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col items-center justify-center bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800/80">
            <div className="relative max-h-[60vh] flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <canvas
                ref={canvasRef}
                className="max-h-[58vh] max-w-full w-auto h-auto object-contain transition-all duration-300"
              />
            </div>
            <span className="text-[11px] text-zinc-500 font-mono mt-3">
              💡 초고화질(1080px 기준)로 렌더링되며, 실제 저장 시 선명하게 내려받아집니다.
            </span>
          </div>

          {/* 2. 커스터마이징 패널 (우측 5~6칸) */}
          <div className="md:col-span-6 lg:col-span-5 space-y-5">
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
        <div className="p-4 sm:p-6 border-t border-zinc-800 bg-zinc-950/80 flex flex-wrap items-center justify-between gap-3">
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
