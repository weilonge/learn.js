const dbPromise = openDatabase('testSW', 1);

function main() {
  const worker = registerSharedWorker();
  worker.port.start();
  window.myWorker = worker;

  worker.port.addEventListener('message', (event) => {
    const msg = `Got Data: ${event.data}`;
    writeLogToDom(msg);
  });

  window.addEventListener('load', () => {
    installDebugDashboard(worker);
  });
}

function registerSharedWorker() {
  const url = new URL(window.location.href);
  const workerUrl = new URL('/worker.js', url.origin);
  for (const [key, value] of url.searchParams) {
    if (key.startsWith('wp')) {
      workerUrl.searchParams.append(key, value);
    }
  }

  const workerName = url.searchParams.get('name');
  const options = workerName ? { name: workerName } : undefined;
  console.log(options);
  return new SharedWorker(workerUrl, options);
}

async function installDebugDashboard(worker) {
  const messageDom = document.getElementById('message');
  messageDom.addEventListener(
    'click',
    () => sendMessageToSw(worker, 'Hello, I am from postMessage'),
  );
  const tsDom = document.getElementById('ts');

  const initMessage = 'init';
  writePgLogToDb(initMessage);
  writeLogToDom(initMessage);

  let isIdle = false;

  setInterval(async () => {
    const record = await readTimestamp(await dbPromise);
    if (!record || !record.data) {
      throw new Error('Timestamp is Unavailable!!');
    }
    const { data: ts } = record;
    const now = Date.now();
    if ((now - ts) > 4000) {
      const message = `SW is terminated (Last seen: ${(new Date(ts)).toLocaleString()})`;
      writeLogToDom(message);

      if (!isIdle) {
        writePgLogToDb(message);
      }
      isIdle = true;
      tsDom.classList.add('terminated');
      tsDom.classList.remove('awake');
    } else {
      isIdle = false;
      tsDom.classList.remove('terminated');
      tsDom.classList.add('awake');
    }
    const controller = navigator.serviceWorker.controller;
    tsDom.textContent = `${(new Date(ts)).toLocaleString()} / ${controller ? controller.state : undefined}`;
  }, 2000);
}

async function sendMessageToSw(worker, message) {
  const _message = `Send message: ${message}`;
  worker.port.postMessage(message);
  writePgLogToDb(_message);
  writeLogToDom(_message);
}

async function writePgLogToDb(message) {
  return writeLogToDb(
    await dbPromise,
    `[PG][${(new Date()).toLocaleString()}] ${message}`,
  );
}

function writeLogToDom(message) {
  const autoscrollDom = document.getElementById('autoscroll');
  const logDom = document.getElementById('log');
  const newLog = document.createElement('div');
  newLog.textContent = `[PG][${(new Date()).toLocaleString()}] ${message}`;
  logDom.appendChild(newLog);
  if (autoscrollDom.checked) {
    logDom.scrollTop = logDom.scrollHeight;
  }
}

main();
