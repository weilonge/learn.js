var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};

function hexStr2ab(inputStr){
  var inputArray = [];
  for(var i = 0; i < inputStr.length; i+=2){
    inputArray.push(parseInt(inputStr.substring(i, i+2), 16));
  }
  return new Uint8Array(inputArray);
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function a2ab(array){
  var buf = new ArrayBuffer(array.length);
  var bufView = new Uint8Array(buf);
  for(var i = 0; i < array.length; i++){
    bufView[i] = array[i];
  }
  return buf;
}

var xClientState  = '4b2598270462349dd3930bbd501ae68c';
var kA = '59be414e96d5b093a220b5f4c4c8a5ea1e40b9ba5cf7a6b5dd1516961d0de72f';
var kB = '6fe2d3b45fa2017dfde48ec8a07a8754a5a6296887ea16dc48d840ef06067665';

var cryptoRecords = {
  "data": [
    {
      "last_modified": 1437655865810,
      //"payload": "{\"ciphertext\":\"DdsfWLeTYHBZtgBOOPh9KaoZznGHhgLwdwVXPS17YojDlKKruwh0rTopnAdC0y5Dc199Gffbe9bdQzOXH/DtbeOC6FxFa/gAw+MCre3zxSwI0IgHHYKtNjgmrXd4LwUx7rP7NlKJ/eATaL7I4vpanAmcjxreR1+LJVEto+acNv9MI51cfXyRGief2yXwOwcfcgBgIjEFRikETi185QRatw==\",\"IV\":\"uI9fzSIcVVqHaUePKBrifQ==\",\"hmac\":\"138b36670d218ee73a56a6d5590c0745498193a3a1364b38b7485f7442e9f62d\"}",
      "payload": {
        "ciphertext":"+HoQHA3btw0+8MifC/cf8P8uXNNdjurz06U7jP7Wz92fI8NDBQWqcm76lC/qvHqKO3vVn0vpMna1UgJPCjwojzprQMWAlz1J+EtEDW5Y6UmAIsWzcEPA+K7pRc4/goPhyKpz4ywTRzVeZvs6wrgBQ0hQlkGdglQcuk1lO+XreA7KkkZeCT/gKW5PTNNCSLLof8Gbs0YP/yUMVz5Z1gIhWW5tCvfk0H1xmYhhdOs0sPuzyPLiB6nx3SxkdxPeVGsXF21s1whfcObgL7LoT2iR9duHyWy2CgPdbP7isxcDk4MV3IUkw7sNSKq856ANZG+D6NMzFdB+AgF1cvl/serD6nqIYqta3r9NR6QqYPsSeZofE7tn6hQ9OsrPBvNkqAMUtc6PCf4UrGzJnj7tLWbsmTWm/z8yQ6mPfiL0pr4s23ZiUEVWPEgy7q+RLkYtnAmlP12+ho+bc5L16OpIo402JaA/RO559ZdeH+k3i39VwR0DszcDYSk8SpwvfrEUHJUCWDxtNEo4PVgCURgNdZypsLbNA/vtQ3xz427FDqIvJmbJVbqQIYSs5BLmOfSBTIiL6bGkjpZds7BeAhdib1PoDsDSJ2ew2q47BUyc0ChBW1MSudOP6T/zOB5SqEIld3wuZKMmUHWjqV8AICwfbGuuNai56R2+8vseJ6sQ6Azasvs=",
        "IV":"0UrBASMEHDechDkZSphtPA==",
        "hmac":"44c23de0b3f078c95274bd5f6d8078b2dae3fd511e79b0daacaa873404834d70"
      },
      "id": "91ecac00-0000-4000-8000-000000000000"
    }
  ]
}

var data = str2ab(Base64.decode(cryptoRecords.data[0].payload.ciphertext));
var IV = cryptoRecords.data[0].payload.IV;
var decodedIV = [0xd1, 0x4a, 0xc1, 0x01, 0x23, 0x04, 0x1c, 0x37, 0x9c, 0x84, 0x39, 0x19, 0x4a, 0x98, 0x6d, 0x3c];

importKey(function (key){
  decrypt(key, data, a2ab(decodedIV));
});

function importKey(callback){
  window.crypto.subtle.importKey(
    "raw", //only "raw" is allowed
    hexStr2ab(kB), //your raw key data as an ArrayBuffer
    {
      name: "AES-CBC",
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"] //can be any combination of "deriveKey" and "deriveBits"
  )
  .then(function(key){
    //returns a key object
    console.log(key);
    callback(key);
  })
  .catch(function(err){
      console.error(err);
  });
}

function decrypt(key, cipherData, iv){
  window.crypto.subtle.decrypt(
    {
        name: "AES-CBC",
        iv: iv, //The initialization vector you used to encrypt
    },
    key, //from generateKey or importKey above
    cipherData //ArrayBuffer of the data
  )
  .then(function(decrypted){
      //returns an ArrayBuffer containing the decrypted data
      console.log(new Uint8Array(decrypted));
  })
  .catch(function(err){
      console.error(err);
  });
}

// http://mxr.mozilla.org/mozilla-central/source/services/sync/modules/service.js#1470
/*
window.crypto.subtle.sign("HMAC",
    hmac, //from generateKey or importKey above
    data //ArrayBuffer of data you want to sign
)
.then(function(signature){
    //returns an ArrayBuffer containing the signature
    console.log(new Uint8Array(signature));
})
.catch(function(err){
    console.error(err);
});
*/