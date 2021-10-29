<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-21 13:21:01
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-28 16:45:35
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
        <canvas-layer
          :list="layerList"
          :activeID="activeID"
          @change="changeActiveLayer"
        />
      </div>
      <!-- 色彩饱和度调整，单头的时候出现 -->
      <brightness-bar :url="singleAvatar.rawAvatarURL" @change="changeAvatar" />
    </div>
    <div class="custom-board__bottom">
      <base-row :gutter="10">
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
import { reactive, toRefs, ref, nextTick, onMounted, watch } from "vue";

import BaseHeader from "../../../../base/BaseHeader.vue";
import BaseRow from "../../../../base/BaseRow.vue";
import BaseCol from "../../../../base/BaseCol.vue";
import BaseButton from "../../../../base/BaseButton.vue";
import BaseIcon from "../../../../base/BaseIcon.vue";
import BrightnessBar from "./BrightnessBar.vue";
import CanvasLayer from "./CanvasLayers.vue";

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

    onMounted(() => {
      setAvatar();
      renderer();
    });

    // 文件发生变化的时候重新渲染
    watch(
      () => props.selectFiles,
      () => {
        setAvatar();
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

    // 记录删除的annex
    const annexRecords = ref({});
    const activeID = ref("");
    async function hideAnnex(canvas, layer) {
      const { id, left, top, width, angle, scaleX } = layer;
      const scale = canvas.scale;

      annexRecords.value[id] = {
        left: left / scale,
        top: top / scale,
        width: (width * scaleX) / scale,
        angle,
      };
      canvas.remove({layer});

      await nextTick();
      activeID.value = "";
    }

    // 还原annex
    function revertAnnex(canvas, data) {
      const { url, id } = data;
      const record = annexRecords.value[id];

      if (!record) {
        return;
      }

      const { left, top, width, angle } = record;
      const layerInfo = {
        url,
        id,
        left,
        top,
        width,
        angle,
        sort: 10,
        customControls: true,
        type: "annex",
      };

      canvas.add(layerInfo, true);
    }

    // 渲染图层
    const layerList = ref([]);
    function renderLayer(items) {
      const availableItems = items.filter((item) => {
        return item.name !== "svg";
      });

      if (availableItems.length === 0) {
        return;
      }

      layerList.value = availableItems.map((item) => {
        return {
          id: item.id,
          url: item.getSrc(),
        };
      });

      activeID.value = availableItems[0].id;
      fabricInstance.setActiveObject(availableItems[0]);
    }

    // 修改激活图层
    function changeActiveLayer(data) {
      activeID.value = data.id;
      const items = fabricInstance.getObjects();
      const obj = items.find((item) => item.id === data.id);

      if (obj) {
        // 存在则激活
        fabricInstance.setActiveObject(obj);
      } else {
        // 不存在则还原
        revertAnnex(fabricInstance, data);
      }
    }

    // 设置头部
    function setAvatar() {
      const firstItem = props.selectFiles[0];
      state.singleAvatar = {
        avatar: {
          ...firstItem.avatar,
        },
        rawFile: firstItem.rawFile,
        rawAvatarURL: firstItem.avatar.url,
      };
    }

    // 渲染器
    const loading = ref(false);
    const renderer = debounce(function () {
      setCanvasInstance();

      // 如果头像数量===1，则用singleAvatar来生成layers，否则用selectFiles
      const layers = getLayers({
        config,
        files: [state.singleAvatar],
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
        singleClick: (data) => {
          const { type, id } = data.layer;
          if (type === "annex" || type === "avatar") {
            activeID.value = id;
          }
        },
      });
    }, 300);

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