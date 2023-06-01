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
