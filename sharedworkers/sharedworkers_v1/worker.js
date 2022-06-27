const version = 2000;
self.importScripts('db.js');
const dbPromise = openDatabase('testSW', 1);

let messageCount = 0;
let fetchCount = 0;
let pollingCount = 0;

function main() {
  const searchParams = new URLSearchParams(self.location.href);

  console.log('[SW] startup', { version, requestId: searchParams.get('wpRequestId') });
  writeSwLogToDb(`startup ${version}`);

  const ports = [];
  self.addEventListener('connect', function(event) {
    console.log('[SW] connect', version);
    writeSwLogToDb(`installed ${version}`);
    const newPorts = event.ports;
    ports.push(...newPorts);
    console.log(event);

    for (let port of newPorts) {
      port.addEventListener('message', function(event) {
        console.log(`[SW] Got a message: ${event.data}`, messageCount, fetchCount, pollingCount);
        messageCount++;
        writeSwLogToDb(`Got a message: ${event.data}`);
        port.postMessage(`(Received: [${event.data}])`);
      });
      port.start();
    }
  });
  installWatchDog();
}

async function installWatchDog() {
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

async function writeSwLogToDb(message) {
  return writeLogToDb(
    await dbPromise,
    `[SW][${(new Date()).toLocaleString()}] ${message}`,
  );
}

main();
