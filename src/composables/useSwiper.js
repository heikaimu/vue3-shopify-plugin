/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 16:42:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-09 16:36:18
 */
import { reactive, toRefs, computed } from "vue";

export default function useSwiper(props, context) {

  const state = reactive({
    mySwiper: null
  })

  const pagination = computed(() => {
    const total = props.data.length;
    const currentIndex = props.activeIndex;
    return `(${currentIndex + 1} / ${total})`;
  });

  return {
    ...toRefs(state),
    pagination
  }
}