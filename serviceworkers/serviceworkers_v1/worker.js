// The SW will be shutdown when not in use to save memory,
// be aware that any global state is likely to disappear
importScripts('lib/URI.js');
console.log('SW startup');

self.addEventListener('install', function(event) {
  console.log('SW installed');
});

self.addEventListener('activate', function(event) {
  console.log('SW activated');
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URI(event.request.url);
  console.log('Caught a fetch! ' + requestUrl);
  if (requestUrl.path.indexOf('/API-v1/') === 0) {
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
