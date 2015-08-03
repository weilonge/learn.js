var Storage = {};

Storage._handleJson = function (xmlhttp, cb){
  var response = {
    data: null
  };
  console.log(xmlhttp.status);
  if (xmlhttp.status == 200) {
    try {
      response.data = JSON.parse(xmlhttp.responseText);
      cb(null, response);
    } catch (e) {
      cb({
        error: 'parsing failed.'
      }, response);
    }
  } else if (xmlhttp.status == 404){
    cb(null, response); // File not found
  } else {
    cb({
      error: 'http status: ' + xmlhttp.status
    }, response);
  }
};

Storage.quota = function (cb){
  var self = this;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', '/qoo/', true);
  xmlhttp.setRequestHeader('Accept', 'application/json');
  xmlhttp.onload = function () {
    console.log(xmlhttp.responseText);
    self._handleJson(xmlhttp, function (error, response){
      if (response.data) {
        var result = {
          data:response.data
        };
        cb(error, result);
      } else {
        cb(error, response);
      }
    });
  };

  xmlhttp.send();
};

document.getElementById('getStorage').onclick = function (){
  console.log('getStorage');
  Storage.quota(function (error, response) {
    console.log(response);
  });
};

document.getElementById('uninstall').onclick = function (){
  console.log('uninstall');
  navigator.serviceWorker.getRegistrations().then(function (a) {
    a.forEach(function (r){
      console.log(r);
      r.unregister().then(function (b) {
        console.log(b);
      });
    });
  });
};

document.getElementById('install').onclick = function (){
  console.log('install');
  navigator.serviceWorker.register('/worker.js', {
    scope: '/qoo/'
  }).then(function(reg) {
    console.log('OK', reg);
  }, function(err) {
    console.log('Error', err);
  });

};
