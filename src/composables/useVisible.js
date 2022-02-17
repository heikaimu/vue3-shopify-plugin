/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-28 16:30:39
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-13 11:06:41
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

  function closeDialog() {
    context.emit('update:visible', false);
  }

  return {
    isVisible,
    closeDialog
  }
}