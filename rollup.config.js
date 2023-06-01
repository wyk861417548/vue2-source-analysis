import babel from 'rollup-plugin-babel'

export default{
  input:'./src/core/instance/index.js', //入口

  output:{
    file:'./dist/vue.js',
    // 如果打包的格式是iife , umd等格式，需要用一个全局变量来代表立即执行函数的结果。 name字段用于声明这个全局变量。
    name:'Vue',
    format:'umd', //es
    sourcemap:true //希望可以调试源代码
  },

  plugins:[
    babel({
      exclude:'node_modules/**'
    })
  ]
}