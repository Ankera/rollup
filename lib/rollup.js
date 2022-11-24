const Bundle = require('./bundle');

/**
 * 从入口文件出发进行编译，输出文件
 * @param {*} entry 
 * @param {*} fileName 
 */
function rollup (entry, fileName) {
  const bundle = new Bundle({ entry });

  bundle.build(fileName);
}

module.exports = rollup;