<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-21 13:21:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-13 10:15:16
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
      </div>
    </div>
    <div class="custom-board__bottom">
      <base-row :gutter="10">
        <!-- <base-col :span="8">
          <base-button plain id="button_replace_2"
            >Replace</base-button
          >
        </base-col> -->
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
import { reactive, toRefs, toRaw, ref, computed, onMounted, watch } from "vue";

import BaseHeader from "../../../../base/BaseHeader.vue";
import BaseButton from "../../../../base/BaseButton.vue";
import BaseIcon from "../../../../base/BaseIcon.vue";
import BaseRow from "../../../../base/BaseRow.vue";
import BaseCol from "../../../../base/BaseCol.vue";
import ImageSelectPlugin from "../../../../components/image-select-plugin/ImageSelectPlugin.vue";

import CanvasRenderer from "../../../../utils/canvasRenderer";
import {
  getSVG,
  getAnnexList,
  getBody,
  getAvatar,
} from "../../../../utils/layers";
import { debounce } from "lodash";
import { getRandomID } from "../../../../utils/image";

export default {
  components: {
    BaseHeader,
    BaseButton,
    BaseIcon,
    BaseRow,
    BaseCol,
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
      // 实列化插件
      setCanvasInstance();

      // 添加底板图
      const body = getBody(config, skin);
      state.layerList.push(body);

      // 添加附件图
      const annexList = getAnnexList(config, skin);
      state.layerList.push(...annexList);

      // 如果是hood模式，添加svg蒙版层
      if (config.type === "hood") {
        const svg = getSVG(config);
        state.layerList.push(svg);
      }

      // 根据当前头的数量添加虚拟头
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

      // 渲染
      state.loading = true;
      fabricInstance.render({
        layers: state.layerList,
        success: () => {
          state.loading = false;
        },
        replacePhoto: (layer) => {
          // 替换头像
          state.actionType = "replace";
          state.currentActiveAvatar = layer;
          openImageSelector();
        },
        singleClick: (data) => {
          // 新增头像
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
      config.configType = props.config.type;
      const avatarLayer = getAvatar(config, avatar.avatar);
      fabricInstance.add(avatarLayer, true);

      const id = avatarLayer.id;
      props.selectFiles.push({
        id,
        data: avatar,
      });
    }

    // update:替换头像
    function replaceAvatar(avatar) {
      const { left, top, width, angle, scaleX, id, offset } =
        state.currentActiveAvatar;
      const scale = fabricInstance.scale;

      // 删除当前头像
      fabricInstance.remove({
        layer: toRaw(state.currentActiveAvatar),
      });

      // 获取当前头像的定位，如果之前有偏移，在计算位置的时候先减去偏移量
      const offsetX = offset.left || 0;
      const offsetY = offset.top || 0;
      const config = {
        left: (left - offsetX) / scale,
        top: (top - offsetY) / scale,
        width: (width * scaleX) / scale,
        angle,
        configType: props.config.type,
      };

      // 添加新头像
      const avatarLayer = getAvatar(config, avatar.avatar, id);
      fabricInstance.add(avatarLayer, true);

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

      if(props.selectFiles.length !== config.faceList.length) {
        alert('Try again after fill all avatar');
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