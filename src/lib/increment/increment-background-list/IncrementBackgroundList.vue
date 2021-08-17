<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-10 10:54:11
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
        <!-- <div
          v-if="!loading"
          class="img"
          :style="{ backgroundImage: `url(${preview})` }"
        ></div> -->
        <img v-if="!loading" class="img" :src="preview" alt="" srcset="" />
        <base-loading-dot v-else />
        <!-- </transition> -->
      </div>

      <base-notice class="bg-notice"
        >Just for preview, the background will be cropped according to the size
        you pick</base-notice
      >

      <!-- 尺寸 -->
      <swiper-size
        v-if="sizeList.length > 1"
        :data="sizeList"
        :activeIndex="sizeIndex"
        @change="changeSizeIndex"
      ></swiper-size>

      <!-- 排版 -->
      <swiper-composing
        v-if="composingList.length > 1"
        :data="composingList"
        :activeIndex="composingIndex"
        @change="changeComposingIndex"
      ></swiper-composing>

      <!-- 背景 -->
      <swiper-background
        :data="backgroundList"
        :size="currentSize"
        :activeIndex="backgroundIndex"
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
import { watch, toRaw } from "vue";

import BaseButton from "../../../components/BaseButton.vue";
import BaseIcon from "../../../components/BaseIcon.vue";
import BaseNotice from "../../../components/BaseNotice.vue";
import BaseLoadingDot from "../../../components/BaseLoadingDot.vue";
import SwiperSize from "./SwiperSize.vue";
import SwiperBackground from "./SwiperBackground.vue";
import SwiperComposing from "./SwiperComposing.vue";

import useCombineImage from "../../../composables/useCombineImage";
import useBackground from "../../../composables/useBackground";
import useComposing from "../../../composables/useComposing";
import useSize from "../../../composables/useSize";

import { debounce } from "lodash";

export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseNotice,
    BaseLoadingDot,
    SwiperSize,
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
    backgroundActiveName: {
      type: String,
      default: "",
    },
    composingActiveName: {
      type: String,
      default: "",
    },
    sizeActiveName: {
      type: String,
      default: "",
    },
    sizeList: {
      type: Array,
      default: 0,
    },
  },

  emits: {
    change: null,
    close: null,
    next: null,
  },

  setup(props, context) {
    // 背景
    const {
      backgroundList,
      backgroundIndex,
      backgroundName,
      changeBackgroundIndex,
      getBackgroundImage,
    } = useBackground(props);

    // 排版
    const {
      composingList,
      composingIndex,
      composingName,
      changeComposingIndex,
      getComposing,
    } = useComposing(props);

    // 尺寸
    const { sizeList, sizeIndex, sizeName, currentSize, changeSizeIndex } =
      useSize(props);

    // 图片渲染器
    const { preview, loading, renderPreview } = useCombineImage(props);

    // 索引改变
    watch([backgroundIndex, composingIndex, sizeIndex], () => {
      renderNow();
    });

    // 立刻渲染
    const renderNow = debounce(() => {
      const params = getRenderParams();
      if (!params.backgroundImage) {
        return;
      }
      console.log("渲染一次");
      renderPreview(params);
    }, 100);

    // 获取渲染参数
    function getRenderParams() {
      const size = props.sizeList.find(
        (item) => item.label === currentSize.value
      ).value;
      const backgroundImage = getBackgroundImage(currentSize.value);
      const layerList = getComposing(currentSize.value);

      return {
        size: toRaw(size),
        backgroundImage,
        layerList,
        layerImage: props.customBodyPreviewURL,
      };
    }

    // 预览图改变
    watch(preview, (val) => {
      context.emit("change", {
        preview: val,
        params: {
          size: {
            index: sizeIndex.value,
            title: sizeName.value,
          },
          background: {
            index: backgroundIndex.value,
            title: backgroundName.value,
          },
          composing: {
            index: composingIndex.value,
            title: composingName.value,
          },
        },
      });
    });

    // 关闭
    function handleClose() {
      context.emit("close");
    }

    // 前往下一步
    function handleNext() {
      context.emit("next");
    }

    return {
      handleClose,
      handleNext,
      backgroundList,
      backgroundIndex,
      changeBackgroundIndex,
      sizeList,
      sizeIndex,
      currentSize,
      changeSizeIndex,
      composingList,
      composingIndex,
      changeComposingIndex,
      preview,
      loading,
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
        width: auto;
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