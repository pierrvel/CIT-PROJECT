// ========================================================
// 💡 Screen Wake Lock API 유틸리티
// ========================================================

export const isWakeLockSupported = () => {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
};

export const requestScreenWakeLock = async () => {
  if (!isWakeLockSupported()) return null;
  try {
    const lock = await navigator.wakeLock.request('screen');
    return lock;
  } catch (err) {
    console.warn('[WakeLock] Request failed:', err);
    return null;
  }
};

export const releaseScreenWakeLock = async (lock) => {
  if (!lock) return;
  try {
    await lock.release();
  } catch (err) {
    console.warn('[WakeLock] Release error:', err);
  }
};
