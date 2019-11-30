importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

workbox.core.setCacheNameDetails({
    prefix: '',
    suffix: '',
    precache: 'greatSoccerWorkbox',
    runtime: 'greatSoccerWorkbox'
});

workbox.precaching.precacheAndRoute([
    '/',
    '/index.html',
    '/service-worker.js',
    '/page/home.html',
    '/page/nav.html',
    '/page/team.html',
    '/page/me.html',
    '/js/materialize.min.js',
    '/js/jquery-3.4.1.min.js',
    '/js/idb.js',
    '/js/page.js',
    '/css/materialize.min.css',
    '/css/style.css',
]);

workbox.routing.registerRoute(new RegExp('https://api.football-data.org/'), workbox.strategies.networkFirst({
        cacheName: 'greatSoccerWorkbox'
    })
);

self.addEventListener('push', function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Great Soccer', options)
    );
});