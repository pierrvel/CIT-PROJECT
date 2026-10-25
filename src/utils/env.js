// ==============================================================================
// 🔐 환경변수 관리 유틸리티 (Environment Variables Helper)
// ==============================================================================
// Vite 환경(import.meta.env) 및 브라우저 스탠드얼론 환경 모두에서 안전하게 
// API URL 및 클라이언트 설정값을 로드합니다.
// ==============================================================================

/**
 * 안전한 import.meta.env 읽기 헬퍼
 * @param {string} key 환경변수 키 (예: 'VITE_API_BASE_URL')
 * @param {string} fallback 기본값
 * @returns {string}
 */
export const getEnvVar = (key, fallback = '') => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key] !== undefined) {
      const val = import.meta.env[key];
      return typeof val === 'string' ? val.trim() : String(val);
    }
  } catch (e) {
    // 스탠드얼론 환경 등 import.meta 미지원 환경 대비 fallback 처리
  }
  return fallback;
};

/**
 * 동기화 서버 / 백엔드 API 기본 Base URL 반환
 * 우선순위:
 * 1. VITE_API_BASE_URL 환경변수
 * 2. 현재 브라우저의 window.location.origin (http/https 호스팅 환경인 경우)
 * 3. 로컬 기본값 'http://localhost:8000'
 */
export const getApiBaseUrl = () => {
  const envUrl = getEnvVar('VITE_API_BASE_URL', '');
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
    return window.location.origin;
  }

  return 'http://localhost:8000';
};

/**
 * Firebase 실시간 데이터베이스 엔드포인트 URL 반환
 */
export const getFirebaseDbUrl = () => {
  return getEnvVar('VITE_FIREBASE_DB_URL', '');
};

/**
 * Firebase 웹 클라이언트 API 키 반환
 */
export const getFirebaseApiKey = () => {
  return getEnvVar('VITE_FIREBASE_API_KEY', '');
};

/**
 * Firebase Project ID 반환
 */
export const getFirebaseProjectId = () => {
  return getEnvVar('VITE_FIREBASE_PROJECT_ID', '');
};

/**
 * Firebase 통합 Web Config 객체 반환
 */
export const getFirebaseConfig = () => {
  const apiKey = getEnvVar('VITE_FIREBASE_API_KEY', '');
  const projectId = getEnvVar('VITE_FIREBASE_PROJECT_ID', '');
  const authDomain = getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', projectId ? `${projectId}.firebaseapp.com` : '');
  const storageBucket = getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', projectId ? `${projectId}.firebasestorage.app` : '');
  const messagingSenderId = getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', '');
  const appId = getEnvVar('VITE_FIREBASE_APP_ID', '');

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    isConfigured: Boolean(apiKey && projectId)
  };
};

/**
 * 프로덕션 배포 환경 여부
 */
export const isProduction = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.PROD || import.meta.env.VITE_APP_ENV === 'production';
    }
  } catch (e) {}
  return false;
};

/**
 * 6자리 PIN 동기화 최종 REST 엔드포인트 URL 생성
 * @param {string} pin 6자리 PIN 번호
 * @param {string} [customUrl] 사용자가 설정 모달에서 직접 입력한 커스텀 URL (있을 경우 최우선)
 * @returns {string}
 */
export const getSyncEndpoint = (pin, customUrl = '') => {
  const cleanPin = String(pin || '').trim();
  const custom = String(customUrl || '').trim();
  const envFirebase = getFirebaseDbUrl();

  // 1. 사용자가 직접 입력한 커스텀 Firebase/외부 URL 우선
  const targetUrl = custom || envFirebase;
  if (targetUrl && !targetUrl.includes('your-project-default') && !targetUrl.includes('dualcore-cockpit-default')) {
    return `${targetUrl.replace(/\/+$/, '')}/rooms/${cleanPin}.json`;
  }

  // 2. 환경변수 기반 또는 로컬 백엔드 서버 URL
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}/rooms/${cleanPin}.json`;
};
