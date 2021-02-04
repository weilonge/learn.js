const A = document.getElementById('A');
const B = document.getElementById('B');
let rotation = 0;
let pos = 0;

let start;
function ani (timestamp) {
  if (!start) {
    start = timestamp;
  }
  B.style.transform = `rotate(${rotation}deg)`;
  rotation += (timestamp - start) > 4000 ? 0.2 : 0.2;

  pos = (pos + 0.1) % 10;
  A.style.transform = `translate(${pos}px, ${pos}px)`;
  window.requestAnimationFrame(ani);
}

window.requestAnimationFrame(ani);
