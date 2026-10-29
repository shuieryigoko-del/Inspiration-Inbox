/* 灵感收纳盒 Service Worker —— 离线缓存（PWA）
 * 策略：安装时预缓存应用外壳；运行时同源请求 cache-first，导航失败回退 index.html。
 * 用户数据（IndexedDB）不经网络，不受此文件影响。 */
const CACHE = 'inspiration-inbox-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then(cached =>
      cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() =>
        req.mode === 'navigate' ? caches.match('./index.html') : Response.error()
      )
    )
  );
});
