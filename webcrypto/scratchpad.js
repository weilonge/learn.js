/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Cmd-R),
 * 2. Inspect to bring up an Object Inspector on the result (Cmd-I), or,
 * 3. Display to insert the result in a comment after the selection. (Cmd-L)
 */
//App.syncTabs();
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

function hexStr2ab(inputStr){
  var inputArray = [];
  for(var i = 0; i < inputStr.length; i+=2){
    inputArray.push(parseInt(inputStr.substring(i, i+2), 16));
  }
  return new Uint8Array(inputArray);
}

var kB = '6fe2d3b45fa2017dfde48ec8a07a8754a5a6296887ea16dc48d840ef06067665';

setTimeout(function () {
  window.kB = hexStr2ab(kB);
  window.payload = JSON.parse("{\"ciphertext\":\"DdsfWLeTYHBZtgBOOPh9KaoZznGHhgLwdwVXPS17YojDlKKruwh0rTopnAdC0y5Dc199Gffbe9bdQzOXH/DtbeOC6FxFa/gAw+MCre3zxSwI0IgHHYKtNjgmrXd4LwUx7rP7NlKJ/eATaL7I4vpanAmcjxreR1+LJVEto+acNv9MI51cfXyRGief2yXwOwcfcgBgIjEFRikETi185QRatw==\",\"IV\":\"uI9fzSIcVVqHaUePKBrifQ==\",\"hmac\":\"138b36670d218ee73a56a6d5590c0745498193a3a1364b38b7485f7442e9f62d\"}");
  window.hawkCredentials.then(function (hC) {
    console.log('init');
    window.hC = hC;
    function str2ba(str) {
      var buf = new ArrayBuffer(str.length); // 1 bytes fo each char
      var bufView = new Uint8Array(buf);
      for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return bufView;
    }
    return window.hC.hkdf(window.kB, str2ba('Sync-AES_256_CBC-HMAC256syncto@mailinator.com'), window.hC.emptyKey, 64);
  }).then(function (output) {
    window.encPlusHmac = output;
    console.log('See window.encPlusHmac.slice(0, 32) - next step: try to decrypt crypto/keys with that!');
    return window.encPlusHmac.slice(0, 32).buffer;
  }).then(function (bundleKey) {
    console.log('importing bundleKey', bundleKey)
    return window.crypto.subtle.importKey('raw', bundleKey, {
      name: 'AES-CBC',
      length: 256
    }, true, [
      'encrypt',
      'decrypt'
    ]
    );
  }).then(function (importedKey) {
    console.log('bundleKey imported', importedKey);
    window.bKobj = importedKey;
    //convert payload.ciphertext and payload.iv from base64:
    function base64ToArrayBuffer(base64) {
      var binary_string = window.atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    }
    window.ciphertext = base64ToArrayBuffer(window.payload.ciphertext);
    window.IV = base64ToArrayBuffer(window.payload.IV);
    console.log('imported ciphertext and IV', window.ciphertext, window.IV);
    console.log(window.ciphertext);
    console.log(window.IV);


    var qqq = new Uint8Array(window.IV);
    for(var i = 0; i < qqq.length; i++){
      console.log(qqq[i]);
    }


  function stringToUint(string) {
    var charList = string.split(''),
        uintArray = [];
    for (var i = 0; i < charList.length; i++) {
        uintArray.push(charList[i].charCodeAt(0));
    }
    return new Uint16Array(uintArray);
  }

    var qqqIV = Base64.decode('uI9fzSIcVVqHaUePKBrifQ==');
    console.log(stringToUint(qqqIV));
    console.log(stringToUint('uI9fzSIcVVqHaUePKBrifQ=='));

    //try to decrypt with kB:
    return crypto.subtle.decrypt({
      name: 'AES-CBC',
      iv: window.IV
    }, importedKey, window.ciphertext);
  }).then(function (keyBundle) {
    console.log('here is the keyBundle you were looking for:', keyBundle);
  }, function (err) {
    console.log('oops', err);
  });
}, 1);
