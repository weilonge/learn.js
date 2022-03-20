function openDatabase(name, version) {
  return new Promise((resolve, reject) => {
    const openReq = indexedDB.open(name, version);
    openReq.onupgradeneeded = () => {
      console.log('onupgradeneeded');
      const dbResult = openReq.result;
      dbResult.createObjectStore('table', { keyPath: 'key' });
    };
    openReq.onerror = () => reject(openReq.error);
    openReq.onsuccess = () => {
      resolve(openReq.result);
    };
  });
}

function prepareData(db) {
  // Prepare transaction...
  const tx = db.transaction('table', 'readwrite');
  tx.onerror = event => console.log('tx error', event);
  tx.onabort = event => console.log('tx abort', event);
  tx.oncomplete = event => console.log('tx complete', event);

  // Write some data.
  const store = tx.objectStore('table');
  store.put({ key: 1, data: 'foo'});
  store.put({ key: 2, data: 'bar'});
}

// Try to get all data with getAll API.
// Question:
// - Which events will be triggered? tx.error / tx.abort / tx.complete / req.error / req.success
//     - HIDE: req.success / tx.complete
function doExample0(db) {
  return new Promise(async resolve => {
    // Prepare transaction...
    const tx = db.transaction('table', 'readwrite');
    tx.onerror = event => {
      console.log('tx error', tx.error);
      console.log('tx error (event target error)', event.target.error);
    };
    tx.onabort = event => console.log('tx abort', event);
    tx.oncomplete = event => console.log('tx complete', event);

    // Try to get all data.
    const store = tx.objectStore('table');
    const getReq = store.getAll();
    getReq.onerror = event => console.log('req error', event);
    getReq.onsuccess = v => {
      console.log('req success', v);
      resolve(getReq.result);
    };
  });
}

// Try to abort the transaction after request success.
// HIDE: Here there's no errors, only the abort event fires:
// Question:
// - Which events will be triggered? tx.error / tx.abort / tx.complete / req.error / req.success
//     - HIDE: req.success / tx.abort
function doExample1(db) {
  // Prepare transaction...
  const tx = db.transaction('table', 'readwrite');
  tx.onerror = event => {
    console.log('tx error', tx.error);
    console.log('tx error (event target error)', event.target.error);
  };
  tx.onabort = event => console.log('tx abort', event);
  tx.oncomplete = event => console.log('tx complete', event);

  // Try to get all data.
  const store = tx.objectStore('table');
  const getReq = store.getAll();
  getReq.onerror = event => console.log('req error', event);
  getReq.onsuccess = v => {
    console.log('req success', v);
    // After sucess, abort the transaction
    tx.abort();
  };
}

// Try to abort the transaction before doing getAll.
// HIDE: Note that error fires before tx.abort event here:
// Question:
// - Which events will be triggered? tx.error / tx.abort / tx.complete / req.error / req.success
//     - HIDE: tx.abort, but there is a DOMException at tx.objectStore('table')
async function doExample2() {
  // Prepare transaction...
  const tx = db.transaction('table', 'readwrite');
  tx.onerror = event => {
    console.log('tx error', tx.error);
    console.log('tx error (event target error)', event.target.error);
  };
  tx.onabort = event => console.log('tx abort', event);
  tx.oncomplete = event => console.log('complete', event);

  // Abort the transaction
  tx.abort();

  // Try to get all data.
  const store = tx.objectStore('table');
  const getReq = store.getAll();
  getReq.onerror = event => console.log('req error', event);
  getReq.onsuccess = v => console.log('req success', v);
}

// Try to abort the transaction after doing getAll before the request success.
// HIDE: Note that error fires before abort here (this example is equivalent to example 2, since in both cases the tx.abort() synchronously aborts the transaction before the request runs asynchronously?):
// Question:
// - Which events will be triggered? tx.error / tx.abort / tx.complete / req.error / req.success
//     - HIDE: req.error / tx.error / tx.abort
async function doExample3(db) {
  // Prepare transaction...
  const tx = db.transaction('table', 'readwrite');
  tx.onerror = event => {
    console.log('tx error', tx.error);
    console.log('tx error (event target error)', event.target.error);
  };
  tx.onabort = event => console.log('tx abort', event);
  tx.oncomplete = event => console.log('tx complete', event);

  // Try to get all data.
  const store = tx.objectStore('table');
  const getReq = store.getAll();
  getReq.onerror = event => console.log('req error', event);
  getReq.onsuccess = v => console.log('req success', v);

  // Abort the transaction
  tx.abort();
}

// Same with doExample3...
// Extra: Let's discuss the exact error objects in transactions and requests.
// Question:
// - Which events will be triggered? tx.error / tx.abort / tx.complete / req.error / req.success
//     - HIDE: req.error / tx.error / tx.abort
async function doExample3_extra(db) {
  let reqError;
  // Prepare transaction...
  const tx = db.transaction('table', 'readwrite');
  tx.onerror = event => {
    console.log('tx error', tx.error);
    console.log('tx error (event target error)', event.target.error);
  };
  tx.onabort = event => {
    console.log('tx abort', event);
    // https://developer.mozilla.org/en-US/docs/Web/API/IDBRequest/error
    // https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction/error
    // https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction/error_event
    console.log('Are tx.error and reqError identical?', tx.error === reqError, reqError);
  };
  tx.oncomplete = event => console.log('tx complete', event);

  // Try to get all data.
  const store = tx.objectStore('table');
  const getReq = store.getAll();
  getReq.onerror = event => {
    reqError = event.target.error;
    console.log('req error', event);
  };
  getReq.onsuccess = v => console.log('req success', v);

  // Abort the transaction
  tx.abort();
}

