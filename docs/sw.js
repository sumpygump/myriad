self.document = self;
self.window = self;

// Choose a cache name
const cacheName = 'cache-v1';
const precacheResources = [];
var basePath = '';

// List of the files to precache
if (document.location.href.indexOf('localhost') > 0) {
    precacheResources.push('/');
} else {
    precacheResources.push('/');
}
precacheResources.push.apply(
    precacheResources, [
        `${basePath}site.webmanifest`,
        `${basePath}css/tooltip.css`,
        `${basePath}img/android-chrome-192x192.png`,
        `${basePath}img/android-chrome-256x256.png`,
        `${basePath}img/favicon-16x16.png`,
        `${basePath}img/favicon-32x32.png`,
        `${basePath}img/mstile-150x150.png`,
        `${basePath}img/safari-pinned-tab.svg`
    ]
);
precacheResources.push('https://fonts.gstatic.com/s/robotomono/v22/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_Of2_ROW4.woff2');

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
    console.log('Service worker install event!');
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activate event!');
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
    console.log('Fetch intercepted for:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log(`Returning cached response for ${event.request.url}`);
                return cachedResponse;
            }
            console.log(`Caching response for ${event.request.url}`);
            return fetch(event.request);
        }),
    );
});
