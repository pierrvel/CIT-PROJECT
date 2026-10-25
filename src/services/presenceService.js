// ==============================================================================
// 👥 수험생 실시간 접속자 수(Presence) 감지 서비스 (Firebase Firestore)
// ==============================================================================
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../utils/firebase';

export const PRESENCE_COLLECTION = 'presence';
export const PRESENCE_ACTIVE_TIMEOUT_MS = 2 * 60 * 1000; // 2분 이내 활동 시 접속 중으로 판정
export const HEARTBEAT_INTERVAL_MS = 45 * 1000; // 45초마다 활동 신호 갱신

/**
 * 브라우저별 고유 안정 디바이스 ID 획득
 */
export const getStableDeviceId = () => {
  try {
    let id = localStorage.getItem('dc_device_presence_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem('dc_device_presence_id', id);
    }
    return id;
  } catch (e) {
    return 'dev_temp_' + Date.now();
  }
};

/**
 * 실시간 접속자 수 구독 및 하트비트 전송
 * @param {function} onCountChange 접속자 수(number) 수신 콜백
 * @returns {function} 클린업 함수
 */
export const initPresence = (onCountChange) => {
  if (!isFirebaseConfigured || !db) {
    // 로컬 환경 기본 1명
    onCountChange(1);
    return () => {};
  }

  const deviceId = getStableDeviceId();
  const docRef = doc(db, PRESENCE_COLLECTION, deviceId);
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // 1. 하트비트 신호 전송
  const sendHeartbeat = async () => {
    try {
      await setDoc(docRef, {
        lastSeen: Date.now(),
        device: isMobile ? 'mobile' : 'pc',
        updatedAt: Date.now()
      }, { merge: true });
    } catch (err) {
      // 오프라인 상태일 수 있으므로 조용히 무시
    }
  };

  // 즉시 1회 전송 및 주기적 갱신
  sendHeartbeat();
  const heartbeatTimer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

  // 2. 탭 활성화 시 즉시 하트비트 전송
  const handleVisibilityChange = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      sendHeartbeat();
    }
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  // 3. 브라우저 종료 시 정리 시도
  const handleUnload = () => {
    try {
      deleteDoc(docRef);
    } catch (e) {}
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', handleUnload);
  }

  // 4. 실시간 접속자 목록 수신 (2분 이내 활동 필터링)
  let unsubscribeSnapshot = () => {};
  try {
    const colRef = collection(db, PRESENCE_COLLECTION);
    unsubscribeSnapshot = onSnapshot(
      colRef,
      (snapshot) => {
        const now = Date.now();
        let activeCount = 0;
        const staleDocIds = [];

        snapshot.forEach((snap) => {
          const data = snap.data();
          const lastSeen = Number(data.lastSeen) || 0;
          const diff = now - lastSeen;

          if (diff <= PRESENCE_ACTIVE_TIMEOUT_MS) {
            activeCount += 1;
          } else if (diff > 10 * 60 * 1000) {
            // 10분 이상 지난 오래된 레코드는 정리 대상에 수집
            staleDocIds.push(snap.id);
          }
        });

        // 본인 포함 최소 1명 보장
        onCountChange(Math.max(1, activeCount));

        // 백그라운드 레코드 청소 (10분 초과)
        if (staleDocIds.length > 0 && db) {
          try {
            const batch = writeBatch(db);
            staleDocIds.slice(0, 20).forEach((id) => {
              batch.delete(doc(db, PRESENCE_COLLECTION, id));
            });
            batch.commit().catch(() => {});
          } catch (e) {}
        }
      },
      (error) => {
        console.warn('[Presence] Snapshot error, falling back to 1:', error);
        onCountChange(1);
      }
    );
  } catch (err) {
    onCountChange(1);
  }

  // 클린업 함수
  return () => {
    clearInterval(heartbeatTimer);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', handleUnload);
    }
    unsubscribeSnapshot();
    try {
      deleteDoc(docRef);
    } catch (e) {}
  };
};

export default {
  initPresence
};
