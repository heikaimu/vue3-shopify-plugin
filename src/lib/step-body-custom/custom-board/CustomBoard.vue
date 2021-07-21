<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-21 13:21:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-21 17:36:03
-->
<template>
  <div class="custom-board">
    <div class="custom-board__top">
      <base-header icon="arrowLeft" @close="backToList" />
    </div>
    <div class="custom-board__medium">
      <!-- fabric -->
      <div class="custom-board__canvas-box" ref="canvasBox">
        <canvas id="customBoard"></canvas>
        <!-- fabric-layer -->
        <div class="canvas-layer">
          <div
            v-for="(item, index) in layerList"
            class="layer-img"
            :class="{ active: item.obj.active }"
            :key="index"
            @click="changeActiveLayer(item, index)"
          >
            <img :src="item.url" alt="" />
          </div>
        </div>
      </div>
      <!-- 色彩饱和度调整 -->
      <brightness-bar />
    </div>
    <div class="custom-board__bottom">
      <base-row :gutter="10">
        <base-col :span="8">
          <base-button plain>Replace</base-button>
        </base-col>
        <base-col :span="16">
          <base-button type="primary" full>CONFIRM</base-button>
        </base-col>
      </base-row>
    </div>

    <!-- loading -->
    <div class="custom-board__loading" v-if="loading">
      <div class="loading-icon">
        <base-icon icon="loading" :size="30" color="#ffffff"></base-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, toRaw, onMounted } from "vue";

import BaseHeader from "../../../components/BaseHeader.vue";
import BaseRow from "../../../components/BaseRow.vue";
import BaseCol from "../../../components/BaseCol.vue";
import BaseButton from "../../../components/BaseButton.vue";
import BaseIcon from "../../../components/BaseIcon.vue";
import BrightnessBar from "./BrightnessBar.vue";

import Minime from "../../../utils/minime";

export default {
  components: {
    BaseHeader,
    BaseRow,
    BaseCol,
    BaseButton,
    BaseIcon,
    BrightnessBar,
  },

  props: {
    avatar: {
      type: Object,
      deafult: () => {},
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
    back: null,
    selectFile: null,
  },

  setup(props, context) {
    const { avatar, config, skin } = props;

    const state = reactive({
      canvas: null,
      loading: false,
      layerList: [],
    });

    onMounted(() => {
      if (!state.canvas) instanceMinime();
    });

    // 实力化插件
    const canvasBox = ref(null);
    function instanceMinime() {
      state.loading = true;

      const { width, height } = canvasBox.value.getBoundingClientRect();
      const normalHeight = (width / 500) * 660;
      state.canvas = new Minime("customBoard", {
        width,
        height: Math.min(normalHeight, height),
      });

      state.canvas.setOption({
        avatar: avatar.url,
        chin: avatar.chin,
        option: config,
        skin: skin,
        success: () => {
          state.loading = false;
          renderLayer();
        },
        replacePhoto: () => {
          context.emit("selectFile");
        },
      });
    }

    // 渲染图层
    function renderLayer() {
      const items = state.canvas.canvas.getObjects();
      state.canvas.canvas.setActiveObject(items[0]);
      state.canvas.canvas.renderAll();
      state.layerList = items.map((item) => {
        return {
          obj: item,
          url: item.getSrc(),
        };
      });
    }

    // 修改激活图层
    function changeActiveLayer(item, index) {
      state.canvas.canvas.setActiveObject(item.obj);
      state.canvas.canvas.renderAll();
      for (let i = 0; i < state.layerList.length; i++) {
        if (i === index) {
          state.layerList[i].obj.active = true;
        } else {
          state.layerList[i].obj.active = false;
        }
      }
    }

    // 返回列表
    function backToList() {
      context.emit("back");
    }

    return {
      ...toRefs(state),
      canvasBox,
      backToList,
      changeActiveLayer,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.custom-board {
  @include pos-absolute(999);
  @include flex-col-sb;
  background-color: #ffffff;
}
.custom-board__top {
  width: 100%;
}
.custom-board__medium {
  width: 100%;
  flex: 1;
  overflow: hidden;
  position: relative;
  .custom-board__canvas-box {
    @include flex-col-center;
    width: 100%;
    height: 100%;
    .canvas-layer {
      @include flex-row-center;
      width: 100%;
      height: 60px;
      position: relative;
      top: -20px;
      .layer-img {
        width: 60px;
        height: 60px;
        padding: 5px;
        border-radius: 4px;
        border: 2px solid #e7e7e7;
        margin: 0 5px;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        &.active {
          border: 2px solid $theme-color;
        }
      }
    }
  }
}
.custom-board__bottom {
  width: 100%;
  padding: 10px;
  background-color: #e4e7ed;
}
.custom-board__loading {
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