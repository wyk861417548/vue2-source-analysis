import { isPlainObject } from "../../shared/util";
import Dep from "../observer/dep";
import { observe } from "../observer/index";
import Watcher from "../observer/watcher";

// vm.xxx  代理到 vm._data.xxx
function proxy(vm,target,key){
  Object.defineProperty(vm,key,{
    get(){
      return vm[target][key]
    },
    set(value){
      vm[target][key] = value;
    }
  })
}

export function initState(vm){
  const opts = vm.$options;

  if(opts.methods) initMethods(vm, opts.methods)
  
  if(opts.data) initData(vm)
    
  if(opts.computed) initComputed(vm)

  if(opts.watch) initWatch(vm)
}

// 数据初始化
function initData(vm){
  let data = vm.$options.data; //data可能是函数和对象 vue3认定是函数
  
  data = typeof data =='function'?data.call(vm):data;

  vm._data = data;

  observe(data)

  for (const key in data) {
    proxy(vm,'_data',key)
  }
}

// 初始化 computed函数
// 1.初始化computed函数，遍历对象，给每个计算属性创建一个计算属性watcher
// 2.定义computed函数的get,set函数
// 3.创建计算属性控制器（createComputedGetter），并且让当前的计算属性的依赖属性去记录当前的渲染watcher，在watcher中创建计算函数，以及脏值判断逻辑
//（只有当依赖属性改变后，通知渲染watcher重新渲染，才会重新调用watcher.evaluate更新数据）
function initComputed(vm){
  const computed = vm.$options.computed;
  const watchers = vm._computedWatchers = Object.create(null);

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function'?userDef:userDef.get;

    // 每个计算属性 对应一个计算属性watcher  默认lazy：true 调用一次计算属性方法watcher.evaluate 计算值
    // 此刻的计算watcher的get方法 就是当前计算属性的get方法
    watchers[key] = new Watcher(vm,getter,{ lazy: true })
    
    // 当页面{{}}展示计算属性的时候，get即createComputedGetter方法执行
    defineComputed(vm,key,userDef)
  }
}

// 定义计算属性
function defineComputed(target,key,userDef){
  const setter = userDef.set || (()=>{})
  Object.defineProperty(target,key,{
    get:createComputedGetter(key),
    set:setter
  })
}

// 创建一个计算属性控制器 用于控制页面多次调用计算属性只执行一次
// 计算属性根本不会去收集依赖，只会让自己的依赖属性去收集依赖
function createComputedGetter(key){
  return function(){
    const watcher = this._computedWatchers[key]; //获取到对应计算属性的watcher
    
    console.log('watcher.dirty',watcher.dirty);
    if(watcher.dirty){
      // 如果用户数据是脏的就去执行的函数更新数据
      watcher.evaluate()
    }

    // 这里的是渲染watcher了让计算属性记住渲染watcher 用于当值变化地时候 即调用计算watcher更新值，也调用渲染watcher更新视图
    // 如果依赖属性没有在页面上展示过，那么先会记录计算属性watcher，然后计算渲染watcher，否则反之
    // （通过栈的形式，首先是渲染watcher然后push计算属性wather，执行完计算属性后将计算属性watcher记住，然后pop出栈） 
    if(Dep.target){
      watcher.depend();
    }

    return watcher.value;
  }
}

// 方法初始化
function initMethods(vm,methods){
  for (const key in methods) {
    vm[key] = methods[key].bind(vm)
  }
}

// 初始化watch
// 1.遍历watch对象，给每一个监听属性添加一个watch watcher
// 2.判断值是对象还是函数，如果是对象单独处理handler
// 3.将watch遍历的 key 做为传入watcher中，并包裹成函数赋值给getter，该函数执行的结果作为watch的旧值新值

// watch写法
// 1：watch:{name:'fn'}
// 2：watch:{name:()=>{}}
// 3：watch:{name:[()=>{},()=>{}]}
// 4：watch:{name:{handler(){},immediate:true}}
// 5:vm.$watch(()=>vm.name,()=>{})
function initWatch(vm){
  const watch = vm.$options.watch;
  for (const key in watch) {
    console.log('key---------',key);
    const handler = watch[key]; //可以是字符串，函数，数组,对象
    if(Array.isArray(handler)){
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm,key,handler[i])
      }
    }else{
      createWatcher(vm,key,handler)
    }
  }
}

function createWatcher(vm,expOrFn,handler,options){
  // 如果是一个对象 watch:{name:{handler(){},immediate:true}}
  if(isPlainObject(handler)){
    options = handler;
    handler = handler.handler
  }

  if(typeof handler === 'string'){
    handler = vm[handler]
  }
  return vm.$watch(expOrFn,handler,options)
}

export function stateMixin(Vue){
  // 创建watch 即组件自己的的watcher
  Vue.prototype.$watch = function (expOrFn,cb,options={}){
    const vm = this
    const watcher = new Watcher(vm,expOrFn,{user:true},cb)

    // 如果是立即执行
    if(options.immediate){
      cb.call(vm,watcher.value)
    }
  }

}