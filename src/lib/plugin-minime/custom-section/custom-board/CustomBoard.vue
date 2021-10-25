<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-21 13:21:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-25 16:33:19
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
        <canvas-layer
          :list="layerList"
          :activeID="activeID"
          @change="changeActiveLayer"
        />
      </div>
      <!-- 色彩饱和度调整，单头的时候出现 -->
      <brightness-bar
        v-if="filesMax === 1"
        :url="singleAvatar.rawAvatarURL"
        @change="changeAvatar"
      />
    </div>
    <div class="custom-board__bottom">
      <base-row :gutter="10" v-if="filesMax === 1">
        <base-col :span="8">
          <base-button plain @click="backToList" id="button_replace_2"
            >Replace</base-button
          >
        </base-col>
        <base-col :span="16">
          <base-button
            type="primary"
            full
            :blod="600"
            @click="handleConfirm"
            id="button_confirm_3"
            >CONFIRM</base-button
          >
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
import { reactive, toRefs, ref, toRaw, computed, onMounted, watch } from "vue";

import BaseHeader from "../../../../base/BaseHeader.vue";
import BaseRow from "../../../../base/BaseRow.vue";
import BaseCol from "../../../../base/BaseCol.vue";
import BaseButton from "../../../../base/BaseButton.vue";
import BaseIcon from "../../../../base/BaseIcon.vue";
import BrightnessBar from "./BrightnessBar.vue";
import CanvasLayer from "./CanvasLayers.vue";
import CustomFiles from "./CustomFiles.vue";

import CanvasRenderer from "../../../../utils/canvasRenderer";
import { getLayers } from "../../../../utils/layers";
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

    // fabric实例
    let fabricInstance = null;

    const state = reactive({
      singleAvatar: {
        avatar: {
          chin: null,
          url: "",
        },
        rawFile: "",
        rawAvatarURL: "",
      },
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
      // 如果是单头，则单独创建一个头部对象，用于亮度调节
      if (filesMax.value === 1) {
        const firstItem = props.selectFiles[0];
        state.singleAvatar = {
          avatar: {
            ...firstItem.avatar,
          },
          rawFile: firstItem.rawFile,
          rawAvatarURL: firstItem.avatar.url,
        };
      }
      renderer();
    });

    // 文件发生变化的时候重新渲染
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

    // 改变left值隐藏附件，记录隐藏之前的left方便之后恢复
    const annexRecords = ref({});
    const HIDDEN_LEFT = 10;
    function hideAnnex(canvas, layer) {
      const { id, left } = layer;
      annexRecords.value[id] = left;
      layer.set({
        left: 10,
      });
      // canvas.update({
      //   layer: layer,
      //   options: {
      //     left: HIDDEN_LEFT,
      //   },
      // });

      setTimeout(() => {
        layer.set({
          left: 200,
        });
        // canvas.update({
        //   layer: layer,
        //   options: {
        //     left: 200,
        //   },
        // });
      }, 1000);
    }

    // 恢复left
    function revertAnnex(canvas, layer) {
      const { id } = layer;
      const recordLeft = annexRecords.value[id];

      if (!recordLeft) {
        return;
      }
      canvas.update({
        layer: layer,
        options: {
          left: 200,
        },
      });

      annexRecords.value[id] = null;
    }

    // 渲染器
    const loading = ref(false);
    const renderer = debounce(function () {
      setCanvasInstance();

      // 如果头像数量===1，则用singleAvatar来生成layers，否则用selectFiles
      const layers = getLayers({
        config,
        files: filesMax.value === 1 ? [state.singleAvatar] : props.selectFiles,
        skin,
      });

      loading.value = true;
      fabricInstance.render({
        layers,
        success: (items) => {
          loading.value = false;
          renderLayer(items);
        },
        replacePhoto: (item) => {
          const { type } = item;
          if (type === "avatar") {
            context.emit("selectFile");
          } else if (type === "annex") {
            hideAnnex(fabricInstance, item);
          }
        },
      });
    }, 300);

    // 渲染图层
    const layerList = ref([]);
    const activeID = ref("");
    function renderLayer(items) {
      const availableItems = items.filter((item) => {
        return item.name !== "svg";
      });

      layerList.value = availableItems.map((item) => {
        return {
          id: item.id,
          url: item.getSrc(),
        };
      });

      if (availableItems.length > 0) {
        activeID.value = availableItems[0].id;
        fabricInstance.setActiveObject(availableItems[0]);
      }
    }

    // 修改激活图层
    function changeActiveLayer(data) {
      const items = fabricInstance.getObjects();
      const obj = items.find((item) => item.id === data.id);
      if (obj) {
        fabricInstance.setActiveObject(obj);
      }
      activeID.value = data.id;
      revertAnnex(fabricInstance, obj);
    }

    // 修改头像
    function changeAvatar(url) {
      state.singleAvatar.avatar.url = url;
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
      loading,
      layerList,
      activeID,
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