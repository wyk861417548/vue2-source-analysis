import { isDef } from "../../shared/util";

// 比对两个dom元素是否相同
function sameVnode (vnode1,vnode2) {
  return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
}

// 判断是真实dom还是虚拟dom
function createComponent(vnode){
  let i = vnode.data;
  if((i=i.hook) && (i=i.init)){
    i(vnode)  //初始化组件 
  }

  // 说明是组件
  if(vnode.componentInstance){
    return true;
  }
}

// 创建真实DOM元素
export function createElm(vnode){
  let {tag,data,text,children} = vnode;

  if(typeof tag === 'string'){
    // 如果是组件 走dom解析渲染流程
    if(createComponent(vnode)){
      // 这里的$el 是整个组件的真实节点
      return vnode.componentInstance.$el;
    }

    vnode.el = document.createElement(tag)

    patchProps(vnode.el,data)
    
    children.forEach(child => { vnode.el.appendChild(createElm(child)) });
  }else{
    vnode.el = document.createTextNode(text)
  }
  return vnode.el;
}

// 更新属性
function patchProps(el,oldprops = {},props={}){
  let oldStyle = oldprops.style || {};
  let newStyle = props.style || {};

  // 如果老节点有、新节点无  删除老节点的
  for (const key in oldStyle) {
    if(!newStyle[key]){
      el.style[key] = '';
    }
  }

  //老的属性有 新的属性没有  删除
  for (const key in oldprops) {
    if(!props[key]){
      el.removeAttribute(key)
    }
  }

  for (const key in props) {
    if (key === 'style') {
      for (const styleName in props.style) {
        el.style[styleName] = props.style[styleName];
      }
    }else{
      el.setAttribute(key,props[key])
    }
  }
}

// 比对新老节点进行更新
export function patch(oldVNode,vnode){
  if(!oldVNode){ //这就是组件的挂载
    return createElm(vnode)
  }

  // 看是否是真实的元素节点
  let isRealElement = oldVNode.nodeType;
  if(isRealElement){
    const elm = oldVNode;
    const parentElm = elm.parentNode;  //拿到父元素
    // 将虚拟DOM转为真实DOM
    const newElm = createElm(vnode);

    parentElm.insertBefore(newElm,elm.nextSibling) //插入新节点

    parentElm.removeChild(elm); //删除老节点
    
    // 将新的节点返回，重新赋值 $el 用于下次更新
    return newElm;
  }else{
    return patchVnode(oldVNode,vnode)
  }
}

// 更新进入这里  实现diff算法
// 1.两个节点不是同一个节点，直接删除老的换上新的（没有对比）
// 2.两个节点是同一个节点（判断节点tag和节点的key sameVnode） 比较两个节点的属性是否有差异（复用老的属性，将差异属性进行更新） 
// 3.节点比较完毕开始比较儿子
function patchVnode(oldVNode,vnode){
  // console.log('oldVNode,vnode',oldVNode,vnode);
  // 如果两个节点不一样直接用新的节点替换老的节点
  if(!sameVnode(oldVNode,vnode)){
    let el = createElm(vnode)
    oldVNode.el.parentNode.replaceChild(el,oldVNode.el)
    return el;
  }

  let el = vnode.el = oldVNode.el; //如果标签相同直接使用老的的标签
  
  if(!oldVNode.tag){ // 代表是文本
    if(oldVNode.text != vnode.text){
      el.textContent = vnode.text;
    }
  }

  // 如果是标签相同我们比对属性
  patchProps(el,oldVNode.data,vnode.data)

  // 比较儿子节点
  const oldCh = oldVNode.children || []
  const newCh = vnode.children || []

  // 1.如果老节点和新节点的儿子节点都存在（重点 updateChildren）
  // 2.老节点儿子不存在，新节点儿子存在直接挂载
  // 3.老节点儿子存在，新节点儿子不存在，直接清空
  if(oldCh.length > 0 && newCh.length > 0){
    updateChildren(el,oldCh,newCh)
  }else if(newCh.length > 0){
    addVnodes(el,newCh)
  }else if(oldCh.length > 0){
    el.innerHTML = ''
  }
  return el;
}

// 挂载儿子节点
function addVnodes(el,newCh){
  for (let i = 0; i < newCh.length; i++) {
    let child = createElm(newCh[i])
    el.appendChild(child)
  }
}

/**
 * diff算法核心就是4中命中优化
  1.头大于尾 (从左往右比对 oldStartIndex：0 newStartIndex:0)
    (a) old: a b c d    (b) old:a b c 
        new: a b c          new:a b c d

  2.尾小于头 (从右往左比对)
    (a) old: a b c d   (b)  old:  b c d
        new:   b c d        new:a b c d
    
  3.首位交叉 (老->新 新->老)
    (a) old： a b c d  (b) old：a b c d
        new： b c d a      new：d a b c

  4.乱序比对
    d c b a 
    a b c d
*/
function updateChildren(el,oldCh,newCh){
  // diff 算法核心  vue2采用双指针比对
  let oldStartIndex=0;
  let newStartIndex=0;
  let oldEndIndex=oldCh.length-1;
  let newEndIndex=newCh.length-1;

  let oldStartVnode=oldCh[0];
  let newStartVnode=newCh[0];

  let oldEndVnode=oldCh[oldEndIndex];
  let newEndVnode=newCh[newEndIndex];

  // 创建旧节点 字典库  用于判断是否存在相同节点 采取复用
  function makeIndexByKey(children){
    let map = {};
    children.forEach((child,index)=>{
      map[child.key] = index
    })
    return map;
  }

  const map = makeIndexByKey(oldCh)
  // debugger
  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){
    if(!oldStartVnode){// 当乱序复用节点后 处理复用节点变为空的情况
      oldStartVnode = oldCh[++oldStartIndex]
    }else if(!oldEndVnode){// 当乱序复用节点后 处理复用节点变为空的情况
      oldEndVnode = oldCh[--oldEndIndex]

      // 1.头大于尾（假装顺序比对成功）  双指针 只要一方头指针大于尾指针就结束
      // 如果两个节点相同  头指针后移（同时子节点存在接着递归比对）
    }else if(sameVnode(oldStartVnode,newStartVnode)){
      patchVnode(oldStartVnode,newStartVnode) //如果两个节点相同则递归比较子节点
      oldStartVnode = oldCh[++oldStartIndex]
      newStartVnode = newCh[++newStartIndex]

      // 2.尾小于头（假装顺序比对成功）  双指针 只要一方尾指针小于头指针就结束
      // 如果两个节点相同  尾指针前移（同时子节点存在接着递归比对）
    }else if(sameVnode(oldEndVnode,newEndVnode)){
      patchVnode(oldEndVnode,newEndVnode) //如果两个节点相同则递归比较子节点
      oldEndVnode = oldCh[--oldEndIndex]
      newEndVnode = newCh[--newEndIndex]

      // 交叉比对 老的第一个 和 新的最后一个 相同  将老的第一个 移到 老的最后一个
    }else if(sameVnode(oldStartVnode,newEndVnode)){
      patchVnode(oldStartVnode,newEndVnode)
      el.insertBefore(oldStartVnode.el,oldEndVnode.el.nextSibling)
      oldStartVnode = oldCh[++oldStartIndex]
      newEndVnode = newCh[--newEndIndex]

      // 交叉比对 老的最后一个 和 新的第一个 相同  将老的最后一个 移到 老的第一个
    }else if(sameVnode(oldEndVnode,newStartVnode)){
      patchVnode(oldEndVnode,newStartVnode)
      el.insertBefore(oldEndVnode.el,oldStartVnode.el)
      oldEndVnode = oldCh[--oldEndIndex]
      newStartVnode = newCh[++newStartIndex]
    }else{ 
      //最后是乱序比对  先用旧节点字典库进行比对复用
      let moveIndex = map[newStartVnode.key];

      if(isDef(moveIndex)){
        let moveVnode = oldCh[moveIndex] //找到对应的节点进行服用

        // 如果在老节点中找到节点 ，将节点移到当前老节点的开始节点前
        el.insertBefore(moveVnode.el,oldStartVnode.el)
        oldCh[moveIndex] = undefined; // 并把 老节点的值设为空 表示这个节点已经移走了

        patchVnode(moveVnode,newStartVnode)  //比较属性和子节点
      }else{
        el.insertBefore(createElm(newStartVnode),oldStartVnode.el)
      }
      newStartVnode = newCh[++newStartIndex]
    }
  }

  //  1.头大于尾  old:a b c   new:a b c d 新的多余就插入
  //  2.尾大于头  old:b c d   new:a b c d 新的多余就插入
  if(newStartIndex <= newEndIndex){
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let childEl = createElm(newCh[i]);
      
      // 第一种情况（从左往右比对）结束  头指针大于尾指针 则新节点最后一个+1不存在，appendChild新节点
      // 第二种情况（从右往左比对）结束 头指针小于尾指针 当前比对节点的下一个存在，进行插入
      let anchor = newCh[newEndIndex + 1]?newCh[newEndIndex + 1].el:null;
      // anchor为 null，则将指定的节点添加到指定父节点的子节点列表的末尾。相当于appendChild
      el.insertBefore(childEl,anchor)
    }
  }

  // 第一种情况（从左往右比对）结束 和 第二种情况（从右往左比对）结束 老 头指针头小于尾指针
  if(oldStartIndex <= oldEndIndex){
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if(oldCh[i]){// 乱序比对后  复用的老节点设为空值 
        let childEl = oldCh[i].el;
        el.removeChild(childEl)
      }
    }
  }
}