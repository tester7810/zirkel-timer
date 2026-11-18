const CACHE = 'zirkel-v3';
// Ansage-Clips (Ordner v/). Neue Übung oder Clip: hier mit ergänzen, sonst fehlt er offline.
const CLIPS = ['prep', 'next', 'tre', 'side', 'done', 'jog',
  ...['liegestuetz', 'pistol', 'ironmike', 'huefte_einbein', 'klimmzug', 'nordic', 'dips', 'seitheben', 'reverse_fly', 'bizepscurl', 'crunch', 'reverse_crunch', 'pike', 'bulgarian'].map(x => 'ex_' + x),
  ...Array.from({ length: 25 }, (_, i) => 'speed_' + String((8 + i) / 2).replace('.', '_'))].map(n => `v/${n}.mp3`);
const FILES = ['./', 'index.html', 'app.js', 'figures.js', 'exercises.js', 'info.js', 'timeline.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', ...CLIPS];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    const hadOld = keys.some(k => k.startsWith('zirkel-') && k !== CACHE);
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
    // Beim Update einmal neu laden, damit sofort die neue Version erscheint (Trainingsstand bleibt gespeichert).
    if (hadOld) (await self.clients.matchAll({ type: 'window' })).forEach(c => c.navigate(c.url));
  })());
});

// Zuerst aus dem Speicher (offline-fähig), im Hintergrund aktualisieren.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r && r.ok) cache.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })());
});
