## 目录结构
```
├─dist                   # 项目构建后的文件
├─src                    # 项目源代码
    ├─complier          # 与模板编译相关的代码
    ├─core              # 通用的、与运行平台无关的运行时代码
      ├─global-api     # 全局api的代码
      ├─instance       # Vue.js实例的构造函数和原型方法
      ├─observe        # 实现变化侦测的代码
      ├─vdom           # 实现virtual dom的代码
      └─components     # 内置组件的代码
    ├─shared            # 项目公用的工具代码
```

#### 数据劫持
```
  流程：
    initData对数据进行初始化操作，然后调用observe函数并实例化observer类，内部对所有属性进行了重写，并递归劫持了对象中的对象

  原理：
    - 对象直接基于Object.defineProperty对数据进行递归劫持，
    - 数组劫持的核心，就是重写数组的方法，对新增的属性进行判断和观测，如果数组有对象，对数组中的对象进行递归劫持
    
```

#### dom解析渲染
```
  对模板进行编译,模板转换成ast语法树,将ast语法树转换成render函数
```

#### 依赖收集
```
- 所谓的依赖收集（观察者模式）被观察者指代理的数据（使用dep去收集）,观察者（渲染watcher 计算属性，用户watcher），一个watcher中可能对应着多个数据，watcher中还需要保存dep。

- 实现：
在属性初始化时通过给每个属性增加一个dep收集器，默认渲染页面的时候会进行依赖收集（会触发属性的get方法,因此也只会对页面上渲染的属性进行依赖收集）

> 多对多的关系
（每个属性都有一个dep  watcher相当一个视图）
一个组件中 有多个属性（n个属性形成一个视图） n个dep对应一个watcher
一个属性对应着多个组件 1个dep对应着多个watcher 
dep 和 watcher 多对多的关系
```

#### nextTick
```
  - nextTick 不是维护了一个异步任务   而是将这个任务维护到了队列中

  - 异步任务
    - vue中的 nextTick没有直接采用某个api 而是采用优雅降级的方式
    - 内部首先采用promise(ie 不兼容) MutationObserver(h5 的api)  ie专项 setImmediate
```
