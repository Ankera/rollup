const magicString = require('magic-string');

const source = `export var name = "Tom"`;

const ms = new magicString(source);

console.log(ms.snip(0, 8).toString())