/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-05 17:08:22
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-13 14:22:58
 */
import { reactive, toRefs, onMounted } from "vue";

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

  // 保存头像和源文件
  function saveFileAndAvatar(data) {
    const { avatar, rawFile } = data;
    state.avatar = avatar;
    state.rawFileURL = rawFile;
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
    if (state.isCustomBody) {
      return {
        id: state.bodyConfig.id,
        name: state.bodyConfig.name,
        groupName: state.bodyConfig.groupName,
        url: state.bodyConfig.images[0].url,
      }
    } else {
      return {}
    }
  }

  return {
    ...toRefs(state),
    saveFileAndAvatar,
    setBodyConfig,
    setStep,
    setPreview,
    getBodyConfig
  }
}