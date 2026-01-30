// sw.js - Service Worker para caching
const CACHE_NAME = 'conectafisio-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/pages/dashboard.html',
  '/assets/css/style.css',
  '/assets/css/dashboard.css',
  '/assets/js/base.js',
  '/assets/js/main.js',
  '/assets/js/dashboard.js',
  '/partials/header.html',
  '/partials/footer.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
