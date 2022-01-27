/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 14:27:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-01-27 10:24:36
 */
import { reactive, toRefs, onMounted, nextTick, computed, inject } from "vue";

export default function useBackground(props) {

  const language = inject('language');

  const state = reactive({
    groupIndex: 0,
    backgroundGroupList: [],
    backgroundIndex: 0,
  })

  const backgroundGroupNavigationList = computed(() => {
    return props.data.backgroundList.map(item => {
      let title;
      if (item.language) {
        title = item.language[language] || item.title;
      } else {
        title = item.title;
      }
      return {
        title,
        count: item.children.length,
      };
    })
  })

  // 当前展示组数据
  const backgroundList = computed(() => {
    const curGroup = state.backgroundGroupList[state.groupIndex];
    return curGroup ? curGroup.children : [];
  })

  // 背景名
  const backgroundName = computed(() => {
    const curBackground = backgroundList.value[state.backgroundIndex];
    return curBackground ? curBackground.title : '';
  })

  onMounted(async () => {
    state.backgroundGroupList = props.data.backgroundList;
    state.groupIndex = 0;
    state.backgroundIndex = 0;

    for (let groupIndex = 0; groupIndex < state.backgroundGroupList.length; groupIndex++) {
      const group = state.backgroundGroupList[groupIndex];
      for (let backgroundIndex = 0; backgroundIndex < group.children.length; backgroundIndex++) {
        const item = group.children[backgroundIndex];
        if (item.title === props.backgroundActiveName) {
          state.groupIndex = groupIndex;
          state.backgroundIndex = backgroundIndex;
        }
      }
    }

    // 滚动到当前卡片处
    await nextTick();
    const dom = document.getElementById('activeCard');
    if (dom) dom.scrollIntoView({ behavior: 'smooth', block: "start", inline: "nearest" });
  })

  // 切换组
  function changeGroup(index) {
    state.groupIndex = index;
    // 如果新组没有这个索引的数据则设置index为0
    if (!backgroundList.value[state.backgroundIndex]) {
      state.backgroundIndex = 0;
    }
  }

  // 背景修改,加了个防抖
  function changeBackgroundIndex(index) {
    state.backgroundIndex = index;
  }

  return {
    ...toRefs(state),
    backgroundList,
    backgroundGroupNavigationList,
    backgroundName,
    changeBackgroundIndex,
    changeGroup
  }
}