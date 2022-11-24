const { parse } = require('acorn');

const source = 'import $ from "jquery"';

const ast = parse(source, {
  locations: true,
  ranges: true,
  sourceType: 'module',
  ecmaVersion: 8
})

let ident = 0;
let padding = () => " ".repeat(ident);

function walk (astNode, { enter, leave }) {
  visit(astNode, null, enter, leave);
}

function visit (astNode, parent, enter, leave) {
  if (enter) {
    enter.call(null, astNode, parent);
  }

  const childKeys = Object.keys(astNode).filter((key) => typeof astNode[key] === 'object');
  childKeys.forEach((childKey) => {
    const value = astNode[childKey];
    if (Array.isArray(value)) {
      value.forEach((child) => {
        visit(child, astNode, enter, leave)
      })
    } else {
      visit(value, astNode, enter, leave)
    }
  })


  if (leave) {
    leave.call(null, astNode, parent);
  }
}

ast.body.forEach((statement) => {
  walk(statement, {
    enter: (node, parent) => {
      if (node.type) {
        console.log(padding() + node.type + " Enter");
        ident += 2;
      }
    },
    leave: (node, parent) => {
      if (node.type) {
        ident -= 2;
        console.log(padding() + node.type + " Leave");
      }
    }
  })
})