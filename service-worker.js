self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open('secret-friend-cache').then(cache=>{
      return cache.addAll([
        '/',
        '/index.html',
        '/chat.html',
        '/admin.html',
        '/style.css',
        '/app.js',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(resp=>{return resp || fetch(e.request);})
  );
});
