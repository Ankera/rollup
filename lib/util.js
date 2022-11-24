/**
 * 判断 obj 对象是是否有 prop 属性
 * @param {*} obj 
 * @param {*} prop 
 * @returns 
 */
const hasOwnProperty = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

exports.hasOwnProperty = hasOwnProperty