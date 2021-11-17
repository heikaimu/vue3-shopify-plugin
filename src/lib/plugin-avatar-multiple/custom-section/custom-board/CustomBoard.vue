<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-21 13:21:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-11-16 15:42:44
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
      />
    </div>
    <div class="custom-board__medium">
      <!-- fabric -->
      <div class="custom-board__canvas-box" ref="canvasBox">
        <canvas id="customBoard"></canvas>
        <canvas-layers
          :list="layerNavList"
          :activeID="activeID"
          @change="handleActiveLayerNav"
        ></canvas-layers>
      </div>
    </div>
    <div class="custom-board__bottom">
      <base-row :gutter="10">
        <base-col :span="24">
          <base-button
            type="primary"
            full
            :blod="600"
            @click="handleSave"
            id="button_confirm_3"
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
import { ref, onMounted } from "vue";

import BaseHeader from "../../../../base/BaseHeader.vue";
import BaseButton from "../../../../base/BaseButton.vue";
import BaseIcon from "../../../../base/BaseIcon.vue";
import BaseRow from "../../../../base/BaseRow.vue";
import BaseCol from "../../../../base/BaseCol.vue";
import ImageSelectPlugin from "../../../../components/image-select-plugin/ImageSelectPlugin.vue";
import CanvasLayers from "../../../../components/CanvasLayers.vue";

import { debounce } from "lodash";

import useMultipleAvatarDIY from "../../../../composables/useMultipleAvatarDIY";

export default {
  components: {
    BaseHeader,
    BaseButton,
    BaseIcon,
    BaseRow,
    BaseCol,
    ImageSelectPlugin,
    CanvasLayers,
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
    const { config } = props;

    const {
      canvasBox,
      createCanvas,
      createRenderLayerList,
      layerNavList,
      activeID,
      createLayerNav,
      handleActiveLayerNav,
      removeAnnex,
      beforeSelectAvatar,
      replaceActionLayer,
      bringForwardLayer,
    } = useMultipleAvatarDIY(props, context);

    let fabricInstance = null;

    onMounted(() => {
      // fabric实例
      fabricInstance = createCanvas("customBoard");
      // 渲染
      renderer();
    });

    // 渲染器
    const loading = ref(false);
    const renderer = debounce(function () {
      loading.value = true;
      const list = createRenderLayerList();

      fabricInstance.render({
        layers: list,
        success: () => {
          loading.value = false;
          createLayerNav();
        },
        replacePhoto: (layer) => {
          // 添加一个延迟，先执行click再执行replace
          setTimeout(() => {
            const { type } = layer;
            if (type === "avatar") {
              beforeSelectAvatar(layer);
              openImageSelector();
            } else if (type === "annex") {
              removeAnnex(layer);
            }
          }, 300);
        },
        singleClick: (data) => {
          const { layer } = data;
          const { type, selectable } = layer;

          if (type === "vBox") {
            // 如果点击的是虚拟box则打开头像文件选择窗口
            beforeSelectAvatar(layer);
            openImageSelector();
          } else if (type === "avatar" || (type === "annex" && selectable)) {
            // 如果点击的是头像或者附件，则向上移动一层
            bringForwardLayer(layer);
          }
        },
      });
    }, 300);

    // 保存数据
    function handleSave() {
      if (!fabricInstance) {
        return;
      }

      if (props.selectFiles.length !== config.faceList.length) {
        alert("Try again after fill all avatar");
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
      replaceActionLayer(data);
    }
    function setImageSelectorVisible(flag) {
      selectorVisible.value = flag;
    }

    return {
      loading,
      canvasBox,
      handleClose,
      handleSave,
      handleOpenImageExtendSelector,
      selectorVisible,
      openImageSelector,
      closeImageSelector,
      handleCompleteSelect,
      layerNavList,
      activeID,
      handleActiveLayerNav,
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