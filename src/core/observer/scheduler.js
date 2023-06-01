import { nextTick } from "../utils/next-tick";

// 使用队列 防止属性多次修改 多次执行更新
let queue = [];
let has = {};
let pending = false;

function flashSchedulerQueue(){
  let flashQueue = queue.slice(0);
  console.log('queue',queue);
  queue = [];
  has = {};
  pending = false;
  flashQueue.forEach(q=>q.run())
}

export function queueWatcher(watcher){
  let id = watcher.id;
  if(!has[id]){
    has[id] = true;
    queue.push(watcher);
  }
  // 多次修改属性的值  只会执行一次（使用了宏任务setTimeout）
  // 不论update执行多少次 但是最终只执行一轮刷新操作
  if(!pending){
    nextTick(flashSchedulerQueue)
    pending = true;
  }
}