cache_name = 'static-cache-1';
files= ['./index.html'];

self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(cache_name).then((cache) => {
            return cache.addAll(files)
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((key_list) => {
            return Promise.all(key_list.map((key) => {
                if (key !== cache_name) {
                    return caches.delete(key)
                }
            }))
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode !== 'navigate') { return }
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.open(cache_name).then((cache) => {
                return cache.match('index.html')
            });
        })
    );
});
