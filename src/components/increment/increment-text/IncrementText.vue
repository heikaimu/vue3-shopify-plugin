<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-11-04 15:46:16
-->
<template>
  <div class="increment-wrapper">
    <div class="increment-blank" @click="handleClose"></div>
    <div class="increment-text">
      <span class="close-icon">
        <base-icon icon="close" @click="handleClose" />
      </span>

      <div class="text-wrapper">
        <div class="text__preview">
          <div class="text-canvas-box">
            <canvas id="textCanvas" v-if="shouldRender"></canvas>
            <img v-else :src="data.url" alt="" srcset="" />
          </div>
        </div>

        <div class="custom-font-board">
          <p class="desc">{{ data.desc }}</p>
          <!-- 开关 -->
          <text-switch
            v-model:activeValue="activeValue"
            :price="data.price"
          ></text-switch>

          <template v-if="activeValue === 'yes'">
            <!-- 输入 -->
            <text-input
              v-model:text="customText.text"
              :size="data.size"
            ></text-input>

            <base-tabs v-if="shouldRender" v-model:activeName="activeName">
              <!-- 字体选择 -->
              <base-tab-pane label="Font Family" name="family">
                <font-selector
                  v-model:fontFamily="customText.fontFamily"
                ></font-selector>
              </base-tab-pane>

              <!-- 色彩选择 -->
              <base-tab-pane label="Font Color" name="color">
                <color-selector
                  v-model:color="customText.color"
                ></color-selector>
              </base-tab-pane>
            </base-tabs>
          </template>
        </div>
      </div>

      <div class="add-to-cart">
        <base-button
          type="primary"
          size="large"
          @click="handleNext(true)"
          id="button_add_to_cart_6"
          >{{ addToCartText }}</base-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, toRaw, onMounted, watch } from "vue";

import BaseNotice from "../../../base/BaseNotice.vue";
import BaseButton from "../../../base/BaseButton.vue";
import BaseIcon from "../../../base/BaseIcon.vue";
import BaseTabs from "../../../base/BaseTabs.vue";
import BaseTabPane from "../../../base/BaseTabPane.vue";
import TextSwitch from "./TextSwitch.vue";
import TextInput from "./TextInput.vue";
import FontSelector from "./FontSelector.vue";
import ColorSelector from "./ColorSelector.vue";

import CanvasRenderer from "../../../utils/canvasRenderer";
import { debounce } from "lodash";

export default {
  components: {
    BaseNotice,
    BaseButton,
    BaseIcon,
    BaseTabs,
    BaseTabPane,
    TextSwitch,
    TextInput,
    FontSelector,
    ColorSelector,
  },

  props: {
    data: {
      type: Object,
      default: () => {},
    },
    value: {
      type: [Object, String],
    },
    previewWidthBackground: {
      type: String,
      default: "",
    },
    textRenderParams: {
      type: Object,
    },
  },

  emits: {
    change: null,
    close: null,
    next: null,
    render: null,
  },

  setup(props, context) {
    // 图片渲染器
    const state = reactive({
      activeValue: "no",
      activeName: "",
      customText: {
        text: "",
        fontFamily: "Black Ops One",
        color: "#111111",
      },
    });

    const addToCartText = computed(() => {
      if (state.activeValue === "yes" && state.customText.text !== "") {
        return `Add To Cart +${props.data.price}`;
      } else {
        return `Add To Cart`;
      }
    });

    // 是否需要渲染canvas，只有当选择了背景才渲染
    const shouldRender = computed(() => {
      return Boolean(props.textRenderParams);
    });

    onMounted(() => {
      shouldRender.value && renderer();
    });

    watch(state.customText, () => {
      shouldRender.value && rendererText();
      context.emit("change", state.customText);
    });

    watch(
      () => state.activeValue,
      (val) => {
        if (val === "no") {
          state.customText.text = "";
        }
      }
    );

    // canvas
    let fabricInstance = null;
    function setCanvasInstance() {
      if (!fabricInstance) {
        const { size } = props.textRenderParams;
        const currentWidth = 200;
        const currentHeight = (currentWidth * size.height) / size.width;
        fabricInstance = new CanvasRenderer("textCanvas", {
          width: currentWidth,
          height: currentHeight,
          scale: currentWidth / size.width,
        });
      }
    }

    // 渲染器
    const renderer = debounce(function () {
      setCanvasInstance();

      const { size, layerList } = props.textRenderParams;
      const backgroundImage = props.previewWidthBackground;
      const textLayerList = layerList.map((item) => {
        return {
          ...item,
          text: state.customText.text,
          fontFamily: state.customText.fontFamily,
          color: state.customText.color,
          selectable: false,
          stroke: "#ffffff",
          strokeWidth: 1,
        };
      });
      const layers = [
        {
          url: backgroundImage,
          left: 0,
          top: 0,
          ...size,
          selectable: false,
          type: "background",
        },
        ...textLayerList,
      ];
      fabricInstance.render({
        layers,
      });
    }, 300);

    // 更新文字
    const rendererText = debounce(function () {
      const items = fabricInstance.getObjects();
      const textItems = items.filter((item) => item.type === "text");
      const {text, fontFamily, color} = state.customText;
      
      for (const item of textItems) {
        const inputMaxSize = props.data.size ? Number(props.data.size) : 15;
        
        const length = Math.max(Math.floor(inputMaxSize / 2), text.length);
        
        const fontSize = (2.5 * item.originalWidth) / length * fabricInstance.scale;
        
        fabricInstance.update({
          layer: item,
          options: {
            fontSize,
            text: text,
            fontFamily: fontFamily,
            fill: color,
          },
        });
      }
    });

    // 关闭
    function handleClose() {
      context.emit("close");
    }

    // 前往下一步
    function handleNext() {
      if (shouldRender.value) {
        const url = fabricInstance.toDataURL(600);
        context.emit("render", url);
      }
      context.emit("next");
    }

    return {
      ...toRefs(state),
      addToCartText,
      shouldRender,
      handleClose,
      handleNext,
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

  .increment-text {
    @include pos-absolute(auto, 0, 0, 0, 1002);
    border-radius: 10px 10px 0 0;
    background-color: #ffffff;

    .close-icon {
      @include pos-absolute(20px, auto, auto, 20px, 1004);
      cursor: pointer;
    }

    .text-wrapper {
      padding: 0 20px 20px 20px;
      .text__preview {
        @include flex-col-center;
        // @include pos-absolute(-120px, auto, auto, 50%, 1003);
        // transform: translate3d(-50%, 0, 0);
        width: 100%;
        padding-bottom: 15px;
        .text-canvas-box {
          @include card-shadow-lg;
          margin-top: -50px;
          padding: 5px;
          background-color: #ffffff;
          // overflow: hidden;
          img {
            display: block;
            width: 200px;
            line-height: 1;
          }
        }
      }

      .custom-font-board {
        // max-height: 160px;
        // overflow-x: hidden;
        // overflow-y: auto;
        /*解决ios上滑动不流畅*/
        -webkit-overflow-scrolling: touch;
        &::-webkit-scrollbar {
          // 滚动条
          // display: none;
          width: 4px;
        }

        .desc {
          font-size: 16px;
          color: $title-color;
          font-weight: 600;
          margin-bottom: 10px;
        }
      }
    }

    .add-to-cart {
      padding: 0 20px 20px 20px;
    }
  }
}
</style>