const OFFLINE_VERSION = 1;
const OFFLINE_CACHE_NAME = "offline";
const OFFLINE_URL = "offline.html";
const offlineAssets = ["offline.html"];

const ONLINE_CACHE_NAME = "online";
const ONLINE_URL = "index.html";
const onlineAssets = ["index.html"];

self.addEventListener("install", (installEvent) => {
  console.log("install sw");
  installEvent.waitUntil(
    caches.open(OFFLINE_CACHE_NAME).then((cache) => {
      cache.addAll(offlineAssets);
    })
  );
});
self.addEventListener("activate", (event) => {
  console.log("activate sw");
  event.waitUntil(
    (async () => {
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    console.log("navigate sw");
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.log("Fetch failed; returning offline page instead.", error);

          const cache = await caches.open(OFFLINE_CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }
});
