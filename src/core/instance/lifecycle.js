import Watcher from "../observer/watcher";

// update方法 与 render方法
export function lifecycleMixin(Vue){
  Vue.prototype._update = function(vnode){
    const vm = this;
    let el = vm.$el;

    // __patch__既有初始化方法  又有更新（vm.$el重新赋值新的节点） 
    vm.$el = vm.__patch__(el,vnode);
  }

  
}

export function mountComponent(vm,el){
  vm.$el = el;
  // 1.调用render方法产生虚拟节点，虚拟DOM
  // 2.调用_update将虚拟DOM转化成真实DOM，并更新
  // console.log('vm----------',vm,vm._render());
  const updateComponents = ()=>{
    vm._update(vm._render());
  }

  let watcher = new Watcher(vm,updateComponents,true) //true 用于标识 是一个渲染watcher
}