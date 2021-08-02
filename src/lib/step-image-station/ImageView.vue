<template>
  <div class="image-view">
    <div class="image-view__top">
      <base-header mainText="Choose Photos Source" @close="handleClose" />
    </div>
    <div class="image-view__medium">
      <div class="image-view__content">
        <div class="image-box">
          <img :src="fileURL" alt="" />
        </div>
        <ul class="operations">
          <li class="item">
            <div class="card" @click="handleCrop">
              <base-icon icon="cropper" />
            </div>
          </li>
          <li class="item">
            <div class="card" @click="handleRotate(-90)">
              <base-icon icon="rotateLeft" />
            </div>
          </li>
          <li class="item">
            <div class="card" @click="handleRotate(90)">
              <base-icon icon="rotateRight" />
            </div>
          </li>
        </ul>
        <div class="image-style-tab">
          <p
            class="menu"
            @click="handleChangeStyle('normal')"
            :class="{ active: imageStyle === 'normal' }"
          >
            Normal
          </p>
          <p
            class="menu"
            @click="handleChangeStyle('cartoon')"
            :class="{ active: imageStyle === 'cartoon' }"
          >
            Cartoonize + <span class="price">$2.99</span>
          </p>
        </div>
      </div>
      <div class="image-view__notice">
        <base-notice
          >AI image cropping is mainly for preview.NOT FINAL DESIGN! Our
          designer will finalize the perfect fit!</base-notice
        >
      </div>
    </div>
    <div class="image-view__bottom">
      <base-row :gutter="10">
        <base-col :span="12">
          <base-button plain @click="handleBack">Replace</base-button>
        </base-col>
        <base-col :span="12">
          <base-button type="primary" @click="handleAIAvatar" :blod="600">CONFIRM</base-button>
        </base-col>
      </base-row>
    </div>

    <loading-avatar :visible="loadingVisible" :state="loadingState" :loadingPendingText="loadingPendingText"/>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

import BaseHeader from "../../components/BaseHeader.vue";
import BaseButton from "../../components/BaseButton.vue";
import BaseNotice from "../../components/BaseNotice.vue";
import BaseIcon from "../../components/BaseIcon.vue";
import BaseRow from "../../components/BaseRow.vue";
import BaseCol from "../../components/BaseCol.vue";
import LoadingAvatar from "./LoadingAvatar.vue";

import { imageReset } from "../../utils/image";
import { getCartoonURL, getAIAvatar } from "../../api/picart";

export default {
  components: {
    BaseHeader,
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
  },

  emits: {
    close: null,
    back: null,
    rotate: null,
    crop: null,
    cartoonize: null,
    normalize: null,
    setAvatar: null,
  },

  setup(props, context) {
    const state = reactive({
      // 图片风格，normal：普通，cartoon：动漫画
      imageStyle: "normal",
      // 卡通图片
      cartoonFileURL: "",
      // 普通图片
      normalFileURL: "",
      // AI
      loadingVisible: false,
      loadingState: "pending",
      loadingPendingText: ''
    });

    // 裁剪
    function handleCrop() {
      context.emit("crop");
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

    // 修改图片风格
    async function handleChangeStyle(style) {
      state.imageStyle = style;
      if (style === "cartoon") {
        // 已经卡通画了
        if (state.cartoonFileURL) {
          context.emit("cartoonize", state.cartoonFileURL);
        } else {
          // 首次卡通画
          // 首先保存一张普通图片
          state.normalFileURL = props.fileURL;
          // 获取卡通图片
          state.loadingVisible = true;
          try {
            state.loadingState = "pending";
            state.loadingPendingText = 'Cartoonizing';
            state.cartoonFileURL = await getCartoonURL(props.fileURL);
            state.loadingState = "success";
            context.emit("cartoonize", state.cartoonFileURL);
          } catch {
            state.loadingState = "error";
          } finally {
            setTimeout(() => {
              state.loadingVisible = false;
            }, 1500);
          }
        }
      } else {
        context.emit("normalize", state.normalFileURL);
      }
    }

    // AI扣头
    async function handleAIAvatar() {
      state.loadingVisible = true;
      try {
        state.loadingState = "pending";
        state.loadingPendingText = 'AI Cropping your photo';
        const avatarList = await getAIAvatar(props.fileURL);
        state.loadingState = "success";
        setTimeout(() => {
          context.emit("setAvatar", avatarList);
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
      context.emit("back");
    }

    function handleClose() {
      context.emit("close");
    }

    return {
      ...toRefs(state),
      handleCrop,
      handleRotate,
      handleChangeStyle,
      handleAIAvatar,
      handleBack,
      handleClose,
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