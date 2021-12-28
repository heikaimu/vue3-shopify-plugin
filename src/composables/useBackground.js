/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 14:27:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-27 14:42:32
 */
import { reactive, toRefs, onMounted, nextTick, computed } from "vue";
import { debounce } from "lodash";

export default function useBackground(props) {

  const state = reactive({
    groupIndex: 0,
    backgroundGroupList: [],
    backgroundList: [],
    backgroundIndex: -1
  })

  // 背景名
  const backgroundName = computed(() => {
    const curGroup = state.backgroundGroupList[state.groupIndex];
    if (!curGroup) {
      return;
    }

    const curItem = curGroup.list[state.backgroundIndex];
    if (!curItem) {
      return;
    }

    return curItem.title;
  })

  onMounted(async () => {
    // 通过传入的背景色名称来获取索引，如果是背景(bg-xx)直接匹配，如果是颜色Color:xxx只匹配前面部分
    const list = props.data.backgroundList.filter(item => Boolean(item)).map(item => {
      const { list, title, group } = item;
      return {
        list,
        group,
        title: title.includes(':') ? title.split(':')[0] : title,
      }
    });
    await nextTick();

    // 构造分组
    const groupKeys = [...new Set(list.map(item => item.group))].filter(key => Boolean(key));
    state.backgroundGroupList = groupKeys.map(key => {
      const curList = list.filter(item => item.group === key)
      return {
        name: key,
        list: curList,
        count: curList.length
      }
    })

    // 没有分组的添加进other分组
    const otherList = list.filter(item => !item.group)
    const otherGroup = {
      name: 'other',
      list: otherList,
      count: otherList.length
    }

    if (otherGroup.list.length > 0) {
      state.backgroundGroupList.push(otherGroup);
    }

    // 去掉分组内容为0的组
    for (let i = state.backgroundGroupList.length - 1; i >= 0; i--) {
      if (state.backgroundGroupList[i].list.length === 0) {
        state.backgroundGroupList.splice(i, 1);
      }
    }

    state.groupIndex = 0;
    state.backgroundIndex = 0;

    // 遍历获取当前索引
    for (let i = 0; i < state.backgroundGroupList.length; i++) {
      const group = state.backgroundGroupList[i];
      for (let j = 0; j < group.list.length; j++) {
        const item = group.list[j];
        if (item.title === props.backgroundActiveName) {
          state.groupIndex = i;
          state.backgroundIndex = j;
        }
      }
    }

    await nextTick();

    // 当前展示的列表
    state.backgroundList = state.backgroundGroupList[state.groupIndex].list;
  })

  // 切换组
  function changeGroup(index) {
    state.groupIndex = index;
    state.backgroundList = state.backgroundGroupList[index].list;
    // 如果新组没有这个索引的数据则设置index为0
    if (!state.backgroundList[state.backgroundIndex]) {
      state.backgroundIndex = 0;
    }
  }

  // 背景修改
  const changeBackgroundIndex = debounce(function (index) {
    state.backgroundIndex = index;
  }, 300)

  // 获取背景
  function getBackgroundImage(size) {
    const curGroup = state.backgroundGroupList[state.groupIndex];
    if (!curGroup) {
      return;
    }

    const curItem = curGroup.list[state.backgroundIndex];
    if (!curItem) {
      return;
    }

    const curImg = curItem.list.find(image => image.size === size);
    if (!curImg) {
      return;
    }

    return curImg.url;
  }

  return {
    ...toRefs(state),
    backgroundName,
    changeBackgroundIndex,
    getBackgroundImage,
    changeGroup
  }
}

// 获取随机组名
function randomGroup() {
  const group = ['动漫', '古风', '抽象', '色彩', '漫威'];
  return group[getRandomNum(0, 6)];
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}