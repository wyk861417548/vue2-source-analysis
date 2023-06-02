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

#### 数组劫持更新
```
  - 数组劫持的核心，就是重写数组的方法，对新增的属性进行判断和观测，如果数组有对象，对数组中的对象进行递归劫持

  - 如果数组通过方法更改数组的后通知更新
```

#### mixin和生命周期实现
```
  - 1.mixin核心就是mergeOptions方法，通过对传入的options（父和子）进行合并,

  - 2.生命周期钩子则是合并成数组，然后通过callHook方法遍历执行
```

##### computed实现 以及 初始化流程
实现
  - 1.初始化computed函数，遍历对象，给每个计算属性创建一个计算属性watcher
  - 2.定义computed函数的get,set函数
  - 3.创建计算属性控制器（createComputedGetter），并且让当前的计算属性的依赖属性去记录当前的渲染watcher，在watcher中创建计算函数，以及脏值判断逻辑
  （只有当依赖属性改变后，通知渲染watcher重新渲染，才会重新调用watcher.evaluate更新数据）

流程
  - 1.页面首次渲染首先初始化数据，computed等等
  - 2.在执行$mount后 首先创建并pushTarget记录渲染watcher（栈存储），在页面渲染 "{{计算属性}}" 的时候会触发计算属性的get方法，如果是脏值（默认脏值）
  - 3.调用watcher.evaluate即调用get方法，通过pushTarget往栈中记录计算watcher，并执行计算属性函数
  - 4.计算属性函数中的依赖属性（observer监听属性）会去记录当前watcher即计算watcher
  - 5.依赖属性的dep记录完成后，执行计算函数得到计算结果，同时popTarget出栈当前计算属性（此时栈中就只有渲染watcher）
  - 6.此时回到了计算属性的createComputedGetter中，然后再调用watcher.depend()让当前计算属性的依赖属性记住当前的渲染watcher
  - 7.最后就是真实dom的创建以及渲染了

  - 8.如果改变了依赖属性，那么dep.notify()遍历执行watcher，首先执行计算watcher重新设置为脏值，然后执行渲染watcher接着走1-7步骤
