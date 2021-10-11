<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-21 13:21:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-11 11:01:15
-->
<template>
  <div class="custom-board">
    <div class="custom-board__top">
      <base-header
        :center="false"
        :mainText="price"
        :subText="title"
        icon="close"
        @close="handleClose"
      >
        <base-button
          type="primary"
          full
          :blod="600"
          class="custom-board__button--confirm"
          @click="handleSave"
          id="button_confirm_3"
          >CONFIRM</base-button
        >
      </base-header>
    </div>
    <div class="custom-board__medium">
      <!-- fabric -->
      <div class="custom-board__canvas-box" ref="canvasBox">
        <canvas id="customBoard"></canvas>
      </div>
    </div>

    <!-- loading -->
    <div class="custom-board__loading" v-if="loading">
      <div class="loading-icon">
        <base-icon icon="loading" :size="30" color="#ffffff"></base-icon>
      </div>
    </div>

    <!-- 文件选择 -->
    <div class="image-extend-selector-dialog" v-if="selectorVisible">
      <image-select-plugin
        @close="closeImageSelector"
        @complete="handleCompleteSelect"
      />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, toRaw, ref, computed, onMounted, watch } from "vue";

import BaseHeader from "../../../base/BaseHeader.vue";
import BaseButton from "../../../base/BaseButton.vue";
import BaseIcon from "../../../base/BaseIcon.vue";
import ImageSelectPlugin from "../../image-select-plugin/ImageSelectPlugin.vue";

import CanvasRenderer from "../../../utils/canvasRenderer";
import {
  getSVG,
  getAnnexList,
  getBody,
  getAvatar,
} from "../../../utils/layers";
import { debounce } from "lodash";
import { getRandomID } from "../../../utils/image";

export default {
  components: {
    BaseHeader,
    BaseButton,
    BaseIcon,
    ImageSelectPlugin,
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
    close: null,
    save: null,
  },

  setup(props, context) {
    const { config, skin } = props;

    // fabric实例
    let fabricInstance = null;

    const state = reactive({
      loading: false,
      layerList: [],
      actionType: "", // 操作方式，新增或者替换
      currentVBox: {}, // 当前的虚拟box
      currentActiveAvatar: null,
    });

    // 最大的头像数量，等同于配置的头像数组长度
    const filesMax = computed(() => {
      if (config.faceList) {
        return config.faceList.length;
      } else {
        return 1;
      }
    });

    onMounted(() => {
      renderer();
    });

    // 文件发生变化的时候重新渲染
    // watch(
    //   () => props.selectFiles,
    //   () => {
    //     renderer();
    //   },
    //   { deep: true }
    // );

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
    const renderer = debounce(function () {
      setCanvasInstance();

      const body = getBody(config, skin);
      state.layerList.push(body);

      const annexList = getAnnexList(config, skin);
      state.layerList.push(...annexList);

      if (config.type === "hood") {
        const svg = getSVG(config);
        state.layerList.push(svg);
      }

      const avatarList = config.faceList.map((item, index) => {
        const { left, top, angle, width } = item;
        return {
          left,
          top,
          angle,
          width,
          originX: "center",
          originY: "bottom",
          sort: 3,
          customControls: true,
          globalCompositeOperation: config.type === "hood" ? "source-atop" : "",
          type: "vBox",
          id: getRandomID(),
          selectable: false,
          name: `vBox${index}`,
        };
      });

      state.layerList.push(...avatarList);

      fabricInstance.render({
        layers: state.layerList,
        success: () => {},
        replacePhoto: (layer) => {
          state.actionType = "replace";
          state.currentActiveAvatar = layer;
          openImageSelector();
        },
        singleClick: (data) => {
          state.actionType = "add";
          state.currentVBox = data;
          openImageSelector();
        },
      });
    }, 300);

    // add:添加头像替换虚拟BOX
    function addAvatarReplaceVbox(avatar) {
      const { layer, config } = state.currentVBox;
      if (layer && layer.name) {
        fabricInstance.remove({ name: layer.name });
      }

      const avatarLayer = getAvatar(config, avatar.avatar);
      fabricInstance.add(avatarLayer);

      const id = avatarLayer.id;
      props.selectFiles.push({
        id,
        data: avatar,
      });
    }

    // update:替换头像
    function replaceAvatar(avatar) {
      const { left, top, width, angle, scaleX, id } = state.currentActiveAvatar;
      const scale = fabricInstance.scale;

      // 删除当前的
      fabricInstance.remove({
        layer: toRaw(state.currentActiveAvatar),
      });

      // 添加新的
      const config = {
        left: left / scale,
        top: top / scale,
        width: (width * scaleX) / scale,
        angle,
      };
      const avatarLayer = getAvatar(config, avatar.avatar, id);
      fabricInstance.add(avatarLayer);

      // 替换掉selectFiles里对应的元素文件
      const currentFile = props.selectFiles.find((item) => item.id === id);
      if (currentFile) {
        currentFile.data = avatar;
      }
    }

    // 保存数据
    function handleSave() {
      if (!fabricInstance) {
        return;
      }

      const url = fabricInstance.toDataURL();
      context.emit("save", {
        url,
        config: props.config,
      });
    }

    // 关闭插件
    function handleClose() {
      context.emit("close");
    }

    // 打开图片扩展
    function handleOpenImageExtendSelector() {
      context.emit("fileSelect", {
        action: "add",
      });
    }

    // 文件选择
    const selectorVisible = ref(false);
    function openImageSelector() {
      setImageSelectorVisible(true);
    }
    function closeImageSelector() {
      setImageSelectorVisible(false);
    }
    function handleCompleteSelect(data) {
      setImageSelectorVisible(false);
      if (state.actionType === "add") {
        addAvatarReplaceVbox(data);
      } else if (state.actionType === "replace") {
        replaceAvatar(data);
      }
    }
    function setImageSelectorVisible(flag) {
      selectorVisible.value = flag;
    }

    return {
      ...toRefs(state),
      canvasBox,
      filesMax,
      handleClose,
      handleSave,
      handleOpenImageExtendSelector,
      selectorVisible,
      openImageSelector,
      closeImageSelector,
      handleCompleteSelect,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.image-extend-selector-dialog {
  @include pos-absolute(0, 0, 0, 0, 2020);
  background-color: #ffffff;
}

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