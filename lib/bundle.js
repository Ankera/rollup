const fs = require('fs');
const MagicString = require('magic-string');
const path = require('path');
const Module = require('./module');

class Bundle {
  constructor(options) {
    this.entryPath = options.entry.replace(/\.js$/, '') + '.js';
  }

  build = (filename) => {
    // 获取入口模块
    const entryModule = this.fetchModule(this.entryPath);

    // 展开所有语句, 获取入口模块所有的语句节点
    this.statements = entryModule.expandAllStatements();

    // 获取新的源码
    const { code } = this.generate();

    fs.writeFileSync(filename, code)
  }

  fetchModule = (importee, importer) => {
    let route;
    // 入口
    if (!importer) {
      route = importee;
    } else {
      if (path.isAbsolute(importee)) {
        route = importee;
      } else if (importee[0] === '.') {
        route = path.resolve(path.dirname(importer), importee.replace(/\.js$/, '') + '.js');
      }
    }

    if (route) {
      const code = fs.readFileSync(route, "utf-8");

      const module = new Module({
        code,
        path: route,
        bundle: this
      })

      return module;
    }

    return null;
  }

  generate = () => {
    const bundleString = new MagicString.Bundle();

    this.statements.forEach((statement) => {
      // .clone()
      const source = statement._source;
      if (/^Export/.test(statement.type)) {
        source.remove(statement.start, statement.declaration.start);
      }
      bundleString.addSource({
        content: source,
        separator: '\n',
      })
    });
    return {
      code: bundleString.toString(),
    }
  }
}

module.exports = Bundle;