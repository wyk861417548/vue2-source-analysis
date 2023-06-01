// 创建真实DOM元素
export function createElm(vnode){
  let {tag,data,text,children} = vnode;

  if(typeof tag === 'string'){
    vnode.el = document.createElement(tag)

    patchProps(vnode.el,data)
    
    children.forEach(child => { vnode.el.appendChild(createElm(child)) });
  }else{
    vnode.el = document.createTextNode(text)
  }
  return vnode.el;
}

// 更新属性
function patchProps(el,props){
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
  }
}