/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 15:03:06
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-04 15:51:33
 */
import { reactive, toRefs } from "vue";
import { CombineImage } from "../utils/combineImage";

export default function useCombineImage(props) {

  const combineImage = new CombineImage();;
  
  const state = reactive({
    preview: '',
    loading: true
  })

  // 渲染效果图
  async function renderPreview(params) {
    // 中断上次的请求
    // combineImage.stop();
    // TODO 性能优化
    state.loading = true;
    state.preview = await combineImage.getURL(params);
    state.loading = false;
  }

  return {
    ...toRefs(state),
    renderPreview
  }
}