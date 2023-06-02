import { compileToFunction } from "../../compiler/index";
import { createElm, patch } from "../vdom/patch";

// 1.实现diff算法
// 在之前的更新中每次更新都会产生新的虚拟节点，通过新的虚拟节点生成真是节点，生成后替换掉老的节点
// 在第一次渲染的时候我们会产生虚拟节点，第二次更新我们也会调用render方法产生虚拟节点，通过比对虚拟节点的差异，进行部分更新

// -------------------diffTest 为了方便观察前后的虚拟节点 ‘测试’-----------------
// 生成虚拟节点的过程
// 1.调用compileToFunction函数对模板进行编译，生成render函数
// 2.调用render函数，生成虚拟dom树结构
// 3.调用patch生成真实dom节点并替旧节点

export function diffTest(Vue){
  // 对模板进行编译  模板转换成ast语法树 将ast语法树转换成render函数(这里注意这里空格编译问题可能导致死循环栈溢出)
  let render1 = compileToFunction(`<ul style='color:#f99'>
  <li key='a'>a</li>
  <li key='b'>b</li>
  <li key='c'>c</li>
  <li key='d'>d</li>
  </ul>`)

  let vm1 = new Vue({})
  let preVNode = render1.call(vm1)
  let el = createElm(preVNode)
  document.body.appendChild(el);


  let render2 = compileToFunction(`<ul style='color:#f99;'>
  <li key='d' style='color:#f33'>d</li>
  <li key='a' style='color:#f33'>a</li>
  <li key='b' style='color:#f33'>b</li>
  <li key='c' style='color:#f33'>c</li>
  </ul>`)
  let vm2 = new Vue({})
  let nextVNode = render2.call(vm2)

  setTimeout(()=>{
    patch(preVNode,nextVNode)
  },2000)
}



