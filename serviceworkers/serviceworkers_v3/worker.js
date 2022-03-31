// The SW will be shutdown when not in use to save memory,
// be aware that any global state is likely to disappear
const version = 1005;
console.log('[SW] startup', version);
self.importScripts('db.js');

let db;

self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('[SW] installed');
});

self.addEventListener('activate', function(event) {
  console.log('[SW] activated');
});

self.addEventListener('fetch', function(event) {
  db && writeLogToDb(db, '[SW] fetch');
  return undefined;
});

self.addEventListener('message', function(event) {
  db && writeLogToDb(db, `[SW] message: ${event.data}`);
});

init();
async function init() {
  db = await openDatabase('testSW', 1);

  writeLogToDb(db, '[SW] startWritingTimestamp', version);

  const cb = () => {
    writeTimestamp(db);
    console.log('setTimeout - polling');
    setTimeout(cb, 2000);
  };
  cb();
}
