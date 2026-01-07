// 更新版本號，確保瀏覽器知道有新東西
// 將版本號從 v2 改為 v3
const CACHE_NAME = 'cozy-pomodoro-v4';

// 加入 mp3 檔案到列表
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    './breakfast2.mp3'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching all assets including music...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 啟動時清除舊快取 (因為我們更新了 CACHE_NAME)
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
