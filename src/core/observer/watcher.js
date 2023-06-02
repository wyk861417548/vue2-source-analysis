// 使用观察者模式
// 1.我们可以给模板中的属性 增加一个收集器 dep
// 2.页面渲染的时候，我们将渲染逻辑封装在watcher中  vm._update(vm._render())
// 3.让dep记住这个watcher即可，稍后属性变化了可以找到对应的dep中存放的watcher进行重新渲染

import Dep, { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./scheduler";

//1) 当我们创建渲染watcher的时候我们会把当前的渲染watcher放到Dep.target上
//2) 当调用_render() 会进行取值操作 走到get上

let id = 0;
class Watcher{
  constructor(vm,expOrFn,options,cb){
    this.id = id++; //唯一标识
    this.vm = vm;  //当前视图实例
    this.renderWatcher  =options;  //true 标识是一个渲染watcher

    // expOrFn 视图初始化以及更新函数,computed计算函数，watch回调函数 其中一种
    if(typeof expOrFn === "string"){
      this.getter = function(){return vm[expOrFn]}
    }else{
      this.getter = expOrFn;
    }

    this.deps = [];  // 视图所对应属性对应的dep集合
    this.depId = new Set(); // 视图对应的dep的id集合
    this.lazy = options.lazy;  //用于标识自己来源是computed方法
    this.dirty = this.lazy; //脏值判断（用于判断computed方法是否缓存，是直接把watcher的value返回，否则再次调用evaluate计算新值）
    this.user = options.user; //标识是组件自己的watcher（即watch的watcher）
    this.cb = cb; //watch的回调
    
    // this.value 存储第一次执行的值 作为watch的oldVal
    this.value = this.lazy?undefined:this.get();
  }

  // 一个组件对应多个属性 每个组件上的重复属性只记录一次
  addDep(dep){
    if(!this.depId.has(dep.id)){
      this.deps.push(dep)
      this.depId.add(dep.id)

      dep.addSub(this) //属性的 dep 再记录当前 视图 wathcer 
    }
  }

  // 视图初始化 (如果是计算属性的 getter只是获取值 并不是更新视图的函数)
  get(){
    pushTarget(this);
    let value = this.getter.call(this.vm);
    popTarget()
    return value;
  }

  // 视图更新 
  update(){
    // 1.当计算属性的 某个值（记住了计算watcher 和 渲染watcher）更改时 会执行dep.notify 对队列中的watcher执行update方法 
    // 2.首先调用计算watcher 设置dirty为真，使计算属性走evaluate方法 获得计算属性值
    // 3.再调用渲染watcher更新视图
    console.log('-------------watcher---------------',this);
    if(this.lazy){
      this.dirty = true
    }else{
      // 使用队列记录每次操作的watcher（相同的只记录一次），防止每次操作都执行更新
      queueWatcher(this)
    }
  }

  // 真正的视图更新操作
  run(){
    console.log('----------run------------');
    let oldVal = this.value;
    let newVal = this.get();
    if(this.user){
      this.cb.call(this.vm,newVal,oldVal)
    }
  }

  // 计算属性通过计算watcher获取对应的值
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  // 让当前的计算属性去记住 渲染watcher 
  depend(){
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
}

// （每个属性都有一个dep  watcher相当一个视图）
// 一个组件中 有多个属性（n个属性形成一个视图） n个dep对应一个watcher
// 一个属性对应着多个组件 1个dep对应着多个watcher 
// dep 和 watcher 多对多的关系

export default Watcher;