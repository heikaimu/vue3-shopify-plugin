/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 14:27:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-12 13:53:16
 */
import { reactive, toRefs, onMounted, computed } from "vue";
import { debounce } from "lodash";

export default function useBackground(props) {

  const state = reactive({
    backgroundList: [],
    backgroundIndex: -1
  })

  const backgroundName = computed(() => {
    const background = state.backgroundList[state.backgroundIndex];
    return background ? background.title : '';
  })

  onMounted(() => {
    state.backgroundList = props.data.backgroundList;
    const index = state.backgroundList.findIndex(item => item.title === props.backgroundActiveName);
    changeBackgroundIndex(index === -1 ? 0 : index);
  })

  // 背景修改
  const changeBackgroundIndex = debounce(function (index) {
    state.backgroundIndex = index;
  }, 300)

  // 获取背景
  function getBackgroundImage(size) {
    const item = (state.backgroundList || [])[state.backgroundIndex];
    if (!item) {
      return "";
    }

    const backgroundImage = item.list.find(image => image.size === size);
    return backgroundImage ? backgroundImage.url : '';
  }

  return {
    ...toRefs(state),
    backgroundName,
    changeBackgroundIndex,
    getBackgroundImage
  }
}