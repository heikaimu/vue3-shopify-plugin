<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-21 13:21:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-30 17:35:43
-->
<template>
  <div class="custom-board">
    <div class="custom-board__top">
      <base-header
        :center="false"
        :mainText="price"
        :subText="title"
        icon="arrowDown"
        @close="backToList"
      />
    </div>
    <div class="custom-board__medium">
      <!-- fabric -->
      <div class="custom-board__canvas-box" ref="canvasBox">
        <canvas id="customBoard"></canvas>
        <!-- fabric-layer -->
        <canvas-layer :list="layerList" @change="changeActiveLayer" />
      </div>
      <!-- 色彩饱和度调整 -->
      <brightness-bar :url="avatar.url" @change="changeAvatar" />
    </div>
    <div class="custom-board__bottom">
      <base-row :gutter="10">
        <base-col :span="8">
          <base-button plain @click="backToList">Replace</base-button>
        </base-col>
        <base-col :span="16">
          <base-button type="primary" full :blod="600" @click="handleConfirm"
            >CONFIRM</base-button
          >
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
import CanvasLayer from "./CanvasLayers.vue";

import Minime from "../../../utils/minime";

export default {
  components: {
    BaseHeader,
    BaseRow,
    BaseCol,
    BaseButton,
    BaseIcon,
    BrightnessBar,
    CanvasLayer,
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
    title: {
      type: String,
      deafult: "",
    },
    price: {
      type: String,
      deafult: "",
    },
  },

  emits: {
    back: null,
    selectFile: null,
    confirm: null,
  },

  setup(props, context) {
    const { avatar, config, skin } = props;
    console.log(props.config);
    const state = reactive({
      canvas: null,
      loading: false,
      layerList: [],
      currentAvatarURL: "",
    });

    onMounted(() => {
      state.currentAvatarURL = avatar.url;
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
      renderer();
    }

    function renderer() {
      state.canvas.setOption({
        avatar: state.currentAvatarURL,
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
      const usingItems = items.filter(item => {
        return item.name;
      });
      state.canvas.canvas.setActiveObject(usingItems[0]);
      state.canvas.canvas.renderAll();
      state.layerList = usingItems.map((item) => {
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

    // 修改头像
    function changeAvatar(url) {
      state.currentAvatarURL = url;
      renderer();
    }

    // 保存数据
    function handleConfirm() {
      const url = state.canvas.canvas.toDataURL();
      context.emit("confirm", url);
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
      changeAvatar,
      handleConfirm,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.custom-board {
  @include pos-absolute(0, 0, 0, 0, 999);
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
  }
}
.custom-board__bottom {
  width: 100%;
  padding: 10px;
  background-color: #e4e7ed;
}
.custom-board__loading {
  @include pos-absolute(0, 0, 0, 0, 9999);
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