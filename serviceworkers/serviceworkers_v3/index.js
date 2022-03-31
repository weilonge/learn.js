let db;

navigator.serviceWorker.getRegistrations().then((list) => {
  for(var rr in list){
    console.log(list[rr]);
  }
});


navigator.serviceWorker.register('/worker.js', {
  scope: '/'
}).then(function(reg) {
  console.log('◕‿◕', reg);
}, function(err) {
  console.log('ಠ_ಠ', err);
});

window.addEventListener('load', () => {
  init();
});

window.addEventListener('beforeunload', async () => {
  const message = `[PG] Close! ${(new Date()).toLocaleString()} `;
  await writeLogToDb(db, message);
});

async function init() {
  const fetchDom = document.getElementById('fetch');
  fetchDom.addEventListener('click', async () => {
    const data = await fetch('./hello_world');
    const initMessage = `[PG] ${(new Date()).toLocaleString()} Fetch Data: ${await data.text()}`;
    writeLogToDb(db, initMessage);
    writeLogToDom(initMessage);
  });
  const tsDom = document.getElementById('ts');
  db = await openDatabase('testSW', 1);

  const initMessage = `[PG] ${(new Date()).toLocaleString()} init`;
  writeLogToDb(db, initMessage);
  writeLogToDom(initMessage);

  let isDead = false;

  setInterval(async () => {
    const record = await readTimestamp(db);
    if (!record || !record.data) {
      throw new Error('Timestamp is Unavailable!!');
    }
    const { data: ts } = record;
    const now = Date.now();
    if ((now - ts) > 4000) {
      const message = `[PG] ${(new Date()).toLocaleString()} SW is dead (Last: ${new Date(ts)})`;
      writeLogToDom(message);

      if (!isDead) {
        writeLogToDb(db, message);
      }
      isDead = true;
    } else {
      isDead = false;
    }
    tsDom.textContent = new Date(ts);
  }, 2000);
}

function closeDevTools() {
  const message = `[PG] ${(new Date()).toLocaleString()} Close DevTools`;
  writeLogToDom(message);
  writeLogToDb(db, message);
}

function writeLogToDom(message) {
  const logDom = document.getElementById('log');
  const newLog = document.createElement('div');
  newLog.textContent = message;
  logDom.appendChild(newLog);
}
