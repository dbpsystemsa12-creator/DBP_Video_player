const CACHE_NAME = 'dbp-player-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Cache core assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Take over the page immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Intercept network requests and serve from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if found, otherwise try network
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      // Fallback for when offline and file isn't cached
      return caches.match('./index.html');
    })
  );
});
