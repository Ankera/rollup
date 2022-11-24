/**
 * 深度优先的方式遍历当前节点
 * @param {*} astNode 
 * @param {*} param1 
 */
function walk (astNode, { enter, leave }) {
  visit(astNode, null, enter, leave);
}

/**
 * 访问一个语法树节点
 * @param {*} astNode 
 * @param {*} parent 
 * @param {*} enter 
 * @param {*} leave 
 */
function visit (astNode, parent, enter, leave) {
  if (!astNode) {
    return;
  }
  if (enter) {
    enter.call(null, astNode, parent);
  }

  const childKeys = Object.keys(astNode).filter((key) => typeof astNode[key] === 'object');

  childKeys.forEach((childKey) => {
    const value = astNode[childKey];
    if (Array.isArray(value)) {
      value.forEach((child) => {
        visit(child, astNode, enter, leave);
      })
    } else {
      visit(value, astNode, enter, leave);
    }
  })

  if (leave) {
    leave.call(null, astNode, parent);
  }
}

module.exports = walk;