/*
請問一下大家，在使用node.js時，我需要將一個json字串轉成object，
內容如下：
    var example = '["Rock\\punk"]';
    JSON.parse(example);

不管在node.js或是chrome console都會得到如下結果：
    SyntaxError: Unexpected token p



*/

function foo (bar) {
console.log("O: " + bar);
console.log("A: " + JSON.parse(bar));
}

foo('["Rock\\\\punk"]');
foo('["Rock\\\\Punk"]');
foo('["Rock\\punk"]');
foo('["Rock\\Punk"]');


