<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-21 13:21:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-13 14:05:39
-->
<template>
  <div class="custom-board">
    <div class="custom-board__top">
      <base-header
        :center="false"
        :mainText="price"
        :subText="title"
        icon="arrowLeft"
        @close="backToList"
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
        />
      </div>
      <!-- 色彩饱和度调整，单头的时候出现 -->
      <brightness-bar
        :url="singleAvatar.rawAvatarURL"
        @change="changeAvatarColor"
      />
    </div>
    <div class="custom-board__bottom">
      <base-row :gutter="10">
        <base-col :span="8">
          <base-button plain @click="backToList" id="button_replace_2">{{
            pluginText.replace
          }}</base-button>
        </base-col>
        <base-col :span="16">
          <base-button
            type="primary"
            full
            :blod="600"
            @click="handleConfirm"
            id="button_confirm_3"
            >{{ pluginText.confirm }}</base-button
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
import { reactive, toRefs, ref, inject, onMounted } from "vue";

import BaseHeader from "../../../../base/BaseHeader.vue";
import BaseRow from "../../../../base/BaseRow.vue";
import BaseCol from "../../../../base/BaseCol.vue";
import BaseButton from "../../../../base/BaseButton.vue";
import BaseIcon from "../../../../base/BaseIcon.vue";
import BrightnessBar from "./BrightnessBar.vue";
import CanvasLayers from "../../../../components/CanvasLayers.vue";
import ImageSelectPlugin from "../../../../components/image-select-plugin/ImageSelectPlugin.vue";

import { getLayers } from "../../../../utils/layers";
import { debounce } from "lodash";

import useMultipleAvatarDIY from "../../../../composables/useMultipleAvatarDIY";

export default {
  components: {
    BaseHeader,
    BaseRow,
    BaseCol,
    BaseButton,
    BaseIcon,
    BrightnessBar,
    CanvasLayers,
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
    back: null,
    selectFile: null,
    confirm: null,
    openImageExtendSelector: null,
  },

  setup(props, context) {
    const { config, skin } = props;

    const {
      canvasBox,
      createCanvas,
      layerNavList,
      activeID,
      createLayerNav,
      handleActiveLayerNav,
      removeAnnex,
      bringForwardLayer,
      beforeSelectAvatar,
      replaceActionLayer,
      findLayerListByType,
    } = useMultipleAvatarDIY(props);

    // 国际化
    const pluginText = inject("pluginText");

    // fabric实例
    let fabricInstance = null;

    const state = reactive({
      singleAvatar: {
        data: {
          avatar: {
            chin: null,
            url: "",
          },
          rawFile: "",
        },
        id: null,
        rawAvatarURL: "",
      },
    });

    onMounted(() => {
      // fabric实例
      fabricInstance = createCanvas("customBoard");
      setAvatar();
      renderer();
    });

    // 设置头部
    function setAvatar() {
      const firstItem = props.selectFiles[0];
      state.singleAvatar.data = { ...firstItem.data };
      state.singleAvatar.rawAvatarURL = firstItem.data.avatar.url;
    }

    // 渲染器
    const loading = ref(false);
    const renderer = debounce(function () {
      // 如果头像数量===1，则用singleAvatar来生成layers，否则用selectFiles
      const layers = getLayers({
        config,
        files: [state.singleAvatar],
        skin,
      });

      loading.value = true;
      fabricInstance.render({
        layers,
        success: () => {
          loading.value = false;
          createLayerNav();
          // 默认激活头部图层
          const avatarLayer = findLayerListByType("avatar")[0];
          if (avatarLayer) {
            fabricInstance.setActiveObject(avatarLayer);
            activeID.value = avatarLayer.id;
          }
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
          if (type === "avatar" || (type === "annex" && selectable)) {
            // 如果点击的是头像或者附件，则向上移动一层
            bringForwardLayer(layer);
          }
        },
      });
    }, 300);

    // 修改头像亮度饱和度
    function changeAvatarColor(url) {
      const avatar = fabricInstance
        .getObjects()
        .find((layer) => layer.type === "avatar");
      if (avatar) {
        avatar.setSrc(url, () => {
          fabricInstance.refresh();
        });
      }
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
      ...toRefs(state),
      pluginText,
      loading,
      layerNavList,
      activeID,
      canvasBox,
      backToList,
      handleActiveLayerNav,
      changeAvatarColor,
      handleConfirm,
      openImageSelector,
      closeImageSelector,
      handleCompleteSelect,
      selectorVisible,
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
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Cg fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath opacity=".5" d="M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z"/%3E%3Cpath d="M6 5V0H5v5H0v1h5v94h1V6h94V5H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
  // background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath fill-rule="evenodd" d="M0 0h4v4H0V0zm4 4h4v4H4V4z"/%3E%3C/g%3E%3C/svg%3E');
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