// DualCore Cockpit Service Worker
// Version: 1.0.0
const CACHE_NAME = 'cockpit-pwa-v1';

// 핵심 오프라인 셸 자원 (초기 설치 시 즉시 프리캐싱)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png'
];

// 1. Install 단계: 앱 셸 사전 캐싱 및 즉시 활성화 준비
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Precache partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate 단계: 이전 버전의 오래된 캐시 청소 및 클라이언트 즉시 제어
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch 단계: 지능형 오프라인 캐싱 전략
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // GET 요청만 캐싱 (POST/PUT/DELETE 등은 무조건 네트워크 패스스루)
  if (request.method !== 'GET') return;

  // 브라우저 확장 프로그램 등 비-HTTP 스키마 제외
  if (!url.protocol.startsWith('http')) return;

  // 기기간 PIN 동기화 API 및 외부 데이터베이스 요청은 실시간 네트워크 최우선 (오프라인 캐싱 배제)
  if (url.pathname.startsWith('/rooms') || url.pathname.startsWith('/api') || url.hostname.includes('firebaseio.com')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: 'offline', message: '현재 오프라인 상태입니다.' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // A. 페이지 내비게이션 (HTML 요청): Network-First (최신본 시도 후 실패시 오프라인 캐시)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // 오프라인 상태일 때 캐시된 index.html 반환
          const cached = await caches.match('/index.html') || await caches.match('/');
          if (cached) return cached;
          return new Response('<h1>오프라인 모드</h1><p>앱 셸을 불러올 수 없습니다. 인터넷에 연결 후 다시 시도해주세요.</p>', {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        })
    );
    return;
  }

  // B. 정적 자원 (JS, CSS, 폰트, 이미지 등): Stale-While-Revalidate 전략
  // 캐시가 있으면 즉시 반환(초고속 로딩) + 백그라운드에서 최신 자원 가져와 캐시 갱신
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          // 네트워크 실패 시 조용히 넘김 (캐시된 응답이 이미 쓰임)
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. 메시지 수신: 즉시 업데이트 명령 수신 처리
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
