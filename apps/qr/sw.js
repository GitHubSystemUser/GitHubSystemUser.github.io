const cacheName = "cache-v0";
const ressources = ["/"];
const broadcast = new BroadcastChannel("app");

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(ressources);
        })
    );
});

self.addEventListener("fetch", (event) => {
    // event.respondWith(caches.match(event.request).then((res) => {
    //     return res || fetch(event.request);
    // }));
});

self.addEventListener("activate", (event) => {
    broadcast.postMessage({ event: "buildInstalled" });
    event.waitUntil(
        caches.keys().then((keys) => {
            Promise.all(keys.map((key) => {
                if (!cacheName.includes(key)) return caches.delete(key);
            }))
        })
    );
});

broadcast.addEventListener("message", (event) => {
    if (event.data && event.data.command === "skipWaiting") self.skipWaiting();
});