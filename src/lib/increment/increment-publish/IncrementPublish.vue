<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-08 16:27:20
-->
<template>
  <div class="increment-wrapper">
    <div class="increment-blank" @click="handleClose"></div>
    <div class="increment-publish">
      <span class="close-icon">
        <base-icon icon="close" @click="handleClose" />
      </span>

      <div class="text-wrapper">
        <div class="text__preview">
          <img v-if="currentItem.url" class="img" :src="currentItem.url" alt="" srcset="" />
        </div>
        <p class="desc">{{ currentItem.desc }}</p>
        <p class="add-price">{{ currentPrice }}</p>
      </div>
      <div class="add-to-cart">
        <div class="item">
          <base-button type="primary" size="large" @click="handleNext(true)" id="button_add_to_cart_7"
            >Sure & Next</base-button
          >
        </div>
        <div class="item">
          <div class="divider">
            <span class="text">or</span>
          </div>
        </div>
        <div class="item">
          <base-button
            type="primary"
            size="large"
            plain
            @click="handleNext(false)"
            id="button_add_to_cart_8"
            >No Thanks & Next</base-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, toRaw, onMounted, watch } from "vue";

import BaseNotice from "../../../base/BaseNotice.vue";
import BaseButton from "../../../base/BaseButton.vue";
import BaseIcon from "../../../base/BaseIcon.vue";

import { publishSKU } from "../../../utils/productSKU";
import { number } from "../../../utils/number";

export default {
  components: {
    BaseNotice,
    BaseButton,
    BaseIcon,
  },

  props: {
    data: {
      type: Object,
      default: () => {},
    },
    skuList: {
      type: Array,
      default: () => [],
    },
    productOptionsValue: {
      type: Object,
      default: () => {},
    },
  },

  emits: {
    change: null,
    close: null,
    next: null,
  },

  setup(props, context) {
    const state = reactive({
      publishQueue: [],
      queueIndex: -1,
    });

    // 判断有哪些属性需要推荐
    onMounted(() => {
      state.publishQueue = props.data
        .map((item) => {
          const sku = publishSKU(
            props.skuList,
            item.key,
            props.productOptionsValue,
            item.publishName
          );
          return {
            ...item,
            sku,
          };
        })
        .filter((item) => item.sku);

      if (state.publishQueue.length === 0) {
        context.emit("next");
        return;
      }

      state.queueIndex = 0;
    });

    // 当前推荐属性
    const currentItem = computed(() => {
      if (state.queueIndex === -1) {
        return false;
      }

      if (state.publishQueue.length === 0) {
        return false;
      }

      return state.publishQueue[state.queueIndex] || false;
    });

    // 当前价格
    const currentPrice = computed(() => {
      if (!currentItem.value) {
        return "";
      }

      return `+ $${number(currentItem.value.sku.addPrice / 100, 2)}`;
    });

    // 关闭
    function handleClose() {
      context.emit("close");
    }

    // 前往下一步
    function handleNext(flag) {
      if (flag) {
        context.emit("change", currentItem.value);
      }

      if (state.queueIndex < state.publishQueue.length - 1) {
        state.queueIndex += 1;
        return;
      }

      context.emit("next");
    }

    return {
      ...toRefs(state),
      currentItem,
      currentPrice,
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

  .increment-publish {
    @include pos-absolute(auto, 0, 0, 0, 1002);
    border-radius: 10px 10px 0 0;
    background-color: #ffffff;

    .close-icon {
      @include pos-absolute(20px, auto, auto, 20px, 1004);
      cursor: pointer;
    }

    .text-wrapper {
      padding: 140px 20px 20px 20px;
      .text__preview {
        @include flex-col-center;
        @include pos-absolute(-120px, auto, auto, 50%, 1003);
        transform: translate3d(-50%, 0, 0);
        width: 100%;
        height: 240px;
        .img {
          @include card-shadow-lg;
          display: block;
          width: 240px;
          height: 240px;
          object-fit: contain;
          padding: 2px;
          background: #fff;
          border-radius: 10px;
        }
      }
      .add-price {
        width: 100%;
        text-align: center;
        font-size: 16px;
        font-weight: 700;
        color: $theme-color;
      }
      .desc {
        padding: 0 20px 10px 20px;
        font-size: 18px;
        line-height: 1.6;
        color: $title-color;
        text-align: center;
        margin-bottom: 0;
      }
    }

    .add-to-cart {
      padding: 0 20px 20px 20px;
      .item {
        & + .item {
          margin-top: 10px;
        }
        .divider {
          @include flex-row-center;
          width: 100%;
          .text {
            @include flex-row-center;
            font-size: 14px;
            font-weight: 600;
            color: $context-color;
            &::after,
            &::before {
              display: block;
              content: "";
              width: 60px;
              height: 1px;
              background-color: currentColor;
              margin: 0 5px;
            }
          }
        }
      }
    }
  }
}
</style>