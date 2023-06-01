import { nextTick } from "../utils/index";
import { createElement } from "../vdom/create-element";
import { createTextVNode } from "../vdom/vnode";

export function renderMixin(Vue){
  Vue.prototype.$nextTick = nextTick

  Vue.prototype._render = function(){
    // 指向Vue 因为render函数使用with 当this传入vm的时候，_s(xxx)中的变量会自动去vm上拿取
    return this.$options.render.call(this);
  }

  Vue.prototype._c = function(){
    // console.log('1',arguments);
    return createElement(this,...arguments)
  }
  Vue.prototype._v = function(){
    // console.log('2',arguments);
    return createTextVNode(this,...arguments);
  }

  // 因为render函数使用with的原因 所以_s(xxx)中的变量 可以直接获取对应的值
  Vue.prototype._s = function(value){
    if( typeof value !== 'object') return value;
    return JSON.stringify(value);
  }
}