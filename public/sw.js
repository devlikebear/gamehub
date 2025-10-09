/**
 * GameHub Service Worker
 *
 * 오프라인 플레이를 위한 캐싱 전략:
 * - 정적 자산: Cache First
 * - 게임 페이지: Network First (빠른 업데이트)
 * - 도구 페이지: Network First (빠른 업데이트)
 * - BGM/이미지: Cache First (대용량 파일)
 */

const CACHE_VERSION = 'gamehub-v2';
const CACHE_NAMES = {
  static: `${CACHE_VERSION}-static`,
  dynamic: `${CACHE_VERSION}-dynamic`,
  images: `${CACHE_VERSION}-images`,
  audio: `${CACHE_VERSION}-audio`,
  tools: `${CACHE_VERSION}-tools`, // 도구 페이지용 캐시
};

// 사전 캐싱할 필수 자산
const PRECACHE_URLS = [
  '/',
  '/games',
  '/leaderboard',
  '/about',
  '/tools/audio',
  '/tools/sprite',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install - 사전 캐싱
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');

  event.waitUntil(
    caches.open(CACHE_NAMES.static)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate - 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // 현재 버전이 아닌 캐시 삭제
              return !Object.values(CACHE_NAMES).includes(name);
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch - 요청 처리
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 외부 리소스는 처리하지 않음
  if (url.origin !== location.origin) {
    return;
  }

  // BGM 파일 - Cache First
  if (url.pathname.startsWith('/audio/bgm/')) {
    event.respondWith(cacheFirst(request, CACHE_NAMES.audio));
    return;
  }

  // 이미지 - Cache First
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/)) {
    event.respondWith(cacheFirst(request, CACHE_NAMES.images));
    return;
  }

  // 정적 자산 - Cache First
  if (url.pathname.match(/\.(js|css|woff|woff2|ttf)$/)) {
    event.respondWith(cacheFirst(request, CACHE_NAMES.static));
    return;
  }

  // 도구 페이지 - Network First (빠른 업데이트)
  if (url.pathname.startsWith('/tools/')) {
    event.respondWith(networkFirst(request, CACHE_NAMES.tools));
    return;
  }

  // HTML 페이지 - Network First (게임 업데이트 빠른 반영)
  if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(request, CACHE_NAMES.dynamic));
    return;
  }

  // 기타 - Network First
  event.respondWith(networkFirst(request, CACHE_NAMES.dynamic));
});

/**
 * Cache First 전략
 * 캐시에 있으면 캐시에서, 없으면 네트워크에서 가져와서 캐싱
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    console.log('[SW] Cache hit:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);

    // 성공적인 응답만 캐싱
    if (response.status === 200) {
      cache.put(request, response.clone());
      console.log('[SW] Cached new resource:', request.url);
    }

    return response;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);

    // 오프라인일 때 대체 응답
    if (request.mode === 'navigate') {
      return cache.match('/');
    }

    throw error;
  }
}

/**
 * Network First 전략
 * 네트워크에서 먼저 가져오고, 실패하면 캐시 사용
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);

    // 성공적인 응답 캐싱
    if (response.status === 200) {
      cache.put(request, response.clone());
      console.log('[SW] Updated cache:', request.url);
    }

    return response;
  } catch (error) {
    console.warn('[SW] Network failed, trying cache:', request.url);

    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    // 캐시도 없으면 오프라인 페이지 반환
    if (request.mode === 'navigate') {
      const fallback = await cache.match('/');
      if (fallback) return fallback;
    }

    throw error;
  }
}

// 백그라운드 동기화 (선택적)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-scores') {
    console.log('[SW] Background sync: scores');
    // 점수 동기화 로직 (추후 구현)
  }
});

// 푸시 알림 (선택적)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  event.waitUntil(
    self.registration.showNotification(data.title || 'GameHub', {
      body: data.body || '새로운 게임이 추가되었습니다!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      vibrate: [200, 100, 200],
      data: data.data,
    })
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
