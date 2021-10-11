<template>
  <div class="plugin-dialog">
    <div class="plugin-dialog__content">

      <!-- 主流程 -->
      <avatar-custom-multiple
        :config="config"
        :selectFiles="selectFiles"
        @saveFileAndAvatar="saveFileAndAvatar"
        @close="closePlugin"
        @save="saveCustom"
      />

      <!-- 增量服务 -->
      <increment-services
        :customState="customState"
        :config="config"
        :previewBody="previewBody"
        @save="saveIncrement"
        @close="setCustomState"
      />

      <!-- 文件上传S3 -->
      <files-uploader
        v-if="uploadVisible"
        :files="uploadFiles"
        :website="config.website"
        @complete="completeUpload"
      />
    </div>
  </div>
</template>

<script>
import { nextTick, toRaw } from "vue";

import FilesUploader from "../components/files-uploader/FilesUploader.vue";
import IncrementServices from "./increment/IncrementServices.vue";
import BaseLoadingDot from "../base/BaseLoadingDot.vue";
import AvatarCustomMultiple from "./avatar-custom-multiple/AvatarCustomMultiple.vue";

import useBodyMain from "../composables/useBodyMain";
import useUpload from "../composables/useUpload";

export default {
  name: "MinimePillow",

  components: {
    FilesUploader,
    IncrementServices,
    BaseLoadingDot,
    AvatarCustomMultiple,
  },

  props: {
    config: {
      type: Object,
      deafult: () => ({
        increment: {},
      }),
    },
  },

  emits: {
    close: null,
    complete: null,
  },

  setup(props, context) {
    // 主流程
    const {
      isCustomBody,
      customState,
      currentStep,
      selectFiles,
      previewBody,
      saveFileAndAvatar,
      setBodyConfig,
      setStep,
      setPreview,
      setCustomState,
      getBodyConfig,
    } = useBodyMain(props);

    // 上传
    const { uploadFiles, uploadVisible, startUpload } = useUpload();

    /*
    保存定制主人物图
    修改主定制状态
    */
    async function saveCustom({url, config}) {
      setPreview(url);
      setBodyConfig(config);
      await nextTick();
      setCustomState(true);
    }

    // 文件上传
    let otherData = {};
    function saveIncrement(params) {
      const { preview, increment, productOptionsValue } = params;

      // 增量和产品SKU选项
      otherData = {
        increment,
        productOptionsValue,
      };

      // 上传准备
      prepareUpload(preview);
    }

    // 上传准备
    function prepareUpload(preview) {
      let files = [
        {
          name: "Preview",
          url: preview,
        },
      ];
      selectFiles.value.forEach((item, index) => {
        files.push(
          {
            name: `Original_${index}`,
            url: item.data.rawFile,
          },
          {
            name: `Ai_${index}`,
            url: item.data.avatar.url,
          }
        );
      });
      startUpload(files.filter((item) => item.url));
    }

    // 文件上传完成
    function completeUpload(res) {
      const data = {
        files: toRaw(res),
        body: getBodyConfig(),
        increment: toRaw(otherData.increment),
        productOptionsValue: toRaw(otherData.productOptionsValue),
      };

      context.emit("complete", data);
      // 关闭插件
      closePlugin();
    }

    // 关闭插件
    function closePlugin() {
      context.emit("close");
    }

    return {
      currentStep,
      isCustomBody,
      selectFiles,
      previewBody,
      customState,
      setStep,
      setCustomState,
      saveIncrement,
      uploadFiles,
      uploadVisible,
      saveCustom,
      closePlugin,
      completeUpload,
      saveFileAndAvatar
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.plugin-dialog {
  @include pos-fixed(0, 0, 0, 0, 999999);
  @include flex-row-center;
  background-color: rgba($color: #000000, $alpha: 0.8);
  font-family: "Roboto", Arial, Helvetica, sans-serif;

  .plugin-dialog__content {
    width: 400px;
    height: 700px;
    border-radius: 10px;
    overflow: hidden;
    background-color: #ffffff;
    position: relative;
  }
}

// 加载
.publish-loading {
  @include pos-absolute(0, 0, 0, 0, 2021);
  @include flex-row-center;
  background-color: #ffffff;
}

@media screen and (max-width: 750px) {
  .plugin-dialog {
    .plugin-dialog__content {
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
  }
}

// 左方
.slide-left-fade-enter-from,
.slide-left-fade-leave-to {
  transform: translate3d(-10px, 0, 0);
  opacity: 0;
}
.slide-left-fade-leave-from,
.slide-left-fade-enter-to {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.slide-left-fade-enter-active {
  transition: all 0.3s ease-in-out;
}
.slide-left-fade-leave-active {
  transition: all 0.1s ease;
}
</style>