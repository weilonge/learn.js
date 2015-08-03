// The SW will be shutdown when not in use to save memory,
// be aware that any global state is likely to disappear
console.log('SW startup');

self.addEventListener('install', function(event) {
  console.log('SW installed');
});

self.addEventListener('activate', function(event) {
  console.log('SW activated');
});

self.addEventListener('fetch', function(event) {
  console.log('Caught a fetch!');
  if (event.request.url.indexOf('index.html') != -1) {
    event.respondWith(fetch(event.request.url));
  } else {
    event.respondWith(
      new Response('{"message":"Hello World!' + event.request.url + '"}'),
      {
        headers: {
          "content-type": "application/json"
        }
      }
    );
  }
});
