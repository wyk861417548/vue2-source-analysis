let callbacks = [];
let waiting = false;
let timerFunc;

// 按照队列顺序执行回调
function flashCallback(){
  let cbs = callbacks.slice(0);

  callbacks =[];
  waiting = false;
  cbs.forEach(cb=>cb())
}

// nextTick 不是维护了一个异步任务   而是将这个任务维护到了队列中
export function nextTick(cb){
  callbacks.push(cb);

  if(!waiting){
    // setTimeout(()=>{
    //   flashCallback()
    // },0)
    timerFunc();
    waiting = true;
  }
}


// vue中的 nextTick没有直接采用某个api 而是采用优雅降级的方式
// 内部首先采用promise(ie 不兼容) MutationObserver(h5 的api)  ie专项 setImmediate
if(Promise){
  timerFunc = ()=>{
    Promise.resolve().then(flashCallback)
  }
}else if(MutationObserver){
  let observer = new MutationObserver(flashCallback)
  let textNode = document.createTextNode(1);
  observer.observe(textNode,{
    characterData:true //节点内容或节点文本的变动。
  })
  timerFunc = ()=>{
    textNode.textContent = 2;
  }
}else if(setImmediate){
  timerFunc = ()=>{
    setImmediate(flashCallback)
  }
}else{
  timerFunc = ()=>{
    setTimeout(flashCallback,0)
  }
}