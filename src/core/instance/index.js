import { initGlobalAPI } from "../global-api/index";
import { patch } from "../vdom/patch";
import { initMinx } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { diffTest } from "./diffTest";

// 不使用class 去创建类 是为了避免所有的方法耦合在一起
function Vue(options){
  this._init(options)
}

Vue.prototype.__patch__ =  patch;

// 扩展 init 方法
initMinx(Vue)

// 扩展 watch 等方法
stateMixin(Vue)

// 扩展全局api方法
initGlobalAPI(Vue)

// 扩展 vm._render vm._update 方法
lifecycleMixin(Vue)

// 扩展 _render
renderMixin(Vue)

// diff实现测试 为了方便观测节点变化
diffTest(Vue)

export default Vue;