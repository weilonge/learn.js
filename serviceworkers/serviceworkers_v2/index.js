navigator.serviceWorker.getRegistrations().then((list) => {
  for(var rr in list){
    console.log(list[rr]);
  }
});


navigator.serviceWorker.register('/worker.js', {
  scope: '/storage/'
}).then(function(reg) {
  console.log('◕‿◕', reg);
}, function(err) {
  console.log('ಠ_ಠ', err);
});


var Storage = {};

Storage._handleJson = function (xmlhttp, cb){
  var response = {
    data: null
  };
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
    console.log('404');
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
  xmlhttp.open('get', 'storage/', true);
  //xmlhttp.setRequestHeader('Accept', 'application/json');
  xmlhttp.onload = function () {
    //console.log(xmlhttp.responseText);
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
  Storage.quota((error, response) => {
    console.log(response);
  });
};
