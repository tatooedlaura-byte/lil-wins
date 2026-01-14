const CACHE_NAME = 'lilwins-v2';
const urlsToCache = [
  '/lil-wins/',
  '/lil-wins/index.html',
  '/lil-wins/styles.css',
  '/lil-wins/app.js',
  '/lil-wins/notifications.js',
  '/lil-wins/kingdom.js',
  '/lil-wins/city.js',
  '/lil-wins/spacebase.js',
  '/lil-wins/dungeon.js',
  '/lil-wins/graveyard.js',
  '/lil-wins/neighborhood.js'
];

// Install service worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache install failed:', err);
      })
  );
  self.skipWaiting();
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch with network-first strategy for dynamic content
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response
        const responseClone = response.clone();

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
        }

        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request);
      })
  );
});
