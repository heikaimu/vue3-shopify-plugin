<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-23 15:11:40
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-27 14:40:59
-->
<template>
  <div class="card-box" :style="cardStyle" @click="handleSelectCard">
    <img
      class="bg-img"
      :width="originRenderMap.size.width"
      :height="originRenderMap.height"
      :src="url"
      alt=""
      @load="imgLoaded"
    />
    <img
      v-for="(item, index) in position"
      :key="index"
      :src="customBodyPreviewURL"
      class="body-img"
      :style="getStyle(item)"
      alt=""
    />
    <img
      v-if="backgroundImage"
      class="background-image"
      :src="backgroundImage"
      alt=""
    />
    <img v-if="overlayImage" class="overlay-image" :src="overlayImage" alt="" />
  </div>
</template>

<script>
import { reactive, toRefs, computed } from "vue";
import { loadImage } from "../../../utils/image";
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    size: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
    composingList: {
      type: Array,
      default: () => [],
    },
    composingIndex: {
      type: Number,
      default: 0,
    },
    customBodyPreviewURL: {
      type: String,
      default: "",
    },
    // 单独设置的背景图，如果存在，则当前列表的大图为遮盖图
    backgroundImage: {
      type: String,
      default: "",
    },
    // 单独设置的遮盖图
    overlayImage: {
      type: String,
      default: "",
    },
  },

  emits: {
    cardSelect: null,
  },

  setup(props, context) {
    const state = reactive({
      position: [],
    });

    // 背景图，当尺寸存在的时候去取对应的背景图
    const url = computed(() => {
      if (props.size) {
        return (
          (props.data.list.find((item) => item.size === props.size) || {})
            .url || ""
        );
      }
      return "";
    });

    // 渲染信息
    const originRenderMap = computed(() => {
      if (props.size) {
        const curStyle = (props.composingList || [])[props.composingIndex];
        const curSize = curStyle.list.find((item) => item.name === props.size);
        return curSize;
      }
      return {
        position: [],
        size: {},
      };
    });

    // 卡片样式
    const cardStyle = computed(() => {
      const { size } = originRenderMap.value;
      if (size.width && size.height) {
        return {
          paddingBottom: `${size.height / size.width * 100}%`
        }
      } else {
        return {}
      }
    })

    // 获取排版信息
    function getComposing(cardWidth) {
      const { position, size } = originRenderMap.value;
      const originalWidth = size.width || 0;
      const scale = cardWidth / originalWidth;

      loadImage(props.customBodyPreviewURL).then((res) => {
        const WH = res.width / res.height;

        if (position) {
          state.position = position
            .filter((item) => item.type === "image")
            .map((item) => {
              const { angle, left, top, width } = item;
              const curWidth = width * scale;
              const curHeight = curWidth / WH;
              return {
                angle,
                left: left * scale - curWidth / 2,
                top: top * scale - curHeight / 2,
                width: curWidth,
              };
            });
        }
      });
    }

    // 获取样式
    function getStyle(item) {
      const { angle, left, top, width } = item;

      return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        zIndex: props.backgroundImage ? 97 : 100,
      };
    }

    // 图片加载完成
    function imgLoaded(e) {
      getComposing(e.target.width);
    }

    function handleSelectCard() {
      const params = renderParams();
      context.emit("cardSelect", params);
    }

    function renderParams() {
      const { position, size } = originRenderMap.value;

      const params = {
        width: size.width,
        height: size.height,
        layerList: [],
      };

      if (props.backgroundImage) {
        params.backgroundImage = {
          url: props.backgroundImage,
        };
        params.overlayImage = {
          url: url.value,
        };
      } else if (props.overlayImage) {
        params.backgroundImage = {
          url: url.value,
        };
        params.overlayImage = {
          url: props.overlayImage,
        };
      } else {
        params.backgroundImage = {
          url: url.value,
        };
      }

      for (const item of position) {
        if (item.type === "image") {
          params.layerList.push({
            ...item,
            url: props.customBodyPreviewURL,
          });
        } else {
          params.layerList.push({
            ...item,
          });
        }
      }

      return params;
    }

    return {
      ...toRefs(state),
      url,
      getStyle,
      imgLoaded,
      handleSelectCard,
      originRenderMap,
      cardStyle
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";
.card-box {
  width: 100%;
  height: 0;
  position: relative;
  overflow: hidden;
  background-color: #e7e7e7;
  cursor: pointer;
  .bg-img {
    width: 100%;
    display: block;
    line-height: 1;
    position: relative;
    z-index: 99;
  }

  .background-image {
    @include pos-absolute(0, 0, 0, 0, 96);
  }

  .overlay-image {
    @include pos-absolute(0, 0, 0, 0, 106);
  }

  .body-img {
    display: block;
    max-width: none;
    line-height: 1;
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: center center;
  }
}
</style>