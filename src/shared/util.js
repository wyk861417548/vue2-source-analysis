const hasOwnProperty = Object.prototype.hasOwnProperty;
// 对象是否拥有该属性
export function hasOwn(obj,key){
  return hasOwnProperty.call(obj,key)
}

const _toString = Object.prototype.toString
// 是否是一个对象
export function isPlainObject(obj){
  return _toString.call(obj) === '[object Object]'
}

// 是否存在
export function isDef (v){
  return v !== undefined && v !== null
}

// 是否不存在
export function isUndef (v){
  return v === undefined || v === null
}

// 将属性 赋于 目标对象上
export function extend(to,_from){
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

// 是否是一个对象
export function isObject (obj){
  return obj !== null && typeof obj === 'object'
}

export function makeMap(str,expectsLowerCase){
  const list = str.split(',')
  const map = Object.create(null)
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  
  return expectsLowerCase
    ?val=>map[val.toLowerCase()]
    : val => map[val]
}
