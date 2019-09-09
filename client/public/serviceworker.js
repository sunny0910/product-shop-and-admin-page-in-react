var cacheName = 'react-cache-v3';
self.addEventListener('install', (event) => {
var urlsToCache = [
  '/serviceworker.js',
  '/static/js/main.chunk.js',
  '/offline.html'
];
    event.waitUntil(
        caches.open(cacheName)
        .then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', (event) => {
  self.skipWaiting();
  console.log('Activating service worker ');
  const whitelist = [cacheName]
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (whitelist.indexOf(cacheName) === -1) {
            console.log('deleting :', cacheName)
            return caches.delete(cacheName)
          }
        })
        )
    })
  )
})

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//       caches.match(event.request)
//         .then(function(response) {
//           // Cache hit - return response
//           if (response) {
//             // console.log('cache-hit')
//             return response;
//           }
  
//           return fetch(event.request).then(
//             function(response) {
//               // Check if we received a valid response
//               if(!response || response.status !== 200) {
//                 // console.log(event.request.url, response)
//                 return response;
//               }
//               // IMPORTANT: Clone the response. A response is a stream
//               // and because we want the browser to consume the response
//               // as well as the cache consuming the response, we need
//               // to clone it so we have two streams.
//               var responseToCache = response.clone();
//               // console.log(event.request.url)
//               console.log('cloning response')
//               caches.open(cacheName)
//                 .then(function(cache) {
//                   cache.put(event.request, responseToCache);
//                 });
  
//               return response;
//             }
//           ).catch(() => {
//             console.log('catch')
//             console.log(cacheName)
//             return caches.open(cacheName).then(cache => {return cache.match('offline.html')})
//           })
//         })
//       );
//   });
  