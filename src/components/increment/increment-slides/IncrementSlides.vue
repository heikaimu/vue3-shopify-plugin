<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-11-09 13:26:13
-->
<template>
  <div class="increment-wrapper">
    <div class="increment-blank" @click="handleClose"></div>
    <div class="increment-slides">
      <span class="close-icon">
        <base-icon icon="close" @click="handleClose" id="icon_close_1"/>
      </span>
      <div class="preview-image">
        <img :src="customBodyPreviewURL" alt="" />
      </div>
      <p class="custom-title">Print back side？<br/>
add your design mirrored on back side for only <strong>+{{dollarSign}}5.00</strong></p>
      <div class="slides-selector">
        <div
          v-for="(item, index) in data"
          :id="`button_slide_${value}`"
          class="slides-selector__item"
          :class="{ active: item.value === value }"
          :key="index"
          @click="handleSelect(item)"
        >
          <span class="text">{{ item.title }}</span>
          <span class="price" v-if="item.price">+{{dollarSign}}{{ item.price }}</span>
          <span class="icon" v-if="item.active">
            <base-icon icon="check" color="#ff533a" />
          </span>
        </div>
      </div>
      <div class="add-to-cart">
        <base-button type="primary" size="large" @click="handleNext" id="button_add_to_cart_1"
          >Add To Cart</base-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";

import BaseButton from "../../../base/BaseButton.vue";
import BaseIcon from "../../../base/BaseIcon.vue";

export default {
  components: {
    BaseButton,
    BaseIcon,
  },

  props: {
    customBodyPreviewURL: {
      type: String,
      default: "",
    },
    data: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: "",
    },
    dollarSign: {
      type: String
    }
  },

  emits: {
    change: null,
    close: null,
    next: null,
  },

  setup(props, context) {
    const state = reactive({});

    // 选择面
    function handleSelect(item) {
      context.emit("change", item.value);
    }

    // 关闭
    function handleClose() {
      context.emit("close");
    }

    // 前往下一步
    function handleNext() {
      context.emit("next");
    }

    return {
      ...toRefs(state),
      handleSelect,
      handleClose,
      handleNext,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.increment-wrapper {
  @include pos-absolute(0, 0, 0, 0, 1000);
  .increment-blank {
    @include glass;
    @include pos-absolute(0, 0, 0, 0, 1001);
    cursor: pointer;
  }

  .increment-slides {
    @include pos-absolute(auto, 0, 0, 0, 1002);
    border-radius: 10px 10px 0 0;
    background-color: #ffffff;

    .close-icon {
      @include pos-absolute(20px, auto, auto, 20px, 1003);
      cursor: pointer;
    }

    .preview-image {
      @include flex-row-center;
      width: 100%;
      height: 200px;
      img {
        width: 180px;
        height: 180px;
        object-fit: contain;
      }
    }

    .custom-title {
      padding: 0 10px 10px 10px;
      text-align: center;
      font-size: 15px;
      color: $title-color;
      strong {
        font-weight: 600;
        color: $theme-color;
      }
    }

    .slides-selector {
      padding: 20px;
      .slides-selector__item {
        width: 100%;
        padding: 20px 0;
        border-radius: 6px;
        box-shadow: 0 0 0 1px $theme-color;
        text-align: center;
        cursor: pointer;
        position: relative;
        & + .slides-selector__item {
          margin-top: 15px;
        }

        .text {
          font-size: 16px;
          color: $theme-color;
        }
        .price {
          @include pos-absolute(-13px, auto, auto, 50%);
          transform: translateX(-50%);
          font-size: 12px;
          font-weight: 700;
          padding: 5px 10px;
          color: $theme-color;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 0 0 1px $theme-color;
        }
        .icon {
          @include pos-absolute(50%, 20px, auto, auto);
          transform: translate3d(0, -50%, 0);
        }

        &.active {
          background-color: rgba(255, 83, 58, 0.1);
          box-shadow: 0 0 0 2px $theme-color;
          .text {
            font-weight: 600;
          }
        }
      }
    }

    .add-to-cart {
      padding: 0 20px 20px 20px;
    }
  }
}
</style>