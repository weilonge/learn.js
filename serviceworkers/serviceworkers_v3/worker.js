// The SW will be shutdown when not in use to save memory,
// be aware that any global state is likely to disappear
const version = 1050;
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

console.log('Hello', version);
self.addEventListener('fetch', function(event) {
  if (event.request.mode === 'navigate') {
    console.log('Hello');
    throw new Error('[Error] 123123123');
    /*
    const p = (new Promise((resolve, reject) => {
      throw new Error('My Another Dummy Error 12345');
      reject(new Error('Dummy'));
    })).catch(error => {
      if (event.request.mode === 'navigate') {
        console.log('[Error A] fallback to fetch', error);
        getExtraErrorData(error, event.request.url).then(extra => {
          console.log('[Error B]', extra);
        });
        throw new Error('[Error D] Another dummy  error', error);
      }
      return fetch(event.request);
    });
    event.respondWith(p);
    return;
    */
  }
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

async function getExtraErrorData(e, requestUrl) {
  console.log('[Error C] fallback to fetch', e);
  throw new Error('Another dummy  error', e);
  const extraEntries = [['requestUrl', requestUrl]];

  if (!(e instanceof Error)) {
    return new Map(extraEntries);
  }

  if (/quota/i.test(e.message)) {
    const result = await navigator.storage?.estimate?.();
    if (result) {
      extraEntries.push(...Object.entries(result));
    }
  }
  return new Map(extraEntries);
}
