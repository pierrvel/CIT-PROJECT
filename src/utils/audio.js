// ========================================================
// 🔔 [Web Audio API 기반 수능 표준 타종음 합성기]
// ========================================================

export const playChimeTone = (freq, duration, gainVal = 0.1, startTime = 0, volumeScale = 1.0) => {
  if (volumeScale <= 0) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);

    const actualGain = Math.max(0.0001, gainVal * volumeScale);
    gain.gain.setValueAtTime(actualGain, audioCtx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + startTime);
    osc.stop(audioCtx.currentTime + startTime + duration);
  } catch (e) {
    console.warn('Audio tone failed', e);
  }
};

// 정통 수능 실로폰/차임벨 타종 시퀀스
export const playSchoolBellSequence = (pattern = 'start', volumeScale = 0.8) => {
  if (volumeScale <= 0) return;
  if (pattern === 'start') {
    // 본령 (시험 시작): 정통 4음계 맑은 실로폰 차임벨 (F5 -> A5 -> C6 -> F6)
    const notes = [698.46, 880.00, 1046.50, 1396.91];
    notes.forEach((freq, idx) => {
      playChimeTone(freq, 0.9, 0.12, idx * 0.32, volumeScale);
    });
  } else if (pattern === 'warning10m') {
    // 종료 10분 전 안내: 2음계 차임벨 (A5 -> F5)
    playChimeTone(880.00, 0.8, 0.12, 0, volumeScale);
    playChimeTone(698.46, 1.2, 0.12, 0.38, volumeScale);
  } else if (pattern === 'end') {
    // 종료령 (0초 도달): 3회 연속 롱 차임벨 (F5 -> D5 -> Bb4)
    const notes = [698.46, 587.33, 466.16];
    [0, 1.4].forEach((roundOffset) => {
      notes.forEach((freq, idx) => {
        playChimeTone(freq, 1.5, 0.14, roundOffset + idx * 0.38, volumeScale);
      });
    });
  }
};

export const playChime = (freq = 880, type = 'sine', duration = 0.15, volumeScale = 1.0) => {
  if (volumeScale <= 0) return;
  playChimeTone(freq, duration, 0.08, 0, volumeScale);
};
