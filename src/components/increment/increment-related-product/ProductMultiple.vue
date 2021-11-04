<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-11-01 10:45:38
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-11-04 15:46:06
-->
<template>
  <div>
    <h2 class="multiple-product__title">Maybe you like</h2>

    <div class="multiple-product-wrapper">
      <swiper
        :slides-per-view="perView"
        :space-between="10"
        :centered-slides="false"
        @click="handleClick"
      >
        <swiper-slide v-for="(item, index) in list" :key="index">
          <div class="related-product__card">
            <img class="related-product__bg" :src="item.url" alt="" />
            <p class="related-product__price">{{ item.price }}</p>
            <p class="related-product__text">{{ item.title }}</p>
            <div class="check-icon">
              <base-icon
                icon="check"
                :size="24"
                :color="getColor(item.id)"
              ></base-icon>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div class="add-to-cart">
      <div class="item">
        <div class="divider">
          <span class="text">selected products: {{ checkedList.length }}</span>
        </div>
      </div>
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
import { nextTick, computed } from "vue";

import BaseButton from "../../../base/BaseButton.vue";
import BaseIcon from "../../../base/BaseIcon.vue";

import { Swiper, SwiperSlide } from "swiper/swiper-vue.esm";
// Import Swiper styles
import "swiper/swiper.scss";

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  checkedList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["next"]);

const perView = computed(() => {
  return props.list && props.list.length > 2 ? 2.3 : 2;
});

// 点击商品
function handleClick(swiper) {
  const index = swiper.clickedIndex;
  if (index === undefined) {
    return;
  }

  const id = props.list[index].id;
  if (hasID(id)) {
    removeID(id);
  } else {
    addID(id);
  }
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

// 清空
function clearID() {
  for (let i = props.checkedList.length; i >= 0; i--) {
    props.checkedList.splice(i);
  }
}

// 获取颜色
function getColor(itemID) {
  return props.checkedList.includes(itemID) ? "#67C23A" : "#ffffff";
}

// 保存
async function handleSave(flag) {
  if (flag) {
    emit("next");
  } else {
    clearID();
    await nextTick();
    emit("next");
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.multiple-product-wrapper {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 30px;
  padding-bottom: 20px;
  position: relative;
}

.multiple-product__title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #333333;
  width: 50%;
  margin: 0 auto;
  padding-top: 30px;
}

.related-product__card {
  position: relative;
  cursor: pointer;
  .related-product__bg {
    display: block;
    line-height: 1;
    border-radius: 4px;
  }

  .related-product__price {
    padding-top: 5px;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    color: $theme-color;
    margin: 0;
  }
  .related-product__text {
    padding-top: 5px;
    font-size: 12px;
    line-height: 1.4;
    color: #666666;
    margin: 0;
  }
  .check-icon {
    @include pos-absolute(5px, 5px, auto, auto, 1000);
    @include flex-row-center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid #ffffff;
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