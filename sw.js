// ============================================================
// sw.js - Service Worker للتطبيق
// ============================================================

const CACHE_NAME = 'al-bayan-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/manifest.json',
    '/images/icon-72.png',
    '/images/icon-192.png',
    '/images/icon-512.png'
];

// تثبيت الـ Service Worker
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('✅ تم فتح الكاش');
                return cache.addAll(urlsToCache).catch(function(err) {
                    console.warn('⚠️ بعض الملفات غير موجودة:', err);
                });
            })
    );
});

// جلب البيانات
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(function() {
                    return new Response('⚠️ غير متصل بالإنترنت', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});

// تفعيل الـ Service Worker
self.addEventListener('activate', function(event) {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});