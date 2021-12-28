/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-28 16:30:39
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-28 16:32:09
 */
import { computed } from "vue";

export default function useVisible(props, context) {

  const isVisible = computed({
    get() {
      return props.visible;
    },
    set(val) {
      context.emit('update:visible', val);
    }
  });

  return {
    isVisible
  }
}