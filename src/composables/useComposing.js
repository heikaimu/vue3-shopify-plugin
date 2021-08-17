/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 14:27:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-10 11:16:43
 */
import { reactive, toRefs, onMounted, computed } from "vue";
import { debounce } from "lodash";

export default function useComposing(props) {

  const state = reactive({
    composingList: [],
    composingIndex: -1,
  })

  const composingName = computed(() => {
    const composing = state.composingList[state.composingIndex];
    return composing ? composing.title : '';
  })

  onMounted(() => {
    state.composingList = props.data.composingList;
    const index = state.composingList.findIndex(item => item.title === props.composingActiveName);
    changeComposingIndex(index === -1 ? 0 : index);
  })

  // 背景修改
  const changeComposingIndex = debounce(function (index) {
    state.composingIndex = index;
  }, 300)

  // 获取排版
  function getComposing(size) {
    const item = (state.composingList || [])[state.composingIndex];
    if (!item) {
      return [];
    }
    
    const composing = item.list.find(item => item.name === size);
    return composing ? composing.position : [];
  }

  return {
    ...toRefs(state),
    composingName,
    changeComposingIndex,
    getComposing
  }
}