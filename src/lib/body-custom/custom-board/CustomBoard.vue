<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-21 13:21:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-24 17:11:06
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
      >
        <base-button
          v-if="filesMax > 1"
          type="primary"
          full
          :blod="600"
          class="custom-board__button--confirm"
          @click="handleConfirm"
          id="button_confirm_3"
          >CONFIRM</base-button
        >
      </base-header>
    </div>
    <div class="custom-board__medium">
      <!-- fabric -->
      <div class="custom-board__canvas-box" ref="canvasBox">
        <canvas id="customBoard"></canvas>
        <canvas-layer :list="layerList" @change="changeActiveLayer" />
      </div>
      <!-- 色彩饱和度调整 -->
      <!-- <brightness-bar :url="currentAvatar.url" @change="changeAvatar" /> -->
    </div>
    <div class="custom-board__bottom">
      <base-row :gutter="10" v-if="filesMax === 1">
        <base-col :span="8">
          <base-button plain @click="backToList" id="button_replace_2">Replace</base-button>
        </base-col>
        <base-col :span="16">
          <base-button type="primary" full :blod="600" @click="handleConfirm" id="button_confirm_3">CONFIRM</base-button>
        </base-col>
      </base-row>
      <custom-files
        v-else
        :list="selectFiles"
        :max="filesMax"
        @open="handleOpenImageExtendSelector"
      ></custom-files>
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
import { reactive, toRefs, ref, computed, onMounted, watch } from "vue";

import BaseHeader from "../../../base/BaseHeader.vue";
import BaseRow from "../../../base/BaseRow.vue";
import BaseCol from "../../../base/BaseCol.vue";
import BaseButton from "../../../base/BaseButton.vue";
import BaseIcon from "../../../base/BaseIcon.vue";
import BrightnessBar from "./BrightnessBar.vue";
import CanvasLayer from "./CanvasLayers.vue";
import CustomFiles from "./CustomFiles.vue";

import CanvasRenderer from "../../../utils/canvasRenderer";
import { getLayers } from "../../../utils/layers";
import { debounce } from "lodash";

export default {
  components: {
    BaseHeader,
    BaseRow,
    BaseCol,
    BaseButton,
    BaseIcon,
    BrightnessBar,
    CanvasLayer,
    CustomFiles,
  },

  props: {
    selectFiles: {
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
    openImageExtendSelector: null,
  },

  setup(props, context) {
    const { config, skin } = props;

    let fabricInstance = null;

    const state = reactive({
      loading: false,
      layerList: [],
      currentAvatar: {},
    });

    const filesMax = computed(() => {
      if (config.faceList) {
        return config.faceList.length;
      } else {
        return 1;
      }
    });

    onMounted(() => {
      // if (filesMax.value === 1) {
      //   for (let i = props.selectFiles.length - 1; i >= 0; i--) {
      //     if (i === props.selectFiles.length - 1) {
      //       continue;
      //     }
      //     props.selectFiles.splice(i, 1);
      //   }
      // }
      renderer();
    });

    watch(
      () => props.selectFiles,
      () => {
        renderer();
      },
      { deep: true }
    );

    // 实力化插件
    const canvasBox = ref(null);
    function setCanvasInstance() {
      if (!fabricInstance) {
        const { width, height } = canvasBox.value.getBoundingClientRect();
        const normalHeight = (width / 500) * 660;
        fabricInstance = new CanvasRenderer("customBoard", {
          width,
          height: Math.min(normalHeight, height),
          scale: width / config.width,
        });
      }
    }

    // 渲染器
    const renderer = debounce(function() {
      setCanvasInstance();
      config.faceList = config.faceList ? config.faceList : [config.face, config.face, config.face];
      const layers = getLayers({
        config,
        files: props.selectFiles,
        skin,
      });

      fabricInstance.render({
        layers,
        success: (items) => {
          renderLayer(items);
        },
        replacePhoto: () => {
          context.emit("selectFile");
        },
      });
    }, 300)

    // 渲染图层
    function renderLayer(items) {
      const availableItems = items.filter((item) => {
        return item.name !== "svg";
      });
      state.layerList = availableItems.map((item, index) => {
        item.active = index === 0;
        return {
          obj: item,
          url: item.getSrc(),
        };
      });
      fabricInstance.setActiveObject(availableItems[0]);
    }

    // 修改激活图层
    function changeActiveLayer(item, index) {
      fabricInstance.setActiveObject(item.obj);
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
      state.currentAvatar.url = url;
      renderer();
    }

    // 保存数据
    function handleConfirm() {
      const url = fabricInstance.toDataURL();
      context.emit("confirm", url);
    }

    // 返回列表
    function backToList() {
      context.emit("back");
    }

    // 打开图片扩展
    function handleOpenImageExtendSelector() {
      context.emit("openImageExtendSelector");
    }

    return {
      ...toRefs(state),
      canvasBox,
      filesMax,
      backToList,
      changeActiveLayer,
      changeAvatar,
      handleConfirm,
      handleOpenImageExtendSelector,
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
.custom-board__button--confirm {
  width: 120px;
}
</style>