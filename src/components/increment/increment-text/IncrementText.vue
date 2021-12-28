<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-28 17:13:28
-->
<template>
  <base-glass-dialog :visible="true" :loading="loadingVisible" @close="handleClose">
    <!-- 文字定制内容 -->
    <div class="increment-text">
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
import { clearImageEdgeBlank } from "../../../utils/image";

const CANVAS_WIDTH = 230;

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

    // 是否显示定制文字
    const customTextVisible = ref(props.bgRenderParams.customTextVisible);

    // 文字信息
    const { text, fontFamily, color } = props.value;
    const state = reactive({
      activeName: "",
      customText: {
        text: text,
        fontFamily: fontFamily || "Satisfy",
        color: color || "#111111",
      },
    });

    // 是否需要渲染canvas，只有当选择了背景才渲染，否则直接展示预设的图片
    const shouldRenderCanvas = computed(() => {
      return Boolean(props.bgRenderParams);
    });

    onMounted(() => {
      // 如果不定制文字，则清空文字
      if (!customTextVisible.value) {
        clearText();
        updateTextInfo;
      }

      // 只有当展示canvas的时候才渲染
      if (shouldRenderCanvas.value) {
        initTextRender();
      }
    });

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
      zoomRecord = CANVAS_WIDTH / props.bgRenderParams.width;
      renderInstance.init(props.bgRenderParams, zoomRecord);
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
      for (let i = 0; i < props.bgRenderParams.layerList.length; i++) {
        const item = props.bgRenderParams.layerList[i];
        if (item.type === "text") {
          item.text = state.customText.text;
          item.fontFamily = state.customText.fontFamily;
          item.color = state.customText.color;
        }
        if (item.type === "image") {
          item.url = await clearImageEdgeBlank(item.url);
        }
      }
    }

    // 文字聚焦后放大画布
    function handleFocus() {
      const items = renderInstance.getObjects();
      const textItems = items.filter((item) => item.type === "text");
      const firstText = textItems[0];
      const x = firstText.left;
      const y = firstText.top;
      // const textLength = Math.max(Math.floor(inputMaxSize / 2), text.length);
      const textWidth = firstText.originalWidth * 1.5;
      const zoom = CANVAS_WIDTH / textWidth;
      renderInstance.zoomToPoint(x, y, zoom);
    }

    // 文字失去焦点还原画布
    function handleBlur() {
      renderInstance.resetZoom();
    }

    // 文字及文字属性更新后
    watch(state.customText, () => {
      renderText();
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
      if (shouldRenderCanvas.value) {
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
        return `${pluginText.add_cart} +${props.dollarSign}${props.data.price}`;
      } else {
        return `${pluginText.add_cart}`;
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
  .text-wrapper {
    padding: 0 10px 10px 10px;
    .text__preview {
      @include flex-col-center;
      width: 100%;
      .text-canvas-box {
        @include card-shadow-lg;
        padding: 5px;
        background-color: #ffffff;
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