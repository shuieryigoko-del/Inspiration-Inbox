/* 灵感收纳盒 Service Worker —— 离线缓存（PWA，v1.4.1）
 * 策略：
 *   - HTML / manifest：网络优先，失败才用缓存（保证新版本尽快生效）
 *   - 图标等静态资源：缓存优先，后台更新
 *   - 安装时用 cache-busting 预缓存，避免拿到 HTTP 缓存里的旧文件
 * 用户数据（IndexedDB）不经网络，不受此文件影响。 */
const CACHE = 'inspiration-inbox-v1.4.1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      // 加查询串绕开浏览器 HTTP 缓存，确保拿到新版外壳；以干净路径为键存入
      Promise.all(SHELL.map(u =>
        fetch(u + (u.includes('?') ? '&' : '?') + 'cb=' + CACHE)
          .then(res => c.put(u, res))
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 允许页面通知立即接管新版本
self.addEventListener('message', (e) => {
  if(e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.origin !== location.origin) return;

  // 页面与清单：网络优先（拿不到网络才回退缓存，保证离线可用）
  if(req.mode === 'navigate' || /\.(html|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/')){
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() =>
        caches.match(req).then(cached => cached || caches.match('./index.html'))
      )
    );
    return;
  }

  // 其他静态资源（图标等）：缓存优先 + 后台更新
  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(()=>Response.error());
      return cached || network;
    })
  );
});
