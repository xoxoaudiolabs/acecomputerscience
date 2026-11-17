// Service worker: offline support for Ace Computer Science.
// Our own files are fetched network-first (so updates show up straight away) with a
// cached fallback. Versioned CDN libraries (editor, Python, SQL) are cache-first.
const CACHE = 'ace-cs-v1';
const ASSETS = [
  './', './index.html', './css/styles.css', './css/study.css', './manifest.json', './icon.svg', './icon-maskable.svg',
  './js/app.js', './js/study.js', './js/studydata.js', './js/curriculum.js', './js/runners.js', './js/worker.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

function store(req, res) {
  if (res && (res.ok || res.type === 'opaque')) {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
  }
  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const sameOrigin = new URL(req.url).origin === location.origin;
  if (sameOrigin) {
    event.respondWith(
      fetch(req).then((res) => store(req, res)).catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
    );
  } else {
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => store(req, res))));
  }
});
