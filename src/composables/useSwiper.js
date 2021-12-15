/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 16:42:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-13 14:23:30
 */
import { reactive, toRefs, computed } from "vue";

export default function useSwiper(props, context) {

  const state = reactive({
    mySwiper: null
  })

  const pagination = computed(() => {
    const currentIndex = props.activeIndex;
    return `(${currentIndex + 1} / ${props.data.length})`;
  });

  return {
    ...toRefs(state),
    pagination
  }
}