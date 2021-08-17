/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-05 17:08:22
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-09 15:27:17
 */
import { reactive, toRefs, toRaw } from "vue";

export default function useBodyMain() {
  const state = reactive({
    uploadFiles: [],
    uploadVisible: false,
  });

  function startUpload(files) {
    state.uploadFiles = files;
    state.uploadVisible = true;
  }

  return {
    ...toRefs(state),
    startUpload
  }
}