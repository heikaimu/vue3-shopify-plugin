/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-05 17:08:22
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-05 17:41:37
 */
import { reactive, toRefs } from "vue";

import { imageReset } from "../utils/image";

export default function useBodyMain(props, context) {
  const state = reactive({
    // 当前步骤
    currentStep: "fileSelect",
    // 原始文件base64
    rawFileURL: "",
    // 头像信息
    avatar: {},
    // 身体配置
    bodyConfig: {},
    // 定制身体模版预览图
    previewBody: ""
  });

  // 选择文件
  function changeFile(file) {
    // 压缩文件
    imageReset({
      file: file,
      quality: 0.9,
      targetSize: 1920,
      angle: 0,
    }).then((url) => {
      state.rawFileURL = url;
      setStep("imageStation");
    });
  }

  // 使用缓存文件
  function useCacheFile(item) {
    state.rawFileURL = item.rawFileURL;
    state.avatar = {
      url: item.url,
      chin: item.chin,
      width: item.width,
      height: item.height,
    };
    setStep("bodyCustom");
  }

  // 使用AI返回的头像
  function useAIAvatar(avatar) {
    state.avatar = avatar;
    setStep("bodyCustom");
  }

  // 设置当前选中的身体配置
  function setBodyConfig(config) {
    state.bodyConfig = config;
  }

  // 设置步骤
  function setStep(step) {
    state.currentStep = step;
  }

  // 设置预览图
  function setPreview(url) {
    state.previewBody = url;
  }

  // 获取身体配置
  function getBodyConfig() {
    return {
      id: state.bodyConfig.id,
      name: state.bodyConfig.name,
      groupName: state.bodyConfig.groupName,
      url: state.bodyConfig.images[0].url,
    }
  }

  return {
    ...toRefs(state),
    changeFile,
    useCacheFile,
    useAIAvatar,
    setBodyConfig,
    setStep,
    setPreview,
    getBodyConfig
  }
}