<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 16:32:06
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-21 11:00:52
-->
<template>
  <div class="body-card" @click="handleClick">
    <!-- 带商品预览图 -->
    <!-- <div class="body-card__box" v-if="config.productPrivew">
      <img class="body-card__img" :src="config.productPrivew" alt="" />
    </div> -->

    <!-- 不带商品预览图 -->
    <!-- normal -->
    <div class="body-card__box" v-if="config.type === 'normal'">
      <img class="body-card__img" :src="bodyURL" alt="" @load="bgLoad" />
      <img
        v-for="(item, index) in layerList"
        :key="index"
        :src="item.url"
        :style="item.style"
        :class="[item.type]"
        class="body-card__avatar-img"
      />
    </div>
    <!-- hood -->
    <div class="body-card__box" v-else>
      <img class="body-card__img" :src="bodyURL" alt="" />
    </div>

    <!-- 标签 -->
    <p class="body-card__edit-tag" :class="{ disabled: loading }">
      {{ pluginText.tap_edit }}
    </p>

    <!-- loading -->
    <div class="body-card__loading" v-if="loading">
      <div class="loading-icon">
        <base-icon icon="loading" :size="30" color="#ffffff"></base-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, watch, inject, onMounted } from "vue";

import BaseIcon from "../../../../base/BaseIcon.vue";

import { renderer } from "../../../../utils/minimeRenderer";
import { loadImage } from "../../../../utils/image";
import { getLayers } from "../../../../utils/layers";

export default {
  components: {
    BaseIcon,
  },

  props: {
    selectFiles: {
      type: Array,
      deafult: () => [],
    },
    config: {
      type: Object,
      deafult: () => {},
    },
    skin: {
      type: String,
      deafult: "",
    },
  },

  emits: {
    click: null,
  },

  setup(props, context) {
    const { config, skin } = props;

    const state = reactive({
      bodyURL: "",
      layerList: [],
      loading: false,
    });

    // 国际化
    const pluginText = inject("pluginText");

    onMounted(() => {
      renderImage(props.skin);
    });

    watch(
      () => props.skin,
      (val) => {
        renderImage(val);
      }
    );

    watch(
      () => props.selectFiles,
      () => {
        renderImage(props.skin);
      },
      { deep: true }
    );

    // 渲染卡片
    function renderImage(skin) {
      if (config.type === "normal") {
        normalImage(skin);
      } else if (config.type === "hood") {
        hoodImage(skin);
      }
    }

    // 带svg图片
    function hoodImage(skin) {
      state.loading = true;
      const layers = getLayers({
        config,
        files: props.selectFiles,
        skin,
      });
      renderer.request(layers).then((url) => {
        state.bodyURL = url;
        state.loading = false;
      });
    }

    // 普通图片
    function normalImage(skin) {
      state.bodyURL = "";
      const currentSkinImage = config.images.find(
        (item) => item.color === skin
      );
      if (currentSkinImage) {
        state.loading = true;
        loadImage(currentSkinImage.url).then((image) => {
          state.loading = false;
          state.bodyURL = image.src;
        });
      }
    }

    // 背景图加载完成
    async function bgLoad(e) {
      const layers = getLayers({
        config,
        files: props.selectFiles,
        skin: props.skin,
      }).filter((item) => ["avatar", "annex"].includes(item.type));
      state.layerList = await getLayerList(layers, e.target.width);
    }

    function getLayerList(layers, targetWidth) {
      return new Promise(async (resolve) => {
        const scale = targetWidth / config.width;
        const list = [];
        for (let i = 0; i < layers.length; i++) {
          const item = layers[i];
          const { url, left, top, width, angle, offset, type } = item;
          const img = await loadImage(url);
          const currentWidth = width * scale;
          const currentHeight = (img.height / img.width) * currentWidth;
          const currentTop =
            type === "avatar" ? top * scale - currentHeight : top * scale;
          const currentLeft =
            type === "avatar" ? left * scale - currentWidth / 2 : left * scale;
          // const offsetY = offset ? offset[1] * scale : 0;

          let offsetY = 0;
          if (offset) {
            const chinTop = (offset[1] * currentWidth) / img.width;
            offsetY = currentHeight - chinTop;
          }

          list.push({
            url: url,
            type,
            style: {
              width: `${currentWidth}px`,
              height: `${currentHeight}px`,
              top: `${currentTop + offsetY}px`,
              left: `${currentLeft}px`,
              transform: `rotate(${angle}deg)`,
              zIndex: type === "annex" ? 2 : 1,
            },
          });
        }
        resolve(list);
      });
    }

    // 点击
    function handleClick() {
      if (!state.loading) {
        context.emit("click");
      }
    }

    return {
      ...toRefs(state),
      pluginText,
      bgLoad,
      handleClick,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.body-card {
  width: 100%;
  position: relative;
  cursor: pointer;
}
.body-card__box {
  @include card-shadow;
  width: 100%;
  height: 0;
  padding-bottom: 132%;
  border-radius: 10px;
  background-color: #ffffff;
  position: relative;
}
.body-card__img {
  display: block;
  width: 100%;
  height: auto;
}
.body-card__avatar-img {
  display: block;
  position: absolute;
}
.body-card__avatar-img.annex {
  transform-origin: left top;
}
.body-card__avatar-img.avatar {
  transform-origin: bottom;
}
.body-card__edit-tag {
  @include flex-row-center;
  @include pos-absolute(auto, auto, -15px, 50%);
  @include card-shadow-lg(#ff533a);
  padding: 0 8px;
  height: 30px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 600;
  background-color: $theme-color;
  color: #ffffff;
  transform: translate3d(-50%, 0, 0) scale(0.8);
  font-family: var(--text-family);
  filter: grayscale(0);
  opacity: 1;
  white-space: nowrap;
  &.disabled {
    filter: grayscale(1);
    opacity: 0.3;
  }
}
.body-card__loading {
  @include pos-absolute(0, 0, 0, 0, 999);
  @include flex-row-center;
  border-radius: 10px;
  background-color: rgba($color: #000000, $alpha: 0.6);
  .loading-icon {
    animation: rotate 1s linear infinite;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(1turn);
    }
  }
}
</style>