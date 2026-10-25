/* Plazir-15 Fan Codex — sw.js (plazir15-v5)
   Precache shell for the codex surface. matchFirst strategy:
   cache-first with network fallback for same-origin GETs; the
   network (and only the network) for everything else. */
const CACHE = "plazir15-v5";
const PRECACHE = [
  "/", "/index.html", "/404.html", "/styles.css", "/main.js",
  "/assets/favicon.svg", "/humans.txt"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function matchFirst(request) {
  return caches.match(request).then((hit) => hit || fetch(request).then((res) => {
    if (request.method === "GET" && res.ok && new URL(request.url).origin === self.location.origin) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(request, copy));
    }
    return res;
  }));
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(matchFirst(e.request).catch(() => caches.match("/404.html")));
});
