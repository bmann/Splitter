// Caches the app shell so Splitter opens offline.
// Cross-origin requests are never intercepted: posting, identity resolution and link
// previews must always hit the network, and a cached POST would be a lie.
const VERSION = 'splitter-v9';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './themes/index.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== location.origin) return;

  // Network-first for the page so a new version lands; the cached copy is the offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then(cache => cache.put('./index.html', copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Theme metadata changes when someone adds a theme, so keep it fresh; fall back to the cache.
  if (new URL(request.url).pathname.includes('/themes/')) {
    event.respondWith(
      fetch(new Request(request, { cache: 'no-store' }))
        .then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then(cache => cache.put(request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(hit => hit || fetch(request).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(VERSION).then(cache => cache.put(request, copy)).catch(() => {});
      }
      return res;
    }))
  );
});
