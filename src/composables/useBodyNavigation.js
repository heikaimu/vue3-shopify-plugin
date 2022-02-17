/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 14:27:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-01-27 17:52:59
 */
import { reactive, toRefs, onMounted, inject, computed } from "vue";

export default function useSkin(props) {

  const language = inject('language');

  const bodyList = props.config.mainData.body.list;

  const state = reactive({
    currentGroupId: '',
    navigation: []
  })

  const currentGroupName = computed(() => {
    const group = bodyList.find(item => item.id === state.currentGroupId);
    return '';
  })

  onMounted(() => {
    if (bodyList && bodyList.length > 0) {
      state.currentGroupId = bodyList[0].id;
      state.navigation = bodyList.map((item, index) => {
        let name;
        if (item.language) {
          name = item.language[language] || item.name;
        } else {
          name = item.name;
        }
        return {
          name,
          id: item.id,
          count: item.images.length,
        };
      });
    }
  })

  // 尺寸修改
  const changeGroup = (id) => {
    state.currentGroupId = id;
  }

  return {
    ...toRefs(state),
    currentGroupName,
    changeGroup
  }
}