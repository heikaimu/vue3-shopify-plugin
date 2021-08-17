<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 16:32:06
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-09 15:23:47
-->
<template>
  <div class="body-card" @click="handleClick">
    <!-- normal -->
    <div class="body-card__box" v-if="data.type === 'normal'">
      <img class="body-card__img" :src="bodyURL" alt="" @load="bgLoad" />
      <img
        class="body-card__avatar-img"
        :src="avatar.url"
        alt=""
        :style="avatarStyle"
      />
      <img
        v-if="hatURL"
        class="body-card__avatar-img"
        :src="hatURL"
        alt=""
        :style="hatStyle"
      />
    </div>
    <!-- hood -->
    <div class="body-card__box" v-else>
      <img class="body-card__img" :src="bodyURL" alt="" />
    </div>
    <!-- 标签 -->
    <p class="body-card__edit-tag" :class="{ disabled: loading }">
      Tap &amp; Edit
      <!-- {{ size }} -->
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
import { reactive, toRefs, watch, onMounted } from "vue";

import BaseIcon from "../../../components/BaseIcon.vue";

import { renderer } from "../../../utils/minimeRenderer";
import { loadImages, getFileSize } from "../../../utils/image";

export default {
  components: {
    BaseIcon,
  },

  props: {
    data: {
      type: Object,
      deafult: () => {},
    },
    skin: {
      type: String,
      deafult: "",
    },
    avatar: {
      type: Object,
      deafult: () => {},
    },
  },

  emits: {
    click: null
  },

  setup(props, context) {
    const { data, skin, avatar } = props;

    const state = reactive({
      // 身体图片
      bodyURL: "",
      size: 0,
      // 头部样式
      avatarStyle: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        transform: `rotate(0deg)`,
      },
      // 帽子图片
      hatURL: "",
      // 帽子样式
      hatStyle: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        transform: `rotate(0deg)`,
      },
      // 加载中
      loading: false,
    });

    onMounted(() => {
      renderImage(props.skin);
    });

    watch(
      () => props.skin,
      (val) => {
        renderImage(val);
      }
    );

    // 渲染卡片
    function renderImage(skin) {
      if (data.type === "normal") {
        normalImage(skin);
      } else if (data.type === "hood") {
        hoodImage(skin);
      }
    }

    // 普通图片
    function normalImage(skin) {
      const currentSkinImage = data.images.find((item) => item.color === skin);
      if (currentSkinImage) {
        state.loading = true;
        loadImages([currentSkinImage.url]).then((images) => {
          state.loading = false;
          state.bodyURL = images[0].src;
        });
      }
    }

    // 带svg图片
    function hoodImage(skin) {
      state.loading = true;
      renderer.request({
        avatar: avatar.url,
        chin: avatar.chin,
        option: data,
        skin: skin,
      }).then(url => {
        state.bodyURL = url;
        state.loading = false;
      });
    }

    // 背景图加载完成
    function bgLoad(e) {
      setAvatar(e);
      setAnnex(e);
    }

    // 设置头部
    function setAvatar(e) {
      const cardWidth = e.target.width;
      const faceSize = data.face;
      const allScale = cardWidth / data.width;
      const oWidth = avatar.width;
      const oHeight = avatar.height;
      const currentWidth = faceSize.width * allScale;
      const avatarScale = currentWidth / oWidth;
      const currentHeight = oHeight * avatarScale;
      const angle = faceSize.angle || 0;

      const top = faceSize.top * allScale;
      const left = faceSize.left * allScale;
      let offsetX = 0;
      let offsetY = 0;
      if (avatar.chin) {
        // const chinLeft = _this.minime.chin[0] * avatarScale;
        // const centerX = currentWidth / 2;
        // offsetX = centerX - chinLeft;
        const chinTop = avatar.chin[1] * avatarScale;
        const bottomY = currentHeight;
        offsetY = bottomY - chinTop;
      }

      state.avatarStyle = {
        width: `${currentWidth}px`,
        height: `${currentHeight}px`,
        top: `${top - currentHeight + offsetY}px`,
        left: `${left - currentWidth / 2 + offsetX}px`,
        transform: `rotate(${angle}deg)`,
      };
    }

    // 设置附件
    function setAnnex(e) {
      const cardWidth = e.target.width;
      const annex = data.annex;
      const allScale = cardWidth / data.width;

      if (annex && annex.length > 0) {
        const hat = annex[0];
        const src = (hat.images.find((item) => item.color === skin) || {}).url;
        state.hatURL = src;

        const image = new Image();
        image.src = src;
        image.onload = function () {
          const oWidth = image.width;
          const oHeight = image.height;
          const currentWidth = hat.width * allScale;
          const avatarScale = currentWidth / oWidth;
          const currentHeight = oHeight * avatarScale;
          const top = hat.top * allScale;
          const left = hat.left * allScale;
          const angle = hat.angle || 0;

          state.hatStyle = {
            width: `${currentWidth}px`,
            height: `${currentHeight}px`,
            top: `${top}px`,
            left: `${left}px`,
            transform: `rotate(${angle}deg)`,
          };
        };
      }
    }

    // 点击
    function handleClick() {
      if (!state.loading) {
        context.emit('click');
      }
    }

    return {
      ...toRefs(state),
      bgLoad,
      handleClick
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
  transform-origin: bottom;
}
.body-card__edit-tag {
  @include flex-row-center;
  @include pos-absolute(auto, auto, -15px, 50%);
  @include card-shadow-lg(#ff533a);
  width: 100px;
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
  &.disabled {
    filter: grayscale(1);
    opacity: 0.3;
  }
}
.body-card__loading {
  @include pos-absolute;
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