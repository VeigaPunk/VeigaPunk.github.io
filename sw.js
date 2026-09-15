/* Plazir-15 Fan Codex — sw.js replaced by the leisure-deck surface.
   This worker exists only to retire the old precache shell: it deletes
   every cache it owns and unregisters itself, then stays inert. */
self.addEventListener("install", function (e) { self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll(); })
      .then(function (clients) { clients.forEach(function (c) { c.navigate(c.url); }); })
  );
});
self.addEventListener("fetch", function () { /* passthrough: no respondWith */ });
