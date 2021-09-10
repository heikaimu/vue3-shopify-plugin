/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-05 17:08:22
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-10 10:58:48
 */
import { reactive, toRefs, onMounted } from "vue";

import { imageReset } from "../utils/image";

export default function useBodyMain(props, context) {
  const state = reactive({
    // 当前步骤
    currentStep: "fileSelect",
    // 是否进行身体定制（包含扣头）
    isCustomBody: true,
    // 原始文件base64
    rawFileURL: "",
    // 头像信息
    avatar: {},
    // 身体配置
    bodyConfig: {},
    // 定制身体模版预览图
    previewBody: ""
  });

  onMounted(() => {
    // 如果身体配置模版数量为0，则不进行定制
    if (props.config.miniMeData.length === 0) {
      state.isCustomBody = false;
    } else {
      state.isCustomBody = true;
    }
  })

  // 选择文件
  function changeFile(file) {
    // 压缩文件
    imageReset({
      file: file,
      quality: 0.9,
      targetSize: 1920,
      angle: 0,
    }).then((url) => {
      setRawFile(url);
      setStep("imageStation");
    });
  }

  // 使用缓存文件
  function useCacheFile(item) {
    setRawFile(item.rawFileURL);
    state.avatar = {
      url: item.url,
      chin: item.chin,
      width: item.width,
      height: item.height,
    };
    setStep("bodyCustom");
  }

  // 设置源文件
  function setRawFile(url) {
    state.rawFileURL = url;
  }

  // 使用AI返回的头像
  function saveAIAvatar(avatar) {
    state.avatar = avatar;
    setStep("bodyCustom");
  }

  // 设置当前选中的身体配置
  function setBodyConfig(config) {
    state.bodyConfig = config;
  }

  // 步骤
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
    saveAIAvatar,
    setBodyConfig,
    setRawFile,
    setStep,
    setPreview,
    getBodyConfig
  }
}