<template>
  <div class="image-view">
    <div class="image-view__medium">
      <div class="image-view__content">
        <div class="image-box">
          <img :src="fileURL" alt="" />
        </div>
        <ul class="operations">
          <li class="item">
            <div class="card" @click="handleCrop" id="icon_crop">
              <base-icon icon="cropper" />
            </div>
          </li>
          <li class="item">
            <div class="card" @click="handleRotate(-90)" id="icon_rotate_left">
              <base-icon icon="rotateLeft" />
            </div>
          </li>
          <li class="item">
            <div class="card" @click="handleRotate(90)" id="icon_rotate_right">
              <base-icon icon="rotateRight" />
            </div>
          </li>
        </ul>
        <div class="image-view__notice">
          <base-notice>{{ pluginText.crop_note_content }}</base-notice>
        </div>
      </div>
    </div>
    <div class="image-view__bottom">
      <base-row :gutter="10">
        <base-col :span="12">
          <base-button plain @click="handleBack" id="button_replace_1">{{
            pluginText.replace
          }}</base-button>
        </base-col>
        <base-col :span="12">
          <base-button
            type="primary"
            @click="handleConfirm"
            :blod="600"
            id="button_confirm_1"
            >{{ pluginText.confirm }}</base-button
          >
        </base-col>
      </base-row>
    </div>

    <loading-avatar
      :visible="loadingVisible"
      :state="loadingState"
      :loadingPendingText="loadingPendingText"
    />
  </div>
</template>

<script>
import { reactive, toRefs, inject } from "vue";

import BaseButton from "../../../base/BaseButton.vue";
import BaseNotice from "../../../base/BaseNotice.vue";
import BaseIcon from "../../../base/BaseIcon.vue";
import BaseRow from "../../../base/BaseRow.vue";
import BaseCol from "../../../base/BaseCol.vue";
import LoadingAvatar from "./LoadingAvatar.vue";

import { imageReset } from "../../../utils/image";
import { getAIAvatar } from "../../../api/picart";

export default {
  components: {
    BaseButton,
    BaseNotice,
    BaseIcon,
    BaseRow,
    BaseCol,
    LoadingAvatar,
  },

  props: {
    fileURL: {
      type: String,
      deafult: "",
    },
    // 是否定制
    isCustomBody: {
      type: Boolean,
      default: true,
    },
  },

  emits: {
    back: null,
    rotate: null,
    crop: null,
    save: null,
  },

  setup(props, context) {
    const state = reactive({
      loadingVisible: false,
      loadingState: "pending",
      loadingPendingText: "",
    });

    // 国际化
    const pluginText = inject("pluginText");

    // 裁剪
    function handleCrop() {
      context.emit("crop", "crop");
    }

    // 旋转
    function handleRotate(val) {
      imageReset({
        file: props.fileURL,
        quality: 1,
        targetSize: 1920,
        angle: val,
      }).then((url) => {
        context.emit("rotate", url);
      });
    }

    // 保存文件
    function handleConfirm() {
      if (props.isCustomBody) {
        _getAvatarByAI();
      } else {
        const file = {
          url: props.fileURL,
        };
        context.emit("save", [file]);
      }
    }

    async function _getAvatarByAI() {
      state.loadingVisible = true;
      try {
        state.loadingState = "pending";
        state.loadingPendingText = "AI Cropping your photo";
        const avatarList = await getAIAvatar(props.fileURL);
        state.loadingState = "success";
        setTimeout(() => {
          context.emit("save", avatarList);
        }, 1500);
      } catch {
        state.loadingState = "error";
      } finally {
        setTimeout(() => {
          state.loadingVisible = false;
        }, 1500);
      }
    }

    // 取消
    function handleBack() {
      context.emit("back", "select");
    }

    return {
      ...toRefs(state),
      pluginText,
      handleCrop,
      handleRotate,
      handleConfirm,
      handleBack,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.image-view {
  @include flex-col-sb;
  height: 100%;
  position: relative;
}
.image-view__top {
  width: 100%;
}
.image-view__medium {
  @include flex-col-sb;
  width: 100%;
  flex: 1;
  background-color: #f2f2f2;
}
.image-view__content {
  @include flex-col-center;
  flex: 1;
  .image-box {
    img {
      display: block;
      width: 300px;
      height: 300px;
      background-color: #333333;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      object-fit: contain;
    }
  }
  .operations {
    @include flex-row-sb;
    padding-top: 20px;
    .item {
      .card {
        display: flex;
        margin: 0 10px;
        padding: 8px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        cursor: pointer;
        position: relative;
      }
    }
  }
  .image-style-tab {
    @include flex-row-center;
    padding-top: 20px;
    .menu {
      @include flex-row-center;
      width: 150px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ffffff;
      color: $theme-color;
      margin: 0;
      font-size: 12px;
      border: 1px solid $theme-color;
      cursor: pointer;
      .price {
        font-weight: 600;
        color: $sub-theme-color;
      }
      &.free {
        text-decoration: line-through;
      }
      &:first-child {
        border-radius: 15px 0 0 15px;
      }
      &:last-child {
        border-radius: 0 15px 15px 0;
      }
      &.active {
        background-color: $theme-color;
        color: #ffffff;
        .price {
          color: currentColor;
        }
      }
    }
  }
}
.image-view__notice {
  padding: 10px;
}
.image-view__bottom {
  width: 100%;
  padding: 10px;
  background-color: #e4e7ed;

  .button-list {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    margin-left: -5px;
    margin-right: -5px;
    .button-item {
      width: 50%;
      padding: 0 5px;
    }
  }
}
</style>