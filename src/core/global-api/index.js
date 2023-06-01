import { initMixin } from "./mixin";

export function initGlobalAPI(Vue){

  //创建一个干净的对象没有原型属性方法 hasOwnProperty不能调用 借助Object.prototype.hasOwnProperty.call()
  Vue.options = Object.create(null); 

  initMixin(Vue) //Vue.mixin 混入
}