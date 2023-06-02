import { isObject } from "../../shared/util";
import { vnode } from "./vnode";

const componentVNodeHooks = {
  init(vnode){
    console.log('vnode',vnode);
    //稍后创建真实节点的时候，如果是组件则调用此方法
    let instance = vnode.componentInstance = new vnode.componentOptions.Ctor()
    // console.log('vnode.componentInstance',vnode.componentInstance);
    instance.$mount();
  }
}

// 创建组件
export function createComponent(vm,tag,key,data,children,Ctor){
  const baseCtor = vm.$options._base;
  // console.log('baseCtor',Ctor);
  if(isObject(Ctor)){
    Ctor = baseCtor.extend(Ctor)
  }

  installComponentHooks(data)

  return vnode(vm,tag,key,data,children,null,{Ctor})
}

const hooksToMerge = Object.keys(componentVNodeHooks)

// 为组件添加属性、标识等等
function installComponentHooks(data){
  const hooks = data.hook || (data.hook = {})

  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    hooks[key] = componentVNodeHooks[key]
  }
}