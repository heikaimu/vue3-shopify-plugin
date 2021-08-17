/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 14:27:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-10 13:25:55
 */
import { reactive, toRefs, computed, onMounted } from "vue";
import { debounce } from "lodash";

export default function useSize(props) {
  
  const state = reactive({
    sizeList: [],
    sizeIndex: -1
  })

  const sizeName = computed(() => {
    return state.sizeList[state.sizeIndex];
  })

  onMounted(() => {
    state.sizeList = props.data.sizeList;
    const index = state.sizeList.findIndex(size => size === props.sizeActiveName);
    changeSizeIndex(index === -1 ? 0 : index);
  })

  // 尺寸当前值
  const currentSize = computed(() => {
    if (!state.sizeList.length === 0) {
      return "";
    }

    return state.sizeList[state.sizeIndex];
  });

  // 尺寸修改
  const changeSizeIndex = debounce(function (index) {
    state.sizeIndex = index;
  }, 300);

  return {
    ...toRefs(state),
    sizeName,
    currentSize,
    changeSizeIndex
  }
}