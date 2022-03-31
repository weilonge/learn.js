function openDatabase(name, version) {
  return new Promise((resolve, reject) => {
    const openReq = indexedDB.open(name, version);
    openReq.onupgradeneeded = () => {
      console.log('onupgradeneeded');
      const dbResult = openReq.result;
      dbResult.createObjectStore('timestamp', { keyPath: 'key' });
      dbResult.createObjectStore('log', { keyPath: 'key' });
    };
    openReq.onerror = () => reject(openReq.error);
    openReq.onsuccess = () => {
      resolve(openReq.result);
    };
  });
}

function writeTimestamp(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('timestamp', 'readwrite');
    tx.onerror = event => console.log('[TRX - error]', event);
    tx.onabort = event => console.log('[TRX - abort]', event);
    tx.oncomplete = event => resolve();

    const store = tx.objectStore('timestamp');
    store.put({ key: 'timestamp', data: Date.now()});
  });
}

function readTimestamp(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('timestamp', 'readwrite');
    tx.onerror = event => console.log('[TRX - error]', event);
    tx.onabort = event => console.log('[TRX - abort]', event);
    tx.oncomplete = event => resolve(getReq.result);

    const store = tx.objectStore('timestamp');
    const getReq = store.get('timestamp');
  });
}

function writeLogToDb(db, message) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('log', 'readwrite');
    tx.onerror = event => console.log('[TRX - error]', event);
    tx.onabort = event => console.log('[TRX - abort]', event);
    tx.oncomplete = event => resolve();

    const store = tx.objectStore('log');
    store.put({ key: Date.now(), data: message});
  });
}

