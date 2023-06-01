import { patch } from "../vdom/patch";
import { initMinx } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";

// 不使用class 去创建类 是为了避免所有的方法耦合在一起
function Vue(options){
  this._init(options)
}

Vue.prototype.__patch__ =  patch;

// 扩展 init 方法
initMinx(Vue)

// 扩展 vm._render vm._update 方法
lifecycleMixin(Vue)

// 扩展 _render
renderMixin(Vue)

export default Vue;