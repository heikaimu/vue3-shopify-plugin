<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-23 11:10:08
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-23 11:20:14
-->
<template>
  <div>
    <div class="preview-image">
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
</template>

<script>
import { watch, toRaw, ref, inject, computed } from "vue";
import useCombineImage from "../../../composables/useCombineImage";
import { debounce } from "lodash";
export default {
  setup() {
    // 国际化
    const pluginText = inject("pluginText");

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

    return {
      loading,
      hasHandler,
      renderPreview,
      getPreviewURL,
      handleLayer,
      pluginText,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>