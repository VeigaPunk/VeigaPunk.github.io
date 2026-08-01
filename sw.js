/* Plazir-15 Fan Codex — offline shell (GitHub Pages only). */
/* Bump CACHE when shipping material asset changes. */
var CACHE = "plazir15-v1";
var PRECACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./main.js",
  "./404.html",
  "./humans.txt",
  "./site.webmanifest",
  "./robots.txt",
  "./sitemap.xml",
  "./assets/favicon.svg",
  "./assets/dome.svg",
  "./assets/droid.svg",
  "./assets/hyperloop.svg",
  "./assets/ballot.svg",
  "./assets/landing.svg",
  "./assets/og-card.svg",
  "./.well-known/security.txt",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(PRECACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE) return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req).then(function (cached) {
        var network = fetch(req)
          .then(function (res) {
            if (res && res.ok && res.type === "basic") {
              cache.put(req, res.clone());
            }
            return res;
          })
          .catch(function () {
            return cached;
          });
        /* Prefer network when online; fall back to cache offline */
        return network.then(function (res) {
          return res || cached;
        });
      });
    })
  );
});
