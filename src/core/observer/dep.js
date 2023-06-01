// 1.观察者模式实现依赖收集
// 2.异步更新策略

// 即使用观察者模式
// 1.我们可以给模板中的属性 增加一个收集器 dep
// 2.页面渲染的时候，我们将渲染逻辑封装在watcher中  vm._update(vm._render())
// 3.让dep记住这个watcher即可，稍后属性变化了可以找到对应的dep中存放的watcher进行重新渲染

let id = 0;
class Dep{
  constructor(){
    this.id = id++;
    this.subs = [];
  }

  depend(){
    // （dep 和 watcher 是多对多的关系  一个属性在多个组件中使用  dep -> 多个watcher）
    // 一个组件中有多个属性 watcher -> 多个dep

    // Dep.target === wathcer
    Dep.target.addDep(this)
  }

  // 记录当前属性所对应的视图watcher
  addSub(watcher){
    this.subs.push(watcher)
  }

  // 当属性发生变化的时候 调用其对应的视图watcher进行更新
  notify(){
    this.subs.forEach(watcher=>watcher.update())
  }
}

Dep.target = null;


// （每个属性都有一个dep  watcher相当一个视图）
// 一个组件中 有多个属性（n个属性形成一个视图） n个dep对应一个watcher
// 一个属性对应着多个组件 1个dep对应着多个watcher 
// dep 和 watcher 多对多的关系

export default Dep;