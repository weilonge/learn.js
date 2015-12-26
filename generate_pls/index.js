var xhr = new XMLHttpRequest();
xhr.open('GET', 'RadioTunes - Favorites.pls');
xhr.overrideMimeType('audio/x-scpls'); // Needed, see below.
xhr.onload = parse;
xhr.send();

// Parse it
function parse () {
  var playlist = PLS.parse(this.response);
  console.log(playlist);
  playlist.forEach(create);
}

function create (item) {
  var node = document.createElement('li');
  var audioTag = document.createElement('audio');
  audioTag.setAttribute('controls', true);
  audioTag.setAttribute('src', item.file);
  node.appendChild(audioTag);
  document.getElementById('playlist').appendChild(node);
}
