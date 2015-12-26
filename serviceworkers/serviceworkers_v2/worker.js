// The SW will be shutdown when not in use to save memory,
// be aware that any global state is likely to disappear
console.log('SW startup');

self.addEventListener('install', function(event) {
  console.log('SW installed');
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll(
        '/storage/'
      );
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('SW activated');
});

self.addEventListener('fetch', function(event) {
  console.log('Caught a fetch!');
  event.respondWith(new Response('{"message":"Hello 234office!"}'));
});



/*
function imgLoad(url) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'blob';

    request.onload = function() {
      if (request.status == 200) {
        resolve(request.response);
      } else {
        reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
      }
    };

    request.onerror = function() {
      reject(Error('There was a network error.'));
    };

    request.send();
  });
};

*/
