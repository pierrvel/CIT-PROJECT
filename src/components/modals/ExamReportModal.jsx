import React from 'react';
import Icon from '../common/Icon';
import { formatTime } from '../../utils/pacing';

export const ExamReportModal = ({
  isOpen,
  onClose,
  currentSubject,
  pipelineParts,
  partElapsed,
  partStatus,
  reviewMemo,
  setReviewMemo,
  saveExamReport,
  onGoToGrader
}) => {
  if (!isOpen) return null;

  // Time Eater 파트 계산
  let timeEaterPart = null;
  let maxOverDelta = -999999;
  pipelineParts.forEach((p) => {
    const actual = partElapsed[p.id] || 0;
    const target = (p.targetMinutes || 10) * 60;
    const delta = actual - target;
    if (delta > maxOverDelta) {
      maxOverDelta = delta;
      timeEaterPart = { ...p, delta, actual, target };
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl glass-card bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Icon name="barChart" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-zinc-900 dark:text-white">실전 모의고사 타임어택 분석 리포트</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{currentSubject.name} • 실전 풀이 페이스 정밀 진단</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {timeEaterPart && (
          <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/70 flex items-start gap-3">
            <Icon name="alertTriangle" className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-rose-900 dark:text-rose-200">
                🚨 이번 시험의 Time Eater: [{timeEaterPart.name}]
              </h4>
              <p className="text-xs text-rose-800/80 dark:text-rose-300 mt-0.5">
                목표({timeEaterPart.targetMinutes}분) 대비 <strong>{timeEaterPart.delta > 0 ? `+${formatTime(timeEaterPart.delta)} 초과` : '시간 단축 성공'}</strong> 소요되었습니다.
                다음 실전에서는 해당 유형의 스킵(Skip) 타이밍을 앞당겨 마킹 시간을 확보하세요.
              </p>
            </div>
          </div>
        )}

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono">
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 text-xs">
              <tr>
                <th className="p-3 font-bold">순서 / 파트명</th>
                <th className="p-3 font-bold">목표 시간</th>
                <th className="p-3 font-bold">실제 소요</th>
                <th className="p-3 font-bold">오차(Δt)</th>
                <th className="p-3 font-bold text-center">완료</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
              {pipelineParts.map((p, idx) => {
                const actual = partElapsed[p.id] || 0;
                const target = p.targetMinutes * 60;
                const delta = actual - target;
                const isOver = delta > 0;
                return (
                  <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                    <td className="p-3 font-bold text-zinc-900 dark:text-white">
                      {idx + 1}. {p.name}
                    </td>
                    <td className="p-3 text-zinc-500">{p.targetMinutes}분</td>
                    <td className="p-3 font-bold">{formatTime(actual)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                        isOver
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {isOver ? `+${formatTime(delta)}` : `-${formatTime(Math.abs(delta))}`}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {partStatus[p.id] === 'completed' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ 완주</span>
                      ) : (
                        <span className="text-zinc-400">진행 중</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            ✍️ 오늘의 실전 복기 한 줄 메모
          </label>
          <textarea
            rows="2"
            placeholder="예: 문학에서 4분 단축했으나, 독서 과학 지문에서 멘탈 흔들림. 다음엔 비문학 넘기는 연습 필요."
            value={reviewMemo}
            onChange={(e) => setReviewMemo(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            {onGoToGrader && (
              <button
                type="button"
                onClick={() => {
                  saveExamReport();
                  onGoToGrader();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 transition-colors"
              >
                <Icon name="award" className="w-4 h-4 text-purple-500" />
                <span>저장 후 실모 채점 & 등급 대조 ➔</span>
              </button>
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={saveExamReport}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
            >
              리포트 영구 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamReportModal;
