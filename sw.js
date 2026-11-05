// FitForge Service Worker v3
// - Your app files: always try the network first (so updates show up), fall back to cache offline
// - CDN libraries (React, fonts...): served from cache, refreshed in background
// - Everything else (your cloud sync / AI link) is never touched

const CACHE_NAME = 'fitforge-v3';
const CORE = ['/', '/index.html', '/config.js', '/manifest.json', '/icon-192.png', '/icon-512.png'];
const CDN_HOSTS = ['cdn.jsdelivr.net', 'cdn.tailwindcss.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(CORE.map(url => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.match(req).then(cached => {
        const fresh = fetch(req)
          .then(res => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, copy));
            return res;
          })
          .catch(() => cached);
        return cached || fresh;
      })
    );
  }
});
