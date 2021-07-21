<template>
  <div class="plugin-dialog">
    <div class="plugin-dialog__content">
      <step-file-select
        v-if="currentStep === 'fileSelect'"
        @change="changeFile"
        @selectCache="useCacheFile"
        @setStep="setStep"
        @close="closePlugin"
      />
      <step-image-station
        v-else-if="currentStep === 'imageStation'"
        :rawFile="rawFile"
        @setAvatar="useAIAvatar"
        @setStep="setStep"
        @close="closePlugin"
      />
      <step-body-custom
        v-else-if="currentStep === 'bodyCustom'"
        :avatar="avatar"
        :config="config"
      />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, provide } from "vue";

import StepFileSelect from "./step-file-select/StepFileSelect.vue";
import StepImageStation from "./step-image-station/StepImageStation.vue";
import StepBodyCustom from "./step-body-custom/StepBodyCustom.vue";

import { imageReset } from "../utils/image";

export default {
  name: "MinimePillow",

  components: {
    StepFileSelect,
    StepImageStation,
    StepBodyCustom,
  },

  props: {
    config: {
      type: Object,
      deafult: () => {},
    },
  },

  setup() {
    const state = reactive({
      currentStep: "fileSelect",
      rawFile: "",
      avatar: {},
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
        state.rawFile = url;
        setStep("imageStation");
      });
    }

    // 使用缓存文件
    function useCacheFile(item) {
      state.rawFile = item.rawFile;
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
      useCacheFile,
      useAIAvatar,
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

@media screen and (max-width: 750px) {
  .plugin-dialog {
    .plugin-dialog__content {
      width: 100vw;
      height: 100vh;
      border-radius: 0;
    }
  }
}
</style>