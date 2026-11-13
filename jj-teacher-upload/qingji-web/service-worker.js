const APP_ROOT = "/3628/";
const CACHE = "3628-shell-867d749cfb87ef42";
const FILES = ["/3628/_expo/static/js/web/index-bfdafb5f982300a8c5a8b93fd6e071ef.js","/3628/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ca4b48e04dc1ce10bfbddb262c8b835f.ttf","/3628/favicon.ico","/3628/icons/icon-180.png","/3628/icons/icon-192.png","/3628/icons/icon-512.png","/3628/manifest.webmanifest","/3628/metadata.json","/3628/register-pwa.js","/3628/"];
const STATIC = new Set(FILES);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('3628-shell-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(APP_ROOT)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) return response;
      return caches.match(APP_ROOT).then(cached => cached || response);
    }).catch(() => caches.match(APP_ROOT).then(cached => cached || Response.error())));
  } else if (STATIC.has(url.pathname)) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
  }
});
