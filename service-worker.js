const CACHE_NAME = "snakegame-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/index.css",
  "/index.js",
  "/manifest.json",
  "/snake_logo.png",
  "/sound/bgmusic.mp3",
  "/sound/bgmusic2.mp3",
  "/sound/click.wav",
  "/sound/eat.wav",
  "/sound/hit.wav",
  "/sound/speedsound.wav",
  "/sound/startclick.wav"
];

// Install and cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch from cache first
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
