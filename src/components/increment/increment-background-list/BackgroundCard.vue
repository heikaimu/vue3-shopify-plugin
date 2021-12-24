<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-12-23 15:11:40
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-24 09:55:53
-->
<template>
  <div class="card-box" @click="handleSelectCard">
    <img class="bg-img" :src="url" alt="" @load="imgLoaded" />
    <img
      v-for="(item, index) in position"
      :key="index"
      :src="customBodyPreviewURL"
      class="body-img"
      :style="getStyle(item)"
      alt=""
    />
  </div>
</template>

<script>
import { reactive, ref, toRefs, watch, onMounted, computed } from "vue";
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
  },

  setup(props) {
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

    // 获取排版信息
    function getComposing(cardWidth) {
      const curStyle = (props.composingList || [])[props.composingIndex];
      const curSize = curStyle.list.find((item) => item.name === props.size);
      const { position, size } = curSize;
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
      };
    }

    // 图片加载完成
    function imgLoaded(e) {
      getComposing(e.target.width);
    }

    function handleSelectCard() {
      context.emit('cardSelect', {
        
      })
    }

    return {
      ...toRefs(state),
      url,
      getStyle,
      imgLoaded,
      handleSelectCard
    };
  },
};
</script>

<style lang="scss" scoped>
.card-box {
  position: relative;
  overflow: hidden;
  .bg-img {
    width: 100%;
    display: block;
    line-height: 1;
  }

  .body-img {
    display: block;
    max-width: none;
    line-height: 1;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    transform-origin: center center;
  }
}
</style>