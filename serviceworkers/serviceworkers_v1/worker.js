// The SW will be shutdown when not in use to save memory,
// be aware that any global state is likely to disappear
console.log('SW startup');

self.addEventListener('install', function(event) {
  console.log('SW installed');
  console.log(caches);
  console.log(navigator);
  console.log(location);
  console.log(performance);
  console.log(console);
  console.log(clients);
  console.log(registration);
});

self.addEventListener('activate', function(event) {
  console.log('SW activated');
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);
  console.log('Caught a fetch! ' + requestUrl);
  console.log(requestUrl.searchParams);
  if (requestUrl.pathname.indexOf('/API-v1/') === 0) {
    event.respondWith(
      new Response('{"message":"Hello World!' + event.request.url + '"}'),
      {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "set-cookie": "UserID=JohnDoe; Max-Age=3600; Version=1",
          "server": "Service Worker server",
          "x-powered-by": "Service Worker"
        }
      }
    );
  }
});
