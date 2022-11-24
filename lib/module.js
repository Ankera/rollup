const MagicString = require('magic-string');
const { parse } = require('acorn');
const analyse = require('./ast/analyse');
const { hasOwnProperty } = require('./util');

const SYSTEMS = ['console', 'log'];

class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code, { filename: path });
    this.path = path;
    // 整个编译对象
    this.bundle = bundle;
    this.ast = parse(code, { ecmaVersion: 8, sourceType: 'module' });
    // 记录当前模块从哪些模块导入了哪些数据
    this.imports = {};
    // 记录当前模块向外导出了哪些数据
    this.exports = {};
    // 记录变量是在那个节点语句中定义的
    this.definitions = {};
    // 记录修改变量的语句
    this.modifications = {};
    // 开始进行语法分析
    this.analyse();
  }

  analyse = () => {
    const _this = this;
    this.ast.body.forEach((statement) => {

      // 找出 this.imports
      if (statement.type === 'ImportDeclaration') {
        const source = statement.source.value;
        const specifiers = statement.specifiers;
        specifiers.forEach((specifier) => {
          const importName = specifier.imported.name;
          const localName = specifier.local.name;
          _this.imports[localName] = {
            localName,
            source,
            importName,
          }
        })
      }

      // 找出 this.exports
      if (statement.type === 'ExportNamedDeclaration') {

        const declaration = statement.declaration;
        if (declaration && declaration.type === 'VariableDeclaration') {

          const declarations = declaration.declarations;
          declarations.forEach((declaration) => {
            const localName = declaration.id.name;
            _this.exports[localName] = {
              localName,
              exportName: localName,
              declaration
            }
          })
        }
      }
    })

    // 获取定义的变量或读取的变量
    analyse(this.ast, this.code, this);

    this.ast.body.forEach((statement) => {
      // 可以从变量名叫定义这个变量的语句
      Object.keys(statement._defines).forEach(name => {
        _this.definitions[name] = statement;
      });

      // 这里存放的是当前语句更新到的所有变量
      Object.keys(statement._modifies).forEach(name => {
        if (!hasOwnProperty(_this.modifications, name)) {
          _this.modifications[name] = [];
        }
        _this.modifications[name].push(statement);
      })
    });
  }

  expandStatements = (statement) => {
    statement._include = true;

    const result = [];
    const _this = this;
    const depends = Object.keys(statement._dependsOn);

    depends.forEach(depenName => {
      const definition = _this.define(depenName);
      result.push(...definition);
    });

    result.push(statement);

    // 获取当前语句定义的变量
    const defines = Object.keys(statement._defines);
    defines.forEach((name) => {
      const modifications = hasOwnProperty(_this.modifications, name) && _this.modifications[name];
      if (modifications) {
        modifications.forEach((statement) => {
          const statements = _this.expandStatements(statement);
          result.push(...statements);
        })
      }
    })
    return result;
  }

  /**
   * 返回此变量定义的语句
   * @param {*} name 
   */
  define = (name) => {
    if (hasOwnProperty(this.imports, name)) {
      const { localName, importName, source } = this.imports[name];
      const importModule = this.bundle.fetchModule(source, this.path);
      const { localName: externalLocalName } = importModule.exports[importName];
      return importModule.define(externalLocalName);
    } else {
      const statement = this.definitions[name];
      if (statement) {
        if (statement._include) {
          return [];
        } else {
          return this.expandStatements(statement);
        }
      } else if (SYSTEMS.includes(name)) {
        return [];
      } else {
        throw new Error(`ReferenceError: ${name} is not define in current scope`);
      }
    }
  }

  expandAllStatements = () => {
    const allStatements = [];
    const _this = this;
    this.ast.body.forEach((statement) => {
      if (statement.type === 'ImportDeclaration') {
        return;
      }
      if (statement.type === 'VariableDeclaration') {
        return;
      }
      if (statement.type === 'FunctionDeclaration') {
        return;
      }
      const statements = _this.expandStatements(statement)
      allStatements.push(...statements);
    });

    return allStatements;
  }
}

module.exports = Module;