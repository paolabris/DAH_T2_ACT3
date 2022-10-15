const CACHE_NAME = "version-1";
const urlsToCache = [ 'index.html',  'offLine.html' ];
// Install SW
self.addEventListener('install', (event) =>{
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache)=>{
            console.log('FIC: Opened cache');
            return cache.addAll(urlsToCache);
        })
    )
})
// Listen for requests
self.addEventListener('fetch', (event) =>{
    event.respondWith(
        caches.match(event.request)
            .then(()=> {
                console.log('FIC: Listen for requests');
                return fetch(event.request)
                .catch(() => caches.match('offLine.html'))
            })
    )
})
// Activate the SW
self.addEventListener('activate', (event) =>{
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME);
    event.waitUntil(
        caches.keys().then((cacheNames)=> Promise.all(
            cacheNames.map((cacheName) => {
                console.log('FIC: Activate  Service Worker (SW)');
                if(!cacheWhiteList.includes(cacheName)) {
                    console.log('FIC: Delete CacheName');
                    return caches.delete(cacheName);
                }
            }
        )))
    )
})