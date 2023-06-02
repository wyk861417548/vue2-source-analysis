import { vnode } from "./vnode";
import { isReservedTag } from "../utils/element";
import { createComponent } from "./create-components";

export function createElement(vm,tag,data,...children){
  if(data == null){
    data = {};
  }


  // 是否是html的标签
  if(isReservedTag(tag)){
    return vnode(vm,tag,data.key,data,children)
  }else{
    let Ctor = vm.$options.components[tag]; //组件的构造函数
    // console.log('vm.$options.components',vm.$options,Ctor);
    return createComponent(vm,tag,data.key,data,children,Ctor)
  }
}