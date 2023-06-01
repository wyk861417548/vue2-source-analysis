import { LIFECYCLE_HOOKS } from "../../shared/constants";
import { hasOwn } from "../../shared/util";


const strats = {};
LIFECYCLE_HOOKS.forEach(hook=>{
  strats[hook] = mergeHook
})

// 处理 mixin中的生命钩子和主页面的生命钩子  合并成数组，然后遍历执行钩子  即调用callHook(vm,hook)函数
// p和c：假装是created函数
// 1.首次进入 p是没有的 所有直接返回 [c], 首次必定有c 不然进入不了   {} =>  [created:fn]
// 2.再次合并 如果 p(即上次返回的 [c] )有,而新的c无 直接返回 p   或者 有 p 有 c有则合并返回
function mergeHook(p,c){
  // console.log('p,c',p,c);
  if(c){
    if(p){
      return p.concat(c)
    }else{
      return [c]
    }
  }else{
    return p
  } 
}


export function mergeOptions(parent,child){
  const options = {};

  for (const key in parent) {
    mergeField(key)
  }

  for (const key in child) {
    if(!hasOwn(parent,key)){
      mergeField(key)
    }
  }

  // 1.首次所有属性都放入 options 中
  // 2.再次调用 mergeOptions 合并属性时，属性在strats中定义的单独处理，否则如果新传入的child中有，直接新的属性直接覆盖
  function mergeField(key){
    if(strats[key]){
      options[key] = strats[key](parent[key],child[key])
    }else{
      options[key] = child[key] || parent[key];
    }
  }

  // console.log('------mixin options----------',options);
  return options;
}