class Scope {
  constructor(options) {
    this.scopeName = options.scopeName;
    this.parentScope = options.parentScope;
    this.variableNames = options.variableNames;
  }

  add (variableName) {
    this.variableNames.push(variableName);
  }

  findDefinedScope (variableName) {
    if (this.variableNames.includes(variableName)) {
      return this;
    }
    if (this.parentScope) {
      return this.parentScope.findDefinedScope(variableName);
    }
    return null;
  }
}


var a = 1;
function one () {
  var b = 2;
  function two () {
    var c = 3;
    console.log(a, b, c)
  }
  two();
}

one();

var globalScope = new Scope({ scopeName: "全局", parentScope: null, variableNames: ['a'] });
var oneScope = new Scope({ scopeName: "one", parentScope: globalScope, variableNames: ['b'] });
var twoScope = new Scope({ scopeName: "two", parentScope: oneScope, variableNames: ['c'] });

var ascope = twoScope.findDefinedScope('a');
console.log('scope', ascope.scopeName);
var bscope = twoScope.findDefinedScope('b');
console.log('scope', bscope.scopeName);
var cscope = twoScope.findDefinedScope('c');
console.log('scope', cscope.scopeName);
var dscope = twoScope.findDefinedScope('d');
console.log('scope', dscope);