import { observe } from "../observer/index";



export function initState(vm){
  const opts = vm.$options;
  
  if(opts.data){
    initData(vm)
  }
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