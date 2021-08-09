<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-06 13:40:13
-->
<template>
  <div class="increment-wrapper">
    <div class="increment-blank" @click="handleClose"></div>
    <div class="increment-related-product">
      <span class="close-icon">
        <base-icon icon="close" @click="handleClose" />
      </span>

      <div class="product-wrapper">
        <div class="single-product-card" v-if="isSingle">
          <img
            class="single-product__img"
            :src="product.url"
            alt=""
            srcset=""
          />
          <p class="single-product__title">
            Would You Like To Add A Same Design Doll Keychain?
          </p>
          <p class="single-product__price">+ ${{ product.price }}</p>
        </div>
      </div>

      <div class="add-to-cart">
        <div class="item">
          <base-button type="primary" size="large" @click="handleNext(true)"
            >Sure & Add To Cart</base-button
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
            >No Thanks & Add To Cart</base-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, toRaw, onMounted, nextTick } from "vue";

import BaseButton from "../../../components/BaseButton.vue";
import BaseIcon from "../../../components/BaseIcon.vue";

export default {
  components: {
    BaseButton,
    BaseIcon,
  },

  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },

  emits: {
    change: null,
    close: null,
    next: null,
  },

  setup(props, context) {
    const state = reactive({
      isSingle: false,
      product: {},
    });

    onMounted(async () => {
      state.isSingle = props.data.length === 1;
      await nextTick();
      if (state.isSingle) {
        state.product = props.data[0];
      } else {
        state.product = null;
      }
    });

    // 关闭
    function handleClose() {
      context.emit("close");
    }

    // 前往下一步
    function handleNext(flag) {
      if (flag) {
        context.emit("change", [state.product.id]);
      } else {
        context.emit("change", []);
      }
      context.emit("next");
    }

    return {
      ...toRefs(state),
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

  .increment-related-product {
    @include pos-absolute(auto, 0, 0, 0, 1002);
    border-radius: 10px 10px 0 0;
    background-color: #ffffff;

    .close-icon {
      @include pos-absolute(20px, auto, auto, 20px, 1004);
      cursor: pointer;
    }

    .product-wrapper {
      height: 250px;
      position: relative;
      .single-product-card {
        width: 100%;
        @include flex-col-center;
        @include pos-absolute(-120px, auto, auto, 50%, 1003);
        transform: translate3d(-50%, 0, 0);
        .single-product__img {
          @include card-shadow-lg;
          display: block;
          width: 240px;
          height: 240px;
          padding: 2px;
          background: #fff;
          border-radius: 10px;
        }
        .single-product__title {
          padding: 20px 20px 10px 20px;
          font-size: 18px;
          line-height: 1.6;
          color: $title-color;
          text-align: center;
          margin-bottom: 0;
        }
        .single-product__price {
          font-size: 16px;
          color: $theme-color;
          font-weight: 600;
        }
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