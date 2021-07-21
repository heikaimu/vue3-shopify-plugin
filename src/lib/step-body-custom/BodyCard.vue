<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 16:32:06
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-20 17:53:13
-->
<template>
  <div class="body-card">
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
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";

import Minime from "../../utils/minime";

export default {
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

  setup(props) {
    const { data, skin, avatar } = props;

    const state = reactive({
      bodyURL: "",
      avatarStyle: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        transform: `rotate(0deg)`,
      },
      hatURL: "",
      hatStyle: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        transform: `rotate(0deg)`,
      },
    });

    onMounted(() => {
      if (data.type === "normal") {
        const currentSkinImage = data.images.find(
          (item) => item.color === skin
        );
        state.bodyURL = currentSkinImage ? currentSkinImage.url : "";
      } else {
        const minime = new Minime("", {
          width: 500,
          height: 660,
        });
        minime.setOption({
          avatar: avatar.url,
          option: data,
          skin: skin,
          success: function (canvas) {
            setTimeout(() => {
              state.bodyURL = canvas.toDataURL();
            }, 300);
          },
        });
      }
    });

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

    return {
      ...toRefs(state),
      bgLoad,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.body-card {
  width: 100%;
}
.body-card__box {
  width: 100%;
  height: 0;
  padding-bottom: 132%;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 1px -1px rgb(0 0 0 / 20%), 0 1px 1px rgb(0 0 0 / 14%),
    0 1px 3px rgb(0 0 0 / 12%);
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
</style>