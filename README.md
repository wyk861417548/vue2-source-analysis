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
