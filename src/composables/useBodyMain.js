/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-05 17:08:22
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-18 15:28:22
 */
import { reactive, toRefs, onMounted } from "vue";
import { getRandomID, clearImageEdgeBlank } from '../utils/image'

export default function useBodyMain(props, context) {
  const state = reactive({
    // 当前步骤
    currentStep: "fileSelect",
    // 是否进行身体定制（包含扣头）
    isCustomBody: true,
    // 设置定制状态
    customState: false,
    // 用户选择文件
    selectFiles: [],
    // 身体配置
    bodyConfig: {},
    // 定制身体模版预览图
    previewBody: ""
  });

  onMounted(() => {
    // 如果身体配置模版数量为0，则不进行定制
    if (props.config.mainData.body.custom && props.config.mainData.body.list.length > 0) {
      state.isCustomBody = true;
    } else {
      state.isCustomBody = false;
    }
  })

  // 保存头像和源文件
  function saveFileAndAvatar(data) {
    const { avatar, rawFile } = data;
    state.selectFiles = [
      {
        data: {
          avatar,
          rawFile,
        },
        id: getRandomID()
      }
    ]
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
  async function setPreview(url) {
    state.previewBody = await clearImageEdgeBlank(url);
    return Promise.resolve();
  }

  // 设置定制状态
  function setCustomState(flag) {
    state.customState = flag;
  }

  // 获取身体配置
  function getBodyConfig() {
    if (state.isCustomBody) {
      return {
        id: state.bodyConfig.id,
        name: state.bodyConfig.name,
        groupName: state.bodyConfig.groupName,
        url: state.bodyConfig.images[0].url,
        faceNum: 1
      }
    } else {
      return {
        faceNum: 1
      }
    }
  }

  return {
    ...toRefs(state),
    saveFileAndAvatar,
    setBodyConfig,
    setStep,
    setPreview,
    getBodyConfig,
    setCustomState
  }
}