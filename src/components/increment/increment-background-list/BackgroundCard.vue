<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-23 15:11:40
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-19 12:12:24
-->
<template>
  <div
    class="card-box"
    :style="cardStyle"
    :id="`${active ? 'activeCard' : ''}`"
    @click="handleSelectCard"
  >
    <img class="bg-img" :src="url" alt="" @load="imgLoaded" />
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
import { reactive, toRefs, computed, onMounted } from "vue";
import { loadImage } from "../../../utils/image";
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    size: {
      type: Object,
    },
    active: {
      type: Boolean,
      default: false,
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
    cardSelect: null
  },

  setup(props, context) {
    const state = reactive({
      position: [],
    });

    const curImage = computed(() => {
      if (props.size.label && props.data.list) {
        return props.data.list.find((item) => {
          return item.size === props.size.label;
        });
      }
      return {};
    });

    const url = computed(() => {
      if (curImage.value) {
        return curImage.value.url || "";
      }
      return "";
    });

    const curComposing = computed(() => {
      if (
        props.size.label &&
        props.data.composing &&
        Array.isArray(props.data.composing.list)
      ) {
        const curItem = props.data.composing.list.find((item) => {
          return item.size.width === props.size.value.width && item.size.height === props.size.value.height;
        });
        return curItem;
      }
      return {};
    });

    // 卡片样式
    const cardStyle = computed(() => {
      if (!curComposing.value) {
        return;
      }

      const { size } = curComposing.value;
      if (size.width && size.height) {
        return {
          paddingBottom: `${(size.height / size.width) * 100}%`,
        };
      }
      return {};
    });

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

    function getComposing(cardWidth) {
      if (!curComposing.value) {
        return;
      }

      const { position, size } = curComposing.value;
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

    function handleSelectCard() {
      const params = renderParams();
      context.emit("cardSelect", params);
    }

    function renderParams() {
      const { position, size } = curComposing.value;

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
      curComposing,
      curImage,
      url,
      cardStyle,
      imgLoaded,
      getStyle,
      handleSelectCard,
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