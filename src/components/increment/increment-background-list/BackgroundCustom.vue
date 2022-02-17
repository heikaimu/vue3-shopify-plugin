<!--
 * @Description: 文字定制咨询
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-27 10:13:14
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-18 16:16:08
-->
<template>
  <base-glass-dialog v-model:visible="isVisible" @opened="opened">
    <div class="background-custom">
      <div class="canvas-wrapper">
        <div class="canvas-box">
          <canvas id="backgroundCanvas"></canvas>
        </div>
      </div>

      <div class="add-to-cart">
        <base-button
          type="primary"
          size="large"
          @click="handleSave"
          id="button_add_to_cart_6"
          >{{ pluginText.confirm }}</base-button
        >
      </div>
    </div>
  </base-glass-dialog>
</template>

<script>
import { watch, inject } from "vue";

import BaseGlassDialog from "../../../base/BaseGlassDialog.vue";
import BaseButton from "../../../base/BaseButton.vue";

import useVisible from "../../../composables/useVisible";

import ImageAndTextRenderer from "../../../utils/ImageAndTextRenderer";

const CANVAS_WIDTH = 230;

export default {
  components: {
    BaseGlassDialog,
    BaseButton,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },

  emits: {
    save: null,
    close: null,
    "update:visible": null,
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");

    const { isVisible, closeDialog } = useVisible(props, context);

    // 渲染器实列
    let renderInstance = null;
    let zoomRecord = 1;

    function opened() {
      initBackgroundRender();
    }

    // 初始化canvas
    async function initBackgroundRender() {
      // 创建实列
      renderInstance = new ImageAndTextRenderer("backgroundCanvas");
      // 回填数据
      zoomRecord = CANVAS_WIDTH / props.data.width;
      renderInstance.init(props.data, zoomRecord).then(() => {
        const items = renderInstance.getObjects();
        const image = items.find((item) => item.type === "image");
        renderInstance.setActiveObject(image);
      });
      renderInstance.on("tlClick", () => {
        context.emit("close");
      });
    }

    function handleSave() {
      const url = renderInstance.toDataURL();
      context.emit('save', url);
      closeDialog();
    }

    return {
      pluginText,
      isVisible,
      opened,
      handleSave,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";
.background-custom {
  padding: 10px 0;
  .canvas-wrapper {
    @include flex-row-center;
    background-color: #ffffff;
    // background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Cg fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath opacity=".5" d="M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z"/%3E%3Cpath d="M6 5V0H5v5H0v1h5v94h1V6h94V5H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
    margin-bottom: 10px;
  }
  .add-to-cart {
    padding: 0 10px;
  }
}
</style>