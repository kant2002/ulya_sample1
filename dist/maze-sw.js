"use strict";
self.addEventListener('install', (e) => {
    e.waitUntil(caches.open('fox-store').then((cache) => cache.addAll([
        '/ulya_sample1/maze.html',
        '/ulya_sample1/dist/maze.js',
        '/ulya_sample1/assets/142000__jop9798__steps-on-a-wooden-floor.wav'
    ])));
});
self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)));
});
