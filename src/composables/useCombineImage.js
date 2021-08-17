/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-04 15:03:06
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-09 17:19:06
 */
import { reactive, toRefs } from "vue";
import { CombineImage } from "../utils/combineImage";
import { getRandomID } from '../utils/image';

export default function useCombineImage(props) {

  const combineImage = new CombineImage();;

  let lastID = '';

  const state = reactive({
    preview: '',
    loading: true
  })

  // 渲染效果图
  async function renderPreview(params) {
    lastID = getRandomID();
    // 中断上次的请求
    // combineImage.stop();
    // TODO 性能优化
    state.loading = true;
    const { url, id } = await combineImage.getURL(params, lastID);
    if (id === lastID) {
      state.preview = url;
    }
    state.loading = false;
  }

  return {
    ...toRefs(state),
    renderPreview
  }
}