console.log("A");

function funcB() {
  console.log("B");
}
funcB();

(function () {
  console.log("C");
})();

setTimeout(function () {
  console.log("D");
}, 0);

requestAnimationFrame(function () {
  console.log("E");
});

new Promise(resolve => {
  console.log("F");
  resolve();
}).then(() => {
  console.log("F.1");
});

(async function () {
  console.log("G");
  await new Promise(resolve => {
    console.log("G.1");
    resolve();
  }).then(() => {
    
  });
  console.log("G.2");
})();

console.log("H");

