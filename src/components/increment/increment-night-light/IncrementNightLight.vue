<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-29 14:54:07
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-31 14:04:26
-->
<template>
  <base-glass-dialog :visible="true" @close="handleClose">
    <div class="night-light-wrapper">
      <p class="night-title">night light station</p>

      <div class="preview-canvas-box">
        <div class="preview-canvas">
          <img class="gif" :src="backgroundGif" alt="" srcset="">
          <div class="canvas">
            <canvas id="nightLightCanvas"></canvas>
          </div>
        </div>
      </div>

      <base-button-radio
        :options="list"
        v-model:value="curValue"
        textAlign="left"
        @change="handleChose"
      ></base-button-radio>

      <div class="bottom-button">
        <base-button type="primary" size="large" @click="handleNext()">{{
          pluginText.confirm
        }}</base-button>
      </div>
    </div>
  </base-glass-dialog>
</template>

<script>
import { reactive, toRefs, watch, inject, onMounted } from "vue";

import BaseNotice from "../../../base/BaseNotice.vue";
import BaseButton from "../../../base/BaseButton.vue";
import BaseGlassDialog from "../../../base/BaseGlassDialog.vue";
import BaseButtonRadio from "../../../base/BaseButtonRadio.vue";

import ImageAndTextRenderer from "../../../utils/ImageAndTextRenderer";
import { clearImageEdgeBlank } from "../../../utils/image";

const CANVAS_WIDTH = 230;

export default {
  components: {
    BaseNotice,
    BaseButton,
    BaseGlassDialog,
    BaseButtonRadio,
  },

  props: {
    data: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: "",
    },
    sizeList: {
      type: Array,
      default: () => [],
    },
    composingList: {
      type: Array,
      default: () => [],
    },
    backgroundList: {
      type: Array,
      default: () => [],
    },
    customBodyPreviewURL: {
      type: String,
      default: "",
    },
    dollarSign: {
      type: String,
    },
  },

  emits: {
    change: null,
    close: null,
    next: null,
    saveBgRenderParams: null,
  },

  setup(props, context) {
    // 国际化
    const pluginText = inject("pluginText");

    const state = reactive({
      list: [],
      curValue: "",
      backgroundGif: ''
    });

    watch(() => props.value, (val) => {
      state.curValue = val;
    }, {
      immediate: true
    })

    let renderInstance = null;

    onMounted(async () => {

      // 创建实列
      if (!renderInstance) {
        renderInstance = new ImageAndTextRenderer("nightLightCanvas", false);
      }

      // 获取列表
      state.list = await getList();

      // 渲染
      renderer();
    });

    // 手动选择
    function handleChose(val) {
      context.emit('change', val);
      renderer();
    }

    // 渲染
    function renderer() {
      // 获取渲染参数
      const params = getCurRenderParams();

      // 更新全局渲染参数
      context.emit("saveBgRenderParams", {
        ...params,
        customTextVisible: true,
      });

      // 渲染画布
      const zoomRecord = CANVAS_WIDTH / params.width;
      renderInstance.init(params, zoomRecord, false);
    }

    // 获取当前的渲染参数
    function getCurRenderParams() {
      const curItem = state.list.find((item) => item.value === state.curValue);
      state.backgroundGif = curItem.backgroundGif;
      return curItem ? curItem.renderParams : {};
    }

    // 获取底座列表
    async function getList() {
      const noEdgeBodyURL = await clearImageEdgeBlank(
        props.customBodyPreviewURL
      );

      return props.data.map((item) => {
        const renderParams = getParams(item, noEdgeBodyURL);
        return {
          renderParams,
          ...item,
          label: item.name,
          value: item.key,
          price: item.price ? `+${props.dollarSign}${item.price}` : "",
          url: renderParams.backgroundImage.url
        };
      });
    }

    function getParams(data, bodyURL) {
      // size
      const curSize = props.sizeList.find((item) => item.label === data.size);

      // background
      const background = props.backgroundList.find(
        (item) => item.id === data.backgroundID
      );
      const bgURLItem = background.list.find(
        (item) => item.size === curSize.label
      );
      const bgURL = bgURLItem ? bgURLItem.url : "";

      // composing
      const curComposingItem = props.composingList.find(
        (item) => item.title === data.composing
      );
      const renderMap = curComposingItem.list.find((item) => {
        return (
          item.size.width === curSize.value.width &&
          item.size.height === curSize.value.height
        );
      });

      // 构造参数
      const params = {
        width: curSize.value.width,
        height: curSize.value.height,
        backgroundImage: {
          url: bgURL,
        },
        layerList: [],
      };

      for (const item of renderMap.position) {
        if (item.type === "image") {
          params.layerList.push({
            ...item,
            url: bodyURL,
          });
        } else {
          params.layerList.push({
            ...item,
          });
        }
      }

      return params;
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
      pluginText,
      handleClose,
      handleNext,
      handleChose,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";
.night-light-wrapper {
  padding: 0 20px 20px 20px;
}

.night-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  text-align: center;
}

.preview-canvas-box {
  @include flex-row-center;
  padding-bottom: 20px;
  .preview-canvas {
    box-shadow: 0 3px 3px -2px rgb(0 0 0 / 20%), 0 3px 4px rgb(0 0 0 / 14%),
      0 1px 8px rgb(0 0 0 / 12%);
    padding: 5px;
    background-color: #ffffff;
    line-height: 0;
    position: relative;

    .gif {
      @include pos-absolute(0, 0, 0, 0, 1);
      display: block;
      width: 100%;
      height: 100%;
    }
    .canvas {
      position: relative;
      z-index: 2;
    }
  }
}
</style>