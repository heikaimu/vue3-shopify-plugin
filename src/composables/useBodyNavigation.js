/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 14:27:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-12 14:03:20
 */
import { reactive, toRefs, onMounted } from "vue";

export default function useSkin(props) {

  const bodyList = props.config.mainData.body.list;

  const state = reactive({
    currentGroupName: '',
    navigation: []
  })

  onMounted(() => {
    if (bodyList && bodyList.length > 0) {
      state.currentGroupName = bodyList[0].name;
      state.navigation = bodyList.map((item, index) => {
        return {
          name: item.name,
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