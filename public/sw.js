self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("slowpoker-shell-v1").then((cache) =>
      cache.addAll(["/", "/dashboard", "/new-game", "/manifest.json"]),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request)),
  );
});
