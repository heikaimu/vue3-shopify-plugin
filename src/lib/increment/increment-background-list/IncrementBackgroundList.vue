<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-03 10:51:22
-->
<template>
  <div class="increment-wrapper">
    <div class="increment-blank" @click="handleClose"></div>
    <div class="increment-background">
      <span class="close-icon">
        <base-icon icon="close" @click="handleClose" />
      </span>
      <div class="preview-image">
        <!-- <transition name="fade" mode="out-in"> -->
          <div v-if="!loading" class="img" :style="{ backgroundImage: `url(${preview})` }"></div>
          <base-loading-dot v-else />
        <!-- </transition> -->
      </div>

      <base-notice class="bg-notice">Just for preview, the background will be cropped according to the size you pick</base-notice>

      <!-- <swiper-composing
        :data="data.composing"
        v-bind="$attrs"
        @change="changeComposingIndex"
      ></swiper-composing> -->

      <swiper-background
        :data="data.backgroundList"
        v-bind="$attrs"
        @change="changeBackgroundIndex"
      ></swiper-background>

      <div class="add-to-cart">
        <base-button type="primary" size="large" @click="handleNext"
          >Add To Cart</base-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, watch, toRefs, onMounted } from "vue";

import BaseButton from "../../../components/BaseButton.vue";
import BaseIcon from "../../../components/BaseIcon.vue";
import BaseNotice from "../../../components/BaseNotice.vue";
import BaseLoadingDot from "../../../components/BaseLoadingDot.vue";
import SwiperBackground from "./SwiperBackground.vue";
import SwiperComposing from "./SwiperComposing.vue";

import { CombineImage } from "../../../utils/combineImage";
// import { combineImages } from "../../../utils/image";

export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseNotice,
    BaseLoadingDot,
    SwiperBackground,
    SwiperComposing,
  },

  props: {
    data: {
      type: Object,
      default: () => {},
    },
    customBodyPreviewURL: {
      type: String,
      default: "",
    },
  },

  emits: {
    change: null,
    close: null,
    next: null,
  },

  setup(props, context) {
    const state = reactive({
      combineImage: null,
      preview: "",
      loading: true,
      backgroundIndex: -1,
      composingIndex: -1,
    });

    onMounted(() => {
      renderPreview();
    });

    watch(
      () => state.preview,
      (val) => {
        context.emit("change", {
          preview: val,
          backgroundIndex: state.backgroundIndex,
          composingIndex: state.composingIndex
        });
      }
    );

    // 设置当前背景index
    function changeBackgroundIndex(index) {
      state.backgroundIndex = index;
      renderPreview();
    }

    // 设置当前排版index
    function changeComposingIndex(index) {
      state.composingIndex = index;
      renderPreview();
    }

    // 渲染效果图
    async function renderPreview() {
      if (!state.combineImage) {
        state.combineImage = new CombineImage({
          width: 500,
          height: 750,
        });
      }

      state.loading = true;
      const params = getRenderParams();
      state.preview = await state.combineImage.getURL(params);
      state.loading = false;
    }

    // 获取渲染参数
    function getRenderParams() {
      const { backgroundList, composing } = props.data;
      const backgroundImage = (
        (backgroundList || [])[state.backgroundIndex] || {}
      ).url;
      // const layerList = ((composing || [])[state.composingIndex] || {}).position;

      const layerList = [
        {
          angle: 0,
          left: 1,
          scale: 1.2619207974137931,
          top: 20,
        },
      ];

      return {
        backgroundImage,
        layerList,
        layerImage: props.customBodyPreviewURL,
      };
    }

    // 关闭
    function handleClose() {
      context.emit("close");
    }

    // 前往下一步
    function handleNext() {
      context.emit("next");
    }

    return {
      ...toRefs(state),
      handleClose,
      handleNext,
      changeBackgroundIndex,
      changeComposingIndex,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.increment-wrapper {
  @include pos-absolute(0, 0, 0, 0, 1000);
  .increment-blank {
    @include glass;
    @include pos-absolute(0, 0, 0, 0, 1001);
    cursor: pointer;
  }

  .increment-background {
    @include pos-absolute(auto, 0, 0, 0, 1002);
    border-radius: 10px 10px 0 0;
    background-color: #ffffff;

    .close-icon {
      @include pos-absolute(20px, auto, auto, 20px, 1003);
      cursor: pointer;
    }

    .preview-image {
      @include flex-row-center;
      width: 100%;
      height: 300px;
      padding-top: 20px;
      .img {
        @include card-shadow-lg;
        width: 150px;
        height: 225px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
        transition: 0.3s;
      }
    }

    .bg-notice {
      padding-bottom: 10px;
    }

    .custom-title {
      padding-bottom: 20px;
      text-align: center;
      font-size: 18px;
      color: $theme-color;
      margin-bottom: 0;
    }

    .add-to-cart {
      padding: 0 20px 20px 20px;
    }
  }
}
</style>