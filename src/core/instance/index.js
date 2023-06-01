import { initMinx } from "./init";

// 不使用class 去创建类 是为了避免所有的方法耦合在一起
function Vue(options){
  this._init(options)
}

// 扩展 init 方法
initMinx(Vue)

export default Vue;