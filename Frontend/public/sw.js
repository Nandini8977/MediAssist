const CACHE_NAME = "mediassist-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/assets/index.css",
  "/assets/index.js",
];

// Install Service Worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Service Worker: Caching assets");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event - Network First Strategy for API calls, Cache First for assets
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // API calls: Network first, fallback to cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then(response => {
          if (response) {
            return response;
          }
          // Return offline response for API calls
          return new Response(
            JSON.stringify({
              offline: true,
              message: "You are offline. Limited functionality available.",
            }),
            {
              status: 503,
              statusText: "Service Unavailable",
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            }
          );
        });
      })
    );
  } else {
    // Assets: Cache first, fallback to network
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          // Clone the response
          const responseClone = response.clone();

          // Cache successful responses
          if (response.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }
});
