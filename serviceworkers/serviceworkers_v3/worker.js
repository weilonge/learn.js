// The SW will be shutdown when not in use to save memory,
// be aware that any global state is likely to disappear
const version = 1017;
console.log('[SW] startup', version);
self.importScripts('db.js');
const dbPromise = openDatabase('testSW', 1);
writeSwLogToDb(`startup ${version}`);

let messageCount = 0;
let fetchCount = 0;
let pollingCount = 0;

console.log(self.service);
self.addEventListener('install', function(event) {
  // self.skipWaiting();
  console.log('[SW] installed', version);
  writeSwLogToDb(`installed ${version}`);
});

self.addEventListener('activate', function(event) {
  console.log('[SW] activated', version);
  writeSwLogToDb(`activated ${version}`);
});

self.addEventListener('fetch', function(event) {
  fetchCount++;
  const msg = `Got a fetch request: ${event.request.url} / ${messageCount}, ${fetchCount}, ${pollingCount}`;
  console.log('[SW]', msg);
  writeSwLogToDb(msg);
  return undefined;
});

self.addEventListener('message', function(event) {
  console.log(`[SW] Got a message: ${event.data}`, messageCount, fetchCount, pollingCount);
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
      self.serviceWorker.state,
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
