const CACHE='dptmt-v019-r1';
const ASSETS=['./','./index.html','./offline.js','./storage.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('message',e=>{if(e.data==='CHECK_OFFLINE')e.waitUntil((async()=>{const c=await caches.open(CACHE);const ok=(await Promise.all(ASSETS.map(a=>c.match(a)))).every(Boolean);e.ports[0]?.postMessage({ok});})());});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith(new URL(self.registration.scope).pathname))return;e.respondWith((async()=>{const c=await caches.open(CACHE);if(e.request.mode==='navigate'){const base=new URL(self.registration.scope);if(u.pathname===base.pathname||u.pathname===new URL('index.html',base).pathname){const r=await c.match('./index.html');if(r)return r;}}return (await c.match(e.request))||fetch(e.request);})());});
