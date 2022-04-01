const dbPromise = openDatabase('testSW', 1);
const swrPromise = navigator.serviceWorker.ready;

navigator.serviceWorker.getRegistrations().then((list) => {
  for(var rr in list){
    console.log(list[rr]);
  }
});

navigator.serviceWorker.register('/worker.js', {
  scope: '/'
}).then(async function(reg) {
  console.log('◕‿◕', reg);
}, function(err) {
  console.log('ಠ_ಠ', err);
});

window.addEventListener('load', () => {
  init();
});

window.addEventListener('beforeunload', async () => {
  const message = 'Close!';
  await writePgLogToDb(message);
});

async function init() {
  const messageDom = document.getElementById('message');
  messageDom.addEventListener(
    'click',
    () => sendMessageToSw('Hello, I am from postMessage'),
  );
  const fetchDom = document.getElementById('fetch');
  fetchDom.addEventListener('click', () => sendFetchRequest());
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
      const message = `SW is idle (Last seen: ${(new Date(ts)).toLocaleString()})`;
      writeLogToDom(message);

      if (!isIdle) {
        writePgLogToDb(message);
      }
      isIdle = true;
      tsDom.classList.add('idle');
      tsDom.classList.remove('awake');
    } else {
      isIdle = false;
      tsDom.classList.remove('idle');
      tsDom.classList.add('awake');
    }
    tsDom.textContent = (new Date(ts)).toLocaleString();
  }, 2000);
}

function closeDevTools() {
  const message = `Close DevTools`;
  writeLogToDom(message);
  writePgLogToDb(message);
}

async function sendFetchRequest() {
  const data = await fetch('./hello_world');
  const message = `Fetch Data: ${await data.text()}`;
  writePgLogToDb(message);
  writeLogToDom(message);
}

async function sendMessageToSw(message) {
  const _message = `Send message: ${message}`;
  (await swrPromise).active.postMessage(message);
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
