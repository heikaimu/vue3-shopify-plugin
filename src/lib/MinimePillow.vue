<template>
  <div class="plugin-dialog">
    <div class="plugin-dialog__content">
      <transition name="slide-left-fade" mode="out-in">
        <step-file-select
          v-if="currentStep === 'fileSelect'"
          @change="changeFile"
          @selectCache="useCacheFile"
          @setStep="setStep"
          @close="closePlugin"
        />
        <step-image-station
          v-else-if="currentStep === 'imageStation'"
          :rawFileURL="rawFileURL"
          @setAvatar="useAIAvatar"
          @setStep="setStep"
          @close="closePlugin"
        />
        <step-body-custom
          v-else-if="currentStep === 'bodyCustom'"
          :avatar="avatar"
          :config="config"
          @selectBody="setBodyConfig"
          @confirm="confirmCustom"
          @setStep="setStep"
        />
      </transition>

      <!-- 增量服务 -->
      <transition name="slide-bottom-fade" mode="out-in">
        <!-- 单双面 -->
        <increment-slides
          v-if="slidesVisible"
          :data="incrementData.data"
          :value="incrementData.value"
          :customBodyPreviewURL="previewBody"
          @change="changeSlides"
          @close="closeIncrement"
          @next="nextIncrement"
        />

        <!-- 背景图 -->
        <increment-background-list
          v-else-if="backgroundVisible"
          :data="incrementData"
          :customBodyPreviewURL="previewBody"
          :sizeList="config.sizeList"
          v-bind="$attrs"
          @change="changeBackground"
          @close="closeIncrement"
          @next="nextIncrement"
        />

        <!-- 文字 -->
        <increment-text
          v-else-if="textVisible"
          :data="incrementData.data"
          :value="incrementData.value"
          @change="changeText"
          @close="closeIncrement"
          @next="nextIncrement"
        />

        <!-- 推荐 -->
        <increment-publish
          v-else-if="publishVisible"
          :data="incrementData.data"
          :value="incrementData.value"
          :productOptionsValue="productOptionsValue"
          :skuList="config.skuList"
          @change="changePublish"
          @close="closeIncrement"
          @next="nextIncrement"
        />

        <!-- 关联产品 -->
        <increment-related-product
          v-else-if="relatedProductVisible"
          :data="incrementData.data"
          :value="incrementData.value"
          @change="changeRelatedProduct"
          @close="closeIncrement"
          @next="nextIncrement"
        />

        <!-- vip -->
        <increment-vip
          v-else-if="vipVisible"
          :data="incrementData.data"
          :value="incrementData.value"
          @change="changeVip"
          @close="closeIncrement"
          @next="nextIncrement"
        />
      </transition>

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

import StepFileSelect from "./step-file-select/StepFileSelect.vue";
import StepImageStation from "./step-image-station/StepImageStation.vue";
import StepBodyCustom from "./step-body-custom/StepBodyCustom.vue";
import IncrementSlides from "./increment/increment-slides/IncrementSlides.vue";
import IncrementBackgroundList from "./increment/increment-background-list/IncrementBackgroundList.vue";
import IncrementRelatedProduct from "./increment/increment-related-product/IncrementRelatedProduct.vue";
import IncrementVip from "./increment/increment-vip/IncrementVip.vue";
import IncrementText from "./increment/increment-text/IncrementText.vue";
import IncrementPublish from "./increment/increment-publish/IncrementPublish.vue";
import FilesUploader from "./files-uploader/FilesUploader.vue";

import useBodyMain from "../composables/useBodyMain";
import useUpload from "../composables/useUpload";
import useIncrement from "../composables/useIncrement";

export default {
  name: "MinimePillow",

  components: {
    StepFileSelect,
    StepImageStation,
    StepBodyCustom,
    IncrementSlides,
    IncrementBackgroundList,
    IncrementRelatedProduct,
    IncrementVip,
    IncrementText,
    IncrementPublish,
    FilesUploader,
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
      currentStep,
      avatar,
      rawFileURL,
      previewBody,
      changeFile,
      useCacheFile,
      useAIAvatar,
      setBodyConfig,
      setStep,
      setPreview,
      getBodyConfig,
    } = useBodyMain();

    // 增量
    const {
      productOptionsValue,
      previewWidthBackground,
      queue,
      hasIncrement,
      incrementData,
      slidesVisible,
      publishVisible,
      backgroundVisible,
      textVisible,
      relatedProductVisible,
      vipVisible,
      isLastIncrement,
      changeSlides,
      changeVip,
      changeRelatedProduct,
      setIncrementIndex,
      closeIncrement,
      changeBackground,
      changeText,
      changePublish,
      next,
    } = useIncrement(props);

    // 上传
    const { uploadFiles, uploadVisible, startUpload } = useUpload();

    // 下一步
    function nextIncrement() {
      if (isLastIncrement.value) {
        upload();
      } else {
        next();
      }
    }

    // 保存定制主人物图
    async function confirmCustom(url) {
      setPreview(url);
      await nextTick();
      if (hasIncrement.value) {
        setIncrementIndex(0);
      } else {
        upload();
      }
    }

    // 文件上传
    function upload() {
      const files = [
        {
          name: "raw",
          url: rawFileURL.value,
        },
        {
          name: "ai",
          url: avatar.value.url,
        },
        {
          name: "preview",
          url: getPreviewURL(),
        },
      ];
      startUpload(files);
    }

    // 获取需要上传的预览图
    function getPreviewURL() {
      return previewWidthBackground.value || previewBody.value;
    }

    // 文件上传完成
    function completeUpload(res) {
      const data = {
        files: toRaw(res),
        body: getBodyConfig(),
        increment: toRaw(queue.value),
        productOptionsValue: toRaw(productOptionsValue.value)
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
      // == main body ==
      currentStep,
      avatar,
      rawFileURL,
      previewBody,
      changeFile,
      useCacheFile,
      useAIAvatar,
      setBodyConfig,
      setStep,
      // == increment ==
      productOptionsValue,
      incrementData,
      slidesVisible,
      publishVisible,
      backgroundVisible,
      textVisible,
      relatedProductVisible,
      vipVisible,
      closeIncrement,
      changeSlides,
      changeVip,
      changeRelatedProduct,
      changeBackground,
      changeText,
      changePublish,
      // == upload ==
      uploadFiles,
      uploadVisible,
      // == 外部 ==
      confirmCustom,
      closePlugin,
      completeUpload,
      changeVip,
      nextIncrement
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

  .plugin-dialog__content {
    width: 400px;
    height: 700px;
    border-radius: 10px;
    overflow: hidden;
    background-color: #ffffff;
    position: relative;
  }

  font-family: "Roboto", Arial, Helvetica, sans-serif;
}

// 下方
.slide-bottom-fade-enter-from,
.slide-bottom-fade-leave-to {
  transform: translate3d(0, -30px, 0);
  opacity: 0;
}
.slide-bottom-fade-leave-from,
.slide-bottom-fade-enter-to {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.slide-bottom-fade-enter-active {
  transition: all 0.3s ease-in-out;
}
.slide-bottom-fade-leave-active {
  transition: all 0.1s ease;
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

@media screen and (max-width: 750px) {
  .plugin-dialog {
    .plugin-dialog__content {
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
  }
}
</style>