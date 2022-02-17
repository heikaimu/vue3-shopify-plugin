<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-21 14:04:50
-->
<template>
  <base-glass-dialog
    :visible="true"
    :loading="loadingVisible"
    @close="handleClose"
  >
    <!-- 文字定制内容 -->
    <div class="increment-text" ref="canvasContainer">
      <div class="design-notice">
        <base-notice v-if="data.notice">{{ data.notice }}</base-notice>
      </div>

      <!-- 文字定制 -->
      <div class="text-wrapper">
        <div class="text__preview">
          <div class="text-canvas-box">
            <canvas id="textCanvas" v-if="shouldRenderCanvas"></canvas>
            <img v-else :src="data.url" alt="" srcset="" />
          </div>
          <!-- <operations-bar @handle="handleObject"></operations-bar> -->
        </div>

        <!-- 定制信息 -->
        <div class="custom-font-board" v-if="customTextVisible">
          <!-- 输入 -->
          <div class="board-item">
            <text-input
              v-model:text="customText.text"
              :size="data.size"
              :dollarSign="dollarSign"
              :price="data.price"
              @focus="handleFocus"
              @blur="handleBlur"
            ></text-input>
          </div>

          <!-- 字体选择 -->
          <div class="board-item">
            <font-selector
              v-model:fontFamily="customText.fontFamily"
            ></font-selector>
          </div>

          <!-- 色彩选择 -->
          <div class="board-item">
            <color-selector v-model:color="customText.color"></color-selector>
          </div>
        </div>

        <div class="add-to-cart">
          <base-button
            type="primary"
            size="large"
            @click="handleSave"
            id="button_add_to_cart_6"
            >{{ addToCartText }}</base-button
          >
        </div>
      </div>
    </div>
  </base-glass-dialog>
</template>

<script>
import { reactive, ref, toRefs, computed, inject, onMounted, watch } from "vue";

import BaseNotice from "../../../base/BaseNotice.vue";
import BaseButton from "../../../base/BaseButton.vue";
import BaseIcon from "../../../base/BaseIcon.vue";
import BaseTabs from "../../../base/BaseTabs.vue";
import BaseTabPane from "../../../base/BaseTabPane.vue";
import BaseGlassDialog from "../../../base/BaseGlassDialog.vue";
import TextSwitch from "./TextSwitch.vue";
import TextInput from "./TextInput.vue";
import FontSelector from "./FontSelector.vue";
import ColorSelector from "./ColorSelector.vue";
import OperationsBar from "./OperationsBar.vue";

import ImageAndTextRenderer from "../../../utils/ImageAndTextRenderer";

const defaultRenderParams = {
  width: 416,
  height: 300,
  layerList: [
    {
      left: 197.41267485088065,
      top: 150.6750131535189,
      type: "text",
      fontSize: 39.686235901623874,
      scale: 1,
      angle: 0,
      width: 200.46599264482208,
      active: false,
      text: "",
      fontFamily: "Satisfy",
      color: "#ffffff",
    },
  ],
  backgroundImage: {
    url: "https://cdn.shopify.com/s/files/1/0343/0275/4948/files/1641547471301.jpg?v=1641547536",
  },
  customTextVisible: true,
};

export default {
  components: {
    BaseNotice,
    BaseButton,
    BaseIcon,
    BaseTabs,
    BaseTabPane,
    BaseGlassDialog,
    TextSwitch,
    TextInput,
    FontSelector,
    ColorSelector,
    OperationsBar,
  },

  props: {
    data: {
      type: Object,
      default: () => {},
    },
    value: {
      type: [Object, String],
    },
    // 背景渲染信息
    bgRenderParams: {
      type: Object,
    },
    dollarSign: {
      type: String,
    },
  },

  emits: {
    change: null,
    close: null,
    next: null,
    render: null,
    back: null,
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");

    // 如果有文字定制，但是又没有渲染信息，则使用默认的渲染信息
    const bgRenderParams = computed(() => {
      if (!props.data.live) {
        return defaultRenderParams;
      }
      return props.bgRenderParams || defaultRenderParams;
    });

    // 是否显示定制文字
    const customTextVisible = computed(() => {
      if (bgRenderParams.value) {
        return bgRenderParams.value.customTextVisible;
      } else {
        return true;
      }
    });

    // 是否需要渲染canvas，只有当选择了背景才渲染
    const shouldRenderCanvas = computed(() => {
      return Boolean(bgRenderParams.value);
    });

    // 是否刷新预览图
    const shouldReplacePreview = computed(() => {
      if (props.bgRenderParams && props.data.live) {
        return true;
      }

      return false;
    });

    // 文字信息
    const { text, fontFamily, color } = props.value;
    const state = reactive({
      activeName: "",
      customText: {
        text: text,
        fontFamily: fontFamily || "Satisfy",
        color: color || props.data.color || "#ffffff",
      },
      canvasWidth: 230,
    });

    onMounted(() => {
      // 如果不定制文字，则清空文字
      if (!customTextVisible.value) {
        clearText();
        updateTextInfo;
      }

      // 只有当展示canvas的时候才渲染
      if (shouldRenderCanvas.value) {
        state.canvasWidth = setCanvasWidth();
        initTextRender();
      }
    });

    const canvasContainer = ref(null);
    function setCanvasWidth() {
      const hwRate = bgRenderParams.value.height / bgRenderParams.value.width;
      const containerWidth = canvasContainer.value.getBoundingClientRect();
      return (containerWidth.width * 0.7) / hwRate;
    }

    // 渲染器实列
    let renderInstance = null;
    let zoomRecord = 1;

    // 初始化canvas
    async function initTextRender() {
      // 文字回填
      state.customText.text = props.value.text || "";

      // 创建实列
      if (!renderInstance) {
        renderInstance = new ImageAndTextRenderer("textCanvas");
      }

      // 回填图层
      await recreateLayers();
      zoomRecord = state.canvasWidth / bgRenderParams.value.width;
      renderInstance.init(bgRenderParams.value, zoomRecord).then(() => {
        const items = renderInstance.getObjects();
        const image = items.find((item) => item.type === "image");
        renderInstance.setActiveObject(image);
      });
      renderInstance.on("tlClick", () => {
        context.emit("close");
      });
    }

    // 清空文字
    function clearText() {
      state.customText.text = "";
      state.customText.fontFamily = "";
      state.customText.color = "";
    }

    // 图层移动
    function handleObject(command) {
      const items = renderInstance.getObjects();
      const image = items.find((item) => item.type === "image");
      renderInstance.handleObject(image, command);
    }

    // 图层重构，给文字渲染层加上文字内容，颜色，字体，图片去边
    async function recreateLayers() {
      for (let i = 0; i < bgRenderParams.value.layerList.length; i++) {
        const item = bgRenderParams.value.layerList[i];
        if (item.type === "text") {
          item.text = state.customText.text;
          item.fontFamily = state.customText.fontFamily;
          item.color = state.customText.color;
        }
      }
    }

    // 文字聚焦后放大画布
    function handleFocus() {
      if (!shouldRenderCanvas.value) {
        return;
      }

      const items = renderInstance.getObjects();
      const textItems = items.filter((item) => item.type === "text");
      const firstText = textItems[0];
      const x = firstText.left;
      const y = firstText.top;
      // const textLength = Math.max(Math.floor(inputMaxSize / 2), text.length);
      const textWidth = firstText.originalWidth * 1.5;
      const zoom = state.canvasWidth / textWidth;
      renderInstance.zoomToPoint(x, y, zoom);
    }

    // 文字失去焦点还原画布
    function handleBlur() {
      if (!shouldRenderCanvas.value) {
        return;
      }

      renderInstance.resetZoom();
    }

    // 文字及文字属性更新后
    watch(state.customText, () => {
      if (shouldRenderCanvas.value) {
        renderText();
      }

      updateTextInfo();
    });

    // 更新文字
    function updateTextInfo() {
      context.emit("change", state.customText);
    }

    // 重新渲染文字
    function renderText() {
      const items = renderInstance.getObjects();
      const textItems = items.filter((item) => item.type === "text");
      const { text, fontFamily, color } = state.customText;

      for (const item of textItems) {
        const inputMaxSize = props.data.size ? Number(props.data.size) : 15;
        const length = Math.max(Math.floor(inputMaxSize / 2), text.length);
        const fontSize = (2.5 * item.originalWidth) / length;

        renderInstance.update({
          layer: item,
          options: {
            fontSize,
            text: text,
            fontFamily: fontFamily,
            fill: color,
          },
        });
      }
    }

    // loading
    const loadingVisible = ref(false);

    // 保存定制
    async function handleSave() {
      if (shouldReplacePreview.value) {
        loadingVisible.value = true;
        const url = await getOriginalSizePreview();
        loadingVisible.value = false;

        context.emit("render", url);
      }
      handleNext();
    }

    // 获取原始尺寸的预览图
    function getOriginalSizePreview() {
      return new Promise((resolve, reject) => {
        renderInstance.savePreview(1).then((url) => {
          resolve(url);
        });
      });
    }

    // 按钮文字
    const addToCartText = computed(() => {
      if (customTextVisible.value && state.customText.text !== "") {
        return `${pluginText.add_text} + ${props.dollarSign}${props.data.price}`;
      } else {
        return `${pluginText.without_text}`;
      }
    });

    // 下一步
    function handleNext() {
      context.emit("next");
    }

    // 关闭
    function handleClose() {
      context.emit("back");
    }

    return {
      ...toRefs(state),
      canvasContainer,
      pluginText,
      customTextVisible,
      addToCartText,
      shouldRenderCanvas,
      loadingVisible,
      handleClose,
      handleSave,
      handleFocus,
      handleBlur,
      handleNext,
      handleObject,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.increment-text {
  .design-notice {
    padding: 10px;
  }
  .text-wrapper {
    padding: 0 10px 10px 10px;
    .text__preview {
      @include flex-col-center;
      width: 100%;
      background-color: #ffffff;
      // background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Cg fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath opacity=".5" d="M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z"/%3E%3Cpath d="M6 5V0H5v5H0v1h5v94h1V6h94V5H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
      .text-canvas-box {
        line-height: 0;
        // overflow: hidden;
        img {
          display: block;
          width: 200px;
          line-height: 1;
        }
      }
    }

    .custom-font-board {
      /*解决ios上滑动不流畅*/
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        // 滚动条
        // display: none;
        width: 4px;
      }

      .board-item {
        margin-top: 10px;
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
    margin-top: 20px;
  }
}
</style>