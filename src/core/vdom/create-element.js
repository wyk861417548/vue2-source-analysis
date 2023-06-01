import { vnode } from "./vnode";

export function createElement(vm,tag,data,...children){
  if(data == null){
    data = {};
  }

  return vnode(vm,tag,data.key,data,children)
}