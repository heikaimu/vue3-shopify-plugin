<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-21 17:05:06
-->
<template>
  <div class="increment-wrapper">
    <div class="increment-blank" @click="handleClose"></div>
    <div class="increment-background">
      <span class="close-icon">
        <base-icon icon="close" @click="handleClose" />
      </span>

      <div class="preview-image">
        <!-- <base-loading-dot/> -->
        <canvas id="bgCombineCanvas"></canvas>
      </div>

      <div class="canvas-handler" v-if="hasHandler">
        <ul class="operations">
          <li class="item">
            <div class="card" @click="handleLayer('zoomUp')" id="icon_zoom_up">
              <base-icon icon="zoomUp" color="#ff533a" />
            </div>
          </li>
          <li class="item">
            <div
              class="card"
              @click="handleLayer('zoomDown')"
              id="icon_zoom_down"
            >
              <base-icon icon="zoomDown" color="#ff533a" />
            </div>
          </li>
          <li class="item">
            <div
              class="card"
              @click="handleLayer('rotateLeft')"
              id="icon_rotate_left"
            >
              <base-icon icon="rotateLeft" color="#ff533a" />
            </div>
          </li>
          <li class="item">
            <div
              class="card"
              @click="handleLayer('rotateRight')"
              id="icon_rotate_right"
            >
              <base-icon icon="rotateRight" color="#ff533a" />
            </div>
          </li>
        </ul>
      </div>

      <base-notice class="bg-notice">{{
        pluginText.bg_note_content
      }}</base-notice>

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

      <!-- 背景分组 -->
      <swiper-background-group
        v-if="backgroundGroupList.length > 1"
        :data="backgroundGroupList"
        :activeIndex="groupIndex"
        @change="changeGroup"
      ></swiper-background-group>

      <!-- 背景 -->
      <swiper-background
        :data="backgroundList"
        :size="currentSize"
        :activeIndex="backgroundIndex"
        @change="changeBackgroundIndex"
      ></swiper-background>

      <div class="add-to-cart">
        <base-button
          type="primary"
          size="large"
          @click="handleNext"
          id="button_add_to_cart_2"
          >{{ pluginText.add_cart }}</base-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { watch, toRaw, ref, inject, computed } from "vue";

import BaseButton from "../../../base/BaseButton.vue";
import BaseIcon from "../../../base/BaseIcon.vue";
import BaseNotice from "../../../base/BaseNotice.vue";
import BaseLoadingDot from "../../../base/BaseLoadingDot.vue";
import SwiperSize from "./SwiperSize.vue";
import SwiperBackgroundGroup from "./SwiperBackgroundGroup.vue";
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
    SwiperBackgroundGroup,
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
    // 国际化
    const pluginText = inject("pluginText");

    // 背景
    const {
      groupIndex,
      backgroundGroupList,
      backgroundList,
      backgroundIndex,
      backgroundName,
      changeBackgroundIndex,
      getBackgroundImage,
      changeGroup,
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
    const { loading, hasHandler, renderPreview, getPreviewURL, handleLayer } =
      useCombineImage(props);

    // 如果是尺寸和排版变更了，则全部重新渲染
    watch([composingIndex, sizeIndex], () => {
      renderNow(true);
    });

    // 如果只是背景切换了，则修改背景
    watch([backgroundIndex], () => {
      renderNow(false);
    });

    // 立刻渲染
    const renderNow = debounce((renderAll = true) => {
      const params = getRenderParams();

      if (!params) {
        return;
      }

      if (!params.backgroundImage) {
        return;
      }

      renderPreview(params, renderAll);
    }, 100);

    let textRenderParams = {};

    // 获取渲染参数
    function getRenderParams() {
      if (!currentSize.value) {
        return;
      }

      const size = props.sizeList.find(
        (item) => item.label === currentSize.value
      ).value;
      const backgroundImage = getBackgroundImage(currentSize.value);
      const layerList = getComposing(currentSize.value);
      textRenderParams = {
        size: toRaw(size),
        layerList: layerList.filter((item) => item.type === "text"),
      };
      return {
        size: toRaw(size),
        backgroundImage,
        layerList: layerList.filter((item) => item.type !== "text"),
        layerImage: props.customBodyPreviewURL,
      };
    }

    // 更新背景图
    function updatePreviewInfo() {
      return new Promise((resolve) => {
        getPreviewURL().then((url) => {
          context.emit("change", {
            preview: url,
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
            textRenderParams,
          });
          resolve();
        });
      });
    }

    // 关闭
    function handleClose() {
      context.emit("close");
    }

    // 前往下一步
    async function handleNext() {
      await updatePreviewInfo();
      context.emit("next");
    }

    return {
      pluginText,
      handleClose,
      handleNext,
      backgroundGroupList,
      groupIndex,
      backgroundList,
      backgroundIndex,
      changeGroup,
      changeBackgroundIndex,
      sizeList,
      sizeIndex,
      currentSize,
      changeSizeIndex,
      composingList,
      composingIndex,
      changeComposingIndex,
      loading,
      hasHandler,
      handleLayer,
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
      padding-top: 20px;
      padding-bottom: 10px;
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

    .canvas-handler {
      @include flex-row-center;
      padding-bottom: 10px;
      .operations {
        @include flex-row-center;
        .item {
          .card {
            display: flex;
            margin: 0 5px;
            padding: 8px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            cursor: pointer;
            position: relative;
          }
        }
      }
    }

    .bg-notice {
      padding-bottom: 10px;
    }

    .custom-title {
      padding-bottom: 20px;
      text-align: center;
      font-size: 16px;
      color: $theme-color;
      margin-bottom: 0;
    }

    .add-to-cart {
      padding: 0 20px 20px 20px;
    }
  }
}
</style>