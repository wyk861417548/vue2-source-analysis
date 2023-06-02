import { mergeOptions } from "../utils/options"

export function initExtend(Vue){
  Vue.extend = function(extendOptions){

    const Super = this;
    //使用组合继承 
    const Sub = function VueComponent(options){
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub

    // 自己options中components[key](每一个组件)的和全局（Vue.options）的components[key]（每一个组件）建立一个联系（prototype联系）
    // 通过components查找如果自己有使用自己的，如果没有去原型上找找到使用全局的
    Sub.options = mergeOptions(Super.options,extendOptions)

    return Sub
  }
}