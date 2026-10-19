// ========================================================
// 🔔 [Web Audio API 기반 수능 표준 타종음 합성기]
// ========================================================

// 싱글톤 AudioContext 인스턴스 (브라우저 하드웨어 컨텍스트 초과 방지)
let sharedAudioCtx = null;
let activeSequenceNodes = [];

/**
 * 안전한 단일 AudioContext 획득 및 자동 활성화 (Resume)
 * 브라우저별 AudioContext 최대 개수 제한(모바일 6개, 데스크톱 32개) 초과 원천 차단
 */
export const getAudioContext = () => {
  try {
    const AudioContextClass = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (!AudioContextClass) return null;

    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass();
    }

    // 브라우저 자동재생 정책으로 인하여 suspended 상태인 경우 즉시 활성화
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }

    return sharedAudioCtx;
  } catch (err) {
    console.warn('AudioContext initialization failed', err);
    return null;
  }
};

/**
 * 이전 재생 중인 타종 시퀀스를 부드럽게 페이드아웃 및 중단
 * (연타 시 소리가 찢어지거나 뭉개지는 현상 방지)
 */
export const stopActiveChimes = () => {
  if (!sharedAudioCtx || activeSequenceNodes.length === 0) return;
  try {
    const now = sharedAudioCtx.currentTime;
    activeSequenceNodes.forEach(({ osc, gain }) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(0, now, 0.015);
        osc.stop(now + 0.05);
      } catch (err) {
        try {
          osc.stop();
        } catch (e2) {}
      }
    });
    activeSequenceNodes = [];
  } catch (e) {
    console.warn('Failed to stop active chimes', e);
  }
};

/**
 * 단일 톤 합성 및 스케줄링 재생
 */
export const playChimeTone = (freq, duration, gainVal = 0.1, startTime = 0, volumeScale = 1.0, type = 'sine') => {
  if (volumeScale <= 0) return null;
  const audioCtx = getAudioContext();
  if (!audioCtx) return null;

  try {
    const now = audioCtx.currentTime;
    // 오디오 렌더 퀀텀(2.9ms)보다 안전하게 앞서도록 리드 타임 부여
    const startAt = Math.max(now + 0.005, now + Math.max(0, startTime));
    const stopAt = startAt + Math.max(0.02, duration);
    const attackTime = Math.min(0.02, Math.max(0.004, duration * 0.15));

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, startAt);

    const actualGain = Math.max(0.0001, Math.min(1.0, gainVal * volumeScale));

    // 클릭/팝 노이즈 방지용 부드러운 Attack & Exponential Decay Envelope
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(actualGain, startAt + attackTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startAt);
    osc.stop(stopAt + 0.02);

    const nodeRef = { osc, gain, stopAt };

    // 재생 완료 후 노드 정리 (가비지 컬렉션 및 메모리 누수 방지)
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch (e) {}
      const idx = activeSequenceNodes.indexOf(nodeRef);
      if (idx !== -1) activeSequenceNodes.splice(idx, 1);
    };

    return nodeRef;
  } catch (e) {
    console.warn('Audio tone failed', e);
    return null;
  }
};

// 정통 수능 실로폰/차임벨 타종 시퀀스
export const playSchoolBellSequence = (pattern = 'start', volumeScale = 0.8) => {
  if (volumeScale <= 0) return;

  // 연속 클릭 시 이전 타종 시퀀스를 정리하여 중첩 왜곡 방지
  stopActiveChimes();

  const audioCtx = getAudioContext();
  if (!audioCtx) return;

  if (pattern === 'start') {
    // 본령 (시험 시작): 정통 4음계 맑은 실로폰 차임벨 (F5 -> A5 -> C6 -> F6)
    const notes = [698.46, 880.00, 1046.50, 1396.91];
    notes.forEach((freq, idx) => {
      const node = playChimeTone(freq, 0.9, 0.12, idx * 0.32, volumeScale, 'sine');
      if (node) activeSequenceNodes.push(node);
    });
  } else if (pattern === 'warning10m') {
    // 종료 10분 전 안내: 2음계 차임벨 (A5 -> F5)
    const n1 = playChimeTone(880.00, 0.8, 0.12, 0, volumeScale, 'sine');
    const n2 = playChimeTone(698.46, 1.2, 0.12, 0.38, volumeScale, 'sine');
    if (n1) activeSequenceNodes.push(n1);
    if (n2) activeSequenceNodes.push(n2);
  } else if (pattern === 'end') {
    // 종료령 (0초 도달): 3회 연속 롱 차임벨 (F5 -> D5 -> Bb4)
    const notes = [698.46, 587.33, 466.16];
    [0, 1.4].forEach((roundOffset) => {
      notes.forEach((freq, idx) => {
        const node = playChimeTone(freq, 1.5, 0.14, roundOffset + idx * 0.38, volumeScale, 'sine');
        if (node) activeSequenceNodes.push(node);
      });
    });
  }
};

export const playChime = (freq = 880, type = 'sine', duration = 0.15, volumeScale = 1.0) => {
  if (volumeScale <= 0) return;
  playChimeTone(freq, duration, 0.08, 0, volumeScale, type);
};
