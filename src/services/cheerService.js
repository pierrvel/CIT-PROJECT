// ==============================================================================
// 📣 D-Day 각오 전광판 실시간 클라우드 동기화 서비스 (Firebase Firestore)
// ==============================================================================
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  increment,
  onSnapshot,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../utils/firebase';

export const CHEER_COLLECTION = 'cheer_board';
export const CHEER_TTL_MS = 24 * 60 * 60 * 1000; // 24시간 (86,400,000ms)

const MY_CHEERS_STORAGE_KEY = 'dualcore_my_cheer_ids';
const LOCAL_CHEERS_KEY = 'dualcore_cheer_board';

/**
 * 내가 작성한 다짐 ID 목록 관리 (브라우저 로컬 저장)
 */
export const getMyCheerIds = () => {
  try {
    const raw = localStorage.getItem(MY_CHEERS_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
};

export const markCheerAsMine = (id) => {
  try {
    const set = getMyCheerIds();
    set.add(String(id));
    localStorage.setItem(MY_CHEERS_STORAGE_KEY, JSON.stringify([...set].slice(-100)));
  } catch (e) {}
};

/**
 * 만료된 다짐(24시간 경과) 백그라운드 자동 영구 삭제
 */
export const purgeExpiredCheers = async (expiredIds = []) => {
  if (!isFirebaseConfigured || !db || expiredIds.length === 0) return;
  try {
    const batch = writeBatch(db);
    // Firestore 배치당 최대 500개 작업 지원, 안전하게 상위 50개씩 처리
    expiredIds.slice(0, 50).forEach((id) => {
      const docRef = doc(db, CHEER_COLLECTION, id);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (err) {
    // 자동 정리 실패 시 다음 주기에 재시도되므로 경고만 기록
    console.warn('[CheerService] Purge expired cheers warning:', err);
  }
};

/**
 * 로컬 스토리지 Fallback 데이터 로드 (24시간 만료 필터 적용)
 */
const loadLocalCheers = () => {
  try {
    const raw = localStorage.getItem(LOCAL_CHEERS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    const now = Date.now();
    const myIds = getMyCheerIds();

    // 24시간 이내의 다짐만 필터링
    const valid = list
      .filter((item) => item && (now - (Number(item.createdAt) || 0)) < CHEER_TTL_MS)
      .map((item) => ({
        ...item,
        isMine: item.isMine || myIds.has(String(item.id))
      }));

    localStorage.setItem(LOCAL_CHEERS_KEY, JSON.stringify(valid));
    return valid;
  } catch (e) {
    return [];
  }
};

/**
 * 실시간 전광판 구독 (onSnapshot)
 * - 24시간 이내 데이터만 자동 실시간 표출
 * - 24시간 경과 데이터는 백그라운드에서 자동 삭제
 * - Firebase 미설정 시 로컬 스토리지로 무중단 자동 전환
 */
export const subscribeToCheers = (onUpdate, onError) => {
  if (!isFirebaseConfigured || !db) {
    const initial = loadLocalCheers();
    onUpdate({ cheers: initial, isRealtime: false });

    // 로컬 스토리지 변경 이벤트 감지 (동일 브라우저 타 탭)
    const handleStorage = (e) => {
      if (e.key === LOCAL_CHEERS_KEY) {
        onUpdate({ cheers: loadLocalCheers(), isRealtime: false });
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }

  try {
    const colRef = collection(db, CHEER_COLLECTION);
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(100));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const now = Date.now();
        const activeCheers = [];
        const expiredIds = [];
        const myIds = getMyCheerIds();

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const createdAt = typeof data.createdAt === 'number'
            ? data.createdAt
            : (data.createdAt?.toMillis ? data.createdAt.toMillis() : now);
          const age = now - createdAt;

          if (age < CHEER_TTL_MS) {
            activeCheers.push({
              id: docSnap.id,
              nickname: data.nickname || '수험생',
              message: data.message || '',
              cheers: Number(data.cheers) || 0,
              createdAt,
              expiresAt: data.expiresAt || (createdAt + CHEER_TTL_MS),
              isMine: myIds.has(docSnap.id)
            });
          } else {
            // 24시간이 지난 다짐은 자동 삭제 큐에 추가
            expiredIds.push(docSnap.id);
          }
        });

        // 24시간 지난 데이터 백그라운드 영구 삭제 실행
        if (expiredIds.length > 0) {
          purgeExpiredCheers(expiredIds);
        }

        onUpdate({ cheers: activeCheers, isRealtime: true });
      },
      (error) => {
        console.warn('[CheerService] Realtime sync error, switching to local cache:', error);
        onUpdate({ cheers: loadLocalCheers(), isRealtime: false });
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.warn('[CheerService] Subscribe setup failed:', error);
    onUpdate({ cheers: loadLocalCheers(), isRealtime: false });
    return () => {};
  }
};

/**
 * 신규 다짐 등록 (24시간 TTL 자동 부착)
 */
export const postCheer = async ({ nickname, message }) => {
  const now = Date.now();
  const cleanNick = String(nickname || '').trim().slice(0, 12) || '수험생';
  const cleanMsg = String(message || '').trim().slice(0, 60);

  const newEntry = {
    nickname: cleanNick,
    message: cleanMsg,
    cheers: 0,
    createdAt: now,
    expiresAt: now + CHEER_TTL_MS,
    clientTimestamp: now
  };

  if (!isFirebaseConfigured || !db) {
    // 로컬 스토리지 저장
    const current = loadLocalCheers();
    const localId = `local_${now}_${Math.random().toString(36).slice(2, 7)}`;
    const fullEntry = { id: localId, ...newEntry, isMine: true };
    markCheerAsMine(localId);
    const updated = [fullEntry, ...current].slice(0, 60);
    localStorage.setItem(LOCAL_CHEERS_KEY, JSON.stringify(updated));
    return fullEntry;
  }

  try {
    const colRef = collection(db, CHEER_COLLECTION);
    const docRef = await addDoc(colRef, newEntry);
    markCheerAsMine(docRef.id);
    return { id: docRef.id, ...newEntry, isMine: true };
  } catch (error) {
    console.error('[CheerService] Failed to post cheer to Firestore:', error);
    throw error;
  }
};

/**
 * 불꽃 응원 카운트 1 증가
 */
export const clapCheer = async (id) => {
  if (!id) return;

  if (!isFirebaseConfigured || !db) {
    // 로컬 스토리지 내 응원 증가
    try {
      const current = loadLocalCheers();
      const updated = current.map((c) =>
        c.id === id ? { ...c, cheers: (Number(c.cheers) || 0) + 1 } : c
      );
      localStorage.setItem(LOCAL_CHEERS_KEY, JSON.stringify(updated));
    } catch (e) {}
    return;
  }

  try {
    const docRef = doc(db, CHEER_COLLECTION, id);
    await updateDoc(docRef, {
      cheers: increment(1)
    });
  } catch (error) {
    console.warn('[CheerService] Failed to clap cheer in Firestore:', error);
  }
};
