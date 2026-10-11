import React, { useMemo } from 'react';

// ========================================================
// 🕰️ [수능 실전 아날로그 시계 컴포넌트 (CSAT Analog Clock)]
// ========================================================
export const CSATAnalogClock = ({
  subjectMeta,
  totalExamSeconds,
  remainingSeconds,
  isExamRunning,
  isDark = false,
  sizeClass = "w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80",
  currentPartName = ""
}) => {
  const elapsedSec = Math.max(0, totalExamSeconds - remainingSeconds);
  const startHour = subjectMeta?.startHour ?? 8;
  const startMin = subjectMeta?.startMin ?? 40;
  const startTotalSec = (startHour * 3600) + (startMin * 60);
  const currentVirtualSec = startTotalSec + elapsedSec;

  const vHour = Math.floor(currentVirtualSec / 3600);
  const vMin = Math.floor((currentVirtualSec % 3600) / 60);
  const vSec = currentVirtualSec % 60;

  // 종료 가상 시각
  const endVirtualSec = startTotalSec + totalExamSeconds;
  const endVHour = Math.floor(endVirtualSec / 3600);
  const endVMin = Math.floor((endVirtualSec % 3600) / 60);

  // 12시간제 각도 계산 (12시 정각 = 0도, 시계 방향)
  const hour12 = vHour % 12;
  const hourAngle = (hour12 * 30) + (vMin * 0.5) + (vSec * (0.5 / 60));
  const minAngle = (vMin * 6) + (vSec * 0.1);
  const secAngle = vSec * 6;

  const pad = (n) => String(n).padStart(2, '0');

  // 12개 시계 숫자 (1~12)
  const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  // 60개 분 눈금 생성
  const ticks = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    minute: i,
    isMajor: i % 5 === 0,
    angle: i * 6
  })), []);

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* 시계 SVG 본체 */}
      <div className={sizeClass}>
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            <radialGradient id="dialGradLight" cx="48%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="85%" stopColor="#fdfdfd" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </radialGradient>
            <radialGradient id="dialGradDark" cx="48%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="85%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            <linearGradient id="bezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#52525b" : "#cbd5e1"} />
              <stop offset="50%" stopColor={isDark ? "#27272a" : "#ffffff"} />
              <stop offset="100%" stopColor={isDark ? "#3f3f46" : "#94a3b8"} />
            </linearGradient>
          </defs>

          {/* 1. 외곽 베젤 림 & 다이얼 페이스 */}
          <circle
            cx="150"
            cy="150"
            r="146"
            fill="url(#bezelGrad)"
            stroke={isDark ? "#52525b" : "#94a3b8"}
            strokeWidth="2.5"
          />
          <circle
            cx="150"
            cy="150"
            r="140"
            fill={isDark ? "url(#dialGradDark)" : "url(#dialGradLight)"}
            stroke={isDark ? "#3f3f46" : "#cbd5e1"}
            strokeWidth="1.5"
          />

          {/* 2. 외곽 트랙 가이드 링 */}
          <circle
            cx="150"
            cy="150"
            r="133"
            fill="none"
            stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
            strokeWidth="3.5"
          />

          {/* 3. 60분 눈금 */}
          {ticks.map((t) => (
            <line
              key={t.minute}
              x1="150"
              y1={t.isMajor ? "20" : "24"}
              x2="150"
              y2="33"
              stroke={
                t.isMajor
                  ? (isDark ? "#f4f4f5" : "#09090b")
                  : (isDark ? "#71717a" : "#94a3b8")
              }
              strokeWidth={t.isMajor ? "3.2" : "1.2"}
              strokeLinecap="round"
              transform={`rotate(${t.angle} 150 150)`}
            />
          ))}

          {/* 4. 1~12 시간 숫자 (실제 수능 시험장 시계와 동일한 가독성 산세리프) */}
          {numbers.map((num) => {
            const angleRad = (num * 30 * Math.PI) / 180;
            const x = 150 + 94 * Math.sin(angleRad);
            const y = 150 - 94 * Math.cos(angleRad) + 6.5;
            return (
              <text
                key={num}
                x={x}
                y={y}
                textAnchor="middle"
                className="font-mono select-none pointer-events-none"
                fill={isDark ? "#fafafa" : "#09090b"}
                fontSize={num === 12 || num === 3 || num === 6 || num === 9 ? "21" : "16.5"}
                style={{ fontWeight: 900 }}
              >
                {num}
              </text>
            );
          })}

          {/* 5. 다이얼 페이스 상단 클래식 브랜딩 (바늘과 겹치지 않는 12시 하단 배치) */}
          <g textAnchor="middle" className="select-none pointer-events-none">
            <text
              x="150"
              y="100"
              fontSize="8.5"
              fontWeight="900"
              letterSpacing="2"
              fill={isDark ? "#a1a1aa" : "#64748b"}
            >
              CSAT PACER
            </text>
            <text
              x="150"
              y="114"
              fontSize="9.5"
              fontWeight="800"
              letterSpacing="0.8"
              fill="#6366f1"
            >
              {subjectMeta?.period || ''} {subjectMeta?.name || ''}
            </text>
          </g>

          {/* 6. 시침 (Hour Hand) */}
          <g
            transform={`rotate(${hourAngle} 150 150)`}
            style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.35))' }}
          >
            <path
              d="M 146.5 152 L 147 92 L 150 84 L 153 92 L 153.5 152 Z"
              fill={isDark ? "#f4f4f5" : "#0f172a"}
            />
            <circle cx="150" cy="150" r="5" fill={isDark ? "#f4f4f5" : "#0f172a"} />
          </g>

          {/* 7. 분침 (Minute Hand) */}
          <g
            transform={`rotate(${minAngle} 150 150)`}
            style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }}
          >
            <path
              d="M 148 152 L 148.5 50 L 150 42 L 151.5 50 L 152 152 Z"
              fill={isDark ? "#e4e4e7" : "#1e293b"}
            />
            <circle cx="150" cy="150" r="4" fill={isDark ? "#e4e4e7" : "#1e293b"} />
          </g>

          {/* 8. 초침 (Second Hand) */}
          <g
            transform={`rotate(${secAngle} 150 150)`}
            style={{ filter: 'drop-shadow(0px 1px 2px rgba(239,68,68,0.4))' }}
          >
            <line
              x1="150"
              y1="172"
              x2="150"
              y2="34"
              stroke="#ef4444"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="150" cy="166" r="3" fill="#ef4444" />
          </g>

          {/* 9. 중심 캡 */}
          <circle cx="150" cy="150" r="5.5" fill="#ef4444" />
          <circle cx="150" cy="150" r="2.2" fill="#ffffff" />
        </svg>
      </div>

      {/* 10. 시계 하단 실시간 가상 수험장 시각 캡슐 */}
      <div className="mt-2.5 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100/90 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs">
        <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">🕒 수험장 가상 시각:</span>
        <span className="text-sm font-black font-mono text-indigo-600 dark:text-indigo-400">
          {pad(vHour)}:{pad(vMin)}:{pad(vSec)}
        </span>
        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
          ({subjectMeta?.startTimeStr} ~ {pad(endVHour)}:{pad(endVMin)})
        </span>
      </div>
    </div>
  );
};

export default CSATAnalogClock;
