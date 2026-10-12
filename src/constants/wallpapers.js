import { getFirebaseDbUrl } from '../utils/env';

// 프리셋 고화질 배경화면
export const PRESET_WALLPAPERS = [
  { name: '클린 그라디언트', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80' },
  { name: '심야 서재', url: 'https://images.unsplash.com/photo-1507842229451-7f01be7ff602?auto=format&fit=crop&w=1920&q=80' },
  { name: '새벽 데스크', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1920&q=80' },
  { name: '미니멀 우드', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80' }
];

export const DEFAULT_FIREBASE_DB_URL = getFirebaseDbUrl();
