const Scope = require('../scope');
const walk = require('../walk');
const { hasOwnProperty } = require('../util');

let ident = 0;
let padding = () => " ".repeat(ident);

/**
 * 对当前的语法树进行解析
 * @param {*} ast 
 * @param {*} magicString 
 * @param {*} module 
 */
function analyse (ast, magicString, module) {
  if (ast && ast.body && Array.isArray(ast.body)) {
    let currentScope = new Scope({ name: '全局作用域' });

    ast.body.forEach((statement) => {

      function addtoScope (name, isBlockScope) {
        let isAdd = currentScope.add(name, isBlockScope);
        // * 判断当前是不是顶级作用域，如果是顶级作用域，就往 statement 添加一个变量，表示它是一个顶级变量
        if (!isAdd) {
          statement._defines[name] = true;
        }
      }

      Object.defineProperties(statement, {
        _source: {
          value: magicString.snip(statement.start, statement.end),
        },
        // 当前节点是已被包含
        _include: { value: false, writable: true },
        // 当前 statement 节点声明了哪些变量
        _defines: { value: {} },
        // 当前 statement 节点依赖读取了哪些变量
        _dependsOn: { value: {} },
        // 存放当前修改的变量
        _modifies: { value: {} },
      });

      walk(statement, {
        enter: (node) => {
          // console.log(padding() + node.type + " Enter");
          // ident += 2;

          let newScope;
          switch (node.type) {
            case "FunctionDeclaration":
              addtoScope(node.id.name, false);
              const names = node.params.map(param => param.name);
              newScope = new Scope({
                name: node.id.name,
                parent: currentScope,
                names,
                block: false,
              });
              break;
            case "VariableDeclaration":
              node.declarations.forEach(declaration => {
                if (node.kind === 'let' || node.kind === 'const') {
                  // 块级作用域
                  addtoScope(declaration.id.name, true);
                } else {
                  addtoScope(declaration.id.name, false);
                }
              })
              break;
            case "BlockStatement":
              newScope = new Scope({
                parent: currentScope,
                block: true
              })
              break;
          }

          // 如果有值，说明 当前节点创建了新的作用域
          if (newScope) {
            Object.defineProperty(node, '_scope', { value: newScope });
            currentScope = newScope;
          }
        },
        leave: (node) => {
          // ident -= 2;
          // console.log(padding() + node.type + " Leave");
          // if (ident === 0) {
          //   console.log("\n")
          // }

          if (hasOwnProperty(node, '_scope')) {
            currentScope = currentScope.parent;
          }
        }
      });
    });

    // 在构建完作用域之后，找到当前模块内声明的哪些变量之后，
    // 还需要找出当前模块内使用了哪些变量
    ast.body.forEach((statement) => {
      function checkForRead (node) {
        if (node.type === 'Identifier') {
          statement._dependsOn[node.name] = true;
        }
      }

      function checkForWrites (node) {
        function addNode (node) {
          if (node.type === 'Identifier') {
            statement._modifies[node.name] = true;
          }
        }

        if (node.type === 'AssignmentExpression') {
          // console.log(JSON.stringify(node, null, 2));
          addNode(node.left);
        }
        if (node.type === 'UpdateExpression') {
          addNode(node.argument);
        }
      }

      walk(statement, {
        enter: (node) => {
          checkForRead(node);
          checkForWrites(node);
        }
      })
    });
  }
}

module.exports = analyse;