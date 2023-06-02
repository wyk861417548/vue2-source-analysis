import { ASSET_TYPES } from "../../shared/constants";
import { initAssetRegisters } from "./asssets";
import { initExtend } from "./extend";
import { initMixin } from "./mixin";

export function initGlobalAPI(Vue){

  //创建一个干净的对象没有原型属性方法 hasOwnProperty不能调用 借助Object.prototype.hasOwnProperty.call()
  Vue.options = Object.create(null); 

  Vue.options._base = Vue

  initMixin(Vue) //Vue.mixin 混入

  initExtend(Vue) // Vue.extend

  // Vue.component Vue.directive Vue.filter 初始化
  ASSET_TYPES.forEach(type => {Vue.options[type + 's'] = Object.create(null)})

  initAssetRegisters(Vue) //Vue.component Vue.directive Vue.filter 实现 
}