/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 14:27:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-06 14:10:07
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
    state.sizeList = getSizeList()
    changeSizeIndex(props.sizeActiveIndex);
  })

  function getSizeList() {
    const { backgroundList } = props.data;
    if (!backgroundList || backgroundList.length === 0) {
      return [];
    }

    return backgroundList[0].list.map((item) => item.size);
  }

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