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
          v-if="incrementState.activeObj.name === 'slides'"
          :data="incrementState.activeObj.data"
          :customBodyPreviewURL="customBodyPreviewURL"
          :value="incrementState.slides"
          @change="changeSlides"
          @close="closeIncrement"
          @next="toNextIncrement"
        />

        <!-- 背景图 -->
        <increment-background-list
          v-else-if="incrementState.activeObj.name === 'backgroundList'"
          :data="incrementState.activeObj.data"
          :customBodyPreviewURL="customBodyPreviewURL"
          v-bind="$attrs"
          @change="changePreview"
          @close="closeIncrement"
          @next="toNextIncrement"
        />

        <!-- 关联产品 -->
        <increment-related-product
          v-else-if="incrementState.activeObj.name === 'relatedProduct'"
          :data="incrementState.activeObj.data"
          @change="changeRelatedProduct"
          @close="closeIncrement"
          @next="toNextIncrement"
        />

        <!-- vip -->
        <increment-vip
          v-else-if="incrementState.activeObj.name === 'vip'"
          :data="incrementState.activeObj.data"
          :value="incrementState.vip"
          @change="changeVip"
          @close="closeIncrement"
          @next="toNextIncrement"
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
import { reactive, toRefs, toRaw, onMounted, computed, watch } from "vue";

import StepFileSelect from "./step-file-select/StepFileSelect.vue";
import StepImageStation from "./step-image-station/StepImageStation.vue";
import StepBodyCustom from "./step-body-custom/StepBodyCustom.vue";
import IncrementSlides from "./increment/increment-slides/IncrementSlides.vue";
import IncrementBackgroundList from "./increment/increment-background-list/IncrementBackgroundList.vue";
import IncrementRelatedProduct from "./increment/increment-related-product/IncrementRelatedProduct.vue";
import IncrementVip from "./increment/increment-vip/IncrementVip.vue";
import FilesUploader from "./files-uploader/FilesUploader.vue";

import { imageReset } from "../utils/image";

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
      customBodyPreviewURL: "",
      // 文件上传列表
      uploadFiles: [],
      uploadVisible: false,
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

    // 设置步骤
    function setStep(step) {
      state.currentStep = step;
    }

    // 设置当前选中的身体配置
    function setBodyConfig(config) {
      state.bodyConfig = config;
    }

    // 保存定制主人物图
    function confirmCustom(url) {
      state.customBodyPreviewURL = url;
      // 两种情况，如果没有任何增量直接上传文件
      if (incrementState.queue.length === 0) {
        uploadFiles();
      } else {
        incrementState.index = 0;
      }
    }

    // 关闭插件
    function closePlugin() {
      context.emit("close");
    }

    /**
     * 增量服务
     */

    const incrementState = reactive({
      queue: [],
      index: -1,
      activeObj: {},
      slides: null,
      preview: null,
      relatedProduct: null,
      vip: null,
      backgroundIndex: -1,
      composingIndex: -1,
    });

    // 进入时候，根据config的字段来设置扩展任务队列
    onMounted(() => {
      const { slides, backgroundList, composing, relatedProduct, vip } =
        props.config.increment;

      // 面选择
      if (slides) {
        incrementState.queue.push({
          name: "slides",
          data: slides,
        });
        incrementState.slides = "double";
      }
      // 背景图
      if (backgroundList) {
        // 背景图
        const data = {};
        data.backgroundList = backgroundList;
        // 排版方式
        if (composing) {
          data.composing = composing;
        }

        incrementState.queue.push({
          name: "backgroundList",
          data: data,
        });
      }
      // 关联产品
      if (relatedProduct) {
        incrementState.queue.push({
          name: "relatedProduct",
          data: relatedProduct,
        });
      }
      // 关联产品
      if (vip) {
        incrementState.queue.push({
          name: "vip",
          data: vip,
        });
      }
    });

    // 当前增量索引发生变化的时候
    watch(
      () => incrementState.index,
      (val) => {
        if (incrementState.queue.length === 0) {
          incrementState.activeObj = {};
        } else if (val === -1) {
          incrementState.activeObj = {};
        } else {
          incrementState.activeObj = incrementState.queue[val];
        }
      }
    );

    // 前往下一个增量服务, 如果已经是最后一个则开始文件上传
    function toNextIncrement() {
      if (incrementState.index < incrementState.queue.length - 1) {
        incrementState.index += 1;
      } else {
        uploadFiles();
      }
    }

    // 单双面选择服务
    function changeSlides(val) {
      incrementState.slides = val;
    }

    // 背景图
    function changePreview({ preview, backgroundIndex, composingIndex }) {
      incrementState.preview = preview;
      incrementState.backgroundIndex = backgroundIndex;
      incrementState.composingIndex = composingIndex;
    }

    // 关联产品增量服务
    function changeRelatedProduct(val) {
      incrementState.relatedProduct = val;
    }

    // VIP增量服务
    function changeVip(val) {
      incrementState.vip = val;
    }

    // 关闭增量服务
    function closeIncrement() {
      incrementState.index = -1;
    }

    // 文件上传
    function uploadFiles() {
      state.uploadFiles = [
        {
          name: "raw",
          url: state.rawFileURL,
        },
        {
          name: "ai",
          url: state.avatar.url,
        },
        {
          name: "preview",
          url: getPreviewURL(),
        },
      ];
      state.uploadVisible = true;
    }

    // 获取需要上传的预览图
    function getPreviewURL() {
      return incrementState.preview || state.customBodyPreviewURL;
    }

    // 文件上传完成
    function completeUpload(res) {
      const { slides, relatedProduct, vip, backgroundIndex, composingIndex } = incrementState;
      const { bodyConfig } = state;
      const data = {
        files: toRaw(res),
        body: {
          id: bodyConfig.id,
          name: bodyConfig.name,
          groupName: bodyConfig.groupName,
          url: bodyConfig.images[0].url,
        },
        increment: {
          slides: toRaw(slides),
          backgroundIndex: toRaw(backgroundIndex),
          composingIndex: toRaw(composingIndex),
          relatedProduct: toRaw(relatedProduct),
          vip: toRaw(vip),
        },
      };

      context.emit("complete", data);
      // 关闭插件
      closePlugin();
    }

    return {
      ...toRefs(state),
      changeFile,
      useCacheFile,
      useAIAvatar,
      setStep,
      closePlugin,
      setBodyConfig,
      confirmCustom,
      incrementState,
      toNextIncrement,
      closeIncrement,
      changeSlides,
      changePreview,
      changeRelatedProduct,
      changeVip,
      completeUpload,
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