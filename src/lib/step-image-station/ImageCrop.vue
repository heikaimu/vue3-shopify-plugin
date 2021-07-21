<template>
  <div class="cropper-view">
    <div class="cropper-view__top">
      <base-header mainText="裁剪" icon="arrowLeft" @close="backToView" />
    </div>
    <div class="cropper-view__medium">
      <div class="cropper-view__content">
        <img id="image" :src="fileURL" alt="" />
      </div>
      <div class="cropper-view__notice">
        <base-notice>Drag the frame to choose one face</base-notice>
      </div>
    </div>
    <div class="cropper-view__bottom">
      <footer class="cropper-operations">
        <div class="operations">
          <div class="button">
            <base-icon
              icon="zoomUp"
              :size="16"
              color="#666666"
              @click="handleZoom(0.1)"
            />
          </div>
          <div class="button">
            <base-icon
              icon="zoomDown"
              :size="16"
              color="#666666"
              @click="handleZoom(-0.1)"
            />
          </div>
          <div class="button">
            <base-icon
              icon="reset"
              :size="16"
              color="#666666"
              @click="handleReset"
            />
          </div>
        </div>
        <div class="confirm-button-wrapper">
          <base-button type="warning" size="small" @click="handleConfirm"
            >CONFIRM</base-button
          >
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";

import BaseHeader from "../../components/BaseHeader.vue";
import BaseButton from "../../components/BaseButton.vue";
import BaseNotice from "../../components/BaseNotice.vue";
import BaseIcon from "../../components/BaseIcon.vue";
import Cropper from "cropperjs";
import "../../styles/cropper.scss";

export default {
  components: {
    BaseHeader,
    BaseButton,
    BaseNotice,
    BaseIcon,
  },

  props: {
    fileURL: {
      type: String,
      deafult: "",
    },
  },

  emits: {
    crop: null,
    back: null,
  },

  setup(props, context) {
    const state = reactive({
      cropper: null,
    });

    onMounted(() => {
      const image = document.getElementById("image");
      state.cropper = new Cropper(image, {
        // aspectRatio: 1,
        autoCropArea: 0.9,
        viewMode: 2,
        dragMode: "move", // 图片可移动
      });
    });

    // 缩放
    function handleZoom(val) {
      state.cropper.zoom(val);
    }

    // 重置
    function handleReset() {
      state.cropper.reset();
    }

    // 保存
    function handleConfirm() {
      const cropURL = state.cropper.getCroppedCanvas().toDataURL("image/jpeg");
      context.emit("crop", cropURL);
    }

    // 回到预览
    function backToView() {
      context.emit("back");
    }

    return {
      handleZoom,
      handleReset,
      handleConfirm,
      backToView,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.cropper-view {
  @include flex-col-sb;
  height: 100%;
}
.cropper-view__top {
  width: 100%;
}
.cropper-view__medium {
  @include flex-col-sb;
  width: 100%;
  flex: 1;
  background-color: #f2f2f2;
}
.cropper-view__content {
  @include flex-col-center;
  flex: 1;
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
.cropper-view__notice {
  padding: 10px;
}
.cropper-view__bottom {
  width: 100%;
  .cropper-operations {
    @include flex-row-sb;
    padding: 10px;

    .operations {
      display: flex;
      .button {
        height: 36px;
        padding: 0 20px;
        border-radius: 4px;
        background-color: #e4e7ed;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        color: #ffffff;
        margin-bottom: 0;
        margin-right: 10px;
      }
    }
    .confirm-button-wrapper {
      width: 100px;
    }
  }
}
</style>