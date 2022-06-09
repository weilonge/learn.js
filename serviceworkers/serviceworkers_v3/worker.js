// The SW will be shutdown when not in use to save memory,
// be aware that any global state is likely to disappear
const version = 1088;
console.log('[SW] startup', version, self);
self.importScripts('db.js');
const dbPromise = openDatabase('testSW', 1);
writeSwLogToDb(`startup ${version}`);

let messageCount = 0;
let fetchCount = 0;
let pollingCount = 0;

self.addEventListener('install', function(event) {
  // self.skipWaiting();
  console.log('[SW] installed', version, self);
  writeSwLogToDb(`installed ${version}`);
});

self.addEventListener('activate', function(event) {
  console.log('[SW] activated', version, self);
  writeSwLogToDb(`activated ${version}`);
  // event.waitUntil(self.clients.claim());
  /*
  event.waitUntil(new Promise(resolve => {
    setTimeout(resolve, 8000);
  }));
  */
});

self.addEventListener('fetch', function(event) {
  fetchCount++;
  const msg = `Got a fetch request: ${event.request.url} / ${messageCount}, ${fetchCount}, ${pollingCount}`;
  console.log('[SW]', msg);
  writeSwLogToDb(msg);
  return undefined;
});

self.addEventListener('message', function(event) {
  console.log(`[SW] Got a message: ${event.data}`, messageCount, fetchCount, pollingCount, version);
  messageCount++;
  writeSwLogToDb(`Got a message: ${event.data}`);
});

async function init() {
  console.log('[SW] startWritingTimestamp', version);
  writeSwLogToDb(`startWritingTimestamp ${version}`);

  const cb = async () => {
    writeTimestamp(await dbPromise);
    pollingCount++;
    console.log(
      '[SW] setTimeout - polling',
      { messageCount, fetchCount, pollingCount },
      version,
    );
    setTimeout(cb, 2000);
  };
  cb();
}
init();

async function writeSwLogToDb(message) {
  return writeLogToDb(
    await dbPromise,
    `[SW][${(new Date()).toLocaleString()}] ${message}`,
  );
}
