<template>
  <div class="plugin-dialog">
    <div class="plugin-dialog__content">
      <step-file-select
        v-if="currentStep === 'fileSelect'"
        @change="changeFile"
        @setStep="setStep"
        @close="closePlugin"
      />
      <step-image-station
        v-if="currentStep === 'imageStation'"
        :rawFile="rawFile"
        @setAvatar="setAvatar"
        @setStep="setStep"
        @close="closePlugin"
      />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

import StepFileSelect from "./step-file-select/StepFileSelect.vue";
import StepImageStation from "./step-image-station/StepImageStation.vue";

import { imageReset } from "../utils/image";

export default {
  name: "MinimePillow",

  components: {
    StepFileSelect,
    StepImageStation,
  },

  setup() {
    const state = reactive({
      currentStep: "fileSelect",
      rawFile: "",
      avatar: {},
    });

    function changeFile(file) {
      // 压缩文件
      imageReset({
        file: file,
        quality: 0.9,
        targetSize: 1920,
        angle: 0,
      }).then((url) => {
        state.rawFile = url;
        state.currentStep = "imageStation";
      });
    }

    // 设置当前使用的头像
    function setAvatar(avatar) {
      state.avatar = avatar;
    }

    // 设置步骤
    function setStep(step) {
      state.currentStep = step;
    }

    // 关闭插件
    function closePlugin() {
      alert();
    }

    return {
      ...toRefs(state),
      changeFile,
      setAvatar,
      setStep,
      closePlugin,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.plugin-dialog {
  @include pos-fixed(9);
  @include flex-row-center;
  background-color: rgba($color: #000000, $alpha: 0.8);

  .plugin-dialog__content {
    width: 400px;
    height: 700px;
    border-radius: 10px;
    overflow: hidden;
    background-color: #ffffff;
  }
}
</style>