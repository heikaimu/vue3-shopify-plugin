/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 14:27:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-12 14:43:16
 */
import { reactive, toRefs, computed, onMounted } from "vue";
import { debounce } from "lodash";

export default function useSkin(props) {

  const state = reactive({
    currentGroupName: '',
    navigation: []
  })

  onMounted(() => {
    if (props.config.miniMeData && props.config.miniMeData.length > 0) {
      state.currentGroupName = props.config.miniMeData[0].name;
      state.navigation = props.config.miniMeData.map((item, index) => {
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