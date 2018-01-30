
const VERSION = "Kitten Cache v1"

self.addEventListener('install', function(event) {
    event.waitUntil(
    caches.open(VERSION).then((cache) => {
        return cache.addAll([
            // Seed the cache with our required resources. Ideally, this is
            // done programmatically.
            'index.html',
            'js/resources.js',
            'js/controller.js',
            'css/levi.css',
            // We need to manually cache our offline kitten because we
            // explicitly disallow other images in cacheIfNeeded
            'imgs/darkkitten.jpg'
        ])
        .then(() => self.skipWaiting());
        }).catch(cache => {
            console.log("Cache failure: " + cache);
        })
    );
});

self.addEventListener('activate', function(event) {
    var cacheWhitelist = [VERSION];
    event.waitUntil(() => {
        // Once activated, nullify old caches...
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (cacheWhitelist.indexOf(key) === -1)
                    return caches.delete(key);
            }));
        });
        // ... and take charge of existing clients
        self.clients.claim();
    });
});

function cacheIfNeeded(response) {
    const url = response.request.url;
    if (url.endsWith(".jpg"))
        return;
    if (url.endsWith(".json"))
        return;
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    let responseClone = response.clone();

    caches.open(VERSION).then(function (cache) {
        cache.put(event.request, responseClone);
    });
}

self.addEventListener('fetch', function(event) {
    event.respondWith(
        // This code defaults to live results whenever possible, ignoring our caches
        fetch(event.request).then(response => {
            // We could choose to cache requests here using cacheIfNeeded(response)
            return response;
        }).catch(response => {
            // Our fetch failed, switch to cache.
            return caches.match(event.request).then(function(response) {
                // caches.match() always resolves
                // but in case of success response will have value
                if (event.request.url.endsWith("imgs/kitten.jpg")) {
                    // Swap our kitten for DARK kitten
                    return caches.match('imgs/darkkitten.jpg');
                } else if (event.request.url.endsWith("data/status.json")) {
                    // We're offline. Respond as such.
                    return new Response('{ "status": "offline" }');
                } else {
                    return response; // May or may not be undefined.
                }
            }).catch(error => {
                console.error("A cache request threw", error);
                return undefined;
            });
        })
    );
});
