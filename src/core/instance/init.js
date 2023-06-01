import { initState } from "./state";

export function initMinx(Vue){
  Vue.prototype._init = function(options={}){
    const vm = this;

    vm.$options = options;// 将选项挂载到实例上  data,create,methods...

    // 初始化状态 (data,computed,watch等等)
    initState(vm)
  }
}