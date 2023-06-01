let oldArrayProto = Array.prototype; //获取数组原型

// 获取新的实例原型  不影响原数组方法
export let newArrayProto = Object.create(oldArrayProto);

// 找到所有变异方法
let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice',
]


methods.forEach(method=>{
  // 数组方法的重写
  newArrayProto[method] = function(...args){
    // 内部还是调用了原来的方法
    const result = oldArrayProto[method].call(this,...args);

    let inserted; //传参
    let ob = this.__ob__;

    // console.log('------this-----',this,args);

    switch(method){
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':  //arr.splice(0,1,{age:18},{a:1})
        inserted = args.slice(2)
        break;
      default:
        break;
    }

    if(inserted){
      // 对新增的内容再次进行观测
      ob.observeArray(inserted);
    }
    ob.dep.notify()
    return result;
  }
})