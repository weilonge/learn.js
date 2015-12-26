var Filer = window.Filer;

console.log(Filer);


var fsA = new Filer.FileSystem({
  name: "my-filesystem",
  flags: [ 'FORMAT' ],
  provider: new Filer.FileSystem.providers.Memory()
}, function (err, fs){

  fs.open('/myfile', 'w+', function(err, fd) {
    if (err) throw err;
    fs.close(fd, function(err) {
      if (err) throw err;
      fs.stat('/myfile', function(err, stats) {
        if (err) throw err;
        console.log('stats: ' + JSON.stringify(stats));
      });
    });
  });

});

