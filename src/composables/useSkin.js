/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 14:27:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-12 16:37:52
 */
import { reactive, toRefs, watch, onMounted } from "vue";
import { debounce } from "lodash";

export default function useSkin(props) {

  const state = reactive({
    skinList: [],
    skin: ''
  })

  onMounted(() => {
    state.skinList = [
      {
        name: "white",
        color: "#faebd5",
      },
      {
        name: "black",
        color: "#986e59",
      },
      {
        name: "yellow",
        color: "#f7d8aa",
      },
    ];
    state.skin = props.config.defaultSkin || 'white';
  })

  // 尺寸修改
  const changeSkin = debounce(function (skin) {
    state.skin = skin;
  }, 300);

  return {
    ...toRefs(state),
    changeSkin
  }
}