import React, { useState } from 'react';
import Icon from '../common/Icon';

export const ScoreTrendChart = ({
  history = [],
  subjectKey = 'korean',
  subjectName = '국어 영역',
  totalScore = 100
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 현재 과목에 해당하는 기록만 필터링 (오래된 순 -> 최신 순으로 정렬)
  const filteredHistory = history
    .filter((h) => h.subjectKey === subjectKey)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (filteredHistory.length === 0) {
    return (
      <div className="glass-card bg-white/70 dark:bg-zinc-900/70 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-8 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
          <Icon name="trendingUp" className="w-6 h-6" />
        </div>
        <h4 className="font-extrabold text-sm sm:text-base text-zinc-800 dark:text-zinc-200">
          [{subjectName}] 누적 성적 변화 궤적
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          아직 기록된 모의고사 성적이 없습니다. 위에서 시험 회차를 선택하고 성적을 기록하면 회차별 점수 및 1등급 컷 대비 궤적이 그래프로 시각화됩니다!
        </p>
      </div>
    );
  }

  // SVG 차트 좌표 계산
  const width = 640;
  const height = 220;
  const paddingX = 45;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingTop - paddingBottom;

  const maxVal = totalScore;
  const minVal = totalScore === 100 ? 50 : 20; // Y축 최소값 (시각적 변별력)

  const getY = (val) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const ratio = (clamped - minVal) / (maxVal - minVal);
    return height - paddingBottom - ratio * chartH;
  };

  const getX = (index) => {
    if (filteredHistory.length === 1) return width / 2;
    return paddingX + (index / (filteredHistory.length - 1)) * chartW;
  };

  // 포인트 좌표열
  const points = filteredHistory.map((item, idx) => ({
    x: getX(idx),
    y: getY(item.score),
    item,
    idx
  }));

  // 라인 패스 생성
  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // 영역 채우기 패스 생성
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : '';

  // 최신 기록 대비 변화량 (최근 - 직전)
  const latest = filteredHistory[filteredHistory.length - 1];
  const prev = filteredHistory.length > 1 ? filteredHistory[filteredHistory.length - 2] : null;
  const scoreDiff = prev ? latest.score - prev.score : 0;

  // 평균 1등급 컷 기준선 계산
  const avgCut1 = Math.round(
    filteredHistory.reduce((sum, h) => sum + (h.cut1 || (totalScore === 100 ? 88 : 42)), 0) /
      filteredHistory.length
  );
  const cut1Y = getY(avgCut1);

  return (
    <div className="glass-card bg-white/80 dark:bg-zinc-900/80 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 shadow-glass dark:shadow-glass-dark space-y-4">
      {/* 헤더 & 추세 배지 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Icon name="trendingUp" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white">
              {subjectName} 성적 변화 궤적
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              총 {filteredHistory.length}회차 누적 실모 점수 흐름 & 1등급 컷 기준선
            </p>
          </div>
        </div>

        {/* 상승/하락 트렌드 칩 */}
        {prev && (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
              scoreDiff >= 0
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}
          >
            <Icon name={scoreDiff >= 0 ? 'trendingUp' : 'trendingDown'} className="w-4 h-4" />
            <span>
              직전 회차 대비 {scoreDiff >= 0 ? `+${scoreDiff}점 상승` : `${scoreDiff}점 하락`}
            </span>
          </div>
        )}
      </div>

      {/* SVG 그래프 영역 */}
      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]">
          <defs>
            <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* 수평 가이드선 및 라벨 */}
          {[maxVal, Math.round((maxVal + minVal) / 2), minVal].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-zinc-200 dark:text-zinc-800"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-zinc-400 dark:fill-zinc-500"
                >
                  {val}점
                </text>
              </g>
            );
          })}

          {/* 1등급 컷 기준선 (점선) */}
          <line
            x1={paddingX}
            y1={cut1Y}
            x2={width - paddingX}
            y2={cut1Y}
            stroke="#10b981"
            strokeDasharray="6 3"
            strokeWidth="1.5"
          />
          <text
            x={width - paddingX + 6}
            y={cut1Y + 3}
            textAnchor="start"
            className="text-[9px] font-bold fill-emerald-600 dark:fill-emerald-400"
          >
            1컷 (~{avgCut1}점)
          </text>

          {/* 영역 그라디언트 채우기 */}
          {points.length > 1 && (
            <path d={areaD} fill="url(#scoreAreaGrad)" />
          )}

          {/* 메인 꺾은선 라인 */}
          {points.length > 1 && (
            <path
              d={pathD}
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* 데이터 포인트 점들 & 라벨 */}
          {points.map((pt) => {
            const isHovered = hoveredIndex === pt.idx;
            const isLatest = pt.idx === points.length - 1;
            return (
              <g
                key={pt.item.id}
                onMouseEnter={() => setHoveredIndex(pt.idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* 외곽 링 */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 8 : isLatest ? 6 : 5}
                  fill="#6366f1"
                  className="transition-all"
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 4 : isLatest ? 3 : 2.5}
                  fill="#ffffff"
                />

                {/* 점수 텍스트 */}
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor="middle"
                  className="text-[11px] font-mono font-black fill-zinc-800 dark:fill-zinc-100"
                >
                  {pt.item.score}점
                </text>

                {/* X축 회차/날짜 라벨 */}
                <text
                  x={pt.x}
                  y={height - paddingBottom + 16}
                  textAnchor="middle"
                  className="text-[9px] font-bold fill-zinc-500 dark:fill-zinc-400"
                >
                  {pt.item.examName ? pt.item.examName.split(' ')[0] : `${pt.idx + 1}회`}
                </text>
                <text
                  x={pt.x}
                  y={height - paddingBottom + 28}
                  textAnchor="middle"
                  className="text-[8px] font-mono fill-zinc-400 dark:fill-zinc-500"
                >
                  {pt.item.date ? pt.item.date.split(' ')[0].slice(5) : ''}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 툴팁 표시 */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute z-20 pointer-events-none p-3 rounded-2xl bg-zinc-900/95 text-white dark:bg-white/95 dark:text-zinc-900 shadow-xl text-xs space-y-1 animate-fadeIn border border-white/10 dark:border-zinc-800 backdrop-blur-md"
            style={{
              left: `${Math.min(width - 150, Math.max(20, points[hoveredIndex].x - 60))}px`,
              top: `${Math.max(10, points[hoveredIndex].y - 80)}px`
            }}
          >
            <div className="font-extrabold flex items-center justify-between gap-3">
              <span>{points[hoveredIndex].item.examName || '실전 모의고사'}</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500 text-white font-mono text-[10px]">
                {points[hoveredIndex].item.grade}등급
              </span>
            </div>
            <div className="text-[11px] opacity-80">
              원점수: <strong className="font-mono">{points[hoveredIndex].item.score}점</strong> (1컷 대비 {points[hoveredIndex].item.score >= points[hoveredIndex].item.cut1 ? `+${points[hoveredIndex].item.score - points[hoveredIndex].item.cut1}점` : `${points[hoveredIndex].item.score - points[hoveredIndex].item.cut1}점`})
            </div>
            {points[hoveredIndex].item.percentile && (
              <div className="text-[10px] opacity-70">
                추정 백분위: {points[hoveredIndex].item.percentile}%
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreTrendChart;
