/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 14:27:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-01-27 10:13:40
 */
import { reactive, toRefs, onMounted, inject } from "vue";

export default function useSkin(props) {

  const language = inject('language');

  const bodyList = props.config.mainData.body.list;

  const state = reactive({
    currentGroupName: '',
    navigation: []
  })

  onMounted(() => {
    if (bodyList && bodyList.length > 0) {
      state.currentGroupName = bodyList[0].name;
      state.navigation = bodyList.map((item, index) => {
        let name;
        if (item.language) {
          name = item.language[language] || item.name;
        } else {
          name = item.name;
        }
        return {
          name,
          count: item.images.length,
        };
      });
    }
  })

  // 尺寸修改
  const changeGroupName = (name) => {
    state.currentGroupName = name;
  }

  return {
    ...toRefs(state),
    changeGroupName
  }
}