/**
 * 수험생 인스타 스토리 / 공스타 / 오르비 감성 성적표 카드 캔버스 렌더러
 * - 9:16 인스타 스토리 (1080 x 1920) 및 1:1 정사각 피드 (1080 x 1080) 정밀 좌표 레이아웃
 * - 테두리 침범 방지 & 텍스트 자동 크기 보정(Auto-fit) & 컬럼 그리드 완전 밀착
 */

// 1. 테마 팔레트 정의
export const CARD_THEMES = {
  dark_neon: {
    id: 'dark_neon',
    name: '사이버 네온 다크',
    bgStart: '#09090b',
    bgEnd: '#18181b',
    glowColor: 'rgba(99, 102, 241, 0.28)',
    cardBg: 'rgba(24, 24, 27, 0.85)',
    cardBorder: 'rgba(255, 255, 255, 0.14)',
    textPrimary: '#ffffff',
    textSecondary: '#e4e4e7',
    textMuted: '#a1a1aa',
    accent: '#6366f1',
    accentText: '#a5b4fc',
    badgeBg: 'rgba(99, 102, 241, 0.18)',
    badgeBorder: 'rgba(99, 102, 241, 0.45)',
    highlightGold: '#fde047'
  },
  sunset_violet: {
    id: 'sunset_violet',
    name: '선셋 바이올렛 감성',
    bgStart: '#1e1b4b',
    bgEnd: '#2e1065',
    glowColor: 'rgba(217, 70, 239, 0.32)',
    cardBg: 'rgba(46, 16, 101, 0.75)',
    cardBorder: 'rgba(244, 114, 182, 0.24)',
    textPrimary: '#ffffff',
    textSecondary: '#f3e8ff',
    textMuted: '#d8b4fe',
    accent: '#d946ef',
    accentText: '#f472b6',
    badgeBg: 'rgba(217, 70, 239, 0.22)',
    badgeBorder: 'rgba(217, 70, 239, 0.50)',
    highlightGold: '#fde047'
  },
  emerald_focus: {
    id: 'emerald_focus',
    name: '에메랄드 독서실',
    bgStart: '#022c22',
    bgEnd: '#064e3b',
    glowColor: 'rgba(16, 185, 129, 0.30)',
    cardBg: 'rgba(6, 78, 59, 0.75)',
    cardBorder: 'rgba(52, 211, 153, 0.25)',
    textPrimary: '#ffffff',
    textSecondary: '#d1fae5',
    textMuted: '#a7f3d0',
    accent: '#10b981',
    accentText: '#6ee7b7',
    badgeBg: 'rgba(16, 185, 129, 0.22)',
    badgeBorder: 'rgba(16, 185, 129, 0.50)',
    highlightGold: '#fef08a'
  },
  clean_paper: {
    id: 'clean_paper',
    name: '클래식 크라프트 페이퍼',
    bgStart: '#f8fafc',
    bgEnd: '#e2e8f0',
    glowColor: 'rgba(99, 102, 241, 0.15)',
    cardBg: 'rgba(255, 255, 255, 0.96)',
    cardBorder: 'rgba(203, 213, 225, 1)',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    accent: '#2563eb',
    accentText: '#1d4ed8',
    badgeBg: 'rgba(37, 99, 235, 0.12)',
    badgeBorder: 'rgba(37, 99, 235, 0.30)',
    highlightGold: '#d97706'
  }
};

// 2. 캔버스 헬퍼 함수들
function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawBadge(ctx, text, x, y, options = {}) {
  const {
    paddingX = 14,
    paddingY = 6,
    fontSize = 20,
    bgColor = 'rgba(99, 102, 241, 0.15)',
    borderColor = 'rgba(99, 102, 241, 0.35)',
    textColor = '#818cf8',
    fontWeight = '800',
    radius = 10,
    fixedWidth = null
  } = options;

  ctx.save();
  ctx.font = `${fontWeight} ${fontSize}px "Pretendard Variable", Pretendard, sans-serif`;
  const textWidth = ctx.measureText(text).width;
  const badgeWidth = fixedWidth || (textWidth + paddingX * 2);
  const badgeHeight = fontSize + paddingY * 2;

  // 배경
  drawRoundRect(ctx, x, y, badgeWidth, badgeHeight, radius);
  ctx.fillStyle = bgColor;
  ctx.fill();

  // 테두리
  if (borderColor) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 텍스트 중앙 정렬
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + badgeWidth / 2, y + badgeHeight / 2);
  ctx.restore();

  return badgeWidth;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
      lineCount++;
      if (lineCount >= maxLines - 1) {
        // 남은 단어 생략 부호 처리
        const remaining = words.slice(n).join(' ');
        let truncated = remaining;
        while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
          truncated = truncated.slice(0, -1);
        }
        ctx.fillText(truncated + '...', x, curY);
        return curY + lineHeight;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, curY);
  return curY + lineHeight;
}

/**
 * 메인 캔버스 렌더러 함수
 * @param {HTMLCanvasElement} canvas
 * @param {Object} data 렌더링에 필요한 성적 및 설정 데이터
 */
export function renderScoreCardToCanvas(canvas, data) {
  if (!canvas) return;

  const {
    ratio = 'story', // 'story' (1080x1920) | 'square' (1080x1080)
    themeId = 'dark_neon',
    mode = 'single', // 'single' (단일 과목) | 'overall' (전과목 종합)
    nickname = '정시파이터',
    quote = '흔들리지 않고 끝까지 완주한다.',
    examName = '2025학년도 대학수학능력시험',
    examDate = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    dDayStr = 'D-30',

    // 단일 과목 데이터
    singleData = {
      subjectName: '수학 영역',
      optionName: '미적분',
      score: 96,
      grade: 1,
      percentile: 99,
      standardScore: 142,
      deltaFromCut1: 12,
      elapsedTimeStr: '92분 15초'
    },

    // 전과목 종합 데이터
    overallData = {
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
  } = data;

  const theme = CARD_THEMES[themeId] || CARD_THEMES.dark_neon;
  const isSquare = ratio === 'square';

  // 캔버스 크기 세팅
  const width = 1080;
  const height = isSquare ? 1080 : 1920;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. 전체 배경 그라데이션
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, theme.bgStart);
  bgGrad.addColorStop(1, theme.bgEnd);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. 앰비언트 오로라 원형 글로우
  ctx.save();
  const radGrad1 = ctx.createRadialGradient(250, 250, 30, 250, 250, isSquare ? 350 : 500);
  radGrad1.addColorStop(0, theme.glowColor);
  radGrad1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = radGrad1;
  ctx.fillRect(0, 0, width, height);

  const radGrad2 = ctx.createRadialGradient(width - 200, height - 200, 30, width - 200, height - 200, isSquare ? 400 : 550);
  radGrad2.addColorStop(0, theme.glowColor);
  radGrad2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = radGrad2;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // 3. 상단 헤더
  const paddingX = isSquare ? 50 : 65;
  let curY = isSquare ? 55 : 85;

  // DUALCORE COCKPIT 로고 마크
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `900 ${isSquare ? '26px' : '30px'} "JetBrains Mono", monospace`;
  ctx.fillText('DUALCORE COCKPIT', paddingX, curY);

  // 우측 D-Day & 날짜 뱃지
  const rightText = `${examDate} · ${dDayStr}`;
  ctx.textAlign = 'right';
  ctx.font = `700 ${isSquare ? '20px' : '24px'} "JetBrains Mono", sans-serif`;
  ctx.fillStyle = theme.accentText;
  ctx.fillText(rightText, width - paddingX, curY);
  ctx.restore();

  curY += isSquare ? 28 : 34;

  // 헤더 서브텍스트
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = theme.textMuted;
  ctx.font = `600 ${isSquare ? '18px' : '22px'} "Pretendard Variable", sans-serif`;
  ctx.fillText('수험생 지능형 생산성 OS · 실전 성적표 카드', paddingX, curY);
  ctx.restore();

  curY += isSquare ? 35 : 55;

  // 4. 메인 카드 박스 (Glassmorphism Container)
  const cardW = width - paddingX * 2;
  const cardH = isSquare
    ? (mode === 'single' ? 820 : 840)
    : (mode === 'single' ? 1480 : 1520);
  const cardX = paddingX;
  const cardY = curY;

  ctx.save();
  // 카드 그림자
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = isSquare ? 30 : 45;
  ctx.shadowOffsetY = 15;

  drawRoundRect(ctx, cardX, cardY, cardW, cardH, isSquare ? 28 : 34);
  ctx.fillStyle = theme.cardBg;
  ctx.fill();

  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.restore();

  // 5. 카드 내부 컨텐츠 렌더링
  let innerY = cardY + (isSquare ? 45 : 65);
  const innerX = cardX + (isSquare ? 40 : 50);
  const innerW = cardW - (isSquare ? 80 : 100);

  // 5-1. 시험명 라벨
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = theme.accentText;
  ctx.font = `800 ${isSquare ? '18px' : '22px'} "Pretendard Variable", sans-serif`;
  ctx.fillText(examName.toUpperCase(), innerX, innerY);
  innerY += isSquare ? 30 : 36;

  // 닉네임 타이틀
  ctx.fillStyle = theme.textPrimary;
  ctx.font = `900 ${isSquare ? '32px' : '40px'} "Pretendard Variable", sans-serif`;
  ctx.fillText(`${nickname} 님의 실전 성적표`, innerX, innerY);
  ctx.restore();

  innerY += isSquare ? 30 : 45;

  // 구분선
  ctx.save();
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(innerX, innerY);
  ctx.lineTo(innerX + innerW, innerY);
  ctx.stroke();
  ctx.restore();

  innerY += isSquare ? 35 : 55;

  // ========================================================
  // 모드 분기 A: 단일 과목 집중 모드 (mode === 'single')
  // ========================================================
  if (mode === 'single') {
    const sub = singleData;

    // 과목명 & 선택과목
    ctx.save();
    ctx.textAlign = 'left';
    ctx.fillStyle = theme.textPrimary;
    ctx.font = `900 ${isSquare ? '30px' : '38px'} "Pretendard Variable", sans-serif`;
    ctx.fillText(`${sub.subjectName} ${sub.optionName ? `(${sub.optionName})` : ''}`, innerX, innerY);
    ctx.restore();

    innerY += isSquare ? 40 : 65;

    // 대형 점수 표시 & 등급 뱃지
    ctx.save();
    ctx.textAlign = 'left';
    ctx.fillStyle = theme.textPrimary;
    ctx.font = `900 ${isSquare ? '100px' : '150px'} "JetBrains Mono", monospace`;
    const scoreStr = `${sub.score}`;
    ctx.fillText(scoreStr, innerX, innerY + (isSquare ? 75 : 110));
    const scoreMetrics = ctx.measureText(scoreStr);

    ctx.font = `700 ${isSquare ? '28px' : '36px'} "Pretendard Variable", sans-serif`;
    ctx.fillStyle = theme.textMuted;
    ctx.fillText('점', innerX + scoreMetrics.width + 12, innerY + (isSquare ? 75 : 110));

    // 등급 뱃지 (우측에 안전하게 배치)
    const gradeBadgeText = `${sub.grade}등급`;
    const badgeW = isSquare ? 120 : 150;
    const badgeH = isSquare ? 50 : 65;
    const badgeX = innerX + innerW - badgeW;
    const badgeY = innerY + (isSquare ? 20 : 40);

    drawRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, isSquare ? 16 : 20);
    ctx.fillStyle = sub.grade === 1 ? 'rgba(16, 185, 129, 0.22)' : 'rgba(99, 102, 241, 0.22)';
    ctx.fill();
    ctx.strokeStyle = sub.grade === 1 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(99, 102, 241, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = sub.grade === 1 ? '#10b981' : theme.accentText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${isSquare ? '28px' : '36px'} "Pretendard Variable", sans-serif`;
    ctx.fillText(gradeBadgeText, badgeX + badgeW / 2, badgeY + badgeH / 2);
    ctx.restore();

    innerY += isSquare ? 160 : 260;

    // 3분할 세부 지표 박스 (표준점수, 백분위, 1컷 대비 격차)
    const statBoxGap = isSquare ? 14 : 18;
    const statBoxW = (innerW - statBoxGap * 2) / 3;
    const statBoxH = isSquare ? 115 : 170;

    const stats = [
      { label: '예상 표준점수', value: `${sub.standardScore || sub.score}점`, sub: '환산 표점' },
      { label: '예상 백분위', value: `${sub.percentile}%`, sub: '상위 백분율' },
      {
        label: '1등급 컷 대비',
        value: sub.deltaFromCut1 >= 0 ? `+${sub.deltaFromCut1}점` : `${sub.deltaFromCut1}점`,
        sub: sub.deltaFromCut1 >= 0 ? '1컷 여유' : '1컷 부족'
      }
    ];

    stats.forEach((st, idx) => {
      const bx = innerX + idx * (statBoxW + statBoxGap);
      ctx.save();
      drawRoundRect(ctx, bx, innerY, statBoxW, statBoxH, isSquare ? 16 : 20);
      ctx.fillStyle = theme.badgeBg;
      ctx.fill();
      ctx.strokeStyle = theme.cardBorder;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // 라벨
      ctx.fillStyle = theme.textMuted;
      ctx.textAlign = 'center';
      ctx.font = `700 ${isSquare ? '16px' : '20px'} "Pretendard Variable", sans-serif`;
      ctx.fillText(st.label, bx + statBoxW / 2, innerY + (isSquare ? 28 : 42));

      // 값
      ctx.fillStyle = theme.textPrimary;
      ctx.font = `900 ${isSquare ? '28px' : '38px'} "JetBrains Mono", monospace`;
      ctx.fillText(st.value, bx + statBoxW / 2, innerY + (isSquare ? 68 : 100));

      // 서브 캡션
      ctx.fillStyle = theme.accentText;
      ctx.font = `600 ${isSquare ? '14px' : '18px'} "Pretendard Variable", sans-serif`;
      ctx.fillText(st.sub, bx + statBoxW / 2, innerY + (isSquare ? 96 : 142));
      ctx.restore();
    });

    innerY += statBoxH + (isSquare ? 35 : 65);

    // 좌우명/한마디 박스
    if (quote) {
      ctx.save();
      const quoteBoxH = isSquare ? 110 : 155;
      drawRoundRect(ctx, innerX, innerY, innerW, quoteBoxH, isSquare ? 16 : 20);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fill();
      ctx.strokeStyle = theme.cardBorder;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = theme.highlightGold;
      ctx.font = `800 ${isSquare ? '17px' : '22px'} "Pretendard Variable", sans-serif`;
      ctx.fillText('💬 수험생 복기 & 다짐 한마디', innerX + 24, innerY + (isSquare ? 32 : 42));

      ctx.fillStyle = theme.textPrimary;
      ctx.font = `italic 700 ${isSquare ? '19px' : '25px'} "Pretendard Variable", sans-serif`;
      wrapText(ctx, `"${quote}"`, innerX + 24, innerY + (isSquare ? 68 : 90), innerW - 48, isSquare ? 26 : 36);
      ctx.restore();
    }
  }

  // ========================================================
  // 모드 분기 B: 전과목 종합 성적표 모드 (mode === 'overall')
  // ========================================================
  else {
    const ov = overallData;

    // 대학 라인 뱃지 헤더 박스
    ctx.save();
    const tierBoxH = isSquare ? 80 : 120;
    drawRoundRect(ctx, innerX, innerY, innerW, tierBoxH, isSquare ? 16 : 20);
    ctx.fillStyle = theme.badgeBg;
    ctx.fill();
    ctx.strokeStyle = theme.badgeBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = theme.accentText;
    ctx.font = `800 ${isSquare ? '16px' : '20px'} "Pretendard Variable", sans-serif`;
    ctx.fillText('🎯 현재 정시 대학 합격선 티어', innerX + 22, innerY + (isSquare ? 28 : 38));

    ctx.fillStyle = theme.textPrimary;
    ctx.font = `900 ${isSquare ? '24px' : '34px'} "Pretendard Variable", sans-serif`;
    ctx.fillText(`[${ov.tierName}] ${ov.tierRange} 📍`, innerX + 22, innerY + (isSquare ? 58 : 82));
    ctx.restore();

    innerY += tierBoxH + (isSquare ? 20 : 35);

    // 3대 핵심 종합 지표 카드
    const statBoxGap = isSquare ? 12 : 16;
    const statBoxW = (innerW - statBoxGap * 2) / 3;
    const statBoxH = isSquare ? 90 : 135;

    const mainStats = [
      { label: '국수탐 백분위 평균', value: `${ov.avgPercentile}%`, color: theme.accentText },
      { label: '국수탐 표준점수 합', value: `${ov.totalStdScore}점`, color: theme.textPrimary },
      { label: '전국 상위 누적', value: `상위 ${ov.cumulativePercent}%`, color: theme.highlightGold }
    ];

    mainStats.forEach((st, idx) => {
      const bx = innerX + idx * (statBoxW + statBoxGap);
      ctx.save();
      drawRoundRect(ctx, bx, innerY, statBoxW, statBoxH, isSquare ? 14 : 18);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fill();
      ctx.strokeStyle = theme.cardBorder;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = theme.textMuted;
      ctx.font = `700 ${isSquare ? '14px' : '18px'} "Pretendard Variable", sans-serif`;
      ctx.fillText(st.label, bx + statBoxW / 2, innerY + (isSquare ? 26 : 38));

      ctx.fillStyle = st.color;
      ctx.font = `900 ${isSquare ? '24px' : '34px'} "JetBrains Mono", monospace`;
      ctx.fillText(st.value, bx + statBoxW / 2, innerY + (isSquare ? 65 : 95));
      ctx.restore();
    });

    innerY += statBoxH + (isSquare ? 22 : 35);

    // 6과목 그리드 헤더
    ctx.save();
    ctx.textAlign = 'left';
    ctx.fillStyle = theme.textPrimary;
    ctx.font = `900 ${isSquare ? '20px' : '26px'} "Pretendard Variable", sans-serif`;
    ctx.fillText('과목별 성적 일람표', innerX, innerY);
    ctx.restore();

    innerY += isSquare ? 18 : 28;

    const subGridH = isSquare ? 48 : 66;
    const subGap = isSquare ? 7 : 12;
    const subjects = ov.subjects || [];

    subjects.forEach((s) => {
      ctx.save();
      drawRoundRect(ctx, innerX, innerY, innerW, subGridH, isSquare ? 10 : 14);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fill();
      ctx.strokeStyle = theme.cardBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      // 1. 과목명 (좌측 기준)
      ctx.textAlign = 'left';
      ctx.fillStyle = theme.textPrimary;
      ctx.font = `800 ${isSquare ? '17px' : '22px'} "Pretendard Variable", sans-serif`;
      ctx.fillText(`${s.name} ${s.option ? `(${s.option})` : ''}`, innerX + 18, innerY + subGridH / 2 + (isSquare ? 5 : 7));

      // 2. 점수 (우측 기준 오프셋 240px)
      ctx.textAlign = 'right';
      ctx.fillStyle = theme.textSecondary;
      ctx.font = `800 ${isSquare ? '17px' : '22px'} "JetBrains Mono", monospace`;
      ctx.fillText(`${s.score}점`, innerX + innerW - (isSquare ? 190 : 230), innerY + subGridH / 2 + (isSquare ? 5 : 7));

      // 3. 백분위 (우측 기준 오프셋 110px)
      ctx.fillStyle = theme.textMuted;
      ctx.font = `600 ${isSquare ? '15px' : '19px'} "JetBrains Mono", monospace`;
      ctx.fillText(`${s.percentile}%`, innerX + innerW - (isSquare ? 105 : 125), innerY + subGridH / 2 + (isSquare ? 5 : 7));

      // 4. 등급 뱃지 (우측 벽 안쪽으로 완전히 안전하게 안착)
      const gBadgeW = isSquare ? 72 : 85;
      const gBadgeH = isSquare ? 30 : 38;
      const gBadgeX = innerX + innerW - gBadgeW - 12;
      const gBadgeY = innerY + (subGridH - gBadgeH) / 2;

      drawRoundRect(ctx, gBadgeX, gBadgeY, gBadgeW, gBadgeH, 8);
      ctx.fillStyle = s.grade === 1 ? 'rgba(16, 185, 129, 0.22)' : 'rgba(99, 102, 241, 0.22)';
      ctx.fill();
      ctx.strokeStyle = s.grade === 1 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(99, 102, 241, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = s.grade === 1 ? '#10b981' : theme.accentText;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${isSquare ? '15px' : '18px'} "Pretendard Variable", sans-serif`;
      ctx.fillText(`${s.grade}등급`, gBadgeX + gBadgeW / 2, gBadgeY + gBadgeH / 2);

      ctx.restore();

      innerY += subGridH + subGap;
    });

    innerY += isSquare ? 12 : 25;

    // 좌우명
    if (quote && !isSquare) {
      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = theme.textMuted;
      ctx.font = 'italic 700 22px "Pretendard Variable", sans-serif';
      ctx.fillText(`"${quote}"`, innerX + 10, innerY + 15);
      ctx.restore();
    }
  }

  // 6. 최하단 푸터 워터마크
  const footerY = height - (isSquare ? 35 : 60);
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = theme.textMuted;
  ctx.font = `600 ${isSquare ? '16px' : '20px'} "JetBrains Mono", monospace`;
  ctx.fillText('DUALCORE COCKPIT · 수험생 생산성 OS', paddingX, footerY);

  const hashText = '#수능 #공스타 #모의고사 #정시파이터';
  ctx.textAlign = 'right';
  ctx.font = `600 ${isSquare ? '16px' : '20px'} "Pretendard Variable", sans-serif`;
  ctx.fillStyle = theme.accentText;
  ctx.fillText(hashText, width - paddingX, footerY);
  ctx.restore();
}
