/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 14:27:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-07 13:53:18
 */
import { reactive, toRefs, onMounted, nextTick, computed } from "vue";
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

  onMounted(async() => {
    // 通过传入的背景色名称来获取索引，如果是背景(bg-xx)直接匹配，如果是颜色Color:xxx只匹配前面部分
    state.backgroundList = props.data.backgroundList.map(item => {
      const { list, title } = item;
      return {
        list: list,
        title: title.includes(':') ? title.split(':')[0] : title
      }
    });
    await nextTick();
    const index = state.backgroundList.findIndex(item => {
      return item.title === props.backgroundActiveName;
    });
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