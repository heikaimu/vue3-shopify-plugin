<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-11-01 10:45:12
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-11-01 15:51:06
-->
<template>
  <div>
    <div class="product-wrapper">
      <div class="single-product-card">
        <img class="single-product__img" :src="data.url" alt="" srcset="" />
        <p class="single-product__title">
          {{ data.title }}
        </p>
        <p class="single-product__price">+ ${{ data.price }}</p>
      </div>
    </div>

    <div class="add-to-cart">
      <div class="item">
        <base-button
          type="primary"
          size="large"
          @click="handleSave(true)"
          id="button_add_to_cart_3"
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
          @click="handleSave(false)"
          id="button_add_to_cart_4"
          >No Thanks & Add To Cart</base-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick } from "vue";

import BaseButton from "../../../base/BaseButton.vue";
import BaseIcon from "../../../base/BaseIcon.vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  checkedList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["next", "change"]);

async function handleSave(flag) {
  if (flag) {
    addID(props.data.id);
  } else {
    removeID(props.data.id);
  }
  await nextTick();
  emit("next");
}

// 是否有该ID
function hasID(newID) {
  return props.checkedList.find((id) => id === newID);
}

// 添加ID
function addID(newID) {
  if (hasID(newID)) {
    return;
  }

  props.checkedList.push(newID);
}

// 删除ID
function removeID(newID) {
  const index = props.checkedList.findIndex((id) => id === newID);
  if (index === -1) {
    return;
  }

  props.checkedList.splice(index, 1);
}

</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

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
</style>