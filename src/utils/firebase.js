// ==============================================================================
// 🔥 Firebase SDK 초기화 및 Firestore 인스턴스 싱글톤 관리
// ==============================================================================
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFirebaseConfig } from './env';

let app = null;
let db = null;
let isConfigured = false;

try {
  const config = getFirebaseConfig();

  if (config.isConfigured) {
    app = getApps().length > 0 ? getApp() : initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId
    });
    db = getFirestore(app);
    isConfigured = true;
    console.info(`[Firebase] Initialized successfully for project '${config.projectId}'`);
  } else {
    // Firebase 미설정 시 로컬 스토리지 Fallback 유지 (무중단)
    console.info('[Firebase] Config keys not provided in .env. Running in offline/local fallback mode.');
  }
} catch (error) {
  console.warn('[Firebase] Initialization error:', error);
  app = null;
  db = null;
  isConfigured = false;
}

export { app, db, isConfigured as isFirebaseConfigured };
export default db;
