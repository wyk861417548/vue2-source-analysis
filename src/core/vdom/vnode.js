// _v()
export function createTextVNode(vm,text){
  return vnode(vm,undefined,undefined,undefined,undefined,text)
}

export function vnode(vm,tag,key,data,children,text){
  return {
    vm,
    tag,
    key,
    data,
    children,
    text
  }
}