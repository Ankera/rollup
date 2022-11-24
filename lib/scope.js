class Scope {
  constructor(options) {
    this.name = options.name;
    this.parent = options.parent;
    this.names = options.names || [];
    // 当前作用域是不是块级作用域
    this.isBlockScope = !!options.block;

  }

  add (name, isBlockScope) {
    // 如果这个变量不是一个块级作用域，并且当前作用作用域是一个块级作用域
    if (!isBlockScope && this.isBlockScope) {
      this.parent.add(name, isBlockScope);
      return false;
    } else {
      this.names.push(name);
      return true;
    }
  }

  findDefinedScope (name) {
    if (this.names.includes(name)) {
      return this;
    }
    if (this.parent) {
      return this.parent.findDefinedScope(name);
    }
    return null;
  }
}

module.exports = Scope;