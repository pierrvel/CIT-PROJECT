/**
 * 수험생 인스타 스토리 / 공스타 / 오르비 감성 성적표 카드 캔버스 렌더러
 * - 9:16 인스타 스토리 (1080 x 1920) 및 1:1 정사각 피드 (1080 x 1080) 초고화질 레티나 렌더링
 * - 다크 네온, 클래식 페이퍼, 선셋 바이올렛, 에메랄드 포커스 4대 테마 지원
 */

// 1. 테마 팔레트 정의
export const CARD_THEMES = {
  dark_neon: {
    id: 'dark_neon',
    name: '사이버 네온 다크',
    bgStart: '#09090b',
    bgEnd: '#18181b',
    glowColor: 'rgba(99, 102, 241, 0.28)',
    cardBg: 'rgba(24, 24, 27, 0.75)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',
    accent: '#6366f1',
    accentText: '#818cf8',
    badgeBg: 'rgba(99, 102, 241, 0.15)',
    badgeBorder: 'rgba(99, 102, 241, 0.35)',
    highlightGold: '#fbbf24'
  },
  sunset_violet: {
    id: 'sunset_violet',
    name: '선셋 바이올렛 감성',
    bgStart: '#1e1b4b',
    bgEnd: '#2e1065',
    glowColor: 'rgba(217, 70, 239, 0.30)',
    cardBg: 'rgba(46, 16, 101, 0.65)',
    cardBorder: 'rgba(244, 114, 182, 0.20)',
    textPrimary: '#ffffff',
    textSecondary: '#e9d5ff',
    textMuted: '#c084fc',
    accent: '#d946ef',
    accentText: '#f472b6',
    badgeBg: 'rgba(217, 70, 239, 0.20)',
    badgeBorder: 'rgba(217, 70, 239, 0.40)',
    highlightGold: '#fde047'
  },
  emerald_focus: {
    id: 'emerald_focus',
    name: '에메랄드 독서실',
    bgStart: '#022c22',
    bgEnd: '#064e3b',
    glowColor: 'rgba(16, 185, 129, 0.28)',
    cardBg: 'rgba(6, 78, 59, 0.65)',
    cardBorder: 'rgba(52, 211, 153, 0.20)',
    textPrimary: '#ffffff',
    textSecondary: '#a7f3d0',
    textMuted: '#6ee7b7',
    accent: '#10b981',
    accentText: '#34d399',
    badgeBg: 'rgba(16, 185, 129, 0.20)',
    badgeBorder: 'rgba(16, 185, 129, 0.40)',
    highlightGold: '#fef08a'
  },
  clean_paper: {
    id: 'clean_paper',
    name: '클래식 크라프트 페이퍼',
    bgStart: '#f8fafc',
    bgEnd: '#f1f5f9',
    glowColor: 'rgba(99, 102, 241, 0.12)',
    cardBg: 'rgba(255, 255, 255, 0.90)',
    cardBorder: 'rgba(226, 232, 240, 1)',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    accent: '#3b82f6',
    accentText: '#2563eb',
    badgeBg: 'rgba(59, 130, 246, 0.10)',
    badgeBorder: 'rgba(59, 130, 246, 0.25)',
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
    paddingX = 16,
    paddingY = 8,
    fontSize = 24,
    bgColor = 'rgba(99, 102, 241, 0.15)',
    borderColor = 'rgba(99, 102, 241, 0.35)',
    textColor = '#818cf8',
    fontWeight = '800',
    radius = 12
  } = options;

  ctx.save();
  ctx.font = `${fontWeight} ${fontSize}px "Pretendard Variable", Pretendard, sans-serif`;
  const textWidth = ctx.measureText(text).width;
  const badgeWidth = textWidth + paddingX * 2;
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

  // 텍스트
  ctx.fillStyle = textColor;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + paddingX, y + badgeHeight / 2);
  ctx.restore();

  return badgeWidth;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
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
    nickname = '수능만점러',
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

  // 캔버스 크기 세팅
  const width = 1080;
  const height = ratio === 'story' ? 1920 : 1080;
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
  const radGrad1 = ctx.createRadialGradient(250, 300, 50, 250, 300, 500);
  radGrad1.addColorStop(0, theme.glowColor);
  radGrad1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = radGrad1;
  ctx.fillRect(0, 0, width, height);

  const radGrad2 = ctx.createRadialGradient(width - 250, height - 300, 50, width - 250, height - 300, 550);
  radGrad2.addColorStop(0, theme.glowColor);
  radGrad2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = radGrad2;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // 3. 최상단 브랜드 헤더
  const paddingX = 70;
  let curY = ratio === 'story' ? 100 : 70;

  // DUALCORE COCKPIT 로고 마크
  ctx.save();
  ctx.fillStyle = theme.textPrimary;
  ctx.font = '900 32px "JetBrains Mono", monospace';
  ctx.fillText('DUALCORE COCKPIT', paddingX, curY);

  // 우측 D-Day & 날짜 뱃지
  const rightText = `${examDate} · ${dDayStr}`;
  ctx.font = '700 24px "JetBrains Mono", sans-serif';
  ctx.fillStyle = theme.accentText;
  const rightWidth = ctx.measureText(rightText).width;
  ctx.fillText(rightText, width - paddingX - rightWidth, curY);
  ctx.restore();

  curY += 35;

  // 헤더 서브텍스트
  ctx.save();
  ctx.fillStyle = theme.textMuted;
  ctx.font = '600 22px "Pretendard Variable", sans-serif';
  ctx.fillText('수험생 지능형 생산성 OS · 실전 모의고사 리포트', paddingX, curY);
  ctx.restore();

  curY += ratio === 'story' ? 65 : 45;

  // 4. 메인 카드 박스 (Glassmorphism Container)
  const cardW = width - paddingX * 2;
  const cardH = ratio === 'story' ? (mode === 'single' ? 1420 : 1460) : 780;
  const cardX = paddingX;
  const cardY = curY;

  ctx.save();
  // 카드 그림자
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;

  drawRoundRect(ctx, cardX, cardY, cardW, cardH, 36);
  ctx.fillStyle = theme.cardBg;
  ctx.fill();

  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // 5. 카드 내부 컨텐츠 렌더링
  let innerY = cardY + (ratio === 'story' ? 70 : 50);
  const innerX = cardX + 60;
  const innerW = cardW - 120;

  // 5-1. 시험명 및 수험생 닉네임 라벨
  ctx.save();
  ctx.fillStyle = theme.accentText;
  ctx.font = '800 24px "Pretendard Variable", sans-serif';
  ctx.fillText(examName.toUpperCase(), innerX, innerY);
  innerY += 35;

  ctx.fillStyle = theme.textPrimary;
  ctx.font = '900 42px "Pretendard Variable", sans-serif';
  ctx.fillText(`${nickname} 님의 실전 성적표`, innerX, innerY);
  ctx.restore();

  innerY += ratio === 'story' ? 55 : 40;

  // 구분선
  ctx.save();
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(innerX, innerY);
  ctx.lineTo(innerX + innerW, innerY);
  ctx.stroke();
  ctx.restore();

  innerY += ratio === 'story' ? 60 : 40;

  // ========================================================
  // 모드 분기 A: 단일 과목 집중 모드 (mode === 'single')
  // ========================================================
  if (mode === 'single') {
    const sub = singleData;

    // 과목명 & 선택과목
    ctx.save();
    ctx.fillStyle = theme.textPrimary;
    ctx.font = '900 38px "Pretendard Variable", sans-serif';
    ctx.fillText(`${sub.subjectName} (${sub.optionName})`, innerX, innerY);
    ctx.restore();

    innerY += ratio === 'story' ? 80 : 50;

    // 대형 점수 표시 & 등급 뱃지
    ctx.save();
    ctx.fillStyle = theme.textPrimary;
    ctx.font = `900 ${ratio === 'story' ? '150px' : '110px'} "JetBrains Mono", monospace`;
    const scoreStr = `${sub.score}`;
    ctx.fillText(scoreStr, innerX, innerY + (ratio === 'story' ? 80 : 60));
    const scoreMetrics = ctx.measureText(scoreStr);

    ctx.font = '700 36px "Pretendard Variable", sans-serif';
    ctx.fillStyle = theme.textMuted;
    ctx.fillText('점 / 100', innerX + scoreMetrics.width + 15, innerY + (ratio === 'story' ? 80 : 60));

    // 등급 뱃지
    const gradeBadgeText = `${sub.grade}등급`;
    drawBadge(ctx, gradeBadgeText, innerX + innerW - 170, innerY - 10, {
      paddingX: 28,
      paddingY: 14,
      fontSize: 34,
      bgColor: sub.grade === 1 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
      borderColor: sub.grade === 1 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(99, 102, 241, 0.5)',
      textColor: sub.grade === 1 ? '#10b981' : theme.accentText,
      fontWeight: '900',
      radius: 20
    });
    ctx.restore();

    innerY += ratio === 'story' ? 180 : 130;

    // 3분할 세부 지표 박스 (표준점수, 백분위, 1컷 대비 격차)
    const statBoxW = (innerW - 30) / 3;
    const statBoxH = ratio === 'story' ? 160 : 120;

    const stats = [
      { label: '예상 표준점수', value: `${sub.standardScore}점`, sub: '환산 표점' },
      { label: '예상 백분위', value: `${sub.percentile}%`, sub: '상위 백분율' },
      { label: '1등급 컷 대비', value: sub.deltaFromCut1 >= 0 ? `+${sub.deltaFromCut1}점` : `${sub.deltaFromCut1}점`, sub: '1컷 기준선' }
    ];

    stats.forEach((st, idx) => {
      const bx = innerX + idx * (statBoxW + 15);
      ctx.save();
      drawRoundRect(ctx, bx, innerY, statBoxW, statBoxH, 20);
      ctx.fillStyle = theme.badgeBg;
      ctx.fill();
      ctx.strokeStyle = theme.cardBorder;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = theme.textMuted;
      ctx.font = '700 20px "Pretendard Variable", sans-serif';
      ctx.fillText(st.label, bx + 24, innerY + 38);

      ctx.fillStyle = theme.textPrimary;
      ctx.font = '900 36px "JetBrains Mono", monospace';
      ctx.fillText(st.value, bx + 24, innerY + 90);

      ctx.fillStyle = theme.accentText;
      ctx.font = '600 18px "Pretendard Variable", sans-serif';
      ctx.fillText(st.sub, bx + 24, innerY + 125);
      ctx.restore();
    });

    innerY += statBoxH + (ratio === 'story' ? 60 : 35);

    // 실전 소요 시간 정보
    if (sub.elapsedTimeStr) {
      ctx.save();
      ctx.fillStyle = theme.textSecondary;
      ctx.font = '700 22px "Pretendard Variable", sans-serif';
      ctx.fillText(`⏱️ 실제 시험 소요 시간: ${sub.elapsedTimeStr}`, innerX, innerY);
      ctx.restore();
      innerY += ratio === 'story' ? 50 : 35;
    }

    // 좌우명/한마디 박스
    if (quote) {
      ctx.save();
      const quoteBoxH = ratio === 'story' ? 150 : 100;
      drawRoundRect(ctx, innerX, innerY, innerW, quoteBoxH, 20);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fill();
      ctx.strokeStyle = theme.cardBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = theme.highlightGold;
      ctx.font = '900 22px "Pretendard Variable", sans-serif';
      ctx.fillText('💬 수험생 복기 & 다짐 한마디', innerX + 24, innerY + 40);

      ctx.fillStyle = theme.textPrimary;
      ctx.font = 'italic 700 24px "Pretendard Variable", sans-serif';
      wrapText(ctx, `"${quote}"`, innerX + 24, innerY + 80, innerW - 48, 34);
      ctx.restore();
    }
  }

  // ========================================================
  // 모드 분기 B: 전과목 종합 성적표 모드 (mode === 'overall')
  // ========================================================
  else {
    const ov = overallData;

    // 대학 라인 뱃지 헤더
    ctx.save();
    drawRoundRect(ctx, innerX, innerY, innerW, ratio === 'story' ? 120 : 90, 20);
    ctx.fillStyle = theme.badgeBg;
    ctx.fill();
    ctx.strokeStyle = theme.badgeBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = theme.accentText;
    ctx.font = '800 20px "Pretendard Variable", sans-serif';
    ctx.fillText('🎯 현재 정시 대학 합격선 티어', innerX + 24, innerY + 34);

    ctx.fillStyle = theme.textPrimary;
    ctx.font = '900 32px "Pretendard Variable", sans-serif';
    ctx.fillText(`[${ov.tierName}] ${ov.tierRange} 📍`, innerX + 24, innerY + 75);
    ctx.restore();

    innerY += (ratio === 'story' ? 120 : 90) + (ratio === 'story' ? 45 : 30);

    // 3대 핵심 종합 지표 카드
    const statBoxW = (innerW - 30) / 3;
    const statBoxH = ratio === 'story' ? 140 : 100;

    const mainStats = [
      { label: '국수탐 백분위 평균', value: `${ov.avgPercentile}%`, color: theme.accentText },
      { label: '국수탐 표준점수 합', value: `${ov.totalStdScore}점`, color: theme.textPrimary },
      { label: '전국 상위 누적', value: `상위 ${ov.cumulativePercent}%`, color: theme.highlightGold }
    ];

    mainStats.forEach((st, idx) => {
      const bx = innerX + idx * (statBoxW + 15);
      ctx.save();
      drawRoundRect(ctx, bx, innerY, statBoxW, statBoxH, 18);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fill();
      ctx.strokeStyle = theme.cardBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = theme.textMuted;
      ctx.font = '700 18px "Pretendard Variable", sans-serif';
      ctx.fillText(st.label, bx + 20, innerY + 35);

      ctx.fillStyle = st.color;
      ctx.font = '900 32px "JetBrains Mono", monospace';
      ctx.fillText(st.value, bx + 20, innerY + 80);
      ctx.restore();
    });

    innerY += statBoxH + (ratio === 'story' ? 45 : 30);

    // 6과목 그리드 테이블
    ctx.save();
    ctx.fillStyle = theme.textPrimary;
    ctx.font = '900 26px "Pretendard Variable", sans-serif';
    ctx.fillText('과목별 성적 일람표', innerX, innerY);
    ctx.restore();

    innerY += 30;

    const subGridH = ratio === 'story' ? 70 : 55;
    const subjects = ov.subjects || [];

    subjects.forEach((s) => {
      ctx.save();
      drawRoundRect(ctx, innerX, innerY, innerW, subGridH, 14);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fill();
      ctx.strokeStyle = theme.cardBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      // 과목명 & 선택과목
      ctx.fillStyle = theme.textPrimary;
      ctx.font = '800 22px "Pretendard Variable", sans-serif';
      ctx.fillText(`${s.name} (${s.option})`, innerX + 24, innerY + (subGridH / 2) + 7);

      // 점수
      ctx.fillStyle = theme.textSecondary;
      ctx.font = '800 22px "JetBrains Mono", monospace';
      ctx.fillText(`${s.score}점`, innerX + innerW - 240, innerY + (subGridH / 2) + 7);

      // 백분위
      ctx.fillStyle = theme.textMuted;
      ctx.font = '600 20px "JetBrains Mono", monospace';
      ctx.fillText(`백분위 ${s.percentile}%`, innerX + innerW - 160, innerY + (subGridH / 2) + 7);

      // 등급 뱃지
      drawBadge(ctx, `${s.grade}등급`, innerX + innerW - 65, innerY + 12, {
        paddingX: 12,
        paddingY: 4,
        fontSize: 18,
        bgColor: s.grade === 1 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
        borderColor: s.grade === 1 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(99, 102, 241, 0.5)',
        textColor: s.grade === 1 ? '#10b981' : theme.accentText,
        radius: 8
      });
      ctx.restore();

      innerY += subGridH + (ratio === 'story' ? 14 : 10);
    });

    innerY += ratio === 'story' ? 35 : 20;

    // 좌우명
    if (quote) {
      ctx.save();
      ctx.fillStyle = theme.textSecondary;
      ctx.font = 'italic 700 22px "Pretendard Variable", sans-serif';
      ctx.fillText(`"${quote}"`, innerX + 10, innerY + 15);
      ctx.restore();
    }
  }

  // 6. 최하단 푸터 워터마크
  const footerY = height - (ratio === 'story' ? 80 : 50);
  ctx.save();
  ctx.fillStyle = theme.textMuted;
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText('DUALCORE COCKPIT · 수험생 올인원 생산성 OS', paddingX, footerY);

  const hashText = '#수능 #공스타 #모의고사 #정시파이터';
  ctx.font = '600 20px "Pretendard Variable", sans-serif';
  ctx.fillStyle = theme.accentText;
  const hashW = ctx.measureText(hashText).width;
  ctx.fillText(hashText, width - paddingX - hashW, footerY);
  ctx.restore();
}
