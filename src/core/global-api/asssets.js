import { ASSET_TYPES } from "../../shared/constants";
import { isPlainObject } from "../../shared/util";

export function initAssetRegisters(Vue){
  ASSET_TYPES.forEach(type=>{
    Vue[type] = function(id,definition){
      if(!definition){
        return this.options[type + 's'][id]
      }else{
        // 如果definition已经是一个函数了，那么说明用户自己调用了Vue.extend
        if(type === 'component' && isPlainObject(definition)){
          definition = this.options._base.extend(definition)
        }
        // console.log('definition',definition,this.options);
        this.options[type + 's'][id] = definition;
      }
      
    }
  })

  // Vue.component = function(id,definition){
  //   definition = typeof definition === 'function'?definition:Vue.extend(definition)
  //   Vue.options.components[id] = definition;
  // }
}